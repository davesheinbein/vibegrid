// Mock daily completion API route
import type { NextApiRequest, NextApiResponse } from 'next';

let completion: any = null;

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		res.status(200).json(completion);
	} else if (req.method === 'POST') {
		const { result } = req.body;
		completion = { result };
		res.status(200).json({ success: true });
	} else {
		res.status(405).json({ error: 'Method not allowed' });
	}
}
