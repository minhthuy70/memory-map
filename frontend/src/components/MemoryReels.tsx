'use client';

import { useState } from 'react';
import { Smartphone, X, RefreshCw, Info, CheckCircle, Star, Zap, Play, Download, Clock, Share2 } from 'lucide-react';

interface MemoryReelsProps {
  onCancel?: () => void;
}

interface MemoryReel {
  id: string;
  title: string;
  duration: number;
  memoryCount: number;
  aspectRatio: '9:16' | '1:1' | '4:5';
  style: 'trending' | 'aesthetic' | 'minimal' | 'vibrant';
  music: string;
  filters: string[];
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
  views: number;
}

interface ReelSettings {
  autoGenerate: boolean;
  defaultAspectRatio: '9:16' | '1:1' | '4:5';
  defaultStyle: 'trending' | 'aesthetic' | 'minimal' | 'vibrant';
  includeMusic: boolean;
  autoFilters: boolean;
}

export default function MemoryReels({ onCancel }: MemoryReelsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isReelsEnabled, setIsReelsEnabled] = useState(true);

  const [memoryReels, setMemoryReels] = useState<MemoryReel[]>([
    { id: '1', title: 'Summer Vibes', duration: 30, memoryCount: 8, aspectRatio: '9:16', style: 'trending', music: 'pop', filters: ['bright', 'warm'], createdAt: '2024-01-15', status: 'completed', views: 1250 },
    { id: '2', title: 'City Life', duration: 45, memoryCount: 12, aspectRatio: '1:1', style: 'aesthetic', music: 'chill', filters: ['grayscale', 'contrast'], createdAt: '2024-02-20', status: 'completed', views: 890 },
  ]);

  const [reelSettings, setReelSettings] = useState<ReelSettings>({
    autoGenerate: false,
    defaultAspectRatio: '9:16',
    defaultStyle: 'trending',
    includeMusic: true,
    autoFilters: true,
  });

  const createReel = () => {
    const aspectRatios: Array<'9:16' | '1:1' | '4:5'> = ['9:16', '1:1', '4:5'];
    const styles: Array<'trending' | 'aesthetic' | 'minimal' | 'vibrant'> = ['trending', 'aesthetic', 'minimal', 'vibrant'];
    const newReel: MemoryReel = {
      id: Date.now().toString(),
      title: `Reel ${memoryReels.length + 1}`,
      duration: Math.floor(Math.random() * 30) + 15,
      memoryCount: Math.floor(Math.random() * 10) + 5,
      aspectRatio: reelSettings.defaultAspectRatio,
      style: reelSettings.defaultStyle,
      music: 'pop',
      filters: ['bright', 'warm'],
      createdAt: new Date().toISOString().split('T')[0],
      status: 'completed',
      views: Math.floor(Math.random() * 1000) + 100,
    };
    setMemoryReels([...memoryReels, newReel]);
  };

  const getAspectRatioColor = (ratio: string) => {
    switch (ratio) {
      case '9:16': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case '1:1': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case '4:5': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'trending': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'aesthetic': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'minimal': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'vibrant': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'processing': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <Smartphone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Memory Reels (Instagram-style)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Short Instagram-style memory reels
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isReelsEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isReelsEnabled ? 'Enabled' : 'Disabled'}
          </span>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show details"
          >
            {showDetails ? <Info className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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

      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Reels</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{memoryReels.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Duration</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{(memoryReels.reduce((acc, r) => acc + r.duration, 0) / memoryReels.length).toFixed(0)}s</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Views</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{memoryReels.reduce((acc, r) => acc + r.views, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Styles</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">{4}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isReelsEnabled}
              onChange={(e) => setIsReelsEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Reels</span>
          </div>
          <button
            type="button"
            onClick={createReel}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Smartphone className="h-3 w-3" />
            Create Reel
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Reel Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-pink-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Generate</span>
              </div>
              <input
                type="checkbox"
                checked={reelSettings.autoGenerate}
                onChange={(e) => setReelSettings({ ...reelSettings, autoGenerate: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Aspect Ratio</span>
              </div>
              <select
                value={reelSettings.defaultAspectRatio}
                onChange={(e) => setReelSettings({ ...reelSettings, defaultAspectRatio: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="9:16">9:16 (Portrait)</option>
                <option value="1:1">1:1 (Square)</option>
                <option value="4:5">4:5 (Instagram)</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Style</span>
              </div>
              <select
                value={reelSettings.defaultStyle}
                onChange={(e) => setReelSettings({ ...reelSettings, defaultStyle: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="trending">Trending</option>
                <option value="aesthetic">Aesthetic</option>
                <option value="minimal">Minimal</option>
                <option value="vibrant">Vibrant</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Music</span>
              </div>
              <input
                type="checkbox"
                checked={reelSettings.includeMusic}
                onChange={(e) => setReelSettings({ ...reelSettings, includeMusic: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Share2 className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Filters</span>
              </div>
              <input
                type="checkbox"
                checked={reelSettings.autoFilters}
                onChange={(e) => setReelSettings({ ...reelSettings, autoFilters: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Memory Reels</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {memoryReels.map((reel) => (
              <div key={reel.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-4 w-4 text-pink-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{reel.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getAspectRatioColor(reel.aspectRatio)}`}>
                          {reel.aspectRatio}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStyleColor(reel.style)}`}>
                          {reel.style}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(reel.status)}`}>
                          {reel.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{reel.memoryCount} memories • {reel.duration}s • {reel.views} views • {reel.createdAt}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex flex-wrap gap-1">
                    {reel.filters.map((filter) => (
                      <span key={filter} className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {filter}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <Play className="h-3 w-3" />
                    Play
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Share2 className="h-3 w-3" />
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Memory Reels Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Instagram-style short memory reels</li>
              <li>• Aspect ratios: 9:16, 1:1, 4:5</li>
              <li>• Styles: trending, aesthetic, minimal, vibrant</li>
              <li>• Auto filters and music options</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
