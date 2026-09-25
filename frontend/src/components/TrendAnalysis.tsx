'use client';

import { useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  as,
  BarChart3,
  CheckCircle,
  Filter,
  LineChart,
  Settings,
  Sparkles,
  TrendingDown,
  TrendingUp,
  TrendUp,
  Zap
} from 'lucide-react';

interface TrendData {
  period: string;
  value: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

interface TrendPattern {
  id: string;
  name: string;
  type: 'seasonal' | 'cyclical' | 'linear' | 'exponential';
  strength: number;
  confidence: number;
  description: string;
}

interface TrendAnalysisProps {
  onCancel?: () => void;
  onAnalyzeTrends?: () => Promise<void>;
}

const DEFAULT_TREND_DATA: TrendData[] = [
  { period: 'Jan', value: 15, change: 0, changePercent: 0, trend: 'stable' },
  { period: 'Feb', value: 22, change: 7, changePercent: 46.7, trend: 'up' },
  { period: 'Mar', value: 18, change: -4, changePercent: -18.2, trend: 'down' },
  { period: 'Apr', value: 25, change: 7, changePercent: 38.9, trend: 'up' },
  { period: 'May', value: 30, change: 5, changePercent: 20.0, trend: 'up' },
  { period: 'Jun', value: 28, change: -2, changePercent: -6.7, trend: 'down' },
];

const DEFAULT_PATTERNS: TrendPattern[] = [
  {
    id: 'pattern-1',
    name: 'Weekly Memory Creation',
    type: 'cyclical',
    strength: 0.85,
    confidence: 0.92,
    description: 'Higher memory creation on weekends',
  },
  {
    id: 'pattern-2',
    name: 'Seasonal Travel',
    type: 'seasonal',
    strength: 0.78,
    confidence: 0.88,
    description: 'Peak travel memories in summer months',
  },
  {
    id: 'pattern-3',
    name: 'Growth Trend',
    type: 'linear',
    strength: 0.92,
    confidence: 0.95,
    description: 'Consistent monthly growth of 15%',
  },
];

export default function TrendAnalysis({ onCancel, onAnalyzeTrends }: TrendAnalysisProps) {
  const [trendData, setTrendData] = useState<TrendData[]>(DEFAULT_TREND_DATA);
  const [patterns, setPatterns] = useState<TrendPattern[]>(DEFAULT_PATTERNS);
  const [showSettings, setShowSettings] = useState(false);
  const [trendType, setTrendType] = useState<'memory' | 'mood' | 'location' | 'category'>('memory');
  const [timeRange, setTimeRange] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [showPredictions, setShowPredictions] = useState(true);

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

  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'seasonal':
        return <Sparkles className="h-4 w-4" />;
      case 'cyclical':
        return <LineChart className="h-4 w-4" />;
      case 'linear':
        return <TrendUp className="h-4 w-4" />;
      case 'exponential':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getPatternColor = (type: string) => {
    switch (type) {
      case 'seasonal':
        return 'text-orange-500';
      case 'cyclical':
        return 'text-blue-500';
      case 'linear':
        return 'text-green-500';
      case 'exponential':
        return 'text-purple-500';
      default:
        return 'text-slate-500';
    }
  };

  const overallTrend = trendData[trendData.length - 1]?.trend || 'stable';
  const avgGrowth = trendData.reduce((sum, t) => sum + t.changePercent, 0) / trendData.length;
  const highestGrowth = trendData.reduce((max, t) => t.changePercent > max.changePercent ? t : max, trendData[0]);
  const latestValue = trendData[trendData.length - 1]?.value || 0;

  const predictedValue = showPredictions 
    ? Math.round(latestValue * (1 + avgGrowth / 100))
    : null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Phân tích xu hướng
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {trendType} trends
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
        <div className="mb-4 p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt trend analysis
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Trend type
              </label>
              <select
                value={trendType}
                onChange={(e) => setTrendType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              >
                <option value="memory">Memory Count</option>
                <option value="mood">Mood Distribution</option>
                <option value="location">Location Frequency</option>
                <option value="category">Category Trends</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Time range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show predictions
              </span>
              <button
                type="button"
                onClick={() => setShowPredictions(!showPredictions)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  showPredictions ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    showPredictions ? 'translate-x-5' : ''
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
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Latest</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {latestValue}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <TrendUp className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Growth</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgGrowth.toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Peak</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {highestGrowth.period}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <LineChart className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Trend</span>
          </div>
          <div className={`text-lg font-bold ${getTrendColor(overallTrend)}`}>
            {overallTrend}
          </div>
        </div>
      </div>

      {/* Prediction */}
      {showPredictions && predictedValue && (
        <div className="mb-4 p-4 rounded-lg border-2 bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-teal-500" />
            <span className="text-sm font-medium text-teal-700 dark:text-teal-400">
              Predicted Next Period
            </span>
          </div>
          <div className="text-lg font-bold text-teal-700 dark:text-teal-400">
            {predictedValue} {trendType === 'memory' ? 'memories' : trendType === 'mood' ? 'mood score' : trendType === 'location' ? 'visits' : 'entries'}
          </div>
          <p className="text-xs text-teal-600 dark:text-teal-500">
            Based on average growth rate of {avgGrowth.toFixed(0)}%
          </p>
        </div>
      )}

      {/* Trend Line */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Trend Line
        </h4>
        <div className="space-y-2">
          {trendData.map((trend) => (
            <div
              key={trend.period}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {trend.period}
                </span>
                <div className="flex items-center gap-2">
                  {getTrendIcon(trend.trend)}
                  <span className={`text-xs font-semibold ${getTrendColor(trend.trend)}`}>
                    {trend.changePercent > 0 ? '+' : ''}{trend.changePercent.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      trend.trend === 'up' ? 'bg-green-500' : trend.trend === 'down' ? 'bg-red-500' : 'bg-slate-500'
                    }`}
                    style={{ width: `${(trend.value / Math.max(...trendData.map(t => t.value))) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {trend.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detected Patterns */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Detected Patterns
        </h4>
        <div className="space-y-2">
          {patterns.map((pattern) => (
            <div
              key={pattern.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getPatternColor(pattern.type)}`}>
                    {getPatternIcon(pattern.type)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {pattern.name}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {pattern.type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Strength</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {(pattern.strength * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Confidence</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {(pattern.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                {pattern.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Insights */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Trend Insights
        </h4>
        <div className="space-y-2">
          <div className="p-3 rounded-lg border-2 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <TrendUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                Positive Growth
              </span>
            </div>
            <p className="text-xs text-green-600 dark:text-green-500">
              Overall trend shows consistent growth with an average increase of {avgGrowth.toFixed(0)}% per period.
            </p>
          </div>
          <div className="p-3 rounded-lg border-2 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Seasonal Variation
              </span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-500">
              Detected seasonal patterns suggest higher activity in summer months with {patterns[0]?.strength ? (patterns[0].strength * 100).toFixed(0) : 0}% confidence.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-lg">
        <p className="text-[10px] text-teal-700 dark:text-teal-400">
          <strong>Lưu ý:</strong> Phân tích xu hướng xác định các mẫu và xu hướng trong dữ liệu kỷ niệm với trend detection, pattern recognition, predictions, và insights.
        </p>
      </div>
    </div>
  );
}