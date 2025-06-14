import type { NextApiRequest, NextApiResponse } from 'next';
import customizations from '../../data/customizations.json';

const cachedCustomizations = customizations;

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	res.setHeader(
		'Cache-Control',
		'public, max-age=3600, stale-while-revalidate=600'
	);
	res.status(200).json(cachedCustomizations);
}
