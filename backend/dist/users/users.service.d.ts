import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        email: string;
        passwordHash: string;
        name?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        name: string | null;
        avatar: string | null;
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        name: string | null;
        avatar: string | null;
    }>;
    findById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        name: string | null;
        avatar: string | null;
    }>;
    update(id: string, data: {
        name?: string;
        avatar?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        name: string | null;
        avatar: string | null;
    }>;
    updatePassword(id: string, passwordHash: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        name: string | null;
        avatar: string | null;
    }>;
    getMemoryCount(userId: string): Promise<number>;
}
