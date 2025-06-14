// src/lib/achievements.ts
// Centralized database service for achievement operations
import prisma from '../server/prismaClient';
import { ACHIEVEMENTS } from '../data/achievementsConfig';
import type { Achievement, Prisma } from '@prisma/client';

/**
 * Get all achievements unlocked by a user, with unlock date
 */
export async function getUserAchievements(userId: string) {
  return prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
  });
}

// Get all achievements from the DB
export async function getAllAchievements() {
  return prisma.achievement.findMany();
}

// Sync achievements config to DB (idempotent)
export async function syncAchievementsToDB() {
  for (const ach of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { label: ach.label },
      update: {
        description: ach.description,
        icon: ach.icon,
        criteria: (ach as any).criteria || {},
      },
      create: {
        label: ach.label,
        description: ach.description,
        icon: ach.icon,
        criteria: (ach as any).criteria || {},
      },
    });
  }
}

// Unlock an achievement for a user
export async function unlockAchievementForUser(userId: string, achievementId: string) {
  const already = await prisma.userAchievement.findUnique({
    where: { userId_achievementId: { userId, achievementId } },
  });
  if (already) return { unlocked: false, message: 'Already unlocked' };
  const unlocked = await prisma.userAchievement.create({
    data: { userId, achievementId },
    include: { achievement: true },
  });
  return { unlocked: true, achievement: unlocked };
}

// Criteria check logic (simplified, can be expanded as needed)
function meetsCriteria(
  criteria: any,
  event: string,
  stats: any,
  eventData: any,
  unlockedCount: number,
  totalAchievements: number
): boolean {
  if (criteria.type === 'event') {
    if (criteria.event && criteria.event !== event) return false;
    // ... (add more event checks as needed)
    return true;
  }
  if (criteria.type === 'progress' && stats && criteria.key && criteria.target) {
    return stats[criteria.key] >= criteria.target;
  }
  if (criteria.type === 'meta') {
    if (criteria.unlocked === 'all') return unlockedCount === totalAchievements;
    return unlockedCount >= criteria.unlocked;
  }
  return false;
}

function isCriteriaObject(criteria: any): criteria is { type: string } {
  return criteria && typeof criteria === 'object' && 'type' in criteria;
}

// Check and unlock achievements for a user (criteria-based)
export async function checkAndUnlockAchievements({ userId, event, stats, eventData }: { userId: string, event: string, stats: any, eventData: any }) {
  const achievements = await prisma.achievement.findMany();
  const userAchievements = await prisma.userAchievement.findMany({ where: { userId } });
  const unlocked: any[] = [];
  const unlockedCount = userAchievements.length;
  const totalAchievements = achievements.length;
  for (const ach of achievements) {
    const already = userAchievements.find((ua) => ua.achievementId === ach.id);
    if (already) continue;
    if (meetsCriteria(ach.criteria, event, stats, eventData, unlockedCount, totalAchievements)) {
      const created = await prisma.userAchievement.create({
        data: { userId, achievementId: ach.id },
        include: { achievement: true },
      });
      unlocked.push(created);
    }
  }
  // Meta achievements
  for (const ach of achievements) {
    if (isCriteriaObject(ach.criteria) && ach.criteria.type === 'meta') {
      const already = userAchievements.find((ua) => ua.achievementId === ach.id);
      if (already) continue;
      if (meetsCriteria(ach.criteria, event, stats, eventData, unlockedCount + unlocked.length, totalAchievements)) {
        const created = await prisma.userAchievement.create({
          data: { userId, achievementId: ach.id },
          include: { achievement: true },
        });
        unlocked.push(created);
      }
    }
  }
  return { unlocked };
}

/**
 * Legacy-compatible wrapper for checking and unlocking achievements
 * Used by migrated API routes
 */
export async function checkAchievements({
  userId,
  event,
  stats = null,
  eventData = null,
}: {
  userId: string;
  event: string;
  stats?: any;
  eventData?: any;
}) {
  try {
    await checkAndUnlockAchievements({ userId, event, stats, eventData });
  } catch (e) {
    // Log and swallow errors to match legacy behavior
    // eslint-disable-next-line no-console
    console.error('Achievement check failed:', (e as Error).message);
  }
}
