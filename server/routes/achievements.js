// --- Achievements System ---
const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { getSessionUser } = require('../utils/auth');
const { sendPushNotification } = require('../webpush');
const achievementsConfig = require('../achievementsConfig');

// Utility: Sync achievements config to DB (idempotent)
async function syncAchievementsToDB() {
	for (const ach of achievementsConfig) {
		await prisma.achievement.upsert({
			where: { label: ach.label },
			update: {
				description: ach.description,
				icon: ach.icon,
				criteria: ach.criteria,
			},
			create: {
				label: ach.label,
				description: ach.description,
				icon: ach.icon,
				criteria: ach.criteria,
			},
		});
	}
}

// Call this on server start (index.js) or via a script
router.get('/', async (req, res) => {
	try {
		const achievements =
			await prisma.achievement.findMany();
		res.json(achievements);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch achievements' });
	}
});

// GET /api/achievements/user/:userId - List unlocked achievements for a user
router.get('/user/:userId', async (req, res) => {
	try {
		const userAchievements =
			await prisma.userAchievement.findMany({
				where: { userId: req.params.userId },
				include: { achievement: true },
			});
		res.json(userAchievements);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch user achievements' });
	}
});

// POST /api/achievements/unlock - Unlock an achievement for a user
router.post('/unlock', async (req, res) => {
	try {
		const { userId, achievementId } = req.body;
		const already = await prisma.userAchievement.findUnique(
			{
				where: {
					userId_achievementId: { userId, achievementId },
				},
			}
		);
		if (already)
			return res
				.status(200)
				.json({
					unlocked: false,
					message: 'Already unlocked',
				});
		const unlocked = await prisma.userAchievement.create({
			data: { userId, achievementId },
			include: { achievement: true },
		});
		const io = req.app.get('io');
		if (io) io.of('/achievements').to(userId).emit('achievement:unlocked', { achievement: unlocked.achievement });
		const user = await prisma.user.findUnique({ where: { id: userId }, select: { pushSubscription: true } });
		if (user && user.pushSubscription) {
			sendPushNotification(user.pushSubscription, {
				title: 'Achievement Unlocked!',
				body: unlocked.achievement.label,
				icon: '/logo.svg',
			});
		}
		res.json({ unlocked: true, unlocked });
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to unlock achievement' });
	}
});

// Admin-only: Sync achievements config to DB
router.post('/sync', async (req, res) => {
	// TODO: Add admin auth check
	try {
		await syncAchievementsToDB();
		res.json({ success: true });
	} catch (err) {
		res.status(500).json({ error: 'Failed to sync achievements' });
	}
});

// Enhanced criteria check for all achievement types (event, progress, streak, meta, secret)
function meetsCriteria(criteria, event, stats, eventData, unlockedCount, totalAchievements) {
	if (criteria.type === 'event') {
		if (criteria.event !== event) return false;
		if (criteria.seconds && eventData && eventData.seconds) {
			return eventData.seconds <= criteria.seconds;
		}
		if (criteria.rating && eventData && eventData.rating && criteria.raters && eventData.raters) {
			return eventData.rating >= criteria.rating && eventData.raters >= criteria.raters;
		}
		if (criteria.groupsBehind && eventData && eventData.groupsBehind) {
			return eventData.groupsBehind >= criteria.groupsBehind;
		}
		if (criteria.percent && eventData && eventData.percent) {
			return eventData.percent >= criteria.percent;
		}
		if (criteria.withinMinutes && eventData && eventData.minutesSinceRelease !== undefined) {
			return eventData.minutesSinceRelease <= criteria.withinMinutes;
		}
		if (criteria.betweenHours && eventData && eventData.hour !== undefined) {
			const [start, end] = criteria.betweenHours;
			return eventData.hour >= start && eventData.hour < end;
		}
		if (criteria.verified && eventData && eventData.verified !== undefined) {
			return eventData.verified === criteria.verified;
		}
		if (criteria.withinHours && eventData && eventData.withinHours !== undefined) {
			return eventData.withinHours <= criteria.withinHours;
		}
		if (criteria.all && eventData && eventData.allFound) {
			return eventData.allFound === true;
		}
		if (criteria.attempts && eventData && eventData.attempts !== undefined) {
			return eventData.attempts <= criteria.attempts;
		}
		return true;
	}
	if (criteria.type === 'progress' && stats && criteria.key && criteria.target) {
		return stats[criteria.key] >= criteria.target;
	}
	if (criteria.type === 'streak' && stats && criteria.key && criteria.target) {
		return stats[criteria.key] >= criteria.target;
	}
	if (criteria.type === 'meta') {
		if (criteria.unlocked === 'all') {
			return unlockedCount === totalAchievements;
		}
		return unlockedCount >= criteria.unlocked;
	}
	return false;
}

// POST /api/achievements/check - Check and unlock achievements for a user (criteria-based)
router.post('/check', async (req, res) => {
	try {
		const { userId, event, stats, eventData } = req.body;
		const achievements = await prisma.achievement.findMany();
		const userAchievements = await prisma.userAchievement.findMany({
			where: { userId },
		});
		const unlocked = [];
		const unlockedCount = userAchievements.length;
		const totalAchievements = achievements.length;
		const io = req.app.get('io'); // Socket.io instance
		for (const ach of achievements) {
			const already = userAchievements.find(
				(ua) => ua.achievementId === ach.id
			);
			if (already) continue;
			if (meetsCriteria(ach.criteria, event, stats, eventData, unlockedCount, totalAchievements)) {
				const created = await prisma.userAchievement.create({
					data: { userId, achievementId: ach.id },
					include: { achievement: true },
				});
				unlocked.push(created);
				// Emit real-time socket event
				if (io) io.of('/achievements').to(userId).emit('achievement:unlocked', { achievement: created.achievement });
				// Send push notification if user has a subscription
				const user = await prisma.user.findUnique({ where: { id: userId }, select: { pushSubscription: true } });
				if (user && user.pushSubscription) {
					sendPushNotification(user.pushSubscription, {
						title: 'Achievement Unlocked!',
						body: created.achievement.label,
						icon: '/logo.svg',
					});
				}
			}
		}
		// Check meta-achievements after all others
		for (const ach of achievements) {
			if (ach.criteria.type === 'meta') {
				const already = userAchievements.find(
					(ua) => ua.achievementId === ach.id
				);
				if (already) continue;
				if (meetsCriteria(ach.criteria, event, stats, eventData, unlockedCount + unlocked.length, totalAchievements)) {
					const created = await prisma.userAchievement.create({
						data: { userId, achievementId: ach.id },
						include: { achievement: true },
					});
					unlocked.push(created);
					if (io) io.of('/achievements').to(userId).emit('achievement:unlocked', { achievement: created.achievement });
					const user = await prisma.user.findUnique({ where: { id: userId }, select: { pushSubscription: true } });
					if (user && user.pushSubscription) {
						sendPushNotification(user.pushSubscription, {
							title: 'Achievement Unlocked!',
							body: created.achievement.label,
							icon: '/logo.svg',
						});
					}
				}
			}
		}
		res.json({ unlocked });
	} catch (err) {
		res.status(500).json({ error: 'Failed to check achievements' });
	}
});

module.exports = router;
module.exports.syncAchievementsToDB = syncAchievementsToDB;
