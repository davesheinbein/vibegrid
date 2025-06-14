import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/server/prismaClient';
import { checkAchievements } from '@/lib/achievements';

// POST: /api/chat/group/[groupId] (send group message)
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST']);
		return res.status(405).end('Method Not Allowed');
	}
	const { groupId } = req.query;
	const { senderId, content } = req.body;
	if (!groupId || !senderId || !content)
		return res
			.status(400)
			.json({ error: 'Missing fields' });
	try {
		const message = await prisma.message.create({
			data: {
				senderId,
				groupId: String(groupId),
				content,
				sentAt: new Date(),
			},
		});
		await checkAchievements({
			userId: senderId,
			event: 'group_message_sent',
			eventData: { groupId },
		});
		res.json(message);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to send group message' });
	}
}
