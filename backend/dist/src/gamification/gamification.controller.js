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
exports.GamificationController = void 0;
const common_1 = require("@nestjs/common");
const gamification_service_1 = require("./gamification.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const fog_of_war_dto_1 = require("./dto/fog-of-war.dto");
const geocache_dto_1 = require("./dto/geocache.dto");
const ar_treasure_chest_dto_1 = require("./dto/ar-treasure-chest.dto");
const travel_leaderboard_dto_1 = require("./dto/travel-leaderboard.dto");
let GamificationController = class GamificationController {
    constructor(gamificationService) {
        this.gamificationService = gamificationService;
    }
    async getUserStats(req) {
        return this.gamificationService.getUserStats(req.user.userId);
    }
    async addXP(req, body) {
        return this.gamificationService.addXP(req.user.userId, body.amount);
    }
    async updateMemoryCount(req) {
        return this.gamificationService.updateMemoryCount(req.user.userId);
    }
    async getBadges(req) {
        return this.gamificationService.getBadges(req.user.userId);
    }
    async createBadge(req, body) {
        return this.gamificationService.createBadge(req.user.userId, body.badgeType, body.badgeName, body.target);
    }
    async updateBadgeProgress(id, body) {
        return this.gamificationService.updateBadgeProgress(id, body.increment);
    }
    async getJournalingStreak(req) {
        return this.gamificationService.getJournalingStreak(req.user.userId);
    }
    async recordJournalEntry(req) {
        return this.gamificationService.recordJournalEntry(req.user.userId);
    }
    async getPassportStamps(req) {
        return this.gamificationService.getPassportStamps(req.user.userId);
    }
    async addPassportStamp(req, body) {
        return this.gamificationService.addPassportStamp(req.user.userId, body.country, body.city, body.province);
    }
    async getBingoCompletion(req, year) {
        return this.gamificationService.getBingoCompletion(req.user.userId, parseInt(year));
    }
    async completeBingoItem(req, year, body) {
        return this.gamificationService.completeBingoItem(req.user.userId, parseInt(year), body.index);
    }
    async getVirtualSouvenirs(req) {
        return this.gamificationService.getVirtualSouvenirs(req.user.userId);
    }
    async unlockSouvenir(req, body) {
        return this.gamificationService.unlockSouvenir(req.user.userId, body.name, body.type, body.location);
    }
    async updateSouvenirPosition(id, req, body) {
        return this.gamificationService.updateSouvenirPosition(id, req.user.userId, body.position);
    }
    async getFogOfWarMap(req) {
        return this.gamificationService.getFogOfWarMap(req.user.userId);
    }
    async updateFogOfWarMap(req, dto) {
        return this.gamificationService.updateFogOfWarMap(req.user.userId, dto);
    }
    async exploreArea(req, dto) {
        return this.gamificationService.exploreArea(req.user.userId, dto);
    }
    async getGeocaches(req) {
        return this.gamificationService.getGeocaches(req.user.userId);
    }
    async getPublishedGeocaches() {
        return this.gamificationService.getPublishedGeocaches();
    }
    async createGeocache(req, dto) {
        return this.gamificationService.createGeocache(req.user.userId, dto);
    }
    async updateGeocache(id, req, dto) {
        return this.gamificationService.updateGeocache(id, req.user.userId, dto);
    }
    async deleteGeocache(id, req) {
        return this.gamificationService.deleteGeocache(id, req.user.userId);
    }
    async logGeocache(id, req, dto) {
        return this.gamificationService.logGeocache(id, req.user.userId, dto);
    }
    async getGeocacheLogs(id) {
        return this.gamificationService.getGeocacheLogs(id);
    }
    async getARTreasureChests(req) {
        return this.gamificationService.getARTreasureChests(req.user.userId);
    }
    async createARTreasureChest(req, dto) {
        return this.gamificationService.createARTreasureChest(req.user.userId, dto);
    }
    async updateARTreasureChest(id, req, dto) {
        return this.gamificationService.updateARTreasureChest(id, req.user.userId, dto);
    }
    async unlockARTreasureChest(req, dto) {
        return this.gamificationService.unlockARTreasureChest(req.user.userId, dto);
    }
    async getTravelLeaderboards(circleId) {
        return this.gamificationService.getTravelLeaderboards(circleId);
    }
    async createTravelLeaderboard(dto) {
        return this.gamificationService.createTravelLeaderboard(dto);
    }
    async updateTravelLeaderboard(id, dto) {
        return this.gamificationService.updateTravelLeaderboard(id, dto);
    }
    async getLeaderboardEntries(id) {
        return this.gamificationService.getLeaderboardEntries(id);
    }
    async createLeaderboardEntry(req, dto) {
        return this.gamificationService.createLeaderboardEntry(req.user.userId, dto);
    }
    async updateLeaderboardEntry(id, req, dto) {
        return this.gamificationService.updateLeaderboardEntry(id, req.user.userId, dto);
    }
};
exports.GamificationController = GamificationController;
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Post)('stats/xp'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "addXP", null);
__decorate([
    (0, common_1.Post)('stats/memories'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "updateMemoryCount", null);
__decorate([
    (0, common_1.Get)('badges'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getBadges", null);
__decorate([
    (0, common_1.Post)('badges'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "createBadge", null);
__decorate([
    (0, common_1.Put)('badges/:id/progress'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "updateBadgeProgress", null);
__decorate([
    (0, common_1.Get)('streak'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getJournalingStreak", null);
__decorate([
    (0, common_1.Post)('streak/record'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "recordJournalEntry", null);
__decorate([
    (0, common_1.Get)('passport'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getPassportStamps", null);
__decorate([
    (0, common_1.Post)('passport/stamp'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "addPassportStamp", null);
__decorate([
    (0, common_1.Get)('bingo/:year'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getBingoCompletion", null);
__decorate([
    (0, common_1.Post)('bingo/:year/complete'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('year')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "completeBingoItem", null);
__decorate([
    (0, common_1.Get)('souvenirs'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getVirtualSouvenirs", null);
__decorate([
    (0, common_1.Post)('souvenirs/unlock'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "unlockSouvenir", null);
__decorate([
    (0, common_1.Put)('souvenirs/:id/position'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "updateSouvenirPosition", null);
__decorate([
    (0, common_1.Get)('fog-of-war'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getFogOfWarMap", null);
__decorate([
    (0, common_1.Put)('fog-of-war'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, fog_of_war_dto_1.UpdateFogOfWarDto]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "updateFogOfWarMap", null);
__decorate([
    (0, common_1.Post)('fog-of-war/explore'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, fog_of_war_dto_1.ExploreAreaDto]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "exploreArea", null);
__decorate([
    (0, common_1.Get)('geocaches'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getGeocaches", null);
__decorate([
    (0, common_1.Get)('geocaches/published'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getPublishedGeocaches", null);
__decorate([
    (0, common_1.Post)('geocaches'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, geocache_dto_1.CreateGeocacheDto]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "createGeocache", null);
__decorate([
    (0, common_1.Put)('geocaches/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, geocache_dto_1.UpdateGeocacheDto]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "updateGeocache", null);
__decorate([
    (0, common_1.Delete)('geocaches/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "deleteGeocache", null);
__decorate([
    (0, common_1.Post)('geocaches/:id/logs'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, geocache_dto_1.CreateGeocacheLogDto]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "logGeocache", null);
__decorate([
    (0, common_1.Get)('geocaches/:id/logs'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getGeocacheLogs", null);
__decorate([
    (0, common_1.Get)('ar-chests'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getARTreasureChests", null);
__decorate([
    (0, common_1.Post)('ar-chests'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ar_treasure_chest_dto_1.CreateARTreasureChestDto]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "createARTreasureChest", null);
__decorate([
    (0, common_1.Put)('ar-chests/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, ar_treasure_chest_dto_1.UpdateARTreasureChestDto]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "updateARTreasureChest", null);
__decorate([
    (0, common_1.Post)('ar-chests/unlock'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ar_treasure_chest_dto_1.UnlockARTreasureChestDto]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "unlockARTreasureChest", null);
__decorate([
    (0, common_1.Get)('leaderboards/:circleId'),
    __param(0, (0, common_1.Param)('circleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getTravelLeaderboards", null);
__decorate([
    (0, common_1.Post)('leaderboards'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [travel_leaderboard_dto_1.CreateTravelLeaderboardDto]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "createTravelLeaderboard", null);
__decorate([
    (0, common_1.Put)('leaderboards/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, travel_leaderboard_dto_1.UpdateTravelLeaderboardDto]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "updateTravelLeaderboard", null);
__decorate([
    (0, common_1.Get)('leaderboards/:id/entries'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getLeaderboardEntries", null);
__decorate([
    (0, common_1.Post)('leaderboards/entries'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, travel_leaderboard_dto_1.CreateLeaderboardEntryDto]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "createLeaderboardEntry", null);
__decorate([
    (0, common_1.Put)('leaderboards/entries/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, travel_leaderboard_dto_1.UpdateLeaderboardEntryDto]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "updateLeaderboardEntry", null);
exports.GamificationController = GamificationController = __decorate([
    (0, common_1.Controller)('gamification'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [gamification_service_1.GamificationService])
], GamificationController);
//# sourceMappingURL=gamification.controller.js.map