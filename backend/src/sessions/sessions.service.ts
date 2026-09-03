import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(
    userId: string,
    token: string,
    deviceInfo?: string,
    ipAddress?: string,
    rememberMe?: boolean,
  ) {
    // 30 days if rememberMe, otherwise 7 days
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

  async findByToken(token: string) {
    return this.prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async updateLastActivity(token: string) {
    return this.prisma.session.update({
      where: { token },
      data: { lastActivity: new Date() },
    });
  }

  async getUserSessions(userId: string) {
    return this.prisma.session.findMany({
      where: { userId },
      orderBy: { lastActivity: 'desc' },
    });
  }

  async deleteSession(sessionId: string) {
    return this.prisma.session.delete({
      where: { id: sessionId },
    });
  }

  async deleteAllUserSessions(userId: string, exceptToken?: string) {
    if (exceptToken) {
      return this.prisma.session.deleteMany({
        where: {
          userId,
          token: { not: exceptToken },
        },
      });
    }
    return this.prisma.session.deleteMany({
      where: { userId },
    });
  }

  async deleteExpiredSessions() {
    return this.prisma.session.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  }

  async deleteSessionByToken(token: string) {
    return this.prisma.session.delete({
      where: { token },
    });
  }
}
