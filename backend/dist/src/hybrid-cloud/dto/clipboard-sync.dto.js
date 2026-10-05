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
exports.GetClipboardSyncsDto = exports.GetClipboardSyncDto = exports.CreateClipboardSyncDto = void 0;
const class_validator_1 = require("class-validator");
class CreateClipboardSyncDto {
}
exports.CreateClipboardSyncDto = CreateClipboardSyncDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClipboardSyncDto.prototype, "dataType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClipboardSyncDto.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClipboardSyncDto.prototype, "sourceDevice", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClipboardSyncDto.prototype, "expiresAt", void 0);
class GetClipboardSyncDto {
}
exports.GetClipboardSyncDto = GetClipboardSyncDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetClipboardSyncDto.prototype, "clipboardId", void 0);
class GetClipboardSyncsDto {
}
exports.GetClipboardSyncsDto = GetClipboardSyncsDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetClipboardSyncsDto.prototype, "userId", void 0);
//# sourceMappingURL=clipboard-sync.dto.js.map