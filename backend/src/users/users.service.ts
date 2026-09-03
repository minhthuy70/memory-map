import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    email: string;
    passwordHash?: string;
    name?: string;
    avatar?: string;
    googleId?: string;
    facebookId?: string;
    isEmailVerified?: boolean;
  }) {
    return this.prisma.user.create({
      data,
    });
  }

  async findByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({
      where: { googleId },
    });
  }

  async findByFacebookId(facebookId: string) {
    return this.prisma.user.findUnique({
      where: { facebookId },
    });
  }

  async setVerificationCode(email: string, code: string, expires: Date) {
    return this.prisma.user.update({
      where: { email },
      data: {
        verificationCode: code,
        verificationExpires: expires,
      },
    });
  }

  async markEmailVerified(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        isEmailVerified: true,
        verificationCode: null,
        verificationExpires: null,
      },
    });
  }

  async updateEmail(userId: string, newEmail: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
        isEmailVerified: true,
        verificationCode: null,
        verificationExpires: null,
      },
    });
  }

  async setResetPasswordToken(email: string, token: string, expires: Date) {
    return this.prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });
  }

  async findByResetToken(token: string) {
    return this.prisma.user.findUnique({
      where: { resetPasswordToken: token },
    });
  }

  async resetPasswordWithToken(userId: string, passwordHash: string) {
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

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      avatar?: string;
    },
  ) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async updatePassword(
    id: string,
    passwordHash: string,
  ) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        passwordHash,
      },
    });
  }

  async getMemoryCount(userId: string) {
    return this.prisma.memory.count({
      where: {
        userId,
      },
    });
  }

  async incrementLoginAttempts(userId: string) {
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

  async resetLoginAttempts(userId: string) {
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

  async lockAccount(userId: string, lockedUntil: Date) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        lockedUntil,
      },
    });
  }

  async updateLastLogin(userId: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });
  }

  async deactivateAccount(userId: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isActive: false,
      },
    });
  }

  async deleteAccount(userId: string) {
    return this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}