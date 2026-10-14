"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const dto = __importStar(require("./dto/social.dto"));
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
    async getStories(req) { return this.socialService.getStories(req.user.userId); }
    async createStory(req, dto) { return this.socialService.createStory(req.user.userId, dto); }
    async updateStory(req, id, dto) { return this.socialService.updateStory(id, req.user.userId, dto); }
    async deleteStory(req, id) { return this.socialService.deleteStory(id, req.user.userId); }
    async getCommunityFeeds(req) { return this.socialService.getCommunityFeeds(req.user.userId); }
    async createCommunityFeed(req, dto) { return this.socialService.createCommunityFeed(req.user.userId, dto); }
    async updateCommunityFeed(req, id, dto) { return this.socialService.updateCommunityFeed(id, req.user.userId, dto); }
    async deleteCommunityFeed(req, id) { return this.socialService.deleteCommunityFeed(id, req.user.userId); }
    async getNearbyPings(req) { return this.socialService.getNearbyPings(req.user.userId); }
    async createNearbyPing(req, dto) { return this.socialService.createNearbyPing(req.user.userId, dto); }
    async updateNearbyPing(req, id, dto) { return this.socialService.updateNearbyPing(id, req.user.userId, dto); }
    async deleteNearbyPing(req, id) { return this.socialService.deleteNearbyPing(id, req.user.userId); }
    async getCoPresenceSuggestions(req) { return this.socialService.getCoPresenceSuggestions(req.user.userId); }
    async createCoPresenceSuggestion(req, dto) { return this.socialService.createCoPresenceSuggestion(req.user.userId, dto); }
    async deleteCoPresenceSuggestion(req, id) { return this.socialService.deleteCoPresenceSuggestion(id, req.user.userId); }
    async getExplorationChallenges(req) { return this.socialService.getExplorationChallenges(req.user.userId); }
    async createExplorationChallenge(req, dto) { return this.socialService.createExplorationChallenge(req.user.userId, dto); }
    async updateExplorationChallenge(req, id, dto) { return this.socialService.updateExplorationChallenge(id, req.user.userId, dto); }
    async deleteExplorationChallenge(req, id) { return this.socialService.deleteExplorationChallenge(id, req.user.userId); }
    async getMemoryContests(req) { return this.socialService.getMemoryContests(req.user.userId); }
    async createMemoryContest(req, dto) { return this.socialService.createMemoryContest(req.user.userId, dto); }
    async updateMemoryContest(req, id, dto) { return this.socialService.updateMemoryContest(id, req.user.userId, dto); }
    async deleteMemoryContest(req, id) { return this.socialService.deleteMemoryContest(id, req.user.userId); }
    async getDigitalPostcards(req) { return this.socialService.getDigitalPostcards(req.user.userId); }
    async createDigitalPostcard(req, dto) { return this.socialService.createDigitalPostcard(req.user.userId, dto); }
    async markPostcardOpened(id) { return this.socialService.markPostcardOpened(id); }
    async deleteDigitalPostcard(req, id) { return this.socialService.deleteDigitalPostcard(id, req.user.userId); }
    async getMemoryPenpals(req) { return this.socialService.getMemoryPenpals(req.user.userId); }
    async createMemoryPenpal(req, dto) { return this.socialService.createMemoryPenpal(req.user.userId, dto); }
    async updateMemoryPenpal(req, id, dto) { return this.socialService.updateMemoryPenpal(id, req.user.userId, dto); }
    async deleteMemoryPenpal(req, id) { return this.socialService.deleteMemoryPenpal(id, req.user.userId); }
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
__decorate([
    (0, common_1.Get)('stories'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getStories", null);
__decorate([
    (0, common_1.Post)('stories'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.CreateMemoryStoryDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "createStory", null);
__decorate([
    (0, common_1.Put)('stories/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto.UpdateMemoryStoryDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "updateStory", null);
__decorate([
    (0, common_1.Delete)('stories/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "deleteStory", null);
__decorate([
    (0, common_1.Get)('community-feeds'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getCommunityFeeds", null);
__decorate([
    (0, common_1.Post)('community-feeds'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.CreateCommunityMapFeedDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "createCommunityFeed", null);
__decorate([
    (0, common_1.Put)('community-feeds/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto.UpdateCommunityMapFeedDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "updateCommunityFeed", null);
__decorate([
    (0, common_1.Delete)('community-feeds/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "deleteCommunityFeed", null);
__decorate([
    (0, common_1.Get)('nearby-pings'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getNearbyPings", null);
__decorate([
    (0, common_1.Post)('nearby-pings'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.CreateNearbyFriendsPingDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "createNearbyPing", null);
__decorate([
    (0, common_1.Put)('nearby-pings/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto.UpdateNearbyFriendsPingDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "updateNearbyPing", null);
__decorate([
    (0, common_1.Delete)('nearby-pings/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "deleteNearbyPing", null);
__decorate([
    (0, common_1.Get)('co-presence-suggestions'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getCoPresenceSuggestions", null);
__decorate([
    (0, common_1.Post)('co-presence-suggestions'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.CreateCoPresenceSuggestionDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "createCoPresenceSuggestion", null);
__decorate([
    (0, common_1.Delete)('co-presence-suggestions/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "deleteCoPresenceSuggestion", null);
__decorate([
    (0, common_1.Get)('exploration-challenges'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getExplorationChallenges", null);
__decorate([
    (0, common_1.Post)('exploration-challenges'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.CreateExplorationChallengeDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "createExplorationChallenge", null);
__decorate([
    (0, common_1.Put)('exploration-challenges/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto.UpdateExplorationChallengeDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "updateExplorationChallenge", null);
__decorate([
    (0, common_1.Delete)('exploration-challenges/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "deleteExplorationChallenge", null);
__decorate([
    (0, common_1.Get)('memory-contests'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getMemoryContests", null);
__decorate([
    (0, common_1.Post)('memory-contests'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.CreateMemoryContestDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "createMemoryContest", null);
__decorate([
    (0, common_1.Put)('memory-contests/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto.UpdateMemoryContestDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "updateMemoryContest", null);
__decorate([
    (0, common_1.Delete)('memory-contests/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "deleteMemoryContest", null);
__decorate([
    (0, common_1.Get)('digital-postcards'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getDigitalPostcards", null);
__decorate([
    (0, common_1.Post)('digital-postcards'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.CreateDigitalPostcardDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "createDigitalPostcard", null);
__decorate([
    (0, common_1.Post)('digital-postcards/:id/open'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "markPostcardOpened", null);
__decorate([
    (0, common_1.Delete)('digital-postcards/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "deleteDigitalPostcard", null);
__decorate([
    (0, common_1.Get)('memory-penpals'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getMemoryPenpals", null);
__decorate([
    (0, common_1.Post)('memory-penpals'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.CreateMemoryPenpalDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "createMemoryPenpal", null);
__decorate([
    (0, common_1.Put)('memory-penpals/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto.UpdateMemoryPenpalDto]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "updateMemoryPenpal", null);
__decorate([
    (0, common_1.Delete)('memory-penpals/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "deleteMemoryPenpal", null);
exports.SocialController = SocialController = __decorate([
    (0, common_1.Controller)('social'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [social_service_1.SocialService])
], SocialController);
//# sourceMappingURL=social.controller.js.map