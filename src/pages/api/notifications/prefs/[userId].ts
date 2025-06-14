import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../server/prismaClient';
import { getSessionUserId } from '../../../lib/auth';

// GET/PUT /api/notifications/prefs/[userId] - Get or update user notification preferences
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { userId } = req.query;
	const sessionUserId = await getSessionUserId(req, res);
	if (!sessionUserId || sessionUserId !== userId) {
		return res.status(403).json({ error: 'Unauthorized' });
	}

	if (req.method === 'GET') {
		try {
			const user = await prisma.user.findUnique({
				where: { id: String(userId) },
				select: { notificationPrefs: true },
			});
			res.json(user?.notificationPrefs || {});
		} catch (err) {
			res
				.status(500)
				.json({
					error: 'Failed to fetch notification preferences',
				});
		}
	} else if (req.method === 'PUT') {
		try {
			const { notificationPrefs } = req.body;
			const user = await prisma.user.update({
				where: { id: String(userId) },
				data: { notificationPrefs },
				select: { notificationPrefs: true },
			});
			res.json(user.notificationPrefs);
		} catch (err) {
			res
				.status(500)
				.json({
					error:
						'Failed to update notification preferences',
				});
		}
	} else {
		res.setHeader('Allow', ['GET', 'PUT']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
