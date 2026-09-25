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
  Mail,
  Medal,
  MessageCircle,
  Minus,
  MoreHorizontal,
  RefreshCw,
  Search,
  Share2,
  Star,
  TrendingDown,
  TrendingUp,
  UserMinus,
  UserPlus,
  Users,
  Zap
} from 'lucide-react';

interface FriendsLeaderboardProps {
  onCancel?: () => void;
}

interface FriendEntry {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  status: 'online' | 'offline' | 'away';
  lastActive: string;
  change: number;
  isFriend: boolean;
  friendshipLevel: number;
}

export default function FriendsLeaderboard({ onCancel }: FriendsLeaderboardProps) {
  const [timeRange, setTimeRange] = useState<'all' | 'week' | 'month'>('all');
  const [showOffline, setShowOffline] = useState(true);
  const [sortBy, setSortBy] = useState<'xp' | 'level' | 'friendship'>('xp');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInvite, setShowInvite] = useState(false);

  const [entries, setEntries] = useState<FriendEntry[]>([
    {
      id: '1',
      rank: 1,
      username: 'Alice',
      avatar: 'AL',
      xp: 85000,
      level: 38,
      status: 'online',
      lastActive: 'Just now',
      change: 0,
      isFriend: true,
      friendshipLevel: 95,
    },
    {
      id: '2',
      username: 'Bob',
      avatar: 'BO',
      xp: 72000,
      level: 34,
      status: 'online',
      lastActive: '5 min ago',
      change: 2,
      isFriend: true,
      friendshipLevel: 88,
    },
    {
      id: '3',
      username: 'Charlie',
      avatar: 'CH',
      xp: 68000,
      level: 32,
      status: 'away',
      lastActive: '1 hour ago',
      change: -1,
      isFriend: true,
      friendshipLevel: 75,
    },
    {
      id: '4',
      username: 'Diana',
      avatar: 'DI',
      xp: 54000,
      level: 28,
      status: 'offline',
      lastActive: '2 days ago',
      change: 1,
      isFriend: true,
      friendshipLevel: 60,
    },
    {
      id: '5',
      username: 'Eve',
      avatar: 'EV',
      xp: 48000,
      level: 26,
      status: 'offline',
      lastActive: '1 week ago',
      change: 0,
      isFriend: true,
      friendshipLevel: 45,
    },
    {
      id: '6',
      username: 'Frank',
      avatar: 'FR',
      xp: 42000,
      level: 24,
      status: 'online',
      lastActive: '10 min ago',
      change: 3,
      isFriend: true,
      friendshipLevel: 30,
    },
  ]);

  const [myEntry, setMyEntry] = useState<FriendEntry>({
    id: 'me',
    rank: 3,
    username: 'You',
    avatar: 'ME',
    xp: 45000,
    level: 22,
    status: 'online',
    lastActive: 'Just now',
    change: 5,
    isFriend: false,
    friendshipLevel: 0,
  });

  const filteredEntries = entries.filter(entry => {
    if (searchQuery && !entry.username.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (!showOffline && entry.status === 'offline') return false;
    return true;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortBy === 'xp') return b.xp - a.xp;
    if (sortBy === 'level') return b.level - a.level;
    if (sortBy === 'friendship') return b.friendshipLevel - a.friendshipLevel;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  };

  const getFriendshipColor = (level: number) => {
    if (level >= 80) return 'text-green-500';
    if (level >= 50) return 'text-blue-500';
    if (level >= 30) return 'text-yellow-500';
    return 'text-slate-400';
  };

  const handleAddFriend = (entry: FriendEntry) => {
    setEntries(entries.map(e => 
      e.id === entry.id ? { ...e, isFriend: true, friendshipLevel: 10 } : e
    ));
  };

  const handleRemoveFriend = (entry: FriendEntry) => {
    setEntries(entries.map(e => 
      e.id === entry.id ? { ...e, isFriend: false, friendshipLevel: 0 } : e
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Friends Leaderboard
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Compete with your friends
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowInvite(!showInvite)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Invite Friends"
          >
            <UserPlus className="h-4 w-4 text-slate-500" />
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

      {showInvite && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Invite Friends
          </h4>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter email address"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg"
            />
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <Mail className="h-4 w-4" />
                Send Email
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                <Share2 className="h-4 w-4" />
                Share Link
              </button>
            </div>
          </div>
        </div>
      )}

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
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="xp">ListOrdered by XP</option>
            <option value="level">ListOrdered by Level</option>
            <option value="friendship">ListOrdered by Friendship</option>
          </select>
          <button
            type="button"
            onClick={() => setShowOffline(!showOffline)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showOffline
                ? 'bg-slate-500 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {showOffline ? <Eye className="h-3 w-3 inline mr-1" /> : <EyeOff className="h-3 w-3 inline mr-1" />}
            {showOffline ? 'Show Offline' : 'Hide Offline'}
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search friends..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full text-white font-bold">
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
                <div className="relative">
                  <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full text-white font-bold text-sm">
                    {entry.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(entry.status)}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{entry.username}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Level {entry.level}</span>
                    <span>•</span>
                    <span>{entry.lastActive}</span>
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
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className={`text-xs font-semibold ${getFriendshipColor(entry.friendshipLevel)}`}>
                    {entry.friendshipLevel}%
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {entry.isFriend ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveFriend(entry)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                      title="Remove friend"
                    >
                      <UserMinus className="h-4 w-4 text-red-500" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAddFriend(entry)}
                      className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                      title="Add friend"
                    >
                      <UserPlus className="h-4 w-4 text-green-500" />
                    </button>
                  )}
                  <button
                    type="button"
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded"
                    title="Message"
                  >
                    <MessageCircle className="h-4 w-4 text-slate-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Friendship Stats
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
              <p className="text-lg font-bold text-slate-900 dark:text-white">{entries.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Friends</p>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">85%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Avg Friendship</p>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">3</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Online Now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
