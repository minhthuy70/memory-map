import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  // ==================== Memory Reactions ====================

  async getReactions(memoryId: string) {
    return this.prisma.memoryReaction.findMany({
      where: { memoryId },
      include: { user: { select: { id: true, username: true, avatarUrl: true } } },
    });
  }

  async addReaction(userId: string, memoryId: string, reactionType: string) {
    // Check if reaction already exists
    const existing = await this.prisma.memoryReaction.findUnique({
      where: {
        userId_memoryId_reactionType: {
          userId,
          memoryId,
          reactionType,
        },
      },
    });

    if (existing) {
      // Remove reaction if it exists (toggle)
      return this.prisma.memoryReaction.delete({
        where: { id: existing.id },
      });
    }

    // Add new reaction
    return this.prisma.memoryReaction.create({
      data: {
        user: { connect: { id: userId } },
        memoryId,
        reactionType,
      },
    });
  }

  // ==================== Memory Comments ====================

  async getComments(memoryId: string) {
    return this.prisma.memoryComment.findMany({
      where: { memoryId, parentId: null },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
        replies: {
          include: {
            user: { select: { id: true, username: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createComment(userId: string, memoryId: string, content: string, parentId?: string) {
    return this.prisma.memoryComment.create({
      data: {
        user: { connect: { id: userId } },
        memoryId,
        parentId,
        content,
      },
    });
  }

  async deleteComment(userId: string, id: string) {
    const comment = await this.prisma.memoryComment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new NotFoundException('Access denied');
    }

    return this.prisma.memoryComment.delete({
      where: { id },
    });
  }

  // ==================== Memory Circles ====================

  async getCircles(userId: string) {
    return this.prisma.memoryCircle.findMany({
      where: { userId },
      include: {
        members: {
          include: {
            user: { select: { id: true, username: true, avatarUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCircle(userId: string, data: any) {
    const circle = await this.prisma.memoryCircle.create({
      data: {
        user: { connect: { id: userId } },
        name: data.name,
        description: data.description,
        isPublic: data.isPublic ?? false,
      },
    });

    // Add creator as admin
    await this.prisma.circleMember.create({
      data: {
        circle: { connect: { id: circle.id } },
        user: { connect: { id: userId } },
        role: 'admin',
      },
    });

    return circle;
  }

  async addCircleMember(circleId: string, userId: string, newMemberId: string) {
    // Check if user is admin
    const member = await this.prisma.circleMember.findFirst({
      where: { circleId, userId, role: 'admin' },
    });

    if (!member) {
      throw new NotFoundException('Only admins can add members');
    }

    return this.prisma.circleMember.create({
      data: {
        circle: { connect: { id: circleId } },
        user: { connect: { id: newMemberId } },
        role: 'member',
      },
    });
  }

  // ==================== Shared Albums ====================

  async getSharedAlbums(userId: string) {
    return this.prisma.sharedAlbum.findMany({
      where: {
        OR: [
          { circle: { members: { some: { userId } } } },
          { contributors: { some: { userId } } },
        ],
      },
      include: {
        circle: true,
        contributors: {
          include: {
            user: { select: { id: true, username: true, avatarUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createSharedAlbum(userId: string, data: any) {
    const album = await this.prisma.sharedAlbum.create({
      data: {
        circleId: data.circleId,
        title: data.title,
        description: data.description,
        isPublic: data.isPublic ?? false,
      },
    });

    // Add creator as admin contributor
    await this.prisma.albumContributor.create({
      data: {
        album: { connect: { id: album.id } },
        user: { connect: { id: userId } },
        permission: 'admin',
      },
    });

    return album;
  }

  async addAlbumContributor(albumId: string, userId: string, newContributorId: string, permission: string) {
    // Check if user is admin
    const contributor = await this.prisma.albumContributor.findFirst({
      where: { albumId, userId, permission: 'admin' },
    });

    if (!contributor) {
      throw new NotFoundException('Only admins can add contributors');
    }

    return this.prisma.albumContributor.create({
      data: {
        album: { connect: { id: albumId } },
        user: { connect: { id: newContributorId } },
        permission,
      },
    });
  }
}
