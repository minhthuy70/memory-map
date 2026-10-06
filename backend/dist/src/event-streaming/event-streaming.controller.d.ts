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
        userId: string;
        isActive: boolean;
        title: string;
        password: string | null;
        batteryLevel: number | null;
        elevation: number | null;
        beaconMode: boolean;
        startedAt: Date;
        endedAt: Date | null;
    }>;
    getLiveJourneyBroadcasts(req: any): Promise<({
        locationUpdates: {
            id: string;
            latitude: number;
            longitude: number;
            timestamp: Date;
            broadcastId: string;
        }[];
    } & {
        id: string;
        userId: string;
        isActive: boolean;
        title: string;
        password: string | null;
        batteryLevel: number | null;
        elevation: number | null;
        beaconMode: boolean;
        startedAt: Date;
        endedAt: Date | null;
    })[]>;
    getLiveJourneyBroadcast(id: string, req: any): Promise<{
        locationUpdates: {
            id: string;
            latitude: number;
            longitude: number;
            timestamp: Date;
            broadcastId: string;
        }[];
    } & {
        id: string;
        userId: string;
        isActive: boolean;
        title: string;
        password: string | null;
        batteryLevel: number | null;
        elevation: number | null;
        beaconMode: boolean;
        startedAt: Date;
        endedAt: Date | null;
    }>;
    updateLiveJourneyBroadcast(id: string, req: any, dto: UpdateLiveJourneyBroadcastDto): Promise<{
        id: string;
        userId: string;
        isActive: boolean;
        title: string;
        password: string | null;
        batteryLevel: number | null;
        elevation: number | null;
        beaconMode: boolean;
        startedAt: Date;
        endedAt: Date | null;
    }>;
    endLiveJourneyBroadcast(id: string, req: any): Promise<{
        id: string;
        userId: string;
        isActive: boolean;
        title: string;
        password: string | null;
        batteryLevel: number | null;
        elevation: number | null;
        beaconMode: boolean;
        startedAt: Date;
        endedAt: Date | null;
    }>;
    addLocationUpdate(id: string, req: any, dto: CreateLocationUpdateDto): Promise<{
        id: string;
        latitude: number;
        longitude: number;
        timestamp: Date;
        broadcastId: string;
    }>;
    createVirtualWatchParty(req: any, dto: CreateVirtualWatchPartyDto): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        isActive: boolean;
        title: string;
        endedAt: Date | null;
        roomCode: string;
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
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        isActive: boolean;
        title: string;
        endedAt: Date | null;
        roomCode: string;
    })[]>;
    joinWatchParty(req: any, dto: {
        roomCode: string;
    }): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        isActive: boolean;
        title: string;
        endedAt: Date | null;
        roomCode: string;
    }>;
    endWatchParty(id: string, req: any): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        isActive: boolean;
        title: string;
        endedAt: Date | null;
        roomCode: string;
    }>;
    createEventGuestWall(req: any, dto: CreateEventGuestWallDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        isActive: boolean;
        title: string;
        eventType: string;
        eventDate: Date;
        qrCode: string;
    }>;
    getEventGuestWalls(req: any): Promise<({
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
        userId: string;
        createdAt: Date;
        isActive: boolean;
        title: string;
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
        userId: string;
        createdAt: Date;
        isActive: boolean;
        title: string;
        eventType: string;
        eventDate: Date;
        qrCode: string;
    }>;
    addGuestContribution(id: string, dto: CreateGuestContributionDto): Promise<{
        id: string;
        createdAt: Date;
        imageUrl: string | null;
        wallId: string;
        guestName: string;
        message: string | null;
    }>;
    createTemporarySharedLink(req: any, dto: CreateTemporarySharedLinkDto): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        title: string;
        expiresAt: Date;
        url: string;
        passcode: string | null;
        maxViews: number | null;
        viewCount: number;
        isRevoked: boolean;
    }>;
    getTemporarySharedLinks(req: any): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        title: string;
        expiresAt: Date;
        url: string;
        passcode: string | null;
        maxViews: number | null;
        viewCount: number;
        isRevoked: boolean;
    }[]>;
    accessSharedLink(dto: AccessSharedLinkDto): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        title: string;
        expiresAt: Date;
        url: string;
        passcode: string | null;
        maxViews: number | null;
        viewCount: number;
        isRevoked: boolean;
    }>;
    revokeSharedLink(id: string, req: any): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        title: string;
        expiresAt: Date;
        url: string;
        passcode: string | null;
        maxViews: number | null;
        viewCount: number;
        isRevoked: boolean;
    }>;
    createTravelPortfolio(req: any, dto: CreateTravelPortfolioDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        isPublic: boolean;
        customDomain: string | null;
        bio: string | null;
    }>;
    getTravelPortfolios(req: any): Promise<({
        featuredMemories: ({
            portfolio: {
                id: string;
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
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
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
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
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
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
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        isPublic: boolean;
        customDomain: string | null;
        bio: string | null;
    }>;
    updateTravelPortfolio(id: string, req: any, dto: UpdateTravelPortfolioDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        isPublic: boolean;
        customDomain: string | null;
        bio: string | null;
    }>;
    addPortfolioMemory(id: string, req: any, dto: AddPortfolioMemoryDto): Promise<{
        id: string;
        memoryId: string;
        order: number;
        portfolioId: string;
        isFeatured: boolean;
    }>;
    createEmbeddableMapWidget(req: any, dto: CreateEmbeddableMapWidgetDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        widgetId: string;
        theme: string;
        showControls: boolean;
        showLabels: boolean;
        customCSS: string | null;
    }>;
    getEmbeddableMapWidgets(req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        widgetId: string;
        theme: string;
        showControls: boolean;
        showLabels: boolean;
        customCSS: string | null;
    }[]>;
    getEmbeddableMapWidget(widgetId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        widgetId: string;
        theme: string;
        showControls: boolean;
        showLabels: boolean;
        customCSS: string | null;
    }>;
    updateEmbeddableMapWidget(id: string, req: any, dto: UpdateEmbeddableMapWidgetDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        widgetId: string;
        theme: string;
        showControls: boolean;
        showLabels: boolean;
        customCSS: string | null;
    }>;
    createQRCodeSticker(req: any, dto: CreateQRCodeStickerDto): Promise<{
        id: string;
        userId: string;
        memoryId: string;
        createdAt: Date;
        description: string | null;
        stickerCode: string;
        qrCodeUrl: string;
        scansCount: number;
    }>;
    getQRCodeStickers(req: any): Promise<{
        id: string;
        userId: string;
        memoryId: string;
        createdAt: Date;
        description: string | null;
        stickerCode: string;
        qrCodeUrl: string;
        scansCount: number;
    }[]>;
    scanQRCodeSticker(stickerCode: string): Promise<{
        user: {
            name: string;
        };
    } & {
        id: string;
        userId: string;
        memoryId: string;
        createdAt: Date;
        description: string | null;
        stickerCode: string;
        qrCodeUrl: string;
        scansCount: number;
    }>;
    createVerticalStoryExport(req: any, dto: CreateVerticalStoryExportDto): Promise<{
        id: string;
        userId: string;
        memoryId: string;
        createdAt: Date;
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
        memoryId: string;
        createdAt: Date;
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
        memoryId: string;
        createdAt: Date;
        duration: number | null;
        commentatorName: string;
        audioUrl: string;
    }>;
    getFriendVoiceCommentaries(req: any): Promise<{
        id: string;
        userId: string;
        memoryId: string;
        createdAt: Date;
        duration: number | null;
        commentatorName: string;
        audioUrl: string;
    }[]>;
    getMemoryVoiceCommentaries(memoryId: string): Promise<{
        id: string;
        userId: string;
        memoryId: string;
        createdAt: Date;
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
