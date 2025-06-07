const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

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

module.exports = router;
