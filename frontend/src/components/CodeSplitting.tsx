'use client';

import { useState } from 'react';
import { Code, X, Settings, RefreshCw, Layers, FileText, Download, Check, TrendingUp, AlertTriangle } from 'lucide-react';

interface CodeChunk {
  name: string;
  size: number;
  sizeFormatted: string;
  loaded: boolean;
  loadingTime: number;
  status: 'idle' | 'loading' | 'loaded' | 'error';
}

interface CodeSplittingProps {
  onCancel?: () => void;
  onAnalyzeChunks?: () => Promise<CodeChunk[]>;
  onLoadChunk?: (chunkName: string) => Promise<void>;
}

const DEFAULT_CHUNKS: CodeChunk[] = [
  { name: 'main', size: 245, sizeFormatted: '245 KB', loaded: true, loadingTime: 0, status: 'loaded' },
  { name: 'vendor', size: 580, sizeFormatted: '580 KB', loaded: true, loadingTime: 0, status: 'loaded' },
  { name: 'map-component', size: 120, sizeFormatted: '120 KB', loaded: false, loadingTime: 0, status: 'idle' },
  { name: 'memory-editor', size: 85, sizeFormatted: '85 KB', loaded: false, loadingTime: 0, status: 'idle' },
  { name: 'analytics', size: 95, sizeFormatted: '95 KB', loaded: false, loadingTime: 0, status: 'idle' },
  { name: 'notifications', size: 45, sizeFormatted: '45 KB', loaded: false, loadingTime: 0, status: 'idle' },
];

export default function CodeSplitting({ onCancel, onAnalyzeChunks, onLoadChunk }: CodeSplittingProps) {
  const [chunks, setChunks] = useState<CodeChunk[]>(DEFAULT_CHUNKS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autoLoad, setAutoLoad] = useState(false);
  const [preloadStrategy, setPreloadStrategy] = useState('on-demand');

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    if (onAnalyzeChunks) {
      const analyzedChunks = await onAnalyzeChunks();
      setChunks(analyzedChunks);
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Simulate analysis
    }
    setIsAnalyzing(false);
  };

  const handleLoadChunk = async (chunkName: string) => {
    setChunks(prev => prev.map(chunk => 
      chunk.name === chunkName 
        ? { ...chunk, status: 'loading' as const }
        : chunk
    ));
    
    if (onLoadChunk) {
      await onLoadChunk(chunkName);
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    }

    setChunks(prev => prev.map(chunk => 
      chunk.name === chunkName 
        ? { ...chunk, loaded: true, loadingTime: Math.random() * 500 + 100, status: 'loaded' as const }
        : chunk
    ));
  };

  const handleLoadAll = async () => {
    const unloadedChunks = chunks.filter(c => !c.loaded);
    for (const chunk of unloadedChunks) {
      await handleLoadChunk(chunk.name);
    }
  };

  const getTotalSize = () => chunks.reduce((sum, chunk) => sum + chunk.size, 0);
  const getLoadedSize = () => chunks.filter(c => c.loaded).reduce((sum, chunk) => sum + chunk.size, 0);
  const getLoadPercentage = () => {
    const total = getTotalSize();
    return total > 0 ? (getLoadedSize() / total) * 100 : 0;
  };

  const getStatusColor = (status: CodeChunk['status']) => {
    switch (status) {
      case 'loaded':
        return 'from-green-400 to-emerald-500';
      case 'loading':
        return 'from-blue-400 to-cyan-500';
      case 'error':
        return 'from-red-400 to-rose-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getStatusLabel = (status: CodeChunk['status']) => {
    switch (status) {
      case 'idle':
        return 'Chưa tải';
      case 'loading':
        return 'Đang tải';
      case 'loaded':
        return 'Đã tải';
      case 'error':
        return 'Lỗi';
      default:
        return 'Chưa tải';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Code className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Chia code
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {chunks.length} chunks • {getLoadPercentage().toFixed(1)}% đã tải
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
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt code splitting
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Tự động tải
              </span>
              <button
                type="button"
                onClick={() => setAutoLoad(!autoLoad)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoLoad ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoLoad ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Chiến lược preload
              </label>
              <select
                value={preloadStrategy}
                onChange={(e) => setPreloadStrategy(e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="on-demand">Khi cần thiết (on-demand)</option>
                <option value="preload">Preload (tải trước)</option>
                <option value="prefetch">Prefetch (tải trước thấp)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Overall Progress */}
      <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Tổng tiến độ tải
          </span>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {getLoadedSize().toFixed(0)} / {getTotalSize().toFixed(0)} KB
          </span>
        </div>
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all"
            style={{ width: `${getLoadPercentage()}%` }}
          />
        </div>
      </div>

      {/* Chunks List */}
      <div className="space-y-2 mb-4">
        {chunks.map((chunk) => (
          <div
            key={chunk.name}
            className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {chunk.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 bg-gradient-to-r ${getStatusColor(chunk.status)} text-white text-[10px] font-bold rounded-full`}>
                  {getStatusLabel(chunk.status)}
                </span>
                {chunk.loaded && (
                  <Check className="h-3 w-3 text-green-500" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-3 w-3 text-slate-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {chunk.sizeFormatted}
                </span>
                {chunk.loaded && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    • {chunk.loadingTime.toFixed(0)}ms
                  </span>
                )}
              </div>
              {!chunk.loaded && (
                <button
                  type="button"
                  onClick={() => handleLoadChunk(chunk.name)}
                  disabled={chunk.status === 'loading'}
                  className="px-2 py-1 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  {chunk.status === 'loading' ? (
                    <>
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Đang tải
                    </>
                  ) : (
                    <>
                      <Download className="h-3 w-3" />
                      Tải
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Đang phân tích...
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4" />
              Phân tích chunks
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleLoadAll}
          disabled={chunks.every(c => c.loaded)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all"
        >
          <Download className="h-4 w-4" />
          Tải tất cả
        </button>
      </div>

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> Code splitting chia nhỏ application thành các chunks để giảm initial bundle size và cải thiện thời gian tải.
        </p>
      </div>
    </div>
  );
}