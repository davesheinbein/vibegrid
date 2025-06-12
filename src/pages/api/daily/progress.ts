// Mock daily progress API route
import type { NextApiRequest, NextApiResponse } from 'next';

let progress: any = null;

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		res.status(200).json(progress);
	} else if (req.method === 'POST') {
		progress = req.body;
		res.status(200).json({ success: true });
	} else if (req.method === 'DELETE') {
		progress = null;
		res.status(200).json({ success: true });
	} else {
		res.status(405).json({ error: 'Method not allowed' });
	}
}
