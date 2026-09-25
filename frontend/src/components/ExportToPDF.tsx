'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  as,
  BookOpen,
  Calendar,
  CalendarIcon,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Grid,
  Image,
  ImageIcon,
  Layers,
  Layout,
  Loader2,
  MapPin,
  Maximize2,
  Minimize2,
  Palette,
  Pause,
  Play,
  Printer,
  RefreshCw,
  Settings,
  Share2,
  Type,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface ExportToPDFProps {
  onCancel?: () => void;
  onExport?: (options: PDFOptions) => void;
}

interface PDFOptions {
  includeImages: boolean;
  includeMap: boolean;
  pageSize: 'A4' | 'A5' | 'Letter' | 'Custom';
  orientation: 'portrait' | 'landscape';
  quality: 'standard' | 'high' | 'premium';
  theme: 'light' | 'dark' | 'colorful';
  layout: 'single' | 'grid' | 'timeline';
  fontFamily: 'Arial' | 'Times' | 'Helvetica' | 'Georgia';
  fontSize: number;
  includeMetadata: boolean;
  includeLocation: boolean;
  includeDate: boolean;
  includeMood: boolean;
  includeTags: boolean;
  coverPage: boolean;
  tableOfContents: boolean;
  pageNumbers: boolean;
  watermark: boolean;
  watermarkText: string;
}

export default function ExportToPDF({ onCancel, onExport }: ExportToPDFProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<'idle' | 'generating' | 'rendering' | 'finalizing' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [selectedMemories, setSelectedMemories] = useState<number>(0);
  const [totalMemories, setTotalMemories] = useState(50);

  const [options, setOptions] = useState<PDFOptions>({
    includeImages: true,
    includeMap: true,
    pageSize: 'A4',
    orientation: 'portrait',
    quality: 'high',
    theme: 'colorful',
    layout: 'timeline',
    fontFamily: 'Arial',
    fontSize: 12,
    includeMetadata: true,
    includeLocation: true,
    includeDate: true,
    includeMood: true,
    includeTags: true,
    coverPage: true,
    tableOfContents: true,
    pageNumbers: true,
    watermark: false,
    watermarkText: 'Memory Map',
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
          <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Export to PDF
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Export memories as beautiful PDF document
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
            PDF Export Settings
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Page size
                </label>
                <select
                  value={options.pageSize}
                  onChange={(e) => setOptions({ ...options, pageSize: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="A4">A4</option>
                  <option value="A5">A5</option>
                  <option value="Letter">Letter</option>
                  <option value="Custom">Custom</option>
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
                  Gauge
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
                  <option value="colorful">Colorful</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Layout
                </label>
                <select
                  value={options.layout}
                  onChange={(e) => setOptions({ ...options, layout: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="single">Single per page</option>
                  <option value="grid">Grid</option>
                  <option value="timeline">Timeline</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Font family
                </label>
                <select
                  value={options.fontFamily}
                  onChange={(e) => setOptions({ ...options, fontFamily: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times">Times New Roman</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Georgia">Georgia</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                Font size: {options.fontSize}px
              </label>
              <input
                type="range"
                min="8"
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
                  Include map
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, includeMap: !options.includeMap })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.includeMap ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.includeMap ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Include metadata
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, includeMetadata: !options.includeMetadata })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.includeMetadata ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.includeMetadata ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Cover page
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, coverPage: !options.coverPage })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.coverPage ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.coverPage ? 'translate-x-5' : ''
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
                  onClick={() => setOptions({ ...options, tableOfContents: !options.tableOfContents })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.tableOfContents ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.tableOfContents ? 'translate-x-5' : ''
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
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Watermark
              </span>
              <button
                type="button"
                onClick={() => setOptions({ ...options, watermark: !options.watermark })}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  options.watermark ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    options.watermark ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            {options.watermark && (
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Watermark text
                </label>
                <input
                  type="text"
                  value={options.watermarkText}
                  onChange={(e) => setOptions({ ...options, watermarkText: e.target.value })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                />
              </div>
            )}
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
              <span className="text-slate-500 dark:text-slate-400">Page size:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                {options.pageSize}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Layout:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white capitalize">
                {options.layout}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Gauge:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                {options.quality}
              </span>
            </div>
          </div>
        </div>

        {showPreview && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                PDF Preview
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
                <FileText className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  PDF Preview
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {options.pageSize} - {options.orientation}
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
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              {exportStatus === 'generating' && <Layers className="h-3 w-3" />}
              {exportStatus === 'rendering' && <Layout className="h-3 w-3" />}
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
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export PDF
              </>
            )}
          </button>
          <button
            type="button"
            className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title="Print"
          >
            <Printer className="h-4 w-4" />
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
