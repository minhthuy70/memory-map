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
const reminiscence_therapy_dto_1 = require("./dto/reminiscence-therapy.dto");
const inner_child_dialogue_dto_1 = require("./dto/inner-child-dialogue.dto");
const binaural_sound_therapy_dto_1 = require("./dto/binaural-sound-therapy.dto");
const zen_reflection_dto_1 = require("./dto/zen-reflection.dto");
const emotional_waveform_dto_1 = require("./dto/emotional-waveform.dto");
const dream_journal_dto_1 = require("./dto/dream-journal.dto");
let PsychologyController = class PsychologyController {
    constructor(psychologyService) {
        this.psychologyService = psychologyService;
    }
    async getEmotionalGeographyPoints(req) {
        return this.psychologyService.getEmotionalGeographyPoints(req.user.userId);
    }
    async createEmotionalGeographyPoint(req, body) {
        return this.psychologyService.createEmotionalGeographyPoint(req.user.userId, body.memoryId, body.latitude, body.longitude, body.emotionType, body.intensity);
    }
    async getReminiscenceSessions(req) {
        return this.psychologyService.getReminiscenceSessions(req.user.userId);
    }
    async createReminiscenceSession(req, dto) {
        return this.psychologyService.createReminiscenceSession(req.user.userId, dto);
    }
    async updateReminiscenceSession(id, req, dto) {
        return this.psychologyService.updateReminiscenceSession(id, req.user.userId, dto);
    }
    async getInnerChildDialogues(req) {
        return this.psychologyService.getInnerChildDialogues(req.user.userId);
    }
    async createInnerChildDialogue(req, dto) {
        return this.psychologyService.createInnerChildDialogue(req.user.userId, dto);
    }
    async getBinauralTherapies(req) {
        return this.psychologyService.getBinauralTherapies(req.user.userId);
    }
    async createBinauralTherapy(req, dto) {
        return this.psychologyService.createBinauralTherapy(req.user.userId, dto);
    }
    async updateBinauralTherapy(id, req, dto) {
        return this.psychologyService.updateBinauralTherapy(id, req.user.userId, dto);
    }
    async getZenReflectionMode(req) {
        return this.psychologyService.getZenReflectionMode(req.user.userId);
    }
    async updateZenReflectionMode(req, dto) {
        return this.psychologyService.updateZenReflectionMode(req.user.userId, dto);
    }
    async getEmotionalWaveforms(req) {
        return this.psychologyService.getEmotionalWaveforms(req.user.userId);
    }
    async createEmotionalWaveform(req, dto) {
        return this.psychologyService.createEmotionalWaveform(req.user.userId, dto);
    }
    async updateEmotionalWaveform(id, req, dto) {
        return this.psychologyService.updateEmotionalWaveform(id, req.user.userId, dto);
    }
    async deleteEmotionalWaveform(id, req) {
        return this.psychologyService.deleteEmotionalWaveform(id, req.user.userId);
    }
    async getDreamJournals(req) {
        return this.psychologyService.getDreamJournals(req.user.userId);
    }
    async createDreamJournal(req, dto) {
        return this.psychologyService.createDreamJournal(req.user.userId, dto);
    }
    async updateDreamJournal(id, req, dto) {
        return this.psychologyService.updateDreamJournal(id, req.user.userId, dto);
    }
    async deleteDreamJournal(id, req) {
        return this.psychologyService.deleteDreamJournal(id, req.user.userId);
    }
};
exports.PsychologyController = PsychologyController;
__decorate([
    (0, common_1.Get)('emotional-geography'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "getEmotionalGeographyPoints", null);
__decorate([
    (0, common_1.Post)('emotional-geography'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "createEmotionalGeographyPoint", null);
__decorate([
    (0, common_1.Get)('reminiscence'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "getReminiscenceSessions", null);
__decorate([
    (0, common_1.Post)('reminiscence'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, reminiscence_therapy_dto_1.CreateReminiscenceTherapyDto]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "createReminiscenceSession", null);
__decorate([
    (0, common_1.Put)('reminiscence/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, reminiscence_therapy_dto_1.UpdateReminiscenceTherapyDto]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "updateReminiscenceSession", null);
__decorate([
    (0, common_1.Get)('inner-child'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "getInnerChildDialogues", null);
__decorate([
    (0, common_1.Post)('inner-child'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, inner_child_dialogue_dto_1.CreateInnerChildDialogueDto]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "createInnerChildDialogue", null);
__decorate([
    (0, common_1.Get)('binaural'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "getBinauralTherapies", null);
__decorate([
    (0, common_1.Post)('binaural'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, binaural_sound_therapy_dto_1.CreateBinauralSoundTherapyDto]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "createBinauralTherapy", null);
__decorate([
    (0, common_1.Put)('binaural/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, binaural_sound_therapy_dto_1.UpdateBinauralSoundTherapyDto]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "updateBinauralTherapy", null);
__decorate([
    (0, common_1.Get)('zen-mode'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "getZenReflectionMode", null);
__decorate([
    (0, common_1.Put)('zen-mode'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, zen_reflection_dto_1.UpdateZenReflectionDto]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "updateZenReflectionMode", null);
__decorate([
    (0, common_1.Get)('emotional-waveform'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "getEmotionalWaveforms", null);
__decorate([
    (0, common_1.Post)('emotional-waveform'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, emotional_waveform_dto_1.CreateEmotionalWaveformDto]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "createEmotionalWaveform", null);
__decorate([
    (0, common_1.Put)('emotional-waveform/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, emotional_waveform_dto_1.UpdateEmotionalWaveformDto]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "updateEmotionalWaveform", null);
__decorate([
    (0, common_1.Delete)('emotional-waveform/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "deleteEmotionalWaveform", null);
__decorate([
    (0, common_1.Get)('dream-journal'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "getDreamJournals", null);
__decorate([
    (0, common_1.Post)('dream-journal'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dream_journal_dto_1.CreateDreamJournalDto]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "createDreamJournal", null);
__decorate([
    (0, common_1.Put)('dream-journal/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dream_journal_dto_1.UpdateDreamJournalDto]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "updateDreamJournal", null);
__decorate([
    (0, common_1.Delete)('dream-journal/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PsychologyController.prototype, "deleteDreamJournal", null);
exports.PsychologyController = PsychologyController = __decorate([
    (0, common_1.Controller)('psychology'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [psychology_service_1.PsychologyService])
], PsychologyController);
//# sourceMappingURL=psychology.controller.js.map