'use client';

import { useState } from 'react';
import { Layers, X, RefreshCw, Search, Filter, User, CheckCircle, Trash2, Shield, Key, Info, Download, AlertTriangle, Ban, CheckSquare, Square } from 'lucide-react';

interface BulkUserActionsProps {
  onCancel?: () => void;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  status: 'active' | 'banned' | 'suspended';
}

export default function BulkUserActions({ onCancel }: BulkUserActionsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const [users, setUsers] = useState<User[]>([
    { id: '1', username: 'john_doe', email: 'john@example.com', role: 'user', status: 'active' },
    { id: '2', username: 'jane_smith', email: 'jane@example.com', role: 'moderator', status: 'active' },
    { id: '3', username: 'admin_user', email: 'admin@example.com', role: 'admin', status: 'active' },
    { id: '4', username: 'spam_user', email: 'spam@example.com', role: 'user', status: 'banned' },
    { id: '5', username: 'suspended_user', email: 'suspended@example.com', role: 'user', status: 'suspended' },
    { id: '6', username: 'test_user', email: 'test@example.com', role: 'user', status: 'active' },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    }
    setSelectAll(!selectAll);
  };

  const bulkBan = () => {
    setUsers(users.map(user => selectedUsers.has(user.id) ? { ...user, status: 'banned' } : user));
    setSelectedUsers(new Set());
    setSelectAll(false);
  };

  const bulkUnban = () => {
    setUsers(users.map(user => selectedUsers.has(user.id) ? { ...user, status: 'active' } : user));
    setSelectedUsers(new Set());
    setSelectAll(false);
  };

  const bulkDelete = () => {
    setUsers(users.filter(user => !selectedUsers.has(user.id)));
    setSelectedUsers(new Set());
    setSelectAll(false);
  };

  const bulkChangeRole = (newRole: string) => {
    setUsers(users.map(user => selectedUsers.has(user.id) ? { ...user, role: newRole as any } : user));
    setSelectedUsers(new Set());
    setSelectAll(false);
  };

  const bulkResetPassword = () => {
    setSelectedUsers(new Set());
    setSelectAll(false);
  };

  const bulkExport = () => {
    const selectedUsersData = users.filter(user => selectedUsers.has(user.id));
    const headers = ['Username', 'Email', 'Role', 'Status'];
    const rows = selectedUsersData.map(user => [user.username, user.email, user.role, user.status]);
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_users.csv';
    a.click();
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
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Bulk User Actions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Perform actions on multiple users
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
            {selectedUsers.size} selected
          </span>
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
            <p className="text-lg font-bold text-slate-900 dark:text-white">{users.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Selected</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{selectedUsers.size}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{users.filter(u => u.status === 'active').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Filtered</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{filteredUsers.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
            <option value="suspended">Suspended</option>
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

        {selectedUsers.size > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Bulk Actions ({selectedUsers.size} users)</h4>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={bulkBan}
                className="px-3 py-1.5 rounded-lg text-xs bg-red-600 hover:bg-red-700 text-white border-0 flex items-center gap-1"
              >
                <Ban className="h-3 w-3" />
                Ban
              </button>
              <button
                type="button"
                onClick={bulkUnban}
                className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
              >
                <CheckCircle className="h-3 w-3" />
                Unban
              </button>
              <button
                type="button"
                onClick={() => bulkChangeRole('user')}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-600 hover:bg-slate-700 text-white border-0 flex items-center gap-1"
              >
                Set User
              </button>
              <button
                type="button"
                onClick={() => bulkChangeRole('moderator')}
                className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
              >
                Set Moderator
              </button>
              <button
                type="button"
                onClick={() => bulkChangeRole('admin')}
                className="px-3 py-1.5 rounded-lg text-xs bg-purple-600 hover:bg-purple-700 text-white border-0 flex items-center gap-1"
              >
                Set Admin
              </button>
              <button
                type="button"
                onClick={bulkResetPassword}
                className="px-3 py-1.5 rounded-lg text-xs bg-orange-600 hover:bg-orange-700 text-white border-0 flex items-center gap-1"
              >
                <Key className="h-3 w-3" />
                Reset Password
              </button>
              <button
                type="button"
                onClick={bulkExport}
                className="px-3 py-1.5 rounded-lg text-xs bg-cyan-600 hover:bg-cyan-700 text-white border-0 flex items-center gap-1"
              >
                <Download className="h-3 w-3" />
                Export
              </button>
              <button
                type="button"
                onClick={bulkDelete}
                className="px-3 py-1.5 rounded-lg text-xs bg-red-700 hover:bg-red-800 text-white border-0 flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            </div>
          </div>
        )}

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Users</h4>
            <button
              type="button"
              onClick={toggleSelectAll}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              {selectAll ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleUserSelection(user.id)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                  >
                    {selectedUsers.has(user.id) ? (
                      <CheckSquare className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{user.username}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Bulk Action Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Always confirm bulk actions before executing</li>
              <li>• Use filters to select specific user groups</li>
              <li>• Review action results for errors</li>
              <li>• Keep audit trail of bulk operations</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
