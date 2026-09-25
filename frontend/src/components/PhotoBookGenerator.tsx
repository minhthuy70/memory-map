'use client';

import { useState } from 'react';
import { X, Settings, Download, BookOpen, CheckCircle, AlertTriangle, Loader2, Image as ImageIcon, MapPin, Calendar as CalendarIcon, Filter, Check, Play, Pause, RefreshCw, ChevronDown, ChevronUp, Layout, Share2, Eye, EyeOff, File, Book, Layers, Copy, Grid as GridIcon, LayoutGrid, Sparkles, ImagePlus, Move, RotateCw, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';

interface PhotoBookGeneratorProps {
  onCancel?: () => void;
  onExport?: (options: PhotoBookOptions) => void;
}

interface PhotoBookOptions {
  bookSize: 'A4' | 'A5' | 'letter' | 'square';
  orientation: 'portrait' | 'landscape';
  pageLayout: 'single' | 'double' | 'collage';
  coverStyle: 'hardcover' | 'softcover' | 'none';
  coverImage: boolean;
  coverTitle: string;
  coverSubtitle: string;
  backgroundColor: string;
  quality: 'standard' | 'high' | 'premium';
  pageSize: number;
  autoLayout: boolean;
  includeCaptions: boolean;
  includeDates: boolean;
  includeLocations: boolean;
  pageNumbers: boolean;
  spineText: string;
  bleedMargin: number;
}

export default function PhotoBookGenerator({ onCancel, onExport }: PhotoBookGeneratorProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<'idle' | 'generating' | 'rendering' | 'finalizing' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<number>(0);
  const [totalPhotos, setTotalPhotos] = useState(50);

  const [options, setOptions] = useState<PhotoBookOptions>({
    bookSize: 'A4',
    orientation: 'landscape',
    pageLayout: 'collage',
    coverStyle: 'hardcover',
    coverImage: true,
    coverTitle: 'My Memories',
    coverSubtitle: 'A collection of moments',
    backgroundColor: '#ffffff',
    quality: 'high',
    pageSize: 20,
    autoLayout: true,
    includeCaptions: true,
    includeDates: true,
    includeLocations: false,
    pageNumbers: true,
    spineText: 'My Memories',
    bleedMargin: 5,
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

    setExportStatus('finalizing');
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
          <div className="p-2 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Photo Book Generator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create printable photo book with auto layout
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
            Photo Book Settings
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Book size
                </label>
                <select
                  value={options.bookSize}
                  onChange={(e) => setOptions({ ...options, bookSize: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="A4">A4</option>
                  <option value="A5">A5</option>
                  <option value="letter">Letter</option>
                  <option value="square">Square (8x8)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Orientation
                </label>
                <select
                  value={options.orientation}
                  onChange={(e) => setOptions({ ...options, orientation: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Page layout
                </label>
                <select
                  value={options.pageLayout}
                  onChange={(e) => setOptions({ ...options, pageLayout: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="single">Single photo per page</option>
                  <option value="double">Double spread</option>
                  <option value="collage">Collage (auto)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Cover style
                </label>
                <select
                  value={options.coverStyle}
                  onChange={(e) => setOptions({ ...options, coverStyle: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="hardcover">Hardcover</option>
                  <option value="softcover">Softcover</option>
                  <option value="none">No cover</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                Cover title
              </label>
              <input
                type="text"
                value={options.coverTitle}
                onChange={(e) => setOptions({ ...options, coverTitle: e.target.value })}
                className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                Cover subtitle
              </label>
              <input
                type="text"
                value={options.coverSubtitle}
                onChange={(e) => setOptions({ ...options, coverSubtitle: e.target.value })}
                className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                Spine text
              </label>
              <input
                type="text"
                value={options.spineText}
                onChange={(e) => setOptions({ ...options, spineText: e.target.value })}
                className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Background color
                </label>
                <input
                  type="color"
                  value={options.backgroundColor}
                  onChange={(e) => setOptions({ ...options, backgroundColor: e.target.value })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full h-8"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Quality
                </label>
                <select
                  value={options.quality}
                  onChange={(e) => setOptions({ ...options, quality: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="standard">Standard</option>
                  <option value="high">High</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                Page count: {options.pageSize}
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={options.pageSize}
                onChange={(e) => setOptions({ ...options, pageSize: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                Bleed margin: {options.bleedMargin}mm
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={options.bleedMargin}
                onChange={(e) => setOptions({ ...options, bleedMargin: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Auto layout
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, autoLayout: !options.autoLayout })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.autoLayout ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.autoLayout ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Cover image
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, coverImage: !options.coverImage })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.coverImage ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.coverImage ? 'translate-x-5' : ''
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
                  Include dates
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, includeDates: !options.includeDates })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.includeDates ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.includeDates ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Include locations
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, includeLocations: !options.includeLocations })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.includeLocations ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.includeLocations ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Page numbers
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, pageNumbers: !options.pageNumbers })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.pageNumbers ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.pageNumbers ? 'translate-x-5' : ''
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
              Photo Book Summary
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
              <span className="text-slate-500 dark:text-slate-400">Photos:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                {selectedPhotos}/{totalPhotos}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Book size:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                {options.bookSize}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Pages:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                {options.pageSize}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Layout:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white capitalize">
                {options.pageLayout}
              </span>
            </div>
          </div>
        </div>

        {showPreview && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                Photo Book Preview
              </h4>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                  title="Zoom out"
                >
                  <ZoomOut className="h-4 w-4 text-slate-500" />
                </button>
                <button
                  type="button"
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                  title="Zoom in"
                >
                  <ZoomIn className="h-4 w-4 text-slate-500" />
                </button>
                <button
                  type="button"
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                  title="Maximize"
                >
                  <Maximize2 className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-600 aspect-[3/4] flex items-center justify-center">
              <div className="text-center">
                <Book className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Photo Book Preview
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {options.bookSize} - {options.orientation}
                </p>
              </div>
            </div>
          </div>
        )}

        {exportStatus !== 'idle' && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Generating...
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {exportProgress}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
              <div
                className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              {exportStatus === 'generating' && <Layers className="h-3 w-3" />}
              {exportStatus === 'rendering' && <Sparkles className="h-3 w-3" />}
              {exportStatus === 'finalizing' && <CheckCircle className="h-3 w-3" />}
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
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Generate Photo Book
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
