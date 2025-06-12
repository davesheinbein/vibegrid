import type { NextApiRequest, NextApiResponse } from 'next';

// Mock: Health check endpoints or server status overview
export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	res
		.status(200)
		.json({
			status: 'ok',
			uptime: 123456,
			version: '1.0.0',
		});
}
