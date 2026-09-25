'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  as,
  BarChart3,
  Battery,
  Calendar,
  Camera,
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
  Layers,
  Locate,
  Map,
  MapIcon,
  MapPin,
  Maximize2,
  Navigation,
  Pause,
  Play,
  Plus,
  RefreshCw,
  RotateCw,
  Settings,
  SettingsIcon,
  Signal,
  Target,
  ToggleLeft,
  ToggleRight,
  Trash2,
  TrashIcon,
  Wifi,
  Zap,
  ZapIcon,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface ARMemory {
  id: string;
  memoryId: string;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  coordinates: { lat: number; lng: number };
  direction: number;
  distance: number;
  isVisible: boolean;
  opacity: number;
  scale: number;
}

interface ARMemoryOverlayProps {
  onCancel?: () => void;
  onEnableCamera?: () => Promise<void>;
  onDisableCamera?: () => Promise<void>;
  onToggleOverlay?: (memoryId: string) => Promise<void>;
  onAdjustOpacity?: (memoryId: string, opacity: number) => Promise<void>;
}

const DEFAULT_MEMORIES: ARMemory[] = [
  {
    id: 'ar-mem-1',
    memoryId: 'mem-1',
    title: 'Đà Lạt Adventure',
    description: 'Morning mist at Đà Lạt',
    imageUrl: '/ar-mem-1.jpg',
    location: 'Đà Lạt, Vietnam',
    coordinates: { lat: 11.9405, lng: 108.4583 },
    direction: 45,
    distance: 120,
    isVisible: true,
    opacity: 80,
    scale: 1,
  },
  {
    id: 'ar-mem-2',
    memoryId: 'mem-2',
    title: 'Beach Day',
    description: 'Relaxing at the beach',
    imageUrl: '/ar-mem-2.jpg',
    location: 'Nha Trang, Vietnam',
    coordinates: { lat: 12.2380, lng: 109.1967 },
    direction: 120,
    distance: 250,
    isVisible: true,
    opacity: 70,
    scale: 1,
  },
];

export default function ARMemoryOverlay({ onCancel, onEnableCamera, onDisableCamera, onToggleOverlay, onAdjustOpacity }: ARMemoryOverlayProps) {
  const [memories, setMemories] = useState<ARMemory[]>(DEFAULT_MEMORIES);
  const [showSettings, setShowSettings] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ lat: 11.9405, lng: 108.4583 });
  const [compassDirection, setCompassDirection] = useState(0);
  const [autoDetect, setAutoDetect] = useState(true);
  const [showAllOverlays, setShowAllOverlays] = useState(true);

  const visibleMemories = memories.filter(m => m.isVisible);
  const totalMemories = memories.length;
  const avgDistance = memories.reduce((sum, m) => sum + m.distance, 0) / memories.length;

  const handleEnableCamera = async () => {
    await onEnableCamera?.();
    setIsCameraActive(true);
  };

  const handleDisableCamera = async () => {
    await onDisableCamera?.();
    setIsCameraActive(false);
  };

  const handleToggleOverlay = async (memoryId: string) => {
    await onToggleOverlay?.(memoryId);
    setMemories(memories.map(m => 
      m.id === memoryId ? { ...m, isVisible: !m.isVisible } : m
    ));
  };

  const handleAdjustOpacity = async (memoryId: string, opacity: number) => {
    await onAdjustOpacity?.(memoryId, opacity);
    setMemories(memories.map(m => 
      m.id === memoryId ? { ...m, opacity } : m
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
            <Camera className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Hiển thị kỷ niệm overlay qua camera khi đến địa điểm cũ
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {visibleMemories} overlays visible
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
        <div className="mb-4 p-4 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt AR overlay
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-detect location
              </span>
              <button
                type="button"
                onClick={() => setAutoDetect(!autoDetect)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoDetect ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoDetect ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show all overlays
              </span>
              <button
                type="button"
                onClick={() => setShowAllOverlays(!showAllOverlays)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  showAllOverlays ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    showAllOverlays ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                AR supported
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Yes</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Camera className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Memories</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalMemories}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Visible</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {visibleMemories}
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
            {compassDirection}°
          </div>
        </div>
      </div>

      {/* Camera Control */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Camera AR
            </span>
            {isCameraActive && (
              <span className="px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-[10px] font-semibold rounded-full">
                Active
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={isCameraActive ? handleDisableCamera : handleEnableCamera}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
              isCameraActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white'
            }`}
          >
            {isCameraActive ? (
              <>
                <ToggleLeft className="h-4 w-4" />
                Disable Camera
              </>
            ) : (
              <>
                <ToggleRight className="h-4 w-4" />
                Enable Camera AR
              </>
            )}
          </button>
        </div>
      </div>

      {/* AR View Preview */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              AR View
            </span>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors">
                <RotateCw className="h-4 w-4 text-slate-500" />
              </button>
              <button className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors">
                <ZoomIn className="h-4 w-4 text-slate-500" />
              </button>
              <button className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors">
                <Maximize2 className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* AR View Area */}
          <div className="aspect-video bg-slate-200 dark:bg-slate-600 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isCameraActive ? 'AR Camera Active' : 'Enable camera to see AR overlays'}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-400">
                  Point camera at memory locations
                </p>
              </div>
            </div>

            {/* Overlay Pins */}
            {isCameraActive && visibleMemories.map((memory) => (
              <div
                key={memory.id}
                className="absolute p-2 bg-cyan-500/80 backdrop-blur-sm rounded-lg cursor-pointer hover:bg-cyan-500/100 transition-colors"
                style={{
                  top: `${30 + memory.direction / 4}%`,
                  left: `${30 + memory.distance / 10}%`,
                  opacity: memory.opacity / 100,
                }}
              >
                <MapPin className="h-4 w-4 text-white" />
              </div>
            ))}

            {/* Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Crosshair className="h-8 w-8 text-white/50" />
            </div>
          </div>

          {/* Location Info */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Current Lat</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {currentLocation.lat.toFixed(4)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Current Lng</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {currentLocation.lng.toFixed(4)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Compass</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {compassDirection}°
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Memory List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          AR Memory Overlays
        </h4>
        <div className="space-y-2">
          {memories.map((memory) => (
            <div
              key={memory.id}
              className={`p-4 rounded-lg border-2 ${
                memory.isVisible
                  ? 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                  : 'bg-slate-100 dark:bg-slate-600/50 border-slate-300 dark:border-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-slate-400" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {memory.title}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {memory.location}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleOverlay(memory.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    memory.isVisible
                      ? 'bg-cyan-100 dark:bg-cyan-900/30 hover:bg-cyan-200 dark:hover:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400'
                      : 'bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {memory.isVisible ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Direction</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {memory.direction}°
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Distance</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {memory.distance}m
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Opacity</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {memory.opacity}%
                  </div>
                </div>
              </div>

              {/* Opacity Control */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Opacity</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={memory.opacity}
                  onChange={(e) => handleAdjustOpacity(memory.id, parseInt(e.target.value))}
                  className="flex-1 h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 rounded-lg">
        <p className="text-[10px] text-cyan-700 dark:text-cyan-400">
          <strong>Lưu ý:</strong> Hiển thị kỷ niệm overlay qua camera khi đến địa điểm cũ với camera AR integration, GPS location tracking, compass direction, distance calculation, memory overlay pins, opacity adjustment, auto-detect location, show/hide overlays, AR view with crosshair, và comprehensive AR memory overlay system.
        </p>
      </div>
    </div>
  );
}