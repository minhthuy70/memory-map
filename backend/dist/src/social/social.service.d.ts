import { PrismaService } from '../prisma/prisma.service';
export declare class SocialService {
    private prisma;
    constructor(prisma: PrismaService);
    getReactions(memoryId: string): Promise<({
        user: {
            id: string;
            username: never;
            avatarUrl: never;
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        reactionType: string;
    })[]>;
    addReaction(userId: string, memoryId: string, reactionType: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        reactionType: string;
    }>;
    getComments(memoryId: string): Promise<({
        user: {
            id: string;
            username: never;
            avatarUrl: never;
        };
        replies: never;
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        memoryId: string;
        content: string;
        parentId: string | null;
    })[]>;
    createComment(userId: string, memoryId: string, content: string, parentId?: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        memoryId: string;
        content: string;
        parentId: string | null;
    }>;
    deleteComment(userId: string, id: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        memoryId: string;
        content: string;
        parentId: string | null;
    }>;
    getCircles(userId: string): Promise<({
        members: ({
            user: {
                id: string;
                username: never;
                avatarUrl: never;
            };
        } & {
            id: string;
            userId: string;
            joinedAt: Date;
            circleId: string;
            role: string;
        })[];
    } & {
        id: string;
        userId: string;
        description: string | null;
        isPublic: boolean;
        createdAt: Date;
        name: string;
    })[]>;
    createCircle(userId: string, data: any): Promise<{
        id: string;
        userId: string;
        description: string | null;
        isPublic: boolean;
        createdAt: Date;
        name: string;
    }>;
    addCircleMember(circleId: string, userId: string, newMemberId: string): Promise<{
        id: string;
        userId: string;
        joinedAt: Date;
        circleId: string;
        role: string;
    }>;
    getSharedAlbums(userId: string): Promise<({
        circle: {
            id: string;
            userId: string;
            description: string | null;
            isPublic: boolean;
            createdAt: Date;
            name: string;
        };
        contributors: ({
            user: {
                id: string;
                username: never;
                avatarUrl: never;
            };
        } & {
            id: string;
            userId: string;
            joinedAt: Date;
            permission: string;
            albumId: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
        circleId: string | null;
    })[]>;
    createSharedAlbum(userId: string, data: any): Promise<{
        id: string;
        title: string;
        description: string | null;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
        circleId: string | null;
    }>;
    addAlbumContributor(albumId: string, userId: string, newContributorId: string, permission: string): Promise<{
        id: string;
        userId: string;
        joinedAt: Date;
        permission: string;
        albumId: string;
    }>;
}
