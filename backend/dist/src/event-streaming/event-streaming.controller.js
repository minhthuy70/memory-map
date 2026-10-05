"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStreamingController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const event_streaming_service_1 = require("./event-streaming.service");
const webRTC_service_1 = require("./webRTC.service");
const live_journey_broadcast_dto_1 = require("./dto/live-journey-broadcast.dto");
const virtual_watch_party_dto_1 = require("./dto/virtual-watch-party.dto");
const event_guest_wall_dto_1 = require("./dto/event-guest-wall.dto");
const temporary_shared_link_dto_1 = require("./dto/temporary-shared-link.dto");
const travel_portfolio_dto_1 = require("./dto/travel-portfolio.dto");
const embeddable_map_widget_dto_1 = require("./dto/embeddable-map-widget.dto");
const qr_code_sticker_dto_1 = require("./dto/qr-code-sticker.dto");
const vertical_story_export_dto_1 = require("./dto/vertical-story-export.dto");
const friend_voice_commentary_dto_1 = require("./dto/friend-voice-commentary.dto");
let EventStreamingController = class EventStreamingController {
    constructor(eventStreamingService, webRTCService) {
        this.eventStreamingService = eventStreamingService;
        this.webRTCService = webRTCService;
    }
    createLiveJourneyBroadcast(req, dto) {
        return this.eventStreamingService.createLiveJourneyBroadcast(req.user.userId, dto);
    }
    getLiveJourneyBroadcasts(req) {
        return this.eventStreamingService.getLiveJourneyBroadcasts(req.user.userId);
    }
    getLiveJourneyBroadcast(id, req) {
        return this.eventStreamingService.getLiveJourneyBroadcast(id, req.user.userId);
    }
    updateLiveJourneyBroadcast(id, req, dto) {
        return this.eventStreamingService.updateLiveJourneyBroadcast(id, req.user.userId, dto);
    }
    endLiveJourneyBroadcast(id, req) {
        return this.eventStreamingService.endLiveJourneyBroadcast(id, req.user.userId);
    }
    addLocationUpdate(id, req, dto) {
        return this.eventStreamingService.addLocationUpdate(id, req.user.userId, dto);
    }
    createVirtualWatchParty(req, dto) {
        return this.eventStreamingService.createVirtualWatchParty(req.user.userId, dto);
    }
    getVirtualWatchParties(req) {
        return this.eventStreamingService.getVirtualWatchParties(req.user.userId);
    }
    joinWatchParty(req, dto) {
        return this.eventStreamingService.joinWatchParty(dto.roomCode, req.user.userId);
    }
    endWatchParty(id, req) {
        return this.eventStreamingService.endWatchParty(id, req.user.userId);
    }
    createEventGuestWall(req, dto) {
        return this.eventStreamingService.createEventGuestWall(req.user.userId, dto);
    }
    getEventGuestWalls(req) {
        return this.eventStreamingService.getEventGuestWalls(req.user.userId);
    }
    getEventGuestWall(id) {
        return this.eventStreamingService.getEventGuestWall(id);
    }
    addGuestContribution(id, dto) {
        return this.eventStreamingService.addGuestContribution(id, dto);
    }
    createTemporarySharedLink(req, dto) {
        return this.eventStreamingService.createTemporarySharedLink(req.user.userId, dto);
    }
    getTemporarySharedLinks(req) {
        return this.eventStreamingService.getTemporarySharedLinks(req.user.userId);
    }
    accessSharedLink(dto) {
        return this.eventStreamingService.accessSharedLink(dto.url, dto);
    }
    revokeSharedLink(id, req) {
        return this.eventStreamingService.revokeSharedLink(id, req.user.userId);
    }
    createTravelPortfolio(req, dto) {
        return this.eventStreamingService.createTravelPortfolio(req.user.userId, dto);
    }
    getTravelPortfolios(req) {
        return this.eventStreamingService.getTravelPortfolios(req.user.userId);
    }
    getPublicPortfolio(customDomain) {
        return this.eventStreamingService.getPublicPortfolio(customDomain);
    }
    updateTravelPortfolio(id, req, dto) {
        return this.eventStreamingService.updateTravelPortfolio(id, req.user.userId, dto);
    }
    addPortfolioMemory(id, req, dto) {
        return this.eventStreamingService.addPortfolioMemory(id, req.user.userId, dto);
    }
    createEmbeddableMapWidget(req, dto) {
        return this.eventStreamingService.createEmbeddableMapWidget(req.user.userId, dto);
    }
    getEmbeddableMapWidgets(req) {
        return this.eventStreamingService.getEmbeddableMapWidgets(req.user.userId);
    }
    getEmbeddableMapWidget(widgetId) {
        return this.eventStreamingService.getEmbeddableMapWidget(widgetId);
    }
    updateEmbeddableMapWidget(id, req, dto) {
        return this.eventStreamingService.updateEmbeddableMapWidget(id, req.user.userId, dto);
    }
    createQRCodeSticker(req, dto) {
        return this.eventStreamingService.createQRCodeSticker(req.user.userId, dto);
    }
    getQRCodeStickers(req) {
        return this.eventStreamingService.getQRCodeStickers(req.user.userId);
    }
    scanQRCodeSticker(stickerCode) {
        return this.eventStreamingService.scanQRCodeSticker(stickerCode);
    }
    createVerticalStoryExport(req, dto) {
        return this.eventStreamingService.createVerticalStoryExport(req.user.userId, dto);
    }
    getVerticalStoryExports(req) {
        return this.eventStreamingService.getVerticalStoryExports(req.user.userId);
    }
    createFriendVoiceCommentary(req, dto) {
        return this.eventStreamingService.createFriendVoiceCommentary(req.user.userId, dto);
    }
    getFriendVoiceCommentaries(req) {
        return this.eventStreamingService.getFriendVoiceCommentaries(req.user.userId);
    }
    getMemoryVoiceCommentaries(memoryId) {
        return this.eventStreamingService.getMemoryVoiceCommentaries(memoryId);
    }
    sendWebRTCSignal(dto) {
        this.webRTCService.sendSignal(dto.roomCode, {
            type: dto.signal.type,
            from: dto.from,
            to: dto.to,
            data: dto.signal.data,
        });
        return { success: true };
    }
    joinCall(dto) {
        this.webRTCService.handleJoinCall(dto.roomCode, dto.userId);
        return { success: true };
    }
    leaveCall(dto) {
        this.webRTCService.handleLeaveCall(dto.roomCode, dto.userId);
        return { success: true };
    }
    toggleMute(dto) {
        this.webRTCService.toggleMute(dto.roomCode, dto.userId, dto.muted);
        return { success: true };
    }
    toggleVideo(dto) {
        this.webRTCService.toggleVideo(dto.roomCode, dto.userId, dto.videoOff);
        return { success: true };
    }
};
exports.EventStreamingController = EventStreamingController;
__decorate([
    (0, common_1.Post)('live-journey'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, live_journey_broadcast_dto_1.CreateLiveJourneyBroadcastDto]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "createLiveJourneyBroadcast", null);
__decorate([
    (0, common_1.Get)('live-journey'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "getLiveJourneyBroadcasts", null);
__decorate([
    (0, common_1.Get)('live-journey/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "getLiveJourneyBroadcast", null);
__decorate([
    (0, common_1.Put)('live-journey/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, live_journey_broadcast_dto_1.UpdateLiveJourneyBroadcastDto]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "updateLiveJourneyBroadcast", null);
__decorate([
    (0, common_1.Post)('live-journey/:id/end'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "endLiveJourneyBroadcast", null);
__decorate([
    (0, common_1.Post)('live-journey/:id/location'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, live_journey_broadcast_dto_1.CreateLocationUpdateDto]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "addLocationUpdate", null);
__decorate([
    (0, common_1.Post)('watch-party'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, virtual_watch_party_dto_1.CreateVirtualWatchPartyDto]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "createVirtualWatchParty", null);
__decorate([
    (0, common_1.Get)('watch-party'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "getVirtualWatchParties", null);
__decorate([
    (0, common_1.Post)('watch-party/join'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "joinWatchParty", null);
__decorate([
    (0, common_1.Post)('watch-party/:id/end'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "endWatchParty", null);
__decorate([
    (0, common_1.Post)('guest-wall'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, event_guest_wall_dto_1.CreateEventGuestWallDto]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "createEventGuestWall", null);
__decorate([
    (0, common_1.Get)('guest-wall'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "getEventGuestWalls", null);
__decorate([
    (0, common_1.Get)('guest-wall/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "getEventGuestWall", null);
__decorate([
    (0, common_1.Post)('guest-wall/:id/contribution'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, event_guest_wall_dto_1.CreateGuestContributionDto]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "addGuestContribution", null);
__decorate([
    (0, common_1.Post)('shared-link'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, temporary_shared_link_dto_1.CreateTemporarySharedLinkDto]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "createTemporarySharedLink", null);
__decorate([
    (0, common_1.Get)('shared-link'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "getTemporarySharedLinks", null);
__decorate([
    (0, common_1.Post)('shared-link/access'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [temporary_shared_link_dto_1.AccessSharedLinkDto]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "accessSharedLink", null);
__decorate([
    (0, common_1.Post)('shared-link/:id/revoke'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "revokeSharedLink", null);
__decorate([
    (0, common_1.Post)('portfolio'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, travel_portfolio_dto_1.CreateTravelPortfolioDto]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "createTravelPortfolio", null);
__decorate([
    (0, common_1.Get)('portfolio'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "getTravelPortfolios", null);
__decorate([
    (0, common_1.Get)('portfolio/public/:customDomain'),
    __param(0, (0, common_1.Param)('customDomain')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "getPublicPortfolio", null);
__decorate([
    (0, common_1.Put)('portfolio/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, travel_portfolio_dto_1.UpdateTravelPortfolioDto]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "updateTravelPortfolio", null);
__decorate([
    (0, common_1.Post)('portfolio/:id/memory'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, travel_portfolio_dto_1.AddPortfolioMemoryDto]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "addPortfolioMemory", null);
__decorate([
    (0, common_1.Post)('map-widget'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, embeddable_map_widget_dto_1.CreateEmbeddableMapWidgetDto]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "createEmbeddableMapWidget", null);
__decorate([
    (0, common_1.Get)('map-widget'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "getEmbeddableMapWidgets", null);
__decorate([
    (0, common_1.Get)('map-widget/widget/:widgetId'),
    __param(0, (0, common_1.Param)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "getEmbeddableMapWidget", null);
__decorate([
    (0, common_1.Put)('map-widget/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, embeddable_map_widget_dto_1.UpdateEmbeddableMapWidgetDto]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "updateEmbeddableMapWidget", null);
__decorate([
    (0, common_1.Post)('qr-sticker'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, qr_code_sticker_dto_1.CreateQRCodeStickerDto]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "createQRCodeSticker", null);
__decorate([
    (0, common_1.Get)('qr-sticker'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "getQRCodeStickers", null);
__decorate([
    (0, common_1.Post)('qr-sticker/scan/:stickerCode'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('stickerCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "scanQRCodeSticker", null);
__decorate([
    (0, common_1.Post)('vertical-story'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, vertical_story_export_dto_1.CreateVerticalStoryExportDto]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "createVerticalStoryExport", null);
__decorate([
    (0, common_1.Get)('vertical-story'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "getVerticalStoryExports", null);
__decorate([
    (0, common_1.Post)('voice-commentary'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, friend_voice_commentary_dto_1.CreateFriendVoiceCommentaryDto]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "createFriendVoiceCommentary", null);
__decorate([
    (0, common_1.Get)('voice-commentary'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "getFriendVoiceCommentaries", null);
__decorate([
    (0, common_1.Get)('voice-commentary/memory/:memoryId'),
    __param(0, (0, common_1.Param)('memoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "getMemoryVoiceCommentaries", null);
__decorate([
    (0, common_1.Post)('webrtc/signal'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "sendWebRTCSignal", null);
__decorate([
    (0, common_1.Post)('webrtc/join-call'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "joinCall", null);
__decorate([
    (0, common_1.Post)('webrtc/leave-call'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "leaveCall", null);
__decorate([
    (0, common_1.Post)('webrtc/toggle-mute'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "toggleMute", null);
__decorate([
    (0, common_1.Post)('webrtc/toggle-video'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventStreamingController.prototype, "toggleVideo", null);
exports.EventStreamingController = EventStreamingController = __decorate([
    (0, common_1.Controller)('event-streaming'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [event_streaming_service_1.EventStreamingService,
        webRTC_service_1.WebRTCService])
], EventStreamingController);
//# sourceMappingURL=event-streaming.controller.js.map