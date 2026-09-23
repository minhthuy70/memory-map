import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly usersService;
    private readonly sessionsService;
    private readonly reflector?;
    constructor(jwtService: JwtService, usersService: UsersService, sessionsService: SessionsService, reflector?: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
