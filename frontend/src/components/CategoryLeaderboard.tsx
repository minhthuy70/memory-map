'use client';

import { useState } from 'react';
import { Trophy, X, TrendingUp, TrendingDown, Medal, Award, Crown, Star, Filter, ChevronDown, ChevronUp, RefreshCw, Search, Eye, EyeOff, ArrowUp, ArrowDown, Minus, Camera, MapPin, Heart, Users, Zap, Target, Flame, BarChart3, Hash, Sparkles } from 'lucide-react';

interface CategoryLeaderboardProps {
  onCancel?: () => void;
}

interface CategoryEntry {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  score: number;
  category: 'travel' | 'photos' | 'social' | 'creativity' | 'consistency';
  metric: string;
  unit: string;
  change: number;
  badge: string;
}

export default function CategoryLeaderboard({ onCancel }: CategoryLeaderboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'all' | 'week' | 'month'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'change'>('score');
  const [searchQuery, setSearchQuery] = useState('');

  const [categories, setCategories] = useState([
    { id: 'travel', name: 'Most Traveled', icon: 'map', description: 'Most countries/locations visited', color: 'from-blue-400 to-blue-500' },
    { id: 'photos', name: 'Best Photographer', icon: 'camera', description: 'Most photos uploaded', color: 'from-pink-400 to-pink-500' },
    { id: 'social', name: 'Most Social', icon: 'users', description: 'Most shares and interactions', color: 'from-green-400 to-green-500' },
    { id: 'creativity', name: 'Most Creative', icon: 'sparkles', description: 'Most creative descriptions', color: 'from-purple-400 to-purple-500' },
    { id: 'consistency', name: 'Most Consistent', icon: 'flame', description: 'Longest streak', color: 'from-orange-400 to-orange-500' },
  ]);

  const [entries, setEntries] = useState<CategoryEntry[]>([
    {
      id: '1',
      rank: 1,
      username: 'GlobeTrotter',
      avatar: 'GT',
      score: 87,
      category: 'travel',
      metric: 'Countries',
      unit: 'visited',
      change: 0,
      badge: 'world_explorer',
    },
    {
      id: '2',
      rank: 2,
      username: 'NomadLife',
      avatar: 'NL',
      score: 72,
      category: 'travel',
      metric: 'Countries',
      unit: 'visited',
      change: 2,
      badge: 'travel_master',
    },
    {
      id: '3',
      rank: 3,
      username: 'AdventureSeeker',
      avatar: 'AS',
      score: 65,
      category: 'travel',
      metric: 'Countries',
      unit: 'visited',
      change: -1,
      badge: 'explorer',
    },
    {
      id: '4',
      rank: 4,
      username: 'PhotoPro',
      avatar: 'PP',
      score: 1520,
      category: 'photos',
      metric: 'Photos',
      unit: 'uploaded',
      change: 0,
      badge: 'master_photographer',
    },
    {
      id: '5',
      rank: 5,
      username: 'SnapMaster',
      avatar: 'SM',
      score: 1380,
      category: 'photos',
      metric: 'Photos',
      unit: 'uploaded',
      change: 3,
      badge: 'photographer',
    },
    {
      id: '6',
      rank: 6,
      username: 'MemoryKeeper',
      avatar: 'MK',
      score: 1250,
      category: 'photos',
      metric: 'Photos',
      unit: 'uploaded',
      change: -2,
      badge: 'camera_enthusiast',
    },
    {
      id: '7',
      rank: 7,
      username: 'SocialButterfly',
      avatar: 'SB',
      score: 342,
      category: 'social',
      metric: 'Shares',
      unit: 'total',
      change: 1,
      badge: 'social_star',
    },
    {
      id: '8',
      rank: 8,
      username: 'Connector',
      avatar: 'CN',
      score: 298,
      category: 'social',
      metric: 'Shares',
      unit: 'total',
      change: 0,
      badge: 'networker',
    },
    {
      id: '9',
      rank: 9,
      username: 'CommunityBuilder',
      avatar: 'CB',
      score: 275,
      category: 'social',
      metric: 'Shares',
      unit: 'total',
      change: 2,
      badge: 'engager',
    },
    {
      id: '10',
      rank: 10,
      username: 'StoryWeaver',
      avatar: 'SW',
      score: 45000,
      category: 'creativity',
      metric: 'Words',
      unit: 'written',
      change: 0,
      badge: 'master_writer',
    },
    {
      id: '11',
      rank: 11,
      username: 'WordSmith',
      avatar: 'WS',
      score: 38500,
      category: 'creativity',
      metric: 'Words',
      unit: 'written',
      change: 1,
      badge: 'writer',
    },
    {
      id: '12',
      rank: 12,
      username: 'CreativeMind',
      avatar: 'CM',
      score: 32000,
      category: 'creativity',
      metric: 'Words',
      unit: 'written',
      change: -1,
      badge: 'storyteller',
    },
    {
      id: '13',
      rank: 13,
      username: 'StreakKing',
      avatar: 'SK',
      score: 365,
      category: 'consistency',
      metric: 'Days',
      unit: 'streak',
      change: 0,
      badge: 'legend',
    },
    {
      id: '14',
      rank: 14,
      username: 'DailyDedicator',
      avatar: 'DD',
      score: 289,
      category: 'consistency',
      metric: 'Days',
      unit: 'streak',
      change: 5,
      badge: 'dedicated',
    },
    {
      id: '15',
      rank: 15,
      username: 'ConsistentCreator',
      avatar: 'CC',
      score: 234,
      category: 'consistency',
      metric: 'Days',
      unit: 'streak',
      change: -3,
      badge: 'reliable',
    },
  ]);

  const [myEntry, setMyEntry] = useState<CategoryEntry>({
    id: 'me',
    rank: 5,
    username: 'You',
    avatar: 'ME',
    score: 850,
    category: 'photos',
    metric: 'Photos',
    unit: 'uploaded',
    change: 8,
    badge: 'photographer',
  });

  const filteredEntries = entries.filter(entry => {
    if (searchQuery && !entry.username.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategory !== 'all' && entry.category !== selectedCategory) return false;
    return true;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'change') return b.change - a.change;
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

  const getCategoryIcon = (icon: string) => {
    switch (icon) {
      case 'map': return <MapPin className="h-5 w-5" />;
      case 'camera': return <Camera className="h-5 w-5" />;
      case 'users': return <Users className="h-5 w-5" />;
      case 'sparkles': return <Sparkles className="h-5 w-5" />;
      case 'flame': return <Flame className="h-5 w-5" />;
      default: return <Trophy className="h-5 w-5" />;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'world_explorer': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'master_photographer': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
      case 'social_star': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'master_writer': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'legend': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Category Leaderboard
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Top performers by category
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedCategory === category.id || (selectedCategory === 'all' && category.id === 'photos')
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-600'
                  : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="flex items-center gap-2">
                <div className={`p-2 bg-gradient-to-br ${category.color} rounded-lg text-white`}>
                  {getCategoryIcon(category.icon)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">{category.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{category.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
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
            <option value="score">Sort by Score</option>
            <option value="change">Sort by Change</option>
          </select>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search username..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-full text-white font-bold">
                {myEntry.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{myEntry.username}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your rank: #{myEntry.rank} in {categories.find(c => c.id === myEntry.category)?.name}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 dark:text-white">{myEntry.score.toLocaleString()}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{myEntry.metric} {myEntry.unit}</p>
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
                <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-full text-white font-bold text-sm">
                  {entry.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{entry.username}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Hash className="h-3 w-3" />
                    <span>{entry.score.toLocaleString()} {entry.metric} {entry.unit}</span>
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
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeColor(entry.badge)}`}>
                    {entry.badge.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Category Statistics
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
              <p className="text-lg font-bold text-slate-900 dark:text-white">87</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Most Countries</p>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">1,520</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Most Photos</p>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">365</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Longest Streak</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Category Rewards
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Rank 1: 300 coins + category badge</li>
            <li>• Rank 2-3: 200 coins + badge</li>
            <li>• Rank 4-10: 100 coins</li>
            <li>• Top 20: 50 coins</li>
            <li>• Category champions get special recognition</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
