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
import { AudiovisualService } from './audiovisual.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateHandwritingCanvasDto,
  UpdateHandwritingCanvasDto,
  CreateVintageFilmDto,
  UpdateVintageFilmDto,
  CreateLivePhotoDto,
  UpdateLivePhotoDto,
  CreateBeforeAfterSliderDto,
  UpdateBeforeAfterSliderDto,
  CreateTypographyStampDto,
  UpdateTypographyStampDto,
  CreateBeatSyncVideoDto,
  UpdateBeatSyncVideoDto,
  CreateAIVoiceoverDto,
  UpdateAIVoiceoverDto,
  CreateMemorySoundtrackDto,
  UpdateMemorySoundtrackDto,
} from './dto/audiovisual.dto';

@Controller('audiovisual')
@UseGuards(JwtAuthGuard)
export class AudiovisualController {
  constructor(private readonly audiovisualService: AudiovisualService) {}

  // ==================== Scrapbook Projects ====================

  @Get('scrapbooks')
  async getScrapbookProjects(@Request() req) {
    return this.audiovisualService.getScrapbookProjects(req.user.userId);
  }

  @Get('scrapbooks/:id')
  async getScrapbookProject(@Request() req, @Param('id') id: string) {
    return this.audiovisualService.getScrapbookProject(req.user.userId, id);
  }

  @Post('scrapbooks')
  async createScrapbookProject(@Request() req, @Body() data: any) {
    return this.audiovisualService.createScrapbookProject(req.user.userId, data);
  }

  @Put('scrapbooks/:id')
  async updateScrapbookProject(@Request() req, @Param('id') id: string, @Body() data: any) {
    return this.audiovisualService.updateScrapbookProject(req.user.userId, id, data);
  }

  @Delete('scrapbooks/:id')
  async deleteScrapbookProject(@Request() req, @Param('id') id: string) {
    return this.audiovisualService.deleteScrapbookProject(req.user.userId, id);
  }

  // ==================== Soundscape Mixes ====================

  @Get('soundscapes')
  async getSoundscapeMixes(@Request() req) {
    return this.audiovisualService.getSoundscapeMixes(req.user.userId);
  }

  @Get('soundscapes/:id')
  async getSoundscapeMix(@Request() req, @Param('id') id: string) {
    return this.audiovisualService.getSoundscapeMix(req.user.userId, id);
  }

  @Post('soundscapes')
  async createSoundscapeMix(@Request() req, @Body() data: any) {
    return this.audiovisualService.createSoundscapeMix(req.user.userId, data);
  }

  @Put('soundscapes/:id')
  async updateSoundscapeMix(@Request() req, @Param('id') id: string, @Body() data: any) {
    return this.audiovisualService.updateSoundscapeMix(req.user.userId, id, data);
  }

  @Delete('soundscapes/:id')
  async deleteSoundscapeMix(@Request() req, @Param('id') id: string) {
    return this.audiovisualService.deleteSoundscapeMix(req.user.userId, id);
  }

  // ==================== Handwriting Canvas ====================

  @Get('handwriting')
  async getHandwritingCanvases(@Request() req) {
    return this.audiovisualService.getHandwritingCanvases(req.user.userId);
  }

  @Post('handwriting')
  async createHandwritingCanvas(@Request() req, @Body() dto: CreateHandwritingCanvasDto) {
    return this.audiovisualService.createHandwritingCanvas(req.user.userId, dto);
  }

  @Put('handwriting/:id')
  async updateHandwritingCanvas(@Param('id') id: string, @Request() req, @Body() dto: UpdateHandwritingCanvasDto) {
    return this.audiovisualService.updateHandwritingCanvas(id, req.user.userId, dto);
  }

  @Delete('handwriting/:id')
  async deleteHandwritingCanvas(@Param('id') id: string, @Request() req) {
    return this.audiovisualService.deleteHandwritingCanvas(id, req.user.userId);
  }

  // ==================== Vintage Film Emulation ====================

  @Get('vintage-films')
  async getVintageFilms(@Request() req) {
    return this.audiovisualService.getVintageFilms(req.user.userId);
  }

  @Post('vintage-films')
  async createVintageFilm(@Request() req, @Body() dto: CreateVintageFilmDto) {
    return this.audiovisualService.createVintageFilm(req.user.userId, dto);
  }

  @Put('vintage-films/:id')
  async updateVintageFilm(@Param('id') id: string, @Request() req, @Body() dto: UpdateVintageFilmDto) {
    return this.audiovisualService.updateVintageFilm(id, req.user.userId, dto);
  }

  @Delete('vintage-films/:id')
  async deleteVintageFilm(@Param('id') id: string, @Request() req) {
    return this.audiovisualService.deleteVintageFilm(id, req.user.userId);
  }

  // ==================== Live Photo Motion Viewer ====================

  @Get('live-photos')
  async getLivePhotos(@Request() req) {
    return this.audiovisualService.getLivePhotos(req.user.userId);
  }

  @Post('live-photos')
  async createLivePhoto(@Request() req, @Body() dto: CreateLivePhotoDto) {
    return this.audiovisualService.createLivePhoto(req.user.userId, dto);
  }

