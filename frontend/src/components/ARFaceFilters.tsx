'use client';

import { useState } from 'react';
import { X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Smile, RefreshCw, Check, Zap as ZapIcon, Plus, Layers, Shield, Image as ImageIcon, Eye, EyeOff, Trash2 as TrashIcon, ExternalLink, RotateCw, ZoomIn, ZoomOut, Maximize2, Sparkles, Wand2, Palette, Sliders, Star, Zap as ZapIcon2, Flame, Sparkles as SparklesIcon } from 'lucide-react';

interface ARFaceFilter {
  id: string;
  photoId: string;
  name: string;
  type: 'mask' | 'accessory' | 'effect' | 'color';
  intensity: number;
  opacity: number;
  isLocked: boolean;
  isVisible: boolean;
  color: string;
  preset: string;
}

interface ARFaceFiltersProps {
  onCancel?: () => void;
  onAddFilter?: (filter: Partial<ARFaceFilter>) => Promise<void>;
  onRemoveFilter?: (filterId: string) => Promise<void>;
  onUpdateFilter?: (filterId: string, updates: Partial<ARFaceFilter>) => Promise<void>;
}

const DEFAULT_FILTERS: ARFaceFilter[] = [
  {
    id: 'filter-1',
    photoId: 'photo-1',
    name: 'Cute Cat Ears',
    type: 'mask',
    intensity: 80,
    opacity: 100,
    isLocked: false,
    isVisible: true,
    color: '#FFB6C1',
    preset: 'cat-ears',
  },
  {
    id: 'filter-2',
    photoId: 'photo-1',
    name: 'Glowing Skin',
    type: 'effect',
    intensity: 60,
    opacity: 90,
    isLocked: false,
    isVisible: true,
    color: '#FFD700',
    preset: 'glow',
  },
];

const FILTER_PRESETS = [
  { id: 'cat-ears', name: 'Cat Ears', type: 'mask', icon: '🐱' },
  { id: 'dog-ears', name: 'Dog Ears', type: 'mask', icon: '🐶' },
  { id: 'crown', name: 'Crown', type: 'accessory', icon: '👑' },
  { id: 'glasses', name: 'Cool Glasses', type: 'accessory', icon: '🕶️' },
  { id: 'glow', name: 'Glowing Skin', type: 'effect', icon: '✨' },
  { id: 'smooth', name: 'Smooth Skin', type: 'effect', icon: '🧴' },
  { id: 'warm', name: 'Warm Tone', type: 'color', icon: '🌅' },
  { id: 'cool', name: 'Cool Tone', type: 'color', icon: '❄️' },
] as const;

