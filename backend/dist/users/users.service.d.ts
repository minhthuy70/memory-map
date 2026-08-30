import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        email: string;
        passwordHash: string;
        name?: string;
    }): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        name: string | null;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        name: string | null;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findById(id: string): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        name: string | null;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: {
        name?: string;
        avatar?: string;
    }): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        name: string | null;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
