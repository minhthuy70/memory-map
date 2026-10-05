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
exports.GenerateVoiceNarrationDto = exports.CreateVoiceCloneModelDto = exports.VoiceCloneStatus = void 0;
const class_validator_1 = require("class-validator");
var VoiceCloneStatus;
(function (VoiceCloneStatus) {
    VoiceCloneStatus["TRAINING"] = "training";
    VoiceCloneStatus["READY"] = "ready";
    VoiceCloneStatus["FAILED"] = "failed";
})(VoiceCloneStatus || (exports.VoiceCloneStatus = VoiceCloneStatus = {}));
class CreateVoiceCloneModelDto {
}
exports.CreateVoiceCloneModelDto = CreateVoiceCloneModelDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVoiceCloneModelDto.prototype, "modelName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVoiceCloneModelDto.prototype, "sampleAudioUrl", void 0);
class GenerateVoiceNarrationDto {
}
exports.GenerateVoiceNarrationDto = GenerateVoiceNarrationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateVoiceNarrationDto.prototype, "modelId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateVoiceNarrationDto.prototype, "text", void 0);
//# sourceMappingURL=voice-clone.dto.js.map