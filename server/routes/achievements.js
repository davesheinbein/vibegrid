const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// GET /api/achievements - List all achievements
router.get('/', async (req, res) => {
	try {
		const achievements =
			await prisma.achievement.findMany();
		res.json(achievements);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to fetch achievements' });
	}
});

// POST /api/achievements/unlock - Unlock an achievement for a user
router.post('/unlock', async (req, res) => {
	try {
		const { userId, achievementId } = req.body;
		const unlocked = await prisma.userAchievement.create({
			data: { userId, achievementId },
		});
		res.json(unlocked);
	} catch (err) {
		res
			.status(500)
			.json({ error: 'Failed to unlock achievement' });
	}
});

module.exports = router;
