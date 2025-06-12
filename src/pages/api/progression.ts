import type { NextApiRequest, NextApiResponse } from 'next';

// Mock: Platform-wide progression system info (XP thresholds, rewards milestones)
const MOCK_PROGRESSION = {
	levels: [0, 100, 300, 600, 1000, 1500],
	rewards: [
		{ level: 1, reward: 'Bronze Badge' },
		{ level: 3, reward: 'Silver Badge' },
		{ level: 5, reward: 'Gold Badge' },
	],
};

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	res.status(200).json(MOCK_PROGRESSION);
}
