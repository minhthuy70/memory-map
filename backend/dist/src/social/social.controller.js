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
exports.SocialController = void 0;
const common_1 = require("@nestjs/common");
const social_service_1 = require("./social.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let SocialController = class SocialController {
    constructor(socialService) {
        this.socialService = socialService;
    }
    async getReactions(memoryId) {
        return this.socialService.getReactions(memoryId);
    }
    async addReaction(req, data) {
        return this.socialService.addReaction(req.user.userId, data.memoryId, data.reactionType);
    }
    async getComments(memoryId) {
        return this.socialService.getComments(memoryId);
    }
    async createComment(req, data) {
        return this.socialService.createComment(req.user.userId, data.memoryId, data.content, data.parentId);
    }
    async deleteComment(req, id) {
        return this.socialService.deleteComment(req.user.userId, id);
    }
    async getCircles(req) {
        return this.socialService.getCircles(req.user.userId);
    }
    async createCircle(req, data) {
        return this.socialService.createCircle(req.user.userId, data);
    }
    async addCircleMember(req, circleId, data) {
        return this.socialService.addCircleMember(circleId, req.user.userId, data.userId);
    }
    async getSharedAlbums(req) {
        return this.socialService.getSharedAlbums(req.user.userId);
    }
    async createSharedAlbum(req, data) {
        return this.socialService.createSharedAlbum(req.user.userId, data);
    }
    async addAlbumContributor(req, albumId, data) {
        return this.socialService.addAlbumContributor(albumId, req.user.userId, data.userId, data.permission);
    }
};
exports.SocialController = SocialController;
__decorate([
    (0, common_1.Get)('reactions/:memoryId'),
    __param(0, (0, common_1.Param)('memoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getReactions", null);
__decorate([
    (0, common_1.Post)('reactions'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "addReaction", null);
__decorate([
    (0, common_1.Get)('comments/:memoryId'),
    __param(0, (0, common_1.Param)('memoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)('comments'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "createComment", null);
__decorate([
    (0, common_1.Delete)('comments/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.Get)('circles'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getCircles", null);
__decorate([
    (0, common_1.Post)('circles'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "createCircle", null);
__decorate([
    (0, common_1.Post)('circles/:circleId/members'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('circleId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "addCircleMember", null);
__decorate([
    (0, common_1.Get)('albums'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getSharedAlbums", null);
__decorate([
    (0, common_1.Post)('albums'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "createSharedAlbum", null);
__decorate([
    (0, common_1.Post)('albums/:albumId/contributors'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('albumId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "addAlbumContributor", null);
exports.SocialController = SocialController = __decorate([
    (0, common_1.Controller)('social'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [social_service_1.SocialService])
], SocialController);
//# sourceMappingURL=social.controller.js.map