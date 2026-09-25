'use client';

import { useState } from 'react';
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Info,
  LineChart,
  RefreshCw,
  Star,
  TrendingUp,
  Zap
} from 'lucide-react';

interface MoodTrackingGraphProps {
  onCancel?: () => void;
}

interface MoodDataPoint {
  id: string;
  date: string;
  mood: 'excellent' | 'good' | 'neutral' | 'anxious' | 'depressed';
  moodScore: number;
  factors: string[];
  memoryContext: string;
}

interface GraphSettings {
  timeRange: 'week' | 'month' | 'quarter' | 'year';
  showTrend: boolean;
  showAverages: boolean;
  showFactors: boolean;
}

export default function MoodTrackingGraph({ onCancel }: MoodTrackingGraphProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(true);

  const [moodData, setMoodData] = useState<MoodDataPoint[]>([
    { id: '1', date: '2024-01-08', mood: 'good', moodScore: 8, factors: ['exercise', 'social'], memoryContext: 'Morning workout' },
    { id: '2', date: '2024-01-09', mood: 'excellent', moodScore: 9, factors: ['achievement', 'family'], memoryContext: 'Completed project' },
    { id: '3', date: '2024-01-10', mood: 'neutral', moodScore: 5, factors: ['stress', 'deadline'], memoryContext: 'Busy work day' },
    { id: '4', date: '2024-01-11', mood: 'good', moodScore: 7, factors: ['nature', 'relaxation'], memoryContext: 'Evening walk' },
    { id: '5', date: '2024-01-12', mood: 'anxious', moodScore: 4, factors: ['uncertainty', 'change'], memoryContext: 'News about changes' },
    { id: '6', date: '2024-01-13', mood: 'good', moodScore: 8, factors: ['friends', 'fun'], memoryContext: 'Weekend gathering' },
    { id: '7', date: '2024-01-14', mood: 'excellent', moodScore: 9, factors: ['success', 'celebration'], memoryContext: 'PartyPopper party' },
  ]);

  const [graphSettings, setGraphSettings] = useState<GraphSettings>({
    timeRange: 'week',
    showTrend: true,
    showAverages: true,
    showFactors: true,
  });

  const recordMood = () => {
    const moods: Array<'excellent' | 'good' | 'neutral' | 'anxious' | 'depressed'> = ['excellent', 'good', 'neutral', 'anxious', 'depressed'];
    const newMood: MoodDataPoint = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: moods[Math.floor(Math.random() * moods.length)],
      moodScore: Math.floor(Math.random() * 5) + 5,
      factors: ['rest', 'activity'],
      memoryContext: 'Daily check-in',
    };
    setMoodData([...moodData, newMood]);
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'excellent': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'good': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'neutral': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'anxious': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'depressed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getMoodScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    if (score >= 6) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    if (score >= 4) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Mood Tracking Graph
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Long-term mood tracking visualization
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isTrackingEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isTrackingEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Data Points</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{moodData.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Score</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{(moodData.reduce((acc, d) => acc + d.moodScore, 0) / moodData.length).toFixed(1)}/10</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Trend</p>
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400">Up</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Factors</p>
            <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{new Set(moodData.flatMap(d => d.factors)).size}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isTrackingEnabled}
              onChange={(e) => setIsTrackingEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Tracking</span>
          </div>
          <button
            type="button"
            onClick={recordMood}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <TrendingUp className="h-3 w-3" />
            Record Mood
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Graph Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-slate-900 dark:text-white">Time Range</span>
              </div>
              <select
                value={graphSettings.timeRange}
                onChange={(e) => setGraphSettings({ ...graphSettings, timeRange: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="quarter">Quarter</option>
                <option value="year">CalendarDays</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <LineChart className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Show Trend</span>
              </div>
              <input
                type="checkbox"
                checked={graphSettings.showTrend}
                onChange={(e) => setGraphSettings({ ...graphSettings, showTrend: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Show Averages</span>
              </div>
              <input
                type="checkbox"
                checked={graphSettings.showAverages}
                onChange={(e) => setGraphSettings({ ...graphSettings, showAverages: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Show Factors</span>
              </div>
              <input
                type="checkbox"
                checked={graphSettings.showFactors}
                onChange={(e) => setGraphSettings({ ...graphSettings, showFactors: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Mood Data Points</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {moodData.map((data) => (
              <div key={data.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{data.date}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getMoodColor(data.mood)}`}>
                          {data.mood}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getMoodScoreColor(data.moodScore)}`}>
                          {data.moodScore}/10
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{data.memoryContext}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex flex-wrap gap-1">
                    {data.factors.map((factor) => (
                      <span key={factor} className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <LineChart className="h-3 w-3" />
                    View on Graph
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Mood Tracking Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Long-term mood tracking visualization</li>
              <li>• Time ranges: week, month, quarter, year</li>
              <li>• Track mood scores and influencing factors</li>
              <li>• Visual trend analysis and averages</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
