import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../server/prismaClient';

// Platform-wide leaderboard rankings
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
		// Fetch top users by XP (or another stat if available)
		const leaderboard = await prisma.user.findMany({
			orderBy: { xp: 'desc' },
			select: { id: true, username: true, xp: true },
			take: 100,
		});
		// Add rank field
		const ranked = leaderboard.map((user, idx) => ({
			rank: idx + 1,
			user: user.username || user.id,
			xp: user.xp,
			id: user.id,
		}));
		res.status(200).json(ranked);
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Failed to fetch leaderboard' });
	}
}
