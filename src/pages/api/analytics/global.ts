import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../server/prismaClient';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'GET') {
		res.setHeader('Allow', ['GET']);
		return res
			.status(405)
			.json({ error: 'Method not allowed' });
	}
	try {
		const [userCount, matchCount, puzzleCount] =
			await Promise.all([
				prisma.user.count(),
				prisma.match.count(),
				prisma.puzzle.count(),
			]);
		res.json({ userCount, matchCount, puzzleCount });
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch global analytics' });
	}
}
