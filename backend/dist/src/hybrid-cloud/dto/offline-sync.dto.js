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
exports.GetPendingSyncsDto = exports.SyncOfflineChangesDto = exports.CreateOfflineSyncDto = exports.OfflineSyncOperation = void 0;
const class_validator_1 = require("class-validator");
var OfflineSyncOperation;
(function (OfflineSyncOperation) {
    OfflineSyncOperation["CREATE"] = "create";
    OfflineSyncOperation["UPDATE"] = "update";
    OfflineSyncOperation["DELETE"] = "delete";
})(OfflineSyncOperation || (exports.OfflineSyncOperation = OfflineSyncOperation = {}));
class CreateOfflineSyncDto {
}
exports.CreateOfflineSyncDto = CreateOfflineSyncDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOfflineSyncDto.prototype, "entityType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOfflineSyncDto.prototype, "entityId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(OfflineSyncOperation),
    __metadata("design:type", String)
], CreateOfflineSyncDto.prototype, "operation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOfflineSyncDto.prototype, "data", void 0);
class SyncOfflineChangesDto {
}
exports.SyncOfflineChangesDto = SyncOfflineChangesDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyncOfflineChangesDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SyncOfflineChangesDto.prototype, "forceSync", void 0);
class GetPendingSyncsDto {
}
exports.GetPendingSyncsDto = GetPendingSyncsDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetPendingSyncsDto.prototype, "userId", void 0);
//# sourceMappingURL=offline-sync.dto.js.map