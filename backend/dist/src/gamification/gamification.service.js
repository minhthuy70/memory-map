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
exports.GamificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GamificationService = class GamificationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserStats(userId) {
        let stats = await this.prisma.userStats.findUnique({
            where: { userId },
        });
        if (!stats) {
            stats = await this.prisma.userStats.create({
                data: {
                    userId,
                    xp: 0,
                    level: 1,
                    totalMemories: 0,
                    totalPhotos: 0,
                    totalDistance: 0,
                    locationsVisited: 0,
                    streakDays: 0,
                    longestStreak: 0,
                },
            });
        }
        return stats;
    }
    async addXP(userId, amount) {
        const stats = await this.getUserStats(userId);
        const newXP = stats.xp + amount;
        const newLevel = Math.floor(newXP / 100) + 1;
        return this.prisma.userStats.update({
            where: { userId },
            data: {
                xp: newXP,
                level: newLevel,
            },
        });
    }
    async updateMemoryCount(userId) {
        const stats = await this.getUserStats(userId);
        return this.prisma.userStats.update({
            where: { userId },
            data: {
                totalMemories: { increment: 1 },
            },
        });
    }
    async getBadges(userId) {
        return this.prisma.badge.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createBadge(userId, badgeType, badgeName, target) {
        return this.prisma.badge.create({
            data: {
                user: { connect: { id: userId } },
                badgeType,
                badgeName,
                rarity: 'bronze',
                progress: 0,
                target,
            },
        });
    }
    async updateBadgeProgress(badgeId, increment) {
        const badge = await this.prisma.badge.findUnique({
            where: { id: badgeId },
        });
        if (!badge) {
            throw new common_1.NotFoundException('Badge not found');
        }
        const newProgress = Math.min(badge.progress + increment, badge.target);
        const isUnlocked = newProgress >= badge.target && !badge.unlockedAt;
        const updateData = { progress: newProgress };
        if (isUnlocked) {
            updateData.unlockedAt = new Date();
            if (badge.target >= 100)
                updateData.rarity = 'platinum';
            else if (badge.target >= 50)
                updateData.rarity = 'gold';
            else if (badge.target >= 20)
                updateData.rarity = 'silver';
        }
        return this.prisma.badge.update({
            where: { id: badgeId },
            data: updateData,
        });
    }
    async getJournalingStreak(userId) {
        let streak = await this.prisma.journalingStreak.findUnique({
            where: { userId },
        });
        if (!streak) {
            streak = await this.prisma.journalingStreak.create({
                data: {
                    userId,
                    currentStreak: 0,
                    longestStreak: 0,
                    freezeTokens: 3,
                    milestones: '[]',
                },
            });
        }
        return streak;
    }
    async recordJournalEntry(userId) {
        const streak = await this.getJournalingStreak(userId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastJournalDate = streak.lastJournalDate
            ? new Date(streak.lastJournalDate)
            : null;
        lastJournalDate?.setHours(0, 0, 0, 0);
        const daysDiff = lastJournalDate
            ? Math.floor((today.getTime() - lastJournalDate.getTime()) / (1000 * 60 * 60 * 24))
            : 1;
        let newStreak = streak.currentStreak;
        if (daysDiff === 1) {
            newStreak += 1;
        }
        else if (daysDiff > 1) {
            if (streak.freezeTokens > 0) {
                await this.prisma.journalingStreak.update({
                    where: { userId },
                    data: { freezeTokens: { decrement: 1 } },
                });
            }
            else {
                newStreak = 1;
            }
        }
        else if (daysDiff === 0) {
            return streak;
        }
        const newLongestStreak = Math.max(newStreak, streak.longestStreak);
        const milestones = JSON.parse(streak.milestones || '[]');
        if (newStreak === 7 && !milestones.includes('7'))
            milestones.push('7');
        if (newStreak === 30 && !milestones.includes('30'))
            milestones.push('30');
        if (newStreak === 100 && !milestones.includes('100'))
            milestones.push('100');
        if (newStreak === 365 && !milestones.includes('365'))
            milestones.push('365');
        return this.prisma.journalingStreak.update({
            where: { userId },
            data: {
                currentStreak: newStreak,
                longestStreak: newLongestStreak,
                lastJournalDate: today,
                milestones: JSON.stringify(milestones),
            },
        });
    }
    async getPassportStamps(userId) {
        return this.prisma.passportStamp.findMany({
            where: { userId },
            orderBy: { stampDate: 'desc' },
        });
    }
    async addPassportStamp(userId, country, city, province) {
        const existing = await this.prisma.passportStamp.findFirst({
            where: {
                userId,
                city,
                province,
            },
        });
        if (existing) {
            return existing;
        }
        return this.prisma.passportStamp.create({
            data: {
                user: { connect: { id: userId } },
                country,
                city,
                province,
                stampDesign: `${country.toLowerCase()}_vintage`,
            },
        });
    }
    async getBingoChallenge(year) {
        let challenge = await this.prisma.bingoChallenge.findFirst({
            where: { year },
        });
        if (!challenge) {
            const defaultChallenges = [
                'Watch sunrise at sea',
                'Camp under stars',
                'Try street food',
                'Sleep in sleeper train',
                'Visit a museum',
                'Hike a mountain',
                'Swim in the ocean',
                'Visit a new city',
                'Take a road trip',
                'Visit a national park',
                'Watch sunset at beach',
                'Try local cuisine',
                'Visit a historical site',
                'Go on a boat ride',
                'Visit a market',
                'Take a cooking class',
                'Visit a festival',
                'Go camping',
                'Visit a landmark',
                'Take a night walk',
                'Visit a botanical garden',
                'Go bird watching',
                'Visit a zoo',
                'Go fishing',
                'Visit a castle',
            ];
            challenge = await this.prisma.bingoChallenge.create({
                data: {
                    year,
                    challenges: JSON.stringify(defaultChallenges),
                    isActive: true,
                },
            });
        }
        return challenge;
    }
    async getBingoCompletion(userId, year) {
        const challenge = await this.getBingoChallenge(year);
        let completion = await this.prisma.bingoCompletion.findUnique({
            where: {
                userId_challengeId: {
                    userId,
                    challengeId: challenge.id,
                },
            },
        });
        if (!completion) {
            completion = await this.prisma.bingoCompletion.create({
                data: {
                    user: { connect: { id: userId } },
                    challengeId: challenge.id,
                    completedIndices: '[]',
                },
            });
        }
        return { challenge, completion };
    }
    async completeBingoItem(userId, year, index) {
        const { challenge, completion } = await this.getBingoCompletion(userId, year);
        const completedIndices = JSON.parse(completion.completedIndices || '[]');
        if (completedIndices.includes(index)) {
            return completion;
        }
        completedIndices.push(index);
        const updated = await this.prisma.bingoCompletion.update({
            where: { id: completion.id },
            data: {
                completedIndices: JSON.stringify(completedIndices),
            },
        });
        const isBingo = this.checkBingo(completedIndices);
        if (isBingo && !completion.completedAt) {
            await this.prisma.bingoCompletion.update({
                where: { id: completion.id },
                data: { completedAt: new Date() },
            });
        }
        return updated;
    }
    checkBingo(indices) {
        return indices.length >= 5;
    }
    async getVirtualSouvenirs(userId) {
        return this.prisma.virtualSouvenir.findMany({
            where: { userId },
            orderBy: { position: 'asc' },
        });
    }
    async unlockSouvenir(userId, name, type, location) {
        return this.prisma.virtualSouvenir.create({
            data: {
                user: { connect: { id: userId } },
                name,
                type,
                location,
            },
        });
    }
    async updateSouvenirPosition(id, userId, position) {
        const souvenir = await this.prisma.virtualSouvenir.findUnique({
            where: { id },
        });
        if (!souvenir) {
            throw new common_1.NotFoundException('Souvenir not found');
        }
        if (souvenir.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.virtualSouvenir.update({
            where: { id },
            data: { position },
        });
    }
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GamificationService);
//# sourceMappingURL=gamification.service.js.map