'use client';

import { useState } from 'react';
import { Trophy, Star, Crown, Medal, Award, Lock, Unlock, X, Filter, Check, ChevronDown, ChevronUp, Zap, Flame, Sparkles, Heart, Target, Mountain, Gem, Shield, Sword, Clock, Calendar, TrendingUp, Eye, EyeOff, Share2, Download, Gift, Pen } from 'lucide-react';

interface VirtualTrophiesProps {
  onCancel?: () => void;
}

interface Trophy {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  category: 'exploration' | 'creativity' | 'consistency' | 'social' | 'special';
}

export default function VirtualTrophies({ onCancel }: VirtualTrophiesProps) {
  const [showLocked, setShowLocked] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'rarity'>('newest');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const [trophies, setTrophies] = useState<Trophy[]>([
    {
      id: '1',
      name: 'First Memory',
      description: 'Create your first memory',
      icon: 'star',
      rarity: 'common',
      unlocked: true,
      unlockedAt: '2026-01-15',
      progress: 1,
      maxProgress: 1,
      category: 'exploration',
    },
    {
      id: '2',
      name: 'Memory Master',
      description: 'Create 100 memories',
      icon: 'crown',
      rarity: 'legendary',
      unlocked: true,
      unlockedAt: '2026-03-20',
      progress: 100,
      maxProgress: 100,
      category: 'consistency',
    },
    {
      id: '3',
      name: 'World Traveler',
      description: 'Add memories from 10 different countries',
      icon: 'mountain',
      rarity: 'epic',
      unlocked: false,
      progress: 7,
      maxProgress: 10,
      category: 'exploration',
    },
    {
      id: '4',
      name: 'Creative Soul',
      description: 'Upload 50 photos to memories',
      icon: 'sparkles',
      rarity: 'rare',
      unlocked: true,
      unlockedAt: '2026-02-10',
      progress: 50,
      maxProgress: 50,
      category: 'creativity',
    },
    {
      id: '5',
      name: '30-Day Streak',
      description: 'Create memories for 30 consecutive days',
      icon: 'flame',
      rarity: 'epic',
      unlocked: false,
      progress: 22,
      maxProgress: 30,
      category: 'consistency',
    },
    {
      id: '6',
      name: 'Social Butterfly',
      description: 'Share 20 memories with friends',
      icon: 'heart',
      rarity: 'rare',
      unlocked: true,
      unlockedAt: '2026-04-05',
      progress: 20,
      maxProgress: 20,
      category: 'social',
    },
    {
      id: '7',
      name: 'Golden Memory',
      description: 'Receive 100 likes on a single memory',
      icon: 'award',
      rarity: 'legendary',
      unlocked: false,
      progress: 67,
      maxProgress: 100,
      category: 'social',
    },
    {
      id: '8',
      name: 'Storyteller',
      description: 'Write 10,000 words in memory descriptions',
      icon: 'pen',
      rarity: 'rare',
      unlocked: false,
      progress: 8500,
      maxProgress: 10000,
      category: 'creativity',
    },
    {
      id: '9',
      name: 'Early Bird',
      description: 'Create a memory before 6 AM',
      icon: 'clock',
      rarity: 'common',
      unlocked: true,
      unlockedAt: '2026-01-20',
      progress: 1,
      maxProgress: 1,
      category: 'special',
    },
    {
      id: '10',
      name: 'Night Owl',
      description: 'Create a memory after midnight',
      icon: 'moon',
      rarity: 'common',
      unlocked: true,
      unlockedAt: '2026-02-15',
      progress: 1,
      maxProgress: 1,
      category: 'special',
    },
    {
      id: '11',
      name: 'Memory Guardian',
      description: 'Keep a 100-day streak',
      icon: 'shield',
      rarity: 'legendary',
      unlocked: false,
      progress: 45,
      maxProgress: 100,
      category: 'consistency',
    },
    {
      id: '12',
      name: 'Treasure Hunter',
      description: 'Discover 50 hidden locations',
      icon: 'gem',
      rarity: 'epic',
      unlocked: false,
      progress: 32,
      maxProgress: 50,
      category: 'exploration',
    },
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'rare': return 'from-blue-400 to-blue-500';
      case 'epic': return 'from-purple-400 to-purple-500';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 dark:bg-gray-800';
      case 'rare': return 'bg-blue-50 dark:bg-blue-900/20';
      case 'epic': return 'bg-purple-50 dark:bg-purple-900/20';
      case 'legendary': return 'bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'star': return <Star className="h-6 w-6" />;
      case 'crown': return <Crown className="h-6 w-6" />;
      case 'mountain': return <Mountain className="h-6 w-6" />;
      case 'sparkles': return <Sparkles className="h-6 w-6" />;
      case 'flame': return <Flame className="h-6 w-6" />;
      case 'heart': return <Heart className="h-6 w-6" />;
      case 'award': return <Award className="h-6 w-6" />;
      case 'clock': return <Clock className="h-6 w-6" />;
      case 'moon': return <Calendar className="h-6 w-6" />;
      case 'shield': return <Shield className="h-6 w-6" />;
      case 'gem': return <Gem className="h-6 w-6" />;
      case 'pen': return <Pen className="h-6 w-6" />;
      default: return <Trophy className="h-6 w-6" />;
    }
  };

  const filteredTrophies = trophies.filter(trophy => {
    if (!showLocked && !trophy.unlocked) return false;
    if (selectedCategory !== 'all' && trophy.category !== selectedCategory) return false;
    if (selectedRarity !== 'all' && trophy.rarity !== selectedRarity) return false;
    return true;
  });

  const sortedTrophies = [...filteredTrophies].sort((a, b) => {
    if (sortOrder === 'newest') {
      return (b.unlockedAt || '').localeCompare(a.unlockedAt || '');
    } else if (sortOrder === 'oldest') {
      return (a.unlockedAt || '').localeCompare(b.unlockedAt || '');
    } else if (sortOrder === 'rarity') {
      const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    }
    return 0;
  });

  const unlockedCount = trophies.filter(t => t.unlocked).length;
  const totalCount = trophies.length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Virtual Trophies
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {unlockedCount}/{totalCount} trophies unlocked
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
          <button
            type="button"
            onClick={() => setShowLocked(!showLocked)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showLocked
                ? 'bg-slate-500 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {showLocked ? <Eye className="h-3 w-3 inline mr-1" /> : <EyeOff className="h-3 w-3 inline mr-1" />}
            {showLocked ? 'Show Locked' : 'Hide Locked'}
          </button>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Categories</option>
            <option value="exploration">Exploration</option>
            <option value="creativity">Creativity</option>
            <option value="consistency">Consistency</option>
            <option value="social">Social</option>
            <option value="special">Special</option>
          </select>
          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Rarities</option>
            <option value="common">Common</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rarity">By Rarity</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {sortedTrophies.map((trophy) => (
            <div
              key={trophy.id}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:scale-105 ${
                trophy.unlocked
                  ? `bg-gradient-to-br ${getRarityBg(trophy.rarity)} border-${trophy.rarity === 'legendary' ? 'yellow' : trophy.rarity === 'epic' ? 'purple' : trophy.rarity === 'rare' ? 'blue' : 'gray'}-300 dark:border-${trophy.rarity === 'legendary' ? 'yellow' : trophy.rarity === 'epic' ? 'purple' : trophy.rarity === 'rare' ? 'blue' : 'gray'}-600`
                  : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600 opacity-60'
              }`}
              onClick={() => setShowDetails(trophy.id)}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-full bg-gradient-to-br ${getRarityColor(trophy.rarity)} text-white mb-2`}>
                  {trophy.unlocked ? getIcon(trophy.icon) : <Lock className="h-6 w-6" />}
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                  {trophy.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {trophy.description}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    trophy.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    trophy.rarity === 'epic' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                    trophy.rarity === 'rare' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {trophy.rarity}
                  </span>
                </div>
                {!trophy.unlocked && (
                  <div className="mt-2 w-full">
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
                      <div
                        className="bg-slate-500 h-1.5 rounded-full"
                        style={{ width: `${(trophy.progress / trophy.maxProgress) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {trophy.progress}/{trophy.maxProgress}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {showDetails && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full">
              {(() => {
                const trophy = trophies.find(t => t.id === showDetails);
                if (!trophy) return null;
                return (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                        Trophy Details
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowDetails(null)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4 text-slate-500" />
                      </button>
                    </div>
                    <div className="flex flex-col items-center text-center mb-4">
                      <div className={`p-6 rounded-full bg-gradient-to-br ${getRarityColor(trophy.rarity)} text-white mb-4`}>
                        {trophy.unlocked ? getIcon(trophy.icon) : <Lock className="h-10 w-10" />}
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xl mb-2">
                        {trophy.name}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                        {trophy.description}
                      </p>
                      <span className={`text-sm px-3 py-1 rounded-full ${
                        trophy.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        trophy.rarity === 'epic' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                        trophy.rarity === 'rare' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {trophy.rarity}
                      </span>
                    </div>
                    {trophy.unlocked ? (
                      <div className="space-y-2">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          <Calendar className="h-4 w-4 inline mr-2" />
                          Unlocked on {trophy.unlockedAt}
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                          >
                            <Share2 className="h-4 w-4" />
                            Share
                          </button>
                          <button
                            type="button"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-slate-500 h-2 rounded-full"
                            style={{ width: `${(trophy.progress / trophy.maxProgress) * 100}%` }}
                          />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                          Progress: {trophy.progress}/{trophy.maxProgress}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                          {((trophy.progress / trophy.maxProgress) * 100).toFixed(0)}% complete
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
