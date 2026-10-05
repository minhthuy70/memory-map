"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HybridCloudController = void 0;
const common_1 = require("@nestjs/common");
const hybrid_cloud_service_1 = require("./hybrid-cloud.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const offline_sync_dto_1 = require("./dto/offline-sync.dto");
const nas_backup_dto_1 = require("./dto/nas-backup.dto");
const vault_export_dto_1 = require("./dto/vault-export.dto");
const widget_dto_1 = require("./dto/widget.dto");
const clipboard_sync_dto_1 = require("./dto/clipboard-sync.dto");
let HybridCloudController = class HybridCloudController {
    constructor(hybridCloudService) {
        this.hybridCloudService = hybridCloudService;
    }
    async createOfflineSync(req, dto) {
        return this.hybridCloudService.createOfflineSync(req.user.userId, dto);
    }
    async getPendingSyncs(req) {
        return this.hybridCloudService.getPendingSyncs(req.user.userId);
    }
    async syncOfflineChanges(req, dto) {
        return this.hybridCloudService.syncOfflineChanges(req.user.userId, dto.forceSync);
    }
    async markSynced(id) {
        return this.hybridCloudService.markSynced(id);
    }
    async createNASBackup(req, dto) {
        return this.hybridCloudService.createNASBackup(req.user.userId, dto);
    }
    async getNASBackups(req) {
        return this.hybridCloudService.getNASBackups(req.user.userId);
    }
    async getNASBackup(id, req) {
        return this.hybridCloudService.getNASBackup(id, req.user.userId);
    }
    async updateNASBackup(id, req, dto) {
        return this.hybridCloudService.updateNASBackup(id, req.user.userId, dto);
    }
    async deleteNASBackup(id, req) {
        return this.hybridCloudService.deleteNASBackup(id, req.user.userId);
    }
    async triggerBackup(id, req, dto) {
        return this.hybridCloudService.triggerBackup(id, req.user.userId);
    }
    async createVaultExport(req, dto) {
        return this.hybridCloudService.createVaultExport(req.user.userId, dto);
    }
    async getVaultExports(req) {
        return this.hybridCloudService.getVaultExports(req.user.userId);
    }
    async getVaultExport(id, req) {
        return this.hybridCloudService.getVaultExport(id, req.user.userId);
    }
    async verifyVaultExportAccess(dto) {
        return this.hybridCloudService.verifyVaultExportAccess(dto.accessCode);
    }
    async deleteVaultExport(id, req) {
        return this.hybridCloudService.deleteVaultExport(id, req.user.userId);
    }
    async createUserWidget(req, dto) {
        return this.hybridCloudService.createUserWidget(req.user.userId, dto);
    }
    async getUserWidgets(req, query) {
        return this.hybridCloudService.getUserWidgets(req.user.userId, query.widgetType);
    }
    async getUserWidget(id, req) {
        return this.hybridCloudService.getUserWidget(id, req.user.userId);
    }
    async updateUserWidget(id, req, dto) {
        return this.hybridCloudService.updateUserWidget(id, req.user.userId, dto);
    }
    async deleteUserWidget(id, req) {
        return this.hybridCloudService.deleteUserWidget(id, req.user.userId);
    }
    async createClipboardSync(req, dto) {
        return this.hybridCloudService.createClipboardSync(req.user.userId, dto);
    }
    async getClipboardSync(clipboardId, req) {
        return this.hybridCloudService.getClipboardSync(clipboardId, req.user.userId);
    }
    async getClipboardSyncs(req) {
        return this.hybridCloudService.getClipboardSyncs(req.user.userId);
    }
    async deleteClipboardSync(clipboardId, req) {
        return this.hybridCloudService.deleteClipboardSync(clipboardId, req.user.userId);
    }
    async cleanupExpiredClipboardSyncs() {
        return this.hybridCloudService.cleanupExpiredClipboardSyncs();
    }
};
exports.HybridCloudController = HybridCloudController;
__decorate([
    (0, common_1.Post)('offline-sync'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, offline_sync_dto_1.CreateOfflineSyncDto]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "createOfflineSync", null);
__decorate([
    (0, common_1.Get)('offline-sync/pending'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "getPendingSyncs", null);
__decorate([
    (0, common_1.Post)('offline-sync/sync'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, offline_sync_dto_1.SyncOfflineChangesDto]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "syncOfflineChanges", null);
__decorate([
    (0, common_1.Put)('offline-sync/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "markSynced", null);
__decorate([
    (0, common_1.Post)('nas-backup'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, nas_backup_dto_1.CreateNASBackupDto]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "createNASBackup", null);
__decorate([
    (0, common_1.Get)('nas-backup'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "getNASBackups", null);
__decorate([
    (0, common_1.Get)('nas-backup/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "getNASBackup", null);
__decorate([
    (0, common_1.Put)('nas-backup/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, nas_backup_dto_1.UpdateNASBackupDto]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "updateNASBackup", null);
__decorate([
    (0, common_1.Delete)('nas-backup/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "deleteNASBackup", null);
__decorate([
    (0, common_1.Post)('nas-backup/:id/trigger'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, nas_backup_dto_1.TriggerBackupDto]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "triggerBackup", null);
__decorate([
    (0, common_1.Post)('vault-export'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, vault_export_dto_1.CreateVaultExportDto]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "createVaultExport", null);
__decorate([
    (0, common_1.Get)('vault-export'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "getVaultExports", null);
__decorate([
    (0, common_1.Get)('vault-export/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "getVaultExport", null);
__decorate([
    (0, common_1.Post)('vault-export/verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vault_export_dto_1.DownloadVaultExportDto]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "verifyVaultExportAccess", null);
__decorate([
    (0, common_1.Delete)('vault-export/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "deleteVaultExport", null);
__decorate([
    (0, common_1.Post)('widgets'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, widget_dto_1.CreateUserWidgetDto]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "createUserWidget", null);
__decorate([
    (0, common_1.Get)('widgets'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, widget_dto_1.GetWidgetsDto]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "getUserWidgets", null);
__decorate([
    (0, common_1.Get)('widgets/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "getUserWidget", null);
__decorate([
    (0, common_1.Put)('widgets/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, widget_dto_1.UpdateUserWidgetDto]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "updateUserWidget", null);
__decorate([
    (0, common_1.Delete)('widgets/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "deleteUserWidget", null);
__decorate([
    (0, common_1.Post)('clipboard-sync'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, clipboard_sync_dto_1.CreateClipboardSyncDto]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "createClipboardSync", null);
__decorate([
    (0, common_1.Get)('clipboard-sync/:clipboardId'),
    __param(0, (0, common_1.Param)('clipboardId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "getClipboardSync", null);
__decorate([
    (0, common_1.Get)('clipboard-sync'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "getClipboardSyncs", null);
__decorate([
    (0, common_1.Delete)('clipboard-sync/:clipboardId'),
    __param(0, (0, common_1.Param)('clipboardId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "deleteClipboardSync", null);
__decorate([
    (0, common_1.Post)('clipboard-sync/cleanup'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HybridCloudController.prototype, "cleanupExpiredClipboardSyncs", null);
exports.HybridCloudController = HybridCloudController = __decorate([
    (0, common_1.Controller)('hybrid-cloud'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [hybrid_cloud_service_1.HybridCloudService])
], HybridCloudController);
//# sourceMappingURL=hybrid-cloud.controller.js.map