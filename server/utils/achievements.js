const prisma = require('../prismaClient');
const achievementsConfig = require('../achievementsConfig');

// Check and award achievements for a user event
async function checkAchievements({
	userId,
	event,
	stats = null,
	eventData = null,
}) {
	// Fetch user achievements
	const unlocked = await prisma.userAchievement.findMany({
		where: { userId },
	});
	const unlockedLabels = new Set(
		unlocked.map((a) => a.achievementLabel)
	);

	// For each achievement in config, check if criteria met
	for (const ach of achievementsConfig) {
		if (unlockedLabels.has(ach.label)) continue;
		// Event-based achievements
		if (
			ach.criteria.type === 'event' &&
			ach.criteria.event === event
		) {
			// Optionally check count, time, or eventData
			// (Extend this logic as needed for your app)
			await prisma.userAchievement.create({
				data: {
					userId,
					achievementLabel: ach.label,
					unlockedAt: new Date(),
				},
			});
			// Optionally: notify user, award XP, etc.
		}
		// Add more logic for streaks, stats, etc. as needed
	}
}

module.exports = { checkAchievements };
