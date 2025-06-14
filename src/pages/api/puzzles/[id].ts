import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../server/prismaClient';

// GET /api/puzzles/[id] - Get puzzle by id
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { id } = req.query;
	if (req.method === 'GET') {
		try {
			const puzzle = await prisma.puzzle.findUnique({
				where: { id: String(id) },
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
	} else {
		res.setHeader('Allow', ['GET']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
