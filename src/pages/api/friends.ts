import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import prisma from '../../server/prismaClient';

// GET: /api/friends - List current user's friends
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'GET') {
		res.setHeader('Allow', ['GET']);
		return res.status(405).end('Method Not Allowed');
	}
	const session = await getServerSession(
		req,
		res,
		authOptions
	);
	const userId =
		(session as any)?.user?.id || (session as any)?.id;
	if (!session || !userId)
		return res.status(401).json({ error: 'Unauthorized' });
	try {
		const friends = await prisma.friend.findMany({
			where: { userId, status: 'accepted' },
			include: {
				friend: {
					select: {
						id: true,
						username: true,
						photoUrl: true,
						lastActive: true,
					},
				},
			},
		});
		res.json(friends.map((f) => f.friend));
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch friends' });
	}
}
