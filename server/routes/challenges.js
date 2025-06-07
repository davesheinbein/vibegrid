const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const {
	checkAchievements,
} = require('../utils/achievements');

// GET /api/challenges/active - Get all active challenges (daily, weekly, etc.)
router.get('/active', async (req, res) => {
	try {
		const now = new Date();
		const challenges = await prisma.challenge.findMany({
			where: {
				startDate: { lte: now },
				endDate: { gte: now },
			},
			orderBy: { startDate: 'asc' },
		});
		res.json(challenges);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch challenges' });
	}
});

// GET /api/challenges/user/:userId - Get user's challenge progress
router.get('/user/:userId', async (req, res) => {
	try {
		const userChallenges =
			await prisma.userChallenge.findMany({
				where: { userId: req.params.userId },
				include: { challenge: true },
				orderBy: { createdAt: 'desc' },
			});
		res.json(userChallenges);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch user challenges' });
	}
});

// POST /api/challenges/:id/complete - Mark a challenge as completed for a user
router.post('/:id/complete', async (req, res) => {
	const { userId } = req.body;
	if (!userId)
		return res
			.status(400)
			.json({ error: 'Missing userId' });
	try {
		const userChallenge = await prisma.userChallenge.update(
			{
				where: {
					userId_challengeId: {
						userId,
						challengeId: req.params.id,
					},
				},
				data: { completed: true, completedAt: new Date() },
			}
		);
		await checkAchievements({
			userId,
			event: 'challenge_completed',
			eventData: { challengeId: req.params.id },
		});
		res.json(userChallenge);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to complete challenge' });
	}
});

// POST /api/challenges/:id/track - Track progress for a challenge (incremental, optional)
router.post('/:id/track', async (req, res) => {
	const { userId, progress } = req.body;
	if (!userId || typeof progress !== 'number')
		return res
			.status(400)
			.json({ error: 'Missing userId or progress' });
	try {
		const userChallenge = await prisma.userChallenge.update(
			{
				where: {
					userId_challengeId: {
						userId,
						challengeId: req.params.id,
					},
				},
				data: { progress },
			}
		);
		res.json(userChallenge);
	} catch (err) {
		res
			.status(500)
			.json({
				error: 'Failed to track challenge progress',
			});
	}
});

module.exports = router;
