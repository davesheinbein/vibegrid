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
		res
			.status(500)
			.json({
				error: 'Failed to fetch friends leaderboard',
			});
	}
});

module.exports = router;
