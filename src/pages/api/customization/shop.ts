import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/server/prismaClient';

// GET: /api/customization/shop
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'GET') {
		res.setHeader('Allow', ['GET']);
		return res.status(405).end('Method Not Allowed');
	}
	// TODO: Implement daily rotation logic
	const now = new Date();
	try {
		const items = await prisma.customizationItem.findMany({
			where: {
				OR: [
					{ availableAt: null },
					{ availableAt: { lte: now } },
				],
				OR: [
					{ expiresAt: null },
					{ expiresAt: { gte: now } },
				],
			},
			orderBy: { rarity: 'asc' },
			take: 20,
		});
		res.json({ items });
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Failed to fetch shop items' });
	}
}
