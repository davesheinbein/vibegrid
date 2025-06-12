import type { NextApiRequest, NextApiResponse } from 'next';
import puzzles from '../../data/dailyPuzzles.json';

// Mock: Master list of all available puzzles, daily puzzle retrieval
export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	res.status(200).json(puzzles);
}
