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
        updatedAt: Date;
        createdAt: Date;
        content: string;
        memoryId: string;
        parentId: string | null;
    })[]>;
    createComment(req: any, data: any): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        createdAt: Date;
        content: string;
        memoryId: string;
        parentId: string | null;
    }>;
    deleteComment(req: any, id: string): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        createdAt: Date;
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
    createCircle(req: any, data: any): Promise<{
        id: string;
        userId: string;
        name: string;
        createdAt: Date;
        description: string | null;
        isPublic: boolean;
    }>;
    addCircleMember(req: any, circleId: string, data: any): Promise<{
        id: string;
        userId: string;
        circleId: string;
        joinedAt: Date;
        role: string;
    }>;
    getSharedAlbums(req: any): Promise<({
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
    createSharedAlbum(req: any, data: any): Promise<{
        id: string;
        updatedAt: Date;
        createdAt: Date;
        title: string;
        description: string | null;
        circleId: string | null;
        isPublic: boolean;
    }>;
    addAlbumContributor(req: any, albumId: string, data: any): Promise<{
        id: string;
        userId: string;
        joinedAt: Date;
        permission: string;
        albumId: string;
    }>;
}
