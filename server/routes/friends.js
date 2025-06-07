const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { getSessionUser } = require('../utils/auth');
const axios = require('axios');
const API_URL = process.env.API_URL || 'http://localhost:3000/api/achievements/check';

async function checkAchievements({ userId, event, stats = null, eventData = null }) {
  try {
    await axios.post(API_URL, { userId, event, stats, eventData });
  } catch (e) {
    console.error('Achievement check failed:', e.message);
  }
}

// GET /api/friends - List friends
router.get('/', async (req, res) => {
	// Auth: get user from session/JWT
	const user = getSessionUser(req);
	if (!user)
		return res.status(401).json({ error: 'Unauthorized' });
	try {
		const friends = await prisma.friend.findMany({
			where: { userId: user.id, status: 'accepted' },
			include: {
				friend: {
					select: {
						id: true,
						username: true,
						photoUrl: true,
						lastActive: true,
					},
				},
			},
		});
		res.json(friends.map((f) => f.friend));
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch friends' });
	}
});

// POST /api/friends/request - Send friend request
router.post('/request', async (req, res) => {
  const user = getSessionUser(req);
  if (!user)
    return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { toUserId } = req.body;
    if (!toUserId)
      return res.status(400).json({ error: 'Missing toUserId' });
    const existing = await prisma.friendRequest.findFirst({
      where: {
        fromUserId: user.id,
        toUserId,
        status: 'pending',
      },
    });
    if (existing)
      return res.status(409).json({ error: 'Request already sent' });
    const request = await prisma.friendRequest.create({
      data: {
        fromUserId: user.id,
        toUserId,
        status: 'pending',
      },
    });
    // Achievement: friend request sent
    await checkAchievements({ userId: user.id, event: 'friend_request_sent' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send request' });
  }
});

// POST /api/friends/accept - Accept friend request
router.post('/accept', async (req, res) => {
  const user = getSessionUser(req);
  if (!user)
    return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { requestId } = req.body;
    if (!requestId)
      return res.status(400).json({ error: 'Missing requestId' });
    const request = await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'accepted' },
    });
    await prisma.friend.createMany({
      data: [
        {
          userId: request.fromUserId,
          friendId: request.toUserId,
          status: 'accepted',
        },
        {
          userId: request.toUserId,
          friendId: request.fromUserId,
          status: 'accepted',
        },
      ],
      skipDuplicates: true,
    });
    // Achievement: friend accepted
    await checkAchievements({ userId: user.id, event: 'friend_accepted' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to accept request' });
  }
});

// POST /api/friends/remove - Remove friend
router.post('/remove', async (req, res) => {
	const user = getSessionUser(req);
	if (!user)
		return res.status(401).json({ error: 'Unauthorized' });
	try {
		const { friendId } = req.body;
		if (!friendId)
			return res
				.status(400)
				.json({ error: 'Missing friendId' });
		await prisma.friend.deleteMany({
			where: {
				OR: [
					{ userId: user.id, friendId },
					{ userId: friendId, friendId: user.id },
				],
			},
		});
		res.json({ success: true });
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to remove friend' });
	}
});

// GET /api/friends/requests - List incoming friend requests
router.get('/requests', async (req, res) => {
	const user = getSessionUser(req);
	if (!user)
		return res.status(401).json({ error: 'Unauthorized' });
	try {
		const requests = await prisma.friendRequest.findMany({
			where: { toUserId: user.id, status: 'pending' },
			include: {
				fromUser: {
					select: {
						id: true,
						username: true,
						photoUrl: true,
					},
				},
			},
		});
		res.json(requests);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch requests' });
	}
});

module.exports = router;
