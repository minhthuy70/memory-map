'use client';

import { useState } from 'react';
import { Video, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Sparkles, RefreshCw, Check, Zap as ZapIcon, Sliders, Layers, Plus, Trash2 as TrashIcon, Eye, EyeOff, Sliders as SlidersIcon, Contrast, Sun, Droplets, Palette, Image as ImageIcon } from 'lucide-react';

interface VideoFilter {
  id: string;
  name: string;
  type: 'color' | 'blur' | 'sharpen' | 'noise' | 'vignette' | 'brightness' | 'contrast' | 'saturation';
  intensity: number;
  isEnabled: boolean;
}

interface VideoEffect {
  id: string;
  name: string;
  type: 'transition' | 'animation' | 'overlay' | 'speed' | 'reverse';
  intensity: number;
  isEnabled: boolean;
}

interface VideoWithFilters {
  id: string;
  videoId: string;
  videoName: string;
  filters: VideoFilter[];
  effects: VideoEffect[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  startedAt: Date;
  completedAt: Date | null;
}

interface VideoFiltersAndEffectsProps {
  onCancel?: () => void;
  onApplyFilter?: (videoId: string, filter: VideoFilter) => Promise<void>;
  onApplyEffect?: (videoId: string, effect: VideoEffect) => Promise<void>;
  onRender?: (videoId: string) => Promise<void>;
  onPreview?: (videoId: string) => Promise<void>;
}

const DEFAULT_FILTERS: VideoFilter[] = [
  {
    id: 'filter-1',
    name: 'Brightness',
    type: 'brightness',
    intensity: 50,
    isEnabled: true,
  },
  {
    id: 'filter-2',
    name: 'Contrast',
    type: 'contrast',
    intensity: 50,
    isEnabled: false,
  },
  {
    id: 'filter-3',
    name: 'Saturation',
    type: 'saturation',
    intensity: 50,
    isEnabled: false,
  },
  {
    id: 'filter-4',
    name: 'Blur',
    type: 'blur',
    intensity: 0,
    isEnabled: false,
  },
  {
    id: 'filter-5',
    name: 'Vignette',
    type: 'vignette',
    intensity: 0,
    isEnabled: false,
  },
];

const DEFAULT_EFFECTS: VideoEffect[] = [
  {
    id: 'effect-1',
    name: 'Slow Motion',
    type: 'speed',
    intensity: 50,
    isEnabled: false,
  },
  {
    id: 'effect-2',
    name: 'Reverse',
    type: 'reverse',
    intensity: 100,
    isEnabled: false,
  },
];

const DEFAULT_VIDEOS: VideoWithFilters[] = [
  {
    id: 'vwf-1',
    videoId: 'video-1',
    videoName: 'family-vacation.mp4',
    filters: DEFAULT_FILTERS,
    effects: DEFAULT_EFFECTS,
    status: 'completed',
    progress: 100,
    startedAt: new Date('2024-01-12'),
    completedAt: new Date('2024-01-12'),
  },
];

export default function VideoFiltersAndEffects({ onCancel, onApplyFilter, onApplyEffect, onRender, onPreview }: VideoFiltersAndEffectsProps) {
  const [videos, setVideos] = useState<VideoWithFilters[]>(DEFAULT_VIDEOS);
  const [showSettings, setShowSettings] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoWithFilters | null>(DEFAULT_VIDEOS[0]);
  const [isRendering, setIsRendering] = useState(false);
  const [autoRender, setAutoRender] = useState(true);
  const [realTimePreview, setRealTimePreview] = useState(true);

  const totalVideos = videos.length;
  const completedVideos = videos.filter(v => v.status === 'completed').length;
  const activeFilters = currentVideo?.filters.filter(f => f.isEnabled).length || 0;
  const activeEffects = currentVideo?.effects.filter(e => e.isEnabled).length || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-amber-500';
      case 'processing':
        return 'text-blue-500';
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Activity className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getFilterIcon = (type: string) => {
    switch (type) {
      case 'brightness':
        return <Sun className="h-4 w-4" />;
      case 'contrast':
        return <Contrast className="h-4 w-4" />;
      case 'saturation':
        return <Palette className="h-4 w-4" />;
      case 'blur':
        return <ImageIcon className="h-4 w-4" />;
      case 'vignette':
        return <Droplets className="h-4 w-4" />;
      default:
        return <Filter className="h-4 w-4" />;
    }
  };

  const getFilterColor = (type: string) => {
    switch (type) {
      case 'brightness':
        return 'text-amber-500';
      case 'contrast':
        return 'text-slate-500';
      case 'saturation':
        return 'text-purple-500';
      case 'blur':
        return 'text-blue-500';
      case 'vignette':
        return 'text-rose-500';
      default:
        return 'text-slate-500';
    }
  };

  const handleRender = async (videoId: string) => {
    setIsRendering(true);
    await onRender?.(videoId);
    setIsRendering(false);
  };

  const handlePreview = async (videoId: string) => {
    await onPreview?.(videoId);
  };

  const handleToggleFilter = (videoId: string, filterId: string) => {
    setVideos(videos.map(v => 
      v.id === videoId 
        ? { 
            ...v, 
            filters: v.filters.map(f => 
              f.id === filterId ? { ...f, isEnabled: !f.isEnabled } : f
            )
          }
        : v
    ));
  };

  const handleUpdateFilterIntensity = (videoId: string, filterId: string, intensity: number) => {
    setVideos(videos.map(v => 
      v.id === videoId 
        ? { 
            ...v, 
            filters: v.filters.map(f => 
              f.id === filterId ? { ...f, intensity } : f
            )
          }
        : v
    ));
  };

  const handleToggleEffect = (videoId: string, effectId: string) => {
    setVideos(videos.map(v => 
      v.id === videoId 
        ? { 
            ...v, 
            effects: v.effects.map(e => 
              e.id === effectId ? { ...e, isEnabled: !e.isEnabled } : e
            )
          }
        : v
    ));
  };

  const handleUpdateEffectIntensity = (videoId: string, effectId: string, intensity: number) => {
    setVideos(videos.map(v => 
      v.id === videoId 
        ? { 
            ...v, 
            effects: v.effects.map(e => 
              e.id === effectId ? { ...e, intensity } : e
            )
          }
        : v
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Bộ lọc và hiệu ứng video
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeFilters} filters • {activeEffects} effects
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
            Cài đặt filters & effects
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-render on change
              </span>
              <button
                type="button"
                onClick={() => setAutoRender(!autoRender)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoRender ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoRender ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Real-time preview
              </span>
              <button
                type="button"
                onClick={() => setRealTimePreview(!realTimePreview)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  realTimePreview ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    realTimePreview ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                GPU acceleration
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
            <Video className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Videos</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalVideos}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Filter className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Filters</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {activeFilters}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Effects</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {activeEffects}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Rendered</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {completedVideos}
          </div>
        </div>
      </div>

      {/* Video with Filters and Effects */}
      {currentVideo && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                  <Video className="h-4 w-4 text-indigo-500" />
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {currentVideo.videoName}
                  </span>
                  <div className={`text-xs ${getStatusColor(currentVideo.status)} capitalize`}>
                    {currentVideo.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-4">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
                Filters
              </h4>
              <div className="space-y-2">
                {currentVideo.filters.map((filter) => (
                  <div
                    key={filter.id}
                    className={`p-3 rounded-lg border-2 ${
                      filter.isEnabled
                        ? 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                        : 'bg-slate-100 dark:bg-slate-600/50 border-slate-300 dark:border-slate-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${getFilterColor(filter.type)}`}>
                          {getFilterIcon(filter.type)}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {filter.name}
                          </span>
                          <div className={`text-xs ${getFilterColor(filter.type)} capitalize`}>
                            {filter.type}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleFilter(currentVideo.id, filter.id)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          filter.isEnabled ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                            filter.isEnabled ? 'translate-x-5' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                        Intensity: {filter.intensity}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filter.intensity}
                        onChange={(e) => handleUpdateFilterIntensity(currentVideo.id, filter.id, parseInt(e.target.value))}
                        disabled={!filter.isEnabled}
                        className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-50"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Effects */}
            <div className="mb-4">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
                Effects
              </h4>
              <div className="space-y-2">
                {currentVideo.effects.map((effect) => (
                  <div
                    key={effect.id}
                    className={`p-3 rounded-lg border-2 ${
                      effect.isEnabled
                        ? 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                        : 'bg-slate-100 dark:bg-slate-600/50 border-slate-300 dark:border-slate-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                          <Sparkles className="h-4 w-4 text-violet-500" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {effect.name}
                          </span>
                          <div className="text-xs text-violet-500 capitalize">
                            {effect.type}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleEffect(currentVideo.id, effect.id)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          effect.isEnabled ? 'bg-violet-500' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                            effect.isEnabled ? 'translate-x-5' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                        Intensity: {effect.intensity}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={effect.intensity}
                        onChange={(e) => handleUpdateEffectIntensity(currentVideo.id, effect.id, parseInt(e.target.value))}
                        disabled={!effect.isEnabled}
                        className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-violet-500 disabled:opacity-50"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handlePreview(currentVideo.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
              <button
                type="button"
                onClick={() => handleRender(currentVideo.id)}
                disabled={isRendering}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-400 to-violet-500 hover:from-indigo-500 hover:to-violet-600 disabled:from-slate-400 disabled:to-slate-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 ${isRendering ? 'animate-spin' : ''}`} />
                {isRendering ? 'Rendering...' : 'Render'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-lg">
        <p className="text-[10px] text-indigo-700 dark:text-indigo-400">
          <strong>Lưu ý:</strong> Bộ lọc và hiệu ứng video với filter types (brightness/contrast/saturation/blur/vignette), effect types (speed/reverse/transition/animation/overlay), intensity control, enable/disable toggle, real-time preview, auto-render on change, GPU acceleration, và comprehensive video enhancement options.
        </p>
      </div>
    </div>
  );
}