const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const axios = require('axios');
const API_URL = process.env.API_URL || 'http://localhost:3000/api/achievements/check';

// Achievement check function
async function checkAchievements({ userId, event, stats = null, eventData = null }) {
	try {
		await axios.post(API_URL, { userId, event, stats, eventData });
	} catch (e) {
		console.error('Achievement check failed:', e.message);
	}
}

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
		// Achievement: group chat created
		if (createdById) {
			await checkAchievements({ userId: createdById, event: 'group_chat_created' });
		}
		res.json(group);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to create group chat' });
	}
});

module.exports = router;
