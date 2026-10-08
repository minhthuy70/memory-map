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
exports.UpdateDesktopAppDto = exports.CreateDesktopAppDto = exports.Platform = void 0;
const class_validator_1 = require("class-validator");
var Platform;
(function (Platform) {
    Platform["WINDOWS"] = "windows";
    Platform["MACOS"] = "macos";
    Platform["LINUX"] = "linux";
})(Platform || (exports.Platform = Platform = {}));
class CreateDesktopAppDto {
}
exports.CreateDesktopAppDto = CreateDesktopAppDto;
__decorate([
    (0, class_validator_1.IsEnum)(Platform),
    __metadata("design:type", String)
], CreateDesktopAppDto.prototype, "platform", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDesktopAppDto.prototype, "version", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDesktopAppDto.prototype, "installPath", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDesktopAppDto.prototype, "systemTray", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDesktopAppDto.prototype, "shortcuts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDesktopAppDto.prototype, "autoStart", void 0);
class UpdateDesktopAppDto {
}
exports.UpdateDesktopAppDto = UpdateDesktopAppDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDesktopAppDto.prototype, "version", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDesktopAppDto.prototype, "installPath", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDesktopAppDto.prototype, "systemTray", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDesktopAppDto.prototype, "shortcuts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDesktopAppDto.prototype, "autoStart", void 0);
//# sourceMappingURL=desktop-app.dto.js.map