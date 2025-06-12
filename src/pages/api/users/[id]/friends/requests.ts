// Mock: User friend requests
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';

const MOCK_USER_FRIEND_REQUESTS: Record<string, any[]> = {
	'1': [
		{
			id: 'req1',
			from: '2',
			to: '1',
			status: 'pending',
			createdAt: new Date().toISOString(),
		},
	],
	'2': [],
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
	const requests = MOCK_USER_FRIEND_REQUESTS[id] || [];
	res.status(200).json(requests);
}
