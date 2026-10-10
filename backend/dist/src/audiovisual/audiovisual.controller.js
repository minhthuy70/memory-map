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
const audiovisual_dto_1 = require("./dto/audiovisual.dto");
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
    async getHandwritingCanvases(req) {
        return this.audiovisualService.getHandwritingCanvases(req.user.userId);
    }
    async createHandwritingCanvas(req, dto) {
        return this.audiovisualService.createHandwritingCanvas(req.user.userId, dto);
    }
    async updateHandwritingCanvas(id, req, dto) {
        return this.audiovisualService.updateHandwritingCanvas(id, req.user.userId, dto);
    }
    async deleteHandwritingCanvas(id, req) {
        return this.audiovisualService.deleteHandwritingCanvas(id, req.user.userId);
    }
    async getVintageFilms(req) {
        return this.audiovisualService.getVintageFilms(req.user.userId);
    }
    async createVintageFilm(req, dto) {
        return this.audiovisualService.createVintageFilm(req.user.userId, dto);
    }
    async updateVintageFilm(id, req, dto) {
        return this.audiovisualService.updateVintageFilm(id, req.user.userId, dto);
    }
    async deleteVintageFilm(id, req) {
        return this.audiovisualService.deleteVintageFilm(id, req.user.userId);
    }
    async getLivePhotos(req) {
        return this.audiovisualService.getLivePhotos(req.user.userId);
    }
    async createLivePhoto(req, dto) {
        return this.audiovisualService.createLivePhoto(req.user.userId, dto);
    }
    async updateLivePhoto(id, req, dto) {
        return this.audiovisualService.updateLivePhoto(id, req.user.userId, dto);
    }
    async deleteLivePhoto(id, req) {
        return this.audiovisualService.deleteLivePhoto(id, req.user.userId);
    }
    async getBeforeAfterSliders(req) {
        return this.audiovisualService.getBeforeAfterSliders(req.user.userId);
    }
    async createBeforeAfterSlider(req, dto) {
        return this.audiovisualService.createBeforeAfterSlider(req.user.userId, dto);
    }
    async updateBeforeAfterSlider(id, req, dto) {
        return this.audiovisualService.updateBeforeAfterSlider(id, req.user.userId, dto);
    }
    async deleteBeforeAfterSlider(id, req) {
        return this.audiovisualService.deleteBeforeAfterSlider(id, req.user.userId);
    }
    async getTypographyStamps(req) {
        return this.audiovisualService.getTypographyStamps(req.user.userId);
    }
    async createTypographyStamp(req, dto) {
        return this.audiovisualService.createTypographyStamp(req.user.userId, dto);
    }
    async updateTypographyStamp(id, req, dto) {
        return this.audiovisualService.updateTypographyStamp(id, req.user.userId, dto);
    }
    async deleteTypographyStamp(id, req) {
        return this.audiovisualService.deleteTypographyStamp(id, req.user.userId);
    }
    async getBeatSyncVideos(req) {
        return this.audiovisualService.getBeatSyncVideos(req.user.userId);
    }
    async createBeatSyncVideo(req, dto) {
        return this.audiovisualService.createBeatSyncVideo(req.user.userId, dto);
    }
    async updateBeatSyncVideo(id, req, dto) {
        return this.audiovisualService.updateBeatSyncVideo(id, req.user.userId, dto);
    }
    async deleteBeatSyncVideo(id, req) {
        return this.audiovisualService.deleteBeatSyncVideo(id, req.user.userId);
    }
    async getAIVoiceovers(req) {
        return this.audiovisualService.getAIVoiceovers(req.user.userId);
    }
    async createAIVoiceover(req, dto) {
        return this.audiovisualService.createAIVoiceover(req.user.userId, dto);
    }
    async updateAIVoiceover(id, req, dto) {
        return this.audiovisualService.updateAIVoiceover(id, req.user.userId, dto);
    }
    async deleteAIVoiceover(id, req) {
        return this.audiovisualService.deleteAIVoiceover(id, req.user.userId);
    }
    async getMemorySoundtracks(req) {
        return this.audiovisualService.getMemorySoundtracks(req.user.userId);
    }
    async createMemorySoundtrack(req, dto) {
        return this.audiovisualService.createMemorySoundtrack(req.user.userId, dto);
    }
    async updateMemorySoundtrack(id, req, dto) {
        return this.audiovisualService.updateMemorySoundtrack(id, req.user.userId, dto);
    }
    async deleteMemorySoundtrack(id, req) {
        return this.audiovisualService.deleteMemorySoundtrack(id, req.user.userId);
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
__decorate([
    (0, common_1.Get)('handwriting'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "getHandwritingCanvases", null);
__decorate([
    (0, common_1.Post)('handwriting'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, audiovisual_dto_1.CreateHandwritingCanvasDto]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "createHandwritingCanvas", null);
__decorate([
    (0, common_1.Put)('handwriting/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, audiovisual_dto_1.UpdateHandwritingCanvasDto]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "updateHandwritingCanvas", null);
__decorate([
    (0, common_1.Delete)('handwriting/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "deleteHandwritingCanvas", null);
__decorate([
    (0, common_1.Get)('vintage-films'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "getVintageFilms", null);
__decorate([
    (0, common_1.Post)('vintage-films'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, audiovisual_dto_1.CreateVintageFilmDto]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "createVintageFilm", null);
__decorate([
    (0, common_1.Put)('vintage-films/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, audiovisual_dto_1.UpdateVintageFilmDto]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "updateVintageFilm", null);
__decorate([
    (0, common_1.Delete)('vintage-films/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "deleteVintageFilm", null);
__decorate([
    (0, common_1.Get)('live-photos'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "getLivePhotos", null);
__decorate([
    (0, common_1.Post)('live-photos'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, audiovisual_dto_1.CreateLivePhotoDto]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "createLivePhoto", null);
__decorate([
    (0, common_1.Put)('live-photos/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, audiovisual_dto_1.UpdateLivePhotoDto]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "updateLivePhoto", null);
__decorate([
    (0, common_1.Delete)('live-photos/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "deleteLivePhoto", null);
__decorate([
    (0, common_1.Get)('before-after'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "getBeforeAfterSliders", null);
__decorate([
    (0, common_1.Post)('before-after'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, audiovisual_dto_1.CreateBeforeAfterSliderDto]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "createBeforeAfterSlider", null);
__decorate([
    (0, common_1.Put)('before-after/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, audiovisual_dto_1.UpdateBeforeAfterSliderDto]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "updateBeforeAfterSlider", null);
__decorate([
    (0, common_1.Delete)('before-after/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "deleteBeforeAfterSlider", null);
__decorate([
    (0, common_1.Get)('typography'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "getTypographyStamps", null);
__decorate([
    (0, common_1.Post)('typography'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, audiovisual_dto_1.CreateTypographyStampDto]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "createTypographyStamp", null);
__decorate([
    (0, common_1.Put)('typography/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, audiovisual_dto_1.UpdateTypographyStampDto]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "updateTypographyStamp", null);
__decorate([
    (0, common_1.Delete)('typography/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "deleteTypographyStamp", null);
__decorate([
    (0, common_1.Get)('beat-sync-videos'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "getBeatSyncVideos", null);
__decorate([
    (0, common_1.Post)('beat-sync-videos'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, audiovisual_dto_1.CreateBeatSyncVideoDto]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "createBeatSyncVideo", null);
__decorate([
    (0, common_1.Put)('beat-sync-videos/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, audiovisual_dto_1.UpdateBeatSyncVideoDto]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "updateBeatSyncVideo", null);
__decorate([
    (0, common_1.Delete)('beat-sync-videos/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "deleteBeatSyncVideo", null);
__decorate([
    (0, common_1.Get)('ai-voiceovers'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "getAIVoiceovers", null);
__decorate([
    (0, common_1.Post)('ai-voiceovers'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, audiovisual_dto_1.CreateAIVoiceoverDto]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "createAIVoiceover", null);
__decorate([
    (0, common_1.Put)('ai-voiceovers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, audiovisual_dto_1.UpdateAIVoiceoverDto]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "updateAIVoiceover", null);
__decorate([
    (0, common_1.Delete)('ai-voiceovers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "deleteAIVoiceover", null);
__decorate([
    (0, common_1.Get)('memory-soundtracks'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "getMemorySoundtracks", null);
__decorate([
    (0, common_1.Post)('memory-soundtracks'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, audiovisual_dto_1.CreateMemorySoundtrackDto]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "createMemorySoundtrack", null);
__decorate([
    (0, common_1.Put)('memory-soundtracks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, audiovisual_dto_1.UpdateMemorySoundtrackDto]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "updateMemorySoundtrack", null);
__decorate([
    (0, common_1.Delete)('memory-soundtracks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AudiovisualController.prototype, "deleteMemorySoundtrack", null);
exports.AudiovisualController = AudiovisualController = __decorate([
    (0, common_1.Controller)('audiovisual'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [audiovisual_service_1.AudiovisualService])
], AudiovisualController);
//# sourceMappingURL=audiovisual.controller.js.map