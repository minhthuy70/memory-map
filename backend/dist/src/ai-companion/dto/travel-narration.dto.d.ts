export declare enum NarrationTone {
    HUMOROUS = "humorous",
    POETIC = "poetic",
    ADVENTUROUS = "adventurous",
    NEUTRAL = "neutral"
}
export declare class CreateTravelNarrationDto {
    routeData: string;
    tone: NarrationTone;
    tripId?: string;
}
export declare class UpdateTravelNarrationDto {
    routeData?: string;
    tone?: NarrationTone;
    content?: string;
}
