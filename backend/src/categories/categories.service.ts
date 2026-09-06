
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        _count: {
          select: { memories: true },
        },
      },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      createdAt: category.createdAt,
      usageCount: category._count?.memories ?? 0,
    }));
  }

  async findById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: { memories: true },
        },
      },
    });

    if (!category) return null;

    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      createdAt: category.createdAt,
      usageCount: category._count?.memories ?? 0,
    };
  }

  async seedCategories() {
    const categories = [
      {
        name: 'Love',
        icon: '❤️',
        color: '#ef4444',
      },
      {
        name: 'Family',
        icon: '👨‍👩‍👧',
        color: '#3b82f6',
      },
      {
        name: 'Friends',
        icon: '👥',
        color: '#22c55e',
      },
      {
        name: 'Study',
        icon: '🎓',
        color: '#8b5cf6',
      },
      {
        name: 'Work',
        icon: '💼',
        color: '#f59e0b',
      },
      {
        name: 'Travel',
        icon: '✈️',
        color: '#06b6d4',
      },
      {
        name: 'Event',
        icon: '🎉',
        color: '#ec4899',
      },
      {
        name: 'Personal',
        icon: '🌱',
        color: '#10b981',
      },
      {
        name: 'Other',
        icon: '⭐',
        color: '#6b7280',
      },
    ];

    const results = [];

    for (const category of categories) {
      const result = await this.prisma.category.upsert({
        where: {
          name: category.name,
        },
        update: {
          icon: category.icon,
          color: category.color,
        },
        create: {
          name: category.name,
          icon: category.icon,
          color: category.color,
        },
      });

      results.push(result);
    }

    return results;
  }
}