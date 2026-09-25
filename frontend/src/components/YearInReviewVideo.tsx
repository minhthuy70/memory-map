'use client';

import { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Info,
  Play,
  RefreshCw,
  Star,
  TrendingUp,
  Zap
} from 'lucide-react';

interface YearInReviewVideoProps {
  onCancel?: () => void;
}

interface YearlyVideo {
  id: string;
  year: number;
  title: string;
  duration: number;
  memoryCount: number;
  highlights: string[];
  theme: 'modern' | 'retro' | 'minimal' | 'colorful';
  music: string;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
}

interface YearlySettings {
  autoGenerate: boolean;
  defaultTheme: 'modern' | 'retro' | 'minimal' | 'colorful';
  includeHighlights: boolean;
  includeStats: boolean;
  autoTransitions: boolean;
}

export default function YearInReviewVideo({ onCancel }: YearInReviewVideoProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isGeneratorEnabled, setIsGeneratorEnabled] = useState(true);

  const [yearlyVideos, setYearlyVideos] = useState<YearlyVideo[]>([
    { id: '1', year: 2023, title: 'CalendarDays in Review 2023', duration: 300, memoryCount: 156, highlights: ['Beach Trip', 'PartyPopper', 'Graduation'], theme: 'modern', music: 'upbeat', createdAt: '2024-01-15', status: 'completed' },
    { id: '2', year: 2022, title: 'CalendarDays in Review 2022', duration: 280, memoryCount: 142, highlights: ['Wedding', 'New Home', 'Holiday'], theme: 'retro', music: 'emotional', createdAt: '2024-02-20', status: 'completed' },
  ]);

  const [yearlySettings, setYearlySettings] = useState<YearlySettings>({
    autoGenerate: false,
    defaultTheme: 'modern',
    includeHighlights: true,
    includeStats: true,
    autoTransitions: true,
  });

  const [selectedYear, setSelectedYear] = useState(2024);

  const generateYearlyVideo = () => {
    const themes: Array<'modern' | 'retro' | 'minimal' | 'colorful'> = ['modern', 'retro', 'minimal', 'colorful'];
    const newVideo: YearlyVideo = {
      id: Date.now().toString(),
      year: selectedYear,
      title: `CalendarDays in Review ${selectedYear}`,
      duration: Math.floor(Math.random() * 200) + 200,
      memoryCount: Math.floor(Math.random() * 100) + 100,
      highlights: ['Family Trip', 'Celebration', 'Adventure'],
      theme: yearlySettings.defaultTheme,
      music: 'upbeat',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'completed',
    };
    setYearlyVideos([...yearlyVideos, newVideo]);
  };

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'modern': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'retro': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'minimal': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'colorful': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
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
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              CalendarDays-in-Review Video
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Auto-generated yearly summary video
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isGeneratorEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isGeneratorEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Videos</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{yearlyVideos.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Duration</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{(yearlyVideos.reduce((acc, v) => acc + v.duration, 0) / yearlyVideos.length).toFixed(0)}s</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Memories</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{yearlyVideos.reduce((acc, v) => acc + v.memoryCount, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Themes</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{4}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isGeneratorEnabled}
              onChange={(e) => setIsGeneratorEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Generator</span>
          </div>
          <button
            type="button"
            onClick={generateYearlyVideo}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Calendar className="h-3 w-3" />
            Generate CalendarDays Video
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">CalendarDays Selection</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-indigo-400" />
                <span className="text-xs text-slate-900 dark:text-white">Select CalendarDays</span>
              </div>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-24"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Yearly Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-indigo-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Generate</span>
              </div>
              <input
                type="checkbox"
                checked={yearlySettings.autoGenerate}
                onChange={(e) => setYearlySettings({ ...yearlySettings, autoGenerate: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Theme</span>
              </div>
              <select
                value={yearlySettings.defaultTheme}
                onChange={(e) => setYearlySettings({ ...yearlySettings, defaultTheme: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="modern">Modern</option>
                <option value="retro">Retro</option>
                <option value="minimal">Minimal</option>
                <option value="colorful">Colorful</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Highlights</span>
              </div>
              <input
                type="checkbox"
                checked={yearlySettings.includeHighlights}
                onChange={(e) => setYearlySettings({ ...yearlySettings, includeHighlights: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Stats</span>
              </div>
              <input
                type="checkbox"
                checked={yearlySettings.includeStats}
                onChange={(e) => setYearlySettings({ ...yearlySettings, includeStats: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Yearly Videos</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {yearlyVideos.map((video) => (
              <div key={video.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-indigo-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{video.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getThemeColor(video.theme)}`}>
                          {video.theme}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(video.status)}`}>
                          {video.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{video.year} • {video.memoryCount} memories • {video.duration}s • {video.createdAt}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex flex-wrap gap-1">
                    {video.highlights.map((highlight) => (
                      <span key={highlight} className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {highlight}
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
                    <Calendar className="h-3 w-3" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">CalendarDays-in-Review Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI generates yearly summary videos automatically</li>
              <li>• Themes: modern, retro, minimal, colorful</li>
              <li>• Includes key highlights and yearly stats</li>
              <li>• Select any year to generate or review</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
