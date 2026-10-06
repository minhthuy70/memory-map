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
exports.AccessVaultMemoryDto = exports.UpdateVaultMemoryDto = exports.CreateVaultMemoryDto = exports.VaultType = void 0;
const class_validator_1 = require("class-validator");
var VaultType;
(function (VaultType) {
    VaultType["STANDARD"] = "standard";
    VaultType["DOUBLE_LOCK"] = "double-lock";
    VaultType["EPHEMERAL"] = "ephemeral";
})(VaultType || (exports.VaultType = VaultType = {}));
class CreateVaultMemoryDto {
}
exports.CreateVaultMemoryDto = CreateVaultMemoryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVaultMemoryDto.prototype, "memoryId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(VaultType),
    __metadata("design:type", String)
], CreateVaultMemoryDto.prototype, "vaultType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVaultMemoryDto.prototype, "encryptionKey", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateVaultMemoryDto.prototype, "maxViews", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVaultMemoryDto.prototype, "expiresAt", void 0);
class UpdateVaultMemoryDto {
}
exports.UpdateVaultMemoryDto = UpdateVaultMemoryDto;
__decorate([
    (0, class_validator_1.IsEnum)(VaultType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVaultMemoryDto.prototype, "vaultType", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateVaultMemoryDto.prototype, "isEncrypted", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateVaultMemoryDto.prototype, "maxViews", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVaultMemoryDto.prototype, "expiresAt", void 0);
class AccessVaultMemoryDto {
}
exports.AccessVaultMemoryDto = AccessVaultMemoryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AccessVaultMemoryDto.prototype, "accessMethod", void 0);
//# sourceMappingURL=vault-memory.dto.js.map