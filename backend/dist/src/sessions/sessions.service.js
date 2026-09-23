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
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SessionsService = class SessionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSession(userId, token, deviceInfo, ipAddress, rememberMe) {
        const duration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
        const expiresAt = new Date(Date.now() + duration);
        return this.prisma.session.create({
            data: {
                userId,
                token,
                deviceInfo,
                ipAddress,
                expiresAt,
            },
        });
    }
    async findByToken(token) {
        return this.prisma.session.findUnique({
            where: { token },
            include: { user: true },
        });
    }
    async updateLastActivity(token) {
        return this.prisma.session.update({
            where: { token },
            data: { lastActivity: new Date() },
        });
    }
    async getUserSessions(userId) {
        return this.prisma.session.findMany({
            where: { userId },
            orderBy: { lastActivity: 'desc' },
        });
    }
    async deleteSession(sessionId, userId) {
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException('Phiên đăng nhập không tồn tại');
        }
        if (session.userId !== userId) {
            throw new common_1.ForbiddenException('Bạn không có quyền thu hồi phiên đăng nhập này');
        }
        await this.prisma.session.delete({
            where: { id: sessionId },
        });
        return { message: 'Đã thu hồi phiên đăng nhập thành công' };
    }
    async deleteAllUserSessions(userId, exceptToken) {
        if (exceptToken) {
            const result = await this.prisma.session.deleteMany({
                where: {
                    userId,
                    token: { not: exceptToken },
                },
            });
            return {
                message: 'Đã đăng xuất khỏi các thiết bị khác thành công',
                count: result.count,
            };
        }
        const result = await this.prisma.session.deleteMany({
            where: { userId },
        });
        return {
            message: 'Đã đăng xuất khỏi tất cả các thiết bị thành công',
            count: result.count,
        };
    }
    async deleteExpiredSessions() {
        return this.prisma.session.deleteMany({
            where: {
                expiresAt: { lt: new Date() },
            },
        });
    }
    async deleteSessionByToken(token) {
        if (!token)
            return { count: 0 };
        try {
            return await this.prisma.session.deleteMany({
                where: { token },
            });
        }
        catch {
            return { count: 0 };
        }
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map