import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/server/prismaClient';
import { checkAchievements } from '@/lib/achievements';

// POST: /api/chat/referral
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST']);
		return res.status(405).end('Method Not Allowed');
	}
	const { referrerId, referredEmail } = req.body;
	if (!referrerId || !referredEmail)
		return res
			.status(400)
			.json({ error: 'Missing fields' });
	try {
		const referral = await prisma.referral.create({
			data: {
				referrerId,
				referredEmail,
				createdAt: new Date(),
			},
		});
		await checkAchievements({
			userId: referrerId,
			event: 'user_referred',
			eventData: { referredEmail },
		});
		res.json(referral);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to process referral' });
	}
}
