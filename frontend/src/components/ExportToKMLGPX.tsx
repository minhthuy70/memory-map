'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  as,
  Calendar,
  CalendarIcon,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Compass,
  Copy,
  Download,
  Eye,
  EyeOff,
  File,
  Filter,
  Globe,
  Image,
  ImageIcon,
  Layers,
  Layout,
  Loader2,
  MapPin,
  Navigation,
  Pause,
  Play,
  RefreshCw,
  Route,
  Settings,
  Share2
} from 'lucide-react';

interface ExportToKMLGPXProps {
  onCancel?: () => void;
  onExport?: (options: KMLGPXOptions) => void;
}

interface KMLGPXOptions {
  format: 'kml' | 'gpx' | 'both';
  includeImages: boolean;
  includeMetadata: boolean;
  includePlacemarks: boolean;
  includeTracks: boolean;
  includeRoutes: boolean;
  colorBy: 'category' | 'mood' | 'date' | 'none';
  style: 'default' | 'custom';
  compression: boolean;
  timestamp: boolean;
  elevation: boolean;
  iconStyle: 'default' | 'custom';
}

export default function ExportToKMLGPX({ onCancel, onExport }: ExportToKMLGPXProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<'idle' | 'generating' | 'processing' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [selectedMemories, setSelectedMemories] = useState<number>(0);
  const [totalMemories, setTotalMemories] = useState(50);

  const [options, setOptions] = useState<KMLGPXOptions>({
    format: 'both',
    includeImages: false,
    includeMetadata: true,
    includePlacemarks: true,
    includeTracks: true,
    includeRoutes: false,
    colorBy: 'category',
    style: 'default',
    compression: false,
    timestamp: true,
    elevation: true,
    iconStyle: 'default',
  });

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    setExportStatus('generating');
    setExportProgress(30);
    await new Promise(resolve => setTimeout(resolve, 500));

    setExportStatus('processing');
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
          <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Export to KML/GPX
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Export memories as geographic data for maps
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
            KML/GPX Export Settings
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
                  <option value="kml">KML only</option>
                  <option value="gpx">GPX only</option>
                  <option value="both">Both KML & GPX</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Color by
                </label>
                <select
                  value={options.colorBy}
                  onChange={(e) => setOptions({ ...options, colorBy: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="category">Category</option>
                  <option value="mood">Mood</option>
                  <option value="date">Date</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Include placemarks
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, includePlacemarks: !options.includePlacemarks })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.includePlacemarks ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.includePlacemarks ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Include tracks
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, includeTracks: !options.includeTracks })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.includeTracks ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.includeTracks ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Include routes
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, includeRoutes: !options.includeRoutes })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.includeRoutes ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.includeRoutes ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
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
                  Timestamp
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, timestamp: !options.timestamp })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.timestamp ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.timestamp ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Elevation
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, elevation: !options.elevation })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.elevation ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.elevation ? 'translate-x-5' : ''
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
              <span className="text-slate-500 dark:text-slate-400">Format:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white uppercase">
                {options.format}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Color by:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white capitalize">
                {options.colorBy}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Elevation:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                {options.elevation ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {showPreview && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                KML/GPX Preview
              </h4>
              <button
                type="button"
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4 text-slate-500" />
              </button>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-600 aspect-[3/4] flex items-center justify-center">
              <div className="text-center">
                <Compass className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Geographic Data Preview
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {options.format.toUpperCase()} format
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
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              {exportStatus === 'generating' && <Layers className="h-3 w-3" />}
              {exportStatus === 'processing' && <Route className="h-3 w-3" />}
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
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export {options.format.toUpperCase()}
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
