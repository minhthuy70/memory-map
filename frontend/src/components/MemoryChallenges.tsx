'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  Calendar,
  CheckCircle,
  CheckCircle2,
  Clock,
  Filter,
  Play,
  Settings,
  Star,
  Target,
  Trophy,
  Users,
  Zap
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  target: number;
  progress: number;
  reward: string;
  participants: number;
  status: 'active' | 'completed' | 'expired';
  startDate: Date;
  endDate: Date;
}

interface UserProgress {
  userId: string;
  userName: string;
  challengeId: string;
  progress: number;
  completedAt: Date | null;
}

interface MemoryChallengesProps {
  onCancel?: () => void;
  onJoinChallenge?: (challengeId: string) => Promise<void>;
}

const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: 'challenge-1',
    title: '30-Day Memory Streak',
    description: 'Create a memory every day for 30 days',
    type: 'monthly',
    target: 30,
    progress: 25,
    reward: 'Gold Badge',
    participants: 156,
    status: 'active',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-30'),
  },
  {
    id: 'challenge-2',
    title: 'Weekly Photo Challenge',
    description: 'Share 7 photos this week',
    type: 'weekly',
    target: 7,
    progress: 5,
    reward: '500 points',
    participants: 89,
    status: 'active',
    startDate: new Date('2024-01-07'),
    endDate: new Date('2024-01-13'),
  },
  {
    id: 'challenge-3',
    title: 'Memory Diversity',
    description: 'Create memories in 10 different categories',
    type: 'monthly',
    target: 10,
    progress: 10,
    reward: 'Diamond Badge',
    participants: 203,
    status: 'completed',
    startDate: new Date('2023-12-01'),
    endDate: new Date('2023-12-31'),
  },
];

const DEFAULT_USER_PROGRESS: UserProgress[] = [
  {
    userId: 'user-1',
    userName: 'You',
    challengeId: 'challenge-1',
    progress: 25,
    completedAt: null,
  },
  {
    userId: 'user-2',
    userName: 'John Doe',
    challengeId: 'challenge-1',
    progress: 28,
    completedAt: null,
  },
  {
    userId: 'user-3',
    userName: 'Jane Smith',
    challengeId: 'challenge-1',
    progress: 30,
    completedAt: new Date('2024-01-28'),
  },
];

export default function MemoryChallenges({ onCancel, onJoinChallenge }: MemoryChallengesProps) {
  const [challenges, setChallenges] = useState<Challenge[]>(DEFAULT_CHALLENGES);
  const [userProgress, setUserProgress] = useState<UserProgress[]>(DEFAULT_USER_PROGRESS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showLeaderboard, setShowLeaderboard] = useState(true);

  const activeChallenges = challenges.filter(c => c.status === 'active').length;
  const completedChallenges = challenges.filter(c => c.status === 'completed').length;
  const totalParticipants = challenges.reduce((sum, c) => sum + c.participants, 0);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily':
        return 'text-blue-500';
      case 'weekly':
        return 'text-green-500';
      case 'monthly':
        return 'text-purple-500';
      case 'special':
        return 'text-orange-500';
      default:
        return 'text-slate-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'completed':
        return 'text-blue-500';
      case 'expired':
        return 'text-slate-500';
      default:
        return 'text-slate-500';
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    await onJoinChallenge?.(challengeId);
  };

  const filteredChallenges = challenges.filter(c => 
    selectedType === 'all' || c.type === selectedType
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Thử thách kỷ niệm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {challenges.length} challenges
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
        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt challenges
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show leaderboard
              </span>
              <button
                type="button"
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  showLeaderboard ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    showLeaderboard ? 'translate-x-5' : ''
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
                Reward notifications
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
            {activeChallenges}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Award className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Completed</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {completedChallenges}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Participants</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalParticipants}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Rewards</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {challenges.length}
          </div>
        </div>
      </div>

      {/* Type Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedType('all')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'all'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('daily')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'daily'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Daily
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('weekly')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'weekly'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Weekly
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('monthly')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'monthly'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Challenges */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Available Challenges
        </h4>
        <div className="space-y-2">
          {filteredChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`p-4 rounded-lg border-2 ${
                challenge.status === 'active'
                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                  : challenge.status === 'completed'
                  ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-slate-500" />
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {challenge.title}
                    </span>
                    <div className={`text-xs ${getTypeColor(challenge.type)} capitalize`}>
                      {challenge.type}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-slate-500" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {challenge.participants}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {challenge.description}
              </p>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Target</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {challenge.target}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Progress</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {challenge.progress}/{challenge.target}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Reward</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {challenge.reward}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${challenge.status === 'completed' ? 'bg-blue-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
                    style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {((challenge.progress / challenge.target) * 100).toFixed(0)}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-400 mb-2">
                <div>Start: {challenge.startDate.toLocaleDateString('vi-VN')}</div>
                <div>End: {challenge.endDate.toLocaleDateString('vi-VN')}</div>
              </div>

              {challenge.status === 'active' && (
                <button
                  type="button"
                  onClick={() => handleJoinChallenge(challenge.id)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <Play className="h-3 w-3" />
                  Join Challenge
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      {showLeaderboard && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Leaderboard
          </h4>
          <div className="space-y-2">
            {userProgress.map((progress, index) => (
              <div
                key={progress.userId}
                className={`p-4 rounded-lg border-2 ${
                  index === 0
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                    : index === 1
                    ? 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600'
                    : index === 2
                    ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {progress.userName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-slate-500" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {progress.progress}/30
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                      style={{ width: `${(progress.progress / 30) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {((progress.progress / 30) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
        <p className="text-[10px] text-amber-700 dark:text-amber-400">
          <strong>Lưu ý:</strong> Thử thách kỷ niệm tạo các thử thách để khuyến khích người dùng tạo kỷ niệm mới với gamification, rewards, leaderboard, và social competition.
        </p>
      </div>
    </div>
  );
}