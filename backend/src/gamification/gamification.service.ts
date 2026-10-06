import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  // ==================== User Stats & XP ====================

  async getUserStats(userId: string) {
    let stats = await this.prisma.userStats.findUnique({
      where: { userId },
    });

    if (!stats) {
      stats = await this.prisma.userStats.create({
        data: {
          userId,
          xp: 0,
          level: 1,
          totalMemories: 0,
          totalPhotos: 0,
          totalDistance: 0,
          locationsVisited: 0,
          streakDays: 0,
          longestStreak: 0,
        },
      });
    }

    return stats;
  }

  async addXP(userId: string, amount: number) {
    const stats = await this.getUserStats(userId);
    const newXP = stats.xp + amount;

    // Level calculation: 100 XP per level
    const newLevel = Math.floor(newXP / 100) + 1;

    return this.prisma.userStats.update({
      where: { userId },
      data: {
        xp: newXP,
        level: newLevel,
      },
    });
  }

  async updateMemoryCount(userId: string) {
    const stats = await this.getUserStats(userId);
    return this.prisma.userStats.update({
      where: { userId },
      data: {
        totalMemories: { increment: 1 },
      },
    });
  }

  // ==================== Badges ====================

  async getBadges(userId: string) {
    return this.prisma.badge.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createBadge(userId: string, badgeType: string, badgeName: string, target: number) {
    return this.prisma.badge.create({
      data: {
        user: { connect: { id: userId } },
        badgeType,
        badgeName,
        rarity: 'bronze',
        progress: 0,
        target,
      },
    });
  }

  async updateBadgeProgress(badgeId: string, increment: number) {
    const badge = await this.prisma.badge.findUnique({
      where: { id: badgeId },
    });

    if (!badge) {
      throw new NotFoundException('Badge not found');
    }

    const newProgress = Math.min(badge.progress + increment, badge.target);
    const isUnlocked = newProgress >= badge.target && !badge.unlockedAt;

    const updateData: any = { progress: newProgress };
    if (isUnlocked) {
      updateData.unlockedAt = new Date();
      // Upgrade rarity based on progress
      if (badge.target >= 100) updateData.rarity = 'platinum';
      else if (badge.target >= 50) updateData.rarity = 'gold';
      else if (badge.target >= 20) updateData.rarity = 'silver';
    }

    return this.prisma.badge.update({
      where: { id: badgeId },
      data: updateData,
    });
  }

  // ==================== Journaling Streaks ====================

  async getJournalingStreak(userId: string) {
    let streak = await this.prisma.journalingStreak.findUnique({
      where: { userId },
    });

    if (!streak) {
      streak = await this.prisma.journalingStreak.create({
        data: {
          userId,
          currentStreak: 0,
          longestStreak: 0,
          freezeTokens: 3,
          milestones: '[]',
        },
      });
    }

    return streak;
  }

  async recordJournalEntry(userId: string) {
    const streak = await this.getJournalingStreak(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastJournalDate = streak.lastJournalDate
      ? new Date(streak.lastJournalDate)
      : null;
    lastJournalDate?.setHours(0, 0, 0, 0);

    const daysDiff = lastJournalDate
      ? Math.floor((today.getTime() - lastJournalDate.getTime()) / (1000 * 60 * 60 * 24))
      : 1;

    let newStreak = streak.currentStreak;

    if (daysDiff === 1) {
      // Consecutive day
      newStreak += 1;
    } else if (daysDiff > 1) {
      // Streak broken
      if (streak.freezeTokens > 0) {
        // Use freeze token
        await this.prisma.journalingStreak.update({
          where: { userId },
          data: { freezeTokens: { decrement: 1 } },
        });
      } else {
        newStreak = 1;
      }
    } else if (daysDiff === 0) {
      // Already journaled today
      return streak;
    }

    const newLongestStreak = Math.max(newStreak, streak.longestStreak);
    const milestones = JSON.parse(streak.milestones || '[]');

    // Check milestones
    if (newStreak === 7 && !milestones.includes('7')) milestones.push('7');
    if (newStreak === 30 && !milestones.includes('30')) milestones.push('30');
    if (newStreak === 100 && !milestones.includes('100')) milestones.push('100');
    if (newStreak === 365 && !milestones.includes('365')) milestones.push('365');

    return this.prisma.journalingStreak.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastJournalDate: today,
        milestones: JSON.stringify(milestones),
      },
    });
  }

  // ==================== Passport Stamps ====================

  async getPassportStamps(userId: string) {
    return this.prisma.passportStamp.findMany({
      where: { userId },
      orderBy: { stampDate: 'desc' },
    });
  }

  async addPassportStamp(
    userId: string,
    country: string,
    city: string,
    province: string,
  ) {
    // Check if already stamped this location
    const existing = await this.prisma.passportStamp.findFirst({
      where: {
        userId,
        city,
        province,
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.passportStamp.create({
      data: {
        user: { connect: { id: userId } },
        country,
        city,
        province,
        stampDesign: `${country.toLowerCase()}_vintage`,
      },
    });
  }

  // ==================== Bingo Challenges ====================

  async getBingoChallenge(year: number) {
    let challenge = await this.prisma.bingoChallenge.findFirst({
      where: { year },
    });

    if (!challenge) {
      // Create default challenges
      const defaultChallenges = [
        'Watch sunrise at sea',
        'Camp under stars',
        'Try street food',
        'Sleep in sleeper train',
        'Visit a museum',
        'Hike a mountain',
        'Swim in the ocean',
        'Visit a new city',
        'Take a road trip',
        'Visit a national park',
        'Watch sunset at beach',
        'Try local cuisine',
        'Visit a historical site',
        'Go on a boat ride',
        'Visit a market',
        'Take a cooking class',
        'Visit a festival',
        'Go camping',
        'Visit a landmark',
        'Take a night walk',
        'Visit a botanical garden',
        'Go bird watching',
        'Visit a zoo',
        'Go fishing',
        'Visit a castle',
      ];

      challenge = await this.prisma.bingoChallenge.create({
        data: {
          year,
          challenges: JSON.stringify(defaultChallenges),
          isActive: true,
        },
      });
    }

    return challenge;
  }

  async getBingoCompletion(userId: string, year: number) {
    const challenge = await this.getBingoChallenge(year);
    let completion = await this.prisma.bingoCompletion.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId: challenge.id,
        },
      },
    });

    if (!completion) {
      completion = await this.prisma.bingoCompletion.create({
        data: {
          user: { connect: { id: userId } },
          challengeId: challenge.id,
          completedIndices: '[]',
        },
      });
    }

    return { challenge, completion };
  }

  async completeBingoItem(userId: string, year: number, index: number) {
    const { challenge, completion } = await this.getBingoCompletion(userId, year);
    const completedIndices = JSON.parse(completion.completedIndices || '[]');

    if (completedIndices.includes(index)) {
      return completion;
    }

    completedIndices.push(index);

    const updated = await this.prisma.bingoCompletion.update({
      where: { id: completion.id },
      data: {
        completedIndices: JSON.stringify(completedIndices),
      },
    });

    // Check for bingo (5 in a row)
    const isBingo = this.checkBingo(completedIndices);

    if (isBingo && !completion.completedAt) {
      await this.prisma.bingoCompletion.update({
        where: { id: completion.id },
        data: { completedAt: new Date() },
      });
    }

    return updated;
  }

  private checkBingo(indices: number[]): boolean {
    // Simple check: if 5 or more items completed
    return indices.length >= 5;
  }

  // ==================== Virtual Souvenirs ====================

  async getVirtualSouvenirs(userId: string) {
    return this.prisma.virtualSouvenir.findMany({
      where: { userId },
      orderBy: { position: 'asc' },
    });
  }

  async unlockSouvenir(
    userId: string,
    name: string,
    type: string,
    location: string,
  ) {
    return this.prisma.virtualSouvenir.create({
      data: {
        user: { connect: { id: userId } },
        name,
        type,
        location,
      },
    });
  }

  async updateSouvenirPosition(id: string, userId: string, position: number) {
    const souvenir = await this.prisma.virtualSouvenir.findUnique({
      where: { id },
    });

    if (!souvenir) {
      throw new NotFoundException('Souvenir not found');
    }

    if (souvenir.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.virtualSouvenir.update({
      where: { id },
      data: { position },
    });
  }
}
