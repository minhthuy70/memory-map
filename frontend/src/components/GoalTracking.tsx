'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Pause,
  Play,
  Plus,
  Settings,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  type: 'memory_count' | 'diversity' | 'location' | 'category' | 'streak';
  target: number;
  current: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  status: 'active' | 'completed' | 'paused';
  deadline: Date;
  createdAt: Date;
  progress: number;
}

interface Milestone {
  id: string;
  goalId: string;
  name: string;
  value: number;
  achieved: boolean;
  achievedAt: Date | null;
}

interface GoalTrackingProps {
  onCancel?: () => void;
  onCreateGoal?: () => Promise<void>;
}

const DEFAULT_GOALS: Goal[] = [
  {
    id: 'goal-1',
    name: 'Create 100 memories this month',
    type: 'memory_count',
    target: 100,
    current: 75,
    period: 'monthly',
    status: 'active',
    deadline: new Date('2024-01-31'),
    createdAt: new Date('2024-01-01'),
    progress: 0.75,
  },
  {
    id: 'goal-2',
    name: 'Visit 5 new locations',
    type: 'location',
    target: 5,
    current: 3,
    period: 'monthly',
    status: 'active',
    deadline: new Date('2024-01-31'),
    createdAt: new Date('2024-01-01'),
    progress: 0.6,
  },
  {
    id: 'goal-3',
    name: '30-day memory streak',
    type: 'streak',
    target: 30,
    current: 25,
    period: 'daily',
    status: 'active',
    deadline: new Date('2024-01-30'),
    createdAt: new Date('2024-01-01'),
    progress: 0.83,
  },
  {
    id: 'goal-4',
    name: 'Diversify categories',
    type: 'diversity',
    target: 10,
    current: 10,
    period: 'yearly',
    status: 'completed',
    deadline: new Date('2024-12-31'),
    createdAt: new Date('2024-01-01'),
    progress: 1.0,
  },
];

const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 'ms-1',
    goalId: 'goal-1',
    name: '25 memories',
    value: 25,
    achieved: true,
    achievedAt: new Date('2024-01-08'),
  },
  {
    id: 'ms-2',
    goalId: 'goal-1',
    name: '50 memories',
    value: 50,
    achieved: true,
    achievedAt: new Date('2024-01-15'),
  },
  {
    id: 'ms-3',
    goalId: 'goal-1',
    name: '75 memories',
    value: 75,
    achieved: true,
    achievedAt: new Date('2024-01-22'),
  },
  {
    id: 'ms-4',
    goalId: 'goal-1',
    name: '100 memories',
    value: 100,
    achieved: false,
    achievedAt: null,
  },
];

export default function GoalTracking({ onCancel, onCreateGoal }: GoalTrackingProps) {
  const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);
  const [milestones, setMilestones] = useState<Milestone[]>(DEFAULT_MILESTONES);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(true);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'memory_count':
        return <Activity className="h-4 w-4" />;
      case 'diversity':
        return <BarChart3 className="h-4 w-4" />;
      case 'location':
        return <Target className="h-4 w-4" />;
      case 'category':
        return <Filter className="h-4 w-4" />;
      case 'streak':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'memory_count':
        return 'text-blue-500';
      case 'diversity':
        return 'text-purple-500';
      case 'location':
        return 'text-green-500';
      case 'category':
        return 'text-orange-500';
      case 'streak':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'paused':
        return 'text-yellow-500';
      default:
        return 'text-blue-500';
    }
  };

  const handleToggleStatus = (id: string) => {
    setGoals(goals.map(g => 
      g.id === id 
        ? { ...g, status: g.status === 'active' ? 'paused' as const : 'active' as const }
        : g
    ));
  };

  const filteredGoals = goals.filter(g => {
    const typeMatch = selectedType === 'all' || g.type === selectedType;
    const periodMatch = selectedPeriod === 'all' || g.period === selectedPeriod;
    const completedMatch = showCompleted || g.status !== 'completed';
    return typeMatch && periodMatch && completedMatch;
  });

  const activeGoals = goals.filter(g => g.status === 'active').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const avgProgress = goals.reduce((sum, g) => sum + g.progress, 0) / goals.length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Theo dõi mục tiêu
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {goals.length} goals
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Cài đặt"
          >
            <Settings className="h-4 w-4 text-slate-500" />
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

      {showSettings && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt goal tracking
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show completed
              </span>
              <button
                type="button"
                onClick={() => setShowCompleted(!showCompleted)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  showCompleted ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    showCompleted ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-reminders
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Milestone tracking
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Active</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {activeGoals}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Award className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Completed</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {completedGoals}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Progress</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(avgProgress * 100).toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Milestones</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {milestones.length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            >
              <option value="all">All Types</option>
              <option value="memory_count">Memory Count</option>
              <option value="diversity">Diversity</option>
              <option value="location">Location</option>
              <option value="category">Category</option>
              <option value="streak">Streak</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            >
              <option value="all">All Periods</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Goals
        </h4>
        <div className="space-y-2">
          {filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className={`p-4 rounded-lg border-2 ${
                goal.status === 'completed'
                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                  : goal.status === 'paused'
                  ? 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getTypeColor(goal.type)}`}>
                    {getTypeIcon(goal.type)}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {goal.name}
                    </span>
                    <div className={`text-xs ${getStatusColor(goal.status)} capitalize`}>
                      {goal.status}
                    </div>
                  </div>
                </div>
                {goal.status === 'active' ? (
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(goal.id)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                    title="Pause"
                  >
                    <Pause className="h-3 w-3 text-slate-500" />
                  </button>
                ) : goal.status === 'paused' ? (
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(goal.id)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                    title="Resume"
                  >
                    <Play className="h-3 w-3 text-slate-500" />
                  </button>
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Progress</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {goal.current} / {goal.target}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Period</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 capitalize">
                    {goal.period}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Deadline</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {goal.deadline.toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${goal.status === 'completed' ? 'bg-green-500' : 'bg-gradient-to-r from-green-400 to-emerald-500'}`}
                    style={{ width: `${goal.progress * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {(goal.progress * 100).toFixed(0)}%
                </span>
              </div>

              {/* Milestones */}
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">Milestones</div>
                <div className="flex flex-wrap gap-1">
                  {milestones.filter(m => m.goalId === goal.id).map((ms) => (
                    <span
                      key={ms.id}
                      className={`px-2 py-1 text-[10px] rounded-full ${
                        ms.achieved
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {ms.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create New Goal Button */}
      <button
        type="button"
        onClick={onCreateGoal}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        <Plus className="h-4 w-4" />
        Create New Goal
      </button>

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-[10px] text-green-700 dark:text-green-400">
          <strong>Lưu ý:</strong> Theo dõi mục tiêu cho phép đặt và theo dõi mục tiêu tạo kỷ niệm với progress tracking, milestones, status management, và period-based goals.
        </p>
      </div>
    </div>
  );
}