'use client';

import { useState } from 'react';
import { TrendingUp, X, Settings, CheckCircle, AlertTriangle, Smile, Frown, Meh, Sparkles, HeartCrack, Calendar, Activity, BarChart3, Clock, ArrowUp, ArrowDown } from 'lucide-react';

interface MoodData {
  id: string;
  date: Date;
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'nostalgic';
  intensity: number;
  notes: string;
}

interface MoodTrend {
  period: string;
  average: number;
  trend: 'up' | 'down' | 'stable';
}

interface MoodTrendsAnalysisProps {
  onCancel?: () => void;
  onAnalyzeTrends?: (period: string) => Promise<void>;
}

const DEFAULT_MOOD_DATA: MoodData[] = [
  { id: 'mood-1', date: new Date('2023-01-15'), mood: 'happy', intensity: 0.8, notes: 'Great day at work' },
  { id: 'mood-2', date: new Date('2023-02-20'), mood: 'sad', intensity: 0.3, notes: 'Missed family' },
  { id: 'mood-3', date: new Date('2023-03-10'), mood: 'excited', intensity: 0.9, notes: 'New adventure' },
  { id: 'mood-4', date: new Date('2023-04-25'), mood: 'neutral', intensity: 0.5, notes: 'Regular day' },
  { id: 'mood-5', date: new Date('2023-05-30'), mood: 'nostalgic', intensity: 0.6, notes: 'Old memories' },
];

const DEFAULT_TRENDS: MoodTrend[] = [
  { period: 'Jan 2023', average: 0.75, trend: 'up' },
  { period: 'Feb 2023', average: 0.60, trend: 'down' },
  { period: 'Mar 2023', average: 0.80, trend: 'up' },
  { period: 'Apr 2023', average: 0.65, trend: 'down' },
  { period: 'May 2023', average: 0.70, trend: 'stable' },
];

export default function MoodTrendsAnalysis({ onCancel, onAnalyzeTrends }: MoodTrendsAnalysisProps) {
  const [moodData, setMoodData] = useState<MoodData[]>(DEFAULT_MOOD_DATA);
  const [trends, setTrends] = useState<MoodTrend[]>(DEFAULT_TRENDS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [showMoodBreakdown, setShowMoodBreakdown] = useState(true);

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy':
        return <Smile className="h-4 w-4" />;
      case 'sad':
        return <Frown className="h-4 w-4" />;
      case 'neutral':
        return <Meh className="h-4 w-4" />;
      case 'excited':
        return <Sparkles className="h-4 w-4" />;
      case 'nostalgic':
        return <HeartBroken className="h-4 w-4" />;
      default:
        return <Meh className="h-4 w-4" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy':
        return 'text-green-500';
      case 'sad':
        return 'text-blue-500';
      case 'neutral':
        return 'text-slate-500';
      case 'excited':
        return 'text-orange-500';
      case 'nostalgic':
        return 'text-purple-500';
      default:
        return 'text-slate-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <ArrowDown className="h-3 w-3 text-red-500" />;
      default:
        return <Activity className="h-3 w-3 text-slate-500" />;
    }
  };

  const moodCounts = moodData.reduce((acc, m) => {
    acc[m.mood] = (acc[m.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgMood = moodData.reduce((sum, m) => sum + m.intensity, 0) / moodData.length;
  const dominantMood = Object.entries(moodCounts).reduce((max, [mood, count]) => count > max.count ? { mood, count } : max, { mood: 'neutral', count: 0 });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Phân tích xu hướng tâm trạng
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {moodData.length} entries
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
            Cài đặt mood analysis
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Analysis period
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show mood breakdown
              </span>
              <button
                type="button"
                onClick={() => setShowMoodBreakdown(!showMoodBreakdown)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  showMoodBreakdown ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    showMoodBreakdown ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Mood</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(avgMood * 100).toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Smile className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Dominant</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white capitalize">
            {dominantMood.mood}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Entries</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {moodData.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Trend</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white capitalize">
            {trends[trends.length - 1]?.trend}
          </div>
        </div>
      </div>

      {/* Mood Breakdown */}
      {showMoodBreakdown && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Mood Breakdown
          </h4>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(moodCounts).map(([mood, count]) => (
              <div
                key={mood}
                className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className={`flex items-center justify-center mb-2 ${getMoodColor(mood)}`}>
                  {getMoodIcon(mood)}
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300 capitalize">
                    {mood}
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mood Trends */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Mood Trends
        </h4>
        <div className="space-y-2">
          {trends.map((trend) => (
            <div
              key={trend.period}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {trend.period}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(trend.trend)}
                  <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {trend.trend}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      trend.trend === 'up' ? 'bg-green-500' : trend.trend === 'down' ? 'bg-red-500' : 'bg-slate-500'
                    }`}
                    style={{ width: `${trend.average * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {(trend.average * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Mood Entries */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Recent Entries
        </h4>
        <div className="space-y-2">
          {moodData.slice(0, 5).map((data) => (
            <div
              key={data.id}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getMoodColor(data.mood)}`}>
                    {getMoodIcon(data.mood)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                    {data.mood}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {(data.intensity * 100).toFixed(0)}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Date</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {data.date.toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Intensity</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {data.intensity.toFixed(2)}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                {data.notes}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> Phân tích xu hướng tâm trạng hiển thị thay đổi tâm trạng theo thời gian với mood breakdown, trend analysis, và intensity tracking.
        </p>
      </div>
    </div>
  );
}