"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStreamingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const event_streaming_gateway_1 = require("./event-streaming.gateway");
const crypto = __importStar(require("crypto"));
const QRCode = __importStar(require("qrcode"));
let EventStreamingService = class EventStreamingService {
    constructor(prisma, gateway) {
        this.prisma = prisma;
        this.gateway = gateway;
    }
    async createLiveJourneyBroadcast(userId, dto) {
        return this.prisma.liveJourneyBroadcast.create({
            data: {
                userId,
                title: dto.title,
                password: dto.password,
                beaconMode: dto.beaconMode || false,
            },
        });
    }
    async getLiveJourneyBroadcasts(userId) {
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
    async getLiveJourneyBroadcast(id, userId) {
        const broadcast = await this.prisma.liveJourneyBroadcast.findUnique({
            where: { id },
            include: {
                locationUpdates: {
                    orderBy: { timestamp: 'desc' },
                },
            },
        });
        if (!broadcast) {
            throw new common_1.NotFoundException('Broadcast not found');
        }
        if (broadcast.userId !== userId && broadcast.password) {
            throw new common_1.ForbiddenException('Password protected');
        }
        return broadcast;
    }
    async updateLiveJourneyBroadcast(id, userId, dto) {
        const broadcast = await this.prisma.liveJourneyBroadcast.findUnique({
            where: { id },
        });
        if (!broadcast || broadcast.userId !== userId) {
            throw new common_1.ForbiddenException();
        }
        return this.prisma.liveJourneyBroadcast.update({
            where: { id },
            data: dto,
        });
    }
    async endLiveJourneyBroadcast(id, userId) {
        const broadcast = await this.prisma.liveJourneyBroadcast.findUnique({
            where: { id },
        });
        if (!broadcast || broadcast.userId !== userId) {
            throw new common_1.ForbiddenException();
        }
        return this.prisma.liveJourneyBroadcast.update({
            where: { id },
            data: {
                isActive: false,
                endedAt: new Date(),
            },
        });
    }
    async addLocationUpdate(broadcastId, userId, dto) {
        const broadcast = await this.prisma.liveJourneyBroadcast.findUnique({
            where: { id: broadcastId },
        });
        if (!broadcast || broadcast.userId !== userId) {
            throw new common_1.ForbiddenException();
        }
        const location = await this.prisma.liveJourneyLocation.create({
            data: {
                broadcastId,
                latitude: dto.latitude,
                longitude: dto.longitude,
            },
        });
        this.gateway.broadcastLocationUpdate(broadcastId, {
            latitude: dto.latitude,
            longitude: dto.longitude,
            timestamp: location.timestamp,
        });
        return location;
    }
    async createVirtualWatchParty(userId, dto) {
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
    async getVirtualWatchParties(userId) {
        return this.prisma.virtualWatchParty.findMany({
            where: { userId },
            include: {
                participants: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async joinWatchParty(roomCode, userId) {
        const party = await this.prisma.virtualWatchParty.findUnique({
            where: { roomCode },
        });
        if (!party || !party.isActive) {
            throw new common_1.NotFoundException('Party not found or inactive');
        }
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
    async endWatchParty(id, userId) {
        const party = await this.prisma.virtualWatchParty.findUnique({
            where: { id },
        });
        if (!party || party.userId !== userId) {
            throw new common_1.ForbiddenException();
        }
        return this.prisma.virtualWatchParty.update({
            where: { id },
            data: {
                isActive: false,
                endedAt: new Date(),
            },
        });
    }
    async createEventGuestWall(userId, dto) {
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
    async getEventGuestWalls(userId) {
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
    async getEventGuestWall(id) {
        const wall = await this.prisma.eventGuestWall.findUnique({
            where: { id },
            include: {
                contributions: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!wall) {
            throw new common_1.NotFoundException('Wall not found');
        }
        return wall;
    }
    async addGuestContribution(wallId, dto) {
        const contribution = await this.prisma.eventGuestContribution.create({
            data: {
                wallId,
                guestName: dto.guestName,
                message: dto.message,
                imageUrl: dto.imageUrl,
            },
        });
        this.gateway.broadcastGuestContribution(wallId, contribution);
        return contribution;
    }
    async createTemporarySharedLink(userId, dto) {
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
    async getTemporarySharedLinks(userId) {
        return this.prisma.temporarySharedLink.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async accessSharedLink(url, dto) {
        const link = await this.prisma.temporarySharedLink.findFirst({
            where: { url },
        });
        if (!link || link.isRevoked) {
            throw new common_1.NotFoundException('Link not found or revoked');
        }
        if (new Date() > link.expiresAt) {
            throw new common_1.ForbiddenException('Link has expired');
        }
        if (link.passcode && link.passcode !== dto.passcode) {
            throw new common_1.ForbiddenException('Invalid passcode');
        }
        if (link.maxViews && link.viewCount >= link.maxViews) {
            throw new common_1.ForbiddenException('Link has reached maximum views');
        }
        await this.prisma.temporarySharedLink.update({
            where: { url },
            data: { viewCount: { increment: 1 } },
        });
        return link;
    }
    async revokeSharedLink(id, userId) {
        const link = await this.prisma.temporarySharedLink.findFirst({
            where: { id, userId },
        });
        if (!link || link.userId !== userId) {
            throw new common_1.ForbiddenException();
        }
        return this.prisma.temporarySharedLink.update({
            where: { id },
            data: { isRevoked: true },
        });
    }
    async createTravelPortfolio(userId, dto) {
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
    async getTravelPortfolios(userId) {
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
    async getPublicPortfolio(customDomain) {
        const portfolio = await this.prisma.travelPortfolio.findFirst({
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
            throw new common_1.NotFoundException('Portfolio not found or not public');
        }
        return portfolio;
    }
    async updateTravelPortfolio(id, userId, dto) {
        const portfolio = await this.prisma.travelPortfolio.findUnique({
            where: { id },
        });
        if (!portfolio || portfolio.userId !== userId) {
            throw new common_1.ForbiddenException();
        }
        return this.prisma.travelPortfolio.update({
            where: { id },
            data: dto,
        });
    }
    async addPortfolioMemory(portfolioId, userId, dto) {
        const portfolio = await this.prisma.travelPortfolio.findUnique({
            where: { id: portfolioId },
        });
        if (!portfolio || portfolio.userId !== userId) {
            throw new common_1.ForbiddenException();
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
    async createEmbeddableMapWidget(userId, dto) {
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
    async getEmbeddableMapWidgets(userId) {
        return this.prisma.embeddableMapWidget.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getEmbeddableMapWidget(widgetId) {
        const widget = await this.prisma.embeddableMapWidget.findUnique({
            where: { widgetId },
        });
        if (!widget) {
            throw new common_1.NotFoundException('Widget not found');
        }
        return widget;
    }
    async updateEmbeddableMapWidget(id, userId, dto) {
        const widget = await this.prisma.embeddableMapWidget.findUnique({
            where: { id },
        });
        if (!widget || widget.userId !== userId) {
            throw new common_1.ForbiddenException();
        }
        return this.prisma.embeddableMapWidget.update({
            where: { id },
            data: dto,
        });
    }
    async createQRCodeSticker(userId, dto) {
        const stickerCode = crypto.randomUUID();
        const qrCodeUrl = await QRCode.toDataURL(`${process.env.FRONTEND_URL}/memories/${dto.memoryId}?sticker=${stickerCode}`);
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
    async getQRCodeStickers(userId) {
        return this.prisma.qRCodeSticker.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async scanQRCodeSticker(stickerCode) {
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
            throw new common_1.NotFoundException('Sticker not found');
        }
        await this.prisma.qRCodeSticker.update({
            where: { stickerCode },
            data: { scansCount: { increment: 1 } },
        });
        return sticker;
    }
    async createVerticalStoryExport(userId, dto) {
        return this.prisma.verticalStoryExport.create({
            data: {
                user: {
                    connect: { id: userId },
                },
                memoryId: dto.memoryId,
                resolution: dto.resolution || '1080p',
                format: dto.format || 'mp4',
                status: 'pending',
            },
        });
    }
    async getVerticalStoryExports(userId) {
        return this.prisma.verticalStoryExport.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateVerticalStoryExportStatus(id, status, videoUrl) {
        return this.prisma.verticalStoryExport.update({
            where: { id },
            data: {
                status,
                videoUrl,
                completedAt: status === 'completed' ? new Date() : null,
            },
        });
    }
    async createFriendVoiceCommentary(userId, dto) {
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
    async getFriendVoiceCommentaries(userId) {
        return this.prisma.friendVoiceCommentary.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getMemoryVoiceCommentaries(memoryId) {
        return this.prisma.friendVoiceCommentary.findMany({
            where: { memoryId },
            orderBy: { createdAt: 'desc' },
        });
    }
    generateRoomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
};
exports.EventStreamingService = EventStreamingService;
exports.EventStreamingService = EventStreamingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_streaming_gateway_1.EventStreamingGateway])
], EventStreamingService);
//# sourceMappingURL=event-streaming.service.js.map