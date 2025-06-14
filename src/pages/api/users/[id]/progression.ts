import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import authOptions from '../../auth/[...nextauth]';
import { getUserProgression } from '../../../lib/progression';
import type { Session } from 'next-auth';

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
		const progression = await getUserProgression(id);
		if (!progression) {
			res.status(404).json({ error: 'User not found' });
			return;
		}
		res.status(200).json(progression);
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Failed to fetch progression' });
	}
}
