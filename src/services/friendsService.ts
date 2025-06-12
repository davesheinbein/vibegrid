import { API_ROUTES } from '../constants/apiRoutes';
import type { Friend, FriendRequest } from '../types/api';

// Mock friend data for demo/dev
const MOCK_FRIENDS: Friend[] = [
	{ id: '1', username: 'Alice', online: true },
	{ id: '2', username: 'Bob', online: false },
	{ id: '3', username: 'Charlie', online: true },
];

export const fetchFriends = async (
	userId: string
): Promise<Friend[]> => {
	const res = await fetch(API_ROUTES.USER_FRIENDS(userId));
	if (!res.ok) throw new Error('Failed to fetch friends');
	const data = await res.json();
	// If the API returns IDs, map to mock objects for now
	if (Array.isArray(data.friends)) {
		return data.friends.map(
			(id: string) =>
				MOCK_FRIENDS.find((f) => f.id === id) || {
					id,
					username: id,
					online: false,
				}
		);
	}
	// If already an array of objects, just return
	if (Array.isArray(data)) return data;
	return [];
};

export const fetchFriendRequests = async (
	userId: string
): Promise<FriendRequest[]> => {
	const res = await fetch(
		API_ROUTES.USER_FRIENDS(userId) + '/requests'
	);
	if (!res.ok)
		throw new Error('Failed to fetch friend requests');
	return res.json();
};

export const sendFriendRequest = async (
	toUserId: string
): Promise<any> => {
	const res = await fetch(API_ROUTES.FRIENDS + '/request', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ toUserId }),
	});
	if (!res.ok)
		throw new Error('Failed to send friend request');
	return res.json();
};
