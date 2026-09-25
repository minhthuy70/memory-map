'use client';

import { useState } from 'react';
import { Map, X, CheckCircle, Circle, Calendar, Gift, RefreshCw, Award, Star, Flame, Trophy, Target, Sparkles, Users, Zap, ChevronRight, Info, BarChart3, Clock } from 'lucide-react';

interface WeeklyQuestsProps {
  onCancel?: () => void;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  tasks: string[];
  deadline: string;
}

export default function WeeklyQuests({ onCancel }: WeeklyQuestsProps) {
  const [currentWeek, setCurrentWeek] = useState('2026-W37');
  const [showStats, setShowStats] = useState(false);

  const [quests, setQuests] = useState<Quest[]>([
    {
      id: '1',
      title: 'Category Master',
      description: 'Complete memories in all 5 categories',
      icon: 'star',
      xpReward: 500,
      progress: 3,
      maxProgress: 5,
      completed: false,
      tasks: ['Travel memory', 'Photo memory', 'Social memory', 'Creative memory', 'Consistency memory'],
      deadline: '2026-09-20',
    },
    {
      id: '2',
      title: '7-Day Streak',
      description: 'Log memories for 7 consecutive days',
      icon: 'flame',
      xpReward: 700,
      progress: 5,
      maxProgress: 7,
      completed: false,
      tasks: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
      deadline: '2026-09-20',
    },
    {
      id: '3',
      title: 'Photo Collector',
      description: 'Add 20 photos to your memories',
      icon: 'sparkles',
      xpReward: 400,
      progress: 15,
      maxProgress: 20,
      completed: false,
      tasks: ['Add 20 photos'],
      deadline: '2026-09-20',
    },
    {
      id: '4',
      title: 'Social Explorer',
      description: 'Share 10 memories with friends',
      icon: 'users',
      xpReward: 300,
      progress: 8,
      maxProgress: 10,
      completed: false,
      tasks: ['Share 10 memories'],
      deadline: '2026-09-20',
    },
  ]);

  const getQuestIcon = (icon: string) => {
    switch (icon) {
      case 'star': return <Star className="h-5 w-5" />;
      case 'flame': return <Flame className="h-5 w-5" />;
      case 'sparkles': return <Sparkles className="h-5 w-5" />;
      case 'users': return <Users className="h-5 w-5" />;
      case 'map': return <Map className="h-5 w-5" />;
      case 'trophy': return <Trophy className="h-5 w-5" />;
      case 'target': return <Target className="h-5 w-5" />;
      default: return <Award className="h-5 w-5" />;
    }
  };

  const completedCount = quests.filter(q => q.completed).length;
  const totalCount = quests.length;
  const totalXP = quests.reduce((sum, q) => sum + (q.completed ? q.xpReward : 0), 0);
  const potentialXP = quests.reduce((sum, q) => sum + q.xpReward, 0);

  const handleCompleteQuest = (id: string) => {
    setQuests(quests.map(q => {
      if (q.id === id && !q.completed && q.progress >= q.maxProgress) {
        return { ...q, completed: true };
      }
      return q;
    }));
  };

  const daysRemaining = () => {
    const deadline = new Date('2026-09-20');
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <Map className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Weekly Quests
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete quests for big rewards
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
        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-slate-900 dark:text-white">{currentWeek}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
              <Clock className="h-3 w-3" />
              <span>{daysRemaining()} days remaining</span>
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full transition-all"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{completedCount}/{totalCount} quests completed</span>
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

        {showStats && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Weekly Progress</h4>
            <div className="space-y-2">
              {quests.map((quest) => (
                <div key={quest.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {quest.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-400" />
                    )}
                    <span className="text-sm text-slate-700 dark:text-slate-300">{quest.title}</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{quest.progress}/{quest.maxProgress}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">This Week's Quests</h4>
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
          </div>
          <div className="space-y-2">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className={`p-4 rounded-lg border-2 ${quest.completed ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg text-white ${quest.completed ? 'opacity-50' : ''}`}>
                      {getQuestIcon(quest.icon)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{quest.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{quest.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {quest.completed ? (
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span>Completed</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleCompleteQuest(quest.id)}
                        disabled={quest.progress < quest.maxProgress}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${quest.progress >= quest.maxProgress ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'}`}
                      >
                        Claim
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 mr-4">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{quest.progress}/{quest.maxProgress}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full transition-all"
                        style={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-purple-600 dark:text-purple-400">+{quest.xpReward}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">XP</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-600">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Tasks:</p>
                  <div className="flex flex-wrap gap-1">
                    {quest.tasks.map((task, index) => (
                      <span
                        key={index}
                        className={`text-xs px-2 py-0.5 rounded-full ${index < quest.progress ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}
                      >
                        {task}
                      </span>
                    ))}
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
              Quest Rewards
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Complete all quests: +{potentialXP} XP</li>
            <li>• Bonus: Special badge for 100% completion</li>
            <li>• Early completion: Extra 200 XP</li>
            <li>• 4-week streak: Legendary reward</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
