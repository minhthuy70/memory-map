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
import { SocialService } from './social.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as dto from './dto/social.dto';

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

  // ==================== Memory Stories ====================

  @Get('stories')
  async getStories(@Request() req) { return this.socialService.getStories(req.user.userId); }
  @Post('stories') async createStory(@Request() req, @Body() dto: dto.CreateMemoryStoryDto) { return this.socialService.createStory(req.user.userId, dto); }
  @Put('stories/:id') async updateStory(@Request() req, @Param('id') id: string, @Body() dto: dto.UpdateMemoryStoryDto) { return this.socialService.updateStory(id, req.user.userId, dto); }
  @Delete('stories/:id') async deleteStory(@Request() req, @Param('id') id: string) { return this.socialService.deleteStory(id, req.user.userId); }

  // ==================== Community Map Feed ====================

  @Get('community-feeds')
  async getCommunityFeeds(@Request() req) { return this.socialService.getCommunityFeeds(req.user.userId); }
  @Post('community-feeds') async createCommunityFeed(@Request() req, @Body() dto: dto.CreateCommunityMapFeedDto) { return this.socialService.createCommunityFeed(req.user.userId, dto); }
  @Put('community-feeds/:id') async updateCommunityFeed(@Request() req, @Param('id') id: string, @Body() dto: dto.UpdateCommunityMapFeedDto) { return this.socialService.updateCommunityFeed(id, req.user.userId, dto); }
  @Delete('community-feeds/:id') async deleteCommunityFeed(@Request() req, @Param('id') id: string) { return this.socialService.deleteCommunityFeed(id, req.user.userId); }

  // ==================== Nearby Friends Ping ====================

  @Get('nearby-pings')
  async getNearbyPings(@Request() req) { return this.socialService.getNearbyPings(req.user.userId); }
  @Post('nearby-pings') async createNearbyPing(@Request() req, @Body() dto: dto.CreateNearbyFriendsPingDto) { return this.socialService.createNearbyPing(req.user.userId, dto); }
  @Put('nearby-pings/:id') async updateNearbyPing(@Request() req, @Param('id') id: string, @Body() dto: dto.UpdateNearbyFriendsPingDto) { return this.socialService.updateNearbyPing(id, req.user.userId, dto); }
  @Delete('nearby-pings/:id') async deleteNearbyPing(@Request() req, @Param('id') id: string) { return this.socialService.deleteNearbyPing(id, req.user.userId); }

  // ==================== Co-presence Suggestion ====================

  @Get('co-presence-suggestions')
  async getCoPresenceSuggestions(@Request() req) { return this.socialService.getCoPresenceSuggestions(req.user.userId); }
  @Post('co-presence-suggestions') async createCoPresenceSuggestion(@Request() req, @Body() dto: dto.CreateCoPresenceSuggestionDto) { return this.socialService.createCoPresenceSuggestion(req.user.userId, dto); }
  @Delete('co-presence-suggestions/:id') async deleteCoPresenceSuggestion(@Request() req, @Param('id') id: string) { return this.socialService.deleteCoPresenceSuggestion(id, req.user.userId); }

  // ==================== Exploration Challenge ====================

  @Get('exploration-challenges')
  async getExplorationChallenges(@Request() req) { return this.socialService.getExplorationChallenges(req.user.userId); }
  @Post('exploration-challenges') async createExplorationChallenge(@Request() req, @Body() dto: dto.CreateExplorationChallengeDto) { return this.socialService.createExplorationChallenge(req.user.userId, dto); }
  @Put('exploration-challenges/:id') async updateExplorationChallenge(@Request() req, @Param('id') id: string, @Body() dto: dto.UpdateExplorationChallengeDto) { return this.socialService.updateExplorationChallenge(id, req.user.userId, dto); }
  @Delete('exploration-challenges/:id') async deleteExplorationChallenge(@Request() req, @Param('id') id: string) { return this.socialService.deleteExplorationChallenge(id, req.user.userId); }

  // ==================== Memory Contest ====================

  @Get('memory-contests')
  async getMemoryContests(@Request() req) { return this.socialService.getMemoryContests(req.user.userId); }
  @Post('memory-contests') async createMemoryContest(@Request() req, @Body() dto: dto.CreateMemoryContestDto) { return this.socialService.createMemoryContest(req.user.userId, dto); }
  @Put('memory-contests/:id') async updateMemoryContest(@Request() req, @Param('id') id: string, @Body() dto: dto.UpdateMemoryContestDto) { return this.socialService.updateMemoryContest(id, req.user.userId, dto); }
  @Delete('memory-contests/:id') async deleteMemoryContest(@Request() req, @Param('id') id: string) { return this.socialService.deleteMemoryContest(id, req.user.userId); }

  // ==================== Digital Postcard ====================

  @Get('digital-postcards')
  async getDigitalPostcards(@Request() req) { return this.socialService.getDigitalPostcards(req.user.userId); }
  @Post('digital-postcards') async createDigitalPostcard(@Request() req, @Body() dto: dto.CreateDigitalPostcardDto) { return this.socialService.createDigitalPostcard(req.user.userId, dto); }
  @Post('digital-postcards/:id/open') async markPostcardOpened(@Param('id') id: string) { return this.socialService.markPostcardOpened(id); }
  @Delete('digital-postcards/:id') async deleteDigitalPostcard(@Request() req, @Param('id') id: string) { return this.socialService.deleteDigitalPostcard(id, req.user.userId); }

  // ==================== Memory Penpal ====================

  @Get('memory-penpals')
  async getMemoryPenpals(@Request() req) { return this.socialService.getMemoryPenpals(req.user.userId); }
  @Post('memory-penpals') async createMemoryPenpal(@Request() req, @Body() dto: dto.CreateMemoryPenpalDto) { return this.socialService.createMemoryPenpal(req.user.userId, dto); }
  @Put('memory-penpals/:id') async updateMemoryPenpal(@Request() req, @Param('id') id: string, @Body() dto: dto.UpdateMemoryPenpalDto) { return this.socialService.updateMemoryPenpal(id, req.user.userId, dto); }
  @Delete('memory-penpals/:id') async deleteMemoryPenpal(@Request() req, @Param('id') id: string) { return this.socialService.deleteMemoryPenpal(id, req.user.userId); }
}
