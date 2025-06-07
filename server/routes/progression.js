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
	const { amount } = req.body;
	if (typeof amount !== 'number' || amount <= 0)
		return res
			.status(400)
			.json({ error: 'Invalid XP amount' });
	try {
		const user = await prisma.user.update({
			where: { id: req.params.userId },
			data: { xp: { increment: amount } },
		});
		// Level up logic (example: every 1000 XP = 1 level)
		const newLevel = Math.floor(user.xp / 1000) + 1;
		if (newLevel > user.level) {
			await prisma.user.update({
				where: { id: user.id },
				data: { level: newLevel },
			});
			await checkAchievements({
				userId: user.id,
				event: 'level_up',
				eventData: { level: newLevel },
			});
		}
		res.json({ xp: user.xp, level: newLevel });
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
		res.json(unlocked);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to unlock badge' });
	}
});

module.exports = router;
