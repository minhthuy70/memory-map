'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  CheckCircle,
  Download,
  Eye,
  EyeOff,
  Filter,
  Info,
  RefreshCw,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';

interface UserGrowthChartProps {
  onCancel?: () => void;
}

interface GrowthData {
  date: string;
  users: number;
  newUsers: number;
  activeUsers: number;
}

export default function UserGrowthChart({ onCancel }: UserGrowthChartProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [showDetails, setShowDetails] = useState(false);

  const [growthData, setGrowthData] = useState<GrowthData[]>([
    { date: '2026-09-01', users: 8500, newUsers: 120, activeUsers: 6200 },
    { date: '2026-09-02', users: 8650, newUsers: 150, activeUsers: 6350 },
    { date: '2026-09-03', users: 8800, newUsers: 150, activeUsers: 6500 },
    { date: '2026-09-04', users: 8850, newUsers: 50, activeUsers: 6550 },
    { date: '2026-09-05', users: 9000, newUsers: 150, activeUsers: 6700 },
    { date: '2026-09-06', users: 9150, newUsers: 150, activeUsers: 6850 },
    { date: '2026-09-07', users: 9300, newUsers: 150, activeUsers: 7000 },
    { date: '2026-09-08', users: 9450, newUsers: 150, activeUsers: 7150 },
    { date: '2026-09-09', users: 9600, newUsers: 150, activeUsers: 7300 },
    { date: '2026-09-10', users: 9750, newUsers: 150, activeUsers: 7450 },
    { date: '2026-09-11', users: 9900, newUsers: 150, activeUsers: 7600 },
    { date: '2026-09-12', users: 10050, newUsers: 150, activeUsers: 7750 },
    { date: '2026-09-13', users: 10200, newUsers: 150, activeUsers: 7900 },
    { date: '2026-09-14', users: 10350, newUsers: 150, activeUsers: 8050 },
  ]);

  const totalUsers = growthData[growthData.length - 1].users;
  const totalNewUsers = growthData.reduce((sum, d) => sum + d.newUsers, 0);
  const averageActive = Math.round(growthData.reduce((sum, d) => sum + d.activeUsers, 0) / growthData.length);
  const growthRate = Math.round(((totalUsers - growthData[0].users) / growthData[0].users) * 100);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              User Growth Chart
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track user acquisition and growth
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Users</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{totalUsers.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">New Users</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{totalNewUsers.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Users</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{averageActive.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Growth Rate</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{growthRate}%</p>
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
            <option value="year">This CalendarDays</option>
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">User Growth Over Time</h4>
          <div className="space-y-2">
            {growthData.map((data) => (
              <div key={data.date} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-xs text-slate-700 dark:text-slate-300">{data.date}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{data.users.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">New</p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">+{data.newUsers}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Active</p>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{data.activeUsers.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Growth Insights</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Average daily growth: ~150 new users</li>
              <li>• Activation rate: ~78% of users are active</li>
              <li>• Peak acquisition days: Weekend</li>
              <li>• Retention trend: Improving</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
