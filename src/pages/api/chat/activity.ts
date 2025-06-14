import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/server/prismaClient';

// GET: /api/chat/activity?userId=...
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'GET') {
		res.setHeader('Allow', ['GET']);
		return res.status(405).end('Method Not Allowed');
	}
	const { userId } = req.query;
	if (!userId)
		return res
			.status(400)
			.json({ error: 'Missing userId' });
	try {
		const messages = await prisma.message.findMany({
			where: { senderId: String(userId) },
			orderBy: { sentAt: 'desc' },
			take: 20,
		});
		res.json({ messages });
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch activity feed' });
	}
}
