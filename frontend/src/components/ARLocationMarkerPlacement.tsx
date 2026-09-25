'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Anchor,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  as,
  BarChart3,
  Battery,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Compass,
  Crosshair,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Filter,
  Globe,
  Layers,
  Locate,
  Map,
  MapIcon,
  MapPin,
  Maximize2,
  Navigation,
  NavigationIcon,
  Pause,
  Pin,
  Play,
  Plus,
  RefreshCw,
  RotateCw,
  Search,
  Settings,
  SettingsIcon,
  Signal,
  Target,
  Trash2,
  TrashIcon,
  Wifi,
  Zap,
  ZapIcon,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface ARMarker {
  id: string;
  title: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  altitude: number;
  type: 'landmark' | 'waypoint' | 'hotspot' | 'checkpoint';
  isPlaced: boolean;
  isVisible: boolean;
  isPermanent: boolean;
  color: string;
  icon: string;
  size: number;
}

interface ARLocationMarkerPlacementProps {
  onCancel?: () => void;
  onPlaceMarker?: (marker: Partial<ARMarker>) => Promise<void>;
  onRemoveMarker?: (markerId: string) => Promise<void>;
  onUpdateMarker?: (markerId: string, updates: Partial<ARMarker>) => Promise<void>;
}

const DEFAULT_MARKERS: ARMarker[] = [
  {
    id: 'marker-1',
    title: 'Coffee Shop Memory',
    description: 'Where we had our first coffee',
    location: 'Downtown District',
    coordinates: { lat: 11.9405, lng: 108.4583 },
    altitude: 0,
    type: 'landmark',
    isPlaced: true,
    isVisible: true,
    isPermanent: true,
    color: '#00FF00',
    icon: '📍',
    size: 40,
  },
  {
    id: 'marker-2',
    title: 'Sunset Point',
    description: 'Best sunset view in the city',
    location: 'Beach Area',
    coordinates: { lat: 12.2380, lng: 109.1967 },
    altitude: 5,
    type: 'hotspot',
    isPlaced: true,
    isVisible: true,
    isPermanent: false,
    color: '#FF0000',
    icon: '🌅',
    size: 36,
  },
];

const MARKER_TYPES = [
  { id: 'landmark', name: 'Landmark', icon: '🏛️', color: '#00FF00' },
  { id: 'waypoint', name: 'Waypoints', icon: '📍', color: '#0000FF' },
  { id: 'hotspot', name: 'Hotspot', icon: '🔥', color: '#FF0000' },
  { id: 'checkpoint', name: 'Checkpoint', icon: '🚩', color: '#FFFF00' },
];

