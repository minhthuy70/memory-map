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
} from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateFogOfWarDto,
  UpdateFogOfWarDto,
  ExploreAreaDto,
} from './dto/fog-of-war.dto';
import {
  CreateGeocacheDto,
  UpdateGeocacheDto,
  CreateGeocacheLogDto,
} from './dto/geocache.dto';
import {
  CreateARTreasureChestDto,
  UpdateARTreasureChestDto,
  UnlockARTreasureChestDto,
} from './dto/ar-treasure-chest.dto';
import {
  CreateTravelLeaderboardDto,
  UpdateTravelLeaderboardDto,
  CreateLeaderboardEntryDto,
  UpdateLeaderboardEntryDto,
} from './dto/travel-leaderboard.dto';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  // ==================== User Stats & XP ====================

  @Get('stats')
  async getUserStats(@Request() req) {
    return this.gamificationService.getUserStats(req.user.userId);
  }

  @Post('stats/xp')
  async addXP(@Request() req, @Body() body: { amount: number }) {
    return this.gamificationService.addXP(req.user.userId, body.amount);
  }

  @Post('stats/memories')
  async updateMemoryCount(@Request() req) {
    return this.gamificationService.updateMemoryCount(req.user.userId);
  }

  // ==================== Badges ====================

  @Get('badges')
  async getBadges(@Request() req) {
    return this.gamificationService.getBadges(req.user.userId);
  }

  @Post('badges')
  async createBadge(
    @Request() req,
    @Body() body: { badgeType: string; badgeName: string; target: number },
  ) {
    return this.gamificationService.createBadge(
      req.user.userId,
      body.badgeType,
      body.badgeName,
      body.target,
    );
  }

  @Put('badges/:id/progress')
  async updateBadgeProgress(
    @Param('id') id: string,
    @Body() body: { increment: number },
  ) {
    return this.gamificationService.updateBadgeProgress(id, body.increment);
  }

  // ==================== Journaling Streaks ====================

  @Get('streak')
  async getJournalingStreak(@Request() req) {
    return this.gamificationService.getJournalingStreak(req.user.userId);
  }

  @Post('streak/record')
  async recordJournalEntry(@Request() req) {
    return this.gamificationService.recordJournalEntry(req.user.userId);
  }

  // ==================== Passport Stamps ====================

  @Get('passport')
  async getPassportStamps(@Request() req) {
    return this.gamificationService.getPassportStamps(req.user.userId);
  }

  @Post('passport/stamp')
  async addPassportStamp(
    @Request() req,
    @Body() body: { country: string; city: string; province: string },
  ) {
    return this.gamificationService.addPassportStamp(
      req.user.userId,
      body.country,
      body.city,
      body.province,
    );
  }

  // ==================== Bingo Challenges ====================

  @Get('bingo/:year')
  async getBingoCompletion(@Request() req, @Param('year') year: string) {
    return this.gamificationService.getBingoCompletion(req.user.userId, parseInt(year));
  }

  @Post('bingo/:year/complete')
  async completeBingoItem(
    @Request() req,
    @Param('year') year: string,
    @Body() body: { index: number },
  ) {
    return this.gamificationService.completeBingoItem(
      req.user.userId,
      parseInt(year),
      body.index,
    );
  }

  // ==================== Virtual Souvenirs ====================

  @Get('souvenirs')
  async getVirtualSouvenirs(@Request() req) {
    return this.gamificationService.getVirtualSouvenirs(req.user.userId);
  }

  @Post('souvenirs/unlock')
  async unlockSouvenir(
    @Request() req,
    @Body() body: { name: string; type: string; location: string },
  ) {
    return this.gamificationService.unlockSouvenir(
      req.user.userId,
      body.name,
      body.type,
      body.location,
    );
  }

  @Put('souvenirs/:id/position')
  async updateSouvenirPosition(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { position: number },
  ) {
    return this.gamificationService.updateSouvenirPosition(
      id,
      req.user.userId,
      body.position,
    );
  }

  // ==================== Fog of War Map ====================

  @Get('fog-of-war')
  async getFogOfWarMap(@Request() req) {
    return this.gamificationService.getFogOfWarMap(req.user.userId);
  }

  @Put('fog-of-war')
  async updateFogOfWarMap(@Request() req, @Body() dto: UpdateFogOfWarDto) {
    return this.gamificationService.updateFogOfWarMap(req.user.userId, dto);
  }

  @Post('fog-of-war/explore')
  async exploreArea(@Request() req, @Body() dto: ExploreAreaDto) {
    return this.gamificationService.exploreArea(req.user.userId, dto);
  }

  // ==================== Geocaching ====================

  @Get('geocaches')
  async getGeocaches(@Request() req) {
    return this.gamificationService.getGeocaches(req.user.userId);
  }

  @Get('geocaches/published')
  async getPublishedGeocaches() {
    return this.gamificationService.getPublishedGeocaches();
  }

  @Post('geocaches')
  async createGeocache(@Request() req, @Body() dto: CreateGeocacheDto) {
    return this.gamificationService.createGeocache(req.user.userId, dto);
  }

  @Put('geocaches/:id')
  async updateGeocache(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateGeocacheDto,
  ) {
    return this.gamificationService.updateGeocache(id, req.user.userId, dto);
  }

  @Delete('geocaches/:id')
  async deleteGeocache(@Param('id') id: string, @Request() req) {
    return this.gamificationService.deleteGeocache(id, req.user.userId);
  }

  @Post('geocaches/:id/logs')
  async logGeocache(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: CreateGeocacheLogDto,
  ) {
    return this.gamificationService.logGeocache(id, req.user.userId, dto);
  }

  @Get('geocaches/:id/logs')
  async getGeocacheLogs(@Param('id') id: string) {
    return this.gamificationService.getGeocacheLogs(id);
  }

  // ==================== AR Treasure Chests ====================

  @Get('ar-chests')
  async getARTreasureChests(@Request() req) {
    return this.gamificationService.getARTreasureChests(req.user.userId);
  }

  @Post('ar-chests')
  async createARTreasureChest(@Request() req, @Body() dto: CreateARTreasureChestDto) {
    return this.gamificationService.createARTreasureChest(req.user.userId, dto);
  }

  @Put('ar-chests/:id')
  async updateARTreasureChest(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateARTreasureChestDto,
  ) {
    return this.gamificationService.updateARTreasureChest(id, req.user.userId, dto);
  }

  @Post('ar-chests/unlock')
  async unlockARTreasureChest(@Request() req, @Body() dto: UnlockARTreasureChestDto) {
    return this.gamificationService.unlockARTreasureChest(req.user.userId, dto);
  }

  // ==================== Travel Leaderboards ====================

  @Get('leaderboards/:circleId')
  async getTravelLeaderboards(@Param('circleId') circleId: string) {
    return this.gamificationService.getTravelLeaderboards(circleId);
  }

  @Post('leaderboards')
  async createTravelLeaderboard(@Body() dto: CreateTravelLeaderboardDto) {
    return this.gamificationService.createTravelLeaderboard(dto);
  }

  @Put('leaderboards/:id')
  async updateTravelLeaderboard(@Param('id') id: string, @Body() dto: UpdateTravelLeaderboardDto) {
    return this.gamificationService.updateTravelLeaderboard(id, dto);
  }

  @Get('leaderboards/:id/entries')
  async getLeaderboardEntries(@Param('id') id: string) {
    return this.gamificationService.getLeaderboardEntries(id);
  }

  @Post('leaderboards/entries')
  async createLeaderboardEntry(@Request() req, @Body() dto: CreateLeaderboardEntryDto) {
    return this.gamificationService.createLeaderboardEntry(req.user.userId, dto);
  }

  @Put('leaderboards/entries/:id')
  async updateLeaderboardEntry(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateLeaderboardEntryDto,
  ) {
    return this.gamificationService.updateLeaderboardEntry(id, req.user.userId, dto);
  }
}
