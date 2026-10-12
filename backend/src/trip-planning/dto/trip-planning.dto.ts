import { IsString, IsOptional, IsInt, IsNumber, IsBoolean, IsArray } from 'class-validator';

// Route Optimization
export class CreateRouteOptimizationDto {
  @IsOptional()
  @IsString()
  itineraryId?: string;

  @IsString()
  memoryIds: string; // JSON array

  @IsString()
  transportMode: string; // walking, motorbike, car, transit
}

export class UpdateRouteOptimizationDto {
  @IsOptional()
  @IsString()
  optimizedOrder?: string;

  @IsOptional()
  @IsNumber()
  totalDistance?: number;

  @IsOptional()
  @IsInt()
  totalTime?: number;
}

// Navigation Route
export class CreateNavigationRouteDto {
  @IsOptional()
  @IsString()
  itineraryId?: string;

  @IsString()
  startLocation: string;

  @IsString()
  endLocation: string;

  @IsString()
  waypoints: string; // JSON of coordinates

  @IsString()
  transportMode: string;
}

export class UpdateNavigationRouteDto {
  @IsOptional()
  @IsString()
  steps?: string;

  @IsOptional()
  @IsString()
  evChargingStations?: string;

  @IsOptional()
  @IsString()
  gasStations?: string;

  @IsOptional()
  @IsNumber()
  elevationGain?: number;
}

// Offline Guide
export class CreateOfflineGuideDto {
  @IsOptional()
  @IsString()
  itineraryId?: string;

  @IsString()
  title: string;

  @IsString()
  memoryIds: string; // JSON array

  @IsString()
  mapTiles: string; // JSON of offline map data

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  emergencyContacts?: string; // JSON
}

export class UpdateOfflineGuideDto {
  @IsOptional()
  @IsString()
  downloadUrl?: string;

  @IsOptional()
  @IsBoolean()
  isDownloaded?: boolean;
}

// Flight/Train Status
export class CreateFlightTrainStatusDto {
  @IsOptional()
  @IsString()
  itineraryId?: string;

  @IsString()
  type: string; // flight, train

  @IsString()
  carrier: string;

  @IsString()
  number: string;

  @IsString()
  departureTime: string;

  @IsString()
  arrivalTime: string;

  @IsString()
  origin: string;

  @IsString()
  destination: string;
}

export class UpdateFlightTrainStatusDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  gate?: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsInt()
  delayMinutes?: number;

  @IsOptional()
  @IsBoolean()
  memoryDraftTriggered?: boolean;
}

// Visited Country
export class CreateVisitedCountryDto {
  @IsString()
  countryCode: string; // ISO 3166-1 alpha-2

  @IsString()
  countryName: string;

  @IsString()
  visitDate: string;

  @IsOptional()
  @IsBoolean()
  visaRequired?: boolean;

  @IsOptional()
  @IsString()
  visaExpiryDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateVisitedCountryDto {
  @IsOptional()
  @IsString()
  visaExpiryDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

// Carbon Footprint
export class CreateCarbonFootprintDto {
  @IsOptional()
  @IsString()
  itineraryId?: string;

  @IsString()
  tripType: string; // flight, drive, train, bus

  @IsNumber()
  distance: number; // km

  @IsOptional()
  @IsString()
  vehicleType?: string;

  @IsNumber()
  co2Emission: number; // kg CO2

  @IsOptional()
  @IsNumber()
  offsetCost?: number; // USD

  @IsOptional()
  @IsString()
  offsetUrl?: string;
}

export class UpdateCarbonFootprintDto {
  @IsOptional()
  @IsNumber()
  offsetCost?: number;

  @IsOptional()
  @IsString()
  offsetUrl?: string;
}

// Emergency Contact
export class CreateEmergencyContactDto {
  @IsString()
  name: string;

  @IsString()
  relationship: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class UpdateEmergencyContactDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  relationship?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

// Safety Hub
export class UpdateSafetyHubDto {
  @IsOptional()
  @IsNumber()
  lastLocationLat?: number;

  @IsOptional()
  @IsNumber()
  lastLocationLng?: number;

  @IsOptional()
  @IsString()
  lastLocationTime?: string;

  @IsOptional()
  @IsBoolean()
  sosTriggered?: boolean;

  @IsOptional()
  @IsString()
  sosTriggeredAt?: string;

  @IsOptional()
  @IsString()
  nearestPolice?: string;

  @IsOptional()
  @IsString()
  nearestMedical?: string;

  @IsOptional()
  @IsString()
  nearestEmbassy?: string;

  @IsOptional()
  @IsBoolean()
  emergencyBroadcastSent?: boolean;
}
