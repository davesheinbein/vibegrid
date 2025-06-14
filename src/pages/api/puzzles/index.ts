import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../server/prismaClient';

// GET /api/puzzles - List all puzzles (optionally filter by author, isDaily, etc)
// POST /api/puzzles - Create a new puzzle
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		try {
			const { authorId, isDaily } = req.query;
			const where: any = {};
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
	} else if (req.method === 'POST') {
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
			res.status(201).json(puzzle);
		} catch (err) {
			res
				.status(500)
				.json({ error: 'Failed to create puzzle' });
		}
	} else {
		res.setHeader('Allow', ['GET', 'POST']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
