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
exports.UpdateScreenshotPreventionDto = exports.CreateScreenshotPreventionDto = exports.Platform = void 0;
const class_validator_1 = require("class-validator");
var Platform;
(function (Platform) {
    Platform["ANDROID"] = "android";
    Platform["IOS"] = "ios";
})(Platform || (exports.Platform = Platform = {}));
class CreateScreenshotPreventionDto {
}
exports.CreateScreenshotPreventionDto = CreateScreenshotPreventionDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateScreenshotPreventionDto.prototype, "isEnabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateScreenshotPreventionDto.prototype, "watermarkEnabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScreenshotPreventionDto.prototype, "watermarkText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateScreenshotPreventionDto.prototype, "blurPreview", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(Platform),
    __metadata("design:type", String)
], CreateScreenshotPreventionDto.prototype, "platform", void 0);
class UpdateScreenshotPreventionDto {
}
exports.UpdateScreenshotPreventionDto = UpdateScreenshotPreventionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateScreenshotPreventionDto.prototype, "isEnabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateScreenshotPreventionDto.prototype, "watermarkEnabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateScreenshotPreventionDto.prototype, "watermarkText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateScreenshotPreventionDto.prototype, "blurPreview", void 0);
//# sourceMappingURL=screenshot-prevention.dto.js.map