'use client';

import { useState } from 'react';
import { Folder, X, Settings, CheckCircle, AlertTriangle, ArrowUp, ArrowDown, Activity, TrendingUp, TrendingDown, BarChart3, Filter, Zap, PieChart, Star } from 'lucide-react';

interface CategoryData {
  category: string;
  count: number;
  moodDistribution: { happy: number; sad: number; neutral: number; excited: number; nostalgic: number };
  averageRating: number;
  growthRate: number;
  trend: 'up' | 'down' | 'stable';
}

interface CategoryComparisonProps {
  onCancel?: () => void;
  onCompareCategories?: () => Promise<void>;
}

const DEFAULT_CATEGORIES: CategoryData[] = [
  {
    category: 'Personal',
    count: 120,
    moodDistribution: { happy: 60, sad: 20, neutral: 30, excited: 35, nostalgic: 15 },
    averageRating: 4.5,
    growthRate: 15,
    trend: 'up',
  },
  {
    category: 'Career',
    count: 85,
    moodDistribution: { happy: 35, sad: 15, neutral: 25, excited: 20, narcissistic: 10 },
    averageRating: 4.2,
    growthRate: 8,
    trend: 'up',
  },
  {
    category: 'Travel',
    count: 65,
    moodDistribution: { happy: 40, sad: 10, neutral: 15, excited: 30, nostalgic: 20 },
    averageRating: 4.7,
    growthRate: 25,
    trend: 'up',
  },
  {
    category: 'Education',
    count: 45,
    moodDistribution: { happy: 25, sad: 12, neutral: 18, excited: 15, narcissistic: 8 },
    averageRating: 4.0,
    growthRate: 5,
    trend: 'stable',
  },
  {
    category: 'Social',
    count: 35,
    moodDistribution: { happy: 20, sad: 8, neutral: 10, excited: 18, narcissistic: 12 },
    averageRating: 4.3,
    growthRate: -5,
    trend: 'down',
  },
];

export default function CategoryComparison({ onCancel, onCompareCategories }: CategoryComparisonProps) {
  const [categories, setCategories] = useState<CategoryData[]>(DEFAULT_CATEGORIES);
  const [showSettings, setShowSettings] = useState(false);
  const [comparisonType, setComparisonType] = useState<'count' | 'mood' | 'rating' | 'growth'>('count');
  const [sortBy, setSortBy] = useState<'count' | 'rating' | 'growth'>('count');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <Activity className="h-3 w-3 text-slate-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-500';
      default:
        return 'text-slate-500';
    }
  };

  const sortedCategories = [...categories].sort((a, b) => {
    if (sortBy === 'count') return b.count - a.count;
    if (sortBy === 'rating') return b.averageRating - a.averageRating;
    return b.growthRate - a.growthRate;
  });

  const totalMemories = categories.reduce((sum, c) => sum + c.count, 0);
  const avgRating = categories.reduce((sum, c) => sum + c.averageRating, 0) / categories.length;
  const avgGrowth = categories.reduce((sum, c) => sum + c.growthRate, 0) / categories.length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
            <Folder className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              So sánh danh mục
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {categories.length} categories
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
        <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt category comparison
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Comparison type
              </label>
              <select
                value={comparisonType}
                onChange={(e) => setComparisonType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="count">Memory Count</option>
                <option value="mood">Mood Distribution</option>
                <option value="rating">Average Rating</option>
                <option value="growth">Growth Rate</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="count">Count</option>
                <option value="rating">Rating</option>
                <option value="growth">Growth</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show pie chart
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
            <Folder className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalMemories}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Rating</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgRating.toFixed(1)}/5
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Growth</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgGrowth.toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Categories</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {categories.length}
          </div>
        </div>
      </div>

      {/* Category Comparison */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Category Comparison
        </h4>
        <div className="space-y-2">
          {sortedCategories.map((category) => (
            <div
              key={category.category}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {category.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(category.trend)}
                  <span className={`text-xs font-semibold ${getTrendColor(category.trend)}`}>
                    {category.growthRate > 0 ? '+' : ''}{category.growthRate}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Count</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {category.count}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Rating</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {category.averageRating.toFixed(1)}/5
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Trend</div>
                  <div className={`text-xs font-semibold ${getTrendColor(category.trend)}`}>
                    {category.trend}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-amber-500"
                    style={{ width: `${(category.count / totalMemories) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {((category.count / totalMemories) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mood Distribution by Category */}
      {comparisonType === 'mood' && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Mood Distribution by Category
          </h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.category}
                className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {category.category}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {Object.entries(category.moodDistribution).map(([mood, count]) => (
                    <span
                      key={mood}
                      className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-[10px] rounded-full"
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

      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg">
        <p className="text-[10px] text-orange-700 dark:text-orange-400">
          <strong>Lưu ý:</strong> So sánh danh mục cho phép so sánh số lượng kỷ niệm giữa các danh mục với mood distribution, rating, growth rate, và sorting options.
        </p>
      </div>
    </div>
  );
}