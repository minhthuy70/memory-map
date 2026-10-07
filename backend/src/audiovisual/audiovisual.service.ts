import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AudiovisualService {
  constructor(private prisma: PrismaService) {}

  // ==================== Scrapbook Projects ====================

  async getScrapbookProjects(userId: string) {
    return this.prisma.scrapbookProject.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getScrapbookProject(userId: string, id: string) {
    const project = await this.prisma.scrapbookProject.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Scrapbook project not found');
    }

    if (project.userId !== userId && !project.isPublic) {
      throw new NotFoundException('Access denied');
    }

    return project;
  }

  async createScrapbookProject(userId: string, data: any) {
    return this.prisma.scrapbookProject.create({
      data: {
        user: { connect: { id: userId } },
        title: data.title,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        layoutData: JSON.stringify(data.layoutData || {}),
        isPublic: data.isPublic ?? false,
      },
    });
  }

  async updateScrapbookProject(userId: string, id: string, data: any) {
    const project = await this.prisma.scrapbookProject.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Scrapbook project not found');
    }

    if (project.userId !== userId) {
      throw new NotFoundException('Access denied');
    }

    return this.prisma.scrapbookProject.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        layoutData: data.layoutData ? JSON.stringify(data.layoutData) : undefined,
        isPublic: data.isPublic,
      },
    });
  }

  async deleteScrapbookProject(userId: string, id: string) {
    const project = await this.prisma.scrapbookProject.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Scrapbook project not found');
    }

    if (project.userId !== userId) {
      throw new NotFoundException('Access denied');
    }

    return this.prisma.scrapbookProject.delete({
      where: { id },
    });
  }

  // ==================== Soundscape Mixes ====================

  async getSoundscapeMixes(userId: string) {
    return this.prisma.soundscapeMix.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSoundscapeMix(userId: string, id: string) {
    const mix = await this.prisma.soundscapeMix.findUnique({
      where: { id },
    });

    if (!mix) {
      throw new NotFoundException('Soundscape mix not found');
    }

    if (mix.userId !== userId) {
      throw new NotFoundException('Access denied');
    }

    return mix;
  }

  async createSoundscapeMix(userId: string, data: any) {
    return this.prisma.soundscapeMix.create({
      data: {
        user: { connect: { id: userId } },
        title: data.title,
        memoryId: data.memoryId,
        mixData: JSON.stringify(data.mixData || {}),
        duration: data.duration || 60,
        audioUrl: data.audioUrl,
      },
    });
  }

  async updateSoundscapeMix(userId: string, id: string, data: any) {
    const mix = await this.prisma.soundscapeMix.findUnique({
      where: { id },
    });

    if (!mix) {
      throw new NotFoundException('Soundscape mix not found');
    }

    if (mix.userId !== userId) {
      throw new NotFoundException('Access denied');
    }

    return this.prisma.soundscapeMix.update({
      where: { id },
      data: {
        title: data.title,
        mixData: data.mixData ? JSON.stringify(data.mixData) : undefined,
        duration: data.duration,
        audioUrl: data.audioUrl,
      },
    });
  }

  async deleteSoundscapeMix(userId: string, id: string) {
    const mix = await this.prisma.soundscapeMix.findUnique({
      where: { id },
    });

    if (!mix) {
      throw new NotFoundException('Soundscape mix not found');
    }

    if (mix.userId !== userId) {
      throw new NotFoundException('Access denied');
    }

    return this.prisma.soundscapeMix.delete({
      where: { id },
    });
  }
}
