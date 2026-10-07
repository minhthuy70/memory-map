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
exports.AudiovisualController = void 0;
const common_1 = require("@nestjs/common");
const audiovisual_service_1 = require("./audiovisual.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let AudiovisualController = class AudiovisualController {
    constructor(audiovisualService) {
        this.audiovisualService = audiovisualService;
    }
    async getScrapbookProjects(req) {
        return this.audiovisualService.getScrapbookProjects(req.user.userId);
    }
    async getScrapbookProject(req, id) {
        return this.audiovisualService.getScrapbookProject(req.user.userId, id);
    }
    async createScrapbookProject(req, data) {
        return this.audiovisualService.createScrapbookProject(req.user.userId, data);
    }
    async updateScrapbookProject(req, id, data) {
        return this.audiovisualService.updateScrapbookProject(req.user.userId, id, data);
    }
    async deleteScrapbookProject(req, id) {
        return this.audiovisualService.deleteScrapbookProject(req.user.userId, id);
    }
    async getSoundscapeMixes(req) {
        return this.audiovisualService.getSoundscapeMixes(req.user.userId);
    }
    async getSoundscapeMix(req, id) {
        return this.audiovisualService.getSoundscapeMix(req.user.userId, id);
    }
    async createSoundscapeMix(req, data) {
        return this.audiovisualService.createSoundscapeMix(req.user.userId, data);
    }
    async updateSoundscapeMix(req, id, data) {
        return this.audiovisualService.updateSoundscapeMix(req.user.userId, id, data);
    }
    async deleteSoundscapeMix(req, id) {
        return this.audiovisualService.deleteSoundscapeMix(req.user.userId, id);
    }
};
exports.AudiovisualController = AudiovisualController;
__decorate([
    (0, common_1.Get)('scrapbooks'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "getScrapbookProjects", null);
__decorate([
    (0, common_1.Get)('scrapbooks/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "getScrapbookProject", null);
__decorate([
    (0, common_1.Post)('scrapbooks'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "createScrapbookProject", null);
__decorate([
    (0, common_1.Put)('scrapbooks/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "updateScrapbookProject", null);
__decorate([
    (0, common_1.Delete)('scrapbooks/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "deleteScrapbookProject", null);
__decorate([
    (0, common_1.Get)('soundscapes'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "getSoundscapeMixes", null);
__decorate([
    (0, common_1.Get)('soundscapes/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "getSoundscapeMix", null);
__decorate([
    (0, common_1.Post)('soundscapes'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "createSoundscapeMix", null);
__decorate([
    (0, common_1.Put)('soundscapes/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "updateSoundscapeMix", null);
__decorate([
    (0, common_1.Delete)('soundscapes/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "deleteSoundscapeMix", null);
exports.AudiovisualController = AudiovisualController = __decorate([
    (0, common_1.Controller)('audiovisual'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [audiovisual_service_1.AudiovisualService])
], AudiovisualController);
//# sourceMappingURL=audiovisual.controller.js.map