import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../server/prismaClient';
// TODO: Replace with real admin authentication
const isAdmin = (req: NextApiRequest) => true;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (!isAdmin(req)) {
		return res.status(403).json({ error: 'Forbidden' });
	}
	if (req.method === 'GET') {
		try {
			const users = await prisma.user.findMany({
				select: {
					id: true,
					username: true,
					email: true,
					isAdmin: true,
					createdAt: true,
				},
				orderBy: { createdAt: 'desc' },
				take: 100,
			});
			res.json(users);
		} catch (err) {
			res
				.status(500)
				.json({ error: 'Failed to fetch users' });
		}
	} else {
		res.setHeader('Allow', ['GET']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
