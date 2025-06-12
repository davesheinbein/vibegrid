import type { NextApiRequest, NextApiResponse } from 'next';

// Mock: Platform-wide leaderboard rankings
const MOCK_LEADERBOARDS = [
	{ rank: 1, user: 'Alice', score: 4200 },
	{ rank: 2, user: 'Bob', score: 3900 },
	{ rank: 3, user: 'Charlie', score: 3700 },
];

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	res.status(200).json(MOCK_LEADERBOARDS);
}
