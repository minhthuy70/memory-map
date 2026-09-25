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
exports.VerifyTwoFactorLoginDto = exports.DisableTwoFactorDto = exports.EnableTwoFactorDto = void 0;
const class_validator_1 = require("class-validator");
class EnableTwoFactorDto {
}
exports.EnableTwoFactorDto = EnableTwoFactorDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Mã xác thực không được để trống' }),
    (0, class_validator_1.IsString)({ message: 'Mã xác thực phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], EnableTwoFactorDto.prototype, "code", void 0);
class DisableTwoFactorDto {
}
exports.DisableTwoFactorDto = DisableTwoFactorDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Mã xác thực phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], DisableTwoFactorDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Mật khẩu phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], DisableTwoFactorDto.prototype, "password", void 0);
class VerifyTwoFactorLoginDto {
}
exports.VerifyTwoFactorLoginDto = VerifyTwoFactorLoginDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Token tạm thời không được để trống' }),
    (0, class_validator_1.IsString)({ message: 'Token tạm thời phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], VerifyTwoFactorLoginDto.prototype, "tempToken", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Mã xác thực không được để trống' }),
    (0, class_validator_1.IsString)({ message: 'Mã xác thực phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], VerifyTwoFactorLoginDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], VerifyTwoFactorLoginDto.prototype, "rememberMe", void 0);
//# sourceMappingURL=two-factor.dto.js.map