import { EventStreamingService } from './event-streaming.service';
import { WebRTCService } from './webRTC.service';
import { CreateLiveJourneyBroadcastDto, UpdateLiveJourneyBroadcastDto, CreateLocationUpdateDto } from './dto/live-journey-broadcast.dto';
import { CreateVirtualWatchPartyDto } from './dto/virtual-watch-party.dto';
import { CreateEventGuestWallDto, CreateGuestContributionDto } from './dto/event-guest-wall.dto';
import { CreateTemporarySharedLinkDto, AccessSharedLinkDto } from './dto/temporary-shared-link.dto';
import { CreateTravelPortfolioDto, UpdateTravelPortfolioDto, AddPortfolioMemoryDto } from './dto/travel-portfolio.dto';
import { CreateEmbeddableMapWidgetDto, UpdateEmbeddableMapWidgetDto } from './dto/embeddable-map-widget.dto';
import { CreateQRCodeStickerDto } from './dto/qr-code-sticker.dto';
import { CreateVerticalStoryExportDto } from './dto/vertical-story-export.dto';
import { CreateFriendVoiceCommentaryDto } from './dto/friend-voice-commentary.dto';
export declare class EventStreamingController {
    private readonly eventStreamingService;
    private readonly webRTCService;
    constructor(eventStreamingService: EventStreamingService, webRTCService: WebRTCService);
    createLiveJourneyBroadcast(req: any, dto: CreateLiveJourneyBroadcastDto): Promise<{
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
    getLiveJourneyBroadcasts(req: any): Promise<({
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
    getLiveJourneyBroadcast(id: string, req: any): Promise<{
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
    updateLiveJourneyBroadcast(id: string, req: any, dto: UpdateLiveJourneyBroadcastDto): Promise<{
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
    endLiveJourneyBroadcast(id: string, req: any): Promise<{
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
    addLocationUpdate(id: string, req: any, dto: CreateLocationUpdateDto): Promise<{
        id: string;
        timestamp: Date;
        broadcastId: string;
        latitude: number;
        longitude: number;
    }>;
    createVirtualWatchParty(req: any, dto: CreateVirtualWatchPartyDto): Promise<{
        id: string;
        title: string;
        isActive: boolean;
        endedAt: Date | null;
        userId: string;
        roomCode: string;
        createdAt: Date;
        memoryId: string | null;
    }>;
    getVirtualWatchParties(req: any): Promise<({
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
    joinWatchParty(req: any, dto: {
        roomCode: string;
    }): Promise<{
        id: string;
        title: string;
        isActive: boolean;
        endedAt: Date | null;
        userId: string;
        roomCode: string;
        createdAt: Date;
        memoryId: string | null;
    }>;
    endWatchParty(id: string, req: any): Promise<{
        id: string;
        title: string;
        isActive: boolean;
        endedAt: Date | null;
        userId: string;
        roomCode: string;
        createdAt: Date;
        memoryId: string | null;
    }>;
    createEventGuestWall(req: any, dto: CreateEventGuestWallDto): Promise<{
        id: string;
        title: string;
        isActive: boolean;
        userId: string;
        createdAt: Date;
        eventType: string;
        eventDate: Date;
        qrCode: string;
    }>;
    getEventGuestWalls(req: any): Promise<({
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
    addGuestContribution(id: string, dto: CreateGuestContributionDto): Promise<{
        id: string;
        createdAt: Date;
        wallId: string;
        guestName: string;
        message: string | null;
        imageUrl: string | null;
    }>;
    createTemporarySharedLink(req: any, dto: CreateTemporarySharedLinkDto): Promise<{
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
    getTemporarySharedLinks(req: any): Promise<{
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
    accessSharedLink(dto: AccessSharedLinkDto): Promise<{
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
    revokeSharedLink(id: string, req: any): Promise<{
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
    createTravelPortfolio(req: any, dto: CreateTravelPortfolioDto): Promise<{
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        customDomain: string | null;
        bio: string | null;
        isPublic: boolean;
        updatedAt: Date;
    }>;
    getTravelPortfolios(req: any): Promise<({
        featuredMemories: ({
            portfolio: {
                id: string;
                title: string;
                userId: string;
                createdAt: Date;
                customDomain: string | null;
                bio: string | null;
                isPublic: boolean;
                updatedAt: Date;
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
        customDomain: string | null;
        bio: string | null;
        isPublic: boolean;
        updatedAt: Date;
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
                customDomain: string | null;
                bio: string | null;
                isPublic: boolean;
                updatedAt: Date;
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
        customDomain: string | null;
        bio: string | null;
        isPublic: boolean;
        updatedAt: Date;
    }>;
    updateTravelPortfolio(id: string, req: any, dto: UpdateTravelPortfolioDto): Promise<{
        id: string;
        title: string;
        userId: string;
        createdAt: Date;
        customDomain: string | null;
        bio: string | null;
        isPublic: boolean;
        updatedAt: Date;
    }>;
    addPortfolioMemory(id: string, req: any, dto: AddPortfolioMemoryDto): Promise<{
        id: string;
        memoryId: string;
        portfolioId: string;
        order: number;
        isFeatured: boolean;
    }>;
    createEmbeddableMapWidget(req: any, dto: CreateEmbeddableMapWidgetDto): Promise<{
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
    getEmbeddableMapWidgets(req: any): Promise<{
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
    updateEmbeddableMapWidget(id: string, req: any, dto: UpdateEmbeddableMapWidgetDto): Promise<{
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
    createQRCodeSticker(req: any, dto: CreateQRCodeStickerDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        stickerCode: string;
        qrCodeUrl: string;
        description: string | null;
        scansCount: number;
    }>;
    getQRCodeStickers(req: any): Promise<{
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
    createVerticalStoryExport(req: any, dto: CreateVerticalStoryExportDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        videoUrl: string | null;
        resolution: string;
        format: string;
        duration: number | null;
        status: string;
        completedAt: Date | null;
    }>;
    getVerticalStoryExports(req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        videoUrl: string | null;
        resolution: string;
        format: string;
        duration: number | null;
        status: string;
        completedAt: Date | null;
    }[]>;
    createFriendVoiceCommentary(req: any, dto: CreateFriendVoiceCommentaryDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        duration: number | null;
        commentatorName: string;
        audioUrl: string;
    }>;
    getFriendVoiceCommentaries(req: any): Promise<{
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
    sendWebRTCSignal(dto: {
        roomCode: string;
        signal: any;
        from: string;
        to: string;
    }): {
        success: boolean;
    };
    joinCall(dto: {
        roomCode: string;
        userId: string;
    }): {
        success: boolean;
    };
    leaveCall(dto: {
        roomCode: string;
        userId: string;
    }): {
        success: boolean;
    };
    toggleMute(dto: {
        roomCode: string;
        userId: string;
        muted: boolean;
    }): {
        success: boolean;
    };
    toggleVideo(dto: {
        roomCode: string;
        userId: string;
        videoOff: boolean;
    }): {
        success: boolean;
    };
}
