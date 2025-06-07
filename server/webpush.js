// Web Push Notification Setup for VibeGrid
const webpush = require('web-push');

webpush.setVapidDetails(
	'mailto:admin@vibegrid.com',
	process.env.VAPID_PUBLIC_KEY,
	process.env.VAPID_PRIVATE_KEY
);

function sendPushNotification(subscription, payload) {
	return webpush.sendNotification(
		subscription,
		JSON.stringify(payload)
	);
}

module.exports = { sendPushNotification };
