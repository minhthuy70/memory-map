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
    async getStories(userId) {
        return this.prisma.memoryStory.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createStory(userId, dto) {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        return this.prisma.memoryStory.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
                expiresAt,
            },
        });
    }
    async updateStory(id, userId, dto) {
        const story = await this.prisma.memoryStory.findUnique({ where: { id } });
        if (!story || story.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.memoryStory.update({ where: { id }, data: dto });
    }
    async deleteStory(id, userId) {
        const story = await this.prisma.memoryStory.findUnique({ where: { id } });
        if (!story || story.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.memoryStory.delete({ where: { id } });
    }
    async getCommunityFeeds(userId) {
        return this.prisma.communityMapFeed.findMany({
            where: { userId },
            orderBy: { popularity: 'desc' },
        });
    }
    async createCommunityFeed(userId, dto) {
        return this.prisma.communityMapFeed.create({
            data: { user: { connect: { id: userId } }, ...dto },
        });
    }
    async updateCommunityFeed(id, userId, dto) {
        const feed = await this.prisma.communityMapFeed.findUnique({ where: { id } });
        if (!feed || feed.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.communityMapFeed.update({ where: { id }, data: dto });
    }
    async deleteCommunityFeed(id, userId) {
        const feed = await this.prisma.communityMapFeed.findUnique({ where: { id } });
        if (!feed || feed.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.communityMapFeed.delete({ where: { id } });
    }
    async getNearbyPings(userId) {
        return this.prisma.nearbyFriendsPing.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createNearbyPing(userId, dto) {
        return this.prisma.nearbyFriendsPing.create({
            data: { user: { connect: { id: userId } }, ...dto },
        });
    }
    async updateNearbyPing(id, userId, dto) {
        const ping = await this.prisma.nearbyFriendsPing.findUnique({ where: { id } });
        if (!ping || ping.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.nearbyFriendsPing.update({ where: { id }, data: dto });
    }
    async deleteNearbyPing(id, userId) {
        const ping = await this.prisma.nearbyFriendsPing.findUnique({ where: { id } });
        if (!ping || ping.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.nearbyFriendsPing.delete({ where: { id } });
    }
    async getCoPresenceSuggestions(userId) {
        return this.prisma.coPresenceSuggestion.findMany({
            where: { userId },
            orderBy: { suggestedAt: 'desc' },
        });
    }
    async createCoPresenceSuggestion(userId, dto) {
        return this.prisma.coPresenceSuggestion.create({
            data: { user: { connect: { id: userId } }, ...dto },
        });
    }
    async deleteCoPresenceSuggestion(id, userId) {
        const suggestion = await this.prisma.coPresenceSuggestion.findUnique({ where: { id } });
        if (!suggestion || suggestion.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.coPresenceSuggestion.delete({ where: { id } });
    }
    async getExplorationChallenges(userId) {
        return this.prisma.explorationChallenge.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createExplorationChallenge(userId, dto) {
        return this.prisma.explorationChallenge.create({
            data: { user: { connect: { id: userId } }, ...dto },
        });
    }
    async updateExplorationChallenge(id, userId, dto) {
        const challenge = await this.prisma.explorationChallenge.findUnique({ where: { id } });
        if (!challenge || challenge.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        const data = { ...dto };
        if (dto.progress && dto.progress >= challenge.targetCount) {
            data.completedAt = new Date();
        }
        return this.prisma.explorationChallenge.update({ where: { id }, data });
    }
    async deleteExplorationChallenge(id, userId) {
        const challenge = await this.prisma.explorationChallenge.findUnique({ where: { id } });
        if (!challenge || challenge.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.explorationChallenge.delete({ where: { id } });
    }
    async getMemoryContests(userId) {
        return this.prisma.memoryContest.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createMemoryContest(userId, dto) {
        return this.prisma.memoryContest.create({
            data: { user: { connect: { id: userId } }, ...dto, deadline: new Date(dto.deadline), votingEndsAt: new Date(dto.votingEndsAt) },
        });
    }
    async updateMemoryContest(id, userId, dto) {
        const contest = await this.prisma.memoryContest.findUnique({ where: { id } });
        if (!contest || contest.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.memoryContest.update({ where: { id }, data: dto });
    }
    async deleteMemoryContest(id, userId) {
        const contest = await this.prisma.memoryContest.findUnique({ where: { id } });
        if (!contest || contest.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.memoryContest.delete({ where: { id } });
    }
    async getDigitalPostcards(userId) {
        return this.prisma.digitalPostcard.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createDigitalPostcard(userId, dto) {
        return this.prisma.digitalPostcard.create({
            data: { user: { connect: { id: userId } }, ...dto },
        });
    }
    async markPostcardOpened(id) {
        return this.prisma.digitalPostcard.update({
            where: { id },
            data: { openedAt: new Date() },
        });
    }
    async deleteDigitalPostcard(id, userId) {
        const postcard = await this.prisma.digitalPostcard.findUnique({ where: { id } });
        if (!postcard || postcard.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.digitalPostcard.delete({ where: { id } });
    }
    async getMemoryPenpals(userId) {
        return this.prisma.memoryPenpal.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createMemoryPenpal(userId, dto) {
        return this.prisma.memoryPenpal.create({
            data: { user: { connect: { id: userId } }, ...dto },
        });
    }
    async updateMemoryPenpal(id, userId, dto) {
        const penpal = await this.prisma.memoryPenpal.findUnique({ where: { id } });
        if (!penpal || penpal.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.memoryPenpal.update({ where: { id }, data: dto });
    }
    async deleteMemoryPenpal(id, userId) {
        const penpal = await this.prisma.memoryPenpal.findUnique({ where: { id } });
        if (!penpal || penpal.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.memoryPenpal.delete({ where: { id } });
    }
};
exports.SocialService = SocialService;
exports.SocialService = SocialService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SocialService);
//# sourceMappingURL=social.service.js.map