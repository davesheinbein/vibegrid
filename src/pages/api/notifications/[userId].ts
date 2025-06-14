import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../server/prismaClient';
import { getSessionUserId } from '../../lib/auth';

// GET /api/notifications/[userId] - Get notifications for user
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { userId } = req.query;
	if (req.method === 'GET') {
		try {
			// Only allow user to fetch their own notifications
			const sessionUserId = await getSessionUserId(
				req,
				res
			);
			if (!sessionUserId || sessionUserId !== userId) {
				return res
					.status(403)
					.json({ error: 'Unauthorized' });
			}
			const notifications =
				await prisma.notification.findMany({
					where: { userId: String(userId) },
					orderBy: { createdAt: 'desc' },
					take: 100,
				});
			res.json(notifications);
		} catch (err) {
			res
				.status(500)
				.json({ error: 'Failed to fetch notifications' });
		}
	} else {
		res.setHeader('Allow', ['GET']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
