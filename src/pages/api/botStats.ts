import type { NextApiRequest, NextApiResponse } from 'next';

// Mock: Global stats about bots or AI performance
export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	res
		.status(200)
		.json({ totalGames: 500, winRate: 0.48, avgMoves: 12 });
}
