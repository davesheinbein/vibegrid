import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { ACHIEVEMENTS } from '../../../../data/achievementsConfig';

// Mock: In real app, fetch unlocked achievements for user by ID
const MOCK_USER_UNLOCKED: Record<string, string[]> = {
	'1': ['first_solve', 'daily_streak_3'],
	'2': ['first_solve', 'daily_streak_5', 'no_mistakes'],
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
	// Use mock data; in real app, fetch from DB
	const unlockedIds = MOCK_USER_UNLOCKED[id] || [];
	const achievementsWithStatus = ACHIEVEMENTS.map((a) => ({
		...a,
		unlocked: unlockedIds.includes(a.id),
		unlockedAt: unlockedIds.includes(a.id)
			? new Date().toISOString()
			: undefined,
	}));
	res.status(200).json(achievementsWithStatus);
}
