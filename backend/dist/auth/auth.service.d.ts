import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        name: string | null;
        avatar: string | null;
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
        };
    }>;
    register(email: string, password: string, name?: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
        };
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        name: string | null;
        avatar: string | null;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    getProfileWithStats(userId: string): Promise<{
        memoryCount: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        name: string | null;
        avatar: string | null;
    }>;
}
