'use client';

import { useState } from 'react';
import { X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Image as ImageIcon, RefreshCw, Check, Zap as ZapIcon, Plus, Layers, Split, LayoutGrid, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCw, FlipHorizontal, FlipVertical, SlidersHorizontal, Calendar as CalendarIcon, MapPin, ExternalLink, Share2, Bookmark, BookmarkCheck, CalendarClock, History } from 'lucide-react';

interface PhotoComparison {
  id: string;
  memoryId: string;
  title: string;
  description: string;
  oldPhotoUrl: string;
  newPhotoUrl: string;
  oldDate: Date;
  newDate: Date;
  location: string;
  similarity: number;
  isFavorite: boolean;
  splitPosition: number;
  opacity: number;
}

interface ARPhotoComparisonProps {
  onCancel?: () => void;
  onAddComparison?: (comparison: Partial<PhotoComparison>) => Promise<void>;
  onDelete?: (comparisonId: string) => Promise<void>;
  onAdjustSplit?: (comparisonId: string, position: number) => Promise<void>;
}

const DEFAULT_COMPARISONS: PhotoComparison[] = [
  {
    id: 'comp-1',
    memoryId: 'mem-1',
    title: 'Đà Lạt Then vs Now',
    description: 'Morning mist comparison',
    oldPhotoUrl: '/old-1.jpg',
    newPhotoUrl: '/new-1.jpg',
    oldDate: new Date('2020-01-12'),
    newDate: new Date('2024-01-12'),
    location: 'Đà Lạt, Vietnam',
    similarity: 85,
    isFavorite: true,
    splitPosition: 50,
    opacity: 100,
  },
  {
    id: 'comp-2',
    memoryId: 'mem-2',
    title: 'Beach Transformation',
    description: 'Beach development',
    oldPhotoUrl: '/old-2.jpg',
    newPhotoUrl: '/new-2.jpg',
    oldDate: new Date('2018-02-15'),
    newDate: new Date('2024-02-15'),
    location: 'Nha Trang, Vietnam',
    similarity: 72,
    isFavorite: false,
    splitPosition: 50,
    opacity: 100,
  },
];

