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
exports.PrivacyVaultController = void 0;
const common_1 = require("@nestjs/common");
const privacy_vault_service_1 = require("./privacy-vault.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const vault_memory_dto_1 = require("./dto/vault-memory.dto");
const audit_log_dto_1 = require("./dto/audit-log.dto");
const duress_password_dto_1 = require("./dto/duress-password.dto");
let PrivacyVaultController = class PrivacyVaultController {
    constructor(privacyVaultService) {
        this.privacyVaultService = privacyVaultService;
    }
    async createVaultMemory(req, dto) {
        return this.privacyVaultService.createVaultMemory(req.user.userId, dto);
    }
    async getVaultMemories(req, vaultType) {
        return this.privacyVaultService.getVaultMemories(req.user.userId, vaultType);
    }
    async getVaultMemory(id, req) {
        return this.privacyVaultService.getVaultMemory(id, req.user.userId);
    }
    async updateVaultMemory(id, req, dto) {
        return this.privacyVaultService.updateVaultMemory(id, req.user.userId, dto);
    }
    async deleteVaultMemory(id, req) {
        return this.privacyVaultService.deleteVaultMemory(id, req.user.userId);
    }
    async accessVaultMemory(id, req, dto) {
        return this.privacyVaultService.accessVaultMemory(id, req.user.userId, dto);
    }
    async destroyVaultMemory(id, req) {
        return this.privacyVaultService.destroyVaultMemory(id, req.user.userId);
    }
    async createAuditLog(req, dto) {
        return this.privacyVaultService.createAuditLog(req.user.userId, dto);
    }
    async getAuditLogs(req, query) {
        return this.privacyVaultService.getAuditLogs(req.user.userId, query);
    }
    async verifyAuditLogIntegrity(req) {
        return this.privacyVaultService.verifyAuditLogIntegrity(req.user.userId);
    }
    async createDuressPassword(req, dto) {
        return this.privacyVaultService.createDuressPassword(req.user.userId, dto);
    }
    async verifyDuressPassword(req, dto) {
        return this.privacyVaultService.verifyDuressPassword(req.user.userId, dto);
    }
    async getDuressPasswords(req) {
        return this.privacyVaultService.getDuressPasswords(req.user.userId);
    }
    async deleteDuressPassword(id, req) {
        return this.privacyVaultService.deleteDuressPassword(id, req.user.userId);
    }
    async triggerEmergencyKillSwitch(req) {
        return this.privacyVaultService.triggerEmergencyKillSwitch(req.user.userId);
    }
    async fuzzCoordinates(body) {
        return this.privacyVaultService.fuzzCoordinates(body.lat, body.lng, body.radiusMeters);
    }
};
exports.PrivacyVaultController = PrivacyVaultController;
__decorate([
    (0, common_1.Post)('vault'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, vault_memory_dto_1.CreateVaultMemoryDto]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "createVaultMemory", null);
__decorate([
    (0, common_1.Get)('vault'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('vaultType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "getVaultMemories", null);
__decorate([
    (0, common_1.Get)('vault/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "getVaultMemory", null);
__decorate([
    (0, common_1.Put)('vault/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, vault_memory_dto_1.UpdateVaultMemoryDto]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "updateVaultMemory", null);
__decorate([
    (0, common_1.Delete)('vault/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "deleteVaultMemory", null);
__decorate([
    (0, common_1.Post)('vault/:id/access'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, vault_memory_dto_1.AccessVaultMemoryDto]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "accessVaultMemory", null);
__decorate([
    (0, common_1.Post)('vault/:id/destroy'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "destroyVaultMemory", null);
__decorate([
    (0, common_1.Post)('audit-log'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, audit_log_dto_1.CreateAuditLogDto]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "createAuditLog", null);
__decorate([
    (0, common_1.Get)('audit-log'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, audit_log_dto_1.GetAuditLogsDto]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Get)('audit-log/verify'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "verifyAuditLogIntegrity", null);
__decorate([
    (0, common_1.Post)('duress-password'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, duress_password_dto_1.CreateDuressPasswordDto]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "createDuressPassword", null);
__decorate([
    (0, common_1.Post)('duress-password/verify'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, duress_password_dto_1.VerifyDuressPasswordDto]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "verifyDuressPassword", null);
__decorate([
    (0, common_1.Get)('duress-password'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "getDuressPasswords", null);
__decorate([
    (0, common_1.Delete)('duress-password/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "deleteDuressPassword", null);
__decorate([
    (0, common_1.Post)('emergency-kill-switch'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "triggerEmergencyKillSwitch", null);
__decorate([
    (0, common_1.Post)('fuzz-coordinates'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "fuzzCoordinates", null);
exports.PrivacyVaultController = PrivacyVaultController = __decorate([
    (0, common_1.Controller)('privacy-vault'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [privacy_vault_service_1.PrivacyVaultService])
], PrivacyVaultController);
//# sourceMappingURL=privacy-vault.controller.js.map