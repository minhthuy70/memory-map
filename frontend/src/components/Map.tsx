'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Memory } from '@/lib/memories-api';
import LocationSearch from './LocationSearch';
import { Navigation, Layers, Maximize2, Minimize2, Focus } from 'lucide-react';

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

type MapLayerType = 'streets' | 'satellite' | 'terrain';

const TILE_LAYERS: Record<MapLayerType, { name: string; url: string; attribution: string }> = {
  streets: {
    name: 'Đường phố',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    name: 'Vệ tinh',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  terrain: {
    name: 'Địa hình',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
};

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

function MapClickHandler({ 
  onLocationSelect, 
  onSelectMode, 
  enableReverseGeocoding, 
  onLocationName 
}: {
  onLocationSelect?: (lat: number, lng: number) => void;
  onSelectMode?: boolean;
  enableReverseGeocoding?: boolean;
  onLocationName?: (locationName: string) => void;
}) {
  useMapEvents({
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

function MapController({ 
  center, 
  zoom, 
  fitBoundsTrigger, 
  memories 
}: { 
  center?: [number, number]; 
  zoom?: number;
  fitBoundsTrigger?: number;
  memories?: Memory[];
}) {
  const map = useMap();

  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  useEffect(() => {
    if (fitBoundsTrigger && memories && memories.length > 0) {
      const validMarkers = memories.filter(m => m.latitude && m.longitude);
      if (validMarkers.length > 0) {
        const bounds = L.latLngBounds(validMarkers.map(m => [m.latitude, m.longitude]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }
    }
  }, [fitBoundsTrigger, memories, map]);

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [locationError, setLocationError] = useState('');
  
  // Layer control & Fullscreen state
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('streets');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fitBoundsTrigger, setFitBoundsTrigger] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  };

  const handleSearchLocationSelect = (lat: number, lng: number, locationName: string) => {
    setMapCenter([lat, lng]);
    setMapZoom(15);
    if (onSelectMode && onLocationSelect) {
      onLocationSelect(lat, lng);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Trình duyệt không hỗ trợ định vị vị trí');
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
        setLocationError('Không thể lấy vị trí hiện tại');
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleFitBounds = () => {
    setFitBoundsTrigger(prev => prev + 1);
  };

  if (!isClient) {
    return (
      <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Đang tải bản đồ...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full bg-slate-100 dark:bg-slate-900">
      {/* Location Search Overlay */}
      {showSearch && (
        <div className="absolute top-4 left-4 right-4 z-[1000] max-w-md mx-auto">
          <LocationSearch
            onLocationSelect={handleSearchLocationSelect}
            placeholder="Tìm kiếm địa điểm trên bản đồ..."
          />
        </div>
      )}

      {/* Map Control Toolbar (Floating Top Right) */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        {/* Layer Controls / Map Type Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="p-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
            title="Chọn loại bản đồ (Layers)"
            aria-label="Layer Controls"
          >
            <Layers className="h-5 w-5" />
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 top-12 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 w-40 space-y-1 animate-in fade-in">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase px-2 py-1">
                Lớp bản đồ
              </p>
              {(Object.keys(TILE_LAYERS) as MapLayerType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setActiveLayer(type);
                    setShowLayerMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeLayer === type
                      ? 'bg-primary text-white font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {TILE_LAYERS[type].name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fit bounds button - View all markers */}
        {memories && memories.length > 0 && (
          <button
            type="button"
            onClick={handleFitBounds}
            className="p-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
            title="Xem toàn bộ kỷ niệm (Fit all markers)"
            aria-label="Fit Bounds"
          >
            <Focus className="h-5 w-5" />
          </button>
        )}

        {/* Full-screen map mode toggle */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
          title={isFullscreen ? 'Thu nhỏ bản đồ' : 'Toàn màn hình bản đồ'}
          aria-label="Fullscreen Map Mode"
        >
          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </button>
      </div>

      {/* Current Location Button (Bottom Right) */}
      {showCurrentLocationButton && (
        <div className="absolute bottom-6 right-4 z-[1000]">
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            className="p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary-hover transition-colors cursor-pointer flex items-center justify-center hover:scale-105"
            title="Vị trí hiện tại của tôi"
            aria-label="Current Location"
          >
            <Navigation className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Geolocation Error Notification */}
      {locationError && (
        <div className="absolute bottom-6 left-4 right-16 z-[1000] bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-2.5 rounded-xl text-xs shadow-md">
          {locationError}
        </div>
      )}

      {/* Leaflet Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          key={activeLayer}
          attribution={TILE_LAYERS[activeLayer].attribution}
          url={TILE_LAYERS[activeLayer].url}
        />

        <MapController 
          center={mapCenter} 
          zoom={mapZoom} 
          fitBoundsTrigger={fitBoundsTrigger} 
          memories={memories} 
        />

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
              <div className="p-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl">{memory.category?.icon || '📍'}</span>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{memory.title}</h3>
                </div>
                <p className="text-xs text-slate-600 mb-1 line-clamp-1">
                  {memory.locationName || 'Chưa đặt tên địa điểm'}
                </p>
                <p className="text-[11px] text-slate-400 font-medium">
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
