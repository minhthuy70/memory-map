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
import { HybridCloudService } from './hybrid-cloud.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateOfflineSyncDto,
  SyncOfflineChangesDto,
} from './dto/offline-sync.dto';
import {
  CreateNASBackupDto,
  UpdateNASBackupDto,
  TriggerBackupDto,
} from './dto/nas-backup.dto';
import {
  CreateVaultExportDto,
  DownloadVaultExportDto,
} from './dto/vault-export.dto';
import {
  CreateUserWidgetDto,
  UpdateUserWidgetDto,
  GetWidgetsDto,
} from './dto/widget.dto';
import {
  CreateClipboardSyncDto,
  GetClipboardSyncDto,
} from './dto/clipboard-sync.dto';
import {
  CreateDesktopAppDto,
  UpdateDesktopAppDto,
  Platform,
} from './dto/desktop-app.dto';
import {
  CreateWildernessDataSaverDto,
  UpdateWildernessDataSaverDto,
} from './dto/wilderness-data-saver.dto';

@Controller('hybrid-cloud')
@UseGuards(JwtAuthGuard)
export class HybridCloudController {
  constructor(private readonly hybridCloudService: HybridCloudService) {}

  // ==================== Offline Sync ====================

  @Post('offline-sync')
  async createOfflineSync(@Request() req, @Body() dto: CreateOfflineSyncDto) {
    return this.hybridCloudService.createOfflineSync(req.user.userId, dto);
  }

  @Get('offline-sync/pending')
  async getPendingSyncs(@Request() req) {
    return this.hybridCloudService.getPendingSyncs(req.user.userId);
  }

  @Post('offline-sync/sync')
  async syncOfflineChanges(
    @Request() req,
    @Body() dto: SyncOfflineChangesDto,
  ) {
    return this.hybridCloudService.syncOfflineChanges(
      req.user.userId,
      dto.forceSync,
    );
  }

  @Put('offline-sync/:id')
  async markSynced(@Param('id') id: string) {
    return this.hybridCloudService.markSynced(id);
  }

  // ==================== NAS Backup ====================

  @Post('nas-backup')
  async createNASBackup(@Request() req, @Body() dto: CreateNASBackupDto) {
    return this.hybridCloudService.createNASBackup(req.user.userId, dto);
  }

  @Get('nas-backup')
  async getNASBackups(@Request() req) {
    return this.hybridCloudService.getNASBackups(req.user.userId);
  }

  @Get('nas-backup/:id')
  async getNASBackup(@Param('id') id: string, @Request() req) {
    return this.hybridCloudService.getNASBackup(id, req.user.userId);
  }

  @Put('nas-backup/:id')
  async updateNASBackup(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateNASBackupDto,
  ) {
    return this.hybridCloudService.updateNASBackup(id, req.user.userId, dto);
  }

  @Delete('nas-backup/:id')
  async deleteNASBackup(@Param('id') id: string, @Request() req) {
    return this.hybridCloudService.deleteNASBackup(id, req.user.userId);
  }

  @Post('nas-backup/:id/trigger')
  async triggerBackup(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: TriggerBackupDto,
  ) {
    return this.hybridCloudService.triggerBackup(id, req.user.userId);
  }

  // ==================== Vault Export ====================

  @Post('vault-export')
  async createVaultExport(@Request() req, @Body() dto: CreateVaultExportDto) {
    return this.hybridCloudService.createVaultExport(req.user.userId, dto);
  }

  @Get('vault-export')
  async getVaultExports(@Request() req) {
    return this.hybridCloudService.getVaultExports(req.user.userId);
  }

  @Get('vault-export/:id')
  async getVaultExport(@Param('id') id: string, @Request() req) {
    return this.hybridCloudService.getVaultExport(id, req.user.userId);
  }

  @Post('vault-export/verify')
  async verifyVaultExportAccess(@Body() dto: DownloadVaultExportDto) {
    return this.hybridCloudService.verifyVaultExportAccess(dto.accessCode);
  }

  @Delete('vault-export/:id')
  async deleteVaultExport(@Param('id') id: string, @Request() req) {
    return this.hybridCloudService.deleteVaultExport(id, req.user.userId);
  }

  // ==================== Widgets ====================

  @Post('widgets')
  async createUserWidget(@Request() req, @Body() dto: CreateUserWidgetDto) {
    return this.hybridCloudService.createUserWidget(req.user.userId, dto);
  }

