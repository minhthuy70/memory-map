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
exports.MemoriesController = void 0;
const common_1 = require("@nestjs/common");
const memories_service_1 = require("./memories.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_memory_dto_1 = require("./dto/create-memory.dto");
const update_memory_dto_1 = require("./dto/update-memory.dto");
let MemoriesController = class MemoriesController {
    constructor(memoriesService) {
        this.memoriesService = memoriesService;
    }
    async create(req, createMemoryDto) {
        return this.memoriesService.create(req.user.id, createMemoryDto);
    }
    async findAll(req, categoryId, mood, from, to, search) {
        const filters = {};
        if (categoryId)
            filters.categoryId = categoryId;
        if (mood)
            filters.mood = mood;
        if (from)
            filters.from = new Date(from);
        if (to)
            filters.to = new Date(to);
        if (search)
            filters.search = search;
        return this.memoriesService.findAll(req.user.id, filters);
    }
    async getStatistics(req) {
        return this.memoriesService.getStatistics(req.user.id);
    }
    async findOne(id, req) {
        return this.memoriesService.findOne(id, req.user.id);
    }
    async update(id, req, updateMemoryDto) {
        return this.memoriesService.update(id, req.user.id, updateMemoryDto);
    }
    async delete(id, req) {
        return this.memoriesService.delete(id, req.user.id);
    }
    async addImage(id, req, imageUrl) {
        return this.memoriesService.addImage(id, req.user.id, imageUrl);
    }
    async deleteImage(memoryId, imageId, req) {
        return this.memoriesService.deleteImage(imageId, req.user.id);
    }
    async updateImageOrder(memoryId, imageId, req, order) {
        return this.memoriesService.updateImageOrder(imageId, req.user.id, order);
    }
};
exports.MemoriesController = MemoriesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_memory_dto_1.CreateMemoryDto]),
    __metadata("design:returntype", Promise)
], MemoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('categoryId')),
    __param(2, (0, common_1.Query)('mood')),
    __param(3, (0, common_1.Query)('from')),
    __param(4, (0, common_1.Query)('to')),
    __param(5, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MemoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemoriesController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MemoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_memory_dto_1.UpdateMemoryDto]),
    __metadata("design:returntype", Promise)
], MemoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MemoriesController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/images'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)('imageUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], MemoriesController.prototype, "addImage", null);
__decorate([
    (0, common_1.Delete)(':memoryId/images/:imageId'),
    __param(0, (0, common_1.Param)('memoryId')),
    __param(1, (0, common_1.Param)('imageId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MemoriesController.prototype, "deleteImage", null);
__decorate([
    (0, common_1.Put)(':memoryId/images/:imageId/order'),
    __param(0, (0, common_1.Param)('memoryId')),
    __param(1, (0, common_1.Param)('imageId')),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Body)('order')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Number]),
    __metadata("design:returntype", Promise)
], MemoriesController.prototype, "updateImageOrder", null);
exports.MemoriesController = MemoriesController = __decorate([
    (0, common_1.Controller)('memories'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [memories_service_1.MemoriesService])
], MemoriesController);
//# sourceMappingURL=memories.controller.js.map