import { SocialService } from './social.service';
export declare class SocialController {
    private readonly socialService;
    constructor(socialService: SocialService);
    getReactions(memoryId: string): Promise<({
        user: {
            id: string;
            username: never;
            avatarUrl: never;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        memoryId: string;
        reactionType: string;
    })[]>;
    addReaction(req: any, data: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
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
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        memoryId: string;
        parentId: string | null;
    })[]>;
    createComment(req: any, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        memoryId: string;
        parentId: string | null;
    }>;
    deleteComment(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
        memoryId: string;
        parentId: string | null;
    }>;
    getCircles(req: any): Promise<({
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
        name: string;
        createdAt: Date;
        userId: string;
        isPublic: boolean;
        description: string | null;
    })[]>;
    createCircle(req: any, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        userId: string;
        isPublic: boolean;
        description: string | null;
    }>;
    addCircleMember(req: any, circleId: string, data: any): Promise<{
        id: string;
        userId: string;
        joinedAt: Date;
        circleId: string;
        role: string;
    }>;
    getSharedAlbums(req: any): Promise<({
        circle: {
            id: string;
            name: string;
            createdAt: Date;
            userId: string;
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
    createSharedAlbum(req: any, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublic: boolean;
        title: string;
        description: string | null;
        circleId: string | null;
    }>;
    addAlbumContributor(req: any, albumId: string, data: any): Promise<{
        id: string;
        userId: string;
        joinedAt: Date;
        permission: string;
        albumId: string;
    }>;
}
