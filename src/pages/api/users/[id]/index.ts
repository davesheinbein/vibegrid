import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

// Mock: General user data by ID
const MOCK_USERS: Record<string, any> = {
	'1': {
		id: '1',
		name: 'Alice',
		email: 'alice@example.com',
		avatar: '/avatars/alice.png',
	},
	'2': {
		id: '2',
		name: 'Bob',
		email: 'bob@example.com',
		avatar: '/avatars/bob.png',
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
	const user = MOCK_USERS[id];
	if (!user) {
		res.status(404).json({ error: 'User not found' });
		return;
	}
	res.status(200).json(user);
}
