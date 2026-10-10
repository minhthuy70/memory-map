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
import { GenealogyService } from './genealogy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateFamilyMemberDto,
  UpdateFamilyMemberDto,
  CreateAncestralMigrationDto,
  UpdateAncestralMigrationDto,
  CreateOralHistoryDto,
  UpdateOralHistoryDto,
  CreateGenerationalComparisonDto,
  UpdateGenerationalComparisonDto,
  CreateGeofencedCapsuleDto,
  UpdateGeofencedCapsuleDto,
  CreateLegacyLetterDto,
  UpdateLegacyLetterDto,
  CreateDigitalMemorialDto,
  UpdateDigitalMemorialDto,
} from './dto/genealogy.dto';

@Controller('genealogy')
@UseGuards(JwtAuthGuard)
export class GenealogyController {
  constructor(private readonly genealogyService: GenealogyService) {}

  // ==================== Time Locked Capsules ====================

  @Get('time-capsules')
  async getTimeLockedCapsules(@Request() req) {
    return this.genealogyService.getTimeLockedCapsules(req.user.userId);
  }

  @Post('time-capsules')
  async createTimeLockedCapsule(@Request() req, @Body() data: any) {
    return this.genealogyService.createTimeLockedCapsule(req.user.userId, data);
  }

  @Post('time-capsules/:id/unlock')
  async unlockTimeLockedCapsule(@Request() req, @Param('id') id: string) {
    return this.genealogyService.unlockTimeLockedCapsule(req.user.userId, id);
  }

  // ==================== Geofenced Capsules ====================

  @Get('geofenced-capsules')
  async getGeofencedCapsules(@Request() req) {
    return this.genealogyService.getGeofencedCapsules(req.user.userId);
  }

  @Post('geofenced-capsules')
  async createGeofencedCapsule(@Request() req, @Body() data: any) {
    return this.genealogyService.createGeofencedCapsule(req.user.userId, data);
  }

  @Post('geofenced-capsules/check')
  async checkGeofencedUnlock(@Request() req, @Body() data: any) {
    return this.genealogyService.checkGeofencedUnlock(
      req.user.userId,
      data.latitude,
      data.longitude,
    );
  }

  // ==================== Legacy Letters ====================

  @Get('legacy-letters')
  async getLegacyLetters(@Request() req) {
    return this.genealogyService.getLegacyLetters(req.user.userId);
  }

  @Post('legacy-letters')
  async createLegacyLetter(@Request() req, @Body() data: any) {
    return this.genealogyService.createLegacyLetter(req.user.userId, data);
  }

  // ==================== Digital Memorials ====================

  @Get('memorials')
  async getDigitalMemorials(@Request() req) {
    return this.genealogyService.getDigitalMemorials(req.user.userId);
  }

  @Post('memorials')
  async createDigitalMemorial(@Request() req, @Body() data: any) {
    return this.genealogyService.createDigitalMemorial(req.user.userId, data);
  }

  @Post('memorials/:accessCode/condolence')
  async addCondolence(@Param('accessCode') accessCode: string, @Body() data: any) {
    return this.genealogyService.addCondolence(accessCode, data.message);
  }

  @Post('memorials/:accessCode/candle')
  async addCandle(@Param('accessCode') accessCode: string) {
    return this.genealogyService.addCandle(accessCode);
  }

  @Post('memorials/:accessCode/flower')
  async addFlower(@Param('accessCode') accessCode: string) {
    return this.genealogyService.addFlower(accessCode);
  }

  // ==================== Family Heirlooms ====================

  @Get('heirlooms')
  async getFamilyHeirlooms(@Request() req) {
    return this.genealogyService.getFamilyHeirlooms(req.user.userId);
  }

  @Post('heirlooms')
  async createFamilyHeirloom(@Request() req, @Body() data: any) {
    return this.genealogyService.createFamilyHeirloom(req.user.userId, data);
  }

  // ==================== Family Recipes ====================

  @Get('recipes')
  async getFamilyRecipes(@Request() req) {
    return this.genealogyService.getFamilyRecipes(req.user.userId);
  }

  @Post('recipes')
  async createFamilyRecipe(@Request() req, @Body() data: any) {
    return this.genealogyService.createFamilyRecipe(req.user.userId, data);
  }

  // ==================== Family Members ====================

  @Get('family-members')
  async getFamilyMembers(@Request() req) {
    return this.genealogyService.getFamilyMembers(req.user.userId);
  }

  @Post('family-members')
  async createFamilyMember(@Request() req, @Body() dto: CreateFamilyMemberDto) {
    return this.genealogyService.createFamilyMember(req.user.userId, dto);
  }

