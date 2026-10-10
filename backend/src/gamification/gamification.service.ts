import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateFogOfWarDto,
  UpdateFogOfWarDto,
  ExploreAreaDto,
} from './dto/fog-of-war.dto';
import {
  CreateGeocacheDto,
  UpdateGeocacheDto,
  CreateGeocacheLogDto,
} from './dto/geocache.dto';
import {
  CreateARTreasureChestDto,
  UpdateARTreasureChestDto,
  UnlockARTreasureChestDto,
} from './dto/ar-treasure-chest.dto';
import {
  CreateTravelLeaderboardDto,
  UpdateTravelLeaderboardDto,
  CreateLeaderboardEntryDto,
  UpdateLeaderboardEntryDto,
} from './dto/travel-leaderboard.dto';

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

  // ==================== Fog of War Map ====================

  async getFogOfWarMap(userId: string) {
    let fogMap = await this.prisma.fogOfWarMap.findUnique({
      where: { userId },
    });

    if (!fogMap) {
      fogMap = await this.prisma.fogOfWarMap.create({
        data: {
          userId,
          exploredAreas: '[]',
          totalAreaExplored: 0,
          worldPercentage: 0,
        },
      });
    }

    return fogMap;
  }

  async updateFogOfWarMap(userId: string, dto: UpdateFogOfWarDto) {
    const fogMap = await this.getFogOfWarMap(userId);

    return this.prisma.fogOfWarMap.update({
      where: { id: fogMap.id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });
  }

  async exploreArea(userId: string, dto: ExploreAreaDto) {
    const fogMap = await this.getFogOfWarMap(userId);
    const exploredAreas = JSON.parse(fogMap.exploredAreas || '[]');

    const radius = dto.radius || 500; // 500m default
    const newArea = {
      lat: dto.latitude,
      lng: dto.longitude,
      radius,
    };

    exploredAreas.push(newArea);

    // Calculate total area (simplified)
    const totalAreaExplored = exploredAreas.length * (Math.PI * radius * radius) / 1000000; // in km²
    const worldPercentage = (totalAreaExplored / 510100000) * 100; // Earth surface area in km²

    return this.prisma.fogOfWarMap.update({
      where: { id: fogMap.id },
      data: {
        exploredAreas: JSON.stringify(exploredAreas),
        totalAreaExplored,
        worldPercentage,
        lastExploreLocation: JSON.stringify({ lat: dto.latitude, lng: dto.longitude }),
        lastExploreAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  // ==================== Geocaching ====================

  async getGeocaches(userId: string) {
    return this.prisma.geocache.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPublishedGeocaches() {
    return this.prisma.geocache.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createGeocache(userId: string, dto: CreateGeocacheDto) {
    return this.prisma.geocache.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
      },
    });
  }

  async updateGeocache(id: string, userId: string, dto: UpdateGeocacheDto) {
    const geocache = await this.prisma.geocache.findUnique({
      where: { id },
    });

    if (!geocache) {
      throw new NotFoundException('Geocache not found');
    }

    if (geocache.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.geocache.update({
      where: { id },
      data: dto,
    });
  }

  async deleteGeocache(id: string, userId: string) {
    const geocache = await this.prisma.geocache.findUnique({
      where: { id },
    });

    if (!geocache) {
      throw new NotFoundException('Geocache not found');
    }

    if (geocache.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.geocache.delete({
      where: { id },
    });
  }

  async logGeocache(geocacheId: string, userId: string, dto: CreateGeocacheLogDto) {
    const geocache = await this.prisma.geocache.findUnique({
      where: { id: geocacheId },
    });

    if (!geocache) {
      throw new NotFoundException('Geocache not found');
    }

    return this.prisma.geocacheLog.create({
      data: {
        geocacheId,
        userId,
        ...dto,
      },
    });
  }

  async getGeocacheLogs(geocacheId: string) {
    return this.prisma.geocacheLog.findMany({
      where: { geocacheId },
      orderBy: { loggedAt: 'desc' },
    });
  }

  // ==================== AR Treasure Chests ====================

  async getARTreasureChests(userId: string) {
    return this.prisma.aRTreasureChest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createARTreasureChest(userId: string, dto: CreateARTreasureChestDto) {
    return this.prisma.aRTreasureChest.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
      },
    });
  }

  async updateARTreasureChest(id: string, userId: string, dto: UpdateARTreasureChestDto) {
    const chest = await this.prisma.aRTreasureChest.findUnique({
      where: { id },
    });

    if (!chest) {
      throw new NotFoundException('AR Treasure Chest not found');
    }

    if (chest.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.aRTreasureChest.update({
      where: { id },
      data: dto,
    });
  }

  async unlockARTreasureChest(userId: string, dto: UnlockARTreasureChestDto) {
    const chest = await this.prisma.aRTreasureChest.findUnique({
      where: { id: dto.chestId },
    });

    if (!chest) {
      throw new NotFoundException('AR Treasure Chest not found');
    }

    if (chest.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (chest.isUnlocked) {
      return chest;
    }

    return this.prisma.aRTreasureChest.update({
      where: { id: dto.chestId },
      data: {
        isUnlocked: true,
        unlockedAt: new Date(),
      },
    });
  }

  // ==================== Travel Leaderboards ====================

  async getTravelLeaderboards(circleId: string) {
    return this.prisma.travelLeaderboard.findMany({
      where: { circleId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTravelLeaderboard(dto: CreateTravelLeaderboardDto) {
    return this.prisma.travelLeaderboard.create({
      data: dto,
    });
  }

  async updateTravelLeaderboard(id: string, dto: UpdateTravelLeaderboardDto) {
    return this.prisma.travelLeaderboard.update({
      where: { id },
      data: dto,
    });
  }

  async getLeaderboardEntries(leaderboardId: string) {
    return this.prisma.travelLeaderboardEntry.findMany({
      where: { leaderboardId },
      orderBy: { rank: 'asc' },
    });
  }

  async createLeaderboardEntry(userId: string, dto: CreateLeaderboardEntryDto) {
    const leaderboard = await this.prisma.travelLeaderboard.findUnique({
      where: { id: dto.leaderboardId },
    });

    if (!leaderboard) {
      throw new NotFoundException('Leaderboard not found');
    }

    const now = new Date();
    let periodStart: Date;
    let periodEnd: Date;

    if (dto.period === 'weekly') {
      periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
      periodEnd = new Date(periodStart);
      periodEnd.setDate(periodEnd.getDate() + 7);
    } else if (dto.period === 'monthly') {
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else {
      periodStart = new Date(0);
      periodEnd = new Date(9999, 11, 31);
    }

    // Check if entry already exists
    const existing = await this.prisma.travelLeaderboardEntry.findFirst({
      where: {
        leaderboardId: dto.leaderboardId,
        userId,
        periodStart,
      },
    });

    if (existing) {
      return this.prisma.travelLeaderboardEntry.update({
        where: { id: existing.id },
        data: { score: dto.score },
      });
    }

    // Create new entry and recalculate ranks
    const entry = await this.prisma.travelLeaderboardEntry.create({
      data: {
        leaderboardId: dto.leaderboardId,
        userId,
        score: dto.score,
        rank: 0,
        periodStart,
        periodEnd,
      },
    });

    // Recalculate ranks
    await this.recalculateLeaderboardRanks(dto.leaderboardId);

    return entry;
  }

  async updateLeaderboardEntry(id: string, userId: string, dto: UpdateLeaderboardEntryDto) {
    const entry = await this.prisma.travelLeaderboardEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      throw new NotFoundException('Leaderboard entry not found');
    }

    if (entry.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const updated = await this.prisma.travelLeaderboardEntry.update({
      where: { id },
      data: dto,
    });

    // Recalculate ranks
    await this.recalculateLeaderboardRanks(entry.leaderboardId);

    return updated;
  }

  private async recalculateLeaderboardRanks(leaderboardId: string) {
    const entries = await this.prisma.travelLeaderboardEntry.findMany({
      where: { leaderboardId },
      orderBy: { score: 'desc' },
    });

    for (let i = 0; i < entries.length; i++) {
      await this.prisma.travelLeaderboardEntry.update({
        where: { id: entries[i].id },
        data: { rank: i + 1 },
      });
    }
  }
}
