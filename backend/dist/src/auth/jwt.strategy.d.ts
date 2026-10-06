import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private usersService;
    constructor(configService: ConfigService, usersService: UsersService);
    validate(payload: any): Promise<{
        id: string;
        createdAt: Date;
        name: string | null;
        email: string;
        facebookId: string | null;
        googleId: string | null;
        resetPasswordToken: string | null;
        avatar: string | null;
        updatedAt: Date;
        lockedUntil: Date | null;
        loginAttempts: number;
        isActive: boolean;
        lastLoginAt: Date | null;
        isEmailVerified: boolean;
        verificationCode: string | null;
        verificationExpires: Date | null;
        resetPasswordExpires: Date | null;
        pendingEmail: string | null;
        twoFactorEnabled: boolean;
        twoFactorSecret: string | null;
        twoFactorTempSecret: string | null;
        twoFactorBackupCodes: string[];
        twoFactorLastUsed: Date | null;
        biometricEnabled: boolean;
    }>;
}
export {};
