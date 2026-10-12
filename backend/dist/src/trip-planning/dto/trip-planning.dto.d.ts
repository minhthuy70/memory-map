export declare class CreateRouteOptimizationDto {
    itineraryId?: string;
    memoryIds: string;
    transportMode: string;
}
export declare class UpdateRouteOptimizationDto {
    optimizedOrder?: string;
    totalDistance?: number;
    totalTime?: number;
}
export declare class CreateNavigationRouteDto {
    itineraryId?: string;
    startLocation: string;
    endLocation: string;
    waypoints: string;
    transportMode: string;
}
export declare class UpdateNavigationRouteDto {
    steps?: string;
    evChargingStations?: string;
    gasStations?: string;
    elevationGain?: number;
}
export declare class CreateOfflineGuideDto {
    itineraryId?: string;
    title: string;
    memoryIds: string;
    mapTiles: string;
    notes?: string;
    emergencyContacts?: string;
}
export declare class UpdateOfflineGuideDto {
    downloadUrl?: string;
    isDownloaded?: boolean;
}
export declare class CreateFlightTrainStatusDto {
    itineraryId?: string;
    type: string;
    carrier: string;
    number: string;
    departureTime: string;
    arrivalTime: string;
    origin: string;
    destination: string;
}
export declare class UpdateFlightTrainStatusDto {
    status?: string;
    gate?: string;
    platform?: string;
    delayMinutes?: number;
    memoryDraftTriggered?: boolean;
}
export declare class CreateVisitedCountryDto {
    countryCode: string;
    countryName: string;
    visitDate: string;
    visaRequired?: boolean;
    visaExpiryDate?: string;
    notes?: string;
}
export declare class UpdateVisitedCountryDto {
    visaExpiryDate?: string;
    notes?: string;
}
export declare class CreateCarbonFootprintDto {
    itineraryId?: string;
    tripType: string;
    distance: number;
    vehicleType?: string;
    co2Emission: number;
    offsetCost?: number;
    offsetUrl?: string;
}
export declare class UpdateCarbonFootprintDto {
    offsetCost?: number;
    offsetUrl?: string;
}
export declare class CreateEmergencyContactDto {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    isPrimary?: boolean;
}
export declare class UpdateEmergencyContactDto {
    name?: string;
    relationship?: string;
    phone?: string;
    email?: string;
    isPrimary?: boolean;
}
export declare class UpdateSafetyHubDto {
    lastLocationLat?: number;
    lastLocationLng?: number;
    lastLocationTime?: string;
    sosTriggered?: boolean;
    sosTriggeredAt?: string;
    nearestPolice?: string;
    nearestMedical?: string;
    nearestEmbassy?: string;
    emergencyBroadcastSent?: boolean;
}
