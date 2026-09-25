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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const categories = await this.prisma.category.findMany({
            orderBy: {
                createdAt: 'asc',
            },
            include: {
                _count: {
                    select: { memories: true },
                },
            },
        });
        return categories.map((category) => ({
            id: category.id,
            name: category.name,
            icon: category.icon,
            color: category.color,
            createdAt: category.createdAt,
            usageCount: category._count?.memories ?? 0,
        }));
    }
    async findById(id) {
        const category = await this.prisma.category.findUnique({
            where: {
                id,
            },
            include: {
                _count: {
                    select: { memories: true },
                },
            },
        });
        if (!category)
            return null;
        return {
            id: category.id,
            name: category.name,
            icon: category.icon,
            color: category.color,
            createdAt: category.createdAt,
            usageCount: category._count?.memories ?? 0,
        };
    }
    async seedCategories() {
        const categories = [
            {
                name: 'Love',
                icon: '❤️',
                color: '#ef4444',
            },
            {
                name: 'Family',
                icon: '👨‍👩‍👧',
                color: '#3b82f6',
            },
            {
                name: 'Friends',
                icon: '👥',
                color: '#22c55e',
            },
            {
                name: 'Study',
                icon: '🎓',
                color: '#8b5cf6',
            },
            {
                name: 'Work',
                icon: '💼',
                color: '#f59e0b',
            },
            {
                name: 'Travel',
                icon: '✈️',
                color: '#06b6d4',
            },
            {
                name: 'Event',
                icon: '🎉',
                color: '#ec4899',
            },
            {
                name: 'Personal',
                icon: '🌱',
                color: '#10b981',
            },
            {
                name: 'Other',
                icon: '⭐',
                color: '#6b7280',
            },
        ];
        const results = [];
        for (const category of categories) {
            const result = await this.prisma.category.upsert({
                where: {
                    name: category.name,
                },
                update: {
                    icon: category.icon,
                    color: category.color,
                },
                create: {
                    name: category.name,
                    icon: category.icon,
                    color: category.color,
                },
            });
            results.push(result);
        }
        return results;
    }
    async create(createCategoryDto) {
        const existingCategory = await this.prisma.category.findUnique({
            where: { name: createCategoryDto.name },
        });
        if (existingCategory) {
            throw new common_1.ConflictException('Danh mục với tên này đã tồn tại');
        }
        const category = await this.prisma.category.create({
            data: {
                name: createCategoryDto.name,
                icon: createCategoryDto.icon,
                color: createCategoryDto.color || '#6366f1',
            },
        });
        return {
            id: category.id,
            name: category.name,
            icon: category.icon,
            color: category.color,
            createdAt: category.createdAt,
            usageCount: 0,
        };
    }
    async update(id, updateCategoryDto) {
        const existingCategory = await this.prisma.category.findUnique({
            where: { id },
        });
        if (!existingCategory) {
            throw new common_1.NotFoundException('Không tìm thấy danh mục');
        }
        if (updateCategoryDto.name && updateCategoryDto.name !== existingCategory.name) {
            const nameConflict = await this.prisma.category.findUnique({
                where: { name: updateCategoryDto.name },
            });
            if (nameConflict) {
                throw new common_1.ConflictException('Danh mục với tên này đã tồn tại');
            }
        }
        const category = await this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
            include: {
                _count: {
                    select: { memories: true },
                },
            },
        });
        return {
            id: category.id,
            name: category.name,
            icon: category.icon,
            color: category.color,
            createdAt: category.createdAt,
            usageCount: category._count?.memories ?? 0,
        };
    }
    async delete(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { memories: true },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Không tìm thấy danh mục');
        }
        if (category._count?.memories > 0) {
            throw new common_1.ConflictException(`Không thể xóa danh mục này vì còn ${category._count.memories} kỷ niệm đang sử dụng`);
        }
        await this.prisma.category.delete({
            where: { id },
        });
        return { message: 'Danh mục đã được xóa thành công' };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map