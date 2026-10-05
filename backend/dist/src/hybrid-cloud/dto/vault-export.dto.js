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
exports.GetVaultExportsDto = exports.DownloadVaultExportDto = exports.CreateVaultExportDto = void 0;
const class_validator_1 = require("class-validator");
class CreateVaultExportDto {
}
exports.CreateVaultExportDto = CreateVaultExportDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVaultExportDto.prototype, "fileName", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateVaultExportDto.prototype, "isPublic", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVaultExportDto.prototype, "expiresAt", void 0);
class DownloadVaultExportDto {
}
exports.DownloadVaultExportDto = DownloadVaultExportDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DownloadVaultExportDto.prototype, "accessCode", void 0);
class GetVaultExportsDto {
}
exports.GetVaultExportsDto = GetVaultExportsDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetVaultExportsDto.prototype, "userId", void 0);
//# sourceMappingURL=vault-export.dto.js.map