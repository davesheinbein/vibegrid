import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

// Mock: User settings
const MOCK_USER_SETTINGS: Record<string, any> = {
	'1': { privacy: 'public', sound: true, darkMode: false },
	'2': { privacy: 'friends', sound: false, darkMode: true },
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerSession(
		req,
		res,
		authOptions
	);
	const { id } = req.query;
	if (
		!session ||
		(session.user && (session.user as any).id !== id)
	) {
		return res
			.status(401)
			.json({ error: 'Not authenticated' });
	}
	if (req.method === 'GET') {
		const settings = MOCK_USER_SETTINGS[id] || {
			privacy: 'public',
			sound: true,
			darkMode: false,
		};
		res.status(200).json(settings);
	} else if (
		req.method === 'POST' ||
		req.method === 'PUT'
	) {
		// In a real app, update settings in DB
		res.status(200).json({ success: true });
	} else {
		res.status(405).json({ error: 'Method not allowed' });
	}
}
