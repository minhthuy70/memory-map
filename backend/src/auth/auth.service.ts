import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

import * as bcrypt from 'bcrypt';

import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ) {
    const user =
      await this.usersService.findByEmail(
        email,
      );

    if (
      user &&
      (await bcrypt.compare(
        password,
        user.passwordHash,
      ))
    ) {
      const {
        passwordHash,
        ...result
      } = user;

      return result;
    }

    return null;
  }

  async login(
    email: string,
    password: string,
  ) {
    const user =
      await this.validateUser(
        email,
        password,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const payload = {
      email: user.email,
      sub: user.id,
    };

    return {
      access_token:
        this.jwtService.sign(payload),

      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  }

  async register(
    email: string,
    password: string,
    name?: string,
  ) {
    const existingUser =
      await this.usersService.findByEmail(
        email,
      );

    if (existingUser) {
      throw new UnauthorizedException(
        'Email already exists',
      );
    }

    const passwordHash =
      await bcrypt.hash(password, 10);

    const user =
      await this.usersService.create({
        email,
        passwordHash,
        name,
      });

    const payload = {
      email: user.email,
      sub: user.id,
    };

    return {
      access_token:
        this.jwtService.sign(payload),

      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const updatedUser = await this.usersService.update(
      userId,
      updateProfileDto,
    );

    const {
      passwordHash,
      ...result
    } = updatedUser;

    return result;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.usersService.updatePassword(
      userId,
      passwordHash,
    );

    return { message: 'Password changed successfully' };
  }

  async getProfileWithStats(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const memoryCount = await this.usersService.getMemoryCount(userId);

    const {
      passwordHash,
      ...result
    } = user;

    return {
      ...result,
      memoryCount,
    };
  }
}