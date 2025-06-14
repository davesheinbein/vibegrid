import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import authOptions from '../../auth/[...nextauth]';
import prisma from '../../../../server/prismaClient';
import type { Session } from 'next-auth';
import type { Friend, User } from '@prisma/client';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = (await getServerSession(
		req,
		res,
		authOptions
	)) as Session | null;
	const { id } = req.query;
	if (
		!session ||
		!session.user ||
		(session.user as any).id !== id
	) {
		return res
			.status(401)
			.json({ error: 'Not authenticated' });
	}
	if (typeof id !== 'string') {
		res.status(400).json({ error: 'Invalid user id' });
		return;
	}

	try {
		// Fetch accepted friends (where user is either userId or friendId)
		const friends = await prisma.friend.findMany({
			where: {
				userId: id,
				status: 'accepted',
			},
			include: {
				friend: {
					select: {
						id: true,
						username: true,
						photoUrl: true,
						lastActive: true,
					},
				},
			},
		});

		// Fetch incoming friend requests (to this user, pending)
		const incomingRequests =
			await prisma.friendRequest.findMany({
				where: {
					toUserId: id,
					status: 'pending',
				},
				include: {
					fromUser: {
						select: {
							id: true,
							username: true,
							photoUrl: true,
						},
					},
				},
			});

		// Fetch sent friend requests (from this user, pending)
		const sentRequests =
			await prisma.friendRequest.findMany({
				where: {
					fromUserId: id,
					status: 'pending',
				},
				include: {
					toUser: {
						select: {
							id: true,
							username: true,
							photoUrl: true,
						},
					},
				},
			});

		res.status(200).json({
			friends: friends.map((f) => f.friend),
			incomingRequests: incomingRequests.map((req) => ({
				id: req.id,
				fromUser: req.fromUser,
				createdAt: req.createdAt,
			})),
			sentRequests: sentRequests.map((req) => ({
				id: req.id,
				toUser: req.toUser,
				createdAt: req.createdAt,
			})),
		});
	} catch (error) {
		console.error('Error fetching friends:', error);
		res
			.status(500)
			.json({ error: 'Failed to fetch friends data' });
	}
}
