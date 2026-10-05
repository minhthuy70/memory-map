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
exports.NASConfigDto = exports.TriggerBackupDto = exports.UpdateNASBackupDto = exports.CreateNASBackupDto = exports.BackupSchedule = exports.NASProvider = void 0;
const class_validator_1 = require("class-validator");
var NASProvider;
(function (NASProvider) {
    NASProvider["WEBDAV"] = "webdav";
    NASProvider["S3"] = "s3";
    NASProvider["DROPBOX"] = "dropbox";
    NASProvider["ONEDRIVE"] = "onedrive";
})(NASProvider || (exports.NASProvider = NASProvider = {}));
var BackupSchedule;
(function (BackupSchedule) {
    BackupSchedule["DAILY"] = "daily";
    BackupSchedule["WEEKLY"] = "weekly";
    BackupSchedule["MONTHLY"] = "monthly";
})(BackupSchedule || (exports.BackupSchedule = BackupSchedule = {}));
class CreateNASBackupDto {
}
exports.CreateNASBackupDto = CreateNASBackupDto;
__decorate([
    (0, class_validator_1.IsEnum)(NASProvider),
    __metadata("design:type", String)
], CreateNASBackupDto.prototype, "provider", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNASBackupDto.prototype, "backupPath", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(BackupSchedule),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNASBackupDto.prototype, "schedule", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateNASBackupDto.prototype, "isActive", void 0);
class UpdateNASBackupDto {
}
exports.UpdateNASBackupDto = UpdateNASBackupDto;
__decorate([
    (0, class_validator_1.IsEnum)(NASProvider),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNASBackupDto.prototype, "provider", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNASBackupDto.prototype, "backupPath", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(BackupSchedule),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNASBackupDto.prototype, "schedule", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateNASBackupDto.prototype, "isActive", void 0);
class TriggerBackupDto {
}
exports.TriggerBackupDto = TriggerBackupDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TriggerBackupDto.prototype, "backupId", void 0);
class NASConfigDto {
}
exports.NASConfigDto = NASConfigDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NASConfigDto.prototype, "provider", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NASConfigDto.prototype, "endpoint", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NASConfigDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NASConfigDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NASConfigDto.prototype, "bucket", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NASConfigDto.prototype, "accessKey", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NASConfigDto.prototype, "secretKey", void 0);
//# sourceMappingURL=nas-backup.dto.js.map