import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MemoriesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: {
    title: string;
    content?: string;
    latitude: number;
    longitude: number;
    locationName?: string;
    memoryDate: Date;
    mood: string;
    categoryId: string;
  }) {
    return this.prisma.memory.create({
      data: {
        ...data,
        mood: data.mood as any,
        categoryId: data.categoryId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
          },
        },
        category: true,
        images: true,
      },
    });
  }

  async findAll(userId: string, filters?: {
    categoryId?: string;
    mood?: string;
    from?: Date;
    to?: Date;
    search?: string;
  }) {
    const where: any = { userId };

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.mood) {
      where.mood = filters.mood;
    }

    if (filters?.from || filters?.to) {
      where.memoryDate = {};
      if (filters.from) where.memoryDate.gte = filters.from;
      if (filters.to) where.memoryDate.lte = filters.to;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
        { locationName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.memory.findMany({
      where,
      include: {
        category: true,
        images: true,
      },
      orderBy: { memoryDate: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const memory = await this.prisma.memory.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!memory) {
      throw new NotFoundException('Memory not found');
    }

    if (memory.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return memory;
  }

  async update(id: string, userId: string, data: {
    title?: string;
    content?: string;
    latitude?: number;
    longitude?: number;
    locationName?: string;
    memoryDate?: Date;
    mood?: string;
    categoryId?: string;
  }) {
    const memory = await this.findOne(id, userId);

    const updateData: any = { ...data };
    if (data.mood) {
      updateData.mood = data.mood as any;
    }

    return this.prisma.memory.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        images: true,
      },
    });
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.memory.delete({
      where: { id },
    });
  }

  async addImage(memoryId: string, userId: string, imageUrl: string) {
    await this.findOne(memoryId, userId);
    return this.prisma.memoryImage.create({
      data: {
        memoryId,
        imageUrl,
      },
    });
  }

  async deleteImage(imageId: string, userId: string) {
    const image = await this.prisma.memoryImage.findUnique({
      where: { id: imageId },
      include: { memory: true },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    if (image.memory.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.memoryImage.delete({
      where: { id: imageId },
    });
  }

  async getStatistics(userId: string) {
    const totalMemories = await this.prisma.memory.count({ where: { userId } });
    
    const memories = await this.prisma.memory.findMany({
      where: { userId },
      select: {
        latitude: true,
        longitude: true,
        mood: true,
        category: true,
        memoryDate: true,
      },
    });

    const uniqueLocations = new Set(
      memories.map(m => `${Number(m.latitude).toFixed(4)},${Number(m.longitude).toFixed(4)}`)
    ).size;

    const uniqueCategories = new Set(memories.map(m => m.categoryId)).size;

    const currentYear = new Date().getFullYear();
    const memoriesThisYear = memories.filter(m => m.memoryDate.getFullYear() === currentYear).length;

    const moodCounts = memories.reduce((acc, m) => {
      acc[m.mood] = (acc[m.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonMood = Object.entries(moodCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0];

    const categoryCounts = memories.reduce((acc, m) => {
      acc[m.category.name] = (acc[m.category.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsedCategory = Object.entries(categoryCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0];

    const memoriesByMonth = memories.reduce((acc, m) => {
      const month = m.memoryDate.toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Generate monthly activity for last 12 months
    const monthlyActivity: Record<string, number> = {};
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const monthIso = date.toISOString().slice(0, 7);
      monthlyActivity[monthKey] = memoriesByMonth[monthIso] || 0;
    }

    return {
      totalMemories,
      placesVisited: uniqueLocations,
      uniqueLocations,
      uniqueCategories,
      memoriesThisYear,
      mostCommonMood: mostCommonMood ? mostCommonMood[0] : null,
      mostUsedCategory: mostUsedCategory ? mostUsedCategory[0] : null,
      memoriesByMonth,
      monthlyActivity,
      memoriesByCategory: categoryCounts,
      categoryDistribution: categoryCounts,
      memoriesByMood: moodCounts,
      moodDistribution: moodCounts,
    };
  }
}
