'use client';

import { useState } from 'react';
import { Trophy, X, TrendingUp, TrendingDown, Medal, Award, Crown, Star, Users, Filter, ChevronDown, ChevronUp, RefreshCw, Search, Globe, MapPin, Calendar, Clock, Zap, Flame, Target, Eye, EyeOff, ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface GlobalLeaderboardProps {
  onCancel?: () => void;
}

interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  country: string;
  region: string;
  change: number;
  badges: string[];
  streak: number;
}

export default function GlobalLeaderboard({ onCancel }: GlobalLeaderboardProps) {
  const [timeRange, setTimeRange] = useState<'all' | 'week' | 'month' | 'year'>('all');
  const [showTopOnly, setShowTopOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'xp' | 'level' | 'streak'>('xp');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [myRank, setMyRank] = useState(42);

  const [entries, setEntries] = useState<LeaderboardEntry[]>([
    {
      id: '1',
      rank: 1,
      username: 'MemoryMaster',
      avatar: 'MM',
      xp: 125000,
      level: 50,
      country: 'US',
      region: 'North America',
      change: 0,
      badges: ['legend', 'pioneer'],
      streak: 365,
    },
    {
      id: '2',
      username: 'StoryTeller',
      avatar: 'ST',
      xp: 118000,
      level: 48,
      country: 'UK',
      region: 'Europe',
      change: 1,
      badges: ['master', 'writer'],
      streak: 289,
    },
    {
      id: '3',
      username: 'WorldExplorer',
      avatar: 'WE',
      xp: 112000,
      level: 46,
      country: 'DE',
      region: 'Europe',
      change: -1,
      badges: ['explorer', 'globe'],
      streak: 198,
    },
    {
      id: '4',
      username: 'PhotoKing',
      avatar: 'PK',
      xp: 105000,
      level: 44,
      country: 'JP',
      region: 'Asia',
      change: 2,
      badges: ['photographer', 'creative'],
      streak: 156,
    },
    {
      id: '5',
      username: 'MemoryKeeper',
      avatar: 'MK',
      xp: 98000,
      level: 42,
      country: 'AU',
      region: 'Oceania',
      change: 0,
      badges: ['keeper', 'loyal'],
      streak: 134,
    },
    {
      id: '6',
      username: 'TravelDiary',
      avatar: 'TD',
      xp: 92000,
      level: 40,
      country: 'CA',
      region: 'North America',
      change: -2,
      badges: ['traveler', 'adventurer'],
      streak: 112,
    },
    {
      id: '7',
      username: 'LifeLogger',
      avatar: 'LL',
      xp: 87000,
      level: 38,
      country: 'FR',
      region: 'Europe',
      change: 1,
      badges: ['logger', 'consistent'],
      streak: 98,
    },
    {
      id: '8',
      username: 'MomentCapture',
      avatar: 'MC',
      xp: 82000,
      level: 36,
      country: 'BR',
      region: 'South America',
      change: 3,
      badges: ['capturer', 'artist'],
      streak: 87,
    },
    {
      id: '9',
      username: 'DailyRecorder',
      avatar: 'DR',
      xp: 78000,
      level: 34,
      country: 'IN',
      region: 'Asia',
      change: -1,
      badges: ['daily', 'dedicated'],
      streak: 76,
    },
    {
      id: '10',
      username: 'MemoryArchitect',
      avatar: 'MA',
      xp: 74000,
      level: 32,
      country: 'VN',
      region: 'Asia',
      change: 0,
      badges: ['architect', 'builder'],
      streak: 65,
    },
  ]);

  const [myEntry, setMyEntry] = useState<LeaderboardEntry>({
    id: 'me',
    rank: 42,
    username: 'You',
    avatar: 'ME',
    xp: 45000,
    level: 22,
    country: 'VN',
    region: 'Asia',
    change: 5,
    badges: ['starter'],
    streak: 45,
  });

  const filteredEntries = entries.filter(entry => {
    if (searchQuery && !entry.username.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedRegion !== 'all' && entry.region !== selectedRegion) return false;
    if (showTopOnly && entry.rank > 10) return false;
    return true;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortBy === 'xp') return b.xp - a.xp;
    if (sortBy === 'level') return b.level - a.level;
    if (sortBy === 'streak') return b.streak - a.streak;
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
      case 'legend': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'master': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'explorer': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'photographer': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Global Leaderboard
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Top XP earners worldwide
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
        <div className="flex flex-wrap gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="xp">Sort by XP</option>
            <option value="level">Sort by Level</option>
            <option value="streak">Sort by Streak</option>
          </select>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Regions</option>
            <option value="North America">North America</option>
            <option value="Europe">Europe</option>
            <option value="Asia">Asia</option>
            <option value="South America">South America</option>
            <option value="Oceania">Oceania</option>
          </select>
          <button
            type="button"
            onClick={() => setShowTopOnly(!showTopOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showTopOnly
                ? 'bg-slate-500 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {showTopOnly ? <Eye className="h-3 w-3 inline mr-1" /> : <EyeOff className="h-3 w-3 inline mr-1" />}
            {showTopOnly ? 'Top 10' : 'All'}
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search username..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <p className="text-xs text-slate-500 dark:text-slate-400">Level {myEntry.level}</p>
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
                <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full text-white font-bold text-sm">
                  {entry.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{entry.username}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{entry.country}</span>
                    <span>•</span>
                    <span>Level {entry.level}</span>
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
                  <p className="text-xs text-slate-500 dark:text-slate-400">XP</p>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">{entry.streak}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Statistics
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
              <p className="text-lg font-bold text-slate-900 dark:text-white">125,000</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Top XP</p>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">365</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Longest Streak</p>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">50</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Max Level</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
