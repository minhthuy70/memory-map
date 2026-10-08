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
exports.AICompanionController = void 0;
const common_1 = require("@nestjs/common");
const ai_companion_service_1 = require("./ai-companion.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const ai_journal_dto_1 = require("./dto/ai-journal.dto");
const ai_interview_dto_1 = require("./dto/ai-interview.dto");
const photo_curation_dto_1 = require("./dto/photo-curation.dto");
const semantic_search_dto_1 = require("./dto/semantic-search.dto");
const voice_clone_dto_1 = require("./dto/voice-clone.dto");
const travel_narration_dto_1 = require("./dto/travel-narration.dto");
const historical_simulation_dto_1 = require("./dto/historical-simulation.dto");
const age_progression_dto_1 = require("./dto/age-progression.dto");
const memory_synthesis_dto_1 = require("./dto/memory-synthesis.dto");
const predictive_resurfacing_dto_1 = require("./dto/predictive-resurfacing.dto");
let AICompanionController = class AICompanionController {
    constructor(aiCompanionService) {
        this.aiCompanionService = aiCompanionService;
    }
    async createAIJournalEntry(req, dto) {
        return this.aiCompanionService.createAIJournalEntry(req.user.userId, dto);
    }
    async getAIJournalEntries(req, startDate, endDate) {
        return this.aiCompanionService.getAIJournalEntries(req.user.userId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
    }
    async getAIJournalEntry(id, req) {
        return this.aiCompanionService.getAIJournalEntry(id, req.user.userId);
    }
    async updateAIJournalEntry(id, req, dto) {
        return this.aiCompanionService.updateAIJournalEntry(id, req.user.userId, dto);
    }
    async deleteAIJournalEntry(id, req) {
        return this.aiCompanionService.deleteAIJournalEntry(id, req.user.userId);
    }
    async generateJournalEntry(req, dto) {
        return this.aiCompanionService.generateJournalEntry(req.user.userId, dto);
    }
    async createAIInterview(req, dto) {
        return this.aiCompanionService.createAIInterview(req.user.userId, dto);
    }
    async getAIInterviews(req, completedOnly) {
        return this.aiCompanionService.getAIInterviews(req.user.userId, completedOnly === 'true');
    }
    async getAIInterview(id, req) {
        return this.aiCompanionService.getAIInterview(id, req.user.userId);
    }
    async updateAIInterview(id, req, dto) {
        return this.aiCompanionService.updateAIInterview(id, req.user.userId, dto);
    }
    async deleteAIInterview(id, req) {
        return this.aiCompanionService.deleteAIInterview(id, req.user.userId);
    }
    async generateQuestion(req, dto) {
        return this.aiCompanionService.generateQuestion(req.user.userId, dto);
    }
    async createPhotoCuration(req, dto) {
        return this.aiCompanionService.createPhotoCuration(req.user.userId, dto);
    }
    async getPhotoCurations(req, memoryId) {
        return this.aiCompanionService.getPhotoCurations(req.user.userId, memoryId);
    }
    async getPhotoCuration(id, req) {
        return this.aiCompanionService.getPhotoCuration(id, req.user.userId);
    }
    async updatePhotoCuration(id, req, dto) {
        return this.aiCompanionService.updatePhotoCuration(id, req.user.userId, dto);
    }
    async deletePhotoCuration(id, req) {
        return this.aiCompanionService.deletePhotoCuration(id, req.user.userId);
    }
    async batchCuration(req, dto) {
        return this.aiCompanionService.batchCuration(req.user.userId, dto);
    }
    async indexEntity(req, dto) {
        return this.aiCompanionService.indexEntity(req.user.userId, dto);
    }
    async semanticSearch(req, dto) {
        return this.aiCompanionService.semanticSearch(req.user.userId, dto);
    }
    async getSearchIndices(req, entityType) {
        return this.aiCompanionService.getSearchIndices(req.user.userId, entityType);
    }
    async deleteSearchIndex(id, req) {
        return this.aiCompanionService.deleteSearchIndex(id, req.user.userId);
    }
    async createVoiceCloneModel(req, dto) {
        return this.aiCompanionService.createVoiceCloneModel(req.user.userId, dto);
    }
    async getVoiceCloneModels(req) {
        return this.aiCompanionService.getVoiceCloneModels(req.user.userId);
    }
    async getVoiceCloneModel(id, req) {
        return this.aiCompanionService.getVoiceCloneModel(id, req.user.userId);
    }
    async deleteVoiceCloneModel(id, req) {
        return this.aiCompanionService.deleteVoiceCloneModel(id, req.user.userId);
    }
    async generateVoiceNarration(req, dto) {
        return this.aiCompanionService.generateVoiceNarration(req.user.userId, dto);
    }
    async createTravelNarration(req, dto) {
        return this.aiCompanionService.createTravelNarration(req.user.userId, dto);
    }
    async getTravelNarrations(req) {
        return this.aiCompanionService.getTravelNarrations(req.user.userId);
    }
    async getTravelNarration(id, req) {
        return this.aiCompanionService.getTravelNarration(id, req.user.userId);
    }
    async updateTravelNarration(id, req, dto) {
        return this.aiCompanionService.updateTravelNarration(id, req.user.userId, dto);
    }
    async deleteTravelNarration(id, req) {
        return this.aiCompanionService.deleteTravelNarration(id, req.user.userId);
    }
    async generateTravelNarration(id, req) {
        return this.aiCompanionService.generateTravelNarration(id, req.user.userId);
    }
    async createHistoricalSimulation(req, dto) {
        return this.aiCompanionService.createHistoricalSimulation(req.user.userId, dto);
    }
    async getHistoricalSimulations(req) {
        return this.aiCompanionService.getHistoricalSimulations(req.user.userId);
    }
    async getHistoricalSimulation(id, req) {
        return this.aiCompanionService.getHistoricalSimulation(id, req.user.userId);
    }
    async updateHistoricalSimulation(id, req, dto) {
        return this.aiCompanionService.updateHistoricalSimulation(id, req.user.userId, dto);
    }
    async deleteHistoricalSimulation(id, req) {
        return this.aiCompanionService.deleteHistoricalSimulation(id, req.user.userId);
    }
    async generateHistoricalSimulation(id, req) {
        return this.aiCompanionService.generateHistoricalSimulation(id, req.user.userId);
    }
    async createAgeProgression(req, dto) {
        return this.aiCompanionService.createAgeProgression(req.user.userId, dto);
    }
    async getAgeProgressions(req) {
        return this.aiCompanionService.getAgeProgressions(req.user.userId);
    }
    async getAgeProgression(id, req) {
        return this.aiCompanionService.getAgeProgression(id, req.user.userId);
    }
    async updateAgeProgression(id, req, dto) {
        return this.aiCompanionService.updateAgeProgression(id, req.user.userId, dto);
    }
    async deleteAgeProgression(id, req) {
        return this.aiCompanionService.deleteAgeProgression(id, req.user.userId);
    }
    async generateAgeProgression(id, req) {
        return this.aiCompanionService.generateAgeProgression(id, req.user.userId);
    }
    async createMemorySynthesis(req, dto) {
        return this.aiCompanionService.createMemorySynthesis(req.user.userId, dto);
    }
    async getMemorySyntheses(req) {
        return this.aiCompanionService.getMemorySyntheses(req.user.userId);
    }
    async getMemorySynthesis(id, req) {
        return this.aiCompanionService.getMemorySynthesis(id, req.user.userId);
    }
    async updateMemorySynthesis(id, req, dto) {
        return this.aiCompanionService.updateMemorySynthesis(id, req.user.userId, dto);
    }
    async deleteMemorySynthesis(id, req) {
        return this.aiCompanionService.deleteMemorySynthesis(id, req.user.userId);
    }
    async generateMemorySynthesis(id, req) {
        return this.aiCompanionService.generateMemorySynthesis(id, req.user.userId);
    }
    async createPredictiveResurfacing(req, dto) {
        return this.aiCompanionService.createPredictiveResurfacing(req.user.userId, dto);
    }
    async getPredictiveResurfacings(req) {
        return this.aiCompanionService.getPredictiveResurfacings(req.user.userId);
    }
    async getScheduledResurfacings(req) {
        return this.aiCompanionService.getScheduledResurfacings(req.user.userId);
    }
    async getPredictiveResurfacing(id, req) {
        return this.aiCompanionService.getPredictiveResurfacing(id, req.user.userId);
    }
    async updatePredictiveResurfacing(id, req, dto) {
        return this.aiCompanionService.updatePredictiveResurfacing(id, req.user.userId, dto);
    }
    async deletePredictiveResurfacing(id, req) {
        return this.aiCompanionService.deletePredictiveResurfacing(id, req.user.userId);
    }
};
exports.AICompanionController = AICompanionController;
__decorate([
    (0, common_1.Post)('journal'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ai_journal_dto_1.CreateAIJournalEntryDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "createAIJournalEntry", null);
__decorate([
    (0, common_1.Get)('journal'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "getAIJournalEntries", null);
__decorate([
    (0, common_1.Get)('journal/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "getAIJournalEntry", null);
__decorate([
    (0, common_1.Put)('journal/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, ai_journal_dto_1.UpdateAIJournalEntryDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "updateAIJournalEntry", null);
__decorate([
    (0, common_1.Delete)('journal/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "deleteAIJournalEntry", null);
__decorate([
    (0, common_1.Post)('journal/generate'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ai_journal_dto_1.GenerateJournalEntryDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "generateJournalEntry", null);
__decorate([
    (0, common_1.Post)('interviews'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ai_interview_dto_1.CreateAIInterviewDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "createAIInterview", null);
__decorate([
    (0, common_1.Get)('interviews'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('completedOnly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "getAIInterviews", null);
__decorate([
    (0, common_1.Get)('interviews/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "getAIInterview", null);
__decorate([
    (0, common_1.Put)('interviews/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, ai_interview_dto_1.UpdateAIInterviewDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "updateAIInterview", null);
__decorate([
    (0, common_1.Delete)('interviews/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "deleteAIInterview", null);
__decorate([
    (0, common_1.Post)('interviews/generate-question'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ai_interview_dto_1.GenerateQuestionDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "generateQuestion", null);
__decorate([
    (0, common_1.Post)('photo-curation'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, photo_curation_dto_1.CreatePhotoCurationDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "createPhotoCuration", null);
__decorate([
    (0, common_1.Get)('photo-curation'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('memoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "getPhotoCurations", null);
__decorate([
    (0, common_1.Get)('photo-curation/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "getPhotoCuration", null);
__decorate([
    (0, common_1.Put)('photo-curation/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, photo_curation_dto_1.UpdatePhotoCurationDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "updatePhotoCuration", null);
__decorate([
    (0, common_1.Delete)('photo-curation/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "deletePhotoCuration", null);
__decorate([
    (0, common_1.Post)('photo-curation/batch'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, photo_curation_dto_1.BatchCurationDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "batchCuration", null);
__decorate([
    (0, common_1.Post)('semantic-search/index'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, semantic_search_dto_1.IndexEntityDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "indexEntity", null);
__decorate([
    (0, common_1.Post)('semantic-search'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, semantic_search_dto_1.SemanticSearchDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "semanticSearch", null);
__decorate([
    (0, common_1.Get)('semantic-search/indices'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('entityType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "getSearchIndices", null);
__decorate([
    (0, common_1.Delete)('semantic-search/indices/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "deleteSearchIndex", null);
__decorate([
    (0, common_1.Post)('voice-clone'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, voice_clone_dto_1.CreateVoiceCloneModelDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "createVoiceCloneModel", null);
__decorate([
    (0, common_1.Get)('voice-clone'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "getVoiceCloneModels", null);
__decorate([
    (0, common_1.Get)('voice-clone/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "getVoiceCloneModel", null);
__decorate([
    (0, common_1.Delete)('voice-clone/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "deleteVoiceCloneModel", null);
__decorate([
    (0, common_1.Post)('voice-clone/narrate'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, voice_clone_dto_1.GenerateVoiceNarrationDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "generateVoiceNarration", null);
__decorate([
    (0, common_1.Post)('travel-narration'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, travel_narration_dto_1.CreateTravelNarrationDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "createTravelNarration", null);
__decorate([
    (0, common_1.Get)('travel-narration'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "getTravelNarrations", null);
__decorate([
    (0, common_1.Get)('travel-narration/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "getTravelNarration", null);
__decorate([
    (0, common_1.Put)('travel-narration/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, travel_narration_dto_1.UpdateTravelNarrationDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "updateTravelNarration", null);
__decorate([
    (0, common_1.Delete)('travel-narration/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "deleteTravelNarration", null);
__decorate([
    (0, common_1.Post)('travel-narration/:id/generate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "generateTravelNarration", null);
__decorate([
    (0, common_1.Post)('historical-simulation'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, historical_simulation_dto_1.CreateHistoricalSimulationDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "createHistoricalSimulation", null);
__decorate([
    (0, common_1.Get)('historical-simulation'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "getHistoricalSimulations", null);
__decorate([
    (0, common_1.Get)('historical-simulation/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "getHistoricalSimulation", null);
__decorate([
    (0, common_1.Put)('historical-simulation/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, historical_simulation_dto_1.UpdateHistoricalSimulationDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "updateHistoricalSimulation", null);
__decorate([
    (0, common_1.Delete)('historical-simulation/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "deleteHistoricalSimulation", null);
__decorate([
    (0, common_1.Post)('historical-simulation/:id/generate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "generateHistoricalSimulation", null);
__decorate([
    (0, common_1.Post)('age-progression'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, age_progression_dto_1.CreateAgeProgressionDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "createAgeProgression", null);
__decorate([
    (0, common_1.Get)('age-progression'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "getAgeProgressions", null);
__decorate([
    (0, common_1.Get)('age-progression/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "getAgeProgression", null);
__decorate([
    (0, common_1.Put)('age-progression/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, age_progression_dto_1.UpdateAgeProgressionDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "updateAgeProgression", null);
__decorate([
    (0, common_1.Delete)('age-progression/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "deleteAgeProgression", null);
__decorate([
    (0, common_1.Post)('age-progression/:id/generate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "generateAgeProgression", null);
__decorate([
    (0, common_1.Post)('memory-synthesis'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, memory_synthesis_dto_1.CreateMemorySynthesisDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "createMemorySynthesis", null);
__decorate([
    (0, common_1.Get)('memory-synthesis'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "getMemorySyntheses", null);
__decorate([
    (0, common_1.Get)('memory-synthesis/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "getMemorySynthesis", null);
__decorate([
    (0, common_1.Put)('memory-synthesis/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, memory_synthesis_dto_1.UpdateMemorySynthesisDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "updateMemorySynthesis", null);
__decorate([
    (0, common_1.Delete)('memory-synthesis/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "deleteMemorySynthesis", null);
__decorate([
    (0, common_1.Post)('memory-synthesis/:id/generate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "generateMemorySynthesis", null);
__decorate([
    (0, common_1.Post)('predictive-resurfacing'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, predictive_resurfacing_dto_1.CreatePredictiveResurfacingDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "createPredictiveResurfacing", null);
__decorate([
    (0, common_1.Get)('predictive-resurfacing'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "getPredictiveResurfacings", null);
__decorate([
    (0, common_1.Get)('predictive-resurfacing/scheduled'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "getScheduledResurfacings", null);
__decorate([
    (0, common_1.Get)('predictive-resurfacing/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "getPredictiveResurfacing", null);
__decorate([
    (0, common_1.Put)('predictive-resurfacing/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, predictive_resurfacing_dto_1.UpdatePredictiveResurfacingDto]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "updatePredictiveResurfacing", null);
__decorate([
    (0, common_1.Delete)('predictive-resurfacing/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AICompanionController.prototype, "deletePredictiveResurfacing", null);
exports.AICompanionController = AICompanionController = __decorate([
    (0, common_1.Controller)('ai-companion'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ai_companion_service_1.AICompanionService])
], AICompanionController);
//# sourceMappingURL=ai-companion.controller.js.map