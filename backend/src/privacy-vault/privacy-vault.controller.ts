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
import { PrivacyVaultService } from './privacy-vault.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateVaultMemoryDto,
  UpdateVaultMemoryDto,
  AccessVaultMemoryDto,
  VaultType,
} from './dto/vault-memory.dto';
import {
  CreateAuditLogDto,
  GetAuditLogsDto,
} from './dto/audit-log.dto';
import {
  CreateDuressPasswordDto,
  VerifyDuressPasswordDto,
} from './dto/duress-password.dto';
import {
  CreateCalculatorCamouflageDto,
  UpdateCalculatorCamouflageDto,
} from './dto/calculator-camouflage.dto';
import {
  CreateZeroKnowledgeE2EEDto,
  UpdateZeroKnowledgeE2EEDto,
} from './dto/zero-knowledge-e2ee.dto';
import {
  CreateExifSanitizerDto,
  UpdateExifSanitizerDto,
} from './dto/exif-sanitizer.dto';
import {
  CreateScreenshotPreventionDto,
  UpdateScreenshotPreventionDto,
} from './dto/screenshot-prevention.dto';

@Controller('privacy-vault')
@UseGuards(JwtAuthGuard)
export class PrivacyVaultController {
  constructor(private readonly privacyVaultService: PrivacyVaultService) {}

  // ==================== Vault Memories ====================

  @Post('vault')
  async createVaultMemory(@Request() req, @Body() dto: CreateVaultMemoryDto) {
    return this.privacyVaultService.createVaultMemory(req.user.userId, dto);
  }

  @Get('vault')
  async getVaultMemories(
    @Request() req,
    @Query('vaultType') vaultType?: VaultType,
  ) {
    return this.privacyVaultService.getVaultMemories(req.user.userId, vaultType);
  }

  @Get('vault/:id')
  async getVaultMemory(@Param('id') id: string, @Request() req) {
    return this.privacyVaultService.getVaultMemory(id, req.user.userId);
  }

  @Put('vault/:id')
  async updateVaultMemory(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateVaultMemoryDto,
  ) {
    return this.privacyVaultService.updateVaultMemory(id, req.user.userId, dto);
  }

  @Delete('vault/:id')
  async deleteVaultMemory(@Param('id') id: string, @Request() req) {
    return this.privacyVaultService.deleteVaultMemory(id, req.user.userId);
  }

  @Post('vault/:id/access')
  async accessVaultMemory(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: AccessVaultMemoryDto,
  ) {
    return this.privacyVaultService.accessVaultMemory(id, req.user.userId, dto);
  }

  @Post('vault/:id/destroy')
  async destroyVaultMemory(@Param('id') id: string, @Request() req) {
    return this.privacyVaultService.destroyVaultMemory(id, req.user.userId);
  }

  // ==================== Audit Logs ====================

  @Post('audit-log')
  async createAuditLog(@Request() req, @Body() dto: CreateAuditLogDto) {
    return this.privacyVaultService.createAuditLog(req.user.userId, dto);
  }

  @Get('audit-log')
  async getAuditLogs(@Request() req, @Query() query: GetAuditLogsDto) {
    return this.privacyVaultService.getAuditLogs(req.user.userId, query);
  }

  @Get('audit-log/verify')
  async verifyAuditLogIntegrity(@Request() req) {
    return this.privacyVaultService.verifyAuditLogIntegrity(req.user.userId);
  }

  // ==================== Duress Password ====================

  @Post('duress-password')
  async createDuressPassword(@Request() req, @Body() dto: CreateDuressPasswordDto) {
    return this.privacyVaultService.createDuressPassword(req.user.userId, dto);
  }

  @Post('duress-password/verify')
  async verifyDuressPassword(@Request() req, @Body() dto: VerifyDuressPasswordDto) {
    return this.privacyVaultService.verifyDuressPassword(req.user.userId, dto);
  }

  @Get('duress-password')
  async getDuressPasswords(@Request() req) {
    return this.privacyVaultService.getDuressPasswords(req.user.userId);
  }

  @Delete('duress-password/:id')
  async deleteDuressPassword(@Param('id') id: string, @Request() req) {
    return this.privacyVaultService.deleteDuressPassword(id, req.user.userId);
  }

  // ==================== Emergency Kill Switch ====================

  @Post('emergency-kill-switch')
  async triggerEmergencyKillSwitch(@Request() req) {
    return this.privacyVaultService.triggerEmergencyKillSwitch(req.user.userId);
  }

  // ==================== Coordinate Fuzzing ====================

