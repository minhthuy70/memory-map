'use client';

import { useState } from 'react';
import { X, Settings, Download, Play, CheckCircle, AlertTriangle, Loader2, Image as ImageIcon, MapPin, Calendar as CalendarIcon, Filter, Check, Pause, RefreshCw, ChevronDown, ChevronUp, Layout, Share2, Eye, EyeOff, File, Film, Layers, Copy, PlayCircle, SkipBack, SkipForward, Volume2, Timer, Music, Sparkles, Zap } from 'lucide-react';

interface SlideshowExportProps {
  onCancel?: () => void;
  onExport?: (options: SlideshowOptions) => void;
}

interface SlideshowOptions {
  format: 'mp4' | 'webm' | 'gif' | 'pptx';
  resolution: '720p' | '1080p' | '4k';
  frameRate: number;
  duration: number;
  transition: 'fade' | 'slide' | 'zoom' | 'none';
  transitionDuration: number;
  includeMusic: boolean;
  musicVolume: number;
  includeCaptions: boolean;
  captionStyle: 'bottom' | 'top' | 'overlay';
  autoAdvance: boolean;
  advanceInterval: number;
  loop: boolean;
  aspectRatio: '16:9' | '4:3' | '1:1';
  quality: 'low' | 'medium' | 'high';
}

export default function SlideshowExport({ onCancel, onExport }: SlideshowExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<'idle' | 'generating' | 'rendering' | 'encoding' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [selectedSlides, setSelectedSlides] = useState<number>(0);
  const [totalSlides, setTotalSlides] = useState(50);

  const [options, setOptions] = useState<SlideshowOptions>({
    format: 'mp4',
    resolution: '1080p',
    frameRate: 30,
    duration: 5,
    transition: 'fade',
    transitionDuration: 1,
    includeMusic: false,
    musicVolume: 50,
    includeCaptions: true,
    captionStyle: 'bottom',
    autoAdvance: true,
    advanceInterval: 5,
    loop: false,
    aspectRatio: '16:9',
    quality: 'high',
  });

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    setExportStatus('generating');
    setExportProgress(10);
    await new Promise(resolve => setTimeout(resolve, 500));

    setExportStatus('rendering');
    setExportProgress(30);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setExportStatus('encoding');
    setExportProgress(70);
    await new Promise(resolve => setTimeout(resolve, 500));

    setExportStatus('done');
    setExportProgress(100);
    await onExport?.(options);

    setTimeout(() => {
      setIsExporting(false);
      setExportStatus('idle');
      setExportProgress(0);
    }, 1000);
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl">
            <Film className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Slideshow Export
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Export slideshow as video or presentation
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
            <Settings className="h-4 w-4 text-slate-500" />
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
        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Slideshow Export Settings
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Format
                </label>
                <select
                  value={options.format}
                  onChange={(e) => setOptions({ ...options, format: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="mp4">MP4 Video</option>
                  <option value="webm">WebM Video</option>
                  <option value="gif">GIF Animation</option>
                  <option value="pptx">PowerPoint (.pptx)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Resolution
                </label>
                <select
                  value={options.resolution}
                  onChange={(e) => setOptions({ ...options, resolution: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="720p">720p (HD)</option>
                  <option value="1080p">1080p (Full HD)</option>
                  <option value="4k">4K (Ultra HD)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Frame rate: {options.frameRate} fps
                </label>
                <input
                  type="range"
                  min="15"
                  max="60"
                  step="5"
                  value={options.frameRate}
                  onChange={(e) => setOptions({ ...options, frameRate: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Aspect ratio
                </label>
                <select
                  value={options.aspectRatio}
                  onChange={(e) => setOptions({ ...options, aspectRatio: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="16:9">16:9 (Widescreen)</option>
                  <option value="4:3">4:3 (Standard)</option>
                  <option value="1:1">1:1 (Square)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Slide duration: {options.duration}s
                </label>
                <input
                  type="range"
                  min="2"
                  max="15"
                  value={options.duration}
                  onChange={(e) => setOptions({ ...options, duration: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Transition
                </label>
                <select
                  value={options.transition}
                  onChange={(e) => setOptions({ ...options, transition: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="fade">Fade</option>
                  <option value="slide">Slide</option>
                  <option value="zoom">Zoom</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                Transition duration: {options.transitionDuration}s
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={options.transitionDuration}
                onChange={(e) => setOptions({ ...options, transitionDuration: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Quality
                </label>
                <select
                  value={options.quality}
                  onChange={(e) => setOptions({ ...options, quality: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Caption style
                </label>
                <select
                  value={options.captionStyle}
                  onChange={(e) => setOptions({ ...options, captionStyle: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="bottom">Bottom</option>
                  <option value="top">Top</option>
                  <option value="overlay">Overlay</option>
                </select>
              </div>
            </div>
            {options.includeMusic && (
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Music volume: {options.musicVolume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={options.musicVolume}
                  onChange={(e) => setOptions({ ...options, musicVolume: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            )}
            {options.autoAdvance && (
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Advance interval: {options.advanceInterval}s
                </label>
                <input
                  type="range"
                  min="3"
                  max="15"
                  value={options.advanceInterval}
                  onChange={(e) => setOptions({ ...options, advanceInterval: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Include music
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, includeMusic: !options.includeMusic })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.includeMusic ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.includeMusic ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Include captions
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, includeCaptions: !options.includeCaptions })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.includeCaptions ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.includeCaptions ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Auto advance
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, autoAdvance: !options.autoAdvance })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.autoAdvance ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.autoAdvance ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Loop playback
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, loop: !options.loop })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.loop ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.loop ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Slideshow Summary
            </h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePreview}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                title="Preview"
              >
                {showPreview ? <EyeOff className="h-4 w-4 text-slate-500" /> : <Eye className="h-4 w-4 text-slate-500" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Slides:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                {selectedSlides}/{totalSlides}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Format:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white uppercase">
                {options.format}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Resolution:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                {options.resolution}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Duration:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                {options.duration}s per slide
              </span>
            </div>
          </div>
        </div>

        {showPreview && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                Slideshow Preview
              </h4>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                  title="Previous"
                >
                  <SkipBack className="h-4 w-4 text-slate-500" />
                </button>
                <button
                  type="button"
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                  title="Play/Pause"
                >
                  <PlayCircle className="h-4 w-4 text-slate-500" />
                </button>
                <button
                  type="button"
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                  title="Next"
                >
                  <SkipForward className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-600 aspect-[16/9] flex items-center justify-center">
              <div className="text-center">
                <Play className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Slideshow Preview
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {options.resolution} - {options.aspectRatio}
                </p>
              </div>
            </div>
          </div>
        )}

        {exportStatus !== 'idle' && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Exporting...
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {exportProgress}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
              <div
                className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              {exportStatus === 'generating' && <Layers className="h-3 w-3" />}
              {exportStatus === 'rendering' && <Sparkles className="h-3 w-3" />}
              {exportStatus === 'encoding' && <Zap className="h-3 w-3" />}
              {exportStatus === 'done' && <Check className="h-3 w-3 text-green-500" />}
              {exportStatus === 'error' && <AlertTriangle className="h-3 w-3 text-red-500" />}
              <span className="capitalize">{exportStatus}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export Slideshow
              </>
            )}
          </button>
          <button
            type="button"
            className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
