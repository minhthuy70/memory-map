'use client';

import { useState } from 'react';
import { CalendarDays, X, Settings, CheckCircle, AlertTriangle, ArrowUp, ArrowDown, Activity, TrendingUp, TrendingDown, BarChart3, Filter, Zap, Calendar } from 'lucide-react';

interface MonthData {
  year: number;
  month: string;
  memoryCount: number;
  moodDistribution: { happy: number; sad: number; neutral: number; excited: number; nostalgic: number };
  topLocations: string[];
  averageRating: number;
}

interface ComparisonMetric {
  metric: string;
  month1: number;
  month2: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

interface MonthOverMonthComparisonProps {
  onCancel?: () => void;
  onCompareMonths?: (year1: number, month1: string, year2: number, month2: string) => Promise<void>;
}

const DEFAULT_MONTH_DATA: MonthData[] = [
  {
    year: 2023,
    month: 'Jan',
    memoryCount: 15,
    moodDistribution: { happy: 8, sad: 3, neutral: 4, excited: 5, nostalgic: 2 },
    topLocations: ['Hanoi'],
    averageRating: 4.2,
  },
  {
    year: 2023,
    month: 'Feb',
    memoryCount: 22,
    moodDistribution: { happy: 12, sad: 4, neutral: 6, excited: 8, nostalgic: 3 },
    topLocations: ['Hanoi', 'Da Nang'],
    averageRating: 4.3,
  },
  {
    year: 2023,
    month: 'Mar',
    memoryCount: 18,
    moodDistribution: { happy: 10, sad: 3, neutral: 5, excited: 6, nostalgic: 2 },
    topLocations: ['Hanoi'],
    averageRating: 4.1,
  },
  {
    year: 2023,
    month: 'Apr',
    memoryCount: 25,
    moodDistribution: { happy: 14, sad: 4, neutral: 7, excited: 9, nostalgic: 4 },
    topLocations: ['Hanoi', 'Ho Chi Minh City'],
    averageRating: 4.4,
  },
  {
    year: 2023,
    month: 'May',
    memoryCount: 30,
    moodDistribution: { happy: 18, sad: 5, neutral: 7, excited: 12, nostalgic: 5 },
    topLocations: ['Hanoi', 'Da Nang'],
    averageRating: 4.5,
  },
  {
    year: 2023,
    month: 'Jun',
    memoryCount: 28,
    moodDistribution: { happy: 16, sad: 4, neutral: 8, excited: 10, nostalgic: 4 },
    topLocations: ['Hanoi', 'Can Tho'],
    averageRating: 4.3,
  },
];

export default function MonthOverMonthComparison({ onCancel, onCompareMonths }: MonthOverMonthComparisonProps) {
  const [monthData, setMonthData] = useState<MonthData[]>(DEFAULT_MONTH_DATA);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2023);
  const [selectedMonth1, setSelectedMonth1] = useState('Jan');
  const [selectedMonth2, setSelectedMonth2] = useState('Feb');
  const [comparisonMetric, setComparisonMetric] = useState<'count' | 'mood' | 'rating' | 'location'>('count');

  const filteredData = monthData.filter(m => m.year === selectedYear);
  const month1Data = filteredData.find(m => m.month === selectedMonth1);
  const month2Data = filteredData.find(m => m.month === selectedMonth2);

  const compareMetric = (month1: number, month2: number) => {
    const change = month2 - month1;
    const changePercent = month1 > 0 ? (change / month1) * 100 : 0;
    return {
      change,
      changePercent,
      trend: (change > 0 ? 'up' : change < 0 ? 'down' : 'stable') as 'up' | 'down' | 'stable',
    };
  };

  const getComparisonData = () => {
    if (!month1Data || !month2Data) return [];
    
    const metrics: ComparisonMetric[] = [
      {
        metric: 'Memory Count',
        month1: month1Data.memoryCount,
        month2: month2Data.memoryCount,
        ...compareMetric(month1Data.memoryCount, month2Data.memoryCount),
      },
      {
        metric: 'Happy Moods',
        month1: month1Data.moodDistribution.happy,
        month2: month2Data.moodDistribution.happy,
        ...compareMetric(month1Data.moodDistribution.happy, month2Data.moodDistribution.happy),
      },
      {
        metric: 'Average Rating',
        month1: month1Data.averageRating,
        month2: month2Data.averageRating,
        ...compareMetric(month1Data.averageRating, month2Data.averageRating),
      },
    ];
    return metrics;
  };

