import { Activity, AlertTriangle, BarChart3, Calendar, CheckCircle, Clock, Coffee, Moon, Settings, Sun, TrendingUp, X, Zap } from 'lucide-react';
'use client';

import { useState } from 'react';


interface TimeSlot {
  hour: number;
  count: number;
  percentage: number;
}

interface DayOfWeek {
  day: string;
  count: number;
  percentage: number;
}

interface MonthData {
  month: string;
  count: number;
  percentage: number;
}

interface TimeDistributionProps {
  onCancel?: () => void;
  onAnalyzeDistribution?: () => Promise<void>;
}

const DEFAULT_HOURLY_DATA: TimeSlot[] = [
  { hour: 6, count: 15, percentage: 0.12 },
  { hour: 8, count: 45, percentage: 0.36 },
  { hour: 12, count: 35, percentage: 0.28 },
  { hour: 18, count: 25, percentage: 0.20 },
  { hour: 20, count: 15, percentage: 0.12 },
];

const DEFAULT_DAILY_DATA: DayOfWeek[] = [
  { day: 'Monday', count: 35, percentage: 0.28 },
  { day: 'Tuesday', count: 40, percentage: 0.32 },
  { day: 'Wednesday', count: 30, percentage: 0.24 },
  { day: 'Thursday', count: 45, percentage: 0.36 },
  { day: 'Friday', count: 50, percentage: 0.40 },
  { day: 'Saturday', count: 25, percentage: 0.20 },
  { day: 'Sunday', count: 20, percentage: 0.16 },
];

const DEFAULT_MONTHLY_DATA: MonthData[] = [
  { month: 'Jan', count: 25, percentage: 0.20 },
  { month: 'Feb', count: 30, percentage: 0.24 },
  { month: 'Mar', count: 35, percentage: 0.28 },
  { month: 'Apr', count: 40, percentage: 0.32 },
  { month: 'May', count: 45, percentage: 0.36 },
  { month: 'Jun', count: 50, percentage: 0.40 },
];

export default function TimeDistribution({ onCancel, onAnalyzeDistribution }: TimeDistributionProps) {
  const [hourlyData, setHourlyData] = useState<TimeSlot[]>(DEFAULT_HOURLY_DATA);
  const [dailyData, setDailyData] = useState<DayOfWeek[]>(DEFAULT_DAILY_DATA);
  const [monthlyData, setMonthlyData] = useState<MonthData[]>(DEFAULT_MONTHLY_DATA);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedView, setSelectedView] = useState<'hourly' | 'daily' | 'monthly'>('hourly');
  const [groupByActivity, setGroupByActivity] = useState(true);

  const getTimeIcon = (hour: number) => {
    if (hour >= 6 && hour < 12) return <Sun className="h-4 w-4" />;
    if (hour >= 12 && hour < 18) return <Sun className="h-4 w-4" />;
    if (hour >= 18 && hour < 22) return <Moon className="h-4 w-4" />;
    return <Sunset className="h-4 w-4" />;
  };

  const getTimePeriod = (hour: number) => {
    if (hour >= 6 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 18) return 'Afternoon';
    if (hour >= 18 && hour < 22) return 'Evening';
    return 'Night';
  };

  const peakHour = hourlyData.reduce((max, h) => h.count > max.count ? h : max, hourlyData[0]);
  const peakDay = dailyData.reduce((max, d) => d.count > max.count ? d : max, dailyData[0]);
  const peakMonth = monthlyData.reduce((max, m) => m.count > max.count ? m : max, monthlyData[0]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Phân phối thời gian
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedView} distribution
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
            Cài đặt time distribution
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Group by activity
              </span>
              <button
                type="button"
                onClick={() => setGroupByActivity(!groupByActivity)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  groupByActivity ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    groupByActivity ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show predictions
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Timezone aware
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
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Peak Hour</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {peakHour.hour}:00
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Peak Day</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {peakDay.day}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Peak Month</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {peakMonth.month}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Trend</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            Up
          </div>
        </div>
      </div>

      {/* View Selector */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedView('hourly')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedView === 'hourly'
                ? 'bg-teal-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Clock className="h-4 w-4 inline mr-1" />
            Hourly
          </button>
          <button
            type="button"
            onClick={() => setSelectedView('daily')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedView === 'daily'
                ? 'bg-teal-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-1" />
            Daily
          </button>
          <button
            type="button"
            onClick={() => setSelectedView('monthly')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedView === 'monthly'
                ? 'bg-teal-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-1" />
            Monthly
          </button>
        </div>
      </div>

      {/* Hourly Distribution */}
      {selectedView === 'hourly' && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Hourly Distribution
          </h4>
          <div className="space-y-2">
            {hourlyData.map((slot) => (
              <div
                key={slot.hour}
                className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTimeIcon(slot.hour)}
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {slot.hour}:00 - {slot.hour + 1}:00
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {getTimePeriod(slot.hour)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {slot.count} memories
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-cyan-500"
                      style={{ width: `${slot.percentage * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {(slot.percentage * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Distribution */}
      {selectedView === 'daily' && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Day of Week Distribution
          </h4>
          <div className="space-y-2">
            {dailyData.map((day) => (
              <div
                key={day.day}
                className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {day.day}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {day.count} memories
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-cyan-500"
                      style={{ width: `${day.percentage * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {(day.percentage * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Distribution */}
      {selectedView === 'monthly' && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Monthly Distribution
          </h4>
          <div className="space-y-2">
            {monthlyData.map((month) => (
              <div
                key={month.month}
                className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Coffee className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {month.month}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {month.count} memories
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-cyan-500"
                      style={{ width: `${month.percentage * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {(month.percentage * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-lg">
        <p className="text-[10px] text-teal-700 dark:text-teal-400">
          <strong>Lưu ý:</strong> Phân phối thời gian phân tích khi nào bạn thường tạo kỷ niệm nhất với hourly/daily/monthly distribution, peak times, và trend analysis.
        </p>
      </div>
    </div>
  );
}