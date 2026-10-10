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
        userId: string;
        createdAt: Date;
        memoryId: string;
        reactionType: string;
    })[]>;
    addReaction(req: any, data: any): Promise<{
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
    createComment(req: any, data: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        memoryId: string;
        content: string;
        parentId: string | null;
    }>;
    deleteComment(req: any, id: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        memoryId: string;
        content: string;
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
        userId: string;
        description: string | null;
        isPublic: boolean;
        createdAt: Date;
        name: string;
    })[]>;
    createCircle(req: any, data: any): Promise<{
        id: string;
        userId: string;
        description: string | null;
        isPublic: boolean;
        createdAt: Date;
        name: string;
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
    createSharedAlbum(req: any, data: any): Promise<{
        id: string;
        title: string;
        description: string | null;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
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
