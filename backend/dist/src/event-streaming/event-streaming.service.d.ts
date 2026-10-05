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
        isActive: boolean;
        password: string | null;
        batteryLevel: number | null;
        elevation: number | null;
        beaconMode: boolean;
        startedAt: Date;
        endedAt: Date | null;
        userId: string;
    }>;
    getLiveJourneyBroadcasts(userId: string): Promise<({
        locationUpdates: {
            id: string;
            timestamp: Date;
            broadcastId: string;
            latitude: number;
            longitude: number;
        }[];
    } & {
        id: string;
        title: string;
        isActive: boolean;
        password: string | null;
        batteryLevel: number | null;
        elevation: number | null;
        beaconMode: boolean;
        startedAt: Date;
        endedAt: Date | null;
        userId: string;
    })[]>;
    getLiveJourneyBroadcast(id: string, userId: string): Promise<{
        locationUpdates: {
            id: string;
            timestamp: Date;
            broadcastId: string;
            latitude: number;
            longitude: number;
        }[];
    } & {
        id: string;
        title: string;
        isActive: boolean;
        password: string | null;
        batteryLevel: number | null;
        elevation: number | null;
        beaconMode: boolean;
        startedAt: Date;
        endedAt: Date | null;
        userId: string;
    }>;
    updateLiveJourneyBroadcast(id: string, userId: string, dto: UpdateLiveJourneyBroadcastDto): Promise<{
        id: string;
        title: string;
        isActive: boolean;
        password: string | null;
        batteryLevel: number | null;
        elevation: number | null;
        beaconMode: boolean;
        startedAt: Date;
        endedAt: Date | null;
        userId: string;
    }>;
    endLiveJourneyBroadcast(id: string, userId: string): Promise<{
        id: string;
        title: string;
        isActive: boolean;
        password: string | null;
        batteryLevel: number | null;
        elevation: number | null;
        beaconMode: boolean;
        startedAt: Date;
        endedAt: Date | null;
        userId: string;
    }>;
    addLocationUpdate(broadcastId: string, userId: string, dto: CreateLocationUpdateDto): Promise<{
        id: string;
        timestamp: Date;
        broadcastId: string;
        latitude: number;
        longitude: number;
    }>;
    createVirtualWatchParty(userId: string, dto: CreateVirtualWatchPartyDto): Promise<{
        id: string;
        title: string;
        isActive: boolean;
        endedAt: Date | null;
        userId: string;
        roomCode: string;
        createdAt: Date;
        memoryId: string | null;
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
        title: string;
        isActive: boolean;
        endedAt: Date | null;
        userId: string;
        roomCode: string;
        createdAt: Date;
        memoryId: string | null;
    })[]>;
    joinWatchParty(roomCode: string, userId: string): Promise<{
        id: string;
        title: string;
        isActive: boolean;
        endedAt: Date | null;
        userId: string;
        roomCode: string;
        createdAt: Date;
        memoryId: string | null;
    }>;
    endWatchParty(id: string, userId: string): Promise<{
        id: string;
        title: string;
        isActive: boolean;
        endedAt: Date | null;
        userId: string;
        roomCode: string;
        createdAt: Date;
        memoryId: string | null;
    }>;
    createEventGuestWall(userId: string, dto: CreateEventGuestWallDto): Promise<{
        id: string;
        title: string;
        isActive: boolean;
        userId: string;
        createdAt: Date;
        eventType: string;
        eventDate: Date;
        qrCode: string;
    }>;
    getEventGuestWalls(userId: string): Promise<({
        contributions: {
            id: string;
            createdAt: Date;
            wallId: string;
            guestName: string;
            message: string | null;
            imageUrl: string | null;
        }[];
    } & {
        id: string;
        title: string;
        isActive: boolean;
        userId: string;
        createdAt: Date;
        eventType: string;
        eventDate: Date;
        qrCode: string;
    })[]>;
    getEventGuestWall(id: string): Promise<{
        contributions: {
            id: string;
            createdAt: Date;
            wallId: string;
            guestName: string;
            message: string | null;
            imageUrl: string | null;
        }[];
    } & {
        id: string;
        title: string;
        isActive: boolean;
        userId: string;
        createdAt: Date;
        eventType: string;
        eventDate: Date;
        qrCode: string;
    }>;
    addGuestContribution(wallId: string, dto: CreateGuestContributionDto): Promise<{
        id: string;
        createdAt: Date;
        wallId: string;
        guestName: string;
        message: string | null;
        imageUrl: string | null;
    }>;
    createTemporarySharedLink(userId: string, dto: CreateTemporarySharedLinkDto): Promise<{
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        memoryId: string | null;
        url: string;
        passcode: string | null;
        maxViews: number | null;
        viewCount: number;
        expiresAt: Date;
        isRevoked: boolean;
    }>;
    getTemporarySharedLinks(userId: string): Promise<{
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        memoryId: string | null;
        url: string;
        passcode: string | null;
        maxViews: number | null;
        viewCount: number;
        expiresAt: Date;
        isRevoked: boolean;
    }[]>;
    accessSharedLink(url: string, dto: AccessSharedLinkDto): Promise<{
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        memoryId: string | null;
        url: string;
        passcode: string | null;
        maxViews: number | null;
        viewCount: number;
        expiresAt: Date;
        isRevoked: boolean;
    }>;
    revokeSharedLink(id: string, userId: string): Promise<{
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        memoryId: string | null;
        url: string;
        passcode: string | null;
        maxViews: number | null;
        viewCount: number;
        expiresAt: Date;
        isRevoked: boolean;
    }>;
    createTravelPortfolio(userId: string, dto: CreateTravelPortfolioDto): Promise<{
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        customDomain: string | null;
        bio: string | null;
        isPublic: boolean;
    }>;
    getTravelPortfolios(userId: string): Promise<({
        featuredMemories: ({
            portfolio: {
                id: string;
                title: string;
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                customDomain: string | null;
                bio: string | null;
                isPublic: boolean;
            };
        } & {
            id: string;
            memoryId: string;
            portfolioId: string;
            order: number;
            isFeatured: boolean;
        })[];
    } & {
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        customDomain: string | null;
        bio: string | null;
        isPublic: boolean;
    })[]>;
    getPublicPortfolio(customDomain: string): Promise<{
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        customDomain: string | null;
        bio: string | null;
        isPublic: boolean;
    }>;
    updateTravelPortfolio(id: string, userId: string, dto: UpdateTravelPortfolioDto): Promise<{
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        customDomain: string | null;
        bio: string | null;
        isPublic: boolean;
    }>;
    addPortfolioMemory(portfolioId: string, userId: string, dto: AddPortfolioMemoryDto): Promise<{
        id: string;
        memoryId: string;
        portfolioId: string;
        order: number;
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
        userId: string;
        createdAt: Date;
        memoryId: string;
        stickerCode: string;
        qrCodeUrl: string;
        description: string | null;
        scansCount: number;
    }>;
    getQRCodeStickers(userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
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
        userId: string;
        createdAt: Date;
        memoryId: string;
        stickerCode: string;
        qrCodeUrl: string;
        description: string | null;
        scansCount: number;
    }>;
    createVerticalStoryExport(userId: string, dto: CreateVerticalStoryExportDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        videoUrl: string;
        resolution: string;
        format: string;
        duration: number | null;
        status: string;
        completedAt: Date | null;
    }>;
    getVerticalStoryExports(userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        videoUrl: string;
        resolution: string;
        format: string;
        duration: number | null;
        status: string;
        completedAt: Date | null;
    }[]>;
    updateVerticalStoryExportStatus(id: string, status: string, videoUrl?: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        videoUrl: string;
        resolution: string;
        format: string;
        duration: number | null;
        status: string;
        completedAt: Date | null;
    }>;
    createFriendVoiceCommentary(userId: string, dto: CreateFriendVoiceCommentaryDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        duration: number | null;
        commentatorName: string;
        audioUrl: string;
    }>;
    getFriendVoiceCommentaries(userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        duration: number | null;
        commentatorName: string;
        audioUrl: string;
    }[]>;
    getMemoryVoiceCommentaries(memoryId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        duration: number | null;
        commentatorName: string;
        audioUrl: string;
    }[]>;
    private generateRoomCode;
}
