import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

// Mock: User progression (XP, level, streaks)
const MOCK_USER_PROGRESSION: Record<string, any> = {
	'1': { xp: 1200, level: 5, dailyStreak: 7 },
	'2': { xp: 800, level: 3, dailyStreak: 2 },
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
	const progression = MOCK_USER_PROGRESSION[id] || {
		xp: 0,
		level: 1,
		dailyStreak: 0,
	};
	res.status(200).json(progression);
}
