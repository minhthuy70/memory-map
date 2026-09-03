import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly usersService;
    private readonly sessionsService;
    constructor(jwtService: JwtService, usersService: UsersService, sessionsService: SessionsService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
