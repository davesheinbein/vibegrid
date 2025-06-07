const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET /api/chat/dm/:userId/:otherUserId - Get DM history
router.get('/dm/:userId/:otherUserId', async (req, res) => {
	try {
		const { userId, otherUserId } = req.params;
		const messages = await prisma.message.findMany({
			where: {
				OR: [
					{ senderId: userId, receiverId: otherUserId },
					{ senderId: otherUserId, receiverId: userId },
				],
			},
			orderBy: { sentAt: 'asc' },
		});
		res.json(messages);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch DM history' });
	}
});

// GET /api/chat/group/:groupId - Get group chat history
router.get('/group/:groupId', async (req, res) => {
	try {
		const { groupId } = req.params;
		const messages = await prisma.message.findMany({
			where: { groupId },
			orderBy: { sentAt: 'asc' },
		});
		res.json(messages);
	} catch (err) {
		res
			.status(500)
			.json({
				error: 'Failed to fetch group chat history',
			});
	}
});

// POST /api/chat/group - Create group chat
router.post('/group', async (req, res) => {
	try {
		const { name, createdById, memberIds } = req.body;
		const group = await prisma.groupChat.create({
			data: {
				name,
				createdById,
				members: {
					create: memberIds.map((userId) => ({ userId })),
				},
			},
			include: { members: true },
		});
		res.json(group);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to create group chat' });
	}
});

module.exports = router;