  @Get('widgets')
  async getUserWidgets(@Request() req, @Query() query: GetWidgetsDto) {
    return this.hybridCloudService.getUserWidgets(
      req.user.userId,
      query.widgetType,
    );
  }

  @Get('widgets/:id')
  async getUserWidget(@Param('id') id: string, @Request() req) {
    return this.hybridCloudService.getUserWidget(id, req.user.userId);
  }

  @Put('widgets/:id')
  async updateUserWidget(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateUserWidgetDto,
  ) {
    return this.hybridCloudService.updateUserWidget(id, req.user.userId, dto);
  }

  @Delete('widgets/:id')
  async deleteUserWidget(@Param('id') id: string, @Request() req) {
    return this.hybridCloudService.deleteUserWidget(id, req.user.userId);
  }

  // ==================== Clipboard Sync ====================

  @Post('clipboard-sync')
  async createClipboardSync(@Request() req, @Body() dto: CreateClipboardSyncDto) {
    return this.hybridCloudService.createClipboardSync(req.user.userId, dto);
  }

  @Get('clipboard-sync/:clipboardId')
  async getClipboardSync(
    @Param('clipboardId') clipboardId: string,
    @Request() req,
  ) {
    return this.hybridCloudService.getClipboardSync(clipboardId, req.user.userId);
  }

  @Get('clipboard-sync')
  async getClipboardSyncs(@Request() req) {
    return this.hybridCloudService.getClipboardSyncs(req.user.userId);
  }

  @Delete('clipboard-sync/:clipboardId')
  async deleteClipboardSync(
    @Param('clipboardId') clipboardId: string,
    @Request() req,
  ) {
    return this.hybridCloudService.deleteClipboardSync(clipboardId, req.user.userId);
  }

  @Post('clipboard-sync/cleanup')
  async cleanupExpiredClipboardSyncs() {
    return this.hybridCloudService.cleanupExpiredClipboardSyncs();
  }

  // ==================== Desktop App ====================

  @Post('desktop-app')
  async createDesktopApp(@Request() req, @Body() dto: CreateDesktopAppDto) {
    return this.hybridCloudService.createDesktopApp(req.user.userId, dto);
  }

  @Get('desktop-app')
  async getDesktopApps(@Request() req, @Query('platform') platform?: Platform) {
    return this.hybridCloudService.getDesktopApps(req.user.userId, platform);
  }

  @Get('desktop-app/:id')
  async getDesktopApp(@Param('id') id: string, @Request() req) {
    return this.hybridCloudService.getDesktopApp(id, req.user.userId);
  }

  @Put('desktop-app/:id')
  async updateDesktopApp(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateDesktopAppDto,
  ) {
    return this.hybridCloudService.updateDesktopApp(id, req.user.userId, dto);
  }

  @Delete('desktop-app/:id')
  async deleteDesktopApp(@Param('id') id: string, @Request() req) {
    return this.hybridCloudService.deleteDesktopApp(id, req.user.userId);
  }

  @Post('desktop-app/:id/sync')
  async updateDesktopAppSync(@Param('id') id: string, @Request() req) {
    return this.hybridCloudService.updateDesktopAppSync(id, req.user.userId);
  }

  // ==================== Wilderness Data Saver ====================

  @Post('wilderness-data-saver')
  async createWildernessDataSaver(@Request() req, @Body() dto: CreateWildernessDataSaverDto) {
    return this.hybridCloudService.createWildernessDataSaver(req.user.userId, dto);
  }

  @Get('wilderness-data-saver')
  async getWildernessDataSaver(@Request() req) {
    return this.hybridCloudService.getWildernessDataSaver(req.user.userId);
  }

  @Put('wilderness-data-saver')
  async updateWildernessDataSaver(@Request() req, @Body() dto: UpdateWildernessDataSaverDto) {
    return this.hybridCloudService.updateWildernessDataSaver(req.user.userId, dto);
  }

  @Post('wilderness-data-saver/trigger')
  async triggerWildernessMode(@Request() req) {
    return this.hybridCloudService.triggerWildernessMode(req.user.userId);
  }

  @Post('wilderness-data-saver/disable')
  async disableWildernessMode(@Request() req) {
    return this.hybridCloudService.disableWildernessMode(req.user.userId);
  }
}
