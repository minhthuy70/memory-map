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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMemorySoundtrackDto = exports.CreateMemorySoundtrackDto = exports.UpdateAIVoiceoverDto = exports.CreateAIVoiceoverDto = exports.UpdateBeatSyncVideoDto = exports.CreateBeatSyncVideoDto = exports.UpdateTypographyStampDto = exports.CreateTypographyStampDto = exports.UpdateBeforeAfterSliderDto = exports.CreateBeforeAfterSliderDto = exports.UpdateLivePhotoDto = exports.CreateLivePhotoDto = exports.UpdateVintageFilmDto = exports.CreateVintageFilmDto = exports.UpdateHandwritingCanvasDto = exports.CreateHandwritingCanvasDto = void 0;
const class_validator_1 = require("class-validator");
class CreateHandwritingCanvasDto {
}
exports.CreateHandwritingCanvasDto = CreateHandwritingCanvasDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHandwritingCanvasDto.prototype, "memoryId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHandwritingCanvasDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHandwritingCanvasDto.prototype, "drawingData", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHandwritingCanvasDto.prototype, "brushType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHandwritingCanvasDto.prototype, "brushColor", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateHandwritingCanvasDto.prototype, "brushSize", void 0);
class UpdateHandwritingCanvasDto {
}
exports.UpdateHandwritingCanvasDto = UpdateHandwritingCanvasDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHandwritingCanvasDto.prototype, "drawingData", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHandwritingCanvasDto.prototype, "brushType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHandwritingCanvasDto.prototype, "brushColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateHandwritingCanvasDto.prototype, "brushSize", void 0);
class CreateVintageFilmDto {
}
exports.CreateVintageFilmDto = CreateVintageFilmDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVintageFilmDto.prototype, "memoryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVintageFilmDto.prototype, "originalImageUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVintageFilmDto.prototype, "filterType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateVintageFilmDto.prototype, "intensity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateVintageFilmDto.prototype, "grainAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVintageFilmDto.prototype, "lightLeak", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVintageFilmDto.prototype, "dateStamp", void 0);
class UpdateVintageFilmDto {
}
exports.UpdateVintageFilmDto = UpdateVintageFilmDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVintageFilmDto.prototype, "filterType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateVintageFilmDto.prototype, "intensity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateVintageFilmDto.prototype, "grainAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVintageFilmDto.prototype, "lightLeak", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVintageFilmDto.prototype, "dateStamp", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVintageFilmDto.prototype, "processedImageUrl", void 0);
class CreateLivePhotoDto {
}
exports.CreateLivePhotoDto = CreateLivePhotoDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLivePhotoDto.prototype, "memoryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLivePhotoDto.prototype, "photoUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLivePhotoDto.prototype, "videoUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLivePhotoDto.prototype, "platform", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateLivePhotoDto.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateLivePhotoDto.prototype, "isLoop", void 0);
class UpdateLivePhotoDto {
}
exports.UpdateLivePhotoDto = UpdateLivePhotoDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLivePhotoDto.prototype, "videoUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLivePhotoDto.prototype, "keyframeUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateLivePhotoDto.prototype, "isLoop", void 0);
class CreateBeforeAfterSliderDto {
}
exports.CreateBeforeAfterSliderDto = CreateBeforeAfterSliderDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBeforeAfterSliderDto.prototype, "memoryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBeforeAfterSliderDto.prototype, "beforeImageUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBeforeAfterSliderDto.prototype, "afterImageUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBeforeAfterSliderDto.prototype, "orientation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBeforeAfterSliderDto.prototype, "sliderPosition", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBeforeAfterSliderDto.prototype, "blendMode", void 0);
class UpdateBeforeAfterSliderDto {
}
exports.UpdateBeforeAfterSliderDto = UpdateBeforeAfterSliderDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBeforeAfterSliderDto.prototype, "beforeImageUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBeforeAfterSliderDto.prototype, "afterImageUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBeforeAfterSliderDto.prototype, "orientation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateBeforeAfterSliderDto.prototype, "sliderPosition", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBeforeAfterSliderDto.prototype, "blendMode", void 0);
class CreateTypographyStampDto {
}
exports.CreateTypographyStampDto = CreateTypographyStampDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTypographyStampDto.prototype, "text", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTypographyStampDto.prototype, "fontName", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateTypographyStampDto.prototype, "fontSize", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTypographyStampDto.prototype, "fontColor", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTypographyStampDto.prototype, "stampType", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateTypographyStampDto.prototype, "positionX", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateTypographyStampDto.prototype, "positionY", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateTypographyStampDto.prototype, "rotation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTypographyStampDto.prototype, "memoryId", void 0);
class UpdateTypographyStampDto {
}
exports.UpdateTypographyStampDto = UpdateTypographyStampDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTypographyStampDto.prototype, "text", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTypographyStampDto.prototype, "fontName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateTypographyStampDto.prototype, "fontSize", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTypographyStampDto.prototype, "fontColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTypographyStampDto.prototype, "stampType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateTypographyStampDto.prototype, "positionX", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateTypographyStampDto.prototype, "positionY", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateTypographyStampDto.prototype, "rotation", void 0);
class CreateBeatSyncVideoDto {
}
exports.CreateBeatSyncVideoDto = CreateBeatSyncVideoDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBeatSyncVideoDto.prototype, "memoryIds", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBeatSyncVideoDto.prototype, "audioUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBeatSyncVideoDto.prototype, "beatPattern", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBeatSyncVideoDto.prototype, "pacing", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBeatSyncVideoDto.prototype, "transitionStyle", void 0);
class UpdateBeatSyncVideoDto {
}
exports.UpdateBeatSyncVideoDto = UpdateBeatSyncVideoDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBeatSyncVideoDto.prototype, "videoUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBeatSyncVideoDto.prototype, "status", void 0);
class CreateAIVoiceoverDto {
}
exports.CreateAIVoiceoverDto = CreateAIVoiceoverDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAIVoiceoverDto.prototype, "memoryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAIVoiceoverDto.prototype, "audioUrl", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAIVoiceoverDto.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAIVoiceoverDto.prototype, "transcript", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAIVoiceoverDto.prototype, "timestamps", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAIVoiceoverDto.prototype, "noiseLevel", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAIVoiceoverDto.prototype, "vocalFilter", void 0);
class UpdateAIVoiceoverDto {
}
exports.UpdateAIVoiceoverDto = UpdateAIVoiceoverDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAIVoiceoverDto.prototype, "transcript", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateAIVoiceoverDto.prototype, "noiseLevel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAIVoiceoverDto.prototype, "vocalFilter", void 0);
class CreateMemorySoundtrackDto {
}
exports.CreateMemorySoundtrackDto = CreateMemorySoundtrackDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemorySoundtrackDto.prototype, "memoryId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemorySoundtrackDto.prototype, "spotifyTrackId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemorySoundtrackDto.prototype, "fieldRecordingUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemorySoundtrackDto.prototype, "mixSettings", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateMemorySoundtrackDto.prototype, "duration", void 0);
class UpdateMemorySoundtrackDto {
}
exports.UpdateMemorySoundtrackDto = UpdateMemorySoundtrackDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMemorySoundtrackDto.prototype, "spotifyTrackId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMemorySoundtrackDto.prototype, "fieldRecordingUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMemorySoundtrackDto.prototype, "mixSettings", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMemorySoundtrackDto.prototype, "outputUrl", void 0);
//# sourceMappingURL=audiovisual.dto.js.map