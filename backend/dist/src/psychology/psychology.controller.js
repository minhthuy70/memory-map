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
exports.PsychologyController = void 0;
const common_1 = require("@nestjs/common");
const psychology_service_1 = require("./psychology.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PsychologyController = class PsychologyController {
    constructor(psychologyService) {
        this.psychologyService = psychologyService;
    }
    async getGratitudeEntries(req) {
        return this.psychologyService.getGratitudeEntries(req.user.userId);
    }
    async createGratitudeEntry(req, data) {
        return this.psychologyService.createGratitudeEntry(req.user.userId, data);
    }
    async getResilienceMoments(req) {
        return this.psychologyService.getResilienceMoments(req.user.userId);
    }
    async createResilienceMoment(req, data) {
        return this.psychologyService.createResilienceMoment(req.user.userId, data);
    }
    async getDailySerendipity(req) {
        return this.psychologyService.getDailySerendipity(req.user.userId);
    }
    async markViewed(req, data) {
        return this.psychologyService.markViewed(req.user.userId, data.moodBefore, data.moodAfter);
    }
    async getEmotionalWaveforms(req, startDate, endDate) {
        return this.psychologyService.getEmotionalWaveforms(req.user.userId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
    }
    async createEmotionalWaveform(req, data) {
        return this.psychologyService.createEmotionalWaveform(req.user.userId, data);
    }
    async getDreamJournals(req) {
        return this.psychologyService.getDreamJournals(req.user.userId);
    }
    async createDreamJournal(req, data) {
        return this.psychologyService.createDreamJournal(req.user.userId, data);
    }
};
exports.PsychologyController = PsychologyController;
__decorate([
    (0, common_1.Get)('gratitude'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "getGratitudeEntries", null);
__decorate([
    (0, common_1.Post)('gratitude'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "createGratitudeEntry", null);
__decorate([
    (0, common_1.Get)('resilience'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "getResilienceMoments", null);
__decorate([
    (0, common_1.Post)('resilience'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "createResilienceMoment", null);
__decorate([
    (0, common_1.Get)('serendipity'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "getDailySerendipity", null);
__decorate([
    (0, common_1.Post)('serendipity/viewed'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "markViewed", null);
__decorate([
    (0, common_1.Get)('waveform'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "getEmotionalWaveforms", null);
__decorate([
    (0, common_1.Post)('waveform'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "createEmotionalWaveform", null);
__decorate([
    (0, common_1.Get)('dreams'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "getDreamJournals", null);
__decorate([
    (0, common_1.Post)('dreams'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "createDreamJournal", null);
exports.PsychologyController = PsychologyController = __decorate([
    (0, common_1.Controller)('psychology'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [psychology_service_1.PsychologyService])
], PsychologyController);
//# sourceMappingURL=psychology.controller.js.map