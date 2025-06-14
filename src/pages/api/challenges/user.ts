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
		const userChallenges =
			await prisma.userChallenge.findMany({
				where: { userId },
				include: { challenge: true },
				orderBy: { createdAt: 'desc' },
			});
		res.json(userChallenges);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch user challenges' });
	}
}
