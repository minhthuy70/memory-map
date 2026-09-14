'use client';

import { useState } from 'react';
import { Target, X, CheckCircle, Circle, Clock, Flame, Gift, RefreshCw, Star, Award, Calendar, Sparkles, Trophy, Zap, MapPin, Camera, Heart, MessageSquare, Share2, ChevronRight, Info, BarChart3 } from 'lucide-react';

interface DailyChallengesProps {
  onCancel?: () => void;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  streakBonus: number;
}

export default function DailyChallenges({ onCancel }: DailyChallengesProps) {
  const [currentStreak, setCurrentStreak] = useState(7);
  const [showStats, setShowStats] = useState(false);

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Create a Memory',
      description: 'Create at least 1 new memory today',
      icon: 'plus',
      xpReward: 100,
      progress: 1,
      maxProgress: 1,
      completed: true,
      difficulty: 'easy',
      streakBonus: 1.5,
    },
    {
      id: '2',
      title: 'Photo Upload',
      description: 'Add at least 3 photos to memories',
      icon: 'camera',
      xpReward: 150,
      progress: 2,
      maxProgress: 3,
      completed: false,
      difficulty: 'easy',
      streakBonus: 1.5,
    },
    {
      id: '3',
      title: 'New Location',
      description: 'Check in at a new location',
      icon: 'mapPin',
      xpReward: 200,
      progress: 0,
      maxProgress: 1,
      completed: false,
      difficulty: 'medium',
      streakBonus: 1.5,
    },
    {
      id: '4',
      title: 'Social Butterfly',
      description: 'Share 2 memories with friends',
      icon: 'share2',
      xpReward: 100,
      progress: 1,
      maxProgress: 2,
      completed: false,
      difficulty: 'easy',
      streakBonus: 1.5,
    },
    {
      id: '5',
      title: 'Memory Writer',
      description: 'Write 100 words in memory descriptions',
      icon: 'sparkles',
      xpReward: 150,
      progress: 65,
      maxProgress: 100,
      completed: false,
      difficulty: 'medium',
      streakBonus: 1.5,
    },
  ]);

  const getChallengeIcon = (icon: string) => {
    switch (icon) {
      case 'plus': return <Target className="h-5 w-5" />;
      case 'camera': return <Camera className="h-5 w-5" />;
      case 'mapPin': return <MapPin className="h-5 w-5" />;
      case 'share2': return <Share2 className="h-5 w-5" />;
      case 'sparkles': return <Sparkles className="h-5 w-5" />;
      case 'heart': return <Heart className="h-5 w-5" />;
      case 'message': return <MessageSquare className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-400 to-emerald-500';
      case 'medium': return 'from-yellow-400 to-orange-500';
      case 'hard': return 'from-red-400 to-rose-500';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  const getDifficultyBorder = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'border-green-300 dark:border-green-600';
      case 'medium': return 'border-yellow-300 dark:border-yellow-600';
      case 'hard': return 'border-red-300 dark:border-red-600';
      default: return 'border-slate-300 dark:border-slate-600';
    }
  };

  const completedCount = challenges.filter(c => c.completed).length;
  const totalCount = challenges.length;
  const totalXP = challenges.reduce((sum, c) => sum + (c.completed ? c.xpReward : 0), 0);
  const potentialXP = challenges.reduce((sum, c) => sum + c.xpReward, 0);

  const handleCompleteChallenge = (id: string) => {
    setChallenges(challenges.map(c => {
      if (c.id === id && !c.completed && c.progress >= c.maxProgress) {
        return { ...c, completed: true };
      }
      return c;
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Daily Challenges
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete challenges to earn XP
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowStats(!showStats)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show stats"
          >
            {showStats ? <BarChart3 className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Completed</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{completedCount}/{totalCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Current Streak</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{currentStreak} days</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">XP Earned</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{totalXP}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Streak Bonus</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">x1.5</p>
          </div>
        </div>

        {showStats && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">This Week's Progress</h4>
            <div className="grid grid-cols-7 gap-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={day} className="text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{day}</p>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${index < 5 ? 'bg-green-500 text-white' : index === 5 ? 'bg-green-200 dark:bg-green-800 text-green-600 dark:text-green-400' : 'bg-slate-200 dark:bg-slate-600 text-slate-400'}`}>
                    {index < 5 ? <CheckCircle className="h-4 w-4" /> : index === 5 ? <Circle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Today's Challenges</h4>
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
          </div>
          <div className="space-y-2">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`p-4 rounded-lg border-2 ${getDifficultyBorder(challenge.difficulty)} ${challenge.completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-white dark:bg-slate-800'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-gradient-to-br ${getDifficultyColor(challenge.difficulty)} rounded-lg text-white ${challenge.completed ? 'opacity-50' : ''}`}>
                      {getChallengeIcon(challenge.icon)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{challenge.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{challenge.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                      <Flame className="h-3 w-3" />
                      <span>x{challenge.streakBonus}</span>
                    </div>
                    {challenge.completed ? (
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span>Completed</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleCompleteChallenge(challenge.id)}
                        disabled={challenge.progress < challenge.maxProgress}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${challenge.progress >= challenge.maxProgress ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'}`}
                      >
                        Claim
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{challenge.progress}/{challenge.maxProgress}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} h-2 rounded-full transition-all`}
                        style={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-purple-600 dark:text-purple-400">+{challenge.xpReward}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">XP</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Challenge Rewards
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Complete all challenges: +{potentialXP} XP</li>
            <li>• Maintain streak: +50% XP bonus</li>
            <li>• 7-day streak: Special badge</li>
            <li>• 30-day streak: Legendary reward</li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Time Remaining
            </h4>
          </div>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            Challenges reset in 12 hours 34 minutes
          </p>
        </div>
      </div>
    </div>
  );
}
