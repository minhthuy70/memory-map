'use client';

import { useState } from 'react';
import { BarChart3, X, Settings, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Activity, Target, Calendar, Database, Award, Zap, Trophy } from 'lucide-react';

interface GrowthMetric {
  id: string;
  date: Date;
  memoryCount: number;
  storageUsed: string;
  growthRate: number;
  milestone: string;
}

interface Milestone {
  id: string;
  name: string;
  target: number;
  achieved: boolean;
  achievedDate: Date | null;
}

interface GrowthMetricsProps {
  onCancel?: () => void;
  onCalculateGrowth?: () => Promise<void>;
}

const DEFAULT_METRICS: GrowthMetric[] = [
  {
    id: 'metric-1',
    date: new Date('2023-01-01'),
    memoryCount: 100,
    storageUsed: '25 MB',
    growthRate: 0,
    milestone: 'First 100 memories',
  },
  {
    id: 'metric-2',
    date: new Date('2023-06-01'),
    memoryCount: 250,
    storageUsed: '62.5 MB',
    growthRate: 150,
    milestone: '250 memories',
  },
  {
    id: 'metric-3',
    date: new Date('2023-12-01'),
    memoryCount: 500,
    storageUsed: '125 MB',
    growthRate: 100,
    milestone: '500 memories',
  },
];

const DEFAULT_MILESTONES: Milestone[] = [
  { id: 'ms-1', name: '100 Memories', target: 100, achieved: true, achievedDate: new Date('2023-01-15') },
  { id: 'ms-2', name: '250 Memories', target: 250, achieved: true, achievedDate: new Date('2023-06-20') },
  { id: 'ms-3', name: '500 Memories', target: 500, achieved: true, achievedDate: new Date('2023-12-10') },
  { id: 'ms-4', name: '1000 Memories', target: 1000, achieved: false, achievedDate: null },
  { id: 'ms-5', name: '2500 Memories', target: 2500, achieved: false, achievedDate: null },
];

export default function GrowthMetrics({ onCancel, onCalculateGrowth }: GrowthMetricsProps) {
  const [metrics, setMetrics] = useState<GrowthMetric[]>(DEFAULT_METRICS);
  const [milestones, setMilestones] = useState<Milestone[]>(DEFAULT_MILESTONES);
  const [showSettings, setShowSettings] = useState(false);
  const [currentCount, setCurrentCount] = useState(520);
  const [targetCount, setTargetCount] = useState(1000);
  const [enablePredictions, setEnablePredictions] = useState(true);

  const latestMetric = metrics[metrics.length - 1];
  const avgGrowthRate = metrics.reduce((sum, m) => sum + m.growthRate, 0) / metrics.length;
  const achievedMilestones = milestones.filter(m => m.achieved).length;
  const totalMilestones = milestones.length;
  const progressToNext = (currentCount / targetCount) * 100;

  const predictedGrowth = enablePredictions 
    ? Math.round(currentCount * (1 + avgGrowthRate / 100))
    : null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Chỉ số tăng trưởng
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentCount} memories
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
        <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt growth metrics
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Target count: {targetCount}
              </label>
              <input
                type="range"
                min="100"
                max="10000"
                value={targetCount}
                onChange={(e) => setTargetCount(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Enable predictions
              </span>
              <button
                type="button"
                onClick={() => setEnablePredictions(!enablePredictions)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  enablePredictions ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    enablePredictions ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-track
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
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Current</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {currentCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Growth Rate</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgGrowthRate.toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Milestones</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {achievedMilestones}/{totalMilestones}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Database className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Storage</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {latestMetric?.storageUsed || 'N/A'}
          </div>
        </div>
      </div>

      {/* Progress to Target */}
      <div className="mb-4 p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Progress to Target ({targetCount})
        </h4>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-500"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {progressToNext.toFixed(0)}%
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{currentCount} / {targetCount} memories</span>
          <span>{targetCount - currentCount} remaining</span>
        </div>
      </div>

      {/* Growth Prediction */}
      {enablePredictions && predictedGrowth && (
        <div className="mb-4 p-4 rounded-lg border-2 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-400">
              Predicted Growth (Next Period)
            </span>
          </div>
          <div className="text-lg font-bold text-indigo-700 dark:text-indigo-400">
            {predictedGrowth} memories
          </div>
          <p className="text-xs text-indigo-600 dark:text-indigo-500">
            Based on average growth rate of {avgGrowthRate.toFixed(0)}%
          </p>
        </div>
      )}

      {/* Growth History */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Growth History
        </h4>
        <div className="space-y-2">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {metric.date.toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {metric.growthRate > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {metric.growthRate > 0 ? '+' : ''}{metric.growthRate}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Count</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {metric.memoryCount}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Storage</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {metric.storageUsed}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Milestone</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {metric.milestone}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Milestones
        </h4>
        <div className="space-y-2">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className={`p-4 rounded-lg border-2 ${
                milestone.achieved
                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {milestone.achieved ? (
                    <Award className="h-4 w-4 text-green-500" />
                  ) : (
                    <Target className="h-4 w-4 text-slate-500" />
                  )}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {milestone.name}
                  </span>
                </div>
                {milestone.achieved && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Target</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {milestone.target} memories
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Status</div>
                  <div className={`text-xs font-semibold ${
                    milestone.achieved
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {milestone.achieved
                      ? `Achieved ${milestone.achievedDate?.toLocaleDateString('vi-VN')}`
                      : 'In Progress'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-lg">
        <p className="text-[10px] text-indigo-700 dark:text-indigo-400">
          <strong>Lưu ý:</strong> Chỉ số tăng trưởng theo dõi sự phát triển của bộ sưu tập kỷ niệm với growth rate tracking, milestones, predictions, và progress monitoring.
        </p>
      </div>
    </div>
  );
}