import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventStreamingService } from './event-streaming.service';
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

@Controller('event-streaming')
@UseGuards(JwtAuthGuard)
export class EventStreamingController {
  constructor(private readonly eventStreamingService: EventStreamingService) {}

  // Live Journey Broadcast
  @Post('live-journey')
  createLiveJourneyBroadcast(@Request() req, @Body() dto: CreateLiveJourneyBroadcastDto) {
    return this.eventStreamingService.createLiveJourneyBroadcast(req.user.userId, dto);
  }

  @Get('live-journey')
  getLiveJourneyBroadcasts(@Request() req) {
    return this.eventStreamingService.getLiveJourneyBroadcasts(req.user.userId);
  }

  @Get('live-journey/:id')
  getLiveJourneyBroadcast(@Param('id') id: string, @Request() req) {
    return this.eventStreamingService.getLiveJourneyBroadcast(id, req.user.userId);
  }

  @Put('live-journey/:id')
  updateLiveJourneyBroadcast(
    @Param('id') id: string, 
    @Request() req, 
    @Body() dto: UpdateLiveJourneyBroadcastDto
  ) {
    return this.eventStreamingService.updateLiveJourneyBroadcast(id, req.user.userId, dto);
  }

  @Post('live-journey/:id/end')
  endLiveJourneyBroadcast(@Param('id') id: string, @Request() req) {
    return this.eventStreamingService.endLiveJourneyBroadcast(id, req.user.userId);
  }

  @Post('live-journey/:id/location')
  addLocationUpdate(
    @Param('id') id: string, 
    @Request() req, 
    @Body() dto: CreateLocationUpdateDto
  ) {
    return this.eventStreamingService.addLocationUpdate(id, req.user.userId, dto);
  }

  // Virtual Watch Party
  @Post('watch-party')
  createVirtualWatchParty(@Request() req, @Body() dto: CreateVirtualWatchPartyDto) {
    return this.eventStreamingService.createVirtualWatchParty(req.user.userId, dto);
  }

  @Get('watch-party')
  getVirtualWatchParties(@Request() req) {
    return this.eventStreamingService.getVirtualWatchParties(req.user.userId);
  }

  @Post('watch-party/join')
  joinWatchParty(@Request() req, @Body() dto: { roomCode: string }) {
    return this.eventStreamingService.joinWatchParty(dto.roomCode, req.user.userId);
  }

  @Post('watch-party/:id/end')
  endWatchParty(@Param('id') id: string, @Request() req) {
    return this.eventStreamingService.endWatchParty(id, req.user.userId);
  }

  // Event Guest Wall
  @Post('guest-wall')
  createEventGuestWall(@Request() req, @Body() dto: CreateEventGuestWallDto) {
    return this.eventStreamingService.createEventGuestWall(req.user.userId, dto);
  }

  @Get('guest-wall')
  getEventGuestWalls(@Request() req) {
    return this.eventStreamingService.getEventGuestWalls(req.user.userId);
  }

  @Get('guest-wall/:id')
  getEventGuestWall(@Param('id') id: string) {
    return this.eventStreamingService.getEventGuestWall(id);
  }

  @Post('guest-wall/:id/contribution')
  addGuestContribution(@Param('id') id: string, @Body() dto: CreateGuestContributionDto) {
    return this.eventStreamingService.addGuestContribution(id, dto);
  }

  // Temporary Shared Links
  @Post('shared-link')
  createTemporarySharedLink(@Request() req, @Body() dto: CreateTemporarySharedLinkDto) {
    return this.eventStreamingService.createTemporarySharedLink(req.user.userId, dto);
  }

  @Get('shared-link')
  getTemporarySharedLinks(@Request() req) {
    return this.eventStreamingService.getTemporarySharedLinks(req.user.userId);
  }

  @Post('shared-link/access')
  @HttpCode(HttpStatus.OK)
  accessSharedLink(@Body() dto: AccessSharedLinkDto) {
    return this.eventStreamingService.accessSharedLink(dto.url, dto);
  }

