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
}
