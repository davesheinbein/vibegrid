import type { NextApiRequest, NextApiResponse } from 'next';
import customizations from '../../data/customizations.json';

// Mock: Global list of available customization options
export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	res.status(200).json(customizations);
}
