import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../server/prismaClient';
// TODO: Replace with real admin authentication
const isAdmin = (req: NextApiRequest) => true;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (!isAdmin(req)) {
		return res.status(403).json({ error: 'Forbidden' });
	}
	if (req.method === 'POST') {
		try {
			const { userId, achievementId } = req.body;
			const already =
				await prisma.userAchievement.findUnique({
					where: {
						userId_achievementId: { userId, achievementId },
					},
				});
			if (already) {
				return res.json({
					unlocked: false,
					message: 'Already unlocked',
				});
			}
			const unlocked = await prisma.userAchievement.create({
				data: { userId, achievementId },
				include: { achievement: true },
			});
			// TODO: Emit socket event if possible
			res.json({ unlocked: true, unlocked });
		} catch (err) {
			res
				.status(500)
				.json({ error: 'Failed to test achievement' });
		}
	} else {
		res.setHeader('Allow', ['POST']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
