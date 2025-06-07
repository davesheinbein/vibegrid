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

module.exports = router;
