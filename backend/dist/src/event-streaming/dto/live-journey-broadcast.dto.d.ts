export declare class CreateLiveJourneyBroadcastDto {
    title: string;
    password?: string;
    beaconMode?: boolean;
}
export declare class UpdateLiveJourneyBroadcastDto {
    isActive?: boolean;
    batteryLevel?: number;
    elevation?: number;
}
export declare class CreateLocationUpdateDto {
    latitude: number;
    longitude: number;
}
