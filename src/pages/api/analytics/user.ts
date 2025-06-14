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
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				stats: true,
				xp: true,
				level: true,
			},
		});
		const recentMatches = await prisma.match.findMany({
			where: {
				OR: [{ player1Id: userId }, { player2Id: userId }],
			},
			orderBy: { createdAt: 'desc' },
			take: 10,
		});
		res.json({ user, recentMatches });
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch analytics' });
	}
}
