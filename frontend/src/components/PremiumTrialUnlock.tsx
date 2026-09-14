'use client';

import { useState } from 'react';
import { Crown, X, Lock, Unlock, Check, Star, Zap, Award, TrendingUp, Calendar, Clock, Gift, Sparkles, Flame, Target, Trophy, Coins, Shield, Sword, Gem, Eye, EyeOff, ChevronDown, ChevronUp, RefreshCw, Users, Pen, Camera } from 'lucide-react';

interface PremiumTrialUnlockProps {
  onCancel?: () => void;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  trialDays: number;
  category: 'exploration' | 'creativity' | 'consistency' | 'social';
}

export default function PremiumTrialUnlock({ onCancel }: PremiumTrialUnlockProps) {
  const [showLocked, setShowLocked] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'trial-desc' | 'trial-asc' | 'progress'>('trial-desc');
  const [totalTrialDays, setTotalTrialDays] = useState(30);
  const [usedTrialDays, setUsedTrialDays] = useState(14);
  const [availableTrialDays, setAvailableTrialDays] = useState(16);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      name: 'Memory Pioneer',
      description: 'Create your first 50 memories',
      icon: 'star',
      progress: 50,
      maxProgress: 50,
      completed: true,
      trialDays: 7,
      category: 'exploration',
    },
    {
      id: '2',
      name: 'Globe Trotter',
      description: 'Add memories from 20 different countries',
      icon: 'target',
      progress: 15,
      maxProgress: 20,
      completed: false,
      trialDays: 14,
      category: 'exploration',
    },
    {
      id: '3',
      name: 'Storyteller',
      description: 'Write 25,000 words in memory descriptions',
      icon: 'pen',
      progress: 18000,
      maxProgress: 25000,
      completed: false,
      trialDays: 10,
      category: 'creativity',
    },
    {
      id: '4',
      name: 'Consistency King',
      description: 'Maintain a 60-day streak',
      icon: 'flame',
      progress: 45,
      maxProgress: 60,
      completed: false,
      trialDays: 30,
      category: 'consistency',
    },
    {
      id: '5',
      name: 'Social Butterfly',
      description: 'Share 50 memories with friends',
      icon: 'users',
      progress: 35,
      maxProgress: 50,
      completed: false,
      trialDays: 7,
      category: 'social',
    },
    {
      id: '6',
      name: 'Photo Master',
      description: 'Upload 200 photos to memories',
      icon: 'camera',
      progress: 150,
      maxProgress: 200,
      completed: false,
      trialDays: 10,
      category: 'creativity',
    },
    {
      id: '7',
      name: 'Memory Guardian',
      description: 'Complete 100 achievements',
      icon: 'trophy',
      progress: 85,
      maxProgress: 100,
      completed: false,
      trialDays: 21,
      category: 'consistency',
    },
    {
      id: '8',
      name: 'Community Leader',
      description: 'Help 10 new users get started',
      icon: 'shield',
      progress: 7,
      maxProgress: 10,
      completed: false,
      trialDays: 14,
      category: 'social',
    },
  ]);

  const handleUnlock = (achievement: Achievement) => {
    if (achievement.completed && achievement.trialDays > 0) {
      setUsedTrialDays(usedTrialDays + achievement.trialDays);
      setAvailableTrialDays(availableTrialDays - achievement.trialDays);
      setAchievements(achievements.map(a => 
        a.id === achievement.id ? { ...a, trialDays: 0 } : a
      ));
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (!showLocked && !achievement.completed) return false;
    if (selectedCategory === 'all') return true;
    return achievement.category === selectedCategory;
  });

  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (sortBy === 'trial-desc') return b.trialDays - a.trialDays;
    if (sortBy === 'trial-asc') return a.trialDays - b.trialDays;
    if (sortBy === 'progress') return (b.progress / b.maxProgress) - (a.progress / a.maxProgress);
    return 0;
  });

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'star': return <Star className="h-6 w-6" />;
      case 'target': return <Target className="h-6 w-6" />;
      case 'pen': return <Pen className="h-6 w-6" />;
      case 'flame': return <Flame className="h-6 w-6" />;
      case 'users': return <Users className="h-6 w-6" />;
      case 'camera': return <Camera className="h-6 w-6" />;
      case 'trophy': return <Trophy className="h-6 w-6" />;
      case 'shield': return <Shield className="h-6 w-6" />;
      default: return <Award className="h-6 w-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'exploration': return 'from-blue-400 to-blue-500';
      case 'creativity': return 'from-purple-400 to-purple-500';
      case 'consistency': return 'from-orange-400 to-orange-500';
      case 'social': return 'from-green-400 to-green-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Crown className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Premium Trial Unlock
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Earn premium trial days through achievements
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
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Available Days</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">{availableTrialDays}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Used Days</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{usedTrialDays}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Earned</p>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{totalTrialDays}</p>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                Premium Trial Progress
              </h4>
            </div>
            <span className="text-xs text-purple-600 dark:text-purple-400">
              {usedTrialDays}/{totalTrialDays} days used
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${(usedTrialDays / totalTrialDays) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {availableTrialDays} days remaining
          </p>
        </div>

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
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="trial-desc">Trial Days: High to Low</option>
            <option value="trial-asc">Trial Days: Low to High</option>
            <option value="progress">Progress</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sortedAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                achievement.completed && achievement.trialDays > 0
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600'
                  : achievement.completed
                  ? 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600'
                  : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-3 rounded-full bg-gradient-to-br ${getCategoryColor(achievement.category)} text-white`}>
                  {getIcon(achievement.icon)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                      {achievement.name}
                    </h4>
                    {achievement.completed && achievement.trialDays > 0 && (
                      <button
                        type="button"
                        onClick={() => handleUnlock(achievement)}
                        className="px-2 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Claim
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    {achievement.description}
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 mr-2">
                      <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${achievement.completed ? 'bg-green-500' : 'bg-slate-500'}`}
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${
                      achievement.completed && achievement.trialDays > 0
                        ? 'text-green-600 dark:text-green-400'
                        : achievement.completed
                        ? 'text-slate-400 dark:text-slate-500'
                        : 'text-purple-600 dark:text-purple-400'
                    }`}>
                      {achievement.completed && achievement.trialDays === 0 ? 'Claimed' : achievement.completed ? `+${achievement.trialDays} days` : `${achievement.trialDays} days`}
                    </span>
                    {achievement.completed && achievement.trialDays === 0 && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Premium Features
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Unlimited memories and storage</li>
            <li>• Advanced AI features and insights</li>
            <li>• Premium themes and stickers</li>
            <li>• Priority support and early access</li>
            <li>• No ads and enhanced privacy</li>
          </ul>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Tips to Earn More Trial Days
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Focus on consistency achievements for the biggest rewards</li>
            <li>• Combine multiple achievements to maximize trial days</li>
            <li>• Check back regularly for new achievement opportunities</li>
            <li>• Complete daily challenges to build progress over time</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
