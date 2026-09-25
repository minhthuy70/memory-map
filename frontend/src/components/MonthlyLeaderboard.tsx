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
  Crown,
  Eye,
  EyeOff,
  Filter,
  Flame,
  Medal,
  Minus,
  RefreshCw,
  Search,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Zap
} from 'lucide-react';

interface MonthlyLeaderboardProps {
  onCancel?: () => void;
}

interface MonthlyEntry {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  xp: number;
  xpGained: number;
  level: number;
  month: string;
  year: number;
  change: number;
  badges: string[];
  activities: number;
}

export default function MonthlyLeaderboard({ onCancel }: MonthlyLeaderboardProps) {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [sortBy, setSortBy] = useState<'xp' | 'xpGained' | 'activities'>('xp');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrevious, setShowPrevious] = useState(false);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const [entries, setEntries] = useState<MonthlyEntry[]>([
    {
      id: '1',
      rank: 1,
      username: 'MemoryMaster',
      avatar: 'MM',
      xp: 25000,
      xpGained: 15000,
      level: 50,
      month: 8,
      year: 2026,
      change: 0,
      badges: ['monthly_champion', 'high_achiever'],
      activities: 156,
    },
    {
      id: '2',
      username: 'StoryTeller',
      avatar: 'ST',
      xp: 23000,
      xpGained: 13500,
      level: 48,
      month: 8,
      year: 2026,
      change: 1,
      badges: ['consistent', 'dedicated'],
      activities: 142,
    },
    {
      id: '3',
      username: 'WorldExplorer',
      avatar: 'WE',
      xp: 21000,
      xpGained: 12000,
      level: 46,
      month: 8,
      year: 2026,
      change: -1,
      badges: ['explorer', 'adventurer'],
      activities: 128,
    },
    {
      id: '4',
      username: 'PhotoKing',
      avatar: 'PK',
      xp: 19000,
      xpGained: 11000,
      level: 44,
      month: 8,
      year: 2026,
      change: 2,
      badges: ['photographer', 'creative'],
      activities: 115,
    },
    {
      id: '5',
      username: 'MemoryKeeper',
      avatar: 'MK',
      xp: 17500,
      xpGained: 10000,
      level: 42,
      month: 8,
      year: 2026,
      change: 0,
      badges: ['keeper', 'loyal'],
      activities: 105,
    },
    {
      id: '6',
      username: 'TravelDiary',
      avatar: 'TD',
      xp: 16000,
      xpGained: 9500,
      level: 40,
      month: 8,
      year: 2026,
      change: -2,
      badges: ['traveler', 'frequent'],
      activities: 98,
    },
    {
      id: '7',
      username: 'LifeLogger',
      avatar: 'LL',
      xp: 14500,
      xpGained: 8500,
      level: 38,
      month: 8,
      year: 2026,
      change: 1,
      badges: ['logger', 'consistent'],
      activities: 89,
    },
    {
      id: '8',
      username: 'MomentCapture',
      avatar: 'MC',
      xp: 13000,
      xpGained: 7500,
      level: 36,
      month: 8,
      year: 2026,
      change: 3,
      badges: ['capturer', 'artist'],
      activities: 82,
    },
    {
      id: '9',
      username: 'DailyRecorder',
      avatar: 'DR',
      xp: 11500,
      xpGained: 6500,
      level: 34,
      month: 8,
      year: 2026,
      change: -1,
      badges: ['daily', 'dedicated'],
      activities: 76,
    },
    {
      id: '10',
      username: 'MemoryArchitect',
      avatar: 'MA',
      xp: 10000,
      xpGained: 5500,
      level: 32,
      month: 8,
      year: 2026,
      change: 0,
      badges: ['architect', 'builder'],
      activities: 70,
    },
  ]);

  const [myEntry, setMyEntry] = useState<MonthlyEntry>({
    id: 'me',
    rank: 15,
    username: 'You',
    avatar: 'ME',
    xp: 6500,
    xpGained: 3500,
    level: 22,
    month: 8,
    year: 2026,
    change: 5,
    badges: ['starter'],
    activities: 45,
  });

  const filteredEntries = entries.filter(entry => {
    if (searchQuery && !entry.username.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (showPrevious && (entry.month !== selectedMonth || entry.year !== selectedYear)) return false;
    return true;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortBy === 'xp') return b.xp - a.xp;
    if (sortBy === 'xpGained') return b.xpGained - a.xpGained;
    if (sortBy === 'activities') return b.activities - a.activities;
    return 0;
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">#{rank}</span>;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-slate-400" />;
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'monthly_champion': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'high_achiever': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'consistent': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Monthly Leaderboard
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Top performers this month
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title="Đóng"
        >
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {months[selectedMonth]} {selectedYear}
            </p>
          </div>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronUp className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="xp">ListOrdered by Total XP</option>
            <option value="xpGained">ListOrdered by XP Gained</option>
            <option value="activities">ListOrdered by Activities</option>
          </select>
          <button
            type="button"
            onClick={() => setShowPrevious(!showPrevious)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showPrevious
                ? 'bg-slate-500 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {showPrevious ? <Eye className="h-3 w-3 inline mr-1" /> : <EyeOff className="h-3 w-3 inline mr-1" />}
            {showPrevious ? 'Show Current' : 'Show Previous'}
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search username..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full text-white font-bold">
                {myEntry.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{myEntry.username}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your rank: #{myEntry.rank}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 dark:text-white">{myEntry.xp.toLocaleString()} XP</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">+{myEntry.xpGained.toLocaleString()} gained</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {sortedEntries.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                entry.rank <= 3
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800'
                  : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full text-white font-bold text-sm">
                  {entry.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{entry.username}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Level {entry.level}</span>
                    <span>•</span>
                    <span>{entry.activities} activities</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {getChangeIcon(entry.change)}
                  <span className={`text-xs font-semibold ${entry.change > 0 ? 'text-green-500' : entry.change < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                    {entry.change > 0 ? `+${entry.change}` : entry.change}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{entry.xp.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total XP</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">+{entry.xpGained.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Gained</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Monthly Statistics
            </h4>
            <button
              type="button"
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4 text-slate-500" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">25,000</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Top XP</p>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">156</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Most Activities</p>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">15,000</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Most Gained</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Monthly Rewards
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Rank 1: 500 coins + Monthly Champion badge</li>
            <li>• Rank 2-3: 300 coins + High Achiever badge</li>
            <li>• Rank 4-10: 100 coins + Consistent badge</li>
            <li>• Top 20: 50 coins</li>
            <li>• Participation: 10 coins</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
