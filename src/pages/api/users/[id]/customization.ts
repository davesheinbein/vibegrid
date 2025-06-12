import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

// Use the same in-memory state as the equip endpoint
import { userCustomizations } from './customization/equip';

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
	if (typeof id !== 'string') {
		res.status(400).json({ error: 'Invalid user id' });
		return;
	}
	if (req.method === 'GET') {
		// Return the up-to-date customization for this user
		const customization = userCustomizations[id] || {};
		res.status(200).json(customization);
	} else if (
		req.method === 'POST' ||
		req.method === 'PUT'
	) {
		// In a real app, update customization in DB
		res.status(200).json({ success: true });
	} else {
		res.status(405).json({ error: 'Method not allowed' });
	}
}
