const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET /api/admin/users - List all users (admin only)
router.get('/users', async (req, res) => {
	// TODO: Add admin auth check
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				username: true,
				email: true,
				isAdmin: true,
				createdAt: true,
			},
			orderBy: { createdAt: 'desc' },
			take: 100,
		});
		res.json(users);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch users' });
	}
});

// POST /api/admin/ban-user - Ban a user (admin only)
router.post('/ban-user', async (req, res) => {
	// TODO: Add admin auth check
	try {
		const { userId } = req.body;
		await prisma.user.update({
			where: { id: userId },
			data: { banned: true },
		});
		res.json({ success: true });
	} catch (err) {
		res.status(500).json({ error: 'Failed to ban user' });
	}
});

// POST /api/admin/approve-puzzle - Approve a community puzzle (admin only)
router.post('/approve-puzzle', async (req, res) => {
	// TODO: Add admin auth check
	try {
		const { puzzleId } = req.body;
		await prisma.puzzle.update({
			where: { id: puzzleId },
			data: { approved: true },
		});
		res.json({ success: true });
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to approve puzzle' });
	}
});

module.exports = router;
