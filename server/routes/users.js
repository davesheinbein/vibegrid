const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET /api/users/:id - Get user profile
router.get('/:id', async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.params.id },
			select: {
				id: true,
				username: true,
				email: true,
				photoUrl: true,
				createdAt: true,
				lastActive: true,
				stats: true,
				isAdmin: true,
			},
		});
		if (!user)
			return res
				.status(404)
				.json({ error: 'User not found' });
		res.json(user);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch user' });
	}
});

// PUT /api/users/:id - Update user profile
router.put('/:id', async (req, res) => {
	try {
		const { username, photoUrl, stats } = req.body;
		// TODO: Add authentication/authorization check
		const updated = await prisma.user.update({
			where: { id: req.params.id },
			data: { username, photoUrl, stats },
		});
		res.json(updated);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to update user' });
	}
});

// GET /api/users/:id/achievements - Get user achievements
router.get('/:id/achievements', async (req, res) => {
	try {
		const achievements =
			await prisma.userAchievement.findMany({
				where: { userId: req.params.id },
				include: { achievement: true },
				orderBy: { unlockedAt: 'desc' },
			});
		res.json(achievements);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch achievements' });
	}
});

// GET /api/users/:id/stats - Get user stats
router.get('/:id/stats', async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.params.id },
			select: { stats: true },
		});
		if (!user)
			return res
				.status(404)
				.json({ error: 'User not found' });
		res.json(user.stats || {});
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch stats' });
	}
});

// GET /api/users/:id/tutorial - Get tutorial completion state
router.get('/:id/tutorial', async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.params.id },
			select: { tutorialCompleted: true },
		});
		res.json({
			tutorialCompleted: user?.tutorialCompleted || false,
		});
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch tutorial state' });
	}
});

// POST /api/users/:id/tutorial - Mark tutorial as completed
router.post('/:id/tutorial', async (req, res) => {
	try {
		const user = await prisma.user.update({
			where: { id: req.params.id },
			data: { tutorialCompleted: true },
		});
		res.json({ tutorialCompleted: user.tutorialCompleted });
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to update tutorial state' });
	}
});

module.exports = router;
