
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
      page?: number;
      limit?: number;
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

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const [memories, total] = await Promise.all([
      this.prisma.memory.findMany({
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
        skip,
        take: limit,
      }),
      this.prisma.memory.count({ where }),
    ]);

    return {
      memories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
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

  // Public Memory Links
  async generatePublicSlug(memoryId: string, userId: string) {
    const memory = await this.prisma.memory.findUnique({
      where: { id: memoryId },
    });

    if (!memory) {
      throw new NotFoundException('Memory not found');
    }

    if (memory.userId !== userId) {
      throw new ForbiddenException('You do not have permission to share this memory');
    }

    // Generate a unique slug
    const slug = this.generateSlug();
    
    const updatedMemory = await this.prisma.memory.update({
      where: { id: memoryId },
      data: {
        isPublic: true,
        publicSlug: slug,
        publicExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return {
      slug: updatedMemory.publicSlug,
      expiresAt: updatedMemory.publicExpiresAt,
      publicUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/public/${updatedMemory.publicSlug}`,
    };
  }

  async makeMemoryPrivate(memoryId: string, userId: string) {
    const memory = await this.prisma.memory.findUnique({
      where: { id: memoryId },
    });

    if (!memory) {
      throw new NotFoundException('Memory not found');
    }

    if (memory.userId !== userId) {
      throw new ForbiddenException('You do not have permission to modify this memory');
    }

    await this.prisma.memory.update({
      where: { id: memoryId },
      data: {
        isPublic: false,
        publicSlug: null,
        publicExpiresAt: null,
      },
    });

    return { message: 'Memory is now private' };
  }

  async getPublicMemoryBySlug(slug: string) {
    const memory = await this.prisma.memory.findUnique({
      where: { publicSlug: slug },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!memory) {
      throw new NotFoundException('Public memory not found or expired');
    }

    if (!memory.isPublic || !memory.publicSlug) {
      throw new NotFoundException('Memory is not public');
    }

    // Check if expired
    if (memory.publicExpiresAt && new Date() > memory.publicExpiresAt) {
      // Automatically make private if expired
      await this.prisma.memory.update({
        where: { id: memory.id },
        data: {
          isPublic: false,
          publicSlug: null,
          publicExpiresAt: null,
        },
      });
      throw new NotFoundException('Public memory link has expired');
    }

    return memory;
  }

  private generateSlug(): string {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  // Travel Statistics
  async getTravelStatistics(userId: string) {
    const memories = await this.prisma.memory.findMany({
      where: { userId },
      select: {
        latitude: true,
        longitude: true,
        memoryDate: true,
        locationName: true,
      },
      orderBy: { memoryDate: 'asc' },
    });

    if (memories.length < 2) {
      return {
        totalDistance: 0,
        averageDistance: 0,
        longestDistance: 0,
        shortestDistance: 0,
        travelDays: 0,
        uniqueLocations: memories.length,
      };
    }

    let totalDistance = 0;
    let longestDistance = 0;
    let shortestDistance = Infinity;

    for (let i = 0; i < memories.length - 1; i++) {
      const dist = this.calculateDistance(
        memories[i].latitude,
        memories[i].longitude,
        memories[i + 1].latitude,
        memories[i + 1].longitude,
      );
      totalDistance += dist;
      longestDistance = Math.max(longestDistance, dist);
      shortestDistance = Math.min(shortestDistance, dist);
    }

    // Calculate unique travel days
    const uniqueDates = new Set(
      memories.map(m => new Date(m.memoryDate).toDateString())
    );

    return {
      totalDistance: Math.round(totalDistance * 100) / 100,
      averageDistance: Math.round((totalDistance / (memories.length - 1)) * 100) / 100,
      longestDistance: Math.round(longestDistance * 100) / 100,
      shortestDistance: shortestDistance === Infinity ? 0 : Math.round(shortestDistance * 100) / 100,
      travelDays: uniqueDates.size,
      uniqueLocations: memories.length,
    };
  }

  // Location Frequency
  async getLocationFrequency(userId: string) {
    const memories = await this.prisma.memory.findMany({
      where: { userId },
      select: {
        latitude: true,
        longitude: true,
        locationName: true,
      },
    });

    const locationMap = new Map<string, { count: number; locations: { lat: number; lng: number; name: string }[] }>();

    memories.forEach(memory => {
      const key = `${memory.latitude.toFixed(4)},${memory.longitude.toFixed(4)}`;
      if (!locationMap.has(key)) {
        locationMap.set(key, {
          count: 0,
          locations: [],
        });
      }
      const locationData = locationMap.get(key)!;
      locationData.count++;
      locationData.locations.push({
        lat: memory.latitude,
        lng: memory.longitude,
        name: memory.locationName || 'Unknown',
      });
    });

    return Array.from(locationMap.entries())
      .map(([key, data]) => ({
        key,
        count: data.count,
        lat: data.locations[0].lat,
        lng: data.locations[0].lng,
        name: data.locations[0].name,
      }))
      .sort((a, b) => b.count - a.count);
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}