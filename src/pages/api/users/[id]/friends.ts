import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

// Mock: User friends and requests
const MOCK_USER_FRIENDS: Record<string, any> = {
	'1': {
		friends: ['2'],
		incomingRequests: [],
		sentRequests: ['3'],
	},
	'2': {
		friends: ['1'],
		incomingRequests: ['3'],
		sentRequests: [],
	},
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
	const data = MOCK_USER_FRIENDS[id] || {
		friends: [],
		incomingRequests: [],
		sentRequests: [],
	};
	res.status(200).json(data);
}
