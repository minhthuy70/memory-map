import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateLiveJourneyBroadcastDto, 
  UpdateLiveJourneyBroadcastDto, 
  CreateLocationUpdateDto 
} from './dto/live-journey-broadcast.dto';
import { 
  CreateVirtualWatchPartyDto 
} from './dto/virtual-watch-party.dto';
import { 
  CreateEventGuestWallDto, 
  CreateGuestContributionDto 
} from './dto/event-guest-wall.dto';
import { 
  CreateTemporarySharedLinkDto, 
  AccessSharedLinkDto 
} from './dto/temporary-shared-link.dto';
import { 
  CreateTravelPortfolioDto, 
  UpdateTravelPortfolioDto, 
  AddPortfolioMemoryDto 
} from './dto/travel-portfolio.dto';
import { 
  CreateEmbeddableMapWidgetDto, 
  UpdateEmbeddableMapWidgetDto 
} from './dto/embeddable-map-widget.dto';
import { 
  CreateQRCodeStickerDto 
} from './dto/qr-code-sticker.dto';
import { 
  CreateVerticalStoryExportDto 
} from './dto/vertical-story-export.dto';
import { 
  CreateFriendVoiceCommentaryDto 
} from './dto/friend-voice-commentary.dto';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';

@Injectable()
export class EventStreamingService {
  constructor(private prisma: PrismaService) {}

  // Live Journey Broadcast
  async createLiveJourneyBroadcast(userId: string, dto: CreateLiveJourneyBroadcastDto) {
    return this.prisma.liveJourneyBroadcast.create({
      data: {
        userId,
        title: dto.title,
        password: dto.password,
        beaconMode: dto.beaconMode || false,
      },
    });
  }

  async getLiveJourneyBroadcasts(userId: string) {
    return this.prisma.liveJourneyBroadcast.findMany({
      where: { userId },
      include: {
        locationUpdates: {
          orderBy: { timestamp: 'desc' },
          take: 100,
        },
      },
      orderBy: { startedAt: 'desc' },
    });
  }

