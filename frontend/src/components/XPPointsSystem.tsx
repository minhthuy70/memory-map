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
  Filter,
  Flame,
  Gift,
  History,
  Info,
  Minus,
  Plus,
  RefreshCw,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap
} from 'lucide-react';

interface XPPointsSystemProps {
  onCancel?: () => void;
}

interface XPTransaction {
  id: string;
  type: 'create' | 'share' | 'like' | 'comment' | 'badge' | 'challenge' | 'daily' | 'bonus';
  amount: number;
  description: string;
  date: string;
  multiplier?: number;
}

export default function XPPointsSystem({ onCancel }: XPPointsSystemProps) {
  const [currentXP, setCurrentXP] = useState(45000);
  const [totalXPEarned, setTotalXPEarned] = useState(125000);
  const [streakBonus, setStreakBonus] = useState(1.5);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showDetails, setShowDetails] = useState(false);

  const [transactions, setTransactions] = useState<XPTransaction[]>([
    {
      id: '1',
      type: 'create',
      amount: 100,
      description: 'Created a new memory',
      date: '2026-09-14',
      multiplier: 1.5,
    },
    {
      id: '2',
      type: 'share',
      amount: 50,
      description: 'Shared a memory',
      date: '2026-09-14',
    },
    {
      id: '3',
      type: 'like',
      amount: 10,
      description: 'Received a like',
      date: '2026-09-13',
    },
    {
      id: '4',
      type: 'comment',
      amount: 25,
      description: 'Commented on a memory',
      date: '2026-09-13',
    },
    {
      id: '5',
      type: 'badge',
      amount: 500,
      description: 'Unlocked Explorer badge',
      date: '2026-09-12',
    },
    {
      id: '6',
      type: 'challenge',
      amount: 200,
      description: 'Completed daily challenge',
      date: '2026-09-12',
    },
    {
      id: '7',
      type: 'daily',
      amount: 100,
      description: 'Daily login bonus',
      date: '2026-09-12',
    },
    {
      id: '8',
      type: 'bonus',
      amount: 1000,
      description: 'Monthly milestone bonus',
      date: '2026-09-10',
    },
    {
      id: '9',
      type: 'create',
      amount: 100,
      description: 'Created a new memory',
      date: '2026-09-10',
      multiplier: 1.5,
    },
    {
      id: '10',
      type: 'share',
      amount: 50,
      description: 'Shared a memory',
      date: '2026-09-09',
    },
  ]);

  const xpRates = {
    create: { base: 100, label: 'Create Memory', icon: 'plus' },
    share: { base: 50, label: 'Share Memory', icon: 'share' },
    like: { base: 10, label: 'Receive Like', icon: 'heart' },
    comment: { base: 25, label: 'Comment', icon: 'message' },
    badge: { base: 500, label: 'Unlock Badge', icon: 'award' },
    challenge: { base: 200, label: 'Complete Challenge', icon: 'target' },
    daily: { base: 100, label: 'Daily Login', icon: 'calendar' },
    bonus: { base: 1000, label: 'Special Bonus', icon: 'gift' },
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'create': return <Plus className="h-4 w-4" />;
      case 'share': return <Sparkles className="h-4 w-4" />;
      case 'like': return <Star className="h-4 w-4" />;
      case 'comment': return <Sparkles className="h-4 w-4" />;
      case 'badge': return <Award className="h-4 w-4" />;
      case 'challenge': return <Target className="h-4 w-4" />;
      case 'daily': return <Calendar className="h-4 w-4" />;
      case 'bonus': return <Gift className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'create': return 'from-green-400 to-emerald-500';
      case 'share': return 'from-blue-400 to-cyan-500';
      case 'like': return 'from-yellow-400 to-orange-500';
      case 'comment': return 'from-purple-400 to-pink-500';
      case 'badge': return 'from-indigo-400 to-purple-500';
      case 'challenge': return 'from-red-400 to-rose-500';
      case 'daily': return 'from-teal-400 to-cyan-500';
      case 'bonus': return 'from-amber-400 to-yellow-500';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (selectedFilter !== 'all' && tx.type !== selectedFilter) return false;
    return true;
  });

  const calculateLevel = (xp: number) => {
    let level = 1;
    let xpForNext = 1000;
    while (xp >= xpForNext) {
      xp -= xpForNext;
      level++;
      xpForNext = Math.round(xpForNext * 1.2);
    }
    return { level, currentXP: xp, xpForNext };
  };

  const levelInfo = calculateLevel(currentXP);
  const todayXP = transactions.filter(tx => tx.date === '2026-09-14').reduce((sum, tx) => sum + tx.amount, 0);
  const weekXP = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return txDate >= weekAgo;
  }).reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              XP Points System
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Earn XP through activities
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
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <span className="font-bold text-slate-900 dark:text-white text-xl">{currentXP.toLocaleString()}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">XP</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
              <Flame className="h-4 w-4" />
              <span>Level {levelInfo.level}</span>
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all"
              style={{ width: `${(levelInfo.currentXP / levelInfo.xpForNext) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{levelInfo.currentXP.toLocaleString()} / {levelInfo.xpForNext.toLocaleString()} XP to Level {levelInfo.level + 1}</span>
            <span>{Math.round((levelInfo.currentXP / levelInfo.xpForNext) * 100)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Today</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">+{todayXP}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">This Week</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">+{weekXP}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Earned</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{totalXPEarned.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Streak Bonus</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">x{streakBonus}</p>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">XP Rates</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(xpRates).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg">
                  <div className={`p-1.5 bg-gradient-to-br ${getActionColor(key)} rounded`}>
                    {getActionIcon(key)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{value.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">+{value.base} XP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Actions</option>
            <option value="create">Create</option>
            <option value="share">Share</option>
            <option value="like">Like</option>
            <option value="comment">Comment</option>
            <option value="badge">Badge</option>
            <option value="challenge">Challenge</option>
            <option value="daily">Daily</option>
            <option value="bonus">Bonus</option>
          </select>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-gradient-to-br ${getActionColor(tx.type)} rounded-lg text-white`}>
                  {getActionIcon(tx.type)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{tx.description}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{tx.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {tx.multiplier && (
                  <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                    <Flame className="h-3 w-3" />
                    <span>x{tx.multiplier}</span>
                  </div>
                )}
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">+{tx.amount.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">XP</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Ways to Earn XP
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Create memories: +100 XP (with streak bonus up to x2)</li>
            <li>• Share memories: +50 XP</li>
            <li>• Receive likes: +10 XP per like</li>
            <li>• Comment on memories: +25 XP</li>
            <li>• Unlock badges: +500 XP per badge</li>
            <li>• Complete challenges: +200 XP</li>
            <li>• Daily login: +100 XP</li>
            <li>• Special bonuses: +1000 XP for milestones</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
