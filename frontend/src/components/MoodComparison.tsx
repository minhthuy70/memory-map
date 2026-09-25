import { Activity, AlertTriangle, ArrowDown, ArrowUp, BarChart3, CheckCircle, Filter, Frown, HeartCrack, Meh, Settings, Smile, Sparkles, TrendingDown, TrendingUp, X, Zap } from 'lucide-react';
'use client';

import { useState } from 'react';


interface MoodComparisonData {
  period: string;
  moodDistribution: { happy: number; sad: number; neutral: number; excited: number; nostalgic: number };
  totalMemories: number;
  averageIntensity: number;
}

interface MoodComparisonProps {
  onCancel?: () => void;
  onCompareMoods?: () => Promise<void>;
}

const DEFAULT_MOOD_DATA: MoodComparisonData[] = [
  {
    period: 'Q1 2023',
    moodDistribution: { happy: 30, sad: 15, neutral: 20, excited: 18, nostalgic: 12 },
    totalMemories: 95,
    averageIntensity: 0.65,
  },
  {
    period: 'Q2 2023',
    moodDistribution: { happy: 40, sad: 12, neutral: 18, excited: 25, nostalgic: 15 },
    totalMemories: 110,
    averageIntensity: 0.72,
  },
  {
    period: 'Q3 2023',
    moodDistribution: { happy: 35, sad: 18, neutral: 22, excited: 20, nostalgic: 18 },
    totalMemories: 113,
    averageIntensity: 0.68,
  },
  {
    period: 'Q4 2023',
    moodDistribution: { happy: 45, sad: 10, neutral: 15, excited: 30, nostalgic: 20 },
    totalMemories: 120,
    averageIntensity: 0.78,
  },
];

export default function MoodComparison({ onCancel, onCompareMoods }: MoodComparisonProps) {
  const [moodData, setMoodData] = useState<MoodComparisonData[]>(DEFAULT_MOOD_DATA);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedPeriod1, setSelectedPeriod1] = useState('Q1 2023');
  const [selectedPeriod2, setSelectedPeriod2] = useState('Q4 2023');
  const [comparisonView, setComparisonView] = useState<'side-by-side' | 'trend' | 'breakdown'>('side-by-side');

  const period1Data = moodData.find(m => m.period === selectedPeriod1);
  const period2Data = moodData.find(m => m.period === selectedPeriod2);

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
        return <HeartCrack className="h-4 w-4" />;
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

  const compareMood = (mood: string) => {
    if (!period1Data || !period2Data) return { change: 0, changePercent: 0, trend: 'stable' as const };
    const m1 = period1Data.moodDistribution[mood as keyof typeof period1Data.moodDistribution];
    const m2 = period2Data.moodDistribution[mood as keyof typeof period2Data.moodDistribution];
    const change = m2 - m1;
    const changePercent = m1 > 0 ? (change / m1) * 100 : 0;
    return {
      change,
      changePercent,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
    };
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

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <Smile className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              So sánh tâm trạng
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedPeriod1} vs {selectedPeriod2}
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
        <div className="mb-4 p-4 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt mood comparison
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Comparison view
              </label>
              <select
                value={comparisonView}
                onChange={(e) => setComparisonView(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
              >
                <option value="side-by-side">Side by Side</option>
                <option value="trend">Trend</option>
                <option value="breakdown">Breakdown</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show intensity
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Period Selection */}
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Period 1
            </label>
            <select
              value={selectedPeriod1}
              onChange={(e) => setSelectedPeriod1(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
            >
              {moodData.map(m => (
                <option key={m.period} value={m.period}>{m.period}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Period 2
            </label>
            <select
              value={selectedPeriod2}
              onChange={(e) => setSelectedPeriod2(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
            >
              {moodData.map(m => (
                <option key={m.period} value={m.period}>{m.period}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">P1 Total</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {period1Data?.totalMemories || 0}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">P2 Total</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {period2Data?.totalMemories || 0}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">P1 Intensity</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {period1Data ? (period1Data.averageIntensity * 100).toFixed(0) : 0}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">P2 Intensity</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {period2Data ? (period2Data.averageIntensity * 100).toFixed(0) : 0}%
          </div>
        </div>
      </div>

      {/* Mood Comparison */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Mood Comparison
        </h4>
        <div className="space-y-2">
          {['happy', 'sad', 'neutral', 'excited', 'nostalgic'].map((mood) => {
            const comparison = compareMood(mood);
            return (
              <div
                key={mood}
                className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${getMoodColor(mood)}`}>
                      {getMoodIcon(mood)}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                      {mood}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(comparison.trend)}
                    <span className={`text-xs font-semibold ${getTrendColor(comparison.trend)}`}>
                      {comparison.changePercent > 0 ? '+' : ''}{comparison.changePercent.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{selectedPeriod1}</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {period1Data?.moodDistribution[mood as keyof typeof period1Data.moodDistribution] || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{selectedPeriod2}</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {period2Data?.moodDistribution[mood as keyof typeof period2Data.moodDistribution] || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Change</div>
                    <div className={`text-xs font-semibold ${getTrendColor(comparison.trend)}`}>
                      {comparison.change > 0 ? '+' : ''}{comparison.change}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-500"
                      style={{ width: `${(period1Data?.moodDistribution[mood as keyof typeof period1Data.moodDistribution] || 0) / 100}%` }}
                    />
                  </div>
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500"
                      style={{ width: `${(period2Data?.moodDistribution[mood as keyof typeof period2Data.moodDistribution] || 0) / 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trend View */}
      {comparisonView === 'trend' && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Mood Trend Over Time
          </h4>
          <div className="space-y-2">
            {moodData.map((data) => (
              <div
                key={data.period}
                className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {data.period}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {(data.averageIntensity * 100).toFixed(0)}% intensity
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {Object.entries(data.moodDistribution).map(([mood, count]) => (
                    <span
                      key={mood}
                      className={`px-2 py-1 ${getMoodColor(mood).replace('text-', 'bg-').replace('-500', '-100 dark:bg-')} text-[10px] rounded-full`}
                    >
                      {mood}: {count}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 rounded-lg">
        <p className="text-[10px] text-pink-700 dark:text-pink-400">
          <strong>Lưu ý:</strong> So sánh tâm trạng cho phép so sánh phân phối tâm trạng giữa các giai đoạn với mood tracking, intensity analysis, và trend visualization.
        </p>
      </div>
    </div>
  );
}