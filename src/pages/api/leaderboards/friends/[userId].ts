import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../server/prismaClient';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { userId } = req.query;
	if (req.method !== 'GET') {
		res.setHeader('Allow', ['GET']);
		return res
			.status(405)
			.json({ error: 'Method not allowed' });
	}
	if (!userId || typeof userId !== 'string') {
		return res
			.status(400)
			.json({ error: 'Missing userId' });
	}
	try {
		// Get friend IDs
		const friends = await prisma.friend.findMany({
			where: { userId, status: 'accepted' },
			select: { friendId: true },
		});
		const ids = (friends as { friendId: string }[])
			.map((f) => f.friendId)
			.concat([userId]);
		// Get leaderboard for user and friends
		const top = await prisma.user.findMany({
			where: { id: { in: ids } },
			orderBy: [
				{ stats: { path: ['wins'], sort: 'desc' } },
			],
			select: {
				id: true,
				username: true,
				photoUrl: true,
				stats: true,
			},
		});
		res.json(top);
	} catch (err) {
		res
			.status(500)
			.json({
				error: 'Failed to fetch friends leaderboard',
			});
	}
}
