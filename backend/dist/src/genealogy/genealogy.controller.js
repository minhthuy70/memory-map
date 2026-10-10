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
exports.GenealogyController = void 0;
const common_1 = require("@nestjs/common");
const genealogy_service_1 = require("./genealogy.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const genealogy_dto_1 = require("./dto/genealogy.dto");
let GenealogyController = class GenealogyController {
    constructor(genealogyService) {
        this.genealogyService = genealogyService;
    }
    async getTimeLockedCapsules(req) {
        return this.genealogyService.getTimeLockedCapsules(req.user.userId);
    }
    async createTimeLockedCapsule(req, data) {
        return this.genealogyService.createTimeLockedCapsule(req.user.userId, data);
    }
    async unlockTimeLockedCapsule(req, id) {
        return this.genealogyService.unlockTimeLockedCapsule(req.user.userId, id);
    }
    async getGeofencedCapsules(req) {
        return this.genealogyService.getGeofencedCapsules(req.user.userId);
    }
    async createGeofencedCapsule(req, data) {
        return this.genealogyService.createGeofencedCapsule(req.user.userId, data);
    }
    async checkGeofencedUnlock(req, data) {
        return this.genealogyService.checkGeofencedUnlock(req.user.userId, data.latitude, data.longitude);
    }
    async getLegacyLetters(req) {
        return this.genealogyService.getLegacyLetters(req.user.userId);
    }
    async createLegacyLetter(req, data) {
        return this.genealogyService.createLegacyLetter(req.user.userId, data);
    }
    async getDigitalMemorials(req) {
        return this.genealogyService.getDigitalMemorials(req.user.userId);
    }
    async createDigitalMemorial(req, data) {
        return this.genealogyService.createDigitalMemorial(req.user.userId, data);
    }
    async addCondolence(accessCode, data) {
        return this.genealogyService.addCondolence(accessCode, data.message);
    }
    async addCandle(accessCode) {
        return this.genealogyService.addCandle(accessCode);
    }
    async addFlower(accessCode) {
        return this.genealogyService.addFlower(accessCode);
    }
    async getFamilyHeirlooms(req) {
        return this.genealogyService.getFamilyHeirlooms(req.user.userId);
    }
    async createFamilyHeirloom(req, data) {
        return this.genealogyService.createFamilyHeirloom(req.user.userId, data);
    }
    async getFamilyRecipes(req) {
        return this.genealogyService.getFamilyRecipes(req.user.userId);
    }
    async createFamilyRecipe(req, data) {
        return this.genealogyService.createFamilyRecipe(req.user.userId, data);
    }
    async getFamilyMembers(req) {
        return this.genealogyService.getFamilyMembers(req.user.userId);
    }
    async createFamilyMember(req, dto) {
        return this.genealogyService.createFamilyMember(req.user.userId, dto);
    }
    async updateFamilyMember(id, req, dto) {
        return this.genealogyService.updateFamilyMember(id, req.user.userId, dto);
    }
    async deleteFamilyMember(id, req) {
        return this.genealogyService.deleteFamilyMember(id, req.user.userId);
    }
    async getAncestralMigrations(req) {
        return this.genealogyService.getAncestralMigrations(req.user.userId);
    }
    async createAncestralMigration(req, dto) {
        return this.genealogyService.createAncestralMigration(req.user.userId, dto);
    }
    async updateAncestralMigration(id, req, dto) {
        return this.genealogyService.updateAncestralMigration(id, req.user.userId, dto);
    }
    async deleteAncestralMigration(id, req) {
        return this.genealogyService.deleteAncestralMigration(id, req.user.userId);
    }
    async getOralHistories(req) {
        return this.genealogyService.getOralHistories(req.user.userId);
    }
    async createOralHistory(req, dto) {
        return this.genealogyService.createOralHistory(req.user.userId, dto);
    }
    async updateOralHistory(id, req, dto) {
        return this.genealogyService.updateOralHistory(id, req.user.userId, dto);
    }
    async deleteOralHistory(id, req) {
        return this.genealogyService.deleteOralHistory(id, req.user.userId);
    }
    async getGenerationalComparisons(req) {
        return this.genealogyService.getGenerationalComparisons(req.user.userId);
    }
    async createGenerationalComparison(req, dto) {
        return this.genealogyService.createGenerationalComparison(req.user.userId, dto);
    }
    async updateGenerationalComparison(id, req, dto) {
        return this.genealogyService.updateGenerationalComparison(id, req.user.userId, dto);
    }
    async deleteGenerationalComparison(id, req) {
        return this.genealogyService.deleteGenerationalComparison(id, req.user.userId);
    }
    async updateGeofencedCapsule(id, req, dto) {
        return this.genealogyService.updateGeofencedCapsule(id, req.user.userId, dto);
    }
    async deleteGeofencedCapsule(id, req) {
        return this.genealogyService.deleteGeofencedCapsule(id, req.user.userId);
    }
    async updateLegacyLetter(id, req, dto) {
        return this.genealogyService.updateLegacyLetter(id, req.user.userId, dto);
    }
    async deleteLegacyLetter(id, req) {
        return this.genealogyService.deleteLegacyLetter(id, req.user.userId);
    }
    async updateDigitalMemorial(id, req, dto) {
        return this.genealogyService.updateDigitalMemorial(id, req.user.userId, dto);
    }
    async deleteDigitalMemorial(id, req) {
        return this.genealogyService.deleteDigitalMemorial(id, req.user.userId);
    }
};
exports.GenealogyController = GenealogyController;
__decorate([
    (0, common_1.Get)('time-capsules'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "getTimeLockedCapsules", null);
__decorate([
    (0, common_1.Post)('time-capsules'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "createTimeLockedCapsule", null);
__decorate([
    (0, common_1.Post)('time-capsules/:id/unlock'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "unlockTimeLockedCapsule", null);
__decorate([
    (0, common_1.Get)('geofenced-capsules'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "getGeofencedCapsules", null);
__decorate([
    (0, common_1.Post)('geofenced-capsules'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "createGeofencedCapsule", null);
__decorate([
    (0, common_1.Post)('geofenced-capsules/check'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "checkGeofencedUnlock", null);
__decorate([
    (0, common_1.Get)('legacy-letters'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "getLegacyLetters", null);
__decorate([
    (0, common_1.Post)('legacy-letters'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "createLegacyLetter", null);
__decorate([
    (0, common_1.Get)('memorials'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "getDigitalMemorials", null);
__decorate([
    (0, common_1.Post)('memorials'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "createDigitalMemorial", null);
__decorate([
    (0, common_1.Post)('memorials/:accessCode/condolence'),
    __param(0, (0, common_1.Param)('accessCode')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "addCondolence", null);
__decorate([
    (0, common_1.Post)('memorials/:accessCode/candle'),
    __param(0, (0, common_1.Param)('accessCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "addCandle", null);
__decorate([
    (0, common_1.Post)('memorials/:accessCode/flower'),
    __param(0, (0, common_1.Param)('accessCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "addFlower", null);
__decorate([
    (0, common_1.Get)('heirlooms'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "getFamilyHeirlooms", null);
__decorate([
    (0, common_1.Post)('heirlooms'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "createFamilyHeirloom", null);
__decorate([
    (0, common_1.Get)('recipes'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "getFamilyRecipes", null);
__decorate([
    (0, common_1.Post)('recipes'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "createFamilyRecipe", null);
__decorate([
    (0, common_1.Get)('family-members'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "getFamilyMembers", null);
__decorate([
    (0, common_1.Post)('family-members'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, genealogy_dto_1.CreateFamilyMemberDto]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "createFamilyMember", null);
__decorate([
    (0, common_1.Put)('family-members/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, genealogy_dto_1.UpdateFamilyMemberDto]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "updateFamilyMember", null);
__decorate([
    (0, common_1.Delete)('family-members/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "deleteFamilyMember", null);
__decorate([
    (0, common_1.Get)('ancestral-migrations'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "getAncestralMigrations", null);
__decorate([
    (0, common_1.Post)('ancestral-migrations'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, genealogy_dto_1.CreateAncestralMigrationDto]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "createAncestralMigration", null);
__decorate([
    (0, common_1.Put)('ancestral-migrations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, genealogy_dto_1.UpdateAncestralMigrationDto]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "updateAncestralMigration", null);
__decorate([
    (0, common_1.Delete)('ancestral-migrations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "deleteAncestralMigration", null);
__decorate([
    (0, common_1.Get)('oral-histories'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "getOralHistories", null);
__decorate([
    (0, common_1.Post)('oral-histories'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, genealogy_dto_1.CreateOralHistoryDto]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "createOralHistory", null);
__decorate([
    (0, common_1.Put)('oral-histories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, genealogy_dto_1.UpdateOralHistoryDto]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "updateOralHistory", null);
__decorate([
    (0, common_1.Delete)('oral-histories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "deleteOralHistory", null);
__decorate([
    (0, common_1.Get)('generational-comparisons'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "getGenerationalComparisons", null);
__decorate([
    (0, common_1.Post)('generational-comparisons'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, genealogy_dto_1.CreateGenerationalComparisonDto]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "createGenerationalComparison", null);
__decorate([
    (0, common_1.Put)('generational-comparisons/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, genealogy_dto_1.UpdateGenerationalComparisonDto]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "updateGenerationalComparison", null);
__decorate([
    (0, common_1.Delete)('generational-comparisons/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "deleteGenerationalComparison", null);
__decorate([
    (0, common_1.Put)('geofenced-capsules/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, genealogy_dto_1.UpdateGeofencedCapsuleDto]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "updateGeofencedCapsule", null);
__decorate([
    (0, common_1.Delete)('geofenced-capsules/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "deleteGeofencedCapsule", null);
__decorate([
    (0, common_1.Put)('legacy-letters/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, genealogy_dto_1.UpdateLegacyLetterDto]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "updateLegacyLetter", null);
__decorate([
    (0, common_1.Delete)('legacy-letters/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "deleteLegacyLetter", null);
__decorate([
    (0, common_1.Put)('memorials/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, genealogy_dto_1.UpdateDigitalMemorialDto]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "updateDigitalMemorial", null);
__decorate([
    (0, common_1.Delete)('memorials/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GenealogyController.prototype, "deleteDigitalMemorial", null);
exports.GenealogyController = GenealogyController = __decorate([
    (0, common_1.Controller)('genealogy'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [genealogy_service_1.GenealogyService])
], GenealogyController);
//# sourceMappingURL=genealogy.controller.js.map