  @Put('live-photos/:id')
  async updateLivePhoto(@Param('id') id: string, @Request() req, @Body() dto: UpdateLivePhotoDto) {
    return this.audiovisualService.updateLivePhoto(id, req.user.userId, dto);
  }

  @Delete('live-photos/:id')
  async deleteLivePhoto(@Param('id') id: string, @Request() req) {
    return this.audiovisualService.deleteLivePhoto(id, req.user.userId);
  }

  // ==================== Before/After Slider ====================

  @Get('before-after')
  async getBeforeAfterSliders(@Request() req) {
    return this.audiovisualService.getBeforeAfterSliders(req.user.userId);
  }

  @Post('before-after')
  async createBeforeAfterSlider(@Request() req, @Body() dto: CreateBeforeAfterSliderDto) {
    return this.audiovisualService.createBeforeAfterSlider(req.user.userId, dto);
  }

  @Put('before-after/:id')
  async updateBeforeAfterSlider(@Param('id') id: string, @Request() req, @Body() dto: UpdateBeforeAfterSliderDto) {
    return this.audiovisualService.updateBeforeAfterSlider(id, req.user.userId, dto);
  }

  @Delete('before-after/:id')
  async deleteBeforeAfterSlider(@Param('id') id: string, @Request() req) {
    return this.audiovisualService.deleteBeforeAfterSlider(id, req.user.userId);
  }

  // ==================== Typography Stamp Studio ====================

  @Get('typography')
  async getTypographyStamps(@Request() req) {
    return this.audiovisualService.getTypographyStamps(req.user.userId);
  }

  @Post('typography')
  async createTypographyStamp(@Request() req, @Body() dto: CreateTypographyStampDto) {
    return this.audiovisualService.createTypographyStamp(req.user.userId, dto);
  }

  @Put('typography/:id')
  async updateTypographyStamp(@Param('id') id: string, @Request() req, @Body() dto: UpdateTypographyStampDto) {
    return this.audiovisualService.updateTypographyStamp(id, req.user.userId, dto);
  }

  @Delete('typography/:id')
  async deleteTypographyStamp(@Param('id') id: string, @Request() req) {
    return this.audiovisualService.deleteTypographyStamp(id, req.user.userId);
  }

  // ==================== Beat Sync Video Generator ====================

  @Get('beat-sync-videos')
  async getBeatSyncVideos(@Request() req) {
    return this.audiovisualService.getBeatSyncVideos(req.user.userId);
  }

  @Post('beat-sync-videos')
  async createBeatSyncVideo(@Request() req, @Body() dto: CreateBeatSyncVideoDto) {
    return this.audiovisualService.createBeatSyncVideo(req.user.userId, dto);
  }

  @Put('beat-sync-videos/:id')
  async updateBeatSyncVideo(@Param('id') id: string, @Request() req, @Body() dto: UpdateBeatSyncVideoDto) {
    return this.audiovisualService.updateBeatSyncVideo(id, req.user.userId, dto);
  }

  @Delete('beat-sync-videos/:id')
  async deleteBeatSyncVideo(@Param('id') id: string, @Request() req) {
    return this.audiovisualService.deleteBeatSyncVideo(id, req.user.userId);
  }

  // ==================== AI Voiceover Commentary ====================

  @Get('ai-voiceovers')
  async getAIVoiceovers(@Request() req) {
    return this.audiovisualService.getAIVoiceovers(req.user.userId);
  }

  @Post('ai-voiceovers')
  async createAIVoiceover(@Request() req, @Body() dto: CreateAIVoiceoverDto) {
    return this.audiovisualService.createAIVoiceover(req.user.userId, dto);
  }

  @Put('ai-voiceovers/:id')
  async updateAIVoiceover(@Param('id') id: string, @Request() req, @Body() dto: UpdateAIVoiceoverDto) {
    return this.audiovisualService.updateAIVoiceover(id, req.user.userId, dto);
  }

  @Delete('ai-voiceovers/:id')
  async deleteAIVoiceover(@Param('id') id: string, @Request() req) {
    return this.audiovisualService.deleteAIVoiceover(id, req.user.userId);
  }

  // ==================== Memory Soundtrack Mashup ====================

  @Get('memory-soundtracks')
  async getMemorySoundtracks(@Request() req) {
    return this.audiovisualService.getMemorySoundtracks(req.user.userId);
  }

  @Post('memory-soundtracks')
  async createMemorySoundtrack(@Request() req, @Body() dto: CreateMemorySoundtrackDto) {
    return this.audiovisualService.createMemorySoundtrack(req.user.userId, dto);
  }

  @Put('memory-soundtracks/:id')
  async updateMemorySoundtrack(@Param('id') id: string, @Request() req, @Body() dto: UpdateMemorySoundtrackDto) {
    return this.audiovisualService.updateMemorySoundtrack(id, req.user.userId, dto);
  }

  @Delete('memory-soundtracks/:id')
  async deleteMemorySoundtrack(@Param('id') id: string, @Request() req) {
    return this.audiovisualService.deleteMemorySoundtrack(id, req.user.userId);
  }
}
