import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../server/prismaClient';
// TODO: Import and use real checkAchievements from lib if needed
const checkAchievements = async () => {};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { id } = req.query;
	const { userId } = req.body;
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST']);
		return res
			.status(405)
			.json({ error: 'Method not allowed' });
	}
	if (!userId || typeof id !== 'string') {
		return res
			.status(400)
			.json({ error: 'Missing userId or challengeId' });
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
				data: { completed: true, completedAt: new Date() },
			}
		);
		await checkAchievements({
			userId,
			event: 'challenge_completed',
			eventData: { challengeId: id },
		});
		res.json(userChallenge);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to complete challenge' });
	}
}
