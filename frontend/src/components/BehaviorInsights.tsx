'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Lightbulb,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';

interface BehaviorPattern {
  id: string;
  name: string;
  type: 'time' | 'location' | 'mood' | 'category';
  frequency: number;
  confidence: number;
  description: string;
  recommendation: string;
}

interface BehaviorMetric {
  id: string;
  metric: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  benchmark: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
}

interface BehaviorInsightsProps {
  onCancel?: () => void;
  onAnalyzeBehavior?: () => Promise<void>;
}

const DEFAULT_PATTERNS: BehaviorPattern[] = [
  {
    id: 'pattern-1',
    name: 'Weekend Memory Creation',
    type: 'time',
    frequency: 0.72,
    confidence: 0.92,
    description: 'Most memories are created on weekends',
    recommendation: 'Consider setting reminders to capture weekday moments',
  },
  {
    id: 'pattern-2',
    name: 'Travel-Focused',
    type: 'category',
    frequency: 0.45,
    confidence: 0.85,
    description: 'High concentration of travel memories',
    recommendation: 'Create dedicated travel albums for better organization',
  },
  {
    id: 'pattern-3',
    name: 'Evening Activity',
    type: 'time',
    frequency: 0.65,
    confidence: 0.78,
    description: 'Peak memory creation in evening hours',
    recommendation: 'Enable quick capture mode for easy evening logging',
  },
  {
    id: 'pattern-4',
    name: 'Positive Mood Bias',
    type: 'mood',
    frequency: 0.58,
    confidence: 0.88,
    description: 'Skewed towards happy and excited moods',
    recommendation: 'Try to capture a more balanced range of emotions',
  },
];

const DEFAULT_METRICS: BehaviorMetric[] = [
  {
    id: 'metric-1',
    metric: 'Memory Frequency',
    value: 4.2,
    trend: 'up',
    benchmark: 3.5,
    status: 'excellent',
  },
  {
    id: 'metric-2',
    metric: 'Diversity Score',
    value: 0.68,
    trend: 'stable',
    benchmark: 0.75,
    status: 'good',
  },
  {
    id: 'metric-3',
    metric: 'Consistency Index',
    value: 0.72,
    trend: 'up',
    benchmark: 0.65,
    status: 'excellent',
  },
  {
    id: 'metric-4',
    metric: 'Engagement Rate',
    value: 0.55,
    trend: 'down',
    benchmark: 0.60,
    status: 'average',
  },
];

export default function BehaviorInsights({ onCancel, onAnalyzeBehavior }: BehaviorInsightsProps) {
  const [patterns, setPatterns] = useState<BehaviorPattern[]>(DEFAULT_PATTERNS);
  const [metrics, setMetrics] = useState<BehaviorMetric[]>(DEFAULT_METRICS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [analysisPeriod, setAnalysisPeriod] = useState('30');
  const [showRecommendations, setShowRecommendations] = useState(true);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'time':
        return <Clock className="h-4 w-4" />;
      case 'location':
        return <Activity className="h-4 w-4" />;
      case 'mood':
        return <Sparkles className="h-4 w-4" />;
      case 'category':
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'time':
        return 'text-blue-500';
      case 'location':
        return 'text-green-500';
      case 'mood':
        return 'text-purple-500';
      case 'category':
        return 'text-orange-500';
      default:
        return 'text-slate-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-500';
      case 'good':
        return 'text-blue-500';
      case 'average':
        return 'text-yellow-500';
      case 'poor':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default:
        return <Activity className="h-3 w-3 text-slate-500" />;
    }
  };

  const filteredPatterns = patterns.filter(p => 
    selectedType === 'all' || p.type === selectedType
  );

  const avgConfidence = patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length;
  const excellentMetrics = metrics.filter(m => m.status === 'excellent').length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Thông tin hành vi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {patterns.length} patterns detected
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
            Cài đặt behavior insights
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Analysis period: {analysisPeriod} days
              </label>
              <input
                type="range"
                min="7"
                max="90"
                value={analysisPeriod}
                onChange={(e) => setAnalysisPeriod(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show recommendations
              </span>
              <button
                type="button"
                onClick={() => setShowRecommendations(!showRecommendations)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  showRecommendations ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    showRecommendations ? 'translate-x-5' : ''
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
            <Target className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Patterns</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {patterns.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Confidence</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(avgConfidence * 100).toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Excellent</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {excellentMetrics}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Period</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {analysisPeriod}d
          </div>
        </div>
      </div>

      {/* Type Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedType('all')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('time')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'time'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Time
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('location')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'location'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Location
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('mood')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'mood'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Mood
          </button>
        </div>
      </div>

      {/* Behavior Patterns */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Detected Patterns
        </h4>
        <div className="space-y-2">
          {filteredPatterns.map((pattern) => (
            <div
              key={pattern.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getTypeColor(pattern.type)}`}>
                    {getTypeIcon(pattern.type)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {pattern.name}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {(pattern.confidence * 100).toFixed(0)}% confidence
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {pattern.description}
              </p>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-500"
                    style={{ width: `${pattern.frequency * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {(pattern.frequency * 100).toFixed(0)}%
                </span>
              </div>

              {showRecommendations && (
                <div className="p-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-blue-700 dark:text-blue-400">
                      {pattern.recommendation}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Behavior Metrics */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Behavior Metrics
        </h4>
        <div className="space-y-2">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {metric.metric}
                </span>
                <div className="flex items-center gap-2">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-xs font-semibold ${getStatusColor(metric.status)}`}>
                    {metric.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Value</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {metric.value}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Benchmark</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {metric.benchmark}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Gap</div>
                  <div className={`text-xs font-semibold ${metric.value >= metric.benchmark ? 'text-green-500' : 'text-red-500'}`}>
                    {((metric.value - metric.benchmark) / metric.benchmark * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${metric.value >= metric.benchmark ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${(metric.value / metric.benchmark) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Thông tin hành vi phân tích thói quen và hành vi trong việc tạo kỷ niệm với pattern detection, metrics tracking, và personalized recommendations.
        </p>
      </div>
    </div>
  );
}