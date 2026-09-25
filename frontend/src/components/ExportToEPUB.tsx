'use client';

import { useState } from 'react';
import { X, Settings, Download, BookOpen, CheckCircle, AlertTriangle, Loader2, Image as ImageIcon, MapPin, Calendar as CalendarIcon, Filter, Check, Play, Pause, RefreshCw, ChevronDown, ChevronUp, Layout, Palette, Type, ZoomIn, ZoomOut, Smartphone, Tablet, Monitor, Share2, Eye, EyeOff, Book, FileText, Layers, Grid } from 'lucide-react';

interface ExportToEPUBProps {
  onCancel?: () => void;
  onExport?: (options: EPUBOptions) => void;
}

interface EPUBOptions {
  includeImages: boolean;
  includeMap: boolean;
  coverImage: boolean;
  chapterBy: 'date' | 'location' | 'category' | 'none';
  tocEnabled: boolean;
  fontSize: number;
  fontFamily: 'serif' | 'sans-serif' | 'mono';
  theme: 'light' | 'sepia' | 'dark';
  layout: 'reflowable' | 'fixed';
  language: string;
  author: string;
  title: string;
  description: string;
  includeMetadata: boolean;
  includeLocation: boolean;
  includeDate: boolean;
  includeMood: boolean;
  includeTags: boolean;
  pageBreaks: boolean;
  embedFonts: boolean;
  compressImages: boolean;
}

export default function ExportToEPUB({ onCancel, onExport }: ExportToEPUBProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<'idle' | 'generating' | 'packaging' | 'finalizing' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [selectedMemories, setSelectedMemories] = useState<number>(0);
  const [totalMemories, setTotalMemories] = useState(50);

  const [options, setOptions] = useState<EPUBOptions>({
    includeImages: true,
    includeMap: false,
    coverImage: true,
    chapterBy: 'date',
    tocEnabled: true,
    fontSize: 16,
    fontFamily: 'serif',
    theme: 'sepia',
    layout: 'reflowable',
    language: 'en',
    author: 'Memory Map User',
    title: 'My Memories',
    description: 'A collection of my personal memories',
    includeMetadata: true,
    includeLocation: true,
    includeDate: true,
    includeMood: true,
    includeTags: true,
    pageBreaks: true,
    embedFonts: false,
    compressImages: true,
  });

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    setExportStatus('generating');
    setExportProgress(10);
    await new Promise(resolve => setTimeout(resolve, 500));

    setExportStatus('packaging');
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
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Export to EPUB
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Export memories as e-book for e-readers
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
            EPUB Export Settings
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                Book title
              </label>
              <input
                type="text"
                value={options.title}
                onChange={(e) => setOptions({ ...options, title: e.target.value })}
                className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                Author
              </label>
              <input
                type="text"
                value={options.author}
                onChange={(e) => setOptions({ ...options, author: e.target.value })}
                className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                Description
              </label>
              <textarea
                value={options.description}
                onChange={(e) => setOptions({ ...options, description: e.target.value })}
                className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full h-16"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Chapter by
                </label>
                <select
                  value={options.chapterBy}
                  onChange={(e) => setOptions({ ...options, chapterBy: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="date">Date</option>
                  <option value="location">Location</option>
                  <option value="category">Category</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Layout
                </label>
                <select
                  value={options.layout}
                  onChange={(e) => setOptions({ ...options, layout: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="reflowable">Reflowable</option>
                  <option value="fixed">Fixed layout</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Font family
                </label>
                <select
                  value={options.fontFamily}
                  onChange={(e) => setOptions({ ...options, fontFamily: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="serif">Serif</option>
                  <option value="sans-serif">Sans-serif</option>
                  <option value="mono">Monospace</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Theme
                </label>
                <select
                  value={options.theme}
                  onChange={(e) => setOptions({ ...options, theme: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="light">Light</option>
                  <option value="sepia">Sepia</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                Font size: {options.fontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="24"
                value={options.fontSize}
                onChange={(e) => setOptions({ ...options, fontSize: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Include images
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, includeImages: !options.includeImages })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.includeImages ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.includeImages ? 'translate-x-5' : ''
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
                  Table of contents
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, tocEnabled: !options.tocEnabled })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.tocEnabled ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.tocEnabled ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Page breaks
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, pageBreaks: !options.pageBreaks })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.pageBreaks ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.pageBreaks ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Embed fonts
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, embedFonts: !options.embedFonts })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.embedFonts ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.embedFonts ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Compress images
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, compressImages: !options.compressImages })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.compressImages ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.compressImages ? 'translate-x-5' : ''
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
              Export Summary
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
              <span className="text-slate-500 dark:text-slate-400">Memories:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                {selectedMemories}/{totalMemories}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Layout:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white capitalize">
                {options.layout}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Chapter by:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white capitalize">
                {options.chapterBy}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Theme:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white capitalize">
                {options.theme}
              </span>
            </div>
          </div>
        </div>

        {showPreview && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                EPUB Preview
              </h4>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                  title="Phone view"
                >
                  <Smartphone className="h-4 w-4 text-slate-500" />
                </button>
                <button
                  type="button"
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                  title="Tablet view"
                >
                  <Tablet className="h-4 w-4 text-slate-500" />
                </button>
                <button
                  type="button"
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                  title="Desktop view"
                >
                  <Monitor className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-600 aspect-[3/4] flex items-center justify-center">
              <div className="text-center">
                <Book className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  EPUB Preview
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {options.title}
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
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              {exportStatus === 'generating' && <Layers className="h-3 w-3" />}
              {exportStatus === 'packaging' && <BookOpen className="h-3 w-3" />}
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
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export EPUB
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
