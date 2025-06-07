const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET /api/leaderboards/global - Global leaderboard (top N by wins)
router.get('/global', async (req, res) => {
	try {
		const top = await prisma.user.findMany({
			orderBy: [
				{ stats: { path: ['wins'], sort: 'desc' } },
			],
			select: {
				id: true,
				username: true,
				photoUrl: true,
				stats: true,
			},
			take: 50,
		});
		res.json(top);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch leaderboard' });
	}
});

// GET /api/leaderboards/friends/:userId - Friends leaderboard
router.get('/friends/:userId', async (req, res) => {
	try {
		const userId = req.params.userId;
		const friends = await prisma.friend.findMany({
			where: { userId, status: 'accepted' },
			select: { friendId: true },
		});
		const ids = friends
			.map((f) => f.friendId)
			.concat([userId]);
		const top = await prisma.user.findMany({
			where: { id: { in: ids } },
			orderBy: [
				{ stats: { path: ['wins'], sort: 'desc' } },
			],
			select: {
				id: true,
				username: true,
				photoUrl: true,
				stats: true,
			},
		});
		res.json(top);
	} catch (err) {
		res.status(500).json({
			error: 'Failed to fetch friends leaderboard',
		});
	}
});

// GET /api/leaderboards/season/:seasonId - Get leaderboard for a specific season
router.get('/season/:seasonId', async (req, res) => {
	try {
		const season =
			await prisma.leaderboardSeason.findUnique({
				where: { id: req.params.seasonId },
			});
		if (!season)
			return res
				.status(404)
				.json({ error: 'Season not found' });
		// Example: top users by XP or wins in this season
		const top = await prisma.user.findMany({
			where: { lastSeasonId: req.params.seasonId },
			orderBy: [{ xp: 'desc' }],
			select: {
				id: true,
				username: true,
				photoUrl: true,
				xp: true,
				level: true,
			},
			take: 50,
		});
		res.json({ season, top });
	} catch (err) {
		res
			.status(500)
			.json({
				error: 'Failed to fetch season leaderboard',
			});
	}
});

// POST /api/leaderboards/season/reset - Reset leaderboard for new season (admin only)
router.post('/season/reset', async (req, res) => {
	// TODO: Add admin authentication/authorization
	const { label, startDate, endDate } = req.body;
	if (!label || !startDate || !endDate)
		return res
			.status(400)
			.json({ error: 'Missing season data' });
	try {
		// End current season
		await prisma.leaderboardSeason.updateMany({
			where: { endDate: { gte: new Date() } },
			data: { endDate: new Date() },
		});
		// Create new season
		const season = await prisma.leaderboardSeason.create({
			data: {
				label,
				startDate: new Date(startDate),
				endDate: new Date(endDate),
			},
		});
		// Optionally, snapshot top users for Hall of Fame
		// ...
		res.json(season);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to reset season' });
	}
});

// GET /api/leaderboards/hall-of-fame - Get Hall of Fame (past season winners)
router.get('/hall-of-fame', async (req, res) => {
	try {
		const seasons = await prisma.leaderboardSeason.findMany(
			{
				orderBy: { startDate: 'desc' },
				take: 10,
			}
		);
		res.json(seasons);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch Hall of Fame' });
	}
});

module.exports = router;
