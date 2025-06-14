import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import authOptions from '../../../auth/[...nextauth]';
import { equipUserCustomization } from '../../../../../lib/customization';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		return res
			.status(405)
			.json({ error: 'Method not allowed' });
	}
	const session = await getServerSession(
		req,
		res,
		authOptions
	);
	const { slot, itemId } = req.body;
	const { id } = req.query;
	const sessionUser =
		session && (session as any).user
			? (session as any).user
			: null;
	if (!sessionUser || sessionUser.id !== id) {
		return res
			.status(401)
			.json({ error: 'Not authenticated' });
	}
	if (!slot || !itemId || !id) {
		return res
			.status(400)
			.json({ error: 'Missing slot, itemId, or user id' });
	}
	try {
		const result = await equipUserCustomization(
			id as string,
			slot,
			itemId
		);
		return res.status(200).json(result);
	} catch (e) {
		return res
			.status(500)
			.json({ error: 'Failed to equip customization' });
	}
}
