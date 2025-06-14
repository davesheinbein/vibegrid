import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { getUserAchievements } from '../../../../lib/achievements';

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
	const userId =
		(session as any)?.user?.id || (session as any)?.id;
	if (!session || !userId) {
		return res
			.status(401)
			.json({ error: 'Not authenticated' });
	}
	try {
		const achievements = await getUserAchievements(userId);
		res.status(200).json(achievements);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch achievements' });
	}
}
