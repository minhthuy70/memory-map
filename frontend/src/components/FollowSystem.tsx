'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  as,
  BarChart3,
  Bell,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Filter,
  Heart,
  Search,
  Settings,
  Star,
  UserMinus,
  UserPlus,
  Users,
  XIcon,
  Zap
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  isFollowedBy: boolean;
  joinedAt: Date;
}

interface FollowRequest {
  id: string;
  fromUserId: string;
  fromUser: User;
  status: 'pending' | 'accepted' | 'rejected';
  requestedAt: Date;
}

interface FollowSystemProps {
  onCancel?: () => void;
  onFollow?: (userId: string) => Promise<void>;
  onUnfollow?: (userId: string) => Promise<void>;
}

const DEFAULT_USERS: User[] = [
  {
    id: 'user-1',
    username: 'john_doe',
    displayName: 'John Doe',
    avatar: '/john.jpg',
    bio: 'Travel enthusiast 🌍',
    followerCount: 234,
    followingCount: 56,
    isFollowing: true,
    isFollowedBy: true,
    joinedAt: new Date('2023-01-15'),
  },
  {
    id: 'user-2',
    username: 'jane_smith',
    displayName: 'Jane Smith',
    avatar: '/jane.jpg',
    bio: 'Photography lover 📸',
    followerCount: 189,
    followingCount: 78,
    isFollowing: false,
    isFollowedBy: true,
    joinedAt: new Date('2023-02-20'),
  },
  {
    id: 'user-3',
    username: 'travel_blogger',
    displayName: 'Travel Blogger',
    avatar: '/travel.jpg',
    bio: 'Exploring the world ✈️',
    followerCount: 567,
    followingCount: 23,
    isFollowing: false,
    isFollowedBy: false,
    joinedAt: new Date('2022-11-10'),
  },
];

const DEFAULT_REQUESTS: FollowRequest[] = [
  {
    id: 'request-1',
    fromUserId: 'user-4',
    fromUser: {
      id: 'user-4',
      username: 'new_user',
      displayName: 'New User',
      avatar: '/new.jpg',
      bio: 'Just joined!',
      followerCount: 5,
      followingCount: 10,
      isFollowing: false,
      isFollowedBy: false,
      joinedAt: new Date('2024-01-10'),
    },
    status: 'pending',
    requestedAt: new Date('2024-01-12'),
  },
];

export default function FollowSystem({ onCancel, onFollow, onUnfollow }: FollowSystemProps) {
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [requests, setRequests] = useState<FollowRequest[]>(DEFAULT_REQUESTS);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'following' | 'followers' | 'requests'>('following');
  const [searchQuery, setSearchQuery] = useState('');
  const [enableNotifications, setEnableNotifications] = useState(true);

  const followingCount = users.filter(u => u.isFollowing).length;
  const followersCount = users.filter(u => u.isFollowedBy).length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;

  const handleFollow = async (userId: string) => {
    await onFollow?.(userId);
    setUsers(users.map(u => 
      u.id === userId ? { ...u, isFollowing: true } : u
    ));
  };

  const handleUnfollow = async (userId: string) => {
    await onUnfollow?.(userId);
    setUsers(users.map(u => 
      u.id === userId ? { ...u, isFollowing: false } : u
    ));
  };

  const handleAcceptRequest = (requestId: string) => {
    setRequests(requests.map(r => 
      r.id === requestId ? { ...r, status: 'accepted' as const } : r
    ));
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(requests.map(r => 
      r.id === requestId ? { ...r, status: 'rejected' as const } : r
    ));
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <UserPlus className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Hệ thống theo dõi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {followingCount} following, {followersCount} followers
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
        <div className="mb-4 p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt follow system
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Follow notifications
              </span>
              <button
                type="button"
                onClick={() => setEnableNotifications(!enableNotifications)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  enableNotifications ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
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
                Public profile
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Follow requests
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
            <Users className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Following</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {followingCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Followers</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {followersCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Requests</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {pendingRequests}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Users</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {users.length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('following')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'following'
                ? 'bg-teal-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Following
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('followers')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'followers'
                ? 'bg-teal-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Followers
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'requests'
                ? 'bg-teal-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Requests
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Content based on tab */}
      {activeTab === 'following' && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Following
          </h4>
          <div className="space-y-2">
            {filteredUsers.filter(u => u.isFollowing).map((user) => (
              <div
                key={user.id}
                className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                      <Users className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {user.displayName}
                      </span>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        @{user.username}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUnfollow(user.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <UserMinus className="h-3 w-3" />
                    Unfollow
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  {user.bio}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Followers</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {user.followerCount}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Following</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {user.followingCount}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'followers' && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Followers
          </h4>
          <div className="space-y-2">
            {filteredUsers.filter(u => u.isFollowedBy).map((user) => (
              <div
                key={user.id}
                className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                      <Users className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {user.displayName}
                      </span>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        @{user.username}
                      </div>
                    </div>
                  </div>
                  {!user.isFollowing && (
                    <button
                      type="button"
                      onClick={() => handleFollow(user.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-teal-100 dark:bg-teal-900/30 hover:bg-teal-200 dark:hover:bg-teal-900/50 text-teal-600 dark:text-teal-400 text-xs font-semibold rounded-lg transition-colors"
                    >
                      <UserPlus className="h-3 w-3" />
                      Follow Back
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  {user.bio}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Followers</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {user.followerCount}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Following</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {user.followingCount}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Follow Requests
          </h4>
          <div className="space-y-2">
            {requests.filter(r => r.status === 'pending').map((request) => (
              <div
                key={request.id}
                className="p-4 rounded-lg border-2 bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                      <Users className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {request.fromUser.displayName}
                      </span>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        @{request.fromUser.username}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAcceptRequest(request.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 text-xs font-semibold rounded-lg transition-colors"
                    >
                      <Check className="h-3 w-3" />
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRejectRequest(request.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg transition-colors"
                    >
                      <XIcon className="h-3 w-3" />
                      Reject
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  {request.fromUser.bio}
                </p>

                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Requested: {request.requestedAt.toLocaleDateString('vi-VN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-lg">
        <p className="text-[10px] text-teal-700 dark:text-teal-400">
          <strong>Lưu ý:</strong> Hệ thống theo dõi cho phép người dùng follow và unfollow người dùng khác với follow requests, notifications, follower management, và social connections.
        </p>
      </div>
    </div>
  );
}