// Grid Royale Customization Shop API
const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { getSessionUser } = require('../utils/auth');

// GET /api/customization/shop - Get current shop stock (daily rotation)
router.get('/shop', async (req, res) => {
	// TODO: Implement daily rotation logic
	const now = new Date();
	const items = await prisma.customizationItem.findMany({
		where: {
			OR: [
				{ availableAt: null },
				{ availableAt: { lte: now } },
			],
			OR: [
				{ expiresAt: null },
				{ expiresAt: { gte: now } },
			],
		},
		orderBy: { rarity: 'asc' },
		take: 20, // limit for daily shop
	});
	res.json({ items });
});

// GET /api/customization/inventory - Get user's owned items
router.get('/inventory', async (req, res) => {
	const user = getSessionUser(req);
	if (!user)
		return res.status(401).json({ error: 'Unauthorized' });
	const owned = await prisma.userCustomization.findMany({
		where: { userId: user.id },
		include: { item: true },
	});
	res.json({ owned });
});

// POST /api/customization/purchase - Purchase/unlock an item
router.post('/purchase', async (req, res) => {
	const user = getSessionUser(req);
	if (!user)
		return res.status(401).json({ error: 'Unauthorized' });
	const { itemId } = req.body;
	const item = await prisma.customizationItem.findUnique({
		where: { id: itemId },
	});
	if (!item)
		return res
			.status(404)
			.json({ error: 'Item not found' });
	// TODO: Check if already owned
	// TODO: Check currency, deduct, and add to inventory
	res.json({ success: true });
});

// POST /api/customization/equip - Equip an item or loadout
router.post('/equip', async (req, res) => {
	const user = getSessionUser(req);
	if (!user)
		return res.status(401).json({ error: 'Unauthorized' });
	const { slot, itemId } = req.body; // slot: 'theme', 'font', etc.
	// TODO: Validate ownership
	// TODO: Update user equipped field
	res.json({ success: true });
});

// POST /api/customization/loadout - Save/load a named loadout
router.post('/loadout', async (req, res) => {
	const user = getSessionUser(req);
	if (!user)
		return res.status(401).json({ error: 'Unauthorized' });
	const {
		name,
		themeId,
		fontId,
		emojiPackId,
		soundPackId,
		titleId,
		frameId,
		burnTrailId,
	} = req.body;
	// TODO: Save or update loadout
	res.json({ success: true });
});

// GET /api/customization/popular - Get most popular loadout of the day
router.get('/popular', async (req, res) => {
	// TODO: Aggregate most equipped items/loadouts
	res.json({});
});

module.exports = router;
