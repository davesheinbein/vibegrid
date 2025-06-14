import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../server/prismaClient';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { id } = req.query;
	const { userId, progress } = req.body;
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST']);
		return res
			.status(405)
			.json({ error: 'Method not allowed' });
	}
	if (
		!userId ||
		typeof progress !== 'number' ||
		typeof id !== 'string'
	) {
		return res
			.status(400)
			.json({
				error: 'Missing userId, progress, or challengeId',
			});
	}
	try {
		const userChallenge = await prisma.userChallenge.update(
			{
				where: {
					userId_challengeId: {
						userId,
						challengeId: id,
					},
				},
				data: { progress },
			}
		);
		res.json(userChallenge);
	} catch (err) {
		res
			.status(500)
			.json({
				error: 'Failed to track challenge progress',
			});
	}
}
