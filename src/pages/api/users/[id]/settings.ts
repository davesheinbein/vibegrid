import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import authOptions from '../../auth/[...nextauth]';
import { getUserSettings, updateUserSettings } from '../../../../lib/settings';
import prisma from '../../../../server/prismaClient';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerSession(req, res, authOptions);
	const { id } = req.query;
	const sessionUserId = (session as any)?.user?.id || (session as any)?.id;
	if (!session || sessionUserId !== id) {
		return res.status(401).json({ error: 'Not authenticated' });
	}
	if (typeof id !== 'string') {
		return res.status(400).json({ error: 'Invalid user id' });
	}
	if (req.method === 'GET') {
		try {
			const settings = await getUserSettings(id);
			res.status(200).json(settings || {});
		} catch (e) {
			res.status(500).json({ error: 'Failed to fetch settings' });
		}
	} else if (req.method === 'POST' || req.method === 'PUT') {
		try {
			const updated = await updateUserSettings(id, req.body);
			res.status(200).json(updated);
		} catch (e) {
			res.status(500).json({ error: 'Failed to update settings' });
		}
	} else {
		res.status(405).json({ error: 'Method not allowed' });
	}
}
