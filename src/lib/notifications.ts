import prisma from '../../server/prismaClient';

export async function getUserNotifications(userId: string) {
	return prisma.notification.findMany({
		where: { userId },
		orderBy: { createdAt: 'desc' },
	});
}
