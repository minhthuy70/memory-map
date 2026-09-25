'use client';

import { useState } from 'react';
import { Users, X, Calendar, BarChart3, Download, RefreshCw, Filter, Eye, EyeOff, Info, Grid, Layers, CheckCircle, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface CohortAnalysisProps {
  onCancel?: () => void;
}

interface CohortData {
  cohort: string;
  size: number;
  day1: number;
  day7: number;
  day30: number;
  day90: number;
}

export default function CohortAnalysis({ onCancel }: CohortAnalysisProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [showDetails, setShowDetails] = useState(false);

  const [cohortData, setCohortData] = useState<CohortData[]>([
    { cohort: '2026-08-01', size: 1200, day1: 85, day7: 65, day30: 45, day90: 30 },
    { cohort: '2026-08-08', size: 1150, day1: 87, day7: 68, day30: 48, day90: 32 },
    { cohort: '2026-08-15', size: 1300, day1: 88, day7: 70, day30: 50, day90: 35 },
    { cohort: '2026-08-22', size: 1250, day1: 90, day7: 72, day30: 52, day90: 38 },
    { cohort: '2026-08-29', size: 1400, day1: 92, day7: 75, day30: 55, day90: 40 },
    { cohort: '2026-09-05', size: 1350, day1: 93, day7: 78, day30: 58, day90: 42 },
    { cohort: '2026-09-12', size: 1450, day1: 94, day7: 80, day30: 60, day90: 45 },
  ]);

  const totalCohortSize = cohortData.reduce((sum, c) => sum + c.size, 0);
  const avgDay1 = Math.round(cohortData.reduce((sum, c) => sum + c.day1, 0) / cohortData.length);
  const avgDay7 = Math.round(cohortData.reduce((sum, c) => sum + c.day7, 0) / cohortData.length);
  const avgDay30 = Math.round(cohortData.reduce((sum, c) => sum + c.day30, 0) / cohortData.length);
  const avgDay90 = Math.round(cohortData.reduce((sum, c) => sum + c.day90, 0) / cohortData.length);

  const getRetentionColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-blue-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Cohort Analysis
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track user retention by cohort
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Cohorts</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{cohortData.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Day 1</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{avgDay1}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Day 7</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{avgDay7}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Day 30</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{avgDay30}%</p>
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Cohort Retention Table</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-slate-500 dark:text-slate-400">
                  <th className="pb-2">Cohort</th>
                  <th className="pb-2">Size</th>
                  <th className="pb-2">Day 1</th>
                  <th className="pb-2">Day 7</th>
                  <th className="pb-2">Day 30</th>
                  <th className="pb-2">Day 90</th>
                </tr>
              </thead>
              <tbody>
                {cohortData.map((cohort) => (
                  <tr key={cohort.cohort} className="border-t border-slate-200 dark:border-slate-600">
                    <td className="py-2 text-slate-900 dark:text-white">{cohort.cohort}</td>
                    <td className="py-2 text-slate-700 dark:text-slate-300">{cohort.size.toLocaleString()}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${getRetentionColor(cohort.day1)}`} style={{ width: `${cohort.day1}%` }} />
                        </div>
                        <span className="text-slate-900 dark:text-white">{cohort.day1}%</span>
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${getRetentionColor(cohort.day7)}`} style={{ width: `${cohort.day7}%` }} />
                        </div>
                        <span className="text-slate-900 dark:text-white">{cohort.day7}%</span>
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${getRetentionColor(cohort.day30)}`} style={{ width: `${cohort.day30}%` }} />
                        </div>
                        <span className="text-slate-900 dark:text-white">{cohort.day30}%</span>
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${getRetentionColor(cohort.day90)}`} style={{ width: `${cohort.day90}%` }} />
                        </div>
                        <span className="text-slate-900 dark:text-white">{cohort.day90}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Cohort Insights</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Day 1 retention: Improving (85% → 94%)</li>
              <li>• Day 7 retention: Strong growth (65% → 80%)</li>
              <li>• Day 30 retention: Good trend (45% → 60%)</li>
              <li>• Long-term retention: Healthy improvement</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
