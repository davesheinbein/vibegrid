import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/server/prismaClient';

// GET: /api/customization/popular
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'GET') {
		res.setHeader('Allow', ['GET']);
		return res.status(405).end('Method Not Allowed');
	}
	// TODO: Aggregate most equipped items/loadouts
	res.json({});
}
