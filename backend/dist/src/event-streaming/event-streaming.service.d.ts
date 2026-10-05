import { PrismaService } from '../prisma/prisma.service';
import { EventStreamingGateway } from './event-streaming.gateway';
import { CreateLiveJourneyBroadcastDto, UpdateLiveJourneyBroadcastDto, CreateLocationUpdateDto } from './dto/live-journey-broadcast.dto';
import { CreateVirtualWatchPartyDto } from './dto/virtual-watch-party.dto';
import { CreateEventGuestWallDto, CreateGuestContributionDto } from './dto/event-guest-wall.dto';
import { CreateTemporarySharedLinkDto, AccessSharedLinkDto } from './dto/temporary-shared-link.dto';
import { CreateTravelPortfolioDto, UpdateTravelPortfolioDto, AddPortfolioMemoryDto } from './dto/travel-portfolio.dto';
import { CreateEmbeddableMapWidgetDto, UpdateEmbeddableMapWidgetDto } from './dto/embeddable-map-widget.dto';
import { CreateQRCodeStickerDto } from './dto/qr-code-sticker.dto';
import { CreateVerticalStoryExportDto } from './dto/vertical-story-export.dto';
import { CreateFriendVoiceCommentaryDto } from './dto/friend-voice-commentary.dto';
export declare class EventStreamingService {
    private prisma;
    private gateway;
    constructor(prisma: PrismaService, gateway: EventStreamingGateway);
    createLiveJourneyBroadcast(userId: string, dto: CreateLiveJourneyBroadcastDto): Promise<{
        id: string;
        title: string;
        userId: string;
        isActive: boolean;
        password: string | null;
        batteryLevel: number | null;
        elevation: number | null;
        beaconMode: boolean;
        startedAt: Date;
        endedAt: Date | null;
    }>;
    getLiveJourneyBroadcasts(userId: string): Promise<({
        locationUpdates: {
            id: string;
            latitude: number;
            longitude: number;
            timestamp: Date;
            broadcastId: string;
        }[];
    } & {
        id: string;
        title: string;
        userId: string;
        isActive: boolean;
        password: string | null;
        batteryLevel: number | null;
        elevation: number | null;
        beaconMode: boolean;
        startedAt: Date;
        endedAt: Date | null;
    })[]>;
    getLiveJourneyBroadcast(id: string, userId: string): Promise<{
        locationUpdates: {
            id: string;
            latitude: number;
            longitude: number;
            timestamp: Date;
            broadcastId: string;
        }[];
    } & {
        id: string;
        title: string;
        userId: string;
        isActive: boolean;
        password: string | null;
        batteryLevel: number | null;
        elevation: number | null;
        beaconMode: boolean;
        startedAt: Date;
        endedAt: Date | null;
    }>;
    updateLiveJourneyBroadcast(id: string, userId: string, dto: UpdateLiveJourneyBroadcastDto): Promise<{
        id: string;
        title: string;
        userId: string;
        isActive: boolean;
        password: string | null;
        batteryLevel: number | null;
        elevation: number | null;
        beaconMode: boolean;
        startedAt: Date;
        endedAt: Date | null;
    }>;
    endLiveJourneyBroadcast(id: string, userId: string): Promise<{
        id: string;
        title: string;
        userId: string;
        isActive: boolean;
        password: string | null;
        batteryLevel: number | null;
        elevation: number | null;
        beaconMode: boolean;
        startedAt: Date;
        endedAt: Date | null;
    }>;
    addLocationUpdate(broadcastId: string, userId: string, dto: CreateLocationUpdateDto): Promise<{
        id: string;
        latitude: number;
        longitude: number;
        timestamp: Date;
        broadcastId: string;
    }>;
    createVirtualWatchParty(userId: string, dto: CreateVirtualWatchPartyDto): Promise<{
        id: string;
        memoryId: string | null;
        title: string;
        userId: string;
        createdAt: Date;
        isActive: boolean;
        endedAt: Date | null;
        roomCode: string;
    }>;
    getVirtualWatchParties(userId: string): Promise<({
        participants: {
            id: string;
            userId: string;
            partyId: string;
            joinedAt: Date;
        }[];
    } & {
        id: string;
        memoryId: string | null;
        title: string;
        userId: string;
        createdAt: Date;
        isActive: boolean;
        endedAt: Date | null;
        roomCode: string;
    })[]>;
    joinWatchParty(roomCode: string, userId: string): Promise<{
        id: string;
        memoryId: string | null;
        title: string;
        userId: string;
        createdAt: Date;
        isActive: boolean;
        endedAt: Date | null;
        roomCode: string;
    }>;
    endWatchParty(id: string, userId: string): Promise<{
        id: string;
        memoryId: string | null;
        title: string;
        userId: string;
        createdAt: Date;
        isActive: boolean;
        endedAt: Date | null;
        roomCode: string;
    }>;
    createEventGuestWall(userId: string, dto: CreateEventGuestWallDto): Promise<{
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        isActive: boolean;
        eventType: string;
        eventDate: Date;
        qrCode: string;
    }>;
    getEventGuestWalls(userId: string): Promise<({
        contributions: {
            id: string;
            createdAt: Date;
            imageUrl: string | null;
            wallId: string;
            guestName: string;
            message: string | null;
        }[];
    } & {
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        isActive: boolean;
        eventType: string;
        eventDate: Date;
        qrCode: string;
    })[]>;
    getEventGuestWall(id: string): Promise<{
        contributions: {
            id: string;
            createdAt: Date;
            imageUrl: string | null;
            wallId: string;
            guestName: string;
            message: string | null;
        }[];
    } & {
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        isActive: boolean;
        eventType: string;
        eventDate: Date;
        qrCode: string;
    }>;
    addGuestContribution(wallId: string, dto: CreateGuestContributionDto): Promise<{
        id: string;
        createdAt: Date;
        imageUrl: string | null;
        wallId: string;
        guestName: string;
        message: string | null;
    }>;
    createTemporarySharedLink(userId: string, dto: CreateTemporarySharedLinkDto): Promise<{
        id: string;
        memoryId: string | null;
        title: string;
        userId: string;
        createdAt: Date;
        expiresAt: Date;
        url: string;
        passcode: string | null;
        maxViews: number | null;
        viewCount: number;
        isRevoked: boolean;
    }>;
    getTemporarySharedLinks(userId: string): Promise<{
        id: string;
        memoryId: string | null;
        title: string;
        userId: string;
        createdAt: Date;
        expiresAt: Date;
        url: string;
        passcode: string | null;
        maxViews: number | null;
        viewCount: number;
        isRevoked: boolean;
    }[]>;
    accessSharedLink(url: string, dto: AccessSharedLinkDto): Promise<{
        id: string;
        memoryId: string | null;
        title: string;
        userId: string;
        createdAt: Date;
        expiresAt: Date;
        url: string;
        passcode: string | null;
        maxViews: number | null;
        viewCount: number;
        isRevoked: boolean;
    }>;
    revokeSharedLink(id: string, userId: string): Promise<{
        id: string;
        memoryId: string | null;
        title: string;
        userId: string;
        createdAt: Date;
        expiresAt: Date;
        url: string;
        passcode: string | null;
        maxViews: number | null;
        viewCount: number;
        isRevoked: boolean;
    }>;
    createTravelPortfolio(userId: string, dto: CreateTravelPortfolioDto): Promise<{
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        isPublic: boolean;
        customDomain: string | null;
        bio: string | null;
    }>;
    getTravelPortfolios(userId: string): Promise<({
        featuredMemories: ({
            portfolio: {
                id: string;
                title: string;
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                isPublic: boolean;
                customDomain: string | null;
                bio: string | null;
            };
        } & {
            id: string;
            memoryId: string;
            order: number;
            portfolioId: string;
            isFeatured: boolean;
        })[];
    } & {
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        isPublic: boolean;
        customDomain: string | null;
        bio: string | null;
    })[]>;
    getPublicPortfolio(customDomain: string): Promise<{
        user: {
            name: string;
            avatar: string;
        };
        featuredMemories: ({
            portfolio: {
                id: string;
                title: string;
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                isPublic: boolean;
                customDomain: string | null;
                bio: string | null;
            };
        } & {
            id: string;
            memoryId: string;
            order: number;
            portfolioId: string;
            isFeatured: boolean;
        })[];
    } & {
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        isPublic: boolean;
        customDomain: string | null;
        bio: string | null;
    }>;
    updateTravelPortfolio(id: string, userId: string, dto: UpdateTravelPortfolioDto): Promise<{
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        isPublic: boolean;
        customDomain: string | null;
        bio: string | null;
    }>;
    addPortfolioMemory(portfolioId: string, userId: string, dto: AddPortfolioMemoryDto): Promise<{
        id: string;
        memoryId: string;
        order: number;
        portfolioId: string;
        isFeatured: boolean;
    }>;
    createEmbeddableMapWidget(userId: string, dto: CreateEmbeddableMapWidgetDto): Promise<{
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        widgetId: string;
        theme: string;
        showControls: boolean;
        showLabels: boolean;
        customCSS: string | null;
    }>;
    getEmbeddableMapWidgets(userId: string): Promise<{
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        widgetId: string;
        theme: string;
        showControls: boolean;
        showLabels: boolean;
        customCSS: string | null;
    }[]>;
    getEmbeddableMapWidget(widgetId: string): Promise<{
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        widgetId: string;
        theme: string;
        showControls: boolean;
        showLabels: boolean;
        customCSS: string | null;
    }>;
    updateEmbeddableMapWidget(id: string, userId: string, dto: UpdateEmbeddableMapWidgetDto): Promise<{
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        widgetId: string;
        theme: string;
        showControls: boolean;
        showLabels: boolean;
        customCSS: string | null;
    }>;
    createQRCodeSticker(userId: string, dto: CreateQRCodeStickerDto): Promise<{
        id: string;
        memoryId: string;
        userId: string;
        createdAt: Date;
        stickerCode: string;
        qrCodeUrl: string;
        description: string | null;
        scansCount: number;
    }>;
    getQRCodeStickers(userId: string): Promise<{
        id: string;
        memoryId: string;
        userId: string;
        createdAt: Date;
        stickerCode: string;
        qrCodeUrl: string;
        description: string | null;
        scansCount: number;
    }[]>;
    scanQRCodeSticker(stickerCode: string): Promise<{
        user: {
            name: string;
        };
    } & {
        id: string;
        memoryId: string;
        userId: string;
        createdAt: Date;
        stickerCode: string;
        qrCodeUrl: string;
        description: string | null;
        scansCount: number;
    }>;
    createVerticalStoryExport(userId: string, dto: CreateVerticalStoryExportDto): Promise<{
        id: string;
        memoryId: string;
        userId: string;
        createdAt: Date;
        duration: number | null;
        completedAt: Date | null;
        status: string;
        videoUrl: string | null;
        resolution: string;
        format: string;
    }>;
    getVerticalStoryExports(userId: string): Promise<{
        id: string;
        memoryId: string;
        userId: string;
        createdAt: Date;
        duration: number | null;
        completedAt: Date | null;
        status: string;
        videoUrl: string | null;
        resolution: string;
        format: string;
    }[]>;
    updateVerticalStoryExportStatus(id: string, status: string, videoUrl?: string): Promise<{
        id: string;
        memoryId: string;
        userId: string;
        createdAt: Date;
        duration: number | null;
        completedAt: Date | null;
        status: string;
        videoUrl: string | null;
        resolution: string;
        format: string;
    }>;
    createFriendVoiceCommentary(userId: string, dto: CreateFriendVoiceCommentaryDto): Promise<{
        id: string;
        memoryId: string;
        userId: string;
        createdAt: Date;
        audioUrl: string;
        duration: number | null;
        commentatorName: string;
    }>;
    getFriendVoiceCommentaries(userId: string): Promise<{
        id: string;
        memoryId: string;
        userId: string;
        createdAt: Date;
        audioUrl: string;
        duration: number | null;
        commentatorName: string;
    }[]>;
    getMemoryVoiceCommentaries(memoryId: string): Promise<{
        id: string;
        memoryId: string;
        userId: string;
        createdAt: Date;
        audioUrl: string;
        duration: number | null;
        commentatorName: string;
    }[]>;
    private generateRoomCode;
}
