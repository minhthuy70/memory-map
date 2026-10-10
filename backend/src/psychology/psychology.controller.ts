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
import { PsychologyService } from './psychology.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateReminiscenceTherapyDto,
  UpdateReminiscenceTherapyDto,
} from './dto/reminiscence-therapy.dto';
import {
  CreateInnerChildDialogueDto,
} from './dto/inner-child-dialogue.dto';
import {
  CreateBinauralSoundTherapyDto,
  UpdateBinauralSoundTherapyDto,
} from './dto/binaural-sound-therapy.dto';
import {
  UpdateZenReflectionDto,
} from './dto/zen-reflection.dto';
import {
  CreateEmotionalWaveformDto,
  UpdateEmotionalWaveformDto,
} from './dto/emotional-waveform.dto';
import {
  CreateDreamJournalDto,
  UpdateDreamJournalDto,
} from './dto/dream-journal.dto';

@Controller('psychology')
@UseGuards(JwtAuthGuard)
export class PsychologyController {
  constructor(private readonly psychologyService: PsychologyService) {}

  // ==================== Emotional Geography Heatmap ====================

  @Get('emotional-geography')
  async getEmotionalGeographyPoints(@Request() req) {
    return this.psychologyService.getEmotionalGeographyPoints(req.user.userId);
  }

  @Post('emotional-geography')
  async createEmotionalGeographyPoint(
    @Request() req,
    @Body() body: {
      memoryId: string;
      latitude: number;
      longitude: number;
      emotionType: string;
      intensity: number;
    },
  ) {
    return this.psychologyService.createEmotionalGeographyPoint(
      req.user.userId,
      body.memoryId,
      body.latitude,
      body.longitude,
      body.emotionType,
      body.intensity,
    );
  }

  // ==================== Reminiscence Therapy ====================

  @Get('reminiscence')
  async getReminiscenceSessions(@Request() req) {
    return this.psychologyService.getReminiscenceSessions(req.user.userId);
  }

  @Post('reminiscence')
  async createReminiscenceSession(@Request() req, @Body() dto: CreateReminiscenceTherapyDto) {
    return this.psychologyService.createReminiscenceSession(req.user.userId, dto);
  }

  @Put('reminiscence/:id')
  async updateReminiscenceSession(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateReminiscenceTherapyDto,
  ) {
    return this.psychologyService.updateReminiscenceSession(id, req.user.userId, dto);
  }

  // ==================== Inner Child Dialogue ====================

  @Get('inner-child')
  async getInnerChildDialogues(@Request() req) {
    return this.psychologyService.getInnerChildDialogues(req.user.userId);
  }

  @Post('inner-child')
  async createInnerChildDialogue(@Request() req, @Body() dto: CreateInnerChildDialogueDto) {
    return this.psychologyService.createInnerChildDialogue(req.user.userId, dto);
  }

  // ==================== Binaural Sound Therapy ====================

  @Get('binaural')
  async getBinauralTherapies(@Request() req) {
    return this.psychologyService.getBinauralTherapies(req.user.userId);
  }

  @Post('binaural')
  async createBinauralTherapy(@Request() req, @Body() dto: CreateBinauralSoundTherapyDto) {
    return this.psychologyService.createBinauralTherapy(req.user.userId, dto);
  }

  @Put('binaural/:id')
  async updateBinauralTherapy(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateBinauralSoundTherapyDto,
  ) {
    return this.psychologyService.updateBinauralTherapy(id, req.user.userId, dto);
  }

  // ==================== Zen Reflection Mode ====================

  @Get('zen-mode')
  async getZenReflectionMode(@Request() req) {
    return this.psychologyService.getZenReflectionMode(req.user.userId);
  }

  @Put('zen-mode')
  async updateZenReflectionMode(@Request() req, @Body() dto: UpdateZenReflectionDto) {
    return this.psychologyService.updateZenReflectionMode(req.user.userId, dto);
  }

  // ==================== Emotional Waveform Timeline ====================

  @Get('emotional-waveform')
  async getEmotionalWaveforms(@Request() req) {
    return this.psychologyService.getEmotionalWaveforms(req.user.userId);
  }

  @Post('emotional-waveform')
  async createEmotionalWaveform(@Request() req, @Body() dto: CreateEmotionalWaveformDto) {
    return this.psychologyService.createEmotionalWaveform(req.user.userId, dto);
  }

  @Put('emotional-waveform/:id')
  async updateEmotionalWaveform(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateEmotionalWaveformDto,
  ) {
    return this.psychologyService.updateEmotionalWaveform(id, req.user.userId, dto);
  }

  @Delete('emotional-waveform/:id')
  async deleteEmotionalWaveform(@Param('id') id: string, @Request() req) {
    return this.psychologyService.deleteEmotionalWaveform(id, req.user.userId);
  }

  // ==================== Dream Journal ====================

  @Get('dream-journal')
  async getDreamJournals(@Request() req) {
    return this.psychologyService.getDreamJournals(req.user.userId);
  }

  @Post('dream-journal')
  async createDreamJournal(@Request() req, @Body() dto: CreateDreamJournalDto) {
    return this.psychologyService.createDreamJournal(req.user.userId, dto);
  }

  @Put('dream-journal/:id')
  async updateDreamJournal(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateDreamJournalDto,
  ) {
    return this.psychologyService.updateDreamJournal(id, req.user.userId, dto);
  }

  @Delete('dream-journal/:id')
  async deleteDreamJournal(@Param('id') id: string, @Request() req) {
    return this.psychologyService.deleteDreamJournal(id, req.user.userId);
  }
}
