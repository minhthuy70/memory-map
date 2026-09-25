'use client';

import { useState } from 'react';
import { AlertTriangle, X, Calendar, TrendingDown, ArrowUp, ArrowDown, BarChart3, Download, RefreshCw, Users, PieChart, CheckCircle, Info, Eye, EyeOff, Zap } from 'lucide-react';

interface ChurnRateAnalysisProps {
  onCancel?: () => void;
}

interface ChurnData {
  period: string;
  totalUsers: number;
  churned: number;
  newUsers: number;
  churnRate: number;
}

export default function ChurnRateAnalysis({ onCancel }: ChurnRateAnalysisProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [showDetails, setShowDetails] = useState(false);

  const [churnData, setChurnData] = useState<ChurnData[]>([
    { period: '2026-09-01', totalUsers: 8500, churned: 85, newUsers: 120, churnRate: 1.0 },
    { period: '2026-09-02', totalUsers: 8650, churned: 80, newUsers: 150, churnRate: 0.92 },
    { period: '2026-09-03', totalUsers: 8800, churned: 75, newUsers: 150, churnRate: 0.85 },
    { period: '2026-09-04', totalUsers: 8850, churned: 70, newUsers: 50, churnRate: 0.79 },
    { period: '2026-09-05', totalUsers: 9000, churned: 65, newUsers: 150, churnRate: 0.72 },
    { period: '2026-09-06', totalUsers: 9150, churned: 60, newUsers: 150, churnRate: 0.66 },
    { period: '2026-09-07', totalUsers: 9300, churned: 55, newUsers: 150, churnRate: 0.59 },
    { period: '2026-09-08', totalUsers: 9450, churned: 50, newUsers: 150, churnRate: 0.53 },
    { period: '2026-09-09', totalUsers: 9600, churned: 45, newUsers: 150, churnRate: 0.47 },
    { period: '2026-09-10', totalUsers: 9750, churned: 40, newUsers: 150, churnRate: 0.41 },
    { period: '2026-09-11', totalUsers: 9900, churned: 35, newUsers: 150, churnRate: 0.35 },
    { period: '2026-09-12', totalUsers: 10050, churned: 30, newUsers: 150, churnRate: 0.30 },
    { period: '2026-09-13', totalUsers: 10200, churned: 25, newUsers: 150, churnRate: 0.25 },
    { period: '2026-09-14', totalUsers: 10350, churned: 20, newUsers: 150, churnRate: 0.19 },
  ]);

  const totalChurned = churnData.reduce((sum, d) => sum + d.churned, 0);
  const averageChurnRate = (churnData.reduce((sum, d) => sum + d.churnRate, 0) / churnData.length).toFixed(2);
  const retentionRate = (100 - parseFloat(averageChurnRate)).toFixed(2);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-orange-500 rounded-xl">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Churn Rate Analysis
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track user retention and attrition
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Churned</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{totalChurned.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Churn Rate</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{averageChurnRate}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Retention Rate</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{retentionRate}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Trend</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1">
              <ArrowDown className="h-4 w-4" />
              Good
            </p>
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Churn Rate Over Time</h4>
          <div className="space-y-2">
            {churnData.map((data) => (
              <div key={data.period} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-xs text-slate-700 dark:text-slate-300">{data.period}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Churned</p>
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">{data.churned}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">New</p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">+{data.newUsers}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Rate</p>
                    <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">{data.churnRate}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Churn Insights</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Churn rate declining: Good trend</li>
              <li>• Average churn: ~0.5% daily</li>
              <li>• Retention: ~99.5% excellent</li>
              <li>• Peak churn: 1.0% on Sep 1</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
