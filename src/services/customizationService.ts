import { API_ROUTES } from '../constants/apiRoutes';
import type { Customization } from '../types/api';

export const fetchCustomization = async (
	userId: string
): Promise<Customization> => {
	const res = await fetch(
		API_ROUTES.USER_CUSTOMIZATION(userId)
	);
	if (!res.ok)
		throw new Error('Failed to fetch customization');
	return res.json();
};

export const fetchAvailableCustomizations =
	async (): Promise<Customization[]> => {
		const res = await fetch(API_ROUTES.CUSTOMIZATION);
		if (!res.ok)
			throw new Error(
				'Failed to fetch available customizations'
			);
		return res.json();
	};

export const fetchInventory = async (
	userId?: string
): Promise<{
	themes: Customization[];
	emote: Customization[];
	font: Customization[];
	borders: Customization[];
	background: Customization[];
}> => {
	// If userId is not provided, fallback to a default or throw
	if (!userId)
		throw new Error('User ID required for inventory');
	const res = await fetch(
		API_ROUTES.USER_CUSTOMIZATION(userId)
	);
	if (!res.ok) throw new Error('Failed to fetch inventory');
	return res.json();
};

export const equipCustomization = async (
	slot: string, // e.g. 'theme', 'font', etc.
	itemId: string,
	userId?: string // not required by backend, but kept for consistency
): Promise<{ success: boolean }> => {
	// Debug log to help diagnose runtime errors
	console.log(
		'[equipCustomization] slot:',
		slot,
		'itemId:',
		itemId
	);
	const res = await fetch(
		`${API_ROUTES.CUSTOMIZATION}/equip`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ slot, itemId }),
			credentials: 'include',
		}
	);
	if (!res.ok)
		throw new Error('Failed to equip customization');
	return res.json();
};
