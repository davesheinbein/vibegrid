const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const axios = require('axios');
const API_URL =
	process.env.API_URL ||
	'http://localhost:3000/api/achievements/check';

// Achievement check function
async function checkAchievements({
	userId,
	event,
	stats = null,
	eventData = null,
}) {
	try {
		await axios.post(API_URL, {
			userId,
			event,
			stats,
			eventData,
		});
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
		res.status(500).json({
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
			await checkAchievements({
				userId: createdById,
				event: 'group_chat_created',
			});
		}
		res.json(group);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to create group chat' });
	}
});

// POST /api/chat/dm - Send a direct message
router.post('/dm', async (req, res) => {
	const { senderId, receiverId, content } = req.body;
	if (!senderId || !receiverId || !content)
		return res
			.status(400)
			.json({ error: 'Missing fields' });
	try {
		const message = await prisma.message.create({
			data: {
				senderId,
				receiverId,
				content,
				sentAt: new Date(),
			},
		});
		await checkAchievements({
			userId: senderId,
			event: 'dm_sent',
			eventData: { receiverId },
		});
		res.json(message);
	} catch (err) {
		res.status(500).json({ error: 'Failed to send DM' });
	}
});

// POST /api/chat/group/:groupId - Send a group message
router.post('/group/:groupId', async (req, res) => {
	const { senderId, content } = req.body;
	if (!senderId || !content)
		return res
			.status(400)
			.json({ error: 'Missing fields' });
	try {
		const message = await prisma.message.create({
			data: {
				senderId,
				groupId: req.params.groupId,
				content,
				sentAt: new Date(),
			},
		});
		await checkAchievements({
			userId: senderId,
			event: 'group_message_sent',
			eventData: { groupId: req.params.groupId },
		});
		res.json(message);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to send group message' });
	}
});

// GET /api/chat/activity/:userId - Get user activity feed (recent actions)
router.get('/activity/:userId', async (req, res) => {
	try {
		// Example: fetch recent messages, puzzle solves, challenge completions, etc.
		// This is a simplified placeholder; real implementation may aggregate from multiple tables
		const messages = await prisma.message.findMany({
			where: { senderId: req.params.userId },
			orderBy: { sentAt: 'desc' },
			take: 20,
		});
		res.json({ messages });
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch activity feed' });
	}
});

// POST /api/chat/referral - Handle user referral
router.post('/referral', async (req, res) => {
	const { referrerId, referredEmail } = req.body;
	if (!referrerId || !referredEmail)
		return res
			.status(400)
			.json({ error: 'Missing fields' });
	try {
		// Store referral (assumes a Referral model exists)
		const referral = await prisma.referral.create({
			data: {
				referrerId,
				referredEmail,
				createdAt: new Date(),
			},
		});
		await checkAchievements({
			userId: referrerId,
			event: 'user_referred',
			eventData: { referredEmail },
		});
		res.json(referral);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to process referral' });
	}
});

module.exports = router;
