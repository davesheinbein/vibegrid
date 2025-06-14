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
			const { puzzleId } = req.body;
			await prisma.puzzle.update({
				where: { id: puzzleId },
				data: { approved: true },
			});
			res.json({ success: true });
		} catch (err) {
			res
				.status(500)
				.json({ error: 'Failed to approve puzzle' });
		}
	} else {
		res.setHeader('Allow', ['POST']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
