import type { NextApiRequest, NextApiResponse } from 'next';
import {
	getAllAchievements,
	syncAchievementsToDB,
	unlockAchievementForUser,
	checkAndUnlockAchievements,
} from '../../lib/achievements';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		// Return all achievements from DB
		try {
			const achievements = await getAllAchievements();
			res.setHeader(
				'Cache-Control',
				'public, max-age=3600, stale-while-revalidate=600'
			);
			res.status(200).json(achievements);
		} catch (err) {
			res
				.status(500)
				.json({ error: 'Failed to fetch achievements' });
		}
		return;
	}

	if (req.method === 'POST') {
		const { action, ...body } = req.body;
		if (action === 'unlock') {
			// POST /api/achievements { action: 'unlock', userId, achievementId }
			const { userId, achievementId } = body;
			if (!userId || !achievementId)
				return res
					.status(400)
					.json({
						error: 'Missing userId or achievementId',
					});
			try {
				const result = await unlockAchievementForUser(
					userId,
					achievementId
				);
				res.json(result);
			} catch (err) {
				res
					.status(500)
					.json({ error: 'Failed to unlock achievement' });
			}
			return;
		}
		if (action === 'sync') {
			// POST /api/achievements { action: 'sync' }
			// TODO: Add admin auth check
			try {
				await syncAchievementsToDB();
				res.json({ success: true });
			} catch (err) {
				res
					.status(500)
					.json({ error: 'Failed to sync achievements' });
			}
			return;
		}
		if (action === 'check') {
			// POST /api/achievements { action: 'check', userId, event, stats, eventData }
			const { userId, event, stats, eventData } = body;
			if (!userId || !event)
				return res
					.status(400)
					.json({ error: 'Missing userId or event' });
			try {
				const result = await checkAndUnlockAchievements({
					userId,
					event,
					stats,
					eventData,
				});
				res.json(result);
			} catch (err) {
				res
					.status(500)
					.json({ error: 'Failed to check achievements' });
			}
			return;
		}
		return res
			.status(400)
			.json({ error: 'Unknown action' });
	}

	res.setHeader('Allow', ['GET', 'POST']);
	res.status(405).end(`Method ${req.method} Not Allowed`);
}
