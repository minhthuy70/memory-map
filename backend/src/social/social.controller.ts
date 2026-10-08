import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SocialService } from './social.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('social')
@UseGuards(JwtAuthGuard)
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  // ==================== Memory Reactions ====================

  @Get('reactions/:memoryId')
  async getReactions(@Param('memoryId') memoryId: string) {
    return this.socialService.getReactions(memoryId);
  }

  @Post('reactions')
  async addReaction(@Request() req, @Body() data: any) {
    return this.socialService.addReaction(req.user.userId, data.memoryId, data.reactionType);
  }

  // ==================== Memory Comments ====================

  @Get('comments/:memoryId')
  async getComments(@Param('memoryId') memoryId: string) {
    return this.socialService.getComments(memoryId);
  }

  @Post('comments')
  async createComment(@Request() req, @Body() data: any) {
    return this.socialService.createComment(req.user.userId, data.memoryId, data.content, data.parentId);
  }

  @Delete('comments/:id')
  async deleteComment(@Request() req, @Param('id') id: string) {
    return this.socialService.deleteComment(req.user.userId, id);
  }

  // ==================== Memory Circles ====================

  @Get('circles')
  async getCircles(@Request() req) {
    return this.socialService.getCircles(req.user.userId);
  }

  @Post('circles')
  async createCircle(@Request() req, @Body() data: any) {
    return this.socialService.createCircle(req.user.userId, data);
  }

  @Post('circles/:circleId/members')
  async addCircleMember(@Request() req, @Param('circleId') circleId: string, @Body() data: any) {
    return this.socialService.addCircleMember(circleId, req.user.userId, data.userId);
  }

  // ==================== Shared Albums ====================

  @Get('albums')
  async getSharedAlbums(@Request() req) {
    return this.socialService.getSharedAlbums(req.user.userId);
  }

  @Post('albums')
  async createSharedAlbum(@Request() req, @Body() data: any) {
    return this.socialService.createSharedAlbum(req.user.userId, data);
  }

  @Post('albums/:albumId/contributors')
  async addAlbumContributor(@Request() req, @Param('albumId') albumId: string, @Body() data: any) {
    return this.socialService.addAlbumContributor(albumId, req.user.userId, data.userId, data.permission);
  }
}
