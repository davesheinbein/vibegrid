import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

// Mock: User stats
const MOCK_USER_STATS: Record<string, any> = {
	'1': { totalGames: 42, winRate: 0.67, fastestTime: 58 },
	'2': { totalGames: 18, winRate: 0.44, fastestTime: 102 },
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerSession(
		req,
		res,
		authOptions
	);
	const { id } = req.query;
	if (
		!session ||
		(session.user && (session.user as any).id !== id)
	) {
		return res
			.status(401)
			.json({ error: 'Not authenticated' });
	}
	if (typeof id !== 'string') {
		res.status(400).json({ error: 'Invalid user id' });
		return;
	}
	const stats = MOCK_USER_STATS[id] || {
		totalGames: 0,
		winRate: 0,
		fastestTime: null,
	};
	res.status(200).json(stats);
}
