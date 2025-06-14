import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/server/prismaClient';
import { checkAchievements } from '@/lib/achievements';

// GET: /api/chat/group?groupId=...
// POST: /api/chat/group (create group)
// POST: /api/chat/group/[groupId] (send message) will be a separate file
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		const { groupId } = req.query;
		if (!groupId)
			return res
				.status(400)
				.json({ error: 'Missing groupId' });
		try {
			const messages = await prisma.message.findMany({
				where: { groupId: String(groupId) },
				orderBy: { sentAt: 'asc' },
			});
			res.json(messages);
		} catch (err) {
			res
				.status(500)
				.json({
					error: 'Failed to fetch group chat history',
				});
		}
	} else if (req.method === 'POST') {
		const { name, createdById, memberIds } = req.body;
		if (!name || !createdById || !Array.isArray(memberIds))
			return res
				.status(400)
				.json({ error: 'Missing fields' });
		try {
			const group = await prisma.groupChat.create({
				data: {
					name,
					createdById,
					members: {
						create: memberIds.map((userId: string) => ({
							userId,
						})),
					},
				},
				include: { members: true },
			});
			await checkAchievements({
				userId: createdById,
				event: 'group_chat_created',
			});
			res.json(group);
		} catch (err) {
			res
				.status(500)
				.json({ error: 'Failed to create group chat' });
		}
	} else {
		res.setHeader('Allow', ['GET', 'POST']);
		res.status(405).end('Method Not Allowed');
	}
}
