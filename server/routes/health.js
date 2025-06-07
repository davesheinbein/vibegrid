// /server/routes/health.js
const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET /api/health - Basic backend health
router.get('/', (req, res) => {
	res.json({
		ok: true,
		uptime: process.uptime(),
		env: process.env.NODE_ENV,
		version: require('../../package.json').version,
		timestamp: new Date().toISOString(),
	});
});

// GET /api/health/db - Database health and stats
router.get('/db', async (req, res) => {
	try {
		// Check connection and key tables
		const userCount = await prisma.user.count();
		const puzzleCount = await prisma.puzzle.count();
		const matchCount = await prisma.match.count();
		const achievementCount =
			await prisma.achievement.count();
		// List all tables (models)
		const tables = [
			'User',
			'Puzzle',
			'Match',
			'Achievement',
			'UserAchievement',
			'Friend',
			'FriendRequest',
			'GroupChat',
			'GroupMember',
			'Message',
			'Notification',
		];
		res.json({
			ok: true,
			tables,
			userCount,
			puzzleCount,
			matchCount,
			achievementCount,
			timestamp: new Date().toISOString(),
		});
	} catch (e) {
		res.status(500).json({ ok: false, error: e.message });
	}
});

module.exports = router;
