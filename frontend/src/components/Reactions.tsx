'use client';

import { useState } from 'react';
import { Heart, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Users, ThumbsUp, Laugh, Frown, Angry, Smile, Meh, Eye, Sparkles } from 'lucide-react';

interface Reaction {
  id: string;
  type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
  emoji: string;
  count: number;
  userReacted: boolean;
}

interface MemoryReaction {
  memoryId: string;
  memoryTitle: string;
  reactions: Reaction[];
  totalReactions: number;
  lastReacted: Date;
}

interface ReactionNotification {
  id: string;
  type: 'new_reaction' | 'reaction_removed';
  user: string;
  memory: string;
  reactionType: string;
  timestamp: Date;
}

interface ReactionsProps {
  onCancel?: () => void;
  onAddReaction?: (memoryId: string, type: string) => Promise<void>;
  onRemoveReaction?: (memoryId: string, type: string) => Promise<void>;
}

const DEFAULT_REACTIONS: Reaction[] = [
  { id: 'react-1', type: 'like', emoji: '👍', count: 25, userReacted: true },
  { id: 'react-2', type: 'love', emoji: '❤️', count: 18, userReacted: false },
  { id: 'react-3', type: 'laugh', emoji: '😂', count: 12, userReacted: false },
  { id: 'react-4', type: 'wow', emoji: '😮', count: 8, userReacted: false },
  { id: 'react-5', type: 'sad', emoji: '😢', count: 3, userReacted: false },
  { id: 'react-6', type: 'angry', emoji: '😠', count: 1, userReacted: false },
];

const DEFAULT_MEMORY_REACTIONS: MemoryReaction[] = [
  {
    memoryId: 'mem-1',
    memoryTitle: 'Family Vacation 2024',
    reactions: [
      { id: 'react-1', type: 'like', emoji: '👍', count: 25, userReacted: true },
      { id: 'react-2', type: 'love', emoji: '❤️', count: 18, userReacted: false },
    ],
    totalReactions: 43,
    lastReacted: new Date('2024-01-12'),
  },
  {
    memoryId: 'mem-2',
    memoryTitle: 'Birthday Party',
    reactions: [
      { id: 'react-2', type: 'love', emoji: '❤️', count: 30, userReacted: true },
      { id: 'react-3', type: 'laugh', emoji: '😂', count: 15, userReacted: false },
    ],
    totalReactions: 45,
    lastReacted: new Date('2024-01-10'),
  },
];

const DEFAULT_NOTIFICATIONS: ReactionNotification[] = [
  {
    id: 'notif-1',
    type: 'new_reaction',
    user: 'Mom',
    memory: 'Family Vacation 2024',
    reactionType: 'love',
    timestamp: new Date('2024-01-12'),
  },
  {
    id: 'notif-2',
    type: 'new_reaction',
    user: 'Tom',
    memory: 'Birthday Party',
    reactionType: 'laugh',
    timestamp: new Date('2024-01-10'),
  },
];

