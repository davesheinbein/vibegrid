import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../server/prismaClient';
import pkg from '../../../package.json';

// GET /api/health - Basic backend health
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET' && req.query.db === undefined) {
		return res.json({
			ok: true,
			uptime: process.uptime(),
			env: process.env.NODE_ENV,
			version: pkg.version,
			timestamp: new Date().toISOString(),
		});
	}
	if (req.method === 'GET' && req.query.db !== undefined) {
		try {
			const userCount = await prisma.user.count();
			const puzzleCount = await prisma.puzzle.count();
			const matchCount = await prisma.match.count();
			const achievementCount =
				await prisma.achievement.count();
			const tables = [
				'User',
				'Puzzle',
				'Match',
				'Achievement',
				'UserAchievement',
				'Friend',
				'FriendRequest',
				'GroupChat',
				'GroupMember',
				'Message',
				'Notification',
			];
			return res.json({
				ok: true,
				tables,
				userCount,
				puzzleCount,
				matchCount,
				achievementCount,
				timestamp: new Date().toISOString(),
			});
		} catch (e: any) {
			return res
				.status(500)
				.json({ ok: false, error: e.message });
		}
	}
	res.setHeader('Allow', ['GET']);
	res.status(405).end('Method Not Allowed');
}
