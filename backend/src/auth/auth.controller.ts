import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
  Headers as NestHeaders,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SessionsService } from '../sessions/sessions.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { OAuthDto } from './dto/oauth.dto';
import { SendVerificationCodeDto, VerifyEmailDto } from './dto/verify-email.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @NestHeaders('user-agent') userAgent?: string,
    @NestHeaders('x-forwarded-for') forwardedFor?: string,
  ) {
    const deviceInfo = userAgent || 'Unknown Device';
    const ipAddress = forwardedFor?.split(',')[0]?.trim() || 'Unknown IP';

    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.name,
      deviceInfo,
      ipAddress,
    );
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @NestHeaders('user-agent') userAgent?: string,
    @NestHeaders('x-forwarded-for') forwardedFor?: string,
  ) {
    const deviceInfo = userAgent || 'Unknown Device';
    const ipAddress = forwardedFor?.split(',')[0]?.trim() || 'Unknown IP';
    
    return this.authService.login(
      loginDto.email,
      loginDto.password,
      deviceInfo,
      ipAddress,
      loginDto.rememberMe,
    );
  }

  @Post('oauth')
  async oauth(
    @Body() oauthDto: OAuthDto,
    @NestHeaders('user-agent') userAgent?: string,
    @NestHeaders('x-forwarded-for') forwardedFor?: string,
  ) {
    const deviceInfo = userAgent || 'Unknown Device';
    const ipAddress = forwardedFor?.split(',')[0]?.trim() || 'Unknown IP';

    return this.authService.handleOAuth(
      oauthDto,
      deviceInfo,
      ipAddress,
    );
  }

  @Post('send-verification-code')
  async sendVerificationCode(
    @Body() dto: SendVerificationCodeDto,
  ) {
    return this.authService.sendVerificationCode(dto.email);
  }

  @Post('verify-email')
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
  ) {
    return this.authService.verifyEmail(dto.email, dto.code);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(
    @Request() req: any,
  ) {
    const user = await this.authService.getProfileWithStats(req.user.id);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(
      req.user.id,
      updateProfileDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      req.user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('deactivate-account')
  async deactivateAccount(
    @Request() req: any,
  ) {
    return this.authService.deactivateAccount(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-account')
  async deleteAccount(
    @Request() req: any,
  ) {
    return this.authService.deleteAccount(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Request() req: any,
    @NestHeaders('authorization') authHeader: string,
  ) {
    const token = authHeader?.replace('Bearer ', '');
    await this.sessionsService.deleteSessionByToken(token);
    return { message: 'Logged out successfully' };
  }
}