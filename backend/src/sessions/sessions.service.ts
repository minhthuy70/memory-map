import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

  async deleteSession(sessionId: string, userId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Phiên đăng nhập không tồn tại');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền thu hồi phiên đăng nhập này');
    }

    await this.prisma.session.delete({
      where: { id: sessionId },
    });

    return { message: 'Đã thu hồi phiên đăng nhập thành công' };
  }

  async deleteAllUserSessions(userId: string, exceptToken?: string) {
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

  async deleteSessionByToken(token: string) {
    if (!token) return { count: 0 };
    try {
      return await this.prisma.session.deleteMany({
        where: { token },
      });
    } catch {
      return { count: 0 };
    }
  }
}
