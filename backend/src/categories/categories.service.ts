
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Danh mục với tên này đã tồn tại');
    }

    const category = await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        icon: createCategoryDto.icon,
        color: createCategoryDto.color || '#6366f1',
      },
    });

    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      createdAt: category.createdAt,
      usageCount: 0,
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    if (updateCategoryDto.name && updateCategoryDto.name !== existingCategory.name) {
      const nameConflict = await this.prisma.category.findUnique({
        where: { name: updateCategoryDto.name },
      });

      if (nameConflict) {
        throw new ConflictException('Danh mục với tên này đã tồn tại');
      }
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        _count: {
          select: { memories: true },
        },
      },
    });

    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      createdAt: category.createdAt,
      usageCount: category._count?.memories ?? 0,
    };
  }

  async delete(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { memories: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    if (category._count?.memories > 0) {
      throw new ConflictException(
        `Không thể xóa danh mục này vì còn ${category._count.memories} kỷ niệm đang sử dụng`
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Danh mục đã được xóa thành công' };
  }
}