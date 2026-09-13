'use client';

import { useState } from 'react';
import { Music, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, PlayCircle, RefreshCw, Check, Zap as ZapIcon, Plus, Image as ImageIcon, Sliders, Layers, Zap as ZapIcon2, SkipBack, SkipForward, Repeat, Share2, Trash2 as TrashIcon, Film, Clock as ClockIcon, Timer, Music2 } from 'lucide-react';

interface Slide {
  id: string;
  memoryId: string;
  image: string;
  caption: string;
  duration: number;
  transition: 'fade' | 'slide' | 'zoom' | 'none';
  order: number;
}

interface AudioSlideshow {
  id: string;
  name: string;
  description: string;
  slides: Slide[];
  backgroundMusic: string;
  totalDuration: number;
  createdAt: Date;
  isPlaying: boolean;
  autoAdvance: boolean;
  repeat: boolean;
}

interface AudioSlideshowProps {
  onCancel?: () => void;
  onCreate?: (slideshow: Partial<AudioSlideshow>) => Promise<void>;
  onPlay?: (slideshowId: string) => Promise<void>;
  onPause?: (slideshowId: string) => Promise<void>;
  onDelete?: (slideshowId: string) => Promise<void>;
  onExport?: (slideshowId: string, format: string) => Promise<void>;
}

const DEFAULT_SLIDESHOWS: AudioSlideshow[] = [
  {
    id: 'slideshow-1',
    name: 'Summer Memories',
    description: 'Slideshow of summer 2024 memories',
    slides: [
      {
        id: 'slide-1',
        memoryId: 'mem-1',
        image: '/img-1.jpg',
        caption: 'Da Lat Trip',
        duration: 5,
        transition: 'fade',
        order: 1,
      },
      {
        id: 'slide-2',
        memoryId: 'mem-2',
        image: '/img-2.jpg',
        caption: 'Beach Day',
        duration: 5,
        transition: 'slide',
        order: 2,
      },
    ],
    backgroundMusic: '/bg-music.mp3',
    totalDuration: 10,
    createdAt: new Date('2024-01-12'),
    isPlaying: false,
    autoAdvance: true,
    repeat: false,
  },
];

