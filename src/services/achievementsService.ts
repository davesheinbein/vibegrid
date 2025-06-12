import { API_ROUTES } from '../constants/apiRoutes';
import type { Achievement } from '../types/api';
import { getSession } from 'next-auth/react';

export const fetchAchievements = async (): Promise<
	Achievement[]
> => {
	const res = await fetch(API_ROUTES.ACHIEVEMENTS);
	if (!res.ok)
		throw new Error('Failed to fetch achievements');
	return res.json();
};

export const resetAchievements =
	async (): Promise<void> => {
		const session = await getSession();
		if (!session || !(session.user as any)?.id)
			throw new Error('Not authenticated');
		const userId = (session.user as any).id;
		const res = await fetch(
			API_ROUTES.USER_ACHIEVEMENTS(userId),
			{
				method: 'DELETE',
			}
		);
		if (!res.ok)
			throw new Error('Failed to reset achievements');
	};
