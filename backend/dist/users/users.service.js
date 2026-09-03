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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.user.create({
            data,
        });
    }
    async findByGoogleId(googleId) {
        return this.prisma.user.findUnique({
            where: { googleId },
        });
    }
    async findByFacebookId(facebookId) {
        return this.prisma.user.findUnique({
            where: { facebookId },
        });
    }
    async setVerificationCode(email, code, expires) {
        return this.prisma.user.update({
            where: { email },
            data: {
                verificationCode: code,
                verificationExpires: expires,
            },
        });
    }
    async markEmailVerified(userId) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                isEmailVerified: true,
                verificationCode: null,
                verificationExpires: null,
            },
        });
    }
    async setResetPasswordToken(email, token, expires) {
        return this.prisma.user.update({
            where: { email },
            data: {
                resetPasswordToken: token,
                resetPasswordExpires: expires,
            },
        });
    }
    async findByResetToken(token) {
        return this.prisma.user.findUnique({
            where: { resetPasswordToken: token },
        });
    }
    async resetPasswordWithToken(userId, passwordHash) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                passwordHash,
                resetPasswordToken: null,
                resetPasswordExpires: null,
                loginAttempts: 0,
                lockedUntil: null,
            },
        });
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
    async findById(id) {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }
    async update(id, data) {
        return this.prisma.user.update({
            where: {
                id,
            },
            data,
        });
    }
    async updatePassword(id, passwordHash) {
        return this.prisma.user.update({
            where: {
                id,
            },
            data: {
                passwordHash,
            },
        });
    }
    async getMemoryCount(userId) {
        return this.prisma.memory.count({
            where: {
                userId,
            },
        });
    }
    async incrementLoginAttempts(userId) {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                loginAttempts: {
                    increment: 1,
                },
            },
        });
    }
    async resetLoginAttempts(userId) {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                loginAttempts: 0,
                lockedUntil: null,
            },
        });
    }
    async lockAccount(userId, lockedUntil) {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                lockedUntil,
            },
        });
    }
    async updateLastLogin(userId) {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                lastLoginAt: new Date(),
            },
        });
    }
    async deactivateAccount(userId) {
        return this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                isActive: false,
            },
        });
    }
    async deleteAccount(userId) {
        return this.prisma.user.delete({
            where: {
                id: userId,
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map