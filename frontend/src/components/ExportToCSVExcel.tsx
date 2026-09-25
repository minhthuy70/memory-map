'use client';

import { useState } from 'react';
import { X, Settings, Download, FileSpreadsheet, CheckCircle, AlertTriangle, Loader2, Image as ImageIcon, MapPin, Calendar as CalendarIcon, Filter, Check, Play, Pause, RefreshCw, ChevronDown, ChevronUp, Layout, Share2, Eye, EyeOff, File, Table, Layers, Copy, Filter as FilterIcon } from 'lucide-react';

interface ExportToCSVExcelProps {
  onCancel?: () => void;
  onExport?: (options: CSVExcelOptions) => void;
}

interface CSVExcelOptions {
  format: 'csv' | 'excel';
  delimiter: 'comma' | 'semicolon' | 'tab' | 'pipe';
  includeHeaders: boolean;
  includeImages: boolean;
  includeMetadata: boolean;
  includeLocation: boolean;
  includeDate: boolean;
  includeMood: boolean;
  includeTags: boolean;
  encoding: 'utf-8' | 'utf-16' | 'ascii';
  dateStyle: 'iso' | 'us' | 'eu';
  booleanStyle: 'truefalse' | '10';
  nullValue: string;
  compression: boolean;
  sheetName: string;
}

export default function ExportToCSVExcel({ onCancel, onExport }: ExportToCSVExcelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<'idle' | 'generating' | 'formatting' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [selectedMemories, setSelectedMemories] = useState<number>(0);
  const [totalMemories, setTotalMemories] = useState(50);

  const [options, setOptions] = useState<CSVExcelOptions>({
    format: 'csv',
    delimiter: 'comma',
    includeHeaders: true,
    includeImages: false,
    includeMetadata: true,
    includeLocation: true,
    includeDate: true,
    includeMood: true,
    includeTags: true,
    encoding: 'utf-8',
    dateStyle: 'iso',
    booleanStyle: 'truefalse',
    nullValue: '',
    compression: false,
    sheetName: 'Memories',
  });

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    setExportStatus('generating');
    setExportProgress(30);
    await new Promise(resolve => setTimeout(resolve, 500));

    setExportStatus('formatting');
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
          <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
            <FileSpreadsheet className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Export to CSV/Excel
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Export memories as spreadsheet data
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
            CSV/Excel Export Settings
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
                  <option value="csv">CSV</option>
                  <option value="excel">Excel (.xlsx)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Delimiter
                </label>
                <select
                  value={options.delimiter}
                  onChange={(e) => setOptions({ ...options, delimiter: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="comma">Comma (,)</option>
                  <option value="semicolon">Semicolon (;)</option>
                  <option value="tab">Tab</option>
                  <option value="pipe">Pipe (|)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Encoding
                </label>
                <select
                  value={options.encoding}
                  onChange={(e) => setOptions({ ...options, encoding: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="utf-8">UTF-8</option>
                  <option value="utf-16">UTF-16</option>
                  <option value="ascii">ASCII</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Date style
                </label>
                <select
                  value={options.dateStyle}
                  onChange={(e) => setOptions({ ...options, dateStyle: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="iso">ISO 8601</option>
                  <option value="us">US (MM/DD/YYYY)</option>
                  <option value="eu">EU (DD/MM/YYYY)</option>
                </select>
              </div>
            </div>
            {options.format === 'excel' && (
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Sheet name
                </label>
                <input
                  type="text"
                  value={options.sheetName}
                  onChange={(e) => setOptions({ ...options, sheetName: e.target.value })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                />
              </div>
            )}
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                Null value representation
              </label>
              <input
                type="text"
                value={options.nullValue}
                onChange={(e) => setOptions({ ...options, nullValue: e.target.value })}
                className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                placeholder="Empty string"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Include headers
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, includeHeaders: !options.includeHeaders })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.includeHeaders ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.includeHeaders ? 'translate-x-5' : ''
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
              <span className="text-slate-500 dark:text-slate-400">Delimiter:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                {options.delimiter}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Encoding:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                {options.encoding}
              </span>
            </div>
          </div>
        </div>

        {showPreview && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                CSV/Excel Preview
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
                <Table className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Spreadsheet Preview
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
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              {exportStatus === 'generating' && <Layers className="h-3 w-3" />}
              {exportStatus === 'formatting' && <FilterIcon className="h-3 w-3" />}
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
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
