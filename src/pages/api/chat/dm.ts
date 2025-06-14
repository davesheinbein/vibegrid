import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/server/prismaClient';
import { checkAchievements } from '@/lib/achievements';

// GET: /api/chat/dm?userId=...&otherUserId=...
// POST: /api/chat/dm
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		const { userId, otherUserId } = req.query;
		if (!userId || !otherUserId)
			return res
				.status(400)
				.json({ error: 'Missing userId or otherUserId' });
		try {
			const messages = await prisma.message.findMany({
				where: {
					OR: [
						{
							senderId: String(userId),
							receiverId: String(otherUserId),
						},
						{
							senderId: String(otherUserId),
							receiverId: String(userId),
						},
					],
				},
				orderBy: { sentAt: 'asc' },
			});
			res.json(messages);
		} catch (err) {
			res
				.status(500)
				.json({ error: 'Failed to fetch DM history' });
		}
	} else if (req.method === 'POST') {
		const { senderId, receiverId, content } = req.body;
		if (!senderId || !receiverId || !content)
			return res
				.status(400)
				.json({ error: 'Missing fields' });
		try {
			const message = await prisma.message.create({
				data: {
					senderId,
					receiverId,
					content,
					sentAt: new Date(),
				},
			});
			await checkAchievements({
				userId: senderId,
				event: 'dm_sent',
				eventData: { receiverId },
			});
			res.json(message);
		} catch (err) {
			res.status(500).json({ error: 'Failed to send DM' });
		}
	} else {
		res.setHeader('Allow', ['GET', 'POST']);
		res.status(405).end('Method Not Allowed');
	}
}
