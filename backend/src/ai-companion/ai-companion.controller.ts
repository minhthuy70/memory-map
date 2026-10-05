import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AICompanionService } from './ai-companion.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateAIJournalEntryDto,
  UpdateAIJournalEntryDto,
  GenerateJournalEntryDto,
} from './dto/ai-journal.dto';
import {
  CreateAIInterviewDto,
  UpdateAIInterviewDto,
  GenerateQuestionDto,
} from './dto/ai-interview.dto';
import {
  CreatePhotoCurationDto,
  UpdatePhotoCurationDto,
  BatchCurationDto,
} from './dto/photo-curation.dto';
import {
  SemanticSearchDto,
  IndexEntityDto,
} from './dto/semantic-search.dto';
import {
  CreateVoiceCloneModelDto,
  GenerateVoiceNarrationDto,
} from './dto/voice-clone.dto';

@Controller('ai-companion')
@UseGuards(JwtAuthGuard)
export class AICompanionController {
  constructor(private readonly aiCompanionService: AICompanionService) {}

  // ==================== AI Journal Entries ====================

  @Post('journal')
  async createAIJournalEntry(@Request() req, @Body() dto: CreateAIJournalEntryDto) {
    return this.aiCompanionService.createAIJournalEntry(req.user.userId, dto);
  }

  @Get('journal')
  async getAIJournalEntries(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.aiCompanionService.getAIJournalEntries(
      req.user.userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('journal/:id')
  async getAIJournalEntry(@Param('id') id: string, @Request() req) {
    return this.aiCompanionService.getAIJournalEntry(id, req.user.userId);
  }

  @Put('journal/:id')
  async updateAIJournalEntry(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateAIJournalEntryDto,
  ) {
    return this.aiCompanionService.updateAIJournalEntry(id, req.user.userId, dto);
  }

  @Delete('journal/:id')
  async deleteAIJournalEntry(@Param('id') id: string, @Request() req) {
    return this.aiCompanionService.deleteAIJournalEntry(id, req.user.userId);
  }

  @Post('journal/generate')
  async generateJournalEntry(@Request() req, @Body() dto: GenerateJournalEntryDto) {
    return this.aiCompanionService.generateJournalEntry(req.user.userId, dto);
  }

  // ==================== AI Interviews ====================

  @Post('interviews')
  async createAIInterview(@Request() req, @Body() dto: CreateAIInterviewDto) {
    return this.aiCompanionService.createAIInterview(req.user.userId, dto);
  }

  @Get('interviews')
  async getAIInterviews(
    @Request() req,
    @Query('completedOnly') completedOnly?: string,
  ) {
    return this.aiCompanionService.getAIInterviews(
      req.user.userId,
      completedOnly === 'true',
    );
  }

  @Get('interviews/:id')
  async getAIInterview(@Param('id') id: string, @Request() req) {
    return this.aiCompanionService.getAIInterview(id, req.user.userId);
  }

  @Put('interviews/:id')
  async updateAIInterview(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateAIInterviewDto,
  ) {
    return this.aiCompanionService.updateAIInterview(id, req.user.userId, dto);
  }

  @Delete('interviews/:id')
  async deleteAIInterview(@Param('id') id: string, @Request() req) {
    return this.aiCompanionService.deleteAIInterview(id, req.user.userId);
  }

  @Post('interviews/generate-question')
  async generateQuestion(@Request() req, @Body() dto: GenerateQuestionDto) {
    return this.aiCompanionService.generateQuestion(req.user.userId, dto);
  }

  // ==================== Photo Curation ====================

  @Post('photo-curation')
  async createPhotoCuration(@Request() req, @Body() dto: CreatePhotoCurationDto) {
    return this.aiCompanionService.createPhotoCuration(req.user.userId, dto);
  }

  @Get('photo-curation')
  async getPhotoCurations(
    @Request() req,
    @Query('memoryId') memoryId?: string,
  ) {
    return this.aiCompanionService.getPhotoCurations(req.user.userId, memoryId);
  }

  @Get('photo-curation/:id')
  async getPhotoCuration(@Param('id') id: string, @Request() req) {
    return this.aiCompanionService.getPhotoCuration(id, req.user.userId);
  }

  @Put('photo-curation/:id')
  async updatePhotoCuration(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdatePhotoCurationDto,
  ) {
    return this.aiCompanionService.updatePhotoCuration(id, req.user.userId, dto);
  }

  @Delete('photo-curation/:id')
  async deletePhotoCuration(@Param('id') id: string, @Request() req) {
    return this.aiCompanionService.deletePhotoCuration(id, req.user.userId);
  }

  @Post('photo-curation/batch')
  async batchCuration(@Request() req, @Body() dto: BatchCurationDto) {
    return this.aiCompanionService.batchCuration(req.user.userId, dto);
  }

  // ==================== Semantic Search ====================

  @Post('semantic-search/index')
  async indexEntity(@Request() req, @Body() dto: IndexEntityDto) {
    return this.aiCompanionService.indexEntity(req.user.userId, dto);
  }

  @Post('semantic-search')
  async semanticSearch(@Request() req, @Body() dto: SemanticSearchDto) {
    return this.aiCompanionService.semanticSearch(req.user.userId, dto);
  }

  @Get('semantic-search/indices')
  async getSearchIndices(
    @Request() req,
    @Query('entityType') entityType?: string,
  ) {
    return this.aiCompanionService.getSearchIndices(req.user.userId, entityType);
  }

  @Delete('semantic-search/indices/:id')
  async deleteSearchIndex(@Param('id') id: string, @Request() req) {
    return this.aiCompanionService.deleteSearchIndex(id, req.user.userId);
  }

  // ==================== Voice Cloning ====================

  @Post('voice-clone')
  async createVoiceCloneModel(@Request() req, @Body() dto: CreateVoiceCloneModelDto) {
    return this.aiCompanionService.createVoiceCloneModel(req.user.userId, dto);
  }

  @Get('voice-clone')
  async getVoiceCloneModels(@Request() req) {
    return this.aiCompanionService.getVoiceCloneModels(req.user.userId);
  }

  @Get('voice-clone/:id')
  async getVoiceCloneModel(@Param('id') id: string, @Request() req) {
    return this.aiCompanionService.getVoiceCloneModel(id, req.user.userId);
  }

  @Delete('voice-clone/:id')
  async deleteVoiceCloneModel(@Param('id') id: string, @Request() req) {
    return this.aiCompanionService.deleteVoiceCloneModel(id, req.user.userId);
  }

  @Post('voice-clone/narrate')
  async generateVoiceNarration(@Request() req, @Body() dto: GenerateVoiceNarrationDto) {
    return this.aiCompanionService.generateVoiceNarration(req.user.userId, dto);
  }
}
