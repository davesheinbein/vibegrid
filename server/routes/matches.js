const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

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
		res.json(match);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to record match' });
	}
});

module.exports = router;
