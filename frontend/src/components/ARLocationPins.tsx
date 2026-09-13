'use client';

import { useState } from 'react';
import { X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, MapPin, RefreshCw, Check, Zap as ZapIcon, Plus, Navigation, Eye, EyeOff, Trash2 as TrashIcon, ExternalLink, Compass, Target, Crosshair, Layers, Filter as FilterIcon, ZoomIn, ZoomOut, Maximize2, RotateCw, Locate, Signal, Wifi, Battery, Map as MapIcon, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface ARPin {
  id: string;
  memoryId: string;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  coordinates: { lat: number; lng: number };
  direction: number;
  distance: number;
  angle: number;
  isVisible: boolean;
  color: string;
  size: number;
}

interface ARLocationPinsProps {
  onCancel?: () => void;
  onAddPin?: (pin: Partial<ARPin>) => Promise<void>;
  onRemovePin?: (pinId: string) => Promise<void>;
  onUpdatePin?: (pinId: string, updates: Partial<ARPin>) => Promise<void>;
}

const DEFAULT_PINS: ARPin[] = [
  {
    id: 'pin-1',
    memoryId: 'mem-1',
    title: 'Đà Lạt Adventure',
    description: 'Morning mist at Đà Lạt',
    imageUrl: '/pin-1.jpg',
    location: 'Đà Lạt, Vietnam',
    coordinates: { lat: 11.9405, lng: 108.4583 },
    direction: 45,
    distance: 120,
    angle: 30,
    isVisible: true,
    color: '#00FFFF',
    size: 32,
  },
  {
    id: 'pin-2',
    memoryId: 'mem-2',
    title: 'Beach Day',
    description: 'Relaxing at the beach',
    imageUrl: '/pin-2.jpg',
    location: 'Nha Trang, Vietnam',
    coordinates: { lat: 12.2380, lng: 109.1967 },
    direction: 120,
    distance: 250,
    angle: 60,
    isVisible: true,
    color: '#FF00FF',
    size: 40,
  },
];

export default function ARLocationPins({ onCancel, onAddPin, onRemovePin, onUpdatePin }: ARLocationPinsProps) {
  const [pins, setPins] = useState<ARPin[]>(DEFAULT_PINS);
  const [showSettings, setShowSettings] = useState(false);
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [selectedPin, setSelectedPin] = useState<ARPin | null>(DEFAULT_PINS[0]);
  const [showInDirection, setShowInDirection] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [pinSize, setPinSize] = useState(32);

  const visiblePins = pins.filter(p => p.isVisible);
  const totalPins = pins.length;
  const avgDistance = pins.reduce((sum, p) => sum + p.distance, 0) / pins.length;

  const handleAddPin = async (pin: Partial<ARPin>) => {
    await onAddPin?.(pin);
    const newPin: ARPin = {
      id: `pin-${Date.now()}`,
      memoryId: pin.memoryId || 'mem-1',
      title: pin.title || 'New Pin',
      description: pin.description || '',
      imageUrl: pin.imageUrl || '',
      location: pin.location || '',
      coordinates: pin.coordinates || { lat: 0, lng: 0 },
      direction: pin.direction || 0,
      distance: pin.distance || 0,
      angle: pin.angle || 0,
      isVisible: true,
      color: pin.color || '#00FFFF',
      size: pin.size || 32,
    };
    setPins([newPin, ...pins]);
    setIsAddingPin(false);
  };

  const handleRemovePin = async (pinId: string) => {
    await onRemovePin?.(pinId);
    setPins(pins.filter(p => p.id !== pinId));
  };

  const handleUpdatePin = async (pinId: string, updates: Partial<ARPin>) => {
    await onUpdatePin?.(pinId, updates);
    setPins(pins.map(p => 
      p.id === pinId ? { ...p, ...updates } : p
    ));
  };

  const handleToggleVisibility = (pinId: string) => {
    setPins(pins.map(p => 
      p.id === pinId ? { ...p, isVisible: !p.isVisible } : p
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Pin kỷ niệm AR xuất hiện khi trỏ camera vào hướng
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {visiblePins} pins visible
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
        <div className="mb-4 p-4 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt AR location pins
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show in direction
              </span>
              <button
                type="button"
                onClick={() => setShowInDirection(!showInDirection)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  showInDirection ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    showInDirection ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-update position
              </span>
              <button
                type="button"
                onClick={() => setAutoUpdate(!autoUpdate)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoUpdate ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoUpdate ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Pin size
              </span>
              <input
                type="range"
                min="24"
                max="64"
                value={pinSize}
                onChange={(e) => setPinSize(parseInt(e.target.value))}
                className="w-20 h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-pink-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Pins</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalPins}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Visible</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {visiblePins}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Distance</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgDistance.toFixed(0)}m
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Compass className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Direction</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {showInDirection ? 'On' : 'Off'}
          </div>
        </div>
      </div>

      {/* Add Pin */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setIsAddingPin(!isAddingPin)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          {isAddingPin ? 'Cancel' : 'Add New Pin'}
        </button>

        {isAddingPin && (
          <div className="mt-4 p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Pin title"
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
                    placeholder="0.0000"
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
                    placeholder="0.0000"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Pin Color
                </label>
                <input
                  type="color"
                  defaultValue="#00FFFF"
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>
              <button
                type="button"
                onClick={() => handleAddPin({})}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Check className="h-4 w-4" />
                Add Pin
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AR Direction View */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              AR Direction View
            </span>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors">
                <RotateCw className="h-4 w-4 text-slate-500" />
              </button>
              <button className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors">
                <ZoomIn className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Direction Circle */}
          <div className="aspect-square bg-slate-200 dark:bg-slate-600 rounded-full relative mx-auto max-w-xs">
            <div className="absolute inset-0 flex items-center justify-center">
              <Crosshair className="h-12 w-12 text-slate-400" />
            </div>

            {/* Compass Directions */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500">
              N
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500">
              S
            </div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
              W
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
              E
            </div>

            {/* AR Pins */}
            {visiblePins.map((pin) => (
              <div
                key={pin.id}
                className="absolute rounded-full cursor-pointer hover:scale-110 transition-transform"
                style={{
                  top: `calc(50% - ${pinSize / 2}px)`,
                  left: `calc(50% - ${pinSize / 2}px)`,
                  transform: `rotate(${pin.direction}deg) translateY(-${pin.distance / 5}px) rotate(-${pin.direction}deg)`,
                  width: `${pin.size}px`,
                  height: `${pin.size}px`,
                  backgroundColor: pin.color,
                }}
                onClick={() => setSelectedPin(pin)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Pin List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          AR Location Pins
        </h4>
        <div className="space-y-2">
          {pins.map((pin) => (
            <div
              key={pin.id}
              className={`p-4 rounded-lg border-2 ${
                pin.isVisible
                  ? 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                  : 'bg-slate-100 dark:bg-slate-600/50 border-slate-300 dark:border-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: pin.color }}
                  >
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {pin.title}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {pin.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(pin.id)}
                    className="p-1"
                  >
                    {pin.isVisible ? (
                      <Eye className="h-3 w-3 text-slate-400" />
                    ) : (
                      <EyeOff className="h-3 w-3 text-slate-400" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemovePin(pin.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <TrashIcon className="h-3 w-3 text-red-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Direction</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {pin.direction}°
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Distance</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {pin.distance}m
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Angle</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {pin.angle}°
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Size</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {pin.size}px
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Lat</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {pin.coordinates.lat.toFixed(4)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Lng</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {pin.coordinates.lng.toFixed(4)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 rounded-lg">
        <p className="text-[10px] text-pink-700 dark:text-pink-400">
          <strong>Lưu ý:</strong> Pin kỷ niệm AR xuất hiện khi trỏ camera vào hướng với AR direction view, GPS coordinates, distance/angle calculation, pin color customization, pin size adjustment, visibility toggle, auto-update position, compass directions, show in direction mode, và comprehensive AR location pin system.
        </p>
      </div>
    </div>
  );
}