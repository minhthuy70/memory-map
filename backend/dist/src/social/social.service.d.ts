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
        updatedAt: Date;
        createdAt: Date;
        content: string;
        memoryId: string;
        parentId: string | null;
    })[]>;
    createComment(userId: string, memoryId: string, content: string, parentId?: string): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        createdAt: Date;
        content: string;
        memoryId: string;
        parentId: string | null;
    }>;
    deleteComment(userId: string, id: string): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        createdAt: Date;
        content: string;
        memoryId: string;
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
            circleId: string;
            joinedAt: Date;
            role: string;
        })[];
    } & {
        id: string;
        userId: string;
        name: string;
        createdAt: Date;
        description: string | null;
        isPublic: boolean;
    })[]>;
    createCircle(userId: string, data: any): Promise<{
        id: string;
        userId: string;
        name: string;
        createdAt: Date;
        description: string | null;
        isPublic: boolean;
    }>;
    addCircleMember(circleId: string, userId: string, newMemberId: string): Promise<{
        id: string;
        userId: string;
        circleId: string;
        joinedAt: Date;
        role: string;
    }>;
    getSharedAlbums(userId: string): Promise<({
        circle: {
            id: string;
            userId: string;
            name: string;
            createdAt: Date;
            description: string | null;
            isPublic: boolean;
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
        updatedAt: Date;
        createdAt: Date;
        title: string;
        description: string | null;
        circleId: string | null;
        isPublic: boolean;
    })[]>;
    createSharedAlbum(userId: string, data: any): Promise<{
        id: string;
        updatedAt: Date;
        createdAt: Date;
        title: string;
        description: string | null;
        circleId: string | null;
        isPublic: boolean;
    }>;
    addAlbumContributor(albumId: string, userId: string, newContributorId: string, permission: string): Promise<{
        id: string;
        userId: string;
        joinedAt: Date;
        permission: string;
        albumId: string;
    }>;
}
