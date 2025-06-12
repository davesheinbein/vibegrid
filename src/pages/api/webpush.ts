import type { NextApiRequest, NextApiResponse } from 'next';

// Mock: Subscribe/unsubscribe to push notifications platform-wide
export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		res
			.status(200)
			.json({
				success: true,
				message: 'Subscribed to push notifications.',
			});
	} else if (req.method === 'DELETE') {
		res
			.status(200)
			.json({
				success: true,
				message: 'Unsubscribed from push notifications.',
			});
	} else {
		res.status(405).json({ error: 'Method not allowed' });
	}
}
