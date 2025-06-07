const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const axios = require('axios');
const API_URL = process.env.API_URL || 'http://localhost:3000/api/achievements/check';

async function checkAchievements({ userId, event, stats = null, eventData = null }) {
  try {
    await axios.post(API_URL, { userId, event, stats, eventData });
  } catch (e) {
    console.error('Achievement check failed:', e.message);
  }
}

// GET /api/matches/:userId - Get match history for user
router.get('/:userId', async (req, res) => {
	try {
		const matches = await prisma.match.findMany({
			where: {
				OR: [
					{ player1Id: req.params.userId },
					{ player2Id: req.params.userId },
				],
			},
			include: {
				puzzle: true,
				winner: { select: { id: true, username: true } },
			},
			orderBy: { startedAt: 'desc' },
		});
		res.json(matches);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch matches' });
	}
});

// POST /api/matches - Record a finished match
router.post('/', async (req, res) => {
	try {
		const {
			player1Id,
			player2Id,
			puzzleId,
			state,
			winnerId,
			startedAt,
			endedAt,
			eventData, // Optionally pass extra match info for achievements
		} = req.body;
		const match = await prisma.match.create({
			data: {
				player1Id,
				player2Id,
				puzzleId,
				state,
				winnerId,
				startedAt,
				endedAt,
			},
		});
		// Achievement: multiplayer match played/won
		if (winnerId) {
			await checkAchievements({ userId: winnerId, event: 'vs_win', eventData });
		}
		if (player1Id) {
			await checkAchievements({ userId: player1Id, event: 'vs_played', eventData });
		}
		if (player2Id) {
			await checkAchievements({ userId: player2Id, event: 'vs_played', eventData });
		}
		res.json(match);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to record match' });
	}
});

module.exports = router;
