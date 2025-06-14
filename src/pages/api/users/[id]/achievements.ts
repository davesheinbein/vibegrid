import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import authOptions from '../../auth/[...nextauth]';
import { getUserAchievements } from '../../../../lib/achievements';
import { ACHIEVEMENTS } from '../../../../data/achievementsConfig';

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
	const userId =
		(session as any)?.user?.id ||
		(session as any)?.id ||
		undefined;
	if (!userId || userId !== id) {
		return res
			.status(401)
			.json({ error: 'Not authenticated' });
	}
	if (typeof id !== 'string') {
		res.status(400).json({ error: 'Invalid user id' });
		return;
	}
	try {
		// Fetch unlocked achievements from DB
		const unlocked = await getUserAchievements(id);
		const unlockedIds = unlocked.map(
			(ua) => ua.achievementId
		);
		const unlockedAtMap: Record<
			string,
			string | undefined
		> = {};
		unlocked.forEach((ua) => {
			unlockedAtMap[ua.achievementId] =
				ua.unlockedAt?.toISOString?.() || undefined;
		});
		// Merge with all possible achievements for status
		const achievementsWithStatus = ACHIEVEMENTS.map(
			(a) => ({
				...a,
				unlocked: unlockedIds.includes(a.id),
				unlockedAt: unlockedAtMap[a.id] || undefined,
			})
		);
		res.status(200).json(achievementsWithStatus);
	} catch (e) {
		res
			.status(500)
			.json({ error: 'Failed to fetch achievements' });
	}
}
