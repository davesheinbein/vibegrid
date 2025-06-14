// Mock: User friend requests
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';
import prisma from '../../../../server/prismaClient';

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
	const { id } = req.query;
	if (
		!session ||
		(session.user && (session.user as any).id !== id)
	) {
		return res
			.status(401)
			.json({ error: 'Not authenticated' });
	}
	if (typeof id !== 'string') {
		res.status(400).json({ error: 'Invalid user id' });
		return;
	}
	try {
		const requests = await prisma.friendRequest.findMany({
			where: { toUserId: id, status: 'pending' },
			include: {
				fromUser: {
					select: {
						id: true,
						username: true,
						photoUrl: true,
					},
				},
			},
		});
		res.status(200).json(requests);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch requests' });
	}
}
