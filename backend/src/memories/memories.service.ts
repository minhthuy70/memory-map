
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Mood, Prisma } from '@prisma/client';

export interface ExportMemory {
  id: string;
  title: string;
  content?: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  memoryDate: string;
  mood: string;
  category: {
    name: string;
    icon: string;
    color: string;
  };
  images: {
    imageUrl: string;
    order: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class MemoriesService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    data: {
      title: string;
      content?: string;
      latitude: number;
      longitude: number;
      locationName?: string;
      memoryDate: Date;
      mood: Mood;
      categoryId: string;
      reminderDate?: Date;
    },
  ) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return this.prisma.memory.create({
      data: {
        title: data.title,
        content: data.content,
        latitude: data.latitude,
        longitude: data.longitude,
        locationName: data.locationName,
        memoryDate: data.memoryDate,
        mood: data.mood,
        categoryId: data.categoryId,
        reminderDate: data.reminderDate,
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

  async findAll(
    userId: string,
    filters?: {
      categoryId?: string;
      mood?: string;
      from?: Date;
      to?: Date;
      search?: string;
    },
  ) {
    const where: Prisma.MemoryWhereInput = {
      userId,
    };

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.mood) {
      if (Object.values(Mood).includes(filters.mood as Mood)) {
        where.mood = filters.mood as Mood;
      }
    }

    if (filters?.from || filters?.to) {
      where.memoryDate = {};

      if (filters.from) {
        where.memoryDate.gte = filters.from;
      }

      if (filters.to) {
        where.memoryDate.lte = filters.to;
      }
    }

    if (filters?.search) {
      where.OR = [
        {
          title: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          content: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          locationName: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    return this.prisma.memory.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        memoryDate: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const memory = await this.prisma.memory.findUnique({
      where: {
        id,
      },
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

  async update(
    id: string,
    userId: string,
    data: {
      title?: string;
      content?: string;
      latitude?: number;
      longitude?: number;
      locationName?: string;
      memoryDate?: Date;
      mood?: Mood;
      categoryId?: string;
      reminderDate?: Date;
    },
  ) {
    await this.findOne(id, userId);

    if (data.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: {
          id: data.categoryId,
        },
      });

      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    const updateData: Prisma.MemoryUpdateInput = {
      title: data.title,
      content: data.content,
      latitude: data.latitude,
      longitude: data.longitude,
      locationName: data.locationName,
      memoryDate: data.memoryDate,
      mood: data.mood,
      reminderDate: data.reminderDate,
    };

    if (data.categoryId) {
      updateData.category = {
        connect: {
          id: data.categoryId,
        },
      };
    }

    return this.prisma.memory.update({
      where: {
        id,
      },
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
      where: {
        id,
      },
    });
  }

  async addImage(
    memoryId: string,
    userId: string,
    imageUrl: string,
  ) {
    await this.findOne(memoryId, userId);

    if (!imageUrl || !imageUrl.trim()) {
      throw new BadRequestException('Image URL is required');
    }

    // Get the current highest order for this memory
    const images = await this.prisma.memoryImage.findMany({
      where: { memoryId },
      orderBy: { order: 'desc' },
      take: 1,
    });

    const nextOrder = images.length > 0 ? images[0].order + 1 : 0;

    return this.prisma.memoryImage.create({
      data: {
        memoryId,
        imageUrl: imageUrl.trim(),
        order: nextOrder,
      },
    });
  }

  async deleteImage(
    imageId: string,
    userId: string,
  ) {
    const image = await this.prisma.memoryImage.findUnique({
      where: {
        id: imageId,
      },
      include: {
        memory: true,
      },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    if (image.memory.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.memoryImage.delete({
      where: {
        id: imageId,
      },
    });
  }

  async updateImageOrder(
    imageId: string,
    userId: string,
    order: number,
  ) {
    const image = await this.prisma.memoryImage.findUnique({
      where: {
        id: imageId,
      },
      include: {
        memory: true,
      },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    if (image.memory.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.memoryImage.update({
      where: {
        id: imageId,
      },
      data: {
        order,
      },
    });
  }

  async getStatistics(userId: string) {
    const totalMemories = await this.prisma.memory.count({
      where: {
        userId,
      },
    });

    const memories = await this.prisma.memory.findMany({
      where: {
        userId,
      },
      select: {
        latitude: true,
        longitude: true,
        mood: true,
        categoryId: true,
        category: true,
        memoryDate: true,
      },
    });

    const uniqueLocations = new Set(
      memories.map(
        (memory) =>
          `${Number(memory.latitude).toFixed(4)},${Number(
            memory.longitude,
          ).toFixed(4)}`,
      ),
    ).size;

    const uniqueCategories = new Set(
      memories.map((memory) => memory.categoryId),
    ).size;

    const currentYear = new Date().getFullYear();

    const memoriesThisYear = memories.filter(
      (memory) =>
        memory.memoryDate.getFullYear() === currentYear,
    ).length;

    const moodCounts = memories.reduce(
      (acc, memory) => {
        acc[memory.mood] = (acc[memory.mood] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const mostCommonMood =
      Object.entries(moodCounts).sort(
        (a, b) => b[1] - a[1],
      )[0];

    const categoryCounts = memories.reduce(
      (acc, memory) => {
        const categoryName = memory.category.name;

        acc[categoryName] =
          (acc[categoryName] || 0) + 1;

        return acc;
      },
      {} as Record<string, number>,
    );

    const mostUsedCategory =
      Object.entries(categoryCounts).sort(
        (a, b) => b[1] - a[1],
      )[0];

    const memoriesByMonth = memories.reduce(
      (acc, memory) => {
        const month = memory.memoryDate
          .toISOString()
          .slice(0, 7);

        acc[month] = (acc[month] || 0) + 1;

        return acc;
      },
      {} as Record<string, number>,
    );

    const monthlyActivity: Record<string, number> = {};

    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1,
      );

      const monthKey = date.toLocaleDateString(
        'en-US',
        {
          month: 'short',
          year: 'numeric',
        },
      );

      const monthIso = date
        .toISOString()
        .slice(0, 7);

      monthlyActivity[monthKey] =
        memoriesByMonth[monthIso] || 0;
    }

    return {
      totalMemories,

      placesVisited: uniqueLocations,

      uniqueLocations,

      uniqueCategories,

      memoriesThisYear,

      mostCommonMood: mostCommonMood
        ? mostCommonMood[0]
        : null,

      mostUsedCategory: mostUsedCategory
        ? mostUsedCategory[0]
        : null,

      memoriesByMonth,

      monthlyActivity,

      memoriesByCategory: categoryCounts,

      categoryDistribution: categoryCounts,

      memoriesByMood: moodCounts,

      moodDistribution: moodCounts,
    };
  }

  async getUpcomingReminders(userId: string): Promise<any[]> {
    const now = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

    const memories = await this.prisma.memory.findMany({
      where: {
        userId,
        reminderDate: {
          gte: now,
          lte: oneWeekFromNow,
        },
        reminderSent: false,
      },
      include: {
        category: true,
      },
      orderBy: {
        reminderDate: 'asc',
      },
    });

    return memories;
  }

  async markReminderSent(memoryId: string, userId: string): Promise<void> {
    await this.findOne(memoryId, userId);

    await this.prisma.memory.update({
      where: { id: memoryId },
      data: { reminderSent: true },
    });
  }

  async exportMemories(userId: string): Promise<ExportMemory[]> {
    const memories = await this.prisma.memory.findMany({
      where: { userId },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { memoryDate: 'desc' },
    });

    return memories.map((memory) => ({
      id: memory.id,
      title: memory.title,
      content: memory.content,
      latitude: memory.latitude,
      longitude: memory.longitude,
      locationName: memory.locationName,
      memoryDate: memory.memoryDate.toISOString(),
      mood: memory.mood,
      category: {
        name: memory.category.name,
        icon: memory.category.icon,
        color: memory.category.color,
      },
      images: memory.images.map((img) => ({
        imageUrl: img.imageUrl,
        order: img.order,
      })),
      createdAt: memory.createdAt.toISOString(),
      updatedAt: memory.updatedAt.toISOString(),
    }));
  }

  async importMemories(
    userId: string,
    memories: ExportMemory[],
  ): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = [];
    let imported = 0;

    for (const memoryData of memories) {
      try {
        // Find or create category
        let category = await this.prisma.category.findUnique({
          where: { name: memoryData.category.name },
        });

        if (!category) {
          category = await this.prisma.category.create({
            data: {
              name: memoryData.category.name,
              icon: memoryData.category.icon,
              color: memoryData.category.color,
            },
          });
        }

        // Create memory
        const memory = await this.prisma.memory.create({
          data: {
            userId,
            title: memoryData.title,
            content: memoryData.content,
            latitude: memoryData.latitude,
            longitude: memoryData.longitude,
            locationName: memoryData.locationName,
            memoryDate: new Date(memoryData.memoryDate),
            mood: memoryData.mood as Mood,
            categoryId: category.id,
          },
        });

        // Create images
        for (const imageData of memoryData.images) {
          await this.prisma.memoryImage.create({
            data: {
              memoryId: memory.id,
              imageUrl: imageData.imageUrl,
              order: imageData.order,
            },
          });
        }

        imported++;
      } catch (error) {
        errors.push(`Failed to import memory "${memoryData.title}": ${error}`);
      }
    }

    return { imported, errors };
  }
}