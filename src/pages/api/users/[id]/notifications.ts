import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import authOptions from '../../auth/[...nextauth]';
import { getUserNotifications } from '../../../lib/notifications';
import type { Session } from 'next-auth';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = (await getServerSession(
		req,
		res,
		authOptions
	)) as Session | null;
	const { id } = req.query;
	if (
		!session ||
		!session.user ||
		(session.user as any).id !== id
	) {
		return res
			.status(401)
			.json({ error: 'Not authenticated' });
	}
	try {
		const notifications = await getUserNotifications(
			id as string
		);
		res.status(200).json(notifications);
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Failed to fetch notifications' });
	}
}
