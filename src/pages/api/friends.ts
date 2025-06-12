import type { NextApiRequest, NextApiResponse } from 'next';

// Mock: Friend search, pending invites not tied to a specific user
const MOCK_FRIENDS = [
	{ id: '1', name: 'Alice' },
	{ id: '2', name: 'Bob' },
	{ id: '3', name: 'Charlie' },
];
const MOCK_INVITES = [
	{ id: '4', name: 'Dana', status: 'pending' },
];

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	res
		.status(200)
		.json({ friends: MOCK_FRIENDS, invites: MOCK_INVITES });
}
