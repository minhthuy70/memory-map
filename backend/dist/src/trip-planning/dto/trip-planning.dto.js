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
exports.UpdateSafetyHubDto = exports.UpdateEmergencyContactDto = exports.CreateEmergencyContactDto = exports.UpdateCarbonFootprintDto = exports.CreateCarbonFootprintDto = exports.UpdateVisitedCountryDto = exports.CreateVisitedCountryDto = exports.UpdateFlightTrainStatusDto = exports.CreateFlightTrainStatusDto = exports.UpdateOfflineGuideDto = exports.CreateOfflineGuideDto = exports.UpdateNavigationRouteDto = exports.CreateNavigationRouteDto = exports.UpdateRouteOptimizationDto = exports.CreateRouteOptimizationDto = void 0;
const class_validator_1 = require("class-validator");
class CreateRouteOptimizationDto {
}
exports.CreateRouteOptimizationDto = CreateRouteOptimizationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRouteOptimizationDto.prototype, "itineraryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRouteOptimizationDto.prototype, "memoryIds", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRouteOptimizationDto.prototype, "transportMode", void 0);
class UpdateRouteOptimizationDto {
}
exports.UpdateRouteOptimizationDto = UpdateRouteOptimizationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRouteOptimizationDto.prototype, "optimizedOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateRouteOptimizationDto.prototype, "totalDistance", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateRouteOptimizationDto.prototype, "totalTime", void 0);
class CreateNavigationRouteDto {
}
exports.CreateNavigationRouteDto = CreateNavigationRouteDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNavigationRouteDto.prototype, "itineraryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNavigationRouteDto.prototype, "startLocation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNavigationRouteDto.prototype, "endLocation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNavigationRouteDto.prototype, "waypoints", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNavigationRouteDto.prototype, "transportMode", void 0);
class UpdateNavigationRouteDto {
}
exports.UpdateNavigationRouteDto = UpdateNavigationRouteDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNavigationRouteDto.prototype, "steps", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNavigationRouteDto.prototype, "evChargingStations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateNavigationRouteDto.prototype, "gasStations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateNavigationRouteDto.prototype, "elevationGain", void 0);
class CreateOfflineGuideDto {
}
exports.CreateOfflineGuideDto = CreateOfflineGuideDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOfflineGuideDto.prototype, "itineraryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOfflineGuideDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOfflineGuideDto.prototype, "memoryIds", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOfflineGuideDto.prototype, "mapTiles", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOfflineGuideDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOfflineGuideDto.prototype, "emergencyContacts", void 0);
class UpdateOfflineGuideDto {
}
exports.UpdateOfflineGuideDto = UpdateOfflineGuideDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOfflineGuideDto.prototype, "downloadUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateOfflineGuideDto.prototype, "isDownloaded", void 0);
class CreateFlightTrainStatusDto {
}
exports.CreateFlightTrainStatusDto = CreateFlightTrainStatusDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlightTrainStatusDto.prototype, "itineraryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlightTrainStatusDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlightTrainStatusDto.prototype, "carrier", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlightTrainStatusDto.prototype, "number", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlightTrainStatusDto.prototype, "departureTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlightTrainStatusDto.prototype, "arrivalTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlightTrainStatusDto.prototype, "origin", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlightTrainStatusDto.prototype, "destination", void 0);
class UpdateFlightTrainStatusDto {
}
exports.UpdateFlightTrainStatusDto = UpdateFlightTrainStatusDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFlightTrainStatusDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFlightTrainStatusDto.prototype, "gate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFlightTrainStatusDto.prototype, "platform", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateFlightTrainStatusDto.prototype, "delayMinutes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateFlightTrainStatusDto.prototype, "memoryDraftTriggered", void 0);
class CreateVisitedCountryDto {
}
exports.CreateVisitedCountryDto = CreateVisitedCountryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVisitedCountryDto.prototype, "countryCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVisitedCountryDto.prototype, "countryName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVisitedCountryDto.prototype, "visitDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateVisitedCountryDto.prototype, "visaRequired", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVisitedCountryDto.prototype, "visaExpiryDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVisitedCountryDto.prototype, "notes", void 0);
class UpdateVisitedCountryDto {
}
exports.UpdateVisitedCountryDto = UpdateVisitedCountryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVisitedCountryDto.prototype, "visaExpiryDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVisitedCountryDto.prototype, "notes", void 0);
class CreateCarbonFootprintDto {
}
exports.CreateCarbonFootprintDto = CreateCarbonFootprintDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCarbonFootprintDto.prototype, "itineraryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCarbonFootprintDto.prototype, "tripType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCarbonFootprintDto.prototype, "distance", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCarbonFootprintDto.prototype, "vehicleType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCarbonFootprintDto.prototype, "co2Emission", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCarbonFootprintDto.prototype, "offsetCost", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCarbonFootprintDto.prototype, "offsetUrl", void 0);
class UpdateCarbonFootprintDto {
}
exports.UpdateCarbonFootprintDto = UpdateCarbonFootprintDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateCarbonFootprintDto.prototype, "offsetCost", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCarbonFootprintDto.prototype, "offsetUrl", void 0);
class CreateEmergencyContactDto {
}
exports.CreateEmergencyContactDto = CreateEmergencyContactDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmergencyContactDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmergencyContactDto.prototype, "relationship", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmergencyContactDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmergencyContactDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateEmergencyContactDto.prototype, "isPrimary", void 0);
class UpdateEmergencyContactDto {
}
exports.UpdateEmergencyContactDto = UpdateEmergencyContactDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmergencyContactDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmergencyContactDto.prototype, "relationship", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmergencyContactDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmergencyContactDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateEmergencyContactDto.prototype, "isPrimary", void 0);
class UpdateSafetyHubDto {
}
exports.UpdateSafetyHubDto = UpdateSafetyHubDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateSafetyHubDto.prototype, "lastLocationLat", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateSafetyHubDto.prototype, "lastLocationLng", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSafetyHubDto.prototype, "lastLocationTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSafetyHubDto.prototype, "sosTriggered", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSafetyHubDto.prototype, "sosTriggeredAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSafetyHubDto.prototype, "nearestPolice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSafetyHubDto.prototype, "nearestMedical", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSafetyHubDto.prototype, "nearestEmbassy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSafetyHubDto.prototype, "emergencyBroadcastSent", void 0);
//# sourceMappingURL=trip-planning.dto.js.map