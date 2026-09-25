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
  Code,
  Copy,
  Download,
  Eye,
  EyeOff,
  File,
  FileText,
  Filter,
  Hash,
  Image,
  ImageIcon,
  Layers,
  Layout,
  List,
  Loader2,
  MapPin,
  Pause,
  Play,
  RefreshCw,
  Settings,
  Share2,
  Type
} from 'lucide-react';

interface ExportToMarkdownProps {
  onCancel?: () => void;
  onExport?: (options: MarkdownOptions) => void;
}

interface MarkdownOptions {
  flavor: 'commonmark' | 'github' | 'multimarkdown';
  includeImages: boolean;
  includeFrontmatter: boolean;
  includeMetadata: boolean;
  includeLocation: boolean;
  includeDate: boolean;
  includeMood: boolean;
  includeTags: boolean;
  imageStyle: 'reference' | 'embed';
  headerStyle: 'atx' | 'setext';
  listStyle: 'dash' | 'asterisk';
  codeBlocks: boolean;
  tables: boolean;
  taskLists: boolean;
  strikethrough: boolean;
  emoji: boolean;
  lineBreaks: boolean;
}

export default function ExportToMarkdown({ onCancel, onExport }: ExportToMarkdownProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<'idle' | 'generating' | 'formatting' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [selectedMemories, setSelectedMemories] = useState<number>(0);
  const [totalMemories, setTotalMemories] = useState(50);

  const [options, setOptions] = useState<MarkdownOptions>({
    flavor: 'github',
    includeImages: true,
    includeFrontmatter: true,
    includeMetadata: true,
    includeLocation: true,
    includeDate: true,
    includeMood: true,
    includeTags: true,
    imageStyle: 'reference',
    headerStyle: 'atx',
    listStyle: 'dash',
    codeBlocks: true,
    tables: true,
    taskLists: true,
    strikethrough: true,
    emoji: true,
    lineBreaks: true,
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
          <div className="p-2 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Export to Markdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Export memories as Markdown text
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
            Markdown Export Settings
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Flavor
                </label>
                <select
                  value={options.flavor}
                  onChange={(e) => setOptions({ ...options, flavor: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="commonmark">CommonMark</option>
                  <option value="github">GitHub Flavored</option>
                  <option value="multimarkdown">MultiMarkdown</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Image style
                </label>
                <select
                  value={options.imageStyle}
                  onChange={(e) => setOptions({ ...options, imageStyle: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="reference">Reference</option>
                  <option value="embed">Embed (base64)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Header style
                </label>
                <select
                  value={options.headerStyle}
                  onChange={(e) => setOptions({ ...options, headerStyle: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="atx">ATX (# ##)</option>
                  <option value="setext">Setext (===)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  List style
                </label>
                <select
                  value={options.listStyle}
                  onChange={(e) => setOptions({ ...options, listStyle: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="dash">Dash (-)</option>
                  <option value="asterisk">Asterisk (*)</option>
                </select>
              </div>
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
                  Frontmatter
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, includeFrontmatter: !options.includeFrontmatter })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.includeFrontmatter ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.includeFrontmatter ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Code blocks
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, codeBlocks: !options.codeBlocks })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.codeBlocks ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.codeBlocks ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Tables
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, tables: !options.tables })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.tables ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.tables ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Task lists
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, taskLists: !options.taskLists })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.taskLists ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.taskLists ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Strikethrough
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, strikethrough: !options.strikethrough })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.strikethrough ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.strikethrough ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Emoji
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, emoji: !options.emoji })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.emoji ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.emoji ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Line breaks
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, lineBreaks: !options.lineBreaks })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.lineBreaks ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.lineBreaks ? 'translate-x-5' : ''
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
              <span className="text-slate-500 dark:text-slate-400">Flavor:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                {options.flavor}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Header style:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                {options.headerStyle}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Image style:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                {options.imageStyle}
              </span>
            </div>
          </div>
        </div>

        {showPreview && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                Markdown Preview
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
                <Hash className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Markdown Preview
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {options.flavor} flavor
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
                className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              {exportStatus === 'generating' && <Layers className="h-3 w-3" />}
              {exportStatus === 'formatting' && <Type className="h-3 w-3" />}
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
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-medium hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export Markdown
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
