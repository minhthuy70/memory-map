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
exports.UpdatePredictiveResurfacingDto = exports.CreatePredictiveResurfacingDto = exports.StressLevel = void 0;
const class_validator_1 = require("class-validator");
var StressLevel;
(function (StressLevel) {
    StressLevel["LOW"] = "low";
    StressLevel["MEDIUM"] = "medium";
    StressLevel["HIGH"] = "high";
})(StressLevel || (exports.StressLevel = StressLevel = {}));
class CreatePredictiveResurfacingDto {
}
exports.CreatePredictiveResurfacingDto = CreatePredictiveResurfacingDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePredictiveResurfacingDto.prototype, "memoryId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePredictiveResurfacingDto.prototype, "sentimentScore", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(StressLevel),
    __metadata("design:type", String)
], CreatePredictiveResurfacingDto.prototype, "stressLevel", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePredictiveResurfacingDto.prototype, "scheduledAt", void 0);
class UpdatePredictiveResurfacingDto {
}
exports.UpdatePredictiveResurfacingDto = UpdatePredictiveResurfacingDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePredictiveResurfacingDto.prototype, "wasViewed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePredictiveResurfacingDto.prototype, "userFeedback", void 0);
//# sourceMappingURL=predictive-resurfacing.dto.js.map