'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Memory } from '@/lib/memories-api';

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
}

function MapClickHandler({ onLocationSelect, onSelectMode }: { onLocationSelect?: (lat: number, lng: number) => void; onSelectMode?: boolean }) {
  const map = useMapEvents({
    click(e) {
      if (onSelectMode && onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
}

export default function MemoryMap({ 
  memories, 
  onLocationSelect, 
  onSelectMode = false,
  onMarkerClick,
  center = [21.0285, 105.8542],
  zoom = 13 
}: MapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading map...</div>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full"
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapClickHandler onLocationSelect={onLocationSelect} onSelectMode={onSelectMode} />
      
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
  );
}
