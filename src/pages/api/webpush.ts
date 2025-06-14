import type { NextApiRequest, NextApiResponse } from 'next';
import webpush from 'web-push';

webpush.setVapidDetails(
	'mailto:admin@vibegrid.com',
	process.env.VAPID_PUBLIC_KEY!,
	process.env.VAPID_PRIVATE_KEY!
);

// Mock: Subscribe/unsubscribe to push notifications platform-wide
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Subscribe to push notifications
	if (req.method === 'POST') {
		const { subscription, payload } = req.body;
		if (!subscription || !payload) {
			return res
				.status(400)
				.json({ error: 'Missing subscription or payload' });
		}
		try {
			await webpush.sendNotification(
				subscription,
				JSON.stringify(payload)
			);
			return res.status(200).json({ success: true });
		} catch (error) {
			return res
				.status(500)
				.json({ error: 'Failed to send notification' });
		}
		// Unsubscribe from push notifications
	} else if (req.method === 'DELETE') {
		// Optionally handle unsubscribe logic here
		return res
			.status(200)
			.json({
				success: true,
				message: 'Unsubscribed from push notifications.',
			});
	} else {
		return res
			.status(405)
			.json({ error: 'Method not allowed' });
	}
}
