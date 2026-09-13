'use client';

import { useState } from 'react';
import { X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Cloud, RefreshCw, Check, Zap as ZapIcon, Plus, Layers, Zap, MapPin, Eye, EyeOff, Trash2 as TrashIcon, ExternalLink, Target, Crosshair, Locate, RotateCw, ZoomIn, ZoomOut, Maximize2, Navigation, Wifi, Battery, Signal, Globe, Map as MapIcon, Sparkles, Wind } from 'lucide-react';

interface MemoryCloud {
  id: string;
  memoryId: string;
  title: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  memories: { id: string; title: string; imageUrl: string }[];
  isHotspot: boolean;
  isVisible: boolean;
  particleCount: number;
  rotationSpeed: number;
  scale: number;
  color: string;
}

interface ARMemoryCloudProps {
  onCancel?: () => void;
  onCreateCloud?: (cloud: Partial<MemoryCloud>) => Promise<void>;
  onDeleteCloud?: (cloudId: string) => Promise<void>;
  onUpdateCloud?: (cloudId: string, updates: Partial<MemoryCloud>) => Promise<void>;
}

const DEFAULT_CLOUDS: MemoryCloud[] = [
  {
    id: 'cloud-1',
    memoryId: 'mem-1',
    title: 'Đà Lạt Memories',
    description: 'Cloud of memories at Đà Lạt',
    location: 'Đà Lạt, Vietnam',
    coordinates: { lat: 11.9405, lng: 108.4583 },
    memories: [
      { id: 'm1', title: 'Morning Mist', imageUrl: '/m1.jpg' },
      { id: 'm2', title: 'Flower Garden', imageUrl: '/m2.jpg' },
      { id: 'm3', title: 'Coffee Shop', imageUrl: '/m3.jpg' },
    ],
    isHotspot: true,
    isVisible: true,
    particleCount: 50,
    rotationSpeed: 1,
    scale: 1,
    color: '#00FFFF',
  },
  {
    id: 'cloud-2',
    memoryId: 'mem-2',
    title: 'Beach Memories',
    description: 'Cloud of memories at the beach',
    location: 'Nha Trang, Vietnam',
    coordinates: { lat: 12.2380, lng: 109.1967 },
    memories: [
      { id: 'm4', title: 'Sunset', imageUrl: '/m4.jpg' },
      { id: 'm5', title: 'Surfing', imageUrl: '/m5.jpg' },
    ],
    isHotspot: true,
    isVisible: true,
    particleCount: 30,
    rotationSpeed: 0.5,
    scale: 0.8,
    color: '#FF00FF',
  },
];

