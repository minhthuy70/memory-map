'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Filter,
  Globe,
  Lock,
  MapPin,
  MessageCircle,
  Settings,
  Share2,
  Shield,
  Star,
  User,
  Users,
  Zap
} from 'lucide-react';

interface PublicProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  isPublic: boolean;
  allowFollowers: boolean;
  allowComments: boolean;
  memoryCount: number;
  followerCount: number;
  followingCount: number;
  createdAt: Date;
  lastActive: Date;
}

interface ProfileStats {
  profileViews: number;
  profileShares: number;
  memoryLikes: number;
  memoryShares: number;
}

interface PublicProfilesProps {
  onCancel?: () => void;
  onUpdateProfile?: (profile: Partial<PublicProfile>) => Promise<void>;
}

const DEFAULT_PROFILE: PublicProfile = {
  id: 'profile-1',
  username: 'memoryuser',
  displayName: 'Memory User',
  bio: 'Life is beautiful, capture every moment 📸',
  avatar: '/avatar.jpg',
  isPublic: true,
  allowFollowers: true,
  allowComments: true,
  memoryCount: 125,
  followerCount: 48,
  followingCount: 32,
  createdAt: new Date('2023-01-01'),
  lastActive: new Date(),
};

const DEFAULT_STATS: ProfileStats = {
  profileViews: 1234,
  profileShares: 56,
  memoryLikes: 892,
  memoryShares: 234,
};

export default function PublicProfiles({ onCancel, onUpdateProfile }: PublicProfilesProps) {
  const [profile, setProfile] = useState<PublicProfile>(DEFAULT_PROFILE);
  const [stats, setStats] = useState<ProfileStats>(DEFAULT_STATS);
  const [showSettings, setShowSettings] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState<PublicProfile>(DEFAULT_PROFILE);

  const handleSave = async () => {
    await onUpdateProfile?.(tempProfile);
    setProfile(tempProfile);
    setEditMode(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setEditMode(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Hồ sơ công khai
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              @{profile.username}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditMode(!editMode)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Edit profile"
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
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt public profile
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show in directory
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Index for search
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Analytics tracking
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="mb-4">
        <div className="p-6 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
              <User className="h-8 w-8 text-slate-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {profile.displayName}
                </h4>
                {profile.isPublic ? (
                  <Globe className="h-4 w-4 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 text-slate-500" />
                )}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                @{profile.username}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {profile.bio}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="text-center">
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {profile.memoryCount}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Memories</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {profile.followerCount}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {profile.followingCount}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Following</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {stats.profileViews}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Mode */}
      {editMode && (
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Edit Profile
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={tempProfile.displayName}
                onChange={(e) => setTempProfile({ ...tempProfile, displayName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Bio
              </label>
              <textarea
                value={tempProfile.bio}
                onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Settings */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Privacy Settings
        </h4>
        <div className="space-y-2">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Public Profile
                </span>
              </div>
              <button
                type="button"
                onClick={() => setProfile({ ...profile, isPublic: !profile.isPublic })}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  profile.isPublic ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    profile.isPublic ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {profile.isPublic ? 'Anyone can view your profile' : 'Only you can view your profile'}
            </p>
          </div>

          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Allow Followers
                </span>
              </div>
              <button
                type="button"
                onClick={() => setProfile({ ...profile, allowFollowers: !profile.allowFollowers })}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  profile.allowFollowers ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    profile.allowFollowers ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {profile.allowFollowers ? 'Others can follow your updates' : 'Follow functionality disabled'}
            </p>
          </div>

          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Allow Comments
                </span>
              </div>
              <button
                type="button"
                onClick={() => setProfile({ ...profile, allowComments: !profile.allowComments })}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  profile.allowComments ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    profile.allowComments ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {profile.allowComments ? 'Others can comment on your memories' : 'Comments disabled'}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Profile Statistics
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="h-3 w-3 text-slate-500" />
              <span className="text-[10px] text-slate-600 dark:text-slate-400">Profile Views</span>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {stats.profileViews}
            </div>
          </div>
          <div className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <div className="flex items-center gap-2 mb-1">
              <Share2 className="h-3 w-3 text-slate-500" />
              <span className="text-[10px] text-slate-600 dark:text-slate-400">Profile Shares</span>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {stats.profileShares}
            </div>
          </div>
          <div className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-3 w-3 text-slate-500" />
              <span className="text-[10px] text-slate-600 dark:text-slate-400">Memory Likes</span>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {stats.memoryLikes}
            </div>
          </div>
          <div className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <div className="flex items-center gap-2 mb-1">
              <Share2 className="h-3 w-3 text-slate-500" />
              <span className="text-[10px] text-slate-600 dark:text-slate-400">Memory Shares</span>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {stats.memoryShares}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Profile Information
        </h4>
        <div className="space-y-2">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Username</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  @{profile.username}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Created</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {profile.createdAt.toLocaleDateString('vi-VN')}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Last Active</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {profile.lastActive.toLocaleDateString('vi-VN')}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Status</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {profile.isPublic ? 'Public' : 'Private'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> Hồ sơ công khai cho phép người dùng tạo profile công khai để chia sẻ kỷ niệm với privacy controls, visibility settings, follower management, và profile analytics.
        </p>
      </div>
    </div>
  );
}