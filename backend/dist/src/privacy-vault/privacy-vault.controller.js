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
const calculator_camouflage_dto_1 = require("./dto/calculator-camouflage.dto");
const zero_knowledge_e2ee_dto_1 = require("./dto/zero-knowledge-e2ee.dto");
const exif_sanitizer_dto_1 = require("./dto/exif-sanitizer.dto");
const screenshot_prevention_dto_1 = require("./dto/screenshot-prevention.dto");
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
    async createCalculatorCamouflage(req, dto) {
        return this.privacyVaultService.createCalculatorCamouflage(req.user.userId, dto);
    }
    async getCalculatorCamouflage(req) {
        return this.privacyVaultService.getCalculatorCamouflage(req.user.userId);
    }
    async updateCalculatorCamouflage(req, dto) {
        return this.privacyVaultService.updateCalculatorCamouflage(req.user.userId, dto);
    }
    async deleteCalculatorCamouflage(req) {
        return this.privacyVaultService.deleteCalculatorCamouflage(req.user.userId);
    }
    async verifySecretPin(req, body) {
        return this.privacyVaultService.verifySecretPin(req.user.userId, body.pin);
    }
    async createZeroKnowledgeE2EE(req, dto) {
        return this.privacyVaultService.createZeroKnowledgeE2EE(req.user.userId, dto);
    }
    async getZeroKnowledgeE2EE(req) {
        return this.privacyVaultService.getZeroKnowledgeE2EE(req.user.userId);
    }
    async updateZeroKnowledgeE2EE(req, dto) {
        return this.privacyVaultService.updateZeroKnowledgeE2EE(req.user.userId, dto);
    }
    async rotateMasterKey(req, body) {
        return this.privacyVaultService.rotateMasterKey(req.user.userId, body.newMasterKey);
    }
    async deleteZeroKnowledgeE2EE(req) {
        return this.privacyVaultService.deleteZeroKnowledgeE2EE(req.user.userId);
    }
    async createExifSanitizer(req, dto) {
        return this.privacyVaultService.createExifSanitizer(req.user.userId, dto);
    }
    async getExifSanitizers(req) {
        return this.privacyVaultService.getExifSanitizers(req.user.userId);
    }
    async getExifSanitizer(id, req) {
        return this.privacyVaultService.getExifSanitizer(id, req.user.userId);
    }
    async updateExifSanitizer(id, req, dto) {
        return this.privacyVaultService.updateExifSanitizer(id, req.user.userId, dto);
    }
    async deleteExifSanitizer(id, req) {
        return this.privacyVaultService.deleteExifSanitizer(id, req.user.userId);
    }
    async createScreenshotPrevention(req, dto) {
        return this.privacyVaultService.createScreenshotPrevention(req.user.userId, dto);
    }
    async getScreenshotPrevention(req) {
        return this.privacyVaultService.getScreenshotPrevention(req.user.userId);
    }
    async updateScreenshotPrevention(req, dto) {
        return this.privacyVaultService.updateScreenshotPrevention(req.user.userId, dto);
    }
    async deleteScreenshotPrevention(req) {
        return this.privacyVaultService.deleteScreenshotPrevention(req.user.userId);
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
__decorate([
    (0, common_1.Post)('calculator-camouflage'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, calculator_camouflage_dto_1.CreateCalculatorCamouflageDto]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "createCalculatorCamouflage", null);
__decorate([
    (0, common_1.Get)('calculator-camouflage'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "getCalculatorCamouflage", null);
__decorate([
    (0, common_1.Put)('calculator-camouflage'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, calculator_camouflage_dto_1.UpdateCalculatorCamouflageDto]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "updateCalculatorCamouflage", null);
__decorate([
    (0, common_1.Delete)('calculator-camouflage'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "deleteCalculatorCamouflage", null);
__decorate([
    (0, common_1.Post)('calculator-camouflage/verify'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "verifySecretPin", null);
__decorate([
    (0, common_1.Post)('zero-knowledge-e2ee'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, zero_knowledge_e2ee_dto_1.CreateZeroKnowledgeE2EEDto]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "createZeroKnowledgeE2EE", null);
__decorate([
    (0, common_1.Get)('zero-knowledge-e2ee'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "getZeroKnowledgeE2EE", null);
__decorate([
    (0, common_1.Put)('zero-knowledge-e2ee'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, zero_knowledge_e2ee_dto_1.UpdateZeroKnowledgeE2EEDto]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "updateZeroKnowledgeE2EE", null);
__decorate([
    (0, common_1.Post)('zero-knowledge-e2ee/rotate-key'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "rotateMasterKey", null);
__decorate([
    (0, common_1.Delete)('zero-knowledge-e2ee'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "deleteZeroKnowledgeE2EE", null);
__decorate([
    (0, common_1.Post)('exif-sanitizer'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, exif_sanitizer_dto_1.CreateExifSanitizerDto]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "createExifSanitizer", null);
__decorate([
    (0, common_1.Get)('exif-sanitizer'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "getExifSanitizers", null);
__decorate([
    (0, common_1.Get)('exif-sanitizer/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "getExifSanitizer", null);
__decorate([
    (0, common_1.Put)('exif-sanitizer/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, exif_sanitizer_dto_1.UpdateExifSanitizerDto]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "updateExifSanitizer", null);
__decorate([
    (0, common_1.Delete)('exif-sanitizer/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "deleteExifSanitizer", null);
__decorate([
    (0, common_1.Post)('screenshot-prevention'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, screenshot_prevention_dto_1.CreateScreenshotPreventionDto]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "createScreenshotPrevention", null);
__decorate([
    (0, common_1.Get)('screenshot-prevention'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "getScreenshotPrevention", null);
__decorate([
    (0, common_1.Put)('screenshot-prevention'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, screenshot_prevention_dto_1.UpdateScreenshotPreventionDto]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "updateScreenshotPrevention", null);
__decorate([
    (0, common_1.Delete)('screenshot-prevention'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrivacyVaultController.prototype, "deleteScreenshotPrevention", null);
exports.PrivacyVaultController = PrivacyVaultController = __decorate([
    (0, common_1.Controller)('privacy-vault'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [privacy_vault_service_1.PrivacyVaultService])
], PrivacyVaultController);
//# sourceMappingURL=privacy-vault.controller.js.map