export default function ARFaceFilters({ onCancel, onAddFilter, onRemoveFilter, onUpdateFilter }: ARFaceFiltersProps) {
  const [filters, setFilters] = useState<ARFaceFilter[]>(DEFAULT_FILTERS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<ARFaceFilter | null>(DEFAULT_FILTERS[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('cat-ears');
  const [autoDetect, setAutoDetect] = useState(true);

  const totalFilters = filters.length;
  const visibleFilters = filters.filter(f => f.isVisible).length;
  const lockedFilters = filters.filter(f => f.isLocked).length;

  const handleAddFilter = async (filter: Partial<ARFaceFilter>) => {
    await onAddFilter?.(filter);
    const preset = FILTER_PRESETS.find(p => p.id === selectedPreset);
    const newFilter: ARFaceFilter = {
      id: `filter-${Date.now()}`,
      photoId: filter.photoId || 'photo-1',
      name: filter.name || preset?.name || 'New Filter',
      type: (filter.type || preset?.type || 'mask') as ARFaceFilter['type'],
      intensity: filter.intensity || 80,
      opacity: filter.opacity || 100,
      isLocked: false,
      isVisible: true,
      color: filter.color || '#FFB6C1',
      preset: filter.preset || selectedPreset,
    };
    setFilters([newFilter, ...filters]);
    setIsAdding(false);
  };

  const handleRemoveFilter = async (filterId: string) => {
    await onRemoveFilter?.(filterId);
    setFilters(filters.filter(f => f.id !== filterId));
  };

  const handleUpdateFilter = async (filterId: string, updates: Partial<ARFaceFilter>) => {
    await onUpdateFilter?.(filterId, updates);
    setFilters(filters.map(f => 
      f.id === filterId ? { ...f, ...updates } : f
    ));
  };

  const handleToggleVisibility = (filterId: string) => {
    setFilters(filters.map(f => 
      f.id === filterId ? { ...f, isVisible: !f.isVisible } : f
    ));
  };

  const handleToggleLock = (filterId: string) => {
    setFilters(filters.map(f => 
      f.id === filterId ? { ...f, isLocked: !f.isLocked } : f
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl">
            <Smile className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Filter khuôn mặt AR cho ảnh kỷ niệm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalFilters} filters
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
        <div className="mb-4 p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt AR face filters
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-detect faces
              </span>
              <button
                type="button"
                onClick={() => setAutoDetect(!autoDetect)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoDetect ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-600'
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
                Face tracking
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Real-time rendering
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
            <Smile className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Filters</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalFilters}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Visible</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {visibleFilters}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Locked</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {lockedFilters}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <SparklesIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Presets</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {FILTER_PRESETS.length}
          </div>
        </div>
      </div>

      {/* Add Filter */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          {isAdding ? 'Cancel' : 'Add New Filter'}
        </button>

        {isAdding && (
          <div className="mt-4 p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-2 block">
                  Select Preset
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {FILTER_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedPreset(preset.id)}
                      className={`p-3 text-2xl rounded-lg transition-colors ${
                        selectedPreset === preset.id
                          ? 'bg-rose-100 dark:bg-rose-900/30 border-2 border-rose-500'
                          : 'bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500'
                      }`}
                    >
                      {preset.icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Filter Name
                </label>
                <input
                  type="text"
                  placeholder="Filter name"
                  defaultValue={FILTER_PRESETS.find(p => p.id === selectedPreset)?.name}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Filter Color
                </label>
                <input
                  type="color"
                  defaultValue="#FFB6C1"
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>
              <button
                type="button"
                onClick={() => handleAddFilter({ preset: selectedPreset })}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Check className="h-4 w-4" />
                Add Filter
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Editor */}
      {selectedFilter && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Filter Editor
              </span>
              <div className="flex items-center gap-2">
                {selectedFilter.isLocked && (
                  <span className="px-2 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-semibold rounded-full">
                    Locked
                  </span>
                )}
              </div>
            </div>

            {/* Photo Canvas */}
            <div className="aspect-video bg-slate-200 dark:bg-slate-600 rounded-lg mb-3 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Photo Canvas
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-400">
                    Face detection active
                  </p>
                </div>
              </div>

              {/* Face Indicator */}
              {autoDetect && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-rose-500 rounded-full flex items-center justify-center">
                  <Smile className="h-8 w-8 text-rose-500" />
                </div>
              )}

              {/* Filter Overlay */}
              {selectedFilter.isVisible && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-rose-500/80 backdrop-blur-sm rounded-lg">
                  <span className="text-xs text-white font-semibold">{selectedFilter.name}</span>
                </div>
              )}
            </div>

            {/* Filter Controls */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Intensity</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {selectedFilter.intensity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedFilter.intensity}
                  onChange={(e) => handleUpdateFilter(selectedFilter.id, { intensity: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Opacity</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {selectedFilter.opacity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedFilter.opacity}
                  onChange={(e) => handleUpdateFilter(selectedFilter.id, { opacity: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleLock(selectedFilter.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  {selectedFilter.isLocked ? (
                    <>
                      <Check className="h-3 w-3" />
                      Unlock
                    </>
                  ) : (
                    <>
                      <ZapIcon2 className="h-3 w-3" />
                      Lock
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleVisibility(selectedFilter.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  {selectedFilter.isVisible ? (
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
        </div>
      )}

      {/* Filter List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          AR Face Filters
        </h4>
        <div className="space-y-2">
          {filters.map((filter) => (
            <div
              key={filter.id}
              className={`p-4 rounded-lg border-2 ${
                selectedFilter?.id === filter.id
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                  : filter.isVisible
                  ? 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                  : 'bg-slate-100 dark:bg-slate-600/50 border-slate-300 dark:border-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                    <Wand2 className="h-6 w-6 text-slate-400" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {filter.name}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {filter.type}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {filter.isLocked && (
                    <ZapIcon2 className="h-4 w-4 text-rose-500" />
                  )}
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(filter.id)}
                    className="p-1"
                  >
                    {filter.isVisible ? (
                      <Eye className="h-3 w-3 text-slate-400" />
                    ) : (
                      <EyeOff className="h-3 w-3 text-slate-400" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveFilter(filter.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <TrashIcon className="h-3 w-3 text-red-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Intensity</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {filter.intensity}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Opacity</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {filter.opacity}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Preset</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 capitalize">
                    {filter.preset}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFilter(filter)}
                className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-rose-100 dark:bg-rose-900/30 hover:bg-rose-200 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-lg transition-colors"
              >
                <Sparkles className="h-3 w-3" />
                Edit Filter
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg">
        <p className="text-[10px] text-rose-700 dark:text-rose-400">
          <strong>Lưu ý:</strong> Filter khuôn mặt AR cho ảnh kỷ niệm với face detection, face tracking, filter presets (masks/accessories/effects/colors), intensity adjustment, opacity control, lock/unlock filters, visibility toggle, real-time rendering, color customization, và comprehensive AR face filter system.
        </p>
      </div>
    </div>
  );
}