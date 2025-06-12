import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

// Mock: User match history
const MOCK_USER_MATCHES: Record<string, any[]> = {
	'1': [
		{
			matchId: 'm1',
			opponent: '2',
			result: 'win',
			date: '2025-06-10',
		},
		{
			matchId: 'm2',
			opponent: '3',
			result: 'loss',
			date: '2025-06-09',
		},
	],
	'2': [
		{
			matchId: 'm1',
			opponent: '1',
			result: 'loss',
			date: '2025-06-10',
		},
	],
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
	const matches = MOCK_USER_MATCHES[id] || [];
	res.status(200).json(matches);
}
