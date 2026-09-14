'use client';

import { useState } from 'react';
import { Funnel, X, Calendar, BarChart3, Download, RefreshCw, Filter, Eye, EyeOff, Info, Grid, Layers, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface FunnelAnalysisProps {
  onCancel?: () => void;
}

interface FunnelStep {
  step: string;
  visitors: number;
  percentage: number;
  dropoff: number;
}

export default function FunnelAnalysis({ onCancel }: FunnelAnalysisProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [showDetails, setShowDetails] = useState(false);

  const [funnelData, setFunnelData] = useState<FunnelStep[]>([
    { step: 'Visit Landing Page', visitors: 10000, percentage: 100, dropoff: 0 },
    { step: 'Sign Up', visitors: 6500, percentage: 65, dropoff: 35 },
    { step: 'Create First Memory', visitors: 4500, percentage: 45, dropoff: 20 },
    { step: 'Upload Photo', visitors: 3500, percentage: 35, dropoff: 10 },
    { step: 'Use Map View', visitors: 2800, percentage: 28, dropoff: 7 },
    { step: 'Second Visit', visitors: 2200, percentage: 22, dropoff: 6 },
    { step: 'Become Active User', visitors: 1800, percentage: 18, dropoff: 4 },
  ]);

  const totalVisitors = funnelData[0].visitors;
  const conversionRate = funnelData[funnelData.length - 1].percentage;
  const totalDropoff = funnelData.reduce((sum, f) => sum + f.dropoff, 0);
  const avgDropoff = (totalDropoff / (funnelData.length - 1)).toFixed(1);

  const getFunnelColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl">
            <Funnel className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Funnel Analysis
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track conversion funnel stages
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show details"
          >
            {showDetails ? <BarChart3 className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Visitors</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{totalVisitors.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Conversion Rate</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{conversionRate}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Dropoff</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{totalDropoff}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Dropoff</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{avgDropoff}%</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Export
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Conversion Funnel</h4>
          <div className="space-y-2">
            {funnelData.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 w-6">{index + 1}</span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{step.step}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getFunnelColor(step.percentage)}`}
                        style={{ width: `${step.percentage}%` }}
                      />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Visitors</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{step.visitors.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Rate</p>
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{step.percentage}%</p>
                    </div>
                    {step.dropoff > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Dropoff</p>
                        <p className="text-sm font-semibold text-red-600 dark:text-red-400">-{step.dropoff}%</p>
                      </div>
                    )}
                  </div>
                </div>
                {index < funnelData.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Funnel Insights</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Largest dropoff: Sign up step (35%)</li>
              <li>• Overall conversion: 18% to active user</li>
              <li>• Opportunity: Improve onboarding</li>
              <li>• Recommendation: Add guided tour</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
