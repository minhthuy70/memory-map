'use client';

import { useState } from 'react';
import { X, Settings, CheckCircle, AlertTriangle, Loader2, FileText, Search, Filter, Check, SkipForward, RefreshCw, ChevronDown, ChevronUp, Database, Copy, Trash2, Eye, EyeOff, Zap, Clock, Hash, Layers, Calendar as CalendarIcon, MapPin, Image as ImageIcon, Video as VideoIcon, Music as MusicIcon } from 'lucide-react';

interface DuplicateDetectionProps {
  onCancel?: () => void;
  onApply?: (action: 'skip' | 'merge' | 'rename', duplicates: any[]) => void;
}

interface DuplicateItem {
  id: string;
  type: 'memory' | 'photo' | 'video' | 'audio';
  title: string;
  date: string;
  location?: string;
  hash: string;
  similarity: number;
  existingItem?: {
    id: string;
    title: string;
    date: string;
  };
  action: 'skip' | 'merge' | 'rename' | 'keep';
}

export default function DuplicateDetection({ onCancel, onApply }: DuplicateDetectionProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [duplicates, setDuplicates] = useState<DuplicateItem[]>([]);
  const [selectedAction, setSelectedAction] = useState<'skip' | 'merge' | 'rename'>('skip');
  const [showSettings, setShowSettings] = useState(false);
  const [similarityThreshold, setSimilarityThreshold] = useState(85);
  const [checkTitle, setCheckTitle] = useState(true);
  const [checkDate, setCheckDate] = useState(true);
  const [checkLocation, setCheckLocation] = useState(true);
  const [checkContent, setCheckContent] = useState(true);
  const [checkHash, setCheckHash] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDuplicateIndex, setSelectedDuplicateIndex] = useState<number | null>(null);
  const [filterAction, setFilterAction] = useState<'all' | 'skip' | 'merge' | 'rename'>('all');
  const [filterType, setFilterType] = useState<'all' | 'memory' | 'photo' | 'video' | 'audio'>('all');
  const [minSimilarity, setMinSimilarity] = useState(50);
  const [batchApply, setBatchApply] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'analyzing' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [scannedItems, setScannedItems] = useState(0);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [autoResolve, setAutoResolve] = useState(false);
  const [previewMode, setPreviewMode] = useState<'list' | 'grid'>('list');

  const handleScan = async () => {
    setIsScanning(true);
    setScanStatus('scanning');
    setError(null);
    setTotalItems(50);
    setScannedItems(0);
    setDuplicateCount(0);

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setScanProgress(i);
      setScannedItems(Math.floor(i / 2));
    }

    setScanStatus('analyzing');
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockDuplicates: DuplicateItem[] = [
      {
        id: '1',
        type: 'photo',
        title: 'Summer vacation photo',
        date: '2024-06-15',
        location: 'Da Nang',
        hash: 'abc123',
        similarity: 95,
        existingItem: {
          id: 'mem-123',
          title: 'Summer vacation photo',
          date: '2024-06-15',
        },
        action: 'skip',
      },
      {
        id: '2',
        type: 'memory',
        title: 'Birthday celebration',
        date: '2024-05-20',
        hash: 'def456',
        similarity: 88,
        existingItem: {
          id: 'mem-456',
          title: 'Birthday party',
          date: '2024-05-20',
        },
        action: 'merge',
      },
      {
        id: '3',
        type: 'video',
        title: 'Beach day video',
        date: '2024-07-10',
        location: 'Nha Trang',
        hash: 'ghi789',
        similarity: 72,
        existingItem: {
          id: 'mem-789',
          title: 'Beach day',
          date: '2024-07-10',
        },
        action: 'rename',
      },
    ];

    setDuplicates(mockDuplicates);
    setDuplicateCount(mockDuplicates.length);
    setScanStatus('done');
    setIsScanning(false);
  };

  const handleBatchApply = (action: 'skip' | 'merge' | 'rename') => {
    setDuplicates(
      duplicates.map(d => ({ ...d, action }))
    );
  };

  const handleApplyAction = () => {
    const filtered = duplicates.filter(d => {
      if (filterAction !== 'all' && d.action !== filterAction) return false;
      if (filterType !== 'all' && d.type !== filterType) return false;
      if (d.similarity < minSimilarity) return false;
      return true;
    });
    onApply?.(selectedAction, filtered);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return ImageIcon;
      case 'video': return VideoIcon;
      case 'audio': return MusicIcon;
      default: return FileText;
    }
  };

  const getSimilarityColor = (similarity: number): string => {
    if (similarity >= 90) return 'text-red-500';
    if (similarity >= 75) return 'text-orange-500';
    if (similarity >= 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  const filteredDuplicates = duplicates.filter(d => {
    if (filterAction !== 'all' && d.action !== filterAction) return false;
    if (filterType !== 'all' && d.type !== filterType) return false;
    if (d.similarity < minSimilarity) return false;
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
            <Hash className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Duplicate Detection
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detect and handle duplicate imports
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
            Detection Settings
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                Similarity threshold: {similarityThreshold}%
              </label>
              <input
                type="range"
                min="50"
                max="100"
                value={similarityThreshold}
                onChange={(e) => setSimilarityThreshold(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Check title
              </span>
              <button
                type="button"
                onClick={() => setCheckTitle(!checkTitle)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  checkTitle ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    checkTitle ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Check date
              </span>
              <button
                type="button"
                onClick={() => setCheckDate(!checkDate)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  checkDate ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    checkDate ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Check location
              </span>
              <button
                type="button"
                onClick={() => setCheckLocation(!checkLocation)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  checkLocation ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    checkLocation ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Check content
              </span>
              <button
                type="button"
                onClick={() => setCheckContent(!checkContent)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  checkContent ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    checkContent ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Check hash
              </span>
              <button
                type="button"
                onClick={() => setCheckHash(!checkHash)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  checkHash ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    checkHash ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-resolve low similarity
              </span>
              <button
                type="button"
                onClick={() => setAutoResolve(!autoResolve)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoResolve ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoResolve ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {scanStatus === 'idle' && (
          <button
            type="button"
            onClick={handleScan}
            disabled={isScanning}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Scan for Duplicates
              </>
            )}
          </button>
        )}

        {(scanStatus === 'scanning' || scanStatus === 'analyzing') && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {scanStatus === 'scanning' ? 'Scanning items...' : 'Analyzing duplicates...'}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {scanProgress}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Database className="h-3 w-3" />
              <span>{scannedItems} / {totalItems} items scanned</span>
            </div>
          </div>
        )}

        {scanStatus === 'done' && (
          <>
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                  Found {duplicateCount} potential duplicates
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewMode(previewMode === 'list' ? 'grid' : 'list')}
                className="p-1 hover:bg-orange-200 dark:hover:bg-orange-800 rounded"
              >
                {previewMode === 'list' ? <Layers className="h-4 w-4 text-orange-500" /> : <FileText className="h-4 w-4 text-orange-500" />}
              </button>
            </div>

            <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
              <Filter className="h-4 w-4 text-slate-500" />
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value as any)}
                className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1"
              >
                <option value="all">All actions</option>
                <option value="skip">Skip</option>
                <option value="merge">Merge</option>
                <option value="rename">Rename</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1"
              >
                <option value="all">All types</option>
                <option value="memory">Memory</option>
                <option value="photo">Photo</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-600 dark:text-slate-400">Min similarity:</span>
                <input
                  type="number"
                  value={minSimilarity}
                  onChange={(e) => setMinSimilarity(parseInt(e.target.value) || 0)}
                  min="0"
                  max="100"
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-16"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">%</span>
              </div>
            </div>

            {batchApply && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-blue-900 dark:text-blue-100">
                  Batch apply: {selectedAction}
                </span>
                <button
                  type="button"
                  onClick={() => handleBatchApply(selectedAction)}
                  className="ml-auto px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                >
                  Apply to all
                </button>
              </div>
            )}

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredDuplicates.map((duplicate, idx) => {
                const Icon = getTypeIcon(duplicate.type);
                return (
                  <div
                    key={duplicate.id}
                    className={`p-3 rounded-lg border ${
                      duplicate.action === 'skip'
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : duplicate.action === 'merge'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : duplicate.action === 'rename'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {duplicate.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${getSimilarityColor(duplicate.similarity)}`}>
                          {duplicate.similarity}% match
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDuplicateIndex(idx);
                            setShowDetails(!showDetails);
                          }}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                        >
                          {showDetails && selectedDuplicateIndex === idx ? (
                            <ChevronUp className="h-3 w-3 text-slate-500" />
                          ) : (
                            <ChevronDown className="h-3 w-3 text-slate-500" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mb-2">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{duplicate.date}</span>
                      </div>
                      {duplicate.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{duplicate.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        <span className="font-mono">{duplicate.hash}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={duplicate.action}
                        onChange={(e) => {
                          const newDuplicates = [...duplicates];
                          newDuplicates[idx] = { ...duplicate, action: e.target.value as any };
                          setDuplicates(newDuplicates);
                        }}
                        className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1"
                      >
                        <option value="skip">Skip</option>
                        <option value="merge">Merge</option>
                        <option value="rename">Rename</option>
                        <option value="keep">Keep both</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          const newDuplicates = duplicates.filter(d => d.id !== duplicate.id);
                          setDuplicates(newDuplicates);
                        }}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                        title="Remove"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </button>
                    </div>
                    {showDetails && selectedDuplicateIndex === idx && duplicate.existingItem && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                          Existing item:
                        </div>
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            {duplicate.existingItem.title}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {duplicate.existingItem.date}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBatchApply(!batchApply)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  batchApply
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <Zap className="h-4 w-4" />
                Batch Mode
              </button>
              {batchApply && (
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value as any)}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1"
                >
                  <option value="skip">Skip all</option>
                  <option value="merge">Merge all</option>
                  <option value="rename">Rename all</option>
                </select>
              )}
            </div>

            <button
              type="button"
              onClick={handleApplyAction}
              disabled={filteredDuplicates.length === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <CheckCircle className="h-4 w-4" />
              Apply Actions ({filteredDuplicates.length} items)
            </button>
          </>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
