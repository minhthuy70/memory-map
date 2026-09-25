'use client';

import { useState } from 'react';
import {
  Award,
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cloud,
  Flame,
  Heart,
  Info,
  Moon,
  RefreshCw,
  Snowflake,
  Sparkles,
  Star,
  Sun,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';

interface StreakTrackingProps {
  onCancel?: () => void;
}

interface StreakDay {
  date: string;
  logged: boolean;
  memoriesCount: number;
}

export default function StreakTracking({ onCancel }: StreakTrackingProps) {
  const [currentStreak, setCurrentStreak] = useState(15);
  const [longestStreak, setLongestStreak] = useState(30);
  const [totalDays, setTotalDays] = useState(180);
  const [selectedMonth, setSelectedMonth] = useState(new Date(2026, 8, 1));
  const [showStats, setShowStats] = useState(false);

  const generateStreakDays = (month: Date): StreakDay[] => {
    const days: StreakDay[] = [];
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, monthIndex, i);
      const dayIndex = date.getDay();
      const isLogged = Math.random() > 0.3;
      days.push({
        date: date.toISOString().split('T')[0],
        logged: isLogged,
        memoriesCount: isLogged ? Math.floor(Math.random() * 5) + 1 : 0,
      });
    }
    return days;
  };

  const [streakDays, setStreakDays] = useState<StreakDay[]>(generateStreakDays(selectedMonth));

  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return <Award className="h-5 w-5" />;
    if (streak >= 14) return <Star className="h-5 w-5" />;
    if (streak >= 7) return <Zap className="h-5 w-5" />;
    return <Flame className="h-5 w-5" />;
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'from-yellow-400 to-orange-500';
    if (streak >= 14) return 'from-purple-400 to-pink-500';
    if (streak >= 7) return 'from-blue-400 to-cyan-500';
    return 'from-orange-400 to-red-500';
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const calculateStreakFromDays = (days: StreakDay[]) => {
    let streak = 0;
    let maxStreak = 0;
    let currentStreakCount = 0;

    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].logged) {
        currentStreakCount++;
        maxStreak = Math.max(maxStreak, currentStreakCount);
      } else {
        currentStreakCount = 0;
      }
    }

    streak = currentStreakCount;
    return { streak, maxStreak };
  };

  const { streak: calculatedStreak, maxStreak: calculatedMaxStreak } = calculateStreakFromDays(streakDays);
  const loggedDays = streakDays.filter(d => d.logged).length;
  const totalMemories = streakDays.reduce((sum, d) => sum + d.memoriesCount, 0);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(selectedMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setSelectedMonth(newMonth);
    setStreakDays(generateStreakDays(newMonth));
  };

  const getDayIcon = (dayIndex: number) => {
    switch (dayIndex) {
      case 0: return <Sun className="h-3 w-3" />;
      case 1: return <Moon className="h-3 w-3" />;
      case 2: return <Star className="h-3 w-3" />;
      case 3: return <Star className="h-3 w-3" />;
      case 4: return <Star className="h-3 w-3" />;
      case 5: return <Star className="h-3 w-3" />;
      case 6: return <Sun className="h-3 w-3" />;
      default: return <Calendar className="h-3 w-3" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Streak Tracking
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track your consecutive days
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowStats(!showStats)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show stats"
          >
            {showStats ? <BarChart3 className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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
        <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 bg-gradient-to-br ${getStreakColor(currentStreak)} rounded-xl text-white`}>
                {getStreakIcon(currentStreak)}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-3xl">{currentStreak}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">day streak</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Longest streak</p>
              <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{longestStreak} days</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
            <Flame className="h-4 w-4" />
            <span>Keep the flame burning! Log a memory today to maintain your streak.</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Current Streak</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{currentStreak} days</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Longest Streak</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{longestStreak} days</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Days</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{totalDays}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">This Month</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{loggedDays}</p>
          </div>
        </div>

        {showStats && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Streak Statistics</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Total memories this month</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{totalMemories}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Average memories per day</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{(totalMemories / loggedDays).toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Completion rate</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{Math.round((loggedDays / streakDays.length) * 100)}%</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Streak Calendar</h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigateMonth('prev')}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
              >
                <ChevronLeft className="h-4 w-4 text-slate-500" />
              </button>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{getMonthName(selectedMonth)}</span>
              <button
                type="button"
                onClick={() => navigateMonth('next')}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
              >
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div key={day} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {getDayIcon(index)}
                    <span className="text-xs text-slate-500 dark:text-slate-400">{day}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {streakDays.map((day) => (
                <div
                  key={day.date}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${day.logged ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-slate-200 dark:bg-slate-600 text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-500'}`}
                >
                  <span className="text-xs font-semibold">{new Date(day.date).getDate()}</span>
                  {day.logged && day.memoriesCount > 0 && (
                    <span className="text-xs">{day.memoriesCount}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Streak Milestones
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className={`p-2 rounded-lg text-center ${currentStreak >= 7 ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-600' : 'bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600'}`}>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">7 Days</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">+100 XP</p>
            </div>
            <div className={`p-2 rounded-lg text-center ${currentStreak >= 14 ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-600' : 'bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600'}`}>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">14 Days</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">+250 XP</p>
            </div>
            <div className={`p-2 rounded-lg text-center ${currentStreak >= 30 ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-600' : 'bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600'}`}>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">30 Days</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">+500 XP</p>
            </div>
            <div className={`p-2 rounded-lg text-center ${currentStreak >= 100 ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-600' : 'bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600'}`}>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">100 Days</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">+2000 XP</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Streak Tips
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Log at least one memory daily to maintain your streak</li>
            <li>• Set a daily reminder to never miss a day</li>
            <li>• Use streak freeze to protect your streak when busy</li>
            <li>• Longer streaks unlock better rewards and badges</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
