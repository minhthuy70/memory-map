'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  CheckCircle,
  Filter,
  Settings,
  TrendingDown,
  TrendingUp,
  Zap
} from 'lucide-react';

interface YearData {
  year: number;
  memoryCount: number;
  moodDistribution: { happy: number; sad: number; neutral: number; excited: number; nostalgic: number };
  topLocations: string[];
  topCategories: string[];
  averageRating: number;
}

interface ComparisonMetric {
  metric: string;
  year1: number;
  year2: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

interface YearOverYearComparisonProps {
  onCancel?: () => void;
  onCompareYears?: (year1: number, year2: number) => Promise<void>;
}

const DEFAULT_YEAR_DATA: YearData[] = [
  {
    year: 2021,
    memoryCount: 120,
    moodDistribution: { happy: 50, sad: 20, neutral: 30, excited: 15, nostalgic: 5 },
    topLocations: ['Hanoi', 'Da Nang', 'Ho Chi Minh City'],
    topCategories: ['Personal', 'Travel', 'Career'],
    averageRating: 4.2,
  },
  {
    year: 2022,
    memoryCount: 185,
    moodDistribution: { happy: 70, sad: 25, neutral: 40, excited: 30, nostalgic: 20 },
    topLocations: ['Hanoi', 'Ho Chi Minh City', 'Can Tho'],
    topCategories: ['Personal', 'Career', 'Travel'],
    averageRating: 4.5,
  },
  {
    year: 2023,
    memoryCount: 250,
    moodDistribution: { happy: 90, sad: 30, neutral: 50, excited: 45, nostalgic: 35 },
    topLocations: ['Hanoi', 'Ho Chi Minh City', 'Da Nang'],
    topCategories: ['Personal', 'Travel', 'Career'],
    averageRating: 4.7,
  },
];

export default function YearOverYearComparison({ onCancel, onCompareYears }: YearOverYearComparisonProps) {
  const [yearData, setYearData] = useState<YearData[]>(DEFAULT_YEAR_DATA);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedYear1, setSelectedYear1] = useState(2022);
  const [selectedYear2, setSelectedYear2] = useState(2023);
  const [comparisonMetric, setComparisonMetric] = useState<'count' | 'mood' | 'rating' | 'location'>('count');

  const year1Data = yearData.find(y => y.year === selectedYear1);
  const year2Data = yearData.find(y => y.year === selectedYear2);

  const compareMetric = (year1: number, year2: number) => {
    const change = year2 - year1;
    const changePercent = year1 > 0 ? (change / year1) * 100 : 0;
    return {
      change,
      changePercent,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
    };
  };

  const getComparisonData = () => {
    if (!year1Data || !year2Data) return [];
    
    const metrics: ComparisonMetric[] = [
      {
        metric: 'Memory Count',
        year1: year1Data.memoryCount,
        year2: year2Data.memoryCount,
        ...compareMetric(year1Data.memoryCount, year2Data.memoryCount),
      },
      {
        metric: 'Happy Moods',
        year1: year1Data.moodDistribution.happy,
        year2: year2Data.moodDistribution.happy,
        ...compareMetric(year1Data.moodDistribution.happy, year2Data.moodDistribution.happy),
      },
      {
        metric: 'Average Rating',
        year1: year1Data.averageRating,
        year2: year2Data.averageRating,
        ...compareMetric(year1Data.averageRating, year2Data.averageRating),
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
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              So sánh năm qua năm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedYear1} vs {selectedYear2}
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
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
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
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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

      {/* CalendarDays Selection */}
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              CalendarDays 1
            </label>
            <select
              value={selectedYear1}
              onChange={(e) => setSelectedYear1(parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {yearData.map(y => (
                <option key={y.year} value={y.year}>{y.year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              CalendarDays 2
            </label>
            <select
              value={selectedYear2}
              onChange={(e) => setSelectedYear2(parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {yearData.map(y => (
                <option key={y.year} value={y.year}>{y.year}</option>
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
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{selectedYear1}</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {comp.year1}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{selectedYear2}</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {comp.year2}
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

      {/* CalendarDays Details */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          CalendarDays Details
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {year1Data && (
            <div className="p-4 rounded-lg border-2 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                  {selectedYear1}
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Memories</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {year1Data.memoryCount}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Avg Rating</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {year1Data.averageRating.toFixed(1)}/5
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Top Location</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {year1Data.topLocations[0]}
                  </div>
                </div>
              </div>
            </div>
          )}
          {year2Data && (
            <div className="p-4 rounded-lg border-2 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-green-500" />
                <span className="text-sm font-bold text-green-700 dark:text-green-400">
                  {selectedYear2}
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Memories</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {year2Data.memoryCount}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Avg Rating</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {year2Data.averageRating.toFixed(1)}/5
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Top Location</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {year2Data.topLocations[0]}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mood Comparison */}
      {year1Data && year2Data && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Mood Distribution Comparison
          </h4>
          <div className="space-y-2">
            {Object.keys(year1Data.moodDistribution).map((mood) => (
              <div
                key={mood}
                className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                    {mood}
                  </span>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(compareMetric(year1Data.moodDistribution[mood as keyof typeof year1Data.moodDistribution], year2Data.moodDistribution[mood as keyof typeof year2Data.moodDistribution]).trend)}
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {year1Data.moodDistribution[mood as keyof typeof year1Data.moodDistribution]} → {year2Data.moodDistribution[mood as keyof typeof year2Data.moodDistribution]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${(year1Data.moodDistribution[mood as keyof typeof year1Data.moodDistribution] / 100) * 100}%` }}
                    />
                  </div>
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${(year2Data.moodDistribution[mood as keyof typeof year2Data.moodDistribution] / 100) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> So sánh năm qua năm cho phép so sánh kỷ niệm giữa các năm với memory count, mood distribution, rating, và location tracking.
        </p>
      </div>
    </div>
  );
}