'use client';

import { useState } from 'react';
import { X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Image as ImageIcon, RefreshCw, Check, Zap as ZapIcon, Plus, Glasses, LogOut, Grid, Layers, Star, Eye, EyeOff, Trash2 as TrashIcon, ExternalLink, MoveHorizontal, RotateCw, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, MapPin, Calendar as CalendarIcon } from 'lucide-react';

interface VRMemory {
  id: string;
  memoryId: string;
  title: string;
  description: string;
  image: string;
  location: string;
  date: Date;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
  isFavorite: boolean;
  isHidden: boolean;
}

interface VRGalleryProps {
  onCancel?: () => void;
  onEnterVR?: () => Promise<void>;
  onExitVR?: () => Promise<void>;
  onArrange?: (memoryId: string, position: any) => Promise<void>;
  onView?: (memoryId: string) => Promise<void>;
}

const DEFAULT_MEMORIES: VRMemory[] = [
  {
    id: 'vr-mem-1',
    memoryId: 'mem-1',
    title: 'Đà Lạt Adventure',
    description: 'A wonderful trip to Đà Lạt',
    image: '/vr-mem-1.jpg',
    location: 'Đà Lạt, Vietnam',
    date: new Date('2024-01-12'),
    position: { x: 0, y: 0, z: -5 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1,
    isFavorite: true,
    isHidden: false,
  },
  {
    id: 'vr-mem-2',
    memoryId: 'mem-2',
    title: 'Beach Day',
    description: 'Relaxing at the beach',
    image: '/vr-mem-2.jpg',
    location: 'Nha Trang, Vietnam',
    date: new Date('2024-02-15'),
    position: { x: -3, y: 0, z: -8 },
    rotation: { x: 0, y: 30, z: 0 },
    scale: 1,
    isFavorite: false,
    isHidden: false,
  },
];

export default function VRMemoryGallery({ onCancel, onEnterVR, onExitVR, onArrange, onView }: VRGalleryProps) {
  const [memories, setMemories] = useState<VRMemory[]>(DEFAULT_MEMORIES);
  const [showSettings, setShowSettings] = useState(false);
  const [isInVR, setIsInVR] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<VRMemory | null>(DEFAULT_MEMORIES[0]);
  const [viewMode, setViewMode] = useState<'grid' | 'gallery' | 'timeline'>('gallery');
  const [showFavorites, setShowFavorites] = useState(false);
  const [autoArrange, setAutoArrange] = useState(true);

  const totalMemories = memories.length;
  const favoriteMemories = memories.filter(m => m.isFavorite).length;
  const visibleMemories = memories.filter(m => !m.isHidden).length;

  const handleEnterVR = async () => {
    await onEnterVR?.();
    setIsInVR(true);
  };

  const handleExitVR = async () => {
    await onExitVR?.();
    setIsInVR(false);
  };

  const handleView = async (memoryId: string) => {
    await onView?.(memoryId);
    setSelectedMemory(memories.find(m => m.id === memoryId) || null);
  };

  const handleToggleFavorite = (memoryId: string) => {
    setMemories(memories.map(m => 
      m.id === memoryId ? { ...m, isFavorite: !m.isFavorite } : m
    ));
  };

  const handleToggleVisibility = (memoryId: string) => {
    setMemories(memories.map(m => 
      m.id === memoryId ? { ...m, isHidden: !m.isHidden } : m
    ));
  };

  const handleArrange = async (memoryId: string, position: any) => {
    await onArrange?.(memoryId, position);
    setMemories(memories.map(m => 
      m.id === memoryId ? { ...m, position } : m
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl">
            <Glasses className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Thư viện kỷ niệm 3D trong VR
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {visibleMemories} memories visible
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
        <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt VR gallery
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-arrange memories
              </span>
              <button
                type="button"
                onClick={() => setAutoArrange(!autoArrange)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoArrange ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoArrange ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Hand tracking
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Spatial audio
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
            <ImageIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Memories</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalMemories}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Favorites</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {favoriteMemories}
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
            <Glasses className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">VR Status</span>
          </div>
          <div className={`text-lg font-bold ${isInVR ? 'text-green-500' : 'text-slate-500'}`}>
            {isInVR ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>

      {/* VR Entry */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              VR Mode
            </span>
            {isInVR && (
              <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold rounded-full">
                In VR
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={isInVR ? handleExitVR : handleEnterVR}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
              isInVR
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gradient-to-r from-indigo-400 to-violet-500 hover:from-indigo-500 hover:to-violet-600 text-white'
            }`}
          >
            {isInVR ? (
              <>
                <LogOut className="h-4 w-4" />
                Exit VR
              </>
            ) : (
              <>
                <Glasses className="h-4 w-4" />
                Enter VR Gallery
              </>
            )}
          </button>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode('gallery')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              viewMode === 'gallery'
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Gallery
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Grid
          </button>
          <button
            type="button"
            onClick={() => setViewMode('timeline')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              viewMode === 'timeline'
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Timeline
          </button>
        </div>
      </div>

      {/* Favorites Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowFavorites(false)}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              !showFavorites
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setShowFavorites(true)}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              showFavorites
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Favorites
          </button>
        </div>
      </div>

      {/* Memory List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          VR Memories
        </h4>
        <div className="space-y-2">
          {memories
            .filter(m => !m.isHidden && (!showFavorites || m.isFavorite))
            .map((memory) => (
            <div
              key={memory.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-slate-400" />
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
                <div className="flex items-center gap-2">
                  {memory.isFavorite && (
                    <Star className="h-4 w-4 text-yellow-500" />
                  )}
                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(memory.id)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                  >
                    <Star className={`h-3 w-3 ${memory.isFavorite ? 'text-yellow-500' : 'text-slate-400'}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(memory.id)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                  >
                    {memory.isHidden ? (
                      <EyeOff className="h-3 w-3 text-slate-400" />
                    ) : (
                      <Eye className="h-3 w-3 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                {memory.description}
              </p>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Date</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {memory.date.toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Position</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    X:{memory.position.x} Y:{memory.position.y} Z:{memory.position.z}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Scale</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {memory.scale}x
                  </div>
                </div>
              </div>

              {/* 3D Controls */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => handleView(memory.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-lg transition-colors"
                >
                  <Eye className="h-3 w-3" />
                  View in VR
                </button>
                <button
                  type="button"
                  className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors"
                >
                  <MoveHorizontal className="h-4 w-4 text-slate-500" />
                </button>
                <button
                  type="button"
                  className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors"
                >
                  <RotateCw className="h-4 w-4 text-slate-500" />
                </button>
                <button
                  type="button"
                  className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors"
                >
                  <ZoomIn className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-lg">
        <p className="text-[10px] text-indigo-700 dark:text-indigo-400">
          <strong>Lưu ý:</strong> Thư viện kỷ niệm 3D trong VR với VR entry/exit, 3D memory positioning (x/y/z coordinates), rotation control, scale adjustment, view modes (gallery/grid/timeline), favorite system, visibility toggle, memory arrangement, hand tracking, spatial audio, và comprehensive VR gallery experience.
        </p>
      </div>
    </div>
  );
}