'use client';

import { useState } from 'react';
import { Activity, X, Settings, CheckCircle, AlertTriangle, Clock, BarChart3, Filter, Zap, Calendar, Users, Plus, Heart, MessageSquare, Edit3, Share2, Bell, Eye, CheckCircle2, UserPlus, Trash2 } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'memory_created' | 'memory_updated' | 'memory_deleted' | 'comment_added' | 'reaction_added' | 'user_joined' | 'album_shared' | 'version_restored';
  user: string;
  userAvatar: string;
  target: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
}

interface ActivityFilter {
  type: string;
  enabled: boolean;
}

interface ActivityFeedProps {
  onCancel?: () => void;
  onMarkAsRead?: (activityId: string) => Promise<void>;
  onDeleteActivity?: (activityId: string) => Promise<void>;
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: 'activity-1',
    type: 'memory_created',
    user: 'Dad',
    userAvatar: '/dad.jpg',
    target: 'Family Vacation 2024',
    description: 'created new memory',
    timestamp: new Date('2024-01-12'),
    isRead: false,
  },
  {
    id: 'activity-2',
    type: 'comment_added',
    user: 'Mom',
    userAvatar: '/mom.jpg',
    target: 'Birthday Party',
    description: 'commented on memory',
    timestamp: new Date('2024-01-10'),
    isRead: true,
  },
  {
    id: 'activity-3',
    type: 'reaction_added',
    user: 'Tom',
    userAvatar: '/tom.jpg',
    target: 'Christmas Celebration',
    description: 'reacted with love',
    timestamp: new Date('2024-01-08'),
    isRead: true,
  },
  {
    id: 'activity-4',
    type: 'album_shared',
    user: 'Dad',
    userAvatar: '/dad.jpg',
    target: 'Family Memories',
    description: 'shared album with Mom',
    timestamp: new Date('2024-01-05'),
    isRead: true,
  },
  {
    id: 'activity-5',
    type: 'memory_updated',
    user: 'Mom',
    userAvatar: '/mom.jpg',
    target: 'Summer Trip',
    description: 'updated memory',
    timestamp: new Date('2024-01-03'),
    isRead: true,
  },
];

const DEFAULT_FILTERS: ActivityFilter[] = [
  { type: 'memory_created', enabled: true },
  { type: 'memory_updated', enabled: true },
  { type: 'memory_deleted', enabled: true },
  { type: 'comment_added', enabled: true },
  { type: 'reaction_added', enabled: true },
  { type: 'user_joined', enabled: true },
  { type: 'album_shared', enabled: true },
  { type: 'version_restored', enabled: true },
];

export default function ActivityFeed({ onCancel, onMarkAsRead, onDeleteActivity }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>(DEFAULT_ACTIVITIES);
  const [filters, setFilters] = useState<ActivityFilter[]>(DEFAULT_FILTERS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(true);

  const totalActivities = activities.length;
  const unreadCount = activities.filter(a => !a.isRead).length;
  const enabledFilters = filters.filter(f => f.enabled).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'memory_created':
        return <Plus className="h-4 w-4" />;
      case 'memory_updated':
        return <Edit3 className="h-4 w-4" />;
      case 'memory_deleted':
        return <Trash2 className="h-4 w-4" />;
      case 'comment_added':
        return <MessageSquare className="h-4 w-4" />;
      case 'reaction_added':
        return <Heart className="h-4 w-4" />;
      case 'user_joined':
        return <UserPlus className="h-4 w-4" />;
      case 'album_shared':
        return <Share2 className="h-4 w-4" />;
      case 'version_restored':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'memory_created':
        return 'text-green-500';
      case 'memory_updated':
        return 'text-blue-500';
      case 'memory_deleted':
        return 'text-red-500';
      case 'comment_added':
        return 'text-purple-500';
      case 'reaction_added':
        return 'text-pink-500';
      case 'user_joined':
        return 'text-teal-500';
      case 'album_shared':
        return 'text-orange-500';
      case 'version_restored':
        return 'text-amber-500';
      default:
        return 'text-slate-500';
    }
  };

  const handleMarkAsRead = async (activityId: string) => {
    await onMarkAsRead?.(activityId);
    setActivities(activities.map(a => 
      a.id === activityId ? { ...a, isRead: true } : a
    ));
  };

  const handleMarkAllAsRead = async () => {
    setActivities(activities.map(a => ({ ...a, isRead: true })));
  };

  const handleDelete = async (activityId: string) => {
    await onDeleteActivity?.(activityId);
    setActivities(activities.filter(a => a.id !== activityId));
  };

  const handleToggleFilter = (type: string) => {
    setFilters(filters.map(f => 
      f.type === type ? { ...f, enabled: !f.enabled } : f
    ));
  };

  const filteredActivities = activities.filter(a => {
    const typeMatch = selectedType === 'all' || a.type === selectedType;
    const readMatch = !showUnreadOnly || !a.isRead;
    const filterMatch = filters.find(f => f.type === a.type)?.enabled ?? true;
    return typeMatch && readMatch && filterMatch;
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Feed hoạt động
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {unreadCount} unread
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
            Cài đặt activity feed
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Activity notifications
              </span>
              <button
                type="button"
                onClick={() => setEnableNotifications(!enableNotifications)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  enableNotifications ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
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
                Real-time updates
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Activity retention
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">90 days</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalActivities}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Unread</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {unreadCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Filter className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Filters</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {enabledFilters}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Users</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {Array.from(new Set(activities.map(a => a.user))).length}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 text-xs font-semibold rounded-lg transition-colors"
          >
            <CheckCircle2 className="h-3 w-3" />
            Mark All Read
          </button>
          <button
            type="button"
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
              showUnreadOnly
                ? 'bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-amber-600 dark:text-amber-400'
                : 'bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Eye className="h-3 w-3" />
            {showUnreadOnly ? 'Show All' : 'Unread Only'}
          </button>
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
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('memory_created')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'memory_created'
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Created
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('comment_added')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'comment_added'
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Comments
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('reaction_added')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'reaction_added'
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Reactions
          </button>
        </div>
      </div>

      {/* Filter Settings */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Activity Filters
        </h4>
        <div className="space-y-2">
          {filters.map((filter) => (
            <div
              key={filter.type}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getTypeColor(filter.type)}`}>
                    {getTypeIcon(filter.type)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                    {filter.type.replace('_', ' ')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleFilter(filter.type)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    filter.enabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      filter.enabled ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Recent Activity
        </h4>
        <div className="space-y-2">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className={`p-4 rounded-lg border-2 ${
                !activity.isRead
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                    <Users className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {activity.user}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {activity.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!activity.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(activity.id)}
                      className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                      title="Mark as read"
                    >
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(activity.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2 mb-2">
                <div className={`p-2 rounded-lg ${getTypeColor(activity.type)}`}>
                  {getTypeIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-semibold capitalize">{activity.type.replace('_', ' ')}</span>
                    {' '}on{' '}
                    </span>
                  <span className="text-xs text-slate-700 dark:text-slate-300">
                    {activity.target}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {activity.timestamp.toLocaleDateString('vi-VN')} at {activity.timestamp.toLocaleTimeString('vi-VN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-[10px] text-green-700 dark:text-green-400">
          <strong>Lưu ý:</strong> Feed hoạt động hiển thị tất cả hoạt động của người dùng và cộng tác với activity types (memory_created/memory_updated/memory_deleted/comment_added/reaction_added/user_joined/album_shared/version_restored), type filtering, read/unread status, real-time updates, và activity retention.
        </p>
      </div>
    </div>
  );
}