export default function ARLocationMarkerPlacement({ onCancel, onPlaceMarker, onRemoveMarker, onUpdateMarker }: ARLocationMarkerPlacementProps) {
  const [markers, setMarkers] = useState<ARMarker[]>(DEFAULT_MARKERS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<ARMarker | null>(DEFAULT_MARKERS[0]);
  const [isPlacing, setIsPlacing] = useState(false);
  const [selectedType, setSelectedType] = useState('landmark');
  const [currentLocation, setCurrentLocation] = useState({ lat: 11.9405, lng: 108.4583 });
  const [isPlacingMode, setIsPlacingMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const totalMarkers = markers.length;
  const placedMarkers = markers.filter(m => m.isPlaced).length;
  const visibleMarkers = markers.filter(m => m.isVisible).length;
  const permanentMarkers = markers.filter(m => m.isPermanent).length;

  const handlePlaceMarker = async (marker: Partial<ARMarker>) => {
    await onPlaceMarker?.(marker);
    const type = MARKER_TYPES.find(t => t.id === selectedType);
    const newMarker: ARMarker = {
      id: `marker-${Date.now()}`,
      title: marker.title || 'New Marker',
      description: marker.description || '',
      location: marker.location || 'Unknown',
      coordinates: marker.coordinates || currentLocation,
      altitude: marker.altitude || 0,
      type: marker.type || selectedType as any,
      isPlaced: true,
      isVisible: true,
      isPermanent: false,
      color: marker.color || type?.color || '#00FF00',
      icon: marker.icon || type?.icon || '📍',
      size: marker.size || 40,
    };
    setMarkers([newMarker, ...markers]);
    setIsPlacing(false);
  };

  const handleRemoveMarker = async (markerId: string) => {
    await onRemoveMarker?.(markerId);
    setMarkers(markers.filter(m => m.id !== markerId));
  };

  const handleUpdateMarker = async (markerId: string, updates: Partial<ARMarker>) => {
    await onUpdateMarker?.(markerId, updates);
    setMarkers(markers.map(m => 
      m.id === markerId ? { ...m, ...updates } : m
    ));
  };

  const handleToggleVisibility = (markerId: string) => {
    setMarkers(markers.map(m => 
      m.id === markerId ? { ...m, isVisible: !m.isVisible } : m
    ));
  };

  const handleTogglePermanent = (markerId: string) => {
    setMarkers(markers.map(m => 
      m.id === markerId ? { ...m, isPermanent: !m.isPermanent } : m
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Đặt marker AR tại vị trí thực tế
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalMarkers} markers
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Cài đặt"
          >
            <SettingsIcon className="h-4 w-4 text-slate-500" />
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Đóng"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt AR location markers
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-save markers
              </span>
              <button
                type="button"
                onClick={() => setAutoSave(!autoSave)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoSave ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoSave ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                GPS tracking
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                AR placement mode
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Markers</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalMarkers}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Placed</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {placedMarkers}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Anchor className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Permanent</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {permanentMarkers}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Visible</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {visibleMarkers}
          </div>
        </div>
      </div>

      {/* Place Marker */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setIsPlacing(!isPlacing)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          {isPlacing ? 'Cancel' : 'Place New Marker'}
        </button>

        {isPlacing && (
          <div className="mt-4 p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Marker Title
                </label>
                <input
                  type="text"
                  placeholder="Marker title"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Description
                </label>
                <textarea
                  placeholder="Marker description"
                  rows={2}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Location name"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    defaultValue={currentLocation.lat}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    defaultValue={currentLocation.lng}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-2 block">
                  Marker Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {MARKER_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`p-3 text-2xl rounded-lg transition-colors ${
                        selectedType === type.id
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-500'
                          : 'bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500'
                      }`}
                    >
                      {type.icon}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handlePlaceMarker({ type: selectedType as any })}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Check className="h-4 w-4" />
                Place Marker
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AR Placement Mode */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              AR Placement Mode
            </span>
            {isPlacingMode && (
              <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold rounded-full">
                Active
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsPlacingMode(!isPlacingMode)}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
              isPlacingMode
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white'
            }`}
          >
            {isPlacingMode ? (
              <>
                <NavigationIcon className="h-4 w-4" />
                Exit Placement Mode
              </>
            ) : (
              <>
                <Pin className="h-4 w-4" />
                Enter Placement Mode
              </>
            )}
          </button>

          {isPlacingMode && (
            <div className="mt-3 p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                <strong>Instructions:</strong> Point your camera at the desired location and tap to place an AR marker. Move around to find the best placement angle.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Marker Editor */}
      {selectedMarker && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Marker Editor
              </span>
              <div className="flex items-center gap-2">
                {selectedMarker.isPermanent && (
                  <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold rounded-full">
                    Permanent
                  </span>
                )}
              </div>
            </div>

            {/* AR View */}
            <div className="aspect-video bg-slate-200 dark:bg-slate-600 rounded-lg mb-3 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Globe className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    AR Placement View
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-400">
                    {selectedMarker.location}
                  </p>
                </div>
              </div>

              {/* Marker */}
              {selectedMarker.isVisible && (
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl"
                  style={{ filter: `drop-shadow(0 4px 6px rgba(0,0,0,0.3))` }}
                >
                  {selectedMarker.icon}
                </div>
              )}

              {/* Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Crosshair className="h-8 w-8 text-white/50" />
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Lat</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {selectedMarker.coordinates.lat.toFixed(4)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Lng</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {selectedMarker.coordinates.lng.toFixed(4)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Altitude</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {selectedMarker.altitude}m
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleTogglePermanent(selectedMarker.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              >
                {selectedMarker.isPermanent ? (
                  <>
                    <ArrowDown className="h-3 w-3" />
                    Make Temporary
                  </>
                ) : (
                  <>
                    <ArrowUp className="h-3 w-3" />
                    Make Permanent
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleToggleVisibility(selectedMarker.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              >
                {selectedMarker.isVisible ? (
                  <>
                    <EyeOff className="h-3 w-3" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3" />
                    Show
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Marker List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          AR Location Markers
        </h4>
        <div className="space-y-2">
          {markers.map((marker) => (
            <div
              key={marker.id}
              className={`p-4 rounded-lg border-2 ${
                selectedMarker?.id === marker.id
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                  : marker.isVisible
                  ? 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                  : 'bg-slate-100 dark:bg-slate-600/50 border-slate-300 dark:border-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center text-3xl">
                    {marker.icon}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {marker.title}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {marker.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {marker.isPermanent && (
                    <Anchor className="h-4 w-4 text-emerald-500" />
                  )}
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(marker.id)}
                    className="p-1"
                  >
                    {marker.isVisible ? (
                      <Eye className="h-3 w-3 text-slate-400" />
                    ) : (
                      <EyeOff className="h-3 w-3 text-slate-400" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveMarker(marker.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <TrashIcon className="h-3 w-3 text-red-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Type</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 capitalize">
                    {marker.type}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Altitude</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {marker.altitude}m
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Size</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {marker.size}px
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Status</div>
                  <div className={`text-xs ${marker.isPlaced ? 'text-green-500' : 'text-slate-500'}`}>
                    {marker.isPlaced ? 'Placed' : 'Pending'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMarker(marker)}
                className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-lg transition-colors"
              >
                <Target className="h-3 w-3" />
                Edit Marker
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg">
        <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
          <strong>Lưu ý:</strong> Đặt marker AR tại vị trí thực tế với AR placement mode, GPS coordinates, altitude tracking, marker types (landmark/waypoint/hotspot/checkpoint), permanent/temporary markers, visibility toggle, marker icon customization, size adjustment, location management, và comprehensive AR location marker placement system.
        </p>
      </div>
    </div>
  );
}