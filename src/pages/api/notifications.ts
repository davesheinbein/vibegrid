import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../server/prismaClient';

// Broadcast notifications, global message of the day, maintenance alerts
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'GET') {
		res.setHeader('Allow', ['GET']);
		return res
			.status(405)
			.json({ error: 'Method not allowed' });
	}
	try {
		// Fetch global notifications (not user-specific)
		const notifications =
			await prisma.notification.findMany({
				where: { userId: undefined }, // userId is undefined for global notifications
				orderBy: { createdAt: 'desc' },
				take: 20,
			});
		res.status(200).json(notifications);
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Failed to fetch notifications' });
	}
}
