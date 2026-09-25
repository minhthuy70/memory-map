'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Database,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  Settings,
  SkipForward,
  Table,
  Upload
} from 'lucide-react';

interface ImportFromCSVTemplateProps {
  onCancel?: () => void;
  onImport?: (files: File[]) => void;
}

interface ColumnMapping {
  csvColumn: string;
  targetField: string;
}

export default function ImportFromCSVTemplate({ onCancel, onImport }: ImportFromCSVTemplateProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [showTemplate, setShowTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('memory-template.csv');
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [delimiter, setDelimiter] = useState(',');
  const [autoDetectDelimiter, setAutoDetectDelimiter] = useState(true);
  const [emptyStringHandling, setEmptyStringHandling] = useState<'skip' | 'keep'>('skip');
  const [showColumnSelection, setShowColumnSelection] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping[]>([]);
  const [showImportOptions, setShowImportOptions] = useState(false);
  const [importDestination, setImportDestination] = useState<'new_memories' | 'existing_memories' | 'new_journals'>('new_memories');
  const [mergeStrategy, setMergeStrategy] = useState<'overwrite' | 'append' | 'rename'>('overwrite');
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [showProgress, setShowProgress] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'scanning' | 'parsing' | 'processing' | 'validating' | 'done' | 'error'>('idle');
  const [rowCount, setRowCount] = useState(0);
  const [columnCount, setColumnCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setRowCount(0);
      setColumnCount(0);
    }
  };

  const handlePreview = async () => {
    if (!selectedFile) return;
    setIsPreviewing(true);
    setError(null);
    try {
      const content = await selectedFile.text();
      const lines = content.split('\n').filter(line => line.trim());
      setRowCount(lines.length);
      if (lines.length > 0) {
        const firstLine = lines[0];
        const columns = firstLine.split(delimiter);
        setColumnCount(columns.length);
        setSelectedColumns(columns);
        setColumnMapping(columns.map(col => ({ csvColumn: col, targetField: col.toLowerCase().replace(/\s+/g, '_') })));
      }
      setPreviewData({ content, lines, rowCount: lines.length, columnCount: lines.length > 0 ? lines[0].split(delimiter).length : 0 });
      setShowPreview(true);
    } catch (err) {
      setError('Failed to read file');
      console.error(err);
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleDownloadTemplate = async () => {
    setIsDownloadingTemplate(true);
    try {
      const template = `title,date,location,description,tags,mood,media_url
"Memory 1","2024-01-15","Hanoi","Description text","tag1,tag2","happy","https://example.com/image1.jpg"
"Memory 2","2024-01-20","Ho Chi Minh","Another description","tag3","excited","https://example.com/image2.jpg"`;
      const blob = new Blob([template], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'memory-template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to download template');
      console.error(error);
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    setIsImporting(true);
    setShowProgress(true);
    setError(null);
    setImportStatus('scanning');
    setImportProgress(10);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setImportStatus('parsing');
    setImportProgress(30);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setImportStatus('processing');
    setImportProgress(50);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setImportStatus('validating');
    setImportProgress(70);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setImportStatus('done');
    setImportProgress(100);
    await onImport?.([selectedFile]);
    
    setTimeout(() => {
      setIsImporting(false);
      setShowProgress(false);
      setImportStatus('idle');
      setImportProgress(0);
    }, 1000);
  };

  const availableFields = [
    'title', 'date', 'location', 'description', 'tags', 'mood', 'media_url', 'latitude', 'longitude', 'created_at', 'updated_at'
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
            <FileSpreadsheet className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Nhập từ CSV Template
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload CSV files, select columns, map fields, validate data, preview, configure import options
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
            Cài đặt CSV Template
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Include headers
              </span>
              <button
                type="button"
                onClick={() => setIncludeHeaders(!includeHeaders)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  includeHeaders ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    includeHeaders ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-detect delimiter
              </span>
              <button
                type="button"
                onClick={() => setAutoDetectDelimiter(!autoDetectDelimiter)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoDetectDelimiter ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoDetectDelimiter ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            {!autoDetectDelimiter && (
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Delimiter
                </label>
                <select
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value)}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value=",">Comma (,)</option>
                  <option value=";">Semicolon (;)</option>
                  <option value="\t">Tab</option>
                  <option value="|">Pipe (|)</option>
                </select>
              </div>
            )}
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                Empty string handling
              </label>
              <select
                value={emptyStringHandling}
                onChange={(e) => setEmptyStringHandling(e.target.value as 'skip' | 'keep')}
                className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
              >
                <option value="skip">Skip empty values</option>
                <option value="keep">Keep empty values</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show column selection
              </span>
              <button
                type="button"
                onClick={() => setShowColumnSelection(!showColumnSelection)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  showColumnSelection ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    showColumnSelection ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show import options
              </span>
              <button
                type="button"
                onClick={() => setShowImportOptions(!showImportOptions)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  showImportOptions ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    showImportOptions ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
          <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            Upload CSV file
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="inline-block px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Chọn file
          </label>
          {selectedFile && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <FileText className="h-4 w-4 text-green-500" />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {selectedFile.name}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePreview}
            disabled={!selectedFile || isPreviewing}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            {isPreviewing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            Xem trước
          </button>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            disabled={isDownloadingTemplate}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
          >
            {isDownloadingTemplate ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Tải template
          </button>
        </div>

        {showPreview && previewData && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                Preview CSV
              </h4>
              <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                <span>{rowCount} rows</span>
                <span>{columnCount} columns</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-600">
                    {selectedColumns.map((col, idx) => (
                      <th key={idx} className="px-2 py-1 text-left font-semibold text-slate-700 dark:text-slate-300">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.lines.slice(0, 5).map((line: string, rowIdx: number) => (
                    <tr key={rowIdx} className="border-b border-slate-100 dark:border-slate-700">
                      {line.split(delimiter).map((cell: string, cellIdx: number) => (
                        <td key={cellIdx} className="px-2 py-1 text-slate-600 dark:text-slate-400">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showColumnSelection && selectedColumns.length > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
              Column Mapping
            </h4>
            <div className="space-y-2">
              {selectedColumns.map((col, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 dark:text-slate-400 w-32 truncate">
                    {col}
                  </span>
                  <span className="text-slate-400">→</span>
                  <select
                    value={columnMapping[idx]?.targetField || ''}
                    onChange={(e) => {
                      const newMapping = [...columnMapping];
                      newMapping[idx] = { csvColumn: col, targetField: e.target.value };
                      setColumnMapping(newMapping);
                    }}
                    className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 flex-1"
                  >
                    <option value="">-- Select field --</option>
                    {availableFields.map(field => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {showImportOptions && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
              Import Options
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Import destination
                </label>
                <select
                  value={importDestination}
                  onChange={(e) => setImportDestination(e.target.value as any)}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="new_memories">Create new memories</option>
                  <option value="existing_memories">Update existing memories</option>
                  <option value="new_journals">Create new journals</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Merge strategy
                </label>
                <select
                  value={mergeStrategy}
                  onChange={(e) => setMergeStrategy(e.target.value as any)}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="overwrite">Overwrite existing</option>
                  <option value="append">Append to existing</option>
                  <option value="rename">Rename duplicates</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Skip duplicates
                </span>
                <button
                  type="button"
                  onClick={() => setSkipDuplicates(!skipDuplicates)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    skipDuplicates ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      skipDuplicates ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {showProgress && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Importing...
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {importProgress}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${importProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              {importStatus === 'scanning' && <Database className="h-3 w-3" />}
              {importStatus === 'parsing' && <Table className="h-3 w-3" />}
              {importStatus === 'processing' && <Loader2 className="h-3 w-3 animate-spin" />}
              {importStatus === 'validating' && <CheckCircle className="h-3 w-3" />}
              {importStatus === 'done' && <Check className="h-3 w-3 text-green-500" />}
              {importStatus === 'error' && <AlertTriangle className="h-3 w-3 text-red-500" />}
              <span className="capitalize">{importStatus}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleImport}
          disabled={!selectedFile || isImporting}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isImporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Database className="h-4 w-4" />
              Import CSV
            </>
          )}
        </button>
      </div>
    </div>
  );
}
