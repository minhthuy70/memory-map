'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Memory } from '@/lib/memories-api';
import LocationSearch from './LocationSearch';
import { Navigation } from 'lucide-react';

// Fix for default marker icons in Leaflet with React
const iconDefault = L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: () => string };
if (iconDefault._getIconUrl) {
  delete iconDefault._getIconUrl;
}
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  memories: Memory[];
  onLocationSelect?: (lat: number, lng: number) => void;
  onSelectMode?: boolean;
  onMarkerClick?: (memory: Memory) => void;
  center?: [number, number];
  zoom?: number;
  showSearch?: boolean;
  enableReverseGeocoding?: boolean;
  onLocationName?: (locationName: string) => void;
  showCurrentLocationButton?: boolean;
}

function MapClickHandler({ onLocationSelect, onSelectMode, enableReverseGeocoding, onLocationName }: {
  onLocationSelect?: (lat: number, lng: number) => void;
  onSelectMode?: boolean;
  enableReverseGeocoding?: boolean;
  onLocationName?: (locationName: string) => void;
}) {
  const map = useMapEvents({
    async click(e) {
      if (onSelectMode && onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);

        // Reverse geocoding
        if (enableReverseGeocoding && onLocationName) {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
            );
            const data = await response.json();
            if (data.display_name) {
              onLocationName(data.display_name);
            }
          } catch (error) {
            console.error('Reverse geocoding error:', error);
          }
        }
      }
    },
  });

  return null;
}

function MapController({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMapEvents({
    moveend() {
      // Handle map move if needed
    },
  });

  if (center && zoom) {
    map.setView(center, zoom);
  }

  return null;
}

export default function MemoryMap({
  memories,
  onLocationSelect,
  onSelectMode = false,
  onMarkerClick,
  center = [21.0285, 105.8542],
  zoom = 13,
  showSearch = false,
  enableReverseGeocoding = false,
  onLocationName,
  showCurrentLocationButton = false,
}: MapProps) {
  const [isClient, setIsClient] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSearchLocationSelect = (lat: number, lng: number, locationName: string) => {
    setMapCenter([lat, lng]);
    setMapZoom(15);
    if (onSelectMode && onLocationSelect) {
      onLocationSelect(lat, lng);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        setMapZoom(15);
        setLocationError('');

        if (onSelectMode && onLocationSelect) {
          onLocationSelect(latitude, longitude);
        }
      },
      (error) => {
        setLocationError('Unable to retrieve your location');
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  if (!isClient) {
    return (
      <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {showSearch && (
        <div className="absolute top-4 left-4 right-4 z-[1000]">
          <LocationSearch
            onLocationSelect={handleSearchLocationSelect}
            placeholder="Search for a place..."
          />
        </div>
      )}

      {showCurrentLocationButton && (
        <div className="absolute bottom-4 right-4 z-[1000]">
          <button
            onClick={handleGetCurrentLocation}
            className="p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary-hover transition-colors"
            title="Get my location"
          >
            <Navigation className="h-5 w-5" />
          </button>
        </div>
      )}

      {locationError && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-sm">
          {locationError}
        </div>
      )}

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={mapCenter} zoom={mapZoom} />

        <MapClickHandler
          onLocationSelect={onLocationSelect}
          onSelectMode={onSelectMode}
          enableReverseGeocoding={enableReverseGeocoding}
          onLocationName={onLocationName}
        />

        {memories.map((memory) => (
          <Marker
            key={memory.id}
            position={[memory.latitude, memory.longitude]}
            eventHandlers={{
              click: () => onMarkerClick?.(memory),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{memory.category.icon}</span>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{memory.title}</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  {memory.locationName || 'Unknown location'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {new Date(memory.memoryDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
