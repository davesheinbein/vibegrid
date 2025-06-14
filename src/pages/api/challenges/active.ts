import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../server/prismaClient';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'GET') {
		res.setHeader('Allow', ['GET']);
		return res
			.status(405)
			.json({ error: 'Method not allowed' });
	}
	try {
		const now = new Date();
		const challenges = await prisma.challenge.findMany({
			where: {
				startDate: { lte: now },
				endDate: { gte: now },
			},
			orderBy: { startDate: 'asc' },
		});
		res.json(challenges);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch challenges' });
	}
}
