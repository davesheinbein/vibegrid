// /server/routes/botStats.js
// API endpoints for per-user, per-bot-difficulty VS Bot statistics
const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { getSessionUser } = require('../utils/auth');

// GET /api/bot-stats/:botDifficulty - Get stats for current user and bot difficulty
router.get('/:botDifficulty', async (req, res) => {
	try {
		const user = getSessionUser(req);
		if (!user)
			return res
				.status(401)
				.json({ error: 'Unauthorized' });
		const { botDifficulty } = req.params;
		let stats = await prisma.botStats.findUnique({
			where: {
				userId_botDifficulty: {
					userId: user.id,
					botDifficulty,
				},
			},
		});
		if (!stats) {
			// Initialize with zero values if missing
			stats = await prisma.botStats.create({
				data: {
					userId: user.id,
					botDifficulty,
				},
			});
		}
		res.json(stats);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// POST /api/bot-stats/:botDifficulty - Update stats for current user and bot difficulty
router.post('/:botDifficulty', async (req, res) => {
	try {
		const user = getSessionUser(req);
		if (!user)
			return res
				.status(401)
				.json({ error: 'Unauthorized' });
		const { botDifficulty } = req.params;
		const update = req.body;
		let stats = await prisma.botStats.findUnique({
			where: {
				userId_botDifficulty: {
					userId: user.id,
					botDifficulty,
				},
			},
		});
		if (!stats) {
			stats = await prisma.botStats.create({
				data: {
					userId: user.id,
					botDifficulty,
					...update,
				},
			});
		} else {
			stats = await prisma.botStats.update({
				where: {
					userId_botDifficulty: {
						userId: user.id,
						botDifficulty,
					},
				},
				data: update,
			});
		}
		res.json(stats);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

module.exports = router;
