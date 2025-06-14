import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import prisma from '../../../../server/prismaClient';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST']);
		return res
			.status(405)
			.json({ error: 'Method not allowed' });
	}
	const session = await getServerSession(
		req,
		res,
		authOptions
	);
	const { id } = req.query;
	const { friendId } = req.body;
	const userId =
		(session as any)?.user?.id || (session as any)?.id;
	if (!session || !userId || userId !== id) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
	try {
		// Remove friendship (bi-directional)
		await prisma.friend.deleteMany({
			where: {
				OR: [
					{ userId: userId, friendId },
					{ userId: friendId, friendId: userId },
				],
			},
		});
		res.status(200).json({ success: true });
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Failed to remove friend' });
	}
}
