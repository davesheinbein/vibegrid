import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

// Mock: User notifications
const MOCK_USER_NOTIFICATIONS: Record<string, any[]> = {
	'1': [
		{
			id: 'n1',
			type: 'achievement',
			message: 'You unlocked First Solve!',
			read: false,
			date: '2025-06-10',
		},
		{
			id: 'n2',
			type: 'system',
			message: 'Welcome to Grid Royale!',
			read: true,
			date: '2025-06-09',
		},
	],
	'2': [
		{
			id: 'n3',
			type: 'friend',
			message: 'Bob sent you a friend request.',
			read: false,
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
	const notifications = MOCK_USER_NOTIFICATIONS[id] || [];
	res.status(200).json(notifications);
}
