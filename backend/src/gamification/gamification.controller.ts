import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
}
