import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    email: string;
    passwordHash: string;
    name?: string;
  }) {
    return this.prisma.user.create({
      data,
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
}