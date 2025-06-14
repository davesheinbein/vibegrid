import type { NextApiRequest, NextApiResponse } from 'next';
import puzzles from '../../data/dailyPuzzles.json';

const cachedPuzzles = puzzles;

// Mock: Master list of all available puzzles, daily puzzle retrieval
export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	res.setHeader(
		'Cache-Control',
		'public, max-age=3600, stale-while-revalidate=600'
	);
	res.status(200).json(cachedPuzzles);
}
