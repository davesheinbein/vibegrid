import prisma from '../server/prismaClient';

export async function getUserStats(userId: string) {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { stats: true },
	});
	return user?.stats || null;
}
