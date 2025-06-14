import prisma from '../server/prismaClient';

export async function getUserSettings(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true },
  });
  return user?.settings || null;
}

export async function updateUserSettings(userId: string, settings: any) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { settings },
    select: { settings: true },
  });
  return user.settings;
}
