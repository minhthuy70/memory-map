import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PsychologyService } from './psychology.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('psychology')
@UseGuards(JwtAuthGuard)
export class PsychologyController {
  constructor(private readonly psychologyService: PsychologyService) {}

  // ==================== Gratitude ====================

  @Get('gratitude')
  async getGratitudeEntries(@Request() req) {
    return this.psychologyService.getGratitudeEntries(req.user.userId);
  }

  @Post('gratitude')
  async createGratitudeEntry(@Request() req, @Body() data: any) {
    return this.psychologyService.createGratitudeEntry(req.user.userId, data);
  }

  // ==================== Resilience ====================

  @Get('resilience')
  async getResilienceMoments(@Request() req) {
    return this.psychologyService.getResilienceMoments(req.user.userId);
  }

  @Post('resilience')
  async createResilienceMoment(@Request() req, @Body() data: any) {
    return this.psychologyService.createResilienceMoment(req.user.userId, data);
  }

  // ==================== Daily Serendipity ====================

  @Get('serendipity')
  async getDailySerendipity(@Request() req) {
    return this.psychologyService.getDailySerendipity(req.user.userId);
  }

  @Post('serendipity/viewed')
  async markViewed(@Request() req, @Body() data: any) {
    return this.psychologyService.markViewed(
      req.user.userId,
      data.moodBefore,
      data.moodAfter,
    );
  }

  // ==================== Emotional Waveform ====================

  @Get('waveform')
  async getEmotionalWaveforms(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.psychologyService.getEmotionalWaveforms(
      req.user.userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Post('waveform')
  async createEmotionalWaveform(@Request() req, @Body() data: any) {
    return this.psychologyService.createEmotionalWaveform(req.user.userId, data);
  }

  // ==================== Dream Journal ====================

  @Get('dreams')
  async getDreamJournals(@Request() req) {
    return this.psychologyService.getDreamJournals(req.user.userId);
  }

  @Post('dreams')
  async createDreamJournal(@Request() req, @Body() data: any) {
    return this.psychologyService.createDreamJournal(req.user.userId, data);
  }
}
