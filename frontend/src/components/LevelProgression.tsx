'use client';

import { useState } from 'react';
import { Crown, X, TrendingUp, Star, Zap, Award, Target, Sparkles, Flame, ChevronRight, ChevronLeft, Info, Gift, Shield, Sword, Gem, Wand2, Heart, MapPin, Calendar, Clock, BarChart3, RefreshCw, Trophy, Check as CheckIcon } from 'lucide-react';

interface LevelProgressionProps {
  onCancel?: () => void;
}

interface Level {
  level: number;
  name: string;
  xpRequired: number;
  benefits: string[];
  icon: string;
  color: string;
}

export default function LevelProgression({ onCancel }: LevelProgressionProps) {
  const [currentXP, setCurrentXP] = useState(45000);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [showPerks, setShowPerks] = useState(false);

  const levels: Level[] = [
    {
      level: 1,
      name: 'Newcomer',
      xpRequired: 0,
      benefits: ['Basic memory creation', 'Photo upload', 'Map view'],
      icon: 'seedling',
      color: 'from-green-400 to-emerald-500',
    },
    {
      level: 2,
      name: 'Explorer',
      xpRequired: 1000,
      benefits: ['All Newcomer benefits', 'Unlimited memories', 'Custom tags', 'Basic stats'],
      icon: 'compass',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      level: 3,
      name: 'Adventurer',
      xpRequired: 3200,
      benefits: ['All Explorer benefits', 'Advanced search', 'Sharing features', 'Priority support'],
      icon: 'mapPin',
      color: 'from-purple-400 to-pink-500',
    },
    {
      level: 4,
      name: 'Storyteller',
      xpRequired: 6840,
      benefits: ['All Adventurer benefits', 'Rich text editing', 'Audio recordings', 'Video uploads'],
      icon: 'sparkles',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      level: 5,
      name: 'Collector',
      xpRequired: 12208,
      benefits: ['All Storyteller benefits', 'Bulk operations', 'Advanced filters', 'Export options'],
      icon: 'gem',
      color: 'from-pink-400 to-rose-500',
    },
    {
      level: 6,
      name: 'Champion',
      xpRequired: 19650,
      benefits: ['All Collector benefits', 'Custom themes', 'Badge system', 'XP multipliers'],
      icon: 'award',
      color: 'from-amber-400 to-yellow-500',
    },
    {
      level: 7,
      name: 'Legend',
      xpRequired: 29580,
      benefits: ['All Champion benefits', 'Leaderboard access', 'Monthly challenges', 'Exclusive rewards'],
      icon: 'crown',
      color: 'from-violet-400 to-purple-500',
    },
    {
      level: 8,
      name: 'Master',
      xpRequired: 43496,
      benefits: ['All Legend benefits', 'Advanced analytics', 'API access', 'Collaboration tools'],
      icon: 'wand2',
      color: 'from-indigo-400 to-blue-500',
    },
    {
      level: 9,
      name: 'Grandmaster',
      xpRequired: 62195,
      benefits: ['All Master benefits', 'White-glove support', 'Early access features', 'Beta programs'],
      icon: 'star',
      color: 'from-slate-400 to-gray-500',
    },
    {
      level: 10,
      name: 'Memory Legend',
      xpRequired: 86634,
      benefits: ['All Grandmaster benefits', 'Lifetime premium', 'Custom features', 'VIP events'],
      icon: 'trophy',
      color: 'from-yellow-400 to-amber-500',
    },
  ];

  const getLevelIcon = (icon: string) => {
    switch (icon) {
      case 'seedling': return <Sparkles className="h-5 w-5" />;
      case 'compass': return <MapPin className="h-5 w-5" />;
      case 'mapPin': return <MapPin className="h-5 w-5" />;
      case 'sparkles': return <Sparkles className="h-5 w-5" />;
      case 'gem': return <Gem className="h-5 w-5" />;
      case 'award': return <Award className="h-5 w-5" />;
      case 'crown': return <Crown className="h-5 w-5" />;
      case 'wand2': return <Wand2 className="h-5 w-5" />;
      case 'star': return <Star className="h-5 w-5" />;
      case 'trophy': return <Trophy className="h-5 w-5" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  const calculateCurrentLevel = (xp: number) => {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (xp >= levels[i].xpRequired) {
        return levels[i];
      }
    }
    return levels[0];
  };

  const calculateNextLevel = (xp: number) => {
    const current = calculateCurrentLevel(xp);
    const currentIndex = levels.findIndex(l => l.level === current.level);
    if (currentIndex < levels.length - 1) {
      return levels[currentIndex + 1];
    }
    return null;
  };

  const currentLevel = calculateCurrentLevel(currentXP);
  const nextLevel = calculateNextLevel(currentXP);
  const progressToNext = nextLevel
    ? ((currentXP - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100
    : 100;
  const xpToNext = nextLevel ? nextLevel.xpRequired - currentXP : 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl">
            <Crown className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Level Progression
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              From Newcomer to Memory Legend
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPerks(!showPerks)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show perks"
          >
            {showPerks ? <BarChart3 className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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
        <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 bg-gradient-to-br ${currentLevel.color} rounded-xl text-white`}>
                {getLevelIcon(currentLevel.icon)}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-2xl">Level {currentLevel.level}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{currentLevel.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{currentXP.toLocaleString()}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total XP</p>
            </div>
          </div>
          {nextLevel && (
            <>
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3 mb-2">
                <div
                  className="bg-gradient-to-r from-amber-400 to-yellow-500 h-3 rounded-full transition-all"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{Math.round(progressToNext)}% to Level {nextLevel.level}</span>
                <span>{xpToNext.toLocaleString()} XP needed</span>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Current Level</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{currentLevel.level}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Levels Unlocked</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{currentLevel.level}/10</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">XP to Next</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{xpToNext.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Progress</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{Math.round(progressToNext)}%</p>
          </div>
        </div>

        {showPerks && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Current Level Benefits</h4>
            <ul className="space-y-2">
              {currentLevel.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckIcon className="h-4 w-4 text-green-500" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Level Progression Path</h4>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {levels.map((level) => (
              <div
                key={level.level}
                onClick={() => setSelectedLevel(level)}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${level.level === currentLevel.level ? 'border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20' : level.level < currentLevel.level ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30 opacity-60'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-gradient-to-br ${level.color} rounded-lg text-white ${level.level > currentLevel.level ? 'grayscale' : ''}`}>
                    {getLevelIcon(level.icon)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">Level {level.level}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{level.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {level.level < currentLevel.level && (
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <CheckIcon className="h-3 w-3" />
                      <span>Unlocked</span>
                    </div>
                  )}
                  {level.level === currentLevel.level && (
                    <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                      <Flame className="h-3 w-3" />
                      <span>Current</span>
                    </div>
                  )}
                  {level.level > currentLevel.level && (
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400">{level.xpRequired.toLocaleString()} XP</p>
                    </div>
                  )}
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedLevel && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-900 dark:text-white text-lg">Level Details</h4>
                <button
                  type="button"
                  onClick={() => setSelectedLevel(null)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
              <div className="flex flex-col items-center text-center mb-4">
                <div className={`p-4 bg-gradient-to-br ${selectedLevel.color} rounded-xl mb-3 ${selectedLevel.level > currentLevel.level ? 'grayscale' : ''}`}>
                  {getLevelIcon(selectedLevel.icon)}
                </div>
                <h5 className="font-bold text-slate-900 dark:text-white text-xl mb-1">Level {selectedLevel.level}</h5>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{selectedLevel.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedLevel.xpRequired.toLocaleString()} XP required</p>
              </div>
              <div className="mb-4">
                <h6 className="font-semibold text-slate-900 dark:text-white text-sm mb-2">Benefits</h6>
                <ul className="space-y-1">
                  {selectedLevel.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              {selectedLevel.level > currentLevel.level && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    {(selectedLevel.xpRequired - currentXP).toLocaleString()} XP more to unlock this level
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Tips to Level Up Faster
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Create memories daily to build streak bonus</li>
            <li>• Complete challenges for bonus XP</li>
            <li>• Share and engage with the community</li>
            <li>• Unlock badges for milestone XP rewards</li>
            <li>• Participate in seasonal events for extra XP</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
