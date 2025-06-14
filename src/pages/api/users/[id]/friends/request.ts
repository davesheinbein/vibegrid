import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';
import prisma from '../../../../server/prismaClient';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST']);
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
	const { toUserId } = req.body;
	if (!toUserId) {
		return res
			.status(400)
			.json({ error: 'Missing toUserId' });
	}
	try {
		const existing = await prisma.friendRequest.findFirst({
			where: {
				fromUserId: id,
				toUserId,
				status: 'pending',
			},
		});
		if (existing) {
			return res
				.status(409)
				.json({ error: 'Request already sent' });
		}
		const request = await prisma.friendRequest.create({
			data: {
				fromUserId: id,
				toUserId,
				status: 'pending',
			},
		});
		// Optionally: trigger achievement check here
		res.json(request);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to send request' });
	}
}
