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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripPlanningController = void 0;
const common_1 = require("@nestjs/common");
const trip_planning_service_1 = require("./trip-planning.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const trip_planning_dto_1 = require("./dto/trip-planning.dto");
let TripPlanningController = class TripPlanningController {
    constructor(tripPlanningService) {
        this.tripPlanningService = tripPlanningService;
    }
    async getRouteOptimizations(req) {
        return this.tripPlanningService.getRouteOptimizations(req.user.userId);
    }
    async createRouteOptimization(req, dto) {
        return this.tripPlanningService.createRouteOptimization(req.user.userId, dto);
    }
    async updateRouteOptimization(id, req, dto) {
        return this.tripPlanningService.updateRouteOptimization(id, req.user.userId, dto);
    }
    async deleteRouteOptimization(id, req) {
        return this.tripPlanningService.deleteRouteOptimization(id, req.user.userId);
    }
    async getNavigationRoutes(req) {
        return this.tripPlanningService.getNavigationRoutes(req.user.userId);
    }
    async createNavigationRoute(req, dto) {
        return this.tripPlanningService.createNavigationRoute(req.user.userId, dto);
    }
    async updateNavigationRoute(id, req, dto) {
        return this.tripPlanningService.updateNavigationRoute(id, req.user.userId, dto);
    }
    async deleteNavigationRoute(id, req) {
        return this.tripPlanningService.deleteNavigationRoute(id, req.user.userId);
    }
    async getOfflineGuides(req) {
        return this.tripPlanningService.getOfflineGuides(req.user.userId);
    }
    async createOfflineGuide(req, dto) {
        return this.tripPlanningService.createOfflineGuide(req.user.userId, dto);
    }
    async updateOfflineGuide(id, req, dto) {
        return this.tripPlanningService.updateOfflineGuide(id, req.user.userId, dto);
    }
    async deleteOfflineGuide(id, req) {
        return this.tripPlanningService.deleteOfflineGuide(id, req.user.userId);
    }
    async getFlightTrainStatuses(req) {
        return this.tripPlanningService.getFlightTrainStatuses(req.user.userId);
    }
    async createFlightTrainStatus(req, dto) {
        return this.tripPlanningService.createFlightTrainStatus(req.user.userId, dto);
    }
    async updateFlightTrainStatus(id, req, dto) {
        return this.tripPlanningService.updateFlightTrainStatus(id, req.user.userId, dto);
    }
    async deleteFlightTrainStatus(id, req) {
        return this.tripPlanningService.deleteFlightTrainStatus(id, req.user.userId);
    }
    async getVisitedCountries(req) {
        return this.tripPlanningService.getVisitedCountries(req.user.userId);
    }
    async createVisitedCountry(req, dto) {
        return this.tripPlanningService.createVisitedCountry(req.user.userId, dto);
    }
    async updateVisitedCountry(id, req, dto) {
        return this.tripPlanningService.updateVisitedCountry(id, req.user.userId, dto);
    }
    async deleteVisitedCountry(id, req) {
        return this.tripPlanningService.deleteVisitedCountry(id, req.user.userId);
    }
    async getCarbonFootprints(req) {
        return this.tripPlanningService.getCarbonFootprints(req.user.userId);
    }
    async createCarbonFootprint(req, dto) {
        return this.tripPlanningService.createCarbonFootprint(req.user.userId, dto);
    }
    async updateCarbonFootprint(id, req, dto) {
        return this.tripPlanningService.updateCarbonFootprint(id, req.user.userId, dto);
    }
    async deleteCarbonFootprint(id, req) {
        return this.tripPlanningService.deleteCarbonFootprint(id, req.user.userId);
    }
    async getEmergencyContacts(req) {
        return this.tripPlanningService.getEmergencyContacts(req.user.userId);
    }
    async createEmergencyContact(req, dto) {
        return this.tripPlanningService.createEmergencyContact(req.user.userId, dto);
    }
    async updateEmergencyContact(id, req, dto) {
        return this.tripPlanningService.updateEmergencyContact(id, req.user.userId, dto);
    }
    async deleteEmergencyContact(id, req) {
        return this.tripPlanningService.deleteEmergencyContact(id, req.user.userId);
    }
    async getSafetyHub(req) {
        return this.tripPlanningService.getSafetyHub(req.user.userId);
    }
    async createSafetyHub(req) {
        return this.tripPlanningService.createSafetyHub(req.user.userId);
    }
    async updateSafetyHub(req, dto) {
        return this.tripPlanningService.updateSafetyHub(req.user.userId, dto);
    }
};
exports.TripPlanningController = TripPlanningController;
__decorate([
    (0, common_1.Get)('route-optimizations'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "getRouteOptimizations", null);
__decorate([
    (0, common_1.Post)('route-optimizations'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, trip_planning_dto_1.CreateRouteOptimizationDto]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "createRouteOptimization", null);
__decorate([
    (0, common_1.Put)('route-optimizations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, trip_planning_dto_1.UpdateRouteOptimizationDto]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "updateRouteOptimization", null);
__decorate([
    (0, common_1.Delete)('route-optimizations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "deleteRouteOptimization", null);
__decorate([
    (0, common_1.Get)('navigation-routes'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "getNavigationRoutes", null);
__decorate([
    (0, common_1.Post)('navigation-routes'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, trip_planning_dto_1.CreateNavigationRouteDto]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "createNavigationRoute", null);
__decorate([
    (0, common_1.Put)('navigation-routes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, trip_planning_dto_1.UpdateNavigationRouteDto]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "updateNavigationRoute", null);
__decorate([
    (0, common_1.Delete)('navigation-routes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "deleteNavigationRoute", null);
__decorate([
    (0, common_1.Get)('offline-guides'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "getOfflineGuides", null);
__decorate([
    (0, common_1.Post)('offline-guides'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, trip_planning_dto_1.CreateOfflineGuideDto]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "createOfflineGuide", null);
__decorate([
    (0, common_1.Put)('offline-guides/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, trip_planning_dto_1.UpdateOfflineGuideDto]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "updateOfflineGuide", null);
__decorate([
    (0, common_1.Delete)('offline-guides/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "deleteOfflineGuide", null);
__decorate([
    (0, common_1.Get)('flight-train-statuses'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "getFlightTrainStatuses", null);
__decorate([
    (0, common_1.Post)('flight-train-statuses'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, trip_planning_dto_1.CreateFlightTrainStatusDto]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "createFlightTrainStatus", null);
__decorate([
    (0, common_1.Put)('flight-train-statuses/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, trip_planning_dto_1.UpdateFlightTrainStatusDto]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "updateFlightTrainStatus", null);
__decorate([
    (0, common_1.Delete)('flight-train-statuses/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "deleteFlightTrainStatus", null);
__decorate([
    (0, common_1.Get)('visited-countries'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "getVisitedCountries", null);
__decorate([
    (0, common_1.Post)('visited-countries'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, trip_planning_dto_1.CreateVisitedCountryDto]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "createVisitedCountry", null);
__decorate([
    (0, common_1.Put)('visited-countries/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, trip_planning_dto_1.UpdateVisitedCountryDto]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "updateVisitedCountry", null);
__decorate([
    (0, common_1.Delete)('visited-countries/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "deleteVisitedCountry", null);
__decorate([
    (0, common_1.Get)('carbon-footprints'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "getCarbonFootprints", null);
__decorate([
    (0, common_1.Post)('carbon-footprints'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, trip_planning_dto_1.CreateCarbonFootprintDto]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "createCarbonFootprint", null);
__decorate([
    (0, common_1.Put)('carbon-footprints/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, trip_planning_dto_1.UpdateCarbonFootprintDto]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "updateCarbonFootprint", null);
__decorate([
    (0, common_1.Delete)('carbon-footprints/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "deleteCarbonFootprint", null);
__decorate([
    (0, common_1.Get)('emergency-contacts'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "getEmergencyContacts", null);
__decorate([
    (0, common_1.Post)('emergency-contacts'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, trip_planning_dto_1.CreateEmergencyContactDto]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "createEmergencyContact", null);
__decorate([
    (0, common_1.Put)('emergency-contacts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, trip_planning_dto_1.UpdateEmergencyContactDto]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "updateEmergencyContact", null);
__decorate([
    (0, common_1.Delete)('emergency-contacts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "deleteEmergencyContact", null);
__decorate([
    (0, common_1.Get)('safety-hub'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "getSafetyHub", null);
__decorate([
    (0, common_1.Post)('safety-hub'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "createSafetyHub", null);
__decorate([
    (0, common_1.Put)('safety-hub'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, trip_planning_dto_1.UpdateSafetyHubDto]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "updateSafetyHub", null);
exports.TripPlanningController = TripPlanningController = __decorate([
    (0, common_1.Controller)('trip-planning'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [trip_planning_service_1.TripPlanningService])
], TripPlanningController);
//# sourceMappingURL=trip-planning.controller.js.map