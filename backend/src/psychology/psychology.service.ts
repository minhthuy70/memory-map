import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PsychologyService {
  constructor(private prisma: PrismaService) {}

  // ==================== Gratitude ====================

  async getGratitudeEntries(userId: string) {
    return this.prisma.gratitudeEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createGratitudeEntry(userId: string, data: any) {
    return this.prisma.gratitudeEntry.create({
      data: {
        user: { connect: { id: userId } },
        content: data.content,
        category: data.category,
        memoryId: data.memoryId,
        isShared: data.isShared ?? false,
      },
    });
  }

  // ==================== Resilience ====================

  async getResilienceMoments(userId: string) {
    return this.prisma.resilienceMoment.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async createResilienceMoment(userId: string, data: any) {
    return this.prisma.resilienceMoment.create({
      data: {
        user: { connect: { id: userId } },
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        difficulty: data.difficulty,
        selfEncouragement: data.selfEncouragement,
      },
    });
  }

  // ==================== Daily Serendipity ====================

  async getDailySerendipity(userId: string) {
    let serendipity = await this.prisma.dailySerendipity.findUnique({
      where: { userId },
    });

    if (!serendipity) {
      // Create a new one for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get a random memory (in production, this would be intelligent)
      const randomMemory = await this.prisma.memory.findFirst({
        where: { userId },
      });

      if (randomMemory) {
        serendipity = await this.prisma.dailySerendipity.create({
          data: {
            user: { connect: { id: userId } },
            memoryId: randomMemory.id,
            date: today,
          },
        });
      }
    }

    return serendipity;
  }

  async markViewed(userId: string, moodBefore: string, moodAfter: string) {
    const serendipity = await this.prisma.dailySerendipity.findUnique({
      where: { userId },
    });

    if (!serendipity) {
      throw new NotFoundException('Daily serendipity not found');
    }

    return this.prisma.dailySerendipity.update({
      where: { userId },
      data: {
        isViewed: true,
        viewedAt: new Date(),
        moodBefore,
        moodAfter,
      },
    });
  }

  // ==================== Emotional Waveform ====================

  async getEmotionalWaveforms(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    return this.prisma.emotionalWaveform.findMany({
      where,
      orderBy: { date: 'asc' },
    });
  }

  async createEmotionalWaveform(userId: string, data: any) {
    return this.prisma.emotionalWaveform.create({
      data: {
        user: { connect: { id: userId } },
        date: new Date(data.date),
        mood: data.mood,
        stressLevel: data.stressLevel,
        notes: data.notes,
      },
    });
  }

  // ==================== Dream Journal ====================

  async getDreamJournals(userId: string) {
    return this.prisma.dreamJournal.findMany({
      where: { userId },
      orderBy: { dreamDate: 'desc' },
    });
  }

  async createDreamJournal(userId: string, data: any) {
    return this.prisma.dreamJournal.create({
      data: {
        user: { connect: { id: userId } },
        title: data.title,
        description: data.description,
        dreamDate: new Date(data.dreamDate),
        isLucid: data.isLucid ?? false,
        symbols: JSON.stringify(data.symbols || []),
        locationLatitude: data.locationLatitude,
        locationLongitude: data.locationLongitude,
        locationName: data.locationName,
      },
    });
  }
}
