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
exports.UpdateWildernessDataSaverDto = exports.CreateWildernessDataSaverDto = exports.QualityLevel = exports.CompressionLevel = exports.DataSaverMode = void 0;
const class_validator_1 = require("class-validator");
var DataSaverMode;
(function (DataSaverMode) {
    DataSaverMode["TWO_G"] = "2g";
    DataSaverMode["THREE_G"] = "3g";
    DataSaverMode["LOW_BANDWIDTH"] = "low-bandwidth";
})(DataSaverMode || (exports.DataSaverMode = DataSaverMode = {}));
var CompressionLevel;
(function (CompressionLevel) {
    CompressionLevel["LOW"] = "low";
    CompressionLevel["MEDIUM"] = "medium";
    CompressionLevel["HIGH"] = "high";
})(CompressionLevel || (exports.CompressionLevel = CompressionLevel = {}));
var QualityLevel;
(function (QualityLevel) {
    QualityLevel["LOW"] = "low";
    QualityLevel["MEDIUM"] = "medium";
    QualityLevel["HIGH"] = "high";
})(QualityLevel || (exports.QualityLevel = QualityLevel = {}));
class CreateWildernessDataSaverDto {
}
exports.CreateWildernessDataSaverDto = CreateWildernessDataSaverDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateWildernessDataSaverDto.prototype, "isEnabled", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(DataSaverMode),
    __metadata("design:type", String)
], CreateWildernessDataSaverDto.prototype, "mode", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(CompressionLevel),
    __metadata("design:type", String)
], CreateWildernessDataSaverDto.prototype, "compression", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(QualityLevel),
    __metadata("design:type", String)
], CreateWildernessDataSaverDto.prototype, "imageQuality", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(QualityLevel),
    __metadata("design:type", String)
], CreateWildernessDataSaverDto.prototype, "videoQuality", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateWildernessDataSaverDto.prototype, "vectorTiles", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateWildernessDataSaverDto.prototype, "backgroundQueue", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateWildernessDataSaverDto.prototype, "dataLimit", void 0);
class UpdateWildernessDataSaverDto {
}
exports.UpdateWildernessDataSaverDto = UpdateWildernessDataSaverDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateWildernessDataSaverDto.prototype, "isEnabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(DataSaverMode),
    __metadata("design:type", String)
], UpdateWildernessDataSaverDto.prototype, "mode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(CompressionLevel),
    __metadata("design:type", String)
], UpdateWildernessDataSaverDto.prototype, "compression", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(QualityLevel),
    __metadata("design:type", String)
], UpdateWildernessDataSaverDto.prototype, "imageQuality", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(QualityLevel),
    __metadata("design:type", String)
], UpdateWildernessDataSaverDto.prototype, "videoQuality", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateWildernessDataSaverDto.prototype, "vectorTiles", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateWildernessDataSaverDto.prototype, "backgroundQueue", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateWildernessDataSaverDto.prototype, "dataLimit", void 0);
//# sourceMappingURL=wilderness-data-saver.dto.js.map