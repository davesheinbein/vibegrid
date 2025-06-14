import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/server/prismaClient';

// POST: /api/customization/loadout
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST']);
		return res.status(405).end('Method Not Allowed');
	}
	const session = await getServerSession(
		req,
		res,
		authOptions
	);
	const userId =
		(session as any)?.user?.id || (session as any)?.id;
	if (!session || !userId)
		return res.status(401).json({ error: 'Unauthorized' });
	const {
		name,
		themeId,
		fontId,
		emojiPackId,
		soundPackId,
		titleId,
		frameId,
		burnTrailId,
	} = req.body;
	// TODO: Save or update loadout for user
	res.json({ success: true });
}
