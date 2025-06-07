const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET /api/analytics/user/:userId - Get user analytics/insights
router.get('/user/:userId', async (req, res) => {
	try {
		// Example: fetch stats, recent matches, challenge progress, etc.
		const user = await prisma.user.findUnique({
			where: { id: req.params.userId },
			select: {
				id: true,
				stats: true,
				xp: true,
				level: true,
			},
		});
		const recentMatches = await prisma.match.findMany({
			where: {
				OR: [
					{ player1Id: req.params.userId },
					{ player2Id: req.params.userId },
				],
			},
			orderBy: { createdAt: 'desc' },
			take: 10,
		});
		res.json({ user, recentMatches });
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch analytics' });
	}
});

// GET /api/analytics/global - Get global analytics/insights
router.get('/global', async (req, res) => {
	try {
		// Example: total users, matches, puzzles, etc.
		const [userCount, matchCount, puzzleCount] =
			await Promise.all([
				prisma.user.count(),
				prisma.match.count(),
				prisma.puzzle.count(),
			]);
		res.json({ userCount, matchCount, puzzleCount });
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch global analytics' });
	}
});

module.exports = router;
