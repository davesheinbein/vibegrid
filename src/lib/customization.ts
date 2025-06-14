// src/lib/customization.ts
// Centralized database service for customization operations

const prisma = require('../../server/prismaClient');

/**
 * Get all customization items owned by a user, with full item details
 */
export async function getUserCustomizations(
	userId: string
) {
	return prisma.userCustomization.findMany({
		where: { userId },
		include: { item: true },
	});
}

/**
 * Get user customizations grouped by type (for inventory display)
 */
export async function getUserCustomizationsGrouped(
	userId: string
) {
	const items = await getUserCustomizations(userId);
	const grouped: Record<string, any[]> = {};

	for (const { item } of items) {
		if (!grouped[item.type]) grouped[item.type] = [];
		grouped[item.type].push(item);
	}

	return grouped;
}

/**
 * Equip a customization item for a user
 */
export async function equipUserCustomization(
	userId: string,
	slot: string,
	itemId: string
) {
	const slotField = getSlotField(slot);
	if (!slotField) throw new Error('Invalid slot');

	return prisma.user.update({
		where: { id: userId },
		data: { [slotField]: itemId },
	});
}

/**
 * Add a customization item to user's inventory
 */
export async function addUserCustomization(
	userId: string,
	itemId: string,
	via?: string
) {
	return prisma.userCustomization.upsert({
		where: { userId_itemId: { userId, itemId } },
		update: {},
		create: { userId, itemId, via },
	});
}

/**
 * Remove a customization item from user's inventory
 */
export async function removeUserCustomization(
	userId: string,
	itemId: string
) {
	return prisma.userCustomization.delete({
		where: { userId_itemId: { userId, itemId } },
	});
}

/**
 * Get user's currently equipped items
 */
export async function getUserEquippedItems(userId: string) {
	return prisma.user.findUnique({
		where: { id: userId },
		select: {
			equippedThemeId: true,
			equippedFontId: true,
			equippedEmojiPackId: true,
			equippedSoundPackId: true,
			equippedTitleId: true,
			equippedFrameId: true,
			equippedBurnTrailId: true,
		},
	});
}

/**
 * Map slot names to database field names
 */
function getSlotField(slot: string): string | null {
	switch (slot) {
		case 'theme':
			return 'equippedThemeId';
		case 'font':
			return 'equippedFontId';
		case 'emoji':
		case 'emote':
			return 'equippedEmojiPackId';
		case 'sound':
			return 'equippedSoundPackId';
		case 'title':
			return 'equippedTitleId';
		case 'frame':
			return 'equippedFrameId';
		case 'burnTrail':
			return 'equippedBurnTrailId';
		default:
			return null;
	}
}
