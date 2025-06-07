const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET /api/notifications/:userId - Get notifications for user
router.get('/:userId', async (req, res) => {
	try {
		const notifications =
			await prisma.notification.findMany({
				where: { userId: req.params.userId },
				orderBy: { createdAt: 'desc' },
				take: 100,
			});
		res.json(notifications);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch notifications' });
	}
});

// POST /api/notifications/mark-read - Mark notification as read
router.post('/mark-read', async (req, res) => {
	try {
		const { notificationId } = req.body;
		await prisma.notification.update({
			where: { id: notificationId },
			data: { read: true },
		});
		res.json({ success: true });
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to mark as read' });
	}
});

// GET /api/notifications/prefs/:userId - Get user notification preferences
router.get('/prefs/:userId', async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.params.userId },
			select: { notificationPrefs: true },
		});
		res.json(user?.notificationPrefs || {});
	} catch (err) {
		res
			.status(500)
			.json({
				error: 'Failed to fetch notification preferences',
			});
	}
});

// PUT /api/notifications/prefs/:userId - Update user notification preferences
router.put('/prefs/:userId', async (req, res) => {
	try {
		const { notificationPrefs } = req.body;
		const user = await prisma.user.update({
			where: { id: req.params.userId },
			data: { notificationPrefs },
		});
		res.json(user.notificationPrefs);
	} catch (err) {
		res
			.status(500)
			.json({
				error: 'Failed to update notification preferences',
			});
	}
});

// GET /api/notifications/digest/:userId - Get notification digest for user
router.get('/digest/:userId', async (req, res) => {
	try {
		// Example: fetch recent notifications, group by type
		const notifications =
			await prisma.notification.findMany({
				where: { userId: req.params.userId },
				orderBy: { createdAt: 'desc' },
				take: 50,
			});
		// Grouping/formatting logic can be added here
		res.json(notifications);
	} catch (err) {
		res
			.status(500)
			.json({
				error: 'Failed to fetch notification digest',
			});
	}
});

module.exports = router;