  const comparisons = getComparisonData();

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
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <CalendarDays className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              So sánh tháng qua tháng
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedMonth1} vs {selectedMonth2} ({selectedYear})
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
            Cài đặt comparison
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Compare metric
              </label>
              <select
                value={comparisonMetric}
                onChange={(e) => setComparisonMetric(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="count">Memory Count</option>
                <option value="mood">Mood Distribution</option>
                <option value="rating">Average Rating</option>
                <option value="location">Location Distribution</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show breakdown
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Year Selection */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
          Year
        </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
        >
          <option value={2023}>2023</option>
          <option value={2022}>2022</option>
          <option value={2021}>2021</option>
        </select>
      </div>

      {/* Month Selection */}
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Month 1
            </label>
            <select
              value={selectedMonth1}
              onChange={(e) => setSelectedMonth1(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              {filteredData.map(m => (
                <option key={m.month} value={m.month}>{m.month}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Month 2
            </label>
            <select
              value={selectedMonth2}
              onChange={(e) => setSelectedMonth2(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              {filteredData.map(m => (
                <option key={m.month} value={m.month}>{m.month}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Metrics */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Comparison Metrics
        </h4>
        <div className="space-y-2">
          {comparisons.map((comp) => (
            <div
              key={comp.metric}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {comp.metric}
                </span>
                <div className="flex items-center gap-2">
                  {getTrendIcon(comp.trend)}
                  <span className={`text-xs font-semibold ${getTrendColor(comp.trend)}`}>
                    {comp.changePercent > 0 ? '+' : ''}{comp.changePercent.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{selectedMonth1}</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {comp.month1}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{selectedMonth2}</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {comp.month2}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Change</div>
                  <div className={`text-xs font-semibold ${getTrendColor(comp.trend)}`}>
                    {comp.change > 0 ? '+' : ''}{comp.change}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Month Details */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Month Details
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {month1Data && (
            <div className="p-4 rounded-lg border-2 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-bold text-purple-700 dark:text-purple-400">
                  {selectedMonth1} {selectedYear}
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Memories</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {month1Data.memoryCount}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Avg Rating</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {month1Data.averageRating.toFixed(1)}/5
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Top Location</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {month1Data.topLocations[0]}
                  </div>
                </div>
              </div>
            </div>
          )}
          {month2Data && (
            <div className="p-4 rounded-lg border-2 bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-pink-500" />
                <span className="text-sm font-bold text-pink-700 dark:text-pink-400">
                  {selectedMonth2} {selectedYear}
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Memories</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {month2Data.memoryCount}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Avg Rating</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {month2Data.averageRating.toFixed(1)}/5
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Top Location</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {month2Data.topLocations[0]}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mood Comparison */}
      {month1Data && month2Data && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Mood Distribution Comparison
          </h4>
          <div className="space-y-2">
            {Object.keys(month1Data.moodDistribution).map((mood) => (
              <div
                key={mood}
                className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                    {mood}
                  </span>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(compareMetric(month1Data.moodDistribution[mood as keyof typeof month1Data.moodDistribution], month2Data.moodDistribution[mood as keyof typeof month2Data.moodDistribution]).trend)}
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {month1Data.moodDistribution[mood as keyof typeof month1Data.moodDistribution]} → {month2Data.moodDistribution[mood as keyof typeof month2Data.moodDistribution]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${(month1Data.moodDistribution[mood as keyof typeof month1Data.moodDistribution] / 100) * 100}%` }}
                    />
                  </div>
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-500"
                      style={{ width: `${(month2Data.moodDistribution[mood as keyof typeof month2Data.moodDistribution] / 100) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> So sánh tháng qua tháng cho phép so sánh kỷ niệm giữa các tháng với memory count, mood distribution, rating, và location tracking.
        </p>
      </div>
    </div>
  );
}