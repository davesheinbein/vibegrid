import prisma from '../../server/prismaClient';

export async function getUserProgression(userId: string) {
	// Fetch XP, level, and streaks from the User model
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			xp: true,
			level: true,
			// Add streaks or other progression fields if present in schema
		},
	});
	return user;
}
