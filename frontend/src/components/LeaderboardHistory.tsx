'use client';

import { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Award,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Eye,
  EyeOff,
  Filter,
  Flame,
  History,
  LineChart,
  Medal,
  Minus,
  RefreshCw,
  Search,
  Share2,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Zap
} from 'lucide-react';

interface LeaderboardHistoryProps {
  onCancel?: () => void;
}

interface HistoryEntry {
  id: string;
  date: string;
  leaderboard: 'global' | 'friends' | 'regional' | 'monthly' | 'category';
  rank: number;
  previousRank: number;
  xp: number;
  xpGained: number;
  category?: string;
  badge?: string;
}

export default function LeaderboardHistory({ onCancel }: LeaderboardHistoryProps) {
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [sortBy, setSortBy] = useState<'date' | 'rank' | 'xpGained'>('date');
  const [showGraph, setShowGraph] = useState(false);

  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: '1',
      date: '2026-09-14',
      leaderboard: 'global',
      rank: 42,
      previousRank: 45,
      xp: 45000,
      xpGained: 500,
    },
    {
      id: '2',
      date: '2026-09-13',
      leaderboard: 'global',
      rank: 45,
      previousRank: 47,
      xp: 44500,
      xpGained: 800,
    },
    {
      id: '3',
      date: '2026-09-12',
      leaderboard: 'global',
      rank: 47,
      previousRank: 50,
      xp: 43700,
      xpGained: 1200,
    },
    {
      id: '4',
      date: '2026-09-11',
      leaderboard: 'global',
      rank: 50,
      previousRank: 52,
      xp: 42500,
      xpGained: 600,
    },
    {
      id: '5',
      date: '2026-09-10',
      leaderboard: 'global',
      rank: 52,
      previousRank: 48,
      xp: 41900,
      xpGained: -300,
    },
    {
      id: '6',
      date: '2026-09-09',
      leaderboard: 'friends',
      rank: 3,
      previousRank: 4,
      xp: 45000,
      xpGained: 350,
    },
    {
      id: '7',
      date: '2026-09-08',
      leaderboard: 'friends',
      rank: 4,
      previousRank: 5,
      xp: 44650,
      xpGained: 450,
    },
    {
      id: '8',
      date: '2026-09-07',
      leaderboard: 'friends',
      rank: 5,
      previousRank: 6,
      xp: 44200,
      xpGained: 520,
    },
    {
      id: '9',
      date: '2026-09-06',
      leaderboard: 'regional',
      rank: 15,
      previousRank: 18,
      xp: 45000,
      xpGained: 420,
    },
    {
      id: '10',
      date: '2026-09-05',
      leaderboard: 'regional',
      rank: 18,
      previousRank: 20,
      xp: 44580,
      xpGained: 380,
    },
    {
      id: '11',
      date: '2026-09-04',
      leaderboard: 'monthly',
      rank: 15,
      previousRank: 12,
      xp: 6500,
      xpGained: 3500,
    },
    {
      id: '12',
      date: '2026-08-31',
      leaderboard: 'monthly',
      rank: 12,
      previousRank: 10,
      xp: 3000,
      xpGained: 3000,
    },
    {
      id: '13',
      date: '2026-09-03',
      leaderboard: 'category',
      rank: 5,
      previousRank: 8,
      xp: 850,
      xpGained: 120,
      category: 'photos',
      badge: 'photographer',
    },
    {
      id: '14',
      date: '2026-09-02',
      leaderboard: 'category',
      rank: 8,
      previousRank: 6,
      xp: 730,
      xpGained: 90,
      category: 'photos',
      badge: 'camera_enthusiast',
    },
  ]);

  const filteredHistory = history.filter(entry => {
    if (selectedLeaderboard !== 'all' && entry.leaderboard !== selectedLeaderboard) return false;
    return true;
  });

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'rank') return a.rank - b.rank;
    if (sortBy === 'xpGained') return b.xpGained - a.xpGained;
    return 0;
  });

  const getChangeIcon = (rank: number, previousRank: number) => {
    if (rank < previousRank) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (rank > previousRank) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-slate-400" />;
  };

  const getLeaderboardColor = (leaderboard: string) => {
    switch (leaderboard) {
      case 'global': return 'from-yellow-400 to-orange-500';
      case 'friends': return 'from-blue-400 to-cyan-500';
      case 'regional': return 'from-green-400 to-emerald-500';
      case 'monthly': return 'from-purple-400 to-pink-500';
      case 'category': return 'from-orange-400 to-red-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getLeaderboardIcon = (leaderboard: string) => {
    switch (leaderboard) {
      case 'global': return <Trophy className="h-4 w-4" />;
      case 'friends': return <Star className="h-4 w-4" />;
      case 'regional': return <Medal className="h-4 w-4" />;
      case 'monthly': return <Calendar className="h-4 w-4" />;
      case 'category': return <Target className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'photographer': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
      case 'camera_enthusiast': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  const calculateStats = () => {
    const bestRank = Math.min(...history.map(h => h.rank));
    const worstRank = Math.max(...history.map(h => h.rank));
    const totalXP = history.reduce((sum, h) => sum + h.xpGained, 0);
    const averageRank = history.reduce((sum, h) => sum + h.rank, 0) / history.length;
    const improvements = history.filter(h => h.rank < h.previousRank).length;
    const declines = history.filter(h => h.rank > h.previousRank).length;

    return { bestRank, worstRank, totalXP, averageRank, improvements, declines };
  };

  const stats = calculateStats();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
            <History className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Leaderboard History
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track your position over time
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGraph(!showGraph)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Toggle Graph"
          >
            {showGraph ? <BarChart3 className="h-4 w-4 text-slate-500" /> : <LineChart className="h-4 w-4 text-slate-500" />}
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
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedLeaderboard}
            onChange={(e) => setSelectedLeaderboard(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Leaderboards</option>
            <option value="global">Global</option>
            <option value="friends">Friends</option>
            <option value="regional">Regional</option>
            <option value="monthly">Monthly</option>
            <option value="category">Category</option>
          </select>
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
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="date">ListOrdered by Date</option>
            <option value="rank">ListOrdered by Rank</option>
            <option value="xpGained">ListOrdered by XP Gained</option>
          </select>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Best Rank</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">#{stats.bestRank}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Worst Rank</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">#{stats.worstRank}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Rank</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">#{stats.averageRank.toFixed(1)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total XP Gained</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{stats.totalXP.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Improvements</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{stats.improvements}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Declines</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{stats.declines}</p>
          </div>
        </div>

        {showGraph && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                Rank Trend
              </h4>
              <button
                type="button"
                onClick={() => setShowGraph(false)}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>
            <div className="h-40 flex items-end gap-1">
              {sortedHistory.slice(0, 10).map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-t"
                    style={{ height: `${100 - (entry.rank / 60) * 100}%` }}
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {entry.rank}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {sortedHistory.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-gradient-to-br ${getLeaderboardColor(entry.leaderboard)} rounded-lg text-white`}>
                  {getLeaderboardIcon(entry.leaderboard)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{entry.date}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 capitalize">
                    <span>{entry.leaderboard}</span>
                    {entry.category && <span>• {entry.category}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {getChangeIcon(entry.rank, entry.previousRank)}
                  <span className={`text-xs font-semibold ${entry.rank < entry.previousRank ? 'text-green-500' : entry.rank > entry.previousRank ? 'text-red-500' : 'text-slate-400'}`}>
                    {entry.rank < entry.previousRank ? `+${entry.previousRank - entry.rank}` : entry.rank > entry.previousRank ? `-${entry.rank - entry.previousRank}` : '0'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">#{entry.rank}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Rank</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{entry.xp.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total XP</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">+{entry.xpGained.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Gained</p>
                </div>
                {entry.badge && (
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeColor(entry.badge)}`}>
                      {entry.badge.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Export Options
            </h4>
            <button
              type="button"
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4 text-slate-500" />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>

        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Tips to Improve Your Rank
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Maintain consistent daily activity to build XP</li>
            <li>• Participate in seasonal events for bonus XP</li>
            <li>• Focus on categories where you excel most</li>
            <li>• Complete achievements for extra XP rewards</li>
            <li>• Share memories to increase social engagement</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
