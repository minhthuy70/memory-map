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
exports.SocialService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SocialService = class SocialService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getReactions(memoryId) {
        return this.prisma.memoryReaction.findMany({
            where: { memoryId },
            include: { user: { select: { id: true, username: true, avatarUrl: true } } },
        });
    }
    async addReaction(userId, memoryId, reactionType) {
        const existing = await this.prisma.memoryReaction.findUnique({
            where: {
                userId_memoryId_reactionType: {
                    userId,
                    memoryId,
                    reactionType,
                },
            },
        });
        if (existing) {
            return this.prisma.memoryReaction.delete({
                where: { id: existing.id },
            });
        }
        return this.prisma.memoryReaction.create({
            data: {
                user: { connect: { id: userId } },
                memoryId,
                reactionType,
            },
        });
    }
    async getComments(memoryId) {
        return this.prisma.memoryComment.findMany({
            where: { memoryId, parentId: null },
            include: {
                user: { select: { id: true, username: true, avatarUrl: true } },
                replies: {
                    include: {
                        user: { select: { id: true, username: true, avatarUrl: true } },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createComment(userId, memoryId, content, parentId) {
        return this.prisma.memoryComment.create({
            data: {
                user: { connect: { id: userId } },
                memoryId,
                parentId,
                content,
            },
        });
    }
    async deleteComment(userId, id) {
        const comment = await this.prisma.memoryComment.findUnique({
            where: { id },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        if (comment.userId !== userId) {
            throw new common_1.NotFoundException('Access denied');
        }
        return this.prisma.memoryComment.delete({
            where: { id },
        });
    }
    async getCircles(userId) {
        return this.prisma.memoryCircle.findMany({
            where: { userId },
            include: {
                members: {
                    include: {
                        user: { select: { id: true, username: true, avatarUrl: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createCircle(userId, data) {
        const circle = await this.prisma.memoryCircle.create({
            data: {
                user: { connect: { id: userId } },
                name: data.name,
                description: data.description,
                isPublic: data.isPublic ?? false,
            },
        });
        await this.prisma.circleMember.create({
            data: {
                circle: { connect: { id: circle.id } },
                user: { connect: { id: userId } },
                role: 'admin',
            },
        });
        return circle;
    }
    async addCircleMember(circleId, userId, newMemberId) {
        const member = await this.prisma.circleMember.findFirst({
            where: { circleId, userId, role: 'admin' },
        });
        if (!member) {
            throw new common_1.NotFoundException('Only admins can add members');
        }
        return this.prisma.circleMember.create({
            data: {
                circle: { connect: { id: circleId } },
                user: { connect: { id: newMemberId } },
                role: 'member',
            },
        });
    }
    async getSharedAlbums(userId) {
        return this.prisma.sharedAlbum.findMany({
            where: {
                OR: [
                    { circle: { members: { some: { userId } } } },
                    { contributors: { some: { userId } } },
                ],
            },
            include: {
                circle: true,
                contributors: {
                    include: {
                        user: { select: { id: true, username: true, avatarUrl: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createSharedAlbum(userId, data) {
        const album = await this.prisma.sharedAlbum.create({
            data: {
                circleId: data.circleId,
                title: data.title,
                description: data.description,
                isPublic: data.isPublic ?? false,
            },
        });
        await this.prisma.albumContributor.create({
            data: {
                album: { connect: { id: album.id } },
                user: { connect: { id: userId } },
                permission: 'admin',
            },
        });
        return album;
    }
    async addAlbumContributor(albumId, userId, newContributorId, permission) {
        const contributor = await this.prisma.albumContributor.findFirst({
            where: { albumId, userId, permission: 'admin' },
        });
        if (!contributor) {
            throw new common_1.NotFoundException('Only admins can add contributors');
        }
        return this.prisma.albumContributor.create({
            data: {
                album: { connect: { id: albumId } },
                user: { connect: { id: newContributorId } },
                permission,
            },
        });
    }
};
exports.SocialService = SocialService;
exports.SocialService = SocialService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SocialService);
//# sourceMappingURL=social.service.js.map