  @Post('shared-link/:id/revoke')
  revokeSharedLink(@Param('id') id: string, @Request() req) {
    return this.eventStreamingService.revokeSharedLink(id, req.user.userId);
  }

  // Travel Portfolio
  @Post('portfolio')
  createTravelPortfolio(@Request() req, @Body() dto: CreateTravelPortfolioDto) {
    return this.eventStreamingService.createTravelPortfolio(req.user.userId, dto);
  }

  @Get('portfolio')
  getTravelPortfolios(@Request() req) {
    return this.eventStreamingService.getTravelPortfolios(req.user.userId);
  }

  @Get('portfolio/public/:customDomain')
  getPublicPortfolio(@Param('customDomain') customDomain: string) {
    return this.eventStreamingService.getPublicPortfolio(customDomain);
  }

  @Put('portfolio/:id')
  updateTravelPortfolio(
    @Param('id') id: string, 
    @Request() req, 
    @Body() dto: UpdateTravelPortfolioDto
  ) {
    return this.eventStreamingService.updateTravelPortfolio(id, req.user.userId, dto);
  }

  @Post('portfolio/:id/memory')
  addPortfolioMemory(
    @Param('id') id: string, 
    @Request() req, 
    @Body() dto: AddPortfolioMemoryDto
  ) {
    return this.eventStreamingService.addPortfolioMemory(id, req.user.userId, dto);
  }

  // Embeddable Map Widget
  @Post('map-widget')
  createEmbeddableMapWidget(@Request() req, @Body() dto: CreateEmbeddableMapWidgetDto) {
    return this.eventStreamingService.createEmbeddableMapWidget(req.user.userId, dto);
  }

  @Get('map-widget')
  getEmbeddableMapWidgets(@Request() req) {
    return this.eventStreamingService.getEmbeddableMapWidgets(req.user.userId);
  }

  @Get('map-widget/widget/:widgetId')
  getEmbeddableMapWidget(@Param('widgetId') widgetId: string) {
    return this.eventStreamingService.getEmbeddableMapWidget(widgetId);
  }

  @Put('map-widget/:id')
  updateEmbeddableMapWidget(
    @Param('id') id: string, 
    @Request() req, 
    @Body() dto: UpdateEmbeddableMapWidgetDto
  ) {
    return this.eventStreamingService.updateEmbeddableMapWidget(id, req.user.userId, dto);
  }

  // QR Code Stickers
  @Post('qr-sticker')
  createQRCodeSticker(@Request() req, @Body() dto: CreateQRCodeStickerDto) {
    return this.eventStreamingService.createQRCodeSticker(req.user.userId, dto);
  }

  @Get('qr-sticker')
  getQRCodeStickers(@Request() req) {
    return this.eventStreamingService.getQRCodeStickers(req.user.userId);
  }

  @Post('qr-sticker/scan/:stickerCode')
  @HttpCode(HttpStatus.OK)
  scanQRCodeSticker(@Param('stickerCode') stickerCode: string) {
    return this.eventStreamingService.scanQRCodeSticker(stickerCode);
  }

  // Vertical Story Export
  @Post('vertical-story')
  createVerticalStoryExport(@Request() req, @Body() dto: CreateVerticalStoryExportDto) {
    return this.eventStreamingService.createVerticalStoryExport(req.user.userId, dto);
  }

  @Get('vertical-story')
  getVerticalStoryExports(@Request() req) {
    return this.eventStreamingService.getVerticalStoryExports(req.user.userId);
  }

  // Friend Voice Commentary
  @Post('voice-commentary')
  createFriendVoiceCommentary(@Request() req, @Body() dto: CreateFriendVoiceCommentaryDto) {
    return this.eventStreamingService.createFriendVoiceCommentary(req.user.userId, dto);
  }

  @Get('voice-commentary')
  getFriendVoiceCommentaries(@Request() req) {
    return this.eventStreamingService.getFriendVoiceCommentaries(req.user.userId);
  }

  @Get('voice-commentary/memory/:memoryId')
  getMemoryVoiceCommentaries(@Param('memoryId') memoryId: string) {
    return this.eventStreamingService.getMemoryVoiceCommentaries(memoryId);
  }
}
