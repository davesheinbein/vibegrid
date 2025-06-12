import type { NextApiRequest, NextApiResponse } from 'next';

// This endpoint is now replaced by /api/users/[id]/customization/equip.ts and can be deleted.
// Mock: Equip a customization item for the user
export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		return res
			.status(405)
			.json({ error: 'Method not allowed' });
	}
	// In a real app, you would validate the session, check ownership, and update the equipped item
	// For mock, just return success
	const { slot, itemId } = req.body;
	if (!slot || !itemId) {
		return res
			.status(400)
			.json({ error: 'Missing slot or itemId' });
	}
	res.status(200).json({ success: true });
}
