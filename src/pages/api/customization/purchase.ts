import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/server/prismaClient';

// POST: /api/customization/purchase
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
	const { itemId } = req.body;
	if (!itemId)
		return res
			.status(400)
			.json({ error: 'Missing itemId' });
	try {
		const item = await prisma.customizationItem.findUnique({
			where: { id: itemId },
		});
		if (!item)
			return res
				.status(404)
				.json({ error: 'Item not found' });
		// TODO: Check if already owned, check currency, deduct, and add to inventory
		res.json({ success: true });
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Failed to purchase item' });
	}
}
