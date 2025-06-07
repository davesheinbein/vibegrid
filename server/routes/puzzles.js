const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const axios = require('axios');
const API_URL =
	process.env.API_URL ||
	'http://localhost:3000/api/achievements/check';

// Helper to trigger achievement check
async function checkAchievements({
	userId,
	event,
	stats = null,
	eventData = null,
}) {
	try {
		await axios.post(API_URL, {
			userId,
			event,
			stats,
			eventData,
		});
	} catch (e) {
		// Log but don't block user flow
		console.error('Achievement check failed:', e.message);
	}
}

// GET /api/puzzles - List all puzzles (optionally filter by author, isDaily, etc)
router.get('/', async (req, res) => {
	try {
		const { authorId, isDaily } = req.query;
		const where = {};
		if (authorId) where.authorId = authorId;
		if (isDaily !== undefined)
			where.isDaily = isDaily === 'true';
		const puzzles = await prisma.puzzle.findMany({
			where,
			orderBy: { createdAt: 'desc' },
		});
		res.json(puzzles);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch puzzles' });
	}
});

// GET /api/puzzles/:id - Get puzzle by id
router.get('/:id', async (req, res) => {
	try {
		const puzzle = await prisma.puzzle.findUnique({
			where: { id: req.params.id },
		});
		if (!puzzle)
			return res
				.status(404)
				.json({ error: 'Puzzle not found' });
		res.json(puzzle);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch puzzle' });
	}
});

// POST /api/puzzles - Create a new puzzle
router.post('/', async (req, res) => {
	try {
		const {
			title,
			authorId,
			groups,
			wildcards,
			isDaily,
			date,
		} = req.body;
		const puzzle = await prisma.puzzle.create({
			data: {
				title,
				authorId,
				groups,
				wildcards,
				isDaily,
				date,
			},
		});
		// Achievement: custom puzzle created
		if (!isDaily && authorId) {
			await checkAchievements({
				userId: authorId,
				event: 'custom_puzzle_created',
			});
		}
		res.json(puzzle);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to create puzzle' });
	}
});

// PUT /api/puzzles/:id - Update puzzle
router.put('/:id', async (req, res) => {
	try {
		const { title, groups, wildcards, isDaily, date } =
			req.body;
		const puzzle = await prisma.puzzle.update({
			where: { id: req.params.id },
			data: { title, groups, wildcards, isDaily, date },
		});
		res.json(puzzle);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to update puzzle' });
	}
});

// --- COMMUNITY PUZZLE HUB ENDPOINTS ---

// POST /api/puzzles/:id/rate - Rate a puzzle
router.post('/:id/rate', async (req, res) => {
	const { id } = req.params;
	const { userId, rating } = req.body;
	if (
		!userId ||
		typeof rating !== 'number' ||
		rating < 1 ||
		rating > 5
	) {
		return res
			.status(400)
			.json({ error: 'Invalid rating or user' });
	}
	try {
		const existing = await prisma.puzzleRating.findFirst({
			where: { userId, puzzleId: id },
		});
		let result;
		if (existing) {
			result = await prisma.puzzleRating.update({
				where: { id: existing.id },
				data: { rating },
			});
		} else {
			result = await prisma.puzzleRating.create({
				data: { userId, puzzleId: id, rating },
			});
		}
		await checkAchievements({
			userId,
			event: 'puzzle_rated',
			eventData: { puzzleId: id, rating },
		});
		res.json(result);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to rate puzzle' });
	}
});

// POST /api/puzzles/:id/comment - Comment on a puzzle
router.post('/:id/comment', async (req, res) => {
	const { id } = req.params;
	const { userId, comment } = req.body;
	if (!userId || !comment || comment.length < 1) {
		return res
			.status(400)
			.json({ error: 'Invalid comment or user' });
	}
	try {
		const result = await prisma.puzzleComment.create({
			data: { userId, puzzleId: id, comment },
		});
		await checkAchievements({
			userId,
			event: 'puzzle_commented',
			eventData: { puzzleId: id },
		});
		res.json(result);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to comment on puzzle' });
	}
});

// GET /api/puzzles/:id/ratings - Get all ratings for a puzzle
router.get('/:id/ratings', async (req, res) => {
	try {
		const ratings = await prisma.puzzleRating.findMany({
			where: { puzzleId: req.params.id },
		});
		res.json(ratings);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch ratings' });
	}
});

// GET /api/puzzles/:id/comments - Get all comments for a puzzle
router.get('/:id/comments', async (req, res) => {
	try {
		const comments = await prisma.puzzleComment.findMany({
			where: { puzzleId: req.params.id },
			orderBy: { createdAt: 'desc' },
			include: {
				user: { select: { id: true, username: true } },
			},
		});
		res.json(comments);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch comments' });
	}
});

// GET /api/puzzles/top - Get top-rated puzzles (community)
router.get('/top', async (req, res) => {
	try {
		const puzzles = await prisma.puzzle.findMany({
			where: { isCommunity: true },
			orderBy: [
				{ avgRating: 'desc' },
				{ createdAt: 'desc' },
			],
			take: 20,
		});
		res.json(puzzles);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch top puzzles' });
	}
});

// GET /api/puzzles/featured - Get featured puzzles (curated)
router.get('/featured', async (req, res) => {
	try {
		const puzzles = await prisma.puzzle.findMany({
			where: { isFeatured: true },
			orderBy: { createdAt: 'desc' },
			take: 10,
		});
		res.json(puzzles);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch featured puzzles' });
	}
});

module.exports = router;
