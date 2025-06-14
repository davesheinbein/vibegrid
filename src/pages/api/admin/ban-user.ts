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
	if (req.method === 'POST') {
		try {
			const { userId } = req.body;
			await prisma.user.update({
				where: { id: userId },
				data: { banned: true },
			});
			res.json({ success: true });
		} catch (err) {
			res.status(500).json({ error: 'Failed to ban user' });
		}
	} else {
		res.setHeader('Allow', ['POST']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
