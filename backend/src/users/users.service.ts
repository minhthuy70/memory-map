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
        pendingEmail: null,
      },
    });
  }

  /** Store the requested new email so confirmEmailChange can read it from DB (not from request body). */
  async setPendingEmail(userId: string, pendingEmail: string | null, code: string | null, expires: Date | null) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        pendingEmail,
        verificationCode: code,
        verificationExpires: expires,
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

  async setTwoFactorTempSecret(userId: string, tempSecret: string | null) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorTempSecret: tempSecret },
    });
  }

  async enableTwoFactor(userId: string, secret: string, backupCodes: string[]) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
        twoFactorTempSecret: null,
        twoFactorBackupCodes: backupCodes,
        twoFactorLastUsed: new Date(),
      },
    });
  }

  async disableTwoFactor(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorTempSecret: null,
        twoFactorBackupCodes: [],
      },
    });
  }

  async updateTwoFactorBackupCodes(userId: string, backupCodes: string[]) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorBackupCodes: backupCodes,
      },
    });
  }

  async updateTwoFactorLastUsed(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorLastUsed: new Date(),
      },
    });
  }

  // WEBAUTHN / BIOMETRIC CREDENTIALS
  async addWebAuthnCredential(
    userId: string,
    data: {
      credentialId: string;
      publicKey: Buffer;
      counter: bigint;
      deviceType: string;
      backedUp: boolean;
      transports: string[];
      deviceName?: string;
    },
  ) {
    const cred = await this.prisma.webAuthnCredential.create({
      data: {
        userId,
        credentialId: data.credentialId,
        publicKey: data.publicKey,
        counter: data.counter,
        deviceType: data.deviceType,
        backedUp: data.backedUp,
        transports: data.transports,
        deviceName: data.deviceName || 'Thiết bị sinh trắc học',
        lastUsedAt: new Date(),
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { biometricEnabled: true },
    });

    return cred;
  }

  async getWebAuthnCredentials(userId: string) {
    return this.prisma.webAuthnCredential.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        credentialId: true,
        deviceType: true,
        backedUp: true,
        transports: true,
        deviceName: true,
        createdAt: true,
        lastUsedAt: true,
      },
    });
  }

  async findWebAuthnCredential(credentialId: string) {
    return this.prisma.webAuthnCredential.findUnique({
      where: { credentialId },
      include: {
        user: true,
      },
    });
  }

  async updateWebAuthnCounter(id: string, counter: bigint) {
    return this.prisma.webAuthnCredential.update({
      where: { id },
      data: {
        counter,
        lastUsedAt: new Date(),
      },
    });
  }

  async deleteWebAuthnCredential(userId: string, credentialDbId: string) {
    const cred = await this.prisma.webAuthnCredential.findFirst({
      where: { id: credentialDbId, userId },
    });

    if (!cred) return null;

    await this.prisma.webAuthnCredential.delete({
      where: { id: credentialDbId },
    });

    // Check if user still has credentials
    const remaining = await this.prisma.webAuthnCredential.count({
      where: { userId },
    });

    if (remaining === 0) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { biometricEnabled: false },
      });
    }

    return cred;
  }

  async setBiometricEnabled(userId: string, enabled: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { biometricEnabled: enabled },
    });
  }
}