  @Put('family-members/:id')
  async updateFamilyMember(@Param('id') id: string, @Request() req, @Body() dto: UpdateFamilyMemberDto) {
    return this.genealogyService.updateFamilyMember(id, req.user.userId, dto);
  }

  @Delete('family-members/:id')
  async deleteFamilyMember(@Param('id') id: string, @Request() req) {
    return this.genealogyService.deleteFamilyMember(id, req.user.userId);
  }

  // ==================== Ancestral Migrations ====================

  @Get('ancestral-migrations')
  async getAncestralMigrations(@Request() req) {
    return this.genealogyService.getAncestralMigrations(req.user.userId);
  }

  @Post('ancestral-migrations')
  async createAncestralMigration(@Request() req, @Body() dto: CreateAncestralMigrationDto) {
    return this.genealogyService.createAncestralMigration(req.user.userId, dto);
  }

  @Put('ancestral-migrations/:id')
  async updateAncestralMigration(@Param('id') id: string, @Request() req, @Body() dto: UpdateAncestralMigrationDto) {
    return this.genealogyService.updateAncestralMigration(id, req.user.userId, dto);
  }

  @Delete('ancestral-migrations/:id')
  async deleteAncestralMigration(@Param('id') id: string, @Request() req) {
    return this.genealogyService.deleteAncestralMigration(id, req.user.userId);
  }

  // ==================== Oral Histories ====================

  @Get('oral-histories')
  async getOralHistories(@Request() req) {
    return this.genealogyService.getOralHistories(req.user.userId);
  }

  @Post('oral-histories')
  async createOralHistory(@Request() req, @Body() dto: CreateOralHistoryDto) {
    return this.genealogyService.createOralHistory(req.user.userId, dto);
  }

  @Put('oral-histories/:id')
  async updateOralHistory(@Param('id') id: string, @Request() req, @Body() dto: UpdateOralHistoryDto) {
    return this.genealogyService.updateOralHistory(id, req.user.userId, dto);
  }

  @Delete('oral-histories/:id')
  async deleteOralHistory(@Param('id') id: string, @Request() req) {
    return this.genealogyService.deleteOralHistory(id, req.user.userId);
  }

  // ==================== Generational Comparisons ====================

  @Get('generational-comparisons')
  async getGenerationalComparisons(@Request() req) {
    return this.genealogyService.getGenerationalComparisons(req.user.userId);
  }

  @Post('generational-comparisons')
  async createGenerationalComparison(@Request() req, @Body() dto: CreateGenerationalComparisonDto) {
    return this.genealogyService.createGenerationalComparison(req.user.userId, dto);
  }

  @Put('generational-comparisons/:id')
  async updateGenerationalComparison(@Param('id') id: string, @Request() req, @Body() dto: UpdateGenerationalComparisonDto) {
    return this.genealogyService.updateGenerationalComparison(id, req.user.userId, dto);
  }

  @Delete('generational-comparisons/:id')
  async deleteGenerationalComparison(@Param('id') id: string, @Request() req) {
    return this.genealogyService.deleteGenerationalComparison(id, req.user.userId);
  }

  // ==================== Update Geofenced Capsule ====================

  @Put('geofenced-capsules/:id')
  async updateGeofencedCapsule(@Param('id') id: string, @Request() req, @Body() dto: UpdateGeofencedCapsuleDto) {
    return this.genealogyService.updateGeofencedCapsule(id, req.user.userId, dto);
  }

  @Delete('geofenced-capsules/:id')
  async deleteGeofencedCapsule(@Param('id') id: string, @Request() req) {
    return this.genealogyService.deleteGeofencedCapsule(id, req.user.userId);
  }

  // ==================== Update Legacy Letter ====================

  @Put('legacy-letters/:id')
  async updateLegacyLetter(@Param('id') id: string, @Request() req, @Body() dto: UpdateLegacyLetterDto) {
    return this.genealogyService.updateLegacyLetter(id, req.user.userId, dto);
  }

  @Delete('legacy-letters/:id')
  async deleteLegacyLetter(@Param('id') id: string, @Request() req) {
    return this.genealogyService.deleteLegacyLetter(id, req.user.userId);
  }

  // ==================== Update Digital Memorial ====================

  @Put('memorials/:id')
  async updateDigitalMemorial(@Param('id') id: string, @Request() req, @Body() dto: UpdateDigitalMemorialDto) {
    return this.genealogyService.updateDigitalMemorial(id, req.user.userId, dto);
  }

  @Delete('memorials/:id')
  async deleteDigitalMemorial(@Param('id') id: string, @Request() req) {
    return this.genealogyService.deleteDigitalMemorial(id, req.user.userId);
  }
}
