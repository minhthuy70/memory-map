
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async seedCategories() {
    const categories = [
      {
        name: 'Love',
        icon: '❤️',
      },
      {
        name: 'Family',
        icon: '👨‍👩‍👧',
      },
      {
        name: 'Friends',
        icon: '👥',
      },
      {
        name: 'Study',
        icon: '🎓',
      },
      {
        name: 'Work',
        icon: '💼',
      },
      {
        name: 'Travel',
        icon: '✈️',
      },
      {
        name: 'Event',
        icon: '🎉',
      },
      {
        name: 'Personal',
        icon: '🌱',
      },
      {
        name: 'Other',
        icon: '📌',
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
        },
        create: {
          name: category.name,
          icon: category.icon,
        },
      });

      results.push(result);
    }

    return results;
  }
}