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
exports.CreateLocationUpdateDto = exports.UpdateLiveJourneyBroadcastDto = exports.CreateLiveJourneyBroadcastDto = void 0;
const class_validator_1 = require("class-validator");
class CreateLiveJourneyBroadcastDto {
}
exports.CreateLiveJourneyBroadcastDto = CreateLiveJourneyBroadcastDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLiveJourneyBroadcastDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLiveJourneyBroadcastDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateLiveJourneyBroadcastDto.prototype, "beaconMode", void 0);
class UpdateLiveJourneyBroadcastDto {
}
exports.UpdateLiveJourneyBroadcastDto = UpdateLiveJourneyBroadcastDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateLiveJourneyBroadcastDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLiveJourneyBroadcastDto.prototype, "batteryLevel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLiveJourneyBroadcastDto.prototype, "elevation", void 0);
class CreateLocationUpdateDto {
}
exports.CreateLocationUpdateDto = CreateLocationUpdateDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLocationUpdateDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLocationUpdateDto.prototype, "longitude", void 0);
//# sourceMappingURL=live-journey-broadcast.dto.js.map