export default function ARMemoryCloud({ onCancel, onCreateCloud, onDeleteCloud, onUpdateCloud }: ARMemoryCloudProps) {
  const [clouds, setClouds] = useState<MemoryCloud[]>(DEFAULT_CLOUDS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCloud, setSelectedCloud] = useState<MemoryCloud | null>(DEFAULT_CLOUDS[0]);
  const [isCreating, setIsCreating] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showAllClouds, setShowAllClouds] = useState(true);

  const totalClouds = clouds.length;
  const hotspots = clouds.filter(c => c.isHotspot).length;
  const visibleClouds = clouds.filter(c => c.isVisible).length;
  const totalMemories = clouds.reduce((sum, c) => sum + c.memories.length, 0);

  const handleCreateCloud = async (cloud: Partial<MemoryCloud>) => {
    await onCreateCloud?.(cloud);
    const newCloud: MemoryCloud = {
      id: `cloud-${Date.now()}`,
      memoryId: cloud.memoryId || 'mem-1',
      title: cloud.title || 'New Cloud',
      description: cloud.description || '',
      location: cloud.location || '',
      coordinates: cloud.coordinates || { lat: 0, lng: 0 },
      memories: cloud.memories || [],
      isHotspot: true,
      isVisible: true,
      particleCount: cloud.particleCount || 50,
      rotationSpeed: cloud.rotationSpeed || 1,
      scale: cloud.scale || 1,
      color: cloud.color || '#00FFFF',
    };
    setClouds([newCloud, ...clouds]);
    setIsCreating(false);
  };

  const handleDeleteCloud = async (cloudId: string) => {
    await onDeleteCloud?.(cloudId);
    setClouds(clouds.filter(c => c.id !== cloudId));
  };

  const handleUpdateCloud = async (cloudId: string, updates: Partial<MemoryCloud>) => {
    await onUpdateCloud?.(cloudId, updates);
    setClouds(clouds.map(c => 
      c.id === cloudId ? { ...c, ...updates } : c
    ));
  };

  const handleToggleVisibility = (cloudId: string) => {
    setClouds(clouds.map(c => 
      c.id === cloudId ? { ...c, isVisible: !c.isVisible } : c
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <Cloud className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Đám mây kỷ niệm nổi 3D tại điểm hotspot
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalClouds} clouds
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
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt AR memory cloud
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-rotate clouds
              </span>
              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoRotate ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoRotate ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show all clouds
              </span>
              <button
                type="button"
                onClick={() => setShowAllClouds(!showAllClouds)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  showAllClouds ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    showAllClouds ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                3D rendering
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
            <Cloud className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Clouds</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalClouds}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Hotspots</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {hotspots}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-3 w-3 text-slate-500" />
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
            {visibleClouds}
          </div>
        </div>
      </div>

      {/* Create Cloud */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setIsCreating(!isCreating)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          {isCreating ? 'Cancel' : 'Create New Cloud'}
        </button>

        {isCreating && (
          <div className="mt-4 p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Cloud title"
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
                  Cloud Color
                </label>
                <input
                  type="color"
                  defaultValue="#00FFFF"
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>
              <button
                type="button"
                onClick={() => handleCreateCloud({})}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Check className="h-4 w-4" />
                Create Cloud
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3D Cloud Viewer */}
      {selectedCloud && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                3D Memory Cloud Viewer
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

            {/* 3D Cloud Display */}
            <div className="aspect-square bg-slate-200 dark:bg-slate-600 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Cloud className="h-16 w-16 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {selectedCloud.title}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-400">
                    {selectedCloud.memories.length} memories
                  </p>
                </div>
              </div>

              {/* Particles */}
              {selectedCloud.isVisible && (
                <>
                  {Array.from({ length: selectedCloud.particleCount }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full animate-pulse"
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: selectedCloud.color,
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                        animationDelay: `${Math.random() * 2}s`,
                      }}
                    />
                  ))}
                </>
              )}

              {/* Hotspot Indicator */}
              {selectedCloud.isHotspot && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500/80 backdrop-blur-sm rounded-lg">
                  <span className="text-xs text-white font-semibold">Hotspot</span>
                </div>
              )}
            </div>

            {/* Cloud Controls */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Particles</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {selectedCloud.particleCount}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Rotation</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {selectedCloud.rotationSpeed}x
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Scale</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {selectedCloud.scale}x
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cloud List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Memory Clouds
        </h4>
        <div className="space-y-2">
          {clouds.map((cloud) => (
            <div
              key={cloud.id}
              className={`p-4 rounded-lg border-2 ${
                selectedCloud?.id === cloud.id
                  ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                  : cloud.isVisible
                  ? 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                  : 'bg-slate-100 dark:bg-slate-600/50 border-slate-300 dark:border-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: cloud.color }}
                  >
                    <Cloud className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {cloud.title}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {cloud.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {cloud.isHotspot && (
                    <Target className="h-4 w-4 text-blue-500" />
                  )}
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(cloud.id)}
                    className="p-1"
                  >
                    {cloud.isVisible ? (
                      <Eye className="h-3 w-3 text-slate-400" />
                    ) : (
                      <EyeOff className="h-3 w-3 text-slate-400" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCloud(cloud.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <TrashIcon className="h-3 w-3 text-red-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Memories</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {cloud.memories.length}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Particles</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {cloud.particleCount}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Rotation</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {cloud.rotationSpeed}x
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Scale</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {cloud.scale}x
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Lat</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {cloud.coordinates.lat.toFixed(4)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Lng</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {cloud.coordinates.lng.toFixed(4)}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCloud(cloud)}
                className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-lg transition-colors"
              >
                <Sparkles className="h-3 w-3" />
                View 3D Cloud
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Đám mây kỷ niệm nổi 3D tại điểm hotspot với 3D cloud rendering, particle effects, rotation speed control, scale adjustment, hotspot management, GPS coordinates, cloud color customization, auto-rotate, visibility toggle, memory cloud visualization, và comprehensive AR memory cloud system.
        </p>
      </div>
    </div>
  );
}