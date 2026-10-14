import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as dto from './dto/social.dto';

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

  // ==================== Memory Stories ====================

  async getStories(userId: string) {
    return this.prisma.memoryStory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createStory(userId: string, dto: dto.CreateMemoryStoryDto) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    return this.prisma.memoryStory.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
        expiresAt,
      },
    });
  }

  async updateStory(id: string, userId: string, dto: dto.UpdateMemoryStoryDto) {
    const story = await this.prisma.memoryStory.findUnique({ where: { id } });
    if (!story || story.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.memoryStory.update({ where: { id }, data: dto });
  }

  async deleteStory(id: string, userId: string) {
    const story = await this.prisma.memoryStory.findUnique({ where: { id } });
    if (!story || story.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.memoryStory.delete({ where: { id } });
  }

  // ==================== Community Map Feed ====================

  async getCommunityFeeds(userId: string) {
    return this.prisma.communityMapFeed.findMany({
      where: { userId },
      orderBy: { popularity: 'desc' },
    });
  }

  async createCommunityFeed(userId: string, dto: dto.CreateCommunityMapFeedDto) {
    return this.prisma.communityMapFeed.create({
      data: { user: { connect: { id: userId } }, ...dto },
    });
  }

  async updateCommunityFeed(id: string, userId: string, dto: dto.UpdateCommunityMapFeedDto) {
    const feed = await this.prisma.communityMapFeed.findUnique({ where: { id } });
    if (!feed || feed.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.communityMapFeed.update({ where: { id }, data: dto });
  }

  async deleteCommunityFeed(id: string, userId: string) {
    const feed = await this.prisma.communityMapFeed.findUnique({ where: { id } });
    if (!feed || feed.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.communityMapFeed.delete({ where: { id } });
  }

  // ==================== Nearby Friends Ping ====================

  async getNearbyPings(userId: string) {
    return this.prisma.nearbyFriendsPing.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createNearbyPing(userId: string, dto: dto.CreateNearbyFriendsPingDto) {
    return this.prisma.nearbyFriendsPing.create({
      data: { user: { connect: { id: userId } }, ...dto },
    });
  }

  async updateNearbyPing(id: string, userId: string, dto: dto.UpdateNearbyFriendsPingDto) {
    const ping = await this.prisma.nearbyFriendsPing.findUnique({ where: { id } });
    if (!ping || ping.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.nearbyFriendsPing.update({ where: { id }, data: dto });
  }

  async deleteNearbyPing(id: string, userId: string) {
    const ping = await this.prisma.nearbyFriendsPing.findUnique({ where: { id } });
    if (!ping || ping.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.nearbyFriendsPing.delete({ where: { id } });
  }

  // ==================== Co-presence Suggestion ====================

  async getCoPresenceSuggestions(userId: string) {
    return this.prisma.coPresenceSuggestion.findMany({
      where: { userId },
      orderBy: { suggestedAt: 'desc' },
    });
  }

  async createCoPresenceSuggestion(userId: string, dto: dto.CreateCoPresenceSuggestionDto) {
    return this.prisma.coPresenceSuggestion.create({
      data: { user: { connect: { id: userId } }, ...dto },
    });
  }

  async deleteCoPresenceSuggestion(id: string, userId: string) {
    const suggestion = await this.prisma.coPresenceSuggestion.findUnique({ where: { id } });
    if (!suggestion || suggestion.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.coPresenceSuggestion.delete({ where: { id } });
  }

  // ==================== Exploration Challenge ====================

  async getExplorationChallenges(userId: string) {
    return this.prisma.explorationChallenge.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createExplorationChallenge(userId: string, dto: dto.CreateExplorationChallengeDto) {
    return this.prisma.explorationChallenge.create({
      data: { user: { connect: { id: userId } }, ...dto },
    });
  }

  async updateExplorationChallenge(id: string, userId: string, dto: dto.UpdateExplorationChallengeDto) {
    const challenge = await this.prisma.explorationChallenge.findUnique({ where: { id } });
    if (!challenge || challenge.userId !== userId) throw new NotFoundException('Not found');
    const data: any = { ...dto };
    if (dto.progress && dto.progress >= challenge.targetCount) {
      data.completedAt = new Date();
    }
    return this.prisma.explorationChallenge.update({ where: { id }, data });
  }

  async deleteExplorationChallenge(id: string, userId: string) {
    const challenge = await this.prisma.explorationChallenge.findUnique({ where: { id } });
    if (!challenge || challenge.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.explorationChallenge.delete({ where: { id } });
  }

  // ==================== Memory Contest ====================

  async getMemoryContests(userId: string) {
    return this.prisma.memoryContest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createMemoryContest(userId: string, dto: dto.CreateMemoryContestDto) {
    return this.prisma.memoryContest.create({
      data: { user: { connect: { id: userId } }, ...dto, deadline: new Date(dto.deadline), votingEndsAt: new Date(dto.votingEndsAt) },
    });
  }

  async updateMemoryContest(id: string, userId: string, dto: dto.UpdateMemoryContestDto) {
    const contest = await this.prisma.memoryContest.findUnique({ where: { id } });
    if (!contest || contest.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.memoryContest.update({ where: { id }, data: dto });
  }

  async deleteMemoryContest(id: string, userId: string) {
    const contest = await this.prisma.memoryContest.findUnique({ where: { id } });
    if (!contest || contest.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.memoryContest.delete({ where: { id } });
  }

  // ==================== Digital Postcard ====================

  async getDigitalPostcards(userId: string) {
    return this.prisma.digitalPostcard.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createDigitalPostcard(userId: string, dto: dto.CreateDigitalPostcardDto) {
    return this.prisma.digitalPostcard.create({
      data: { user: { connect: { id: userId } }, ...dto },
    });
  }

  async markPostcardOpened(id: string) {
    return this.prisma.digitalPostcard.update({
      where: { id },
      data: { openedAt: new Date() },
    });
  }

  async deleteDigitalPostcard(id: string, userId: string) {
    const postcard = await this.prisma.digitalPostcard.findUnique({ where: { id } });
    if (!postcard || postcard.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.digitalPostcard.delete({ where: { id } });
  }

  // ==================== Memory Penpal ====================

  async getMemoryPenpals(userId: string) {
    return this.prisma.memoryPenpal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createMemoryPenpal(userId: string, dto: dto.CreateMemoryPenpalDto) {
    return this.prisma.memoryPenpal.create({
      data: { user: { connect: { id: userId } }, ...dto },
    });
  }

  async updateMemoryPenpal(id: string, userId: string, dto: dto.UpdateMemoryPenpalDto) {
    const penpal = await this.prisma.memoryPenpal.findUnique({ where: { id } });
    if (!penpal || penpal.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.memoryPenpal.update({ where: { id }, data: dto });
  }

  async deleteMemoryPenpal(id: string, userId: string) {
    const penpal = await this.prisma.memoryPenpal.findUnique({ where: { id } });
    if (!penpal || penpal.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.memoryPenpal.delete({ where: { id } });
  }
}
