import type { NextApiRequest, NextApiResponse } from 'next';

// Mock: Usage data tracking, metrics, heatmaps, page views
export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	res
		.status(200)
		.json({
			pageViews: 12345,
			activeUsers: 87,
			heatmap: [],
		});
}
