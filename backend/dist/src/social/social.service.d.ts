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
        memoryId: string;
        createdAt: Date;
        userId: string;
        reactionType: string;
    })[]>;
    addReaction(userId: string, memoryId: string, reactionType: string): Promise<{
        id: string;
        memoryId: string;
        createdAt: Date;
        userId: string;
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
        memoryId: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        content: string;
        parentId: string | null;
    })[]>;
    createComment(userId: string, memoryId: string, content: string, parentId?: string): Promise<{
        id: string;
        memoryId: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        content: string;
        parentId: string | null;
    }>;
    deleteComment(userId: string, id: string): Promise<{
        id: string;
        memoryId: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
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
            role: string;
            circleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        name: string;
        isPublic: boolean;
        description: string | null;
    })[]>;
    createCircle(userId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        name: string;
        isPublic: boolean;
        description: string | null;
    }>;
    addCircleMember(circleId: string, userId: string, newMemberId: string): Promise<{
        id: string;
        userId: string;
        joinedAt: Date;
        role: string;
        circleId: string;
    }>;
    getSharedAlbums(userId: string): Promise<({
        circle: {
            id: string;
            createdAt: Date;
            userId: string;
            name: string;
            isPublic: boolean;
            description: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        isPublic: boolean;
        title: string;
        description: string | null;
        circleId: string | null;
    })[]>;
    createSharedAlbum(userId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublic: boolean;
        title: string;
        description: string | null;
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
