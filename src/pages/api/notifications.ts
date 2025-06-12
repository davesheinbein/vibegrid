import type { NextApiRequest, NextApiResponse } from 'next';

// Mock: Broadcast notifications, global message of the day, maintenance alerts
const MOCK_NOTIFICATIONS = [
	{
		id: 'motd',
		type: 'system',
		message: 'Welcome to Grid Royale!',
		date: '2025-06-11',
	},
	{
		id: 'maint',
		type: 'maintenance',
		message: 'Scheduled maintenance at 2am UTC.',
		date: '2025-06-12',
	},
];

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	res.status(200).json(MOCK_NOTIFICATIONS);
}
