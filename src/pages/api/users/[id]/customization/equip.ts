import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';

// In-memory mock user customization state (for demo only)
export const userCustomizations: Record<string, any> = {};

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
	if (
		!session ||
		(session.user && (session.user as any).id !== id)
	) {
		return res
			.status(401)
			.json({ error: 'Not authenticated' });
	}
	if (!slot || !itemId || !id) {
		return res
			.status(400)
			.json({ error: 'Missing slot, itemId, or user id' });
	}
	// Update the equipped item for this user in the mock state
	if (!userCustomizations[id as string])
		userCustomizations[id as string] = {};
	userCustomizations[id as string][slot] = itemId;
	return res
		.status(200)
		.json({ success: true, equipped: { slot, itemId } });
}