export default function Reactions({ onCancel, onAddReaction, onRemoveReaction }: ReactionsProps) {
  const [reactions, setReactions] = useState<Reaction[]>(DEFAULT_REACTIONS);
  const [memoryReactions, setMemoryReactions] = useState<MemoryReaction[]>(DEFAULT_MEMORY_REACTIONS);
  const [notifications, setNotifications] = useState<ReactionNotification[]>(DEFAULT_NOTIFICATIONS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState('mem-1');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [reactionSummary, setReactionSummary] = useState(true);

  const totalReactions = reactions.reduce((sum, r) => sum + r.count, 0);
  const userReactions = reactions.filter(r => r.userReacted).length;
  const totalNotifications = notifications.length;

  const handleAddReaction = async (type: string) => {
    await onAddReaction?.(selectedMemory, type);
    setReactions(reactions.map(r => 
      r.type === type ? { ...r, count: r.count + 1, userReacted: true } : r
    ));
  };

  const handleRemoveReaction = async (type: string) => {
    await onRemoveReaction?.(selectedMemory, type);
    setReactions(reactions.map(r => 
      r.type === type ? { ...r, count: Math.max(0, r.count - 1), userReacted: false } : r
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <ThumbsUp className="h-4 w-4" />;
      case 'love':
        return <Heart className="h-4 w-4" />;
      case 'laugh':
        return <Laugh className="h-4 w-4" />;
      case 'wow':
        return <Sparkles className="h-4 w-4" />;
      case 'sad':
        return <Frown className="h-4 w-4" />;
      case 'angry':
        return <Angry className="h-4 w-4" />;
      default:
        return <Smile className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'like':
        return 'text-blue-500';
      case 'love':
        return 'text-red-500';
      case 'laugh':
        return 'text-yellow-500';
      case 'wow':
        return 'text-purple-500';
      case 'sad':
        return 'text-slate-500';
      case 'angry':
        return 'text-orange-500';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Phản ứng
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalReactions} total reactions
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
        <div className="mb-4 p-4 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt reactions
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Reaction notifications
              </span>
              <button
                type="button"
                onClick={() => setEnableNotifications(!enableNotifications)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  enableNotifications ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    enableNotifications ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show reaction summary
              </span>
              <button
                type="button"
                onClick={() => setReactionSummary(!reactionSummary)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  reactionSummary ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    reactionSummary ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Allow custom emojis
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
            <Heart className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalReactions}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <ThumbsUp className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Yours</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {userReactions}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Memories</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {memoryReactions.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Types</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {reactions.length}
          </div>
        </div>
      </div>

      {/* Memory Selection */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
          Select Memory
        </label>
        <select
          value={selectedMemory}
          onChange={(e) => setSelectedMemory(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
        >
          {memoryReactions.map(m => (
            <option key={m.memoryId} value={m.memoryId}>{m.memoryTitle} ({m.totalReactions} reactions)</option>
          ))}
        </select>
      </div>

      {/* Reaction Types */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Reaction Types
        </h4>
        <div className="flex flex-wrap gap-2">
          {reactions.map((reaction) => (
            <button
              key={reaction.id}
              type="button"
              onClick={() => reaction.userReacted ? handleRemoveReaction(reaction.type) : handleAddReaction(reaction.type)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                reaction.userReacted
                  ? 'bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
              }`}
            >
              <span className="text-2xl">{reaction.emoji}</span>
              <div className="text-left">
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300 capitalize">
                  {reaction.type}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {reaction.count}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Memory Reactions */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Memory Reactions
        </h4>
        <div className="space-y-2">
          {memoryReactions.map((memory) => (
            <div
              key={memory.memoryId}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {memory.memoryTitle}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {memory.totalReactions} reactions
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                {memory.reactions.map((reaction) => (
                  <div
                    key={reaction.id}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                      reaction.userReacted
                        ? 'bg-pink-100 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800'
                        : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    <span className="text-sm">{reaction.emoji}</span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {reaction.count}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Last reacted: {memory.lastReacted.toLocaleDateString('vi-VN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reaction Notifications */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Recent Notifications
        </h4>
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start gap-2 mb-2">
                <Heart className="h-4 w-4 text-pink-500" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {notification.user}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {' '}reacted with {notification.reactionType} on
                  </span>
                  <span className="text-xs text-slate-700 dark:text-slate-300">
                    {notification.memory}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {notification.timestamp.toLocaleDateString('vi-VN')} at {notification.timestamp.toLocaleTimeString('vi-VN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 rounded-lg">
        <p className="text-[10px] text-pink-700 dark:text-pink-400">
          <strong>Lưu ý:</strong> Phản ứng cho phép người dùng like, love, và emoji trên kỷ niệm với 6 reaction types (like/love/laugh/wow/sad/angry), reaction counts per memory, user reaction tracking, add/remove reactions, reaction analytics, và notification settings.
        </p>
      </div>
    </div>
  );
}