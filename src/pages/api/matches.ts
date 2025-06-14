// Platform-wide match history or record a finished match
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../server/prismaClient';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		// Optionally: return all matches or add filters as needed
		try {
			const matches = await prisma.match.findMany({
				orderBy: { startedAt: 'desc' },
				include: {
					puzzle: true,
					winner: { select: { id: true, username: true } },
				},
				take: 100,
			});
			res.json(matches);
		} catch (err) {
			res
				.status(500)
				.json({ error: 'Failed to fetch matches' });
		}
	} else if (req.method === 'POST') {
		// Record a finished match
		const {
			player1Id,
			player2Id,
			puzzleId,
			state,
			winnerId,
			startedAt,
			endedAt,
		} = req.body || {};
		if (
			!player1Id ||
			!player2Id ||
			!puzzleId ||
			!winnerId
		) {
			return res
				.status(400)
				.json({ error: 'Missing required fields' });
		}
		try {
			const match = await prisma.match.create({
				data: {
					player1Id: String(player1Id),
					player2Id: String(player2Id),
					puzzleId: String(puzzleId),
					state: state || {},
					winnerId: String(winnerId),
					startedAt: startedAt
						? new Date(startedAt)
						: undefined,
					endedAt: endedAt ? new Date(endedAt) : undefined,
				},
			});
			res.status(201).json(match);
		} catch (err) {
			res
				.status(500)
				.json({ error: 'Failed to record match' });
		}
	} else {
		res.setHeader('Allow', ['GET', 'POST']);
		res.status(405).json({ error: 'Method not allowed' });
	}
}
