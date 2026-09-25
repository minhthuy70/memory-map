'use client';

import { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Crown,
  Download,
  Eye,
  EyeOff,
  Filter,
  Flame,
  Grid,
  Heart,
  List,
  Lock,
  MapPin,
  RotateCcw,
  Search,
  Share2,
  Sparkles,
  Star,
  Target,
  Trophy,
  Unlock,
  Zap
} from 'lucide-react';

interface BadgeCollectionProps {
  onCancel?: () => void;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'exploration' | 'creativity' | 'consistency' | 'social' | 'special';
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  maxProgress: number;
  condition: string;
}

export default function BadgeCollection({ onCancel }: BadgeCollectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [showLocked, setShowLocked] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const [badges, setBadges] = useState<Badge[]>([
    {
      id: '1',
      name: 'First Memory',
      description: 'Create your first memory',
      icon: 'star',
      rarity: 'common',
      category: 'exploration',
      unlocked: true,
      unlockedDate: '2026-01-15',
      progress: 1,
      maxProgress: 1,
      condition: 'Create 1 memory',
    },
    {
      id: '2',
      name: 'Memory Maker',
      description: 'Create 10 memories',
      icon: 'trophy',
      rarity: 'common',
      category: 'exploration',
      unlocked: true,
      unlockedDate: '2026-02-20',
      progress: 10,
      maxProgress: 10,
      condition: 'Create 10 memories',
    },
    {
      id: '3',
      name: 'Explorer',
      description: 'Visit 5 different locations',
      icon: 'mapPin',
      rarity: 'rare',
      category: 'exploration',
      unlocked: true,
      unlockedDate: '2026-03-10',
      progress: 5,
      maxProgress: 5,
      condition: 'Visit 5 locations',
    },
    {
      id: '4',
      name: 'World Traveler',
      description: 'Visit 10 different cities',
      icon: 'crown',
      rarity: 'epic',
      category: 'exploration',
      unlocked: false,
      progress: 7,
      maxProgress: 10,
      condition: 'Visit 10 cities',
    },
    {
      id: '5',
      name: 'Globe Trotter',
      description: 'Visit 25 different cities',
      icon: 'sparkles',
      rarity: 'legendary',
      category: 'exploration',
      unlocked: false,
      progress: 7,
      maxProgress: 25,
      condition: 'Visit 25 cities',
    },
    {
      id: '6',
      name: 'Photo Pro',
      description: 'Add 50 photos to memories',
      icon: 'camera',
      rarity: 'rare',
      category: 'creativity',
      unlocked: true,
      unlockedDate: '2026-04-05',
      progress: 50,
      maxProgress: 50,
      condition: 'Add 50 photos',
    },
    {
      id: '7',
      name: 'Storyteller',
      description: 'Write 1000 words in memory descriptions',
      icon: 'sparkles',
      rarity: 'epic',
      category: 'creativity',
      unlocked: false,
      progress: 650,
      maxProgress: 1000,
      condition: 'Write 1000 words',
    },
    {
      id: '8',
      name: 'Week Warrior',
      description: 'Log memories for 7 consecutive days',
      icon: 'flame',
      rarity: 'rare',
      category: 'consistency',
      unlocked: true,
      unlockedDate: '2026-05-15',
      progress: 7,
      maxProgress: 7,
      condition: '7 day streak',
    },
    {
      id: '9',
      name: 'Month Master',
      description: 'Log memories for 30 consecutive days',
      icon: 'zap',
      rarity: 'epic',
      category: 'consistency',
      unlocked: false,
      progress: 18,
      maxProgress: 30,
      condition: '30 day streak',
    },
    {
      id: '10',
      name: 'Social Butterfly',
      description: 'Share 20 memories',
      icon: 'share2',
      rarity: 'rare',
      category: 'social',
      unlocked: true,
      unlockedDate: '2026-06-20',
      progress: 20,
      maxProgress: 20,
      condition: 'Share 20 memories',
    },
    {
      id: '11',
      name: 'Community Star',
      description: 'Receive 100 likes on your memories',
      icon: 'heart',
      rarity: 'epic',
      category: 'social',
      unlocked: false,
      progress: 65,
      maxProgress: 100,
      condition: 'Get 100 likes',
    },
    {
      id: '12',
      name: 'First Anniversary',
      description: 'Use the app for 1 year',
      icon: 'calendar',
      rarity: 'legendary',
      category: 'special',
      unlocked: false,
      progress: 245,
      maxProgress: 365,
      condition: 'Use app for 365 days',
    },
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-slate-400 to-slate-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-slate-300 dark:border-slate-600';
      case 'rare': return 'border-blue-300 dark:border-blue-600';
      case 'epic': return 'border-purple-300 dark:border-purple-600';
      case 'legendary': return 'border-yellow-300 dark:border-yellow-600';
      default: return 'border-slate-300 dark:border-slate-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'exploration': return <MapPin className="h-4 w-4" />;
      case 'creativity': return <Sparkles className="h-4 w-4" />;
      case 'consistency': return <Flame className="h-4 w-4" />;
      case 'social': return <Heart className="h-4 w-4" />;
      case 'special': return <Star className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getBadgeIcon = (icon: string) => {
    switch (icon) {
      case 'star': return <Star className="h-6 w-6" />;
      case 'trophy': return <Trophy className="h-6 w-6" />;
      case 'mapPin': return <MapPin className="h-6 w-6" />;
      case 'crown': return <Crown className="h-6 w-6" />;
      case 'sparkles': return <Sparkles className="h-6 w-6" />;
      case 'camera': return <Target className="h-6 w-6" />;
      case 'flame': return <Flame className="h-6 w-6" />;
      case 'zap': return <Zap className="h-6 w-6" />;
      case 'share2': return <Share2 className="h-6 w-6" />;
      case 'heart': return <Heart className="h-6 w-6" />;
      case 'calendar': return <Calendar className="h-6 w-6" />;
      default: return <Award className="h-6 w-6" />;
    }
  };

  const filteredBadges = badges.filter(badge => {
    if (selectedCategory !== 'all' && badge.category !== selectedCategory) return false;
    if (selectedRarity !== 'all' && badge.rarity !== selectedRarity) return false;
    if (!showLocked && !badge.unlocked) return false;
    if (searchQuery && !badge.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalCount = badges.length;
  const rareCount = badges.filter(b => b.rarity === 'rare' && b.unlocked).length;
  const epicCount = badges.filter(b => b.rarity === 'epic' && b.unlocked).length;
  const legendaryCount = badges.filter(b => b.rarity === 'legendary' && b.unlocked).length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Award className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Badge Collection
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {unlockedCount}/{totalCount} badges unlocked
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLocked(!showLocked)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title={showLocked ? 'Hide locked' : 'Show locked'}
          >
            {showLocked ? <Eye className="h-4 w-4 text-slate-500" /> : <EyeOff className="h-4 w-4 text-slate-500" />}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Common</p>
            <p className="text-lg font-bold text-slate-600 dark:text-slate-400">{badges.filter(b => b.rarity === 'common' && b.unlocked).length}</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Rare</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{rareCount}</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
            <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Epic</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{epicCount}</p>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">Legendary</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{legendaryCount}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
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
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search badges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
            />
          </div>
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white' : 'text-slate-500'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white' : 'text-slate-500'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredBadges.map((badge) => (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${getRarityBorder(badge.rarity)} ${badge.unlocked ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-700/30 opacity-60'}`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`p-3 bg-gradient-to-br ${getRarityColor(badge.rarity)} rounded-xl mb-2 ${badge.unlocked ? '' : 'grayscale'}`}>
                    {getBadgeIcon(badge.icon)}
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{badge.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{badge.rarity}</p>
                  {!badge.unlocked && (
                    <div className="w-full">
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <span>{badge.progress}/{badge.maxProgress}</span>
                        <span>{Math.round((badge.progress / badge.maxProgress) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
                        <div
                          className={`bg-gradient-to-r ${getRarityColor(badge.rarity)} h-1.5 rounded-full transition-all`}
                          style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {badge.unlocked && (
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle className="h-3 w-3" />
                      <span>Unlocked</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredBadges.map((badge) => (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${getRarityBorder(badge.rarity)} ${badge.unlocked ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-700/30 opacity-60'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-gradient-to-br ${getRarityColor(badge.rarity)} rounded-lg ${badge.unlocked ? '' : 'grayscale'}`}>
                    {getBadgeIcon(badge.icon)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{badge.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{badge.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {getCategoryIcon(badge.category)}
                    <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{badge.category}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badge.rarity === 'common' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400' : badge.rarity === 'rare' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : badge.rarity === 'epic' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                    {badge.rarity}
                  </span>
                  {!badge.unlocked && (
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400">{badge.progress}/{badge.maxProgress}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{Math.round((badge.progress / badge.maxProgress) * 100)}%</p>
                    </div>
                  )}
                  {badge.unlocked && (
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle className="h-3 w-3" />
                      <span>{badge.unlockedDate}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedBadge && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-900 dark:text-white text-lg">Badge Details</h4>
                <button
                  type="button"
                  onClick={() => setSelectedBadge(null)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
              <div className="flex flex-col items-center text-center mb-4">
                <div className={`p-4 bg-gradient-to-br ${getRarityColor(selectedBadge.rarity)} rounded-xl mb-3 ${selectedBadge.unlocked ? '' : 'grayscale'}`}>
                  {getBadgeIcon(selectedBadge.icon)}
                </div>
                <h5 className="font-bold text-slate-900 dark:text-white text-xl mb-1">{selectedBadge.name}</h5>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{selectedBadge.description}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${selectedBadge.rarity === 'common' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400' : selectedBadge.rarity === 'rare' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : selectedBadge.rarity === 'epic' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                    {selectedBadge.rarity}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    {getCategoryIcon(selectedBadge.category)}
                    <span className="capitalize">{selectedBadge.category}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedBadge.condition}</p>
              </div>
              {!selectedBadge.unlocked && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>{selectedBadge.progress}/{selectedBadge.maxProgress} ({Math.round((selectedBadge.progress / selectedBadge.maxProgress) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${getRarityColor(selectedBadge.rarity)} h-2 rounded-full transition-all`}
                      style={{ width: `${(selectedBadge.progress / selectedBadge.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              {selectedBadge.unlocked && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-semibold">Unlocked on {selectedBadge.unlockedDate}</span>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
