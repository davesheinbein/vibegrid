import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../server/prismaClient';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { seasonId } = req.query;
	if (req.method !== 'GET') {
		res.setHeader('Allow', ['GET']);
		return res
			.status(405)
			.json({ error: 'Method not allowed' });
	}
	if (!seasonId || typeof seasonId !== 'string') {
		return res
			.status(400)
			.json({ error: 'Missing seasonId' });
	}
	try {
		// Example: assuming a SeasonUserStats table or stats field keyed by season
		// Adjust this logic to match your schema
		const top = await prisma.user.findMany({
			orderBy: [
				{
					stats: { path: [seasonId, 'wins'], sort: 'desc' },
				},
			],
			select: {
				id: true,
				username: true,
				photoUrl: true,
				stats: true,
			},
			take: 50,
		});
		res.json(top);
	} catch (err) {
		res
			.status(500)
			.json({
				error: 'Failed to fetch season leaderboard',
			});
	}
}
