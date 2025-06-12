// Mock: Bot stats POST endpoint for difficulty
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { difficulty } = req.query;
	if (req.method === 'POST') {
		// Accept and ignore posted stats for now
		res.status(200).json({ success: true, difficulty });
	} else {
		res.status(405).json({ error: 'Method not allowed' });
	}
}
