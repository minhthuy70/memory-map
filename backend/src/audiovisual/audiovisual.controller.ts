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
}
