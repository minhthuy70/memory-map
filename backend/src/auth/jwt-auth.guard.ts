import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request>();

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing authorization token',
      );
    }

    const token = authHeader.substring(7);

    try {
      const payload = await this.jwtService.verifyAsync(token);

      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Verify session in database (guarantees revocation and logout-from-all-devices works immediately)
      const session = await this.sessionsService.findByToken(token);
      if (!session) {
        throw new UnauthorizedException('Phiên đăng nhập không tồn tại hoặc đã bị thu hồi.');
      }

      if (new Date() > session.expiresAt) {
        throw new UnauthorizedException('Phiên đăng nhập đã hết hạn.');
      }

      // Update lastActivity timestamp for session
      await this.sessionsService.updateLastActivity(token);

      request['user'] = user;
      request['session'] = session;

      return true;
    } catch (err: any) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException(
        'Invalid or expired token',
      );
    }
  }
}