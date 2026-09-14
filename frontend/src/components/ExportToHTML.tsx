'use client';

import { useState } from 'react';
import { X, Settings, Download, Globe, CheckCircle, AlertTriangle, Loader2, Image as ImageIcon, MapPin, Calendar as CalendarIcon, Filter, Check, Play, Pause, RefreshCw, ChevronDown, ChevronUp, Layout, Palette, Type, Code, Share2, Eye, EyeOff, File, Layers, Grid, Smartphone, Monitor, Globe2 } from 'lucide-react';

interface ExportToHTMLProps {
  onCancel?: () => void;
  onExport?: (options: HTMLOptions) => void;
}

interface HTMLOptions {
  includeImages: boolean;
  includeMap: boolean;
  theme: 'light' | 'dark' | 'custom';
  responsive: boolean;
  interactiveMap: boolean;
  includeCSS: boolean;
  includeJS: boolean;
  embedImages: boolean;
  compression: boolean;
  template: 'default' | 'gallery' | 'timeline' | 'blog';
  fontSize: number;
  fontFamily: string;
  customCSS: string;
  includeMetadata: boolean;
  includeLocation: boolean;
  includeDate: boolean;
  includeMood: boolean;
  includeTags: boolean;
  singlePage: boolean;
  pagination: boolean;
}

export default function ExportToHTML({ onCancel, onExport }: ExportToHTMLProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<'idle' | 'generating' | 'styling' | 'finalizing' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [selectedMemories, setSelectedMemories] = useState<number>(0);
  const [totalMemories, setTotalMemories] = useState(50);

  const [options, setOptions] = useState<HTMLOptions>({
    includeImages: true,
    includeMap: true,
    theme: 'light',
    responsive: true,
    interactiveMap: true,
    includeCSS: true,
    includeJS: true,
    embedImages: false,
    compression: false,
    template: 'gallery',
    fontSize: 16,
    fontFamily: 'Arial',
    customCSS: '',
    includeMetadata: true,
    includeLocation: true,
    includeDate: true,
    includeMood: true,
    includeTags: true,
    singlePage: false,
    pagination: true,
  });

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    setExportStatus('generating');
    setExportProgress(10);
    await new Promise(resolve => setTimeout(resolve, 500));

    setExportStatus('styling');
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
          <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Export to HTML
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Export memories as static web page
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
            HTML Export Settings
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Template
                </label>
                <select
                  value={options.template}
                  onChange={(e) => setOptions({ ...options, template: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="default">Default</option>
                  <option value="gallery">Gallery</option>
                  <option value="timeline">Timeline</option>
                  <option value="blog">Blog</option>
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
                  <option value="dark">Dark</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Font family
                </label>
                <input
                  type="text"
                  value={options.fontFamily}
                  onChange={(e) => setOptions({ ...options, fontFamily: e.target.value })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                />
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
            </div>
            {options.theme === 'custom' && (
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Custom CSS
                </label>
                <textarea
                  value={options.customCSS}
                  onChange={(e) => setOptions({ ...options, customCSS: e.target.value })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full h-16 font-mono"
                  placeholder="/* Add custom CSS here */"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Responsive design
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, responsive: !options.responsive })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.responsive ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.responsive ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Interactive map
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, interactiveMap: !options.interactiveMap })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.interactiveMap ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.interactiveMap ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Include CSS
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, includeCSS: !options.includeCSS })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.includeCSS ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.includeCSS ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Include JS
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, includeJS: !options.includeJS })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.includeJS ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.includeJS ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Embed images
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, embedImages: !options.embedImages })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.embedImages ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.embedImages ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Compression
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, compression: !options.compression })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.compression ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.compression ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Single page
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, singlePage: !options.singlePage })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.singlePage ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.singlePage ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Pagination
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, pagination: !options.pagination })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.pagination ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.pagination ? 'translate-x-5' : ''
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
              <span className="text-slate-500 dark:text-slate-400">Template:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white capitalize">
                {options.template}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Theme:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white Capitalize">
                {options.theme}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Responsive:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                {options.responsive ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {showPreview && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                HTML Preview
              </h4>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                  title="Mobile view"
                >
                  <Smartphone className="h-4 w-4 text-slate-500" />
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
                <Globe2 className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  HTML Preview
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {options.template} template
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
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              {exportStatus === 'generating' && <Code className="h-3 w-3" />}
              {exportStatus === 'styling' && <Palette className="h-3 w-3" />}
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
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export HTML
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
