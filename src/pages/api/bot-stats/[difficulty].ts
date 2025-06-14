import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../server/prismaClient';

// TODO: Replace with real session user extraction
declare type SessionUser = { id: string };
const getSessionUser = (
	req: NextApiRequest
): SessionUser | null => {
	// Implement your session logic here
	return null;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { difficulty } = req.query;
	const user = getSessionUser(req);
	if (!user || typeof difficulty !== 'string') {
		return res
			.status(401)
			.json({
				error: 'Unauthorized or missing difficulty',
			});
	}
	if (req.method === 'GET') {
		try {
			let stats = await prisma.botStats.findUnique({
				where: {
					userId_botDifficulty: {
						userId: user.id,
						botDifficulty: difficulty,
					},
				},
			});
			if (!stats) {
				stats = await prisma.botStats.create({
					data: {
						userId: user.id,
						botDifficulty: difficulty,
					},
				});
			}
			res.json(stats);
		} catch (e: any) {
			res.status(500).json({ error: e.message });
		}
	} else if (req.method === 'POST') {
		try {
			const update = req.body;
			let stats = await prisma.botStats.findUnique({
				where: {
					userId_botDifficulty: {
						userId: user.id,
						botDifficulty: difficulty,
					},
				},
			});
			if (!stats) {
				stats = await prisma.botStats.create({
					data: {
						userId: user.id,
						botDifficulty: difficulty,
						...update,
					},
				});
			} else {
				stats = await prisma.botStats.update({
					where: {
						userId_botDifficulty: {
							userId: user.id,
							botDifficulty: difficulty,
						},
					},
					data: update,
				});
			}
			res.json(stats);
		} catch (e: any) {
			res.status(500).json({ error: e.message });
		}
	} else {
		res.setHeader('Allow', ['GET', 'POST']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
