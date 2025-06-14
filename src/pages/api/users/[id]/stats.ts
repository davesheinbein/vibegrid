import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import authOptions from '../../auth/[...nextauth]';
import { getUserStats } from '../../../../lib/stats';
import prisma from '../../../../server/prismaClient';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerSession(
		req,
		res,
		authOptions
	);
	const { id } = req.query;
	const sessionUserId =
		(session as any)?.user?.id || (session as any)?.id;
	if (!session || sessionUserId !== id) {
		return res
			.status(401)
			.json({ error: 'Not authenticated' });
	}
	if (typeof id !== 'string') {
		res.status(400).json({ error: 'Invalid user id' });
		return;
	}
	if (req.method === 'GET') {
		try {
			const stats = await getUserStats(id);
			res.status(200).json(stats || {});
		} catch (e) {
			res
				.status(500)
				.json({ error: 'Failed to fetch stats' });
		}
	} else {
		res.status(405).json({ error: 'Method not allowed' });
	}
}