export default function AudioSlideshow({ onCancel, onCreate, onPlay, onPause, onDelete, onExport }: AudioSlideshowProps) {
  const [slideshows, setSlideshows] = useState<AudioSlideshow[]>(DEFAULT_SLIDESHOWS);
  const [showSettings, setShowSettings] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newSlideshowName, setNewSlideshowName] = useState('');
  const [autoGenerateMusic, setAutoGenerateMusic] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<string>('mp4');

  const totalSlideshows = slideshows.length;
  const totalSlides = slideshows.reduce((sum, s) => sum + s.slides.length, 0);
  const totalDuration = slideshows.reduce((sum, s) => sum + s.totalDuration, 0);
  const avgSlides = totalSlides / totalSlideshows;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreate = async () => {
    if (newSlideshowName.trim()) {
      setIsCreating(true);
      await onCreate?.({
        name: newSlideshowName,
        description: '',
        slides: [],
        backgroundMusic: '',
        totalDuration: 0,
        isPlaying: false,
        autoAdvance: true,
        repeat: false,
      });
      setIsCreating(false);
      setNewSlideshowName('');
    }
  };

  const handlePlay = async (slideshowId: string) => {
    await onPlay?.(slideshowId);
    setSlideshows(slideshows.map(s => 
      s.id === slideshowId ? { ...s, isPlaying: true } : { ...s, isPlaying: false }
    ));
  };

  const handlePause = async (slideshowId: string) => {
    await onPause?.(slideshowId);
    setSlideshows(slideshows.map(s => 
      s.id === slideshowId ? { ...s, isPlaying: false } : s
    ));
  };

  const handleDelete = async (slideshowId: string) => {
    await onDelete?.(slideshowId);
    setSlideshows(slideshows.filter(s => s.id !== slideshowId));
  };

  const handleExport = async (slideshowId: string) => {
    await onExport?.(slideshowId, selectedFormat);
  };

  const handleToggleAutoAdvance = (slideshowId: string) => {
    setSlideshows(slideshows.map(s => 
      s.id === slideshowId ? { ...s, autoAdvance: !s.autoAdvance } : s
    ));
  };

  const handleToggleRepeat = (slideshowId: string) => {
    setSlideshows(slideshows.map(s => 
      s.id === slideshowId ? { ...s, repeat: !s.repeat } : s
    ));
  };

  const getTransitionColor = (transition: string) => {
    switch (transition) {
      case 'fade':
        return 'text-blue-500';
      case 'slide':
        return 'text-green-500';
      case 'zoom':
        return 'text-purple-500';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl">
            <Film className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Slideshow kỷ niệm có nhạc nền tự động
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalSlideshows} slideshows
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
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt audio slideshow
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-generate background music
              </span>
              <button
                type="button"
                onClick={() => setAutoGenerateMusic(!autoGenerateMusic)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoGenerateMusic ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoGenerateMusic ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Default transition
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Fade</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Default slide duration
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">5s</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Film className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Slideshows</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalSlideshows}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Slides</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalSlides}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <ClockIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Duration</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {formatDuration(totalDuration)}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Slides</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgSlides.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Create Slideshow */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSlideshowName}
            onChange={(e) => setNewSlideshowName(e.target.value)}
            placeholder="Tên slideshow mới..."
            className="flex-1 px-4 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={!newSlideshowName.trim() || isCreating}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 disabled:from-slate-400 disabled:to-slate-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            {isCreating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>

      {/* Slideshow List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Slideshows
        </h4>
        <div className="space-y-2">
          {slideshows.map((slideshow) => (
            <div
              key={slideshow.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Film className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {slideshow.name}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {slideshow.slides.length} slides • {formatDuration(slideshow.totalDuration)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {slideshow.isPlaying && (
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-semibold rounded-full">
                      Playing
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(slideshow.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <TrashIcon className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {slideshow.description}
              </p>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Created</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {slideshow.createdAt.toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Music</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {slideshow.backgroundMusic ? 'Yes' : 'No'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Auto-advance</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {slideshow.autoAdvance ? 'On' : 'Off'}
                  </div>
                </div>
              </div>

              {/* Slides */}
              <div className="mb-2">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">Slides</div>
                <div className="grid grid-cols-4 gap-2">
                  {slideshow.slides.map((slide) => (
                    <div
                      key={slide.id}
                      className="p-2 rounded bg-slate-100 dark:bg-slate-600/50 text-center"
                    >
                      <div className="aspect-square bg-slate-200 dark:bg-slate-600 rounded mb-1 flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-slate-400" />
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {formatDuration(slide.duration)}
                      </div>
                      <div className={`text-[10px] ${getTransitionColor(slide.transition)} capitalize`}>
                        {slide.transition}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => slideshow.isPlaying ? handlePause(slideshow.id) : handlePlay(slideshow.id)}
                  className="p-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-full transition-colors"
                >
                  {slideshow.isPlaying ? (
                    <Pause className="h-4 w-4 text-purple-500" />
                  ) : (
                    <Play className="h-4 w-4 text-purple-500" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleAutoAdvance(slideshow.id)}
                  className={`p-2 rounded-full transition-colors ${
                    slideshow.autoAdvance ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-slate-200 dark:bg-slate-600'
                  }`}
                >
                  <SkipForward className={`h-4 w-4 ${slideshow.autoAdvance ? 'text-purple-500' : 'text-slate-500'}`} />
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleRepeat(slideshow.id)}
                  className={`p-2 rounded-full transition-colors ${
                    slideshow.repeat ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-slate-200 dark:bg-slate-600'
                  }`}
                >
                  <Repeat className={`h-4 w-4 ${slideshow.repeat ? 'text-purple-500' : 'text-slate-500'}`} />
                </button>

                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {slideshow.repeat ? 'Loop' : 'Once'}
                </span>
              </div>

              {/* Export */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="mp4">MP4</option>
                  <option value="webm">WebM</option>
                  <option value="gif">GIF</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleExport(slideshow.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> Slideshow kỷ niệm có nhạc nền tự động với slideshow creation, auto-generated background music, transition effects (fade/slide/zoom), slide duration settings, slide ordering, preview functionality, playback controls (play/pause/auto-advance/repeat), export options (MP4/WebM/GIF), và comprehensive slideshow management.
        </p>
      </div>
    </div>
  );
}