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
}
