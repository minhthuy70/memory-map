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
let TripPlanningController = class TripPlanningController {
    constructor(tripPlanningService) {
        this.tripPlanningService = tripPlanningService;
    }
    async getItineraries(req) {
        return this.tripPlanningService.getItineraries(req.user.userId);
    }
    async getItinerary(req, id) {
        return this.tripPlanningService.getItinerary(req.user.userId, id);
    }
    async createItinerary(req, data) {
        return this.tripPlanningService.createItinerary(req.user.userId, data);
    }
    async updateItinerary(req, id, data) {
        return this.tripPlanningService.updateItinerary(req.user.userId, id, data);
    }
    async deleteItinerary(req, id) {
        return this.tripPlanningService.deleteItinerary(req.user.userId, id);
    }
    async getTripExpenses(req, itineraryId) {
        return this.tripPlanningService.getTripExpenses(req.user.userId, itineraryId);
    }
    async createTripExpense(req, data) {
        return this.tripPlanningService.createTripExpense(req.user.userId, data);
    }
    async deleteTripExpense(req, id) {
        return this.tripPlanningService.deleteTripExpense(req.user.userId, id);
    }
    async getPackingLists(req, itineraryId) {
        return this.tripPlanningService.getPackingLists(req.user.userId, itineraryId);
    }
    async createPackingList(req, data) {
        return this.tripPlanningService.createPackingList(req.user.userId, data);
    }
    async updatePackingList(req, id, data) {
        return this.tripPlanningService.updatePackingList(req.user.userId, id, data);
    }
    async deletePackingList(req, id) {
        return this.tripPlanningService.deletePackingList(req.user.userId, id);
    }
    async getTravelDocuments(req, itineraryId) {
        return this.tripPlanningService.getTravelDocuments(req.user.userId, itineraryId);
    }
    async createTravelDocument(req, data) {
        return this.tripPlanningService.createTravelDocument(req.user.userId, data);
    }
    async deleteTravelDocument(req, id) {
        return this.tripPlanningService.deleteTravelDocument(req.user.userId, id);
    }
};
exports.TripPlanningController = TripPlanningController;
__decorate([
    (0, common_1.Get)('itineraries'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "getItineraries", null);
__decorate([
    (0, common_1.Get)('itineraries/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "getItinerary", null);
__decorate([
    (0, common_1.Post)('itineraries'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "createItinerary", null);
__decorate([
    (0, common_1.Put)('itineraries/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "updateItinerary", null);
__decorate([
    (0, common_1.Delete)('itineraries/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "deleteItinerary", null);
__decorate([
    (0, common_1.Get)('expenses'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('itineraryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "getTripExpenses", null);
__decorate([
    (0, common_1.Post)('expenses'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "createTripExpense", null);
__decorate([
    (0, common_1.Delete)('expenses/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "deleteTripExpense", null);
__decorate([
    (0, common_1.Get)('packing-lists'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('itineraryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "getPackingLists", null);
__decorate([
    (0, common_1.Post)('packing-lists'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "createPackingList", null);
__decorate([
    (0, common_1.Put)('packing-lists/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "updatePackingList", null);
__decorate([
    (0, common_1.Delete)('packing-lists/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "deletePackingList", null);
__decorate([
    (0, common_1.Get)('documents'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('itineraryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "getTravelDocuments", null);
__decorate([
    (0, common_1.Post)('documents'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "createTravelDocument", null);
__decorate([
    (0, common_1.Delete)('documents/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TripPlanningController.prototype, "deleteTravelDocument", null);
exports.TripPlanningController = TripPlanningController = __decorate([
    (0, common_1.Controller)('trip-planning'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [trip_planning_service_1.TripPlanningService])
], TripPlanningController);
//# sourceMappingURL=trip-planning.controller.js.map