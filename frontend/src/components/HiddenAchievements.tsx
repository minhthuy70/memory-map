'use client';

import { useState } from 'react';
import {
  Award,
  BarChart3,
  CheckCircle,
  Clock,
  Crown,
  Eye,
  EyeOff,
  Flame,
  Gift,
  Heart,
  HelpCircle,
  Infinity,
  Info,
  Lock,
  MapPin,
  RefreshCw,
  Sparkles,
  Star,
  Target,
  Trophy,
  Unlock,
  Wand2,
  Zap
} from 'lucide-react';

interface HiddenAchievementsProps {
  onCancel?: () => void;
}

interface HiddenAchievement {
  id: string;
  name: string;
  description: string;
  hint: string;
  icon: string;
  rarity: 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedDate?: string;
  discovered: boolean;
  category: 'secret' | 'easter_egg' | 'mystery' | 'special';
}

export default function HiddenAchievements({ onCancel }: HiddenAchievementsProps) {
  const [showHints, setShowHints] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const [achievements, setAchievements] = useState<HiddenAchievement[]>([
    {
      id: '1',
      name: 'Sunset Owl',
      description: 'Create a memory between 2 AM and 4 AM',
      hint: 'The darkest hours reveal the brightest memories',
      icon: 'moon',
      rarity: 'rare',
      unlocked: true,
      unlockedDate: '2026-08-15',
      discovered: true,
      category: 'secret',
    },
    {
      id: '2',
      name: 'Memory Master',
      description: 'Create memories on 100 consecutive days',
      hint: 'Consistency is the key to mastery',
      icon: 'trophy',
      rarity: 'legendary',
      unlocked: false,
      discovered: true,
      category: 'secret',
    },
    {
      id: '3',
      name: 'Easter Hunter',
      description: 'Find all 10 hidden easter eggs in the app',
      hint: 'Look closely at every corner of the app',
      icon: 'egg',
      rarity: 'epic',
      unlocked: false,
      discovered: true,
      category: 'easter_egg',
    },
    {
      id: '4',
      name: 'Time Traveler',
      description: 'Edit a memory exactly 1 year after creation',
      hint: 'Time waits for no one, but memories do',
      icon: 'clock',
      rarity: 'epic',
      unlocked: false,
      discovered: false,
      category: 'mystery',
    },
    {
      id: '5',
      name: 'Global Citizen',
      description: 'Create memories in 20 different countries',
      hint: 'The world is your canvas',
      icon: 'globe',
      rarity: 'legendary',
      unlocked: false,
      discovered: false,
      category: 'secret',
    },
    {
      id: '6',
      name: 'Word Wizard',
      description: 'Write a memory description with exactly 1000 words',
      hint: 'Every word counts, precision matters',
      icon: 'sparkles',
      rarity: 'rare',
      unlocked: false,
      discovered: true,
      category: 'mystery',
    },
    {
      id: '7',
      name: 'Memory Alchemist',
      description: 'Convert 50 memories from one category to another',
      hint: 'Transformation is an art form',
      icon: 'wand2',
      rarity: 'epic',
      unlocked: false,
      discovered: false,
      category: 'special',
    },
    {
      id: '8',
      name: 'Infinity Streak',
      description: 'Maintain a 365-day streak',
      hint: 'A year of memories, a lifetime of moments',
      icon: 'infinity',
      rarity: 'legendary',
      unlocked: false,
      discovered: true,
      category: 'secret',
    },
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'from-blue-400 to-cyan-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'border-blue-300 dark:border-blue-600';
      case 'epic': return 'border-purple-300 dark:border-purple-600';
      case 'legendary': return 'border-yellow-300 dark:border-yellow-600';
      default: return 'border-slate-300 dark:border-slate-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'secret': return <Lock className="h-4 w-4" />;
      case 'easter_egg': return <Gift className="h-4 w-4" />;
      case 'mystery': return <HelpCircle className="h-4 w-4" />;
      case 'special': return <Sparkles className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case 'moon': return <Clock className="h-5 w-5" />;
      case 'trophy': return <Trophy className="h-5 w-5" />;
      case 'egg': return <Gift className="h-5 w-5" />;
      case 'clock': return <Clock className="h-5 w-5" />;
      case 'globe': return <MapPin className="h-5 w-5" />;
      case 'sparkles': return <Sparkles className="h-5 w-5" />;
      case 'wand2': return <Wand2 className="h-5 w-5" />;
      case 'infinity': return <Infinity className="h-5 w-5" />;
      default: return <HelpCircle className="h-5 w-5" />;
    }
  };

  const discoveredCount = achievements.filter(a => a.discovered).length;
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  const visibleAchievements = showAll
    ? achievements
    : achievements.filter(a => a.discovered);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Hidden Achievements
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Secret achievements waiting to be discovered
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHints(!showHints)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show hints"
          >
            {showHints ? <Eye className="h-4 w-4 text-slate-500" /> : <EyeOff className="h-4 w-4 text-slate-500" />}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Discovered</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{discoveredCount}/{totalCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Unlocked</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{unlockedCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Locked</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{totalCount - unlockedCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Secret</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{totalCount - discoveredCount}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            {showAll ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {showAll ? 'Hide Undiscovered' : 'Show All'}
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Check Progress
          </button>
        </div>

        <div className="space-y-2">
          {visibleAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 ${getRarityBorder(achievement.rarity)} ${achievement.unlocked ? 'bg-green-50 dark:bg-green-900/20' : achievement.discovered ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-700/30 opacity-60'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-gradient-to-br ${getRarityColor(achievement.rarity)} rounded-lg text-white ${achievement.unlocked ? '' : 'grayscale'}`}>
                    {achievement.discovered ? getAchievementIcon(achievement.icon) : <HelpCircle className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">
                      {achievement.discovered ? achievement.name : '???'}
                    </p>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(achievement.category)}
                      <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{achievement.category.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                    {achievement.rarity}
                  </span>
                  {achievement.unlocked ? (
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span>Unlocked</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Lock className="h-4 w-4" />
                      <span>Locked</span>
                    </div>
                  )}
                </div>
              </div>
              {achievement.discovered && (
                <>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{achievement.description}</p>
                  {showHints && (
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                        <Sparkles className="h-3 w-3" />
                        <span className="font-semibold">Hint:</span>
                        <span>{achievement.hint}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
              {!achievement.discovered && (
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    Continue exploring to discover this secret achievement
                  </p>
                </div>
              )}
              {achievement.unlocked && achievement.unlockedDate && (
                <div className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <Clock className="h-3 w-3" />
                  <span>Unlocked on {achievement.unlockedDate}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {!showAll && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              {totalCount - discoveredCount} more hidden achievements waiting to be discovered
            </p>
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-semibold hover:bg-purple-600 transition-colors"
            >
              Reveal All
            </button>
          </div>
        )}

        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              How to Discover Hidden Achievements
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Explore all features of the app thoroughly</li>
            <li>• Try different actions at different times</li>
            <li>• Pay attention to patterns and special dates</li>
            <li>• Complete challenges in unique ways</li>
            <li>• Some achievements unlock based on milestones</li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Hidden Achievement Rewards
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Rare: +500 XP and special badge</li>
            <li>• Epic: +1000 XP and exclusive title</li>
            <li>• Legendary: +2000 XP and unique profile customization</li>
            <li>• First discovery of each: Bonus coins</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
