import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserCustomizationsGrouped } from '../../../../lib/customization';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { id } = req.query;
	if (req.method === 'GET') {
		try {
			const inventory = await getUserCustomizationsGrouped(
				id as string
			);
			res.status(200).json(inventory);
		} catch (e) {
			res.status(500).json({
				error: 'Failed to fetch user customizations',
			});
		}
	} else {
		res.status(405).json({ error: 'Method not allowed' });
	}
}