  async getLiveJourneyBroadcast(id: string, userId: string) {
    const broadcast = await this.prisma.liveJourneyBroadcast.findUnique({
      where: { id },
      include: {
        locationUpdates: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!broadcast) {
      throw new NotFoundException('Broadcast not found');
    }

    if (broadcast.userId !== userId && broadcast.password) {
      throw new ForbiddenException('Password protected');
    }

    return broadcast;
  }

  async updateLiveJourneyBroadcast(id: string, userId: string, dto: UpdateLiveJourneyBroadcastDto) {
    const broadcast = await this.prisma.liveJourneyBroadcast.findUnique({
      where: { id },
    });

    if (!broadcast || broadcast.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.liveJourneyBroadcast.update({
      where: { id },
      data: dto,
    });
  }

  async endLiveJourneyBroadcast(id: string, userId: string) {
    const broadcast = await this.prisma.liveJourneyBroadcast.findUnique({
      where: { id },
    });

    if (!broadcast || broadcast.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.liveJourneyBroadcast.update({
      where: { id },
      data: {
        isActive: false,
        endedAt: new Date(),
      },
    });
  }

  async addLocationUpdate(broadcastId: string, userId: string, dto: CreateLocationUpdateDto) {
    const broadcast = await this.prisma.liveJourneyBroadcast.findUnique({
      where: { id: broadcastId },
    });

    if (!broadcast || broadcast.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.liveJourneyLocation.create({
      data: {
        broadcastId,
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
    });
  }

  // Virtual Watch Party
  async createVirtualWatchParty(userId: string, dto: CreateVirtualWatchPartyDto) {
    const roomCode = this.generateRoomCode();
    return this.prisma.virtualWatchParty.create({
      data: {
        userId,
        title: dto.title,
        memoryId: dto.memoryId,
        roomCode,
      },
    });
  }

  async getVirtualWatchParties(userId: string) {
    return this.prisma.virtualWatchParty.findMany({
      where: { userId },
      include: {
        participants: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async joinWatchParty(roomCode: string, userId: string) {
    const party = await this.prisma.virtualWatchParty.findUnique({
      where: { roomCode },
    });

    if (!party || !party.isActive) {
      throw new NotFoundException('Party not found or inactive');
    }

    // Check if already joined
    const existing = await this.prisma.virtualWatchPartyParticipant.findFirst({
      where: {
        partyId: party.id,
        userId,
      },
    });

    if (existing) {
      return party;
    }

    await this.prisma.virtualWatchPartyParticipant.create({
      data: {
        partyId: party.id,
        userId,
      },
    });

    return party;
  }

  async endWatchParty(id: string, userId: string) {
    const party = await this.prisma.virtualWatchParty.findUnique({
      where: { id },
    });

    if (!party || party.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.virtualWatchParty.update({
      where: { id },
      data: {
        isActive: false,
        endedAt: new Date(),
      },
    });
  }

  // Event Guest Wall
  async createEventGuestWall(userId: string, dto: CreateEventGuestWallDto) {
    const qrCode = crypto.randomUUID();
    return this.prisma.eventGuestWall.create({
      data: {
        userId,
        title: dto.title,
        eventType: dto.eventType,
        eventDate: dto.eventDate,
        qrCode,
      },
    });
  }

  async getEventGuestWalls(userId: string) {
    return this.prisma.eventGuestWall.findMany({
      where: { userId },
      include: {
        contributions: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getEventGuestWall(id: string) {
    const wall = await this.prisma.eventGuestWall.findUnique({
      where: { id },
      include: {
        contributions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!wall) {
      throw new NotFoundException('Wall not found');
    }

    return wall;
  }

  async addGuestContribution(wallId: string, dto: CreateGuestContributionDto) {
    return this.prisma.eventGuestContribution.create({
      data: {
        wallId,
        guestName: dto.guestName,
        message: dto.message,
        imageUrl: dto.imageUrl,
      },
    });
  }

  // Temporary Shared Links
  async createTemporarySharedLink(userId: string, dto: CreateTemporarySharedLinkDto) {
    const url = crypto.randomUUID();
    return this.prisma.temporarySharedLink.create({
      data: {
        userId,
        memoryId: dto.memoryId,
        title: dto.title,
        url,
        passcode: dto.passcode,
        maxViews: dto.maxViews,
        expiresAt: dto.expiresAt,
      },
    });
  }

  async getTemporarySharedLinks(userId: string) {
    return this.prisma.temporarySharedLink.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async accessSharedLink(url: string, dto: AccessSharedLinkDto) {
    const link = await this.prisma.temporarySharedLink.findUnique({
      where: { url },
    });

    if (!link || link.isRevoked) {
      throw new NotFoundException('Link not found or revoked');
    }

    if (new Date() > link.expiresAt) {
      throw new ForbiddenException('Link has expired');
    }

    if (link.passcode && link.passcode !== dto.passcode) {
      throw new ForbiddenException('Invalid passcode');
    }

    if (link.maxViews && link.viewCount >= link.maxViews) {
      throw new ForbiddenException('Link has reached maximum views');
    }

    // Increment view count
    await this.prisma.temporarySharedLink.update({
      where: { url },
      data: { viewCount: { increment: 1 } },
    });

    return link;
  }

  async revokeSharedLink(id: string, userId: string) {
    const link = await this.prisma.temporarySharedLink.findUnique({
      where: { id },
    });

    if (!link || link.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.temporarySharedLink.update({
      where: { id },
      data: { isRevoked: true },
    });
  }

  // Travel Portfolio
  async createTravelPortfolio(userId: string, dto: CreateTravelPortfolioDto) {
    return this.prisma.travelPortfolio.create({
      data: {
        userId,
        title: dto.title,
        customDomain: dto.customDomain,
        bio: dto.bio,
        isPublic: dto.isPublic ?? true,
      },
    });
  }

  async getTravelPortfolios(userId: string) {
    return this.prisma.travelPortfolio.findMany({
      where: { userId },
      include: {
        featuredMemories: {
          include: {
            portfolio: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPublicPortfolio(customDomain: string) {
    const portfolio = await this.prisma.travelPortfolio.findUnique({
      where: { customDomain },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
        featuredMemories: {
          include: {
            portfolio: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!portfolio || !portfolio.isPublic) {
      throw new NotFoundException('Portfolio not found or not public');
    }

    return portfolio;
  }

  async updateTravelPortfolio(id: string, userId: string, dto: UpdateTravelPortfolioDto) {
    const portfolio = await this.prisma.travelPortfolio.findUnique({
      where: { id },
    });

    if (!portfolio || portfolio.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.travelPortfolio.update({
      where: { id },
      data: dto,
    });
  }

  async addPortfolioMemory(portfolioId: string, userId: string, dto: AddPortfolioMemoryDto) {
    const portfolio = await this.prisma.travelPortfolio.findUnique({
      where: { id: portfolioId },
    });

    if (!portfolio || portfolio.userId !== userId) {
      throw new ForbiddenException();
    }

    const count = await this.prisma.travelPortfolioMemory.count({
      where: { portfolioId },
    });

    return this.prisma.travelPortfolioMemory.create({
      data: {
        portfolioId,
        memoryId: dto.memoryId,
        order: count,
        isFeatured: dto.isFeatured ?? false,
      },
    });
  }

  // Embeddable Map Widget
  async createEmbeddableMapWidget(userId: string, dto: CreateEmbeddableMapWidgetDto) {
    const widgetId = crypto.randomUUID();
    return this.prisma.embeddableMapWidget.create({
      data: {
        userId,
        title: dto.title,
        widgetId,
        theme: dto.theme || 'light',
        showControls: dto.showControls ?? true,
        showLabels: dto.showLabels ?? true,
        customCSS: dto.customCSS,
      },
    });
  }

  async getEmbeddableMapWidgets(userId: string) {
    return this.prisma.embeddableMapWidget.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getEmbeddableMapWidget(widgetId: string) {
    const widget = await this.prisma.embeddableMapWidget.findUnique({
      where: { widgetId },
    });

    if (!widget) {
      throw new NotFoundException('Widget not found');
    }

    return widget;
  }

  async updateEmbeddableMapWidget(id: string, userId: string, dto: UpdateEmbeddableMapWidgetDto) {
    const widget = await this.prisma.embeddableMapWidget.findUnique({
      where: { id },
    });

    if (!widget || widget.userId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.embeddableMapWidget.update({
      where: { id },
      data: dto,
    });
  }

  // QR Code Stickers
  async createQRCodeSticker(userId: string, dto: CreateQRCodeStickerDto) {
    const stickerCode = crypto.randomUUID();
    const qrCodeUrl = await QRCode.toDataURL(
      `${process.env.FRONTEND_URL}/memories/${dto.memoryId}?sticker=${stickerCode}`
    );

    return this.prisma.qRCodeSticker.create({
      data: {
        userId,
        memoryId: dto.memoryId,
        stickerCode,
        qrCodeUrl,
        description: dto.description,
      },
    });
  }

  async getQRCodeStickers(userId: string) {
    return this.prisma.qRCodeSticker.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async scanQRCodeSticker(stickerCode: string) {
    const sticker = await this.prisma.qRCodeSticker.findUnique({
      where: { stickerCode },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!sticker) {
      throw new NotFoundException('Sticker not found');
    }

    // Increment scan count
    await this.prisma.qRCodeSticker.update({
      where: { stickerCode },
      data: { scansCount: { increment: 1 } },
    });

    return sticker;
  }

  // Vertical Story Export
  async createVerticalStoryExport(userId: string, dto: CreateVerticalStoryExportDto) {
    return this.prisma.verticalStoryExport.create({
      data: {
        userId,
        memoryId: dto.memoryId,
        resolution: dto.resolution || '1080p',
        format: dto.format || 'mp4',
        status: 'pending',
      },
    });
  }

  async getVerticalStoryExports(userId: string) {
    return this.prisma.verticalStoryExport.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateVerticalStoryExportStatus(id: string, status: string, videoUrl?: string) {
    return this.prisma.verticalStoryExport.update({
      where: { id },
      data: {
        status,
        videoUrl,
        completedAt: status === 'completed' ? new Date() : null,
      },
    });
  }

  // Friend Voice Commentary
  async createFriendVoiceCommentary(userId: string, dto: CreateFriendVoiceCommentaryDto) {
    return this.prisma.friendVoiceCommentary.create({
      data: {
        userId,
        memoryId: dto.memoryId,
        commentatorName: dto.commentatorName,
        audioUrl: dto.audioUrl,
        duration: dto.duration,
      },
    });
  }

  async getFriendVoiceCommentaries(userId: string) {
    return this.prisma.friendVoiceCommentary.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMemoryVoiceCommentaries(memoryId: string) {
    return this.prisma.friendVoiceCommentary.findMany({
      where: { memoryId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Helper
  private generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
