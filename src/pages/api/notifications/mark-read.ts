import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../server/prismaClient';
import { getSessionUserId } from '../../lib/auth';

// POST /api/notifications/mark-read - Mark notification as read
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		try {
			const sessionUserId = await getSessionUserId(
				req,
				res
			);
			if (!sessionUserId) {
				return res
					.status(403)
					.json({ error: 'Unauthorized' });
			}
			const { notificationId } = req.body;
			// Only allow marking as read if the notification belongs to the user
			const notification =
				await prisma.notification.findUnique({
					where: { id: notificationId },
				});
			if (
				!notification ||
				notification.userId !== sessionUserId
			) {
				return res
					.status(403)
					.json({ error: 'Unauthorized' });
			}
			await prisma.notification.update({
				where: { id: notificationId },
				data: { read: true },
			});
			res.json({ success: true });
		} catch (err) {
			res
				.status(500)
				.json({ error: 'Failed to mark as read' });
		}
	} else {
		res.setHeader('Allow', ['POST']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
