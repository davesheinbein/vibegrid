const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const {
	checkAchievements,
} = require('../utils/achievements');

// GET /api/progression/:userId - Get user XP, level, themes, badges
router.get('/:userId', async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.params.userId },
			select: {
				id: true,
				xp: true,
				level: true,
				UserProfileTheme: true,
				UserProfileBadge: true,
			},
		});
		res.json(user);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch progression' });
	}
});

// POST /api/progression/:userId/xp - Award XP to user (and handle level up)
router.post('/:userId/xp', async (req, res) => {
	const { amount, event } = req.body;
	if (typeof amount !== 'number' || amount <= 0)
		return res
			.status(400)
			.json({ error: 'Invalid XP amount' });
	try {
		const user = await prisma.user.update({
			where: { id: req.params.userId },
			data: { xp: { increment: amount } },
		});
		const newLevel = Math.floor(user.xp / 1000) + 1;
		let leveledUp = false;
		if (newLevel > user.level) {
			await prisma.user.update({
				where: { id: user.id },
				data: { level: newLevel },
			});
			leveledUp = true;
			await checkAchievements({
				userId: user.id,
				event: 'level_up',
				eventData: { level: newLevel },
			});
		}
		if (event) {
			await checkAchievements({
				userId: user.id,
				event,
				eventData: { amount },
			});
		}
		res.json({ xp: user.xp, level: newLevel, leveledUp });
	} catch (err) {
		res.status(500).json({ error: 'Failed to award XP' });
	}
});

// POST /api/progression/:userId/unlock-theme - Unlock a profile theme for user
router.post('/:userId/unlock-theme', async (req, res) => {
	const { theme } = req.body;
	if (!theme)
		return res.status(400).json({ error: 'Missing theme' });
	try {
		const unlocked = await prisma.userProfileTheme.create({
			data: { userId: req.params.userId, theme },
		});
		await checkAchievements({
			userId: req.params.userId,
			event: 'theme_unlocked',
			eventData: { theme },
		});
		res.json(unlocked);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to unlock theme' });
	}
});

// POST /api/progression/:userId/unlock-badge - Unlock a badge for user
router.post('/:userId/unlock-badge', async (req, res) => {
	const { badge } = req.body;
	if (!badge)
		return res.status(400).json({ error: 'Missing badge' });
	try {
		const unlocked = await prisma.userProfileBadge.create({
			data: { userId: req.params.userId, badge },
		});
		await checkAchievements({
			userId: req.params.userId,
			event: 'badge_unlocked',
			eventData: { badge },
		});
		res.json(unlocked);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to unlock badge' });
	}
});

module.exports = router;
