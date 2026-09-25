'use client';

import { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Award,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Crown,
  Eye,
  EyeOff,
  Filter,
  Globe,
  MapPin,
  Medal,
  Minus,
  RefreshCw,
  Search,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';

interface RegionalLeaderboardProps {
  onCancel?: () => void;
}

interface RegionalEntry {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  country: string;
  region: string;
  city: string;
  change: number;
  score: number;
}

export default function RegionalLeaderboard({ onCancel }: RegionalLeaderboardProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'all' | 'week' | 'month'>('all');
  const [sortBy, setSortBy] = useState<'xp' | 'level' | 'score'>('xp');
  const [searchQuery, setSearchQuery] = useState('');
  const [myRegion, setMyRegion] = useState('Asia');

  const [regions, setRegions] = useState([
    { id: 'NA', name: 'North America', users: 15420 },
    { id: 'EU', name: 'Europe', users: 12350 },
    { id: 'AS', name: 'Asia', users: 28930 },
    { id: 'SA', name: 'South America', users: 4560 },
    { id: 'OC', name: 'Oceania', users: 3210 },
    { id: 'AF', name: 'Africa', users: 2340 },
  ]);

  const [entries, setEntries] = useState<RegionalEntry[]>([
    {
      id: '1',
      rank: 1,
      username: 'TokyoExplorer',
      avatar: 'TE',
      xp: 98000,
      level: 44,
      country: 'JP',
      region: 'Asia',
      city: 'Tokyo',
      change: 0,
      score: 9850,
    },
    {
      id: '2',
      username: 'NYC_Memories',
      avatar: 'NY',
      xp: 92000,
      level: 42,
      country: 'US',
      region: 'North America',
      city: 'New York',
      change: 2,
      score: 9200,
    },
    {
      id: '3',
      username: 'LondonLife',
      avatar: 'LL',
      xp: 87000,
      level: 40,
      country: 'UK',
      region: 'Europe',
      city: 'London',
      change: -1,
      score: 8700,
    },
    {
      id: '4',
      username: 'SeoulStories',
      avatar: 'SS',
      xp: 82000,
      level: 38,
      country: 'KR',
      region: 'Asia',
      city: 'Seoul',
      change: 1,
      score: 8200,
    },
    {
      id: '5',
      username: 'ParisMoments',
      avatar: 'PM',
      xp: 78000,
      level: 36,
      country: 'FR',
      region: 'Europe',
      city: 'Paris',
      change: 0,
      score: 7800,
    },
    {
      id: '6',
      username: 'SydneyScenes',
      avatar: 'SY',
      xp: 74000,
      level: 34,
      country: 'AU',
      region: 'Oceania',
      city: 'Sydney',
      change: 3,
      score: 7400,
    },
    {
      id: '7',
      username: 'TorontoTales',
      avatar: 'TT',
      xp: 70000,
      level: 32,
      country: 'CA',
      region: 'North America',
      city: 'Toronto',
      change: -2,
      score: 7000,
    },
    {
      id: '8',
      username: 'BerlinBooks',
      avatar: 'BB',
      xp: 66000,
      level: 30,
      country: 'DE',
      region: 'Europe',
      city: 'Berlin',
      change: 1,
      score: 6600,
    },
    {
      id: '9',
      username: 'SingaporeSnapshots',
      avatar: 'SN',
      xp: 62000,
      level: 28,
      country: 'SG',
      region: 'Asia',
      city: 'Singapore',
      change: 0,
      score: 6200,
    },
    {
      id: '10',
      username: 'BangkokBeats',
      avatar: 'BB',
      xp: 58000,
      level: 26,
      country: 'TH',
      region: 'Asia',
      city: 'Bangkok',
      change: 2,
      score: 5800,
    },
  ]);

  const [myEntry, setMyEntry] = useState<RegionalEntry>({
    id: 'me',
    rank: 15,
    username: 'You',
    avatar: 'ME',
    xp: 45000,
    level: 22,
    country: 'VN',
    region: 'Asia',
    city: 'Ho Chi Minh City',
    change: 5,
    score: 4500,
  });

  const filteredEntries = entries.filter(entry => {
    if (searchQuery && !entry.username.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedRegion !== 'all' && entry.region !== selectedRegion) return false;
    return true;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortBy === 'xp') return b.xp - a.xp;
    if (sortBy === 'level') return b.level - a.level;
    if (sortBy === 'score') return b.score - a.score;
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

  const getRegionColor = (region: string) => {
    switch (region) {
      case 'North America': return 'from-blue-400 to-blue-500';
      case 'Europe': return 'from-purple-400 to-purple-500';
      case 'Asia': return 'from-red-400 to-red-500';
      case 'South America': return 'from-green-400 to-green-500';
      case 'Oceania': return 'from-cyan-400 to-cyan-500';
      case 'Africa': return 'from-orange-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Regional Leaderboard
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Top performers by region
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
            <option value="Africa">Africa</option>
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="xp">ListOrdered by XP</option>
            <option value="level">ListOrdered by Level</option>
            <option value="score">ListOrdered by Score</option>
          </select>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search username or city..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {regions.map((region) => (
            <div
              key={region.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedRegion === region.name || (selectedRegion === 'all' && region.id === 'AS')
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600'
                  : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
              }`}
              onClick={() => setSelectedRegion(region.name)}
            >
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">{region.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{region.users.toLocaleString()} users</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full text-white font-bold">
                {myEntry.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{myEntry.username}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {myEntry.city}, {myEntry.country} • Rank #{myEntry.rank}
                </p>
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
                <div className={`p-2 bg-gradient-to-br ${getRegionColor(entry.region)} rounded-full text-white font-bold text-sm`}>
                  {entry.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{entry.username}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="h-3 w-3" />
                    <span>{entry.city}</span>
                    <span>•</span>
                    <span>{entry.country}</span>
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
                  <Target className="h-4 w-4 text-purple-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">{entry.score.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Regional Statistics
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
              <p className="text-lg font-bold text-slate-900 dark:text-white">66,810</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Users</p>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">98,000</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Top XP</p>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">6</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Regions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