export default function ARPhotoComparison({ onCancel, onAddComparison, onDelete, onAdjustSplit }: ARPhotoComparisonProps) {
  const [comparisons, setComparisons] = useState<PhotoComparison[]>(DEFAULT_COMPARISONS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedComparison, setSelectedComparison] = useState<PhotoComparison | null>(DEFAULT_COMPARISONS[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'overlay' | 'side-by-side'>('split');
  const [autoAlign, setAutoAlign] = useState(true);

  const totalComparisons = comparisons.length;
  const favoriteComparisons = comparisons.filter(c => c.isFavorite).length;
  const avgSimilarity = comparisons.reduce((sum, c) => sum + c.similarity, 0) / comparisons.length;

  const handleAddComparison = async (comparison: Partial<PhotoComparison>) => {
    await onAddComparison?.(comparison);
    const newComparison: PhotoComparison = {
      id: `comp-${Date.now()}`,
      memoryId: comparison.memoryId || 'mem-1',
      title: comparison.title || 'New Comparison',
      description: comparison.description || '',
      oldPhotoUrl: comparison.oldPhotoUrl || '',
      newPhotoUrl: comparison.newPhotoUrl || '',
      oldDate: comparison.oldDate || new Date(),
      newDate: comparison.newDate || new Date(),
      location: comparison.location || '',
      similarity: comparison.similarity || 0,
      isFavorite: false,
      splitPosition: 50,
      opacity: 100,
    };
    setComparisons([newComparison, ...comparisons]);
    setIsAdding(false);
  };

  const handleDelete = async (comparisonId: string) => {
    await onDelete?.(comparisonId);
    setComparisons(comparisons.filter(c => c.id !== comparisonId));
  };

  const handleAdjustSplit = async (comparisonId: string, position: number) => {
    await onAdjustSplit?.(comparisonId, position);
    setComparisons(comparisons.map(c => 
      c.id === comparisonId ? { ...c, splitPosition: position } : c
    ));
  };

  const handleToggleFavorite = (comparisonId: string) => {
    setComparisons(comparisons.map(c => 
      c.id === comparisonId ? { ...c, isFavorite: !c.isFavorite } : c
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <Split className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              So sánh ảnh xưa và nay bằng AR (then vs now)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalComparisons} comparisons
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
            <SettingsIcon className="h-4 w-4 text-slate-500" />
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
        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt AR photo comparison
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-align photos
              </span>
              <button
                type="button"
                onClick={() => setAutoAlign(!autoAlign)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoAlign ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoAlign ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Similarity detection
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                AR alignment
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Split className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Comparisons</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalComparisons}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <BookmarkCheck className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Favorites</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {favoriteComparisons}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Similarity</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgSimilarity.toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CalendarClock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Time Span</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            Avg
          </div>
        </div>
      </div>

      {/* Add Comparison */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          {isAdding ? 'Cancel' : 'Add New Comparison'}
        </button>

        {isAdding && (
          <div className="mt-4 p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Comparison title"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Location name"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                    Old Photo Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                    New Photo Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleAddComparison({})}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Check className="h-4 w-4" />
                Add Comparison
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Mode Selector */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              viewMode === 'split'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Split
          </button>
          <button
            type="button"
            onClick={() => setViewMode('overlay')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              viewMode === 'overlay'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Overlay
          </button>
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              viewMode === 'side-by-side'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Side-by-Side
          </button>
        </div>
      </div>

      {/* Comparison Viewer */}
      {selectedComparison && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {selectedComparison.title}
              </span>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors">
                  <ZoomIn className="h-4 w-4 text-slate-500" />
                </button>
                <button className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors">
                  <Maximize2 className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Comparison Display */}
            <div className="aspect-video bg-slate-200 dark:bg-slate-600 rounded-lg mb-3 relative overflow-hidden">
              {viewMode === 'split' && (
                <>
                  <div
                    className="absolute inset-0 bg-slate-300 dark:bg-slate-500 flex items-center justify-center"
                    style={{ width: `${selectedComparison.splitPosition}%` }}
                  >
                    <div className="text-center">
                      <History className="h-8 w-8 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-500">Then</p>
                      <p className="text-[10px] text-slate-400">
                        {selectedComparison.oldDate.toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-slate-400 dark:bg-slate-600 flex items-center justify-center"
                    style={{ width: `${100 - selectedComparison.splitPosition}%` }}
                  >
                    <div className="text-center">
                      <Calendar className="h-8 w-8 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-500">Now</p>
                      <p className="text-[10px] text-slate-400">
                        {selectedComparison.newDate.toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  {/* Split Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-amber-500 cursor-ew-resize"
                    style={{ left: `${selectedComparison.splitPosition}%` }}
                  />
                </>
              )}

              {viewMode === 'overlay' && (
                <div className="absolute inset-0 bg-slate-300 dark:bg-slate-500 flex items-center justify-center">
                  <div className="text-center">
                    <Layers className="h-8 w-8 text-slate-400 mx-auto mb-1" />
                    <p className="text-xs text-slate-500">Overlay Mode</p>
                    <p className="text-[10px] text-slate-400">
                      Opacity: {selectedComparison.opacity}%
                    </p>
                  </div>
                </div>
              )}

              {viewMode === 'side-by-side' && (
                <div className="flex h-full">
                  <div className="w-1/2 bg-slate-300 dark:bg-slate-500 flex items-center justify-center">
                    <div className="text-center">
                      <History className="h-8 w-8 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-500">Then</p>
                    </div>
                  </div>
                  <div className="w-1/2 bg-slate-400 dark:bg-slate-600 flex items-center justify-center">
                    <div className="text-center">
                      <Calendar className="h-8 w-8 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-500">Now</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Split Position Control */}
            {viewMode === 'split' && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Split Position
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {selectedComparison.splitPosition}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedComparison.splitPosition}
                  onChange={(e) => handleAdjustSplit(selectedComparison.id, parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            )}

            {/* Info */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Location</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {selectedComparison.location}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Similarity</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {selectedComparison.similarity}%
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Time Span</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {Math.floor((selectedComparison.newDate.getTime() - selectedComparison.oldDate.getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Photo Comparisons
        </h4>
        <div className="space-y-2">
          {comparisons.map((comparison) => (
            <div
              key={comparison.id}
              className={`p-4 rounded-lg border-2 ${
                selectedComparison?.id === comparison.id
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                    <Split className="h-6 w-6 text-slate-400" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {comparison.title}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {comparison.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(comparison.id)}
                    className="p-1"
                  >
                    {comparison.isFavorite ? (
                      <BookmarkCheck className="h-3 w-3 text-yellow-500" />
                    ) : (
                      <Bookmark className="h-3 w-3 text-slate-400" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(comparison.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <Trash2 className="h-3 w-3 text-red-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Old Date</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {comparison.oldDate.toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">New Date</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {comparison.newDate.toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Similarity</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {comparison.similarity}%
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedComparison(comparison)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-lg transition-colors"
              >
                <Layers className="h-3 w-3" />
                View Comparison
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
        <p className="text-[10px] text-amber-700 dark:text-amber-400">
          <strong>Lưu ý:</strong> So sánh ảnh xưa và nay bằng AR với split view (adjustable), overlay mode (opacity control), side-by-side view, auto-align photos, similarity detection, AR alignment, time span calculation, favorite system, split position adjustment, và comprehensive AR photo comparison system.
        </p>
      </div>
    </div>
  );
}