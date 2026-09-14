'use client';

import { useState } from 'react';
import { Calendar, X, CheckCircle, Circle, Award, RefreshCw, Star, Trophy, Target, MapPin, Camera, Sparkles, Flame, Gift, ChevronRight, Info, BarChart3, Clock, TrendingUp } from 'lucide-react';

interface MonthlyMilestonesProps {
  onCancel?: () => void;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  category: 'memories' | 'locations' | 'photos' | 'social' | 'streak';
}

export default function MonthlyMilestones({ onCancel }: MonthlyMilestonesProps) {
  const [currentMonth, setCurrentMonth] = useState('September 2026');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showStats, setShowStats] = useState(false);

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: '1',
      title: 'Memory Maker',
      description: 'Create 100 memories this month',
      icon: 'star',
      xpReward: 1000,
      progress: 67,
      maxProgress: 100,
      completed: false,
      category: 'memories',
    },
    {
      id: '2',
      title: 'World Traveler',
      description: 'Visit 10 different cities',
      icon: 'mapPin',
      xpReward: 800,
      progress: 7,
      maxProgress: 10,
      completed: false,
      category: 'locations',
    },
    {
      id: '3',
      title: 'Photo Pro',
      description: 'Add 50 photos to memories',
      icon: 'camera',
      xpReward: 600,
      progress: 42,
      maxProgress: 50,
      completed: false,
      category: 'photos',
    },
    {
      id: '4',
      title: 'Social Star',
      description: 'Share 30 memories with friends',
      icon: 'sparkles',
      xpReward: 500,
      progress: 25,
      maxProgress: 30,
      completed: false,
      category: 'social',
    },
    {
      id: '5',
      title: 'Consistency King',
      description: 'Maintain 20-day memory streak',
      icon: 'flame',
      xpReward: 700,
      progress: 15,
      maxProgress: 20,
      completed: false,
      category: 'streak',
    },
    {
      id: '6',
      title: 'Memory Master',
      description: 'Create 200 memories this month',
      icon: 'trophy',
      xpReward: 2000,
      progress: 67,
      maxProgress: 200,
      completed: false,
      category: 'memories',
    },
  ]);

  const getMilestoneIcon = (icon: string) => {
    switch (icon) {
      case 'star': return <Star className="h-5 w-5" />;
      case 'mapPin': return <MapPin className="h-5 w-5" />;
      case 'camera': return <Camera className="h-5 w-5" />;
      case 'sparkles': return <Sparkles className="h-5 w-5" />;
      case 'flame': return <Flame className="h-5 w-5" />;
      case 'trophy': return <Trophy className="h-5 w-5" />;
      case 'target': return <Target className="h-5 w-5" />;
      default: return <Award className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'memories': return 'from-purple-400 to-pink-500';
      case 'locations': return 'from-blue-400 to-cyan-500';
      case 'photos': return 'from-green-400 to-emerald-500';
      case 'social': return 'from-yellow-400 to-orange-500';
      case 'streak': return 'from-red-400 to-rose-500';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  const filteredMilestones = milestones.filter(m => {
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    return true;
  });

  const completedCount = milestones.filter(m => m.completed).length;
  const totalCount = milestones.length;
  const totalXP = milestones.reduce((sum, m) => sum + (m.completed ? m.xpReward : 0), 0);
  const potentialXP = milestones.reduce((sum, m) => sum + m.xpReward, 0);

  const handleCompleteMilestone = (id: string) => {
    setMilestones(milestones.map(m => {
      if (m.id === id && !m.completed && m.progress >= m.maxProgress) {
        return { ...m, completed: true };
      }
      return m;
    }));
  };

  const daysRemaining = () => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const diff = lastDay.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Monthly Milestones
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Achieve monthly goals for rewards
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
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold text-slate-900 dark:text-white">{currentMonth}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
              <Clock className="h-3 w-3" />
              <span>{daysRemaining()} days remaining</span>
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{completedCount}/{totalCount} milestones completed</span>
            <span>{Math.round((completedCount / totalCount) * 100)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Completed</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{completedCount}/{totalCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">XP Earned</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{totalXP}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Potential XP</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{potentialXP}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Days Left</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{daysRemaining()}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Categories</option>
            <option value="memories">Memories</option>
            <option value="locations">Locations</option>
            <option value="photos">Photos</option>
            <option value="social">Social</option>
            <option value="streak">Streak</option>
          </select>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        {showStats && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Monthly Progress by Category</h4>
            <div className="space-y-2">
              {['memories', 'locations', 'photos', 'social', 'streak'].map((category) => {
                const categoryMilestones = milestones.filter(m => m.category === category);
                const categoryCompleted = categoryMilestones.filter(m => m.completed).length;
                const categoryTotal = categoryMilestones.length;
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getCategoryColor(category)}`} />
                      <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">{category}</span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{categoryCompleted}/{categoryTotal}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">This Month's Milestones</h4>
          <div className="space-y-2">
            {filteredMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`p-4 rounded-lg border-2 ${milestone.completed ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-gradient-to-br ${getCategoryColor(milestone.category)} rounded-lg text-white ${milestone.completed ? 'opacity-50' : ''}`}>
                      {getMilestoneIcon(milestone.icon)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{milestone.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 capitalize">
                      {milestone.category}
                    </span>
                    {milestone.completed ? (
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span>Completed</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleCompleteMilestone(milestone.id)}
                        disabled={milestone.progress < milestone.maxProgress}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${milestone.progress >= milestone.maxProgress ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'}`}
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
                      <span>{milestone.progress}/{milestone.maxProgress}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${getCategoryColor(milestone.category)} h-2 rounded-full transition-all`}
                        style={{ width: `${(milestone.progress / milestone.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-purple-600 dark:text-purple-400">+{milestone.xpReward}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">XP</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Milestone Rewards
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Complete all milestones: +{potentialXP} XP</li>
            <li>• 100% completion: Exclusive badge</li>
            <li>• Early completion: +500 XP bonus</li>
            <li>• 3-month streak: Legendary reward</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