  @Post('fuzz-coordinates')
  async fuzzCoordinates(
    @Body() body: { lat: number; lng: number; radiusMeters?: number },
  ) {
    return this.privacyVaultService.fuzzCoordinates(
      body.lat,
      body.lng,
      body.radiusMeters,
    );
  }

  // ==================== Calculator Camouflage ====================

  @Post('calculator-camouflage')
  async createCalculatorCamouflage(@Request() req, @Body() dto: CreateCalculatorCamouflageDto) {
    return this.privacyVaultService.createCalculatorCamouflage(req.user.userId, dto);
  }

  @Get('calculator-camouflage')
  async getCalculatorCamouflage(@Request() req) {
    return this.privacyVaultService.getCalculatorCamouflage(req.user.userId);
  }

  @Put('calculator-camouflage')
  async updateCalculatorCamouflage(@Request() req, @Body() dto: UpdateCalculatorCamouflageDto) {
    return this.privacyVaultService.updateCalculatorCamouflage(req.user.userId, dto);
  }

  @Delete('calculator-camouflage')
  async deleteCalculatorCamouflage(@Request() req) {
    return this.privacyVaultService.deleteCalculatorCamouflage(req.user.userId);
  }

  @Post('calculator-camouflage/verify')
  async verifySecretPin(@Request() req, @Body() body: { pin: string }) {
    return this.privacyVaultService.verifySecretPin(req.user.userId, body.pin);
  }

  // ==================== Zero-Knowledge E2EE ====================

  @Post('zero-knowledge-e2ee')
  async createZeroKnowledgeE2EE(@Request() req, @Body() dto: CreateZeroKnowledgeE2EEDto) {
    return this.privacyVaultService.createZeroKnowledgeE2EE(req.user.userId, dto);
  }

  @Get('zero-knowledge-e2ee')
  async getZeroKnowledgeE2EE(@Request() req) {
    return this.privacyVaultService.getZeroKnowledgeE2EE(req.user.userId);
  }

  @Put('zero-knowledge-e2ee')
  async updateZeroKnowledgeE2EE(@Request() req, @Body() dto: UpdateZeroKnowledgeE2EEDto) {
    return this.privacyVaultService.updateZeroKnowledgeE2EE(req.user.userId, dto);
  }

  @Post('zero-knowledge-e2ee/rotate-key')
  async rotateMasterKey(@Request() req, @Body() body: { newMasterKey: string }) {
    return this.privacyVaultService.rotateMasterKey(req.user.userId, body.newMasterKey);
  }

  @Delete('zero-knowledge-e2ee')
  async deleteZeroKnowledgeE2EE(@Request() req) {
    return this.privacyVaultService.deleteZeroKnowledgeE2EE(req.user.userId);
  }

  // ==================== EXIF Sanitizer ====================

  @Post('exif-sanitizer')
  async createExifSanitizer(@Request() req, @Body() dto: CreateExifSanitizerDto) {
    return this.privacyVaultService.createExifSanitizer(req.user.userId, dto);
  }

  @Get('exif-sanitizer')
  async getExifSanitizers(@Request() req) {
    return this.privacyVaultService.getExifSanitizers(req.user.userId);
  }

  @Get('exif-sanitizer/:id')
  async getExifSanitizer(@Param('id') id: string, @Request() req) {
    return this.privacyVaultService.getExifSanitizer(id, req.user.userId);
  }

  @Put('exif-sanitizer/:id')
  async updateExifSanitizer(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateExifSanitizerDto,
  ) {
    return this.privacyVaultService.updateExifSanitizer(id, req.user.userId, dto);
  }

  @Delete('exif-sanitizer/:id')
  async deleteExifSanitizer(@Param('id') id: string, @Request() req) {
    return this.privacyVaultService.deleteExifSanitizer(id, req.user.userId);
  }

  // ==================== Screenshot Prevention ====================

  @Post('screenshot-prevention')
  async createScreenshotPrevention(@Request() req, @Body() dto: CreateScreenshotPreventionDto) {
    return this.privacyVaultService.createScreenshotPrevention(req.user.userId, dto);
  }

  @Get('screenshot-prevention')
  async getScreenshotPrevention(@Request() req) {
    return this.privacyVaultService.getScreenshotPrevention(req.user.userId);
  }

  @Put('screenshot-prevention')
  async updateScreenshotPrevention(@Request() req, @Body() dto: UpdateScreenshotPreventionDto) {
    return this.privacyVaultService.updateScreenshotPrevention(req.user.userId, dto);
  }

  @Delete('screenshot-prevention')
  async deleteScreenshotPrevention(@Request() req) {
    return this.privacyVaultService.deleteScreenshotPrevention(req.user.userId);
  }
}
