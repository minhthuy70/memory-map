'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Ban,
  Calendar,
  CheckCircle,
  Filter,
  Info,
  MessageSquare,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  User
} from 'lucide-react';

interface BanUnbanUserProps {
  onCancel?: () => void;
}

interface BannedUser {
  id: string;
  username: string;
  email: string;
  reason: string;
  bannedAt: string;
  bannedBy: string;
  banExpiry?: string;
  status: 'active' | 'banned';
}

export default function BanUnbanUser({ onCancel }: BanUnbanUserProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([
    { id: '1', username: 'spam_user', email: 'spam@example.com', reason: 'Repeated spam violations', bannedAt: '2026-09-10', bannedBy: 'admin_1', banExpiry: '2026-12-10', status: 'banned' },
    { id: '2', username: 'harassment_user', email: 'harassment@example.com', reason: 'Harassment of other users', bannedAt: '2026-09-08', bannedBy: 'admin_2', status: 'banned' },
    { id: '3', username: 'john_doe', email: 'john@example.com', reason: '', bannedAt: '', bannedBy: '', status: 'active' },
    { id: '4', username: 'jane_smith', email: 'jane@example.com', reason: '', bannedAt: '', bannedBy: '', status: 'active' },
  ]);

  const [banningReason, setBanningReason] = useState('');
  const [banExpiry, setBanExpiry] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const filteredUsers = bannedUsers.filter(user => {
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const banUser = (id: string) => {
    if (banningReason) {
      setBannedUsers(bannedUsers.map(user => user.id === id ? {
        ...user,
        status: 'banned',
        reason: banningReason,
        bannedAt: new Date().toISOString().split('T')[0],
        bannedBy: 'admin',
        banExpiry: banExpiry || undefined,
      } : user));
      setBanningReason('');
      setBanExpiry('');
      setSelectedUser(null);
    }
  };

  const unbanUser = (id: string) => {
    setBannedUsers(bannedUsers.map(user => user.id === id ? {
      ...user,
      status: 'active',
      reason: '',
      bannedAt: '',
      bannedBy: '',
      banExpiry: undefined,
    } : user));
  };

  const permanentBan = (id: string) => {
    setBannedUsers(bannedUsers.map(user => user.id === id ? {
      ...user,
      status: 'banned',
      reason: 'Permanent ban',
      bannedAt: new Date().toISOString().split('T')[0],
      bannedBy: 'admin',
    } : user));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'banned': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-orange-500 rounded-xl">
            <Ban className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Ban/Unban User
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage user account bans
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show details"
          >
            {showDetails ? <Info className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Users</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{bannedUsers.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Banned</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{bannedUsers.filter(u => u.status === 'banned').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{bannedUsers.filter(u => u.status === 'active').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Filtered</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{filteredUsers.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 flex-1"
          />
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        {selectedUser && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Ban User</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Ban Reason</label>
                <textarea
                  value={banningReason}
                  onChange={(e) => setBanningReason(e.target.value)}
                  placeholder="Enter reason for ban..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Ban Expiry (optional)</label>
                <input
                  type="date"
                  value={banExpiry}
                  onChange={(e) => setBanExpiry(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => banUser(selectedUser)}
                  disabled={!banningReason}
                  className="flex-1 px-4 py-2 rounded-lg text-sm bg-red-600 hover:bg-red-700 text-white disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:text-slate-500 dark:disabled:text-slate-400"
                >
                  Ban User
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-lg text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Users</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{user.username}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                    {user.status === 'banned' && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span>{user.reason}</span>
                        <span>Banned: {user.bannedAt}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {user.status === 'active' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedUser(user.id)}
                        className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white"
                      >
                        Ban
                      </button>
                      <button
                        type="button"
                        onClick={() => permanentBan(user.id)}
                        className="px-2 py-1 rounded text-xs bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Permanent
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => unbanUser(user.id)}
                      className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white"
                    >
                      Unban
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Ban Management Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Always provide clear reason for bans</li>
              <li>• Use temporary bans for first offenses</li>
              <li>• Permanent bans for severe violations</li>
              <li>• Document ban decisions for appeals</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
