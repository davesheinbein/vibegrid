import { getServerSession } from 'next-auth/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../pages/api/auth/[...nextauth]';

/**
 * Returns the user ID from the session, or undefined if not authenticated.
 */
export async function getSessionUserId(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<string | undefined> {
	const session = await getServerSession(
		req,
		res,
		authOptions
	);
	return (
		(session as any)?.user?.id ||
		(session as any)?.id ||
		undefined
	);
}
