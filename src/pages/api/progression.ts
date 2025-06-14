import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../server/prismaClient';

// Platform-wide progression info: XP thresholds, rewards, milestones
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
		// Example: Fetch progression config from DB or static config
		// Here, we assume a static config for XP thresholds and rewards
		const progression = {
			levels: [
				{ level: 1, xp: 0, reward: null },
				{ level: 2, xp: 100, reward: 'badge_bronze' },
				{ level: 3, xp: 300, reward: 'badge_silver' },
				{ level: 4, xp: 600, reward: 'badge_gold' },
				{ level: 5, xp: 1000, reward: 'badge_platinum' },
			],
			streakRewards: [
				{ days: 3, reward: 'emote_fire' },
				{ days: 7, reward: 'emote_rocket' },
				{ days: 30, reward: 'emote_crown' },
			],
		};
		res.status(200).json(progression);
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Failed to fetch progression info' });
	}
}
