'use client';

import { useState } from 'react';
import { User, X, RefreshCw, Calendar, Shield, Mail, MapPin, Image, Activity, Edit2, Key, Eye, AlertTriangle, CheckCircle } from 'lucide-react';

interface UserDetailViewProps {
  onCancel?: () => void;
  userId?: string;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  status: 'active' | 'banned' | 'suspended';
  joinedDate: string;
  lastActive: string;
  memories: number;
  location?: string;
  bio?: string;
  avatar?: string;
}

export default function UserDetailView({ onCancel, userId }: UserDetailViewProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: userId || '1',
    username: 'john_doe',
    email: 'john@example.com',
    role: 'user',
    status: 'active',
    joinedDate: '2026-09-01',
    lastActive: '2026-09-14',
    memories: 25,
    location: 'Da Nang, Vietnam',
    bio: 'Travel enthusiast and photography lover',
  });

  const [userActivity, setUserActivity] = useState([
    { id: '1', action: 'Created memory', date: '2026-09-14', details: 'Summer vacation photo' },
    { id: '2', action: 'Uploaded photo', date: '2026-09-13', details: 'Beach sunset' },
    { id: '3', action: 'Updated profile', date: '2026-09-12', details: 'Changed bio' },
    { id: '4', action: 'Logged in', date: '2026-09-14', details: 'From IP 192.168.1.1' },
  ]);

  const [editProfile, setEditProfile] = useState({
    username: userProfile.username,
    email: userProfile.email,
    role: userProfile.role,
    status: userProfile.status,
    location: userProfile.location || '',
    bio: userProfile.bio || '',
  });

  const saveProfile = () => {
    setUserProfile({
      ...userProfile,
      username: editProfile.username,
      email: editProfile.email,
      role: editProfile.role as any,
      status: editProfile.status as any,
      location: editProfile.location,
      bio: editProfile.bio,
    });
    setIsEditing(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'moderator': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'user': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'banned': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'suspended': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              User Detail View
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              View and manage user profile
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Edit profile"
          >
            <Edit2 className="h-4 w-4 text-slate-500" />
          </button>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show details"
          >
            {showDetails ? <Eye className="h-4 w-4 text-slate-500" /> : <Eye className="h-4 w-4 text-slate-500" />}
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
        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-slate-400" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editProfile.username}
                    onChange={(e) => setEditProfile({ ...editProfile, username: e.target.value })}
                    className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                  />
                  <input
                    type="email"
                    value={editProfile.email}
                    onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                    className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                  />
                  <div className="flex gap-2">
                    <select
                      value={editProfile.role}
                      onChange={(e) => setEditProfile({ ...editProfile, role: e.target.value as any })}
                      className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                    <select
                      value={editProfile.status}
                      onChange={(e) => setEditProfile({ ...editProfile, status: e.target.value as any })}
                      className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                    >
                      <option value="active">Active</option>
                      <option value="banned">Banned</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={saveProfile}
                      className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-lg text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{userProfile.username}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getRoleColor(userProfile.role)}`}>
                      {userProfile.role}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(userProfile.status)}`}>
                      {userProfile.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {userProfile.email}
                  </p>
                  {userProfile.bio && (
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">{userProfile.bio}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Memories</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{userProfile.memories}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Joined</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{userProfile.joinedDate}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Last Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{userProfile.lastActive}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">User ID</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{userProfile.id}</p>
          </div>
        </div>

        {userProfile.location && (
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-500" />
            <span className="text-xs text-slate-700 dark:text-slate-300">{userProfile.location}</span>
          </div>
        )}

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Recent Activity</h4>
          <div className="space-y-2">
            {userActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-slate-500" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{activity.action}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{activity.details}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{activity.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1">
            <Key className="h-3 w-3" />
            Reset Password
          </button>
          <button className="px-3 py-1.5 rounded-lg text-xs bg-purple-600 hover:bg-purple-700 text-white border-0 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Change Role
          </button>
          <button className="px-3 py-1.5 rounded-lg text-xs bg-red-600 hover:bg-red-700 text-white border-0 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Ban User
          </button>
          <button className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">User Management Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Review user activity before taking action</li>
              <li>• Use ban as last resort for violations</li>
              <li>• Monitor suspicious activity patterns</li>
              <li>• Keep detailed moderation records</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
