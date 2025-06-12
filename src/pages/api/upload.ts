import type { NextApiRequest, NextApiResponse } from 'next';

// Mock: Any image/file upload endpoint not tied to a specific user
export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		res
			.status(200)
			.json({
				success: true,
				url: '/uploads/mock-file.png',
			});
	} else {
		res.status(405).json({ error: 'Method not allowed' });
	}
}
