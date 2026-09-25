'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Copy,
  Info,
  Key,
  Mail,
  RefreshCw,
  Search,
  Send,
  User
} from 'lucide-react';

interface ResetUserPasswordProps {
  onCancel?: () => void;
}

interface PasswordReset {
  id: string;
  username: string;
  email: string;
  requestedAt: string;
  status: 'pending' | 'completed' | 'failed';
  resetBy?: string;
}

export default function ResetUserPassword({ onCancel }: ResetUserPasswordProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forceReset, setForceReset] = useState(false);

  const [passwordResets, setPasswordResets] = useState<PasswordReset[]>([
    { id: '1', username: 'john_doe', email: 'john@example.com', requestedAt: '2026-09-14', status: 'completed', resetBy: 'admin' },
    { id: '2', username: 'jane_smith', email: 'jane@example.com', requestedAt: '2026-09-13', status: 'pending' },
    { id: '3', username: 'admin_user', email: 'admin@example.com', requestedAt: '2026-09-12', status: 'completed', resetBy: 'admin' },
  ]);

  const [users, setUsers] = useState([
    { id: '1', username: 'john_doe', email: 'john@example.com' },
    { id: '2', username: 'jane_smith', email: 'jane@example.com' },
    { id: '3', username: 'admin_user', email: 'admin@example.com' },
    { id: '4', username: 'test_user', email: 'test@example.com' },
  ]);

  const filteredUsers = users.filter(user => !passwordResets.find(r => r.username === user.username && r.status === 'pending'));

  const sendResetLink = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setPasswordResets([...passwordResets, {
        id: Date.now().toString(),
        username: user.username,
        email: user.email,
        requestedAt: new Date().toISOString().split('T')[0],
        status: 'pending',
      }]);
    }
  };

  const resetPassword = () => {
    if (selectedUser && newPassword && confirmPassword && newPassword === confirmPassword) {
      setPasswordResets(passwordResets.map(reset => reset.username === selectedUser ? {
        ...reset,
        status: 'completed',
        resetBy: 'admin',
      } : reset));
      setNewPassword('');
      setConfirmPassword('');
      setSelectedUser(null);
    }
  };

  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const password = Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setNewPassword(password);
    setConfirmPassword(password);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
            <Key className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Reset User Password
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage user password resets
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
            <p className="text-lg font-bold text-slate-900 dark:text-white">{users.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pending Resets</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{passwordResets.filter(r => r.status === 'pending').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Completed</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{passwordResets.filter(r => r.status === 'completed').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Failed</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{passwordResets.filter(r => r.status === 'failed').length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={selectedUser || ''}
            onChange={(e) => setSelectedUser(e.target.value)}
            placeholder="Select user to reset password..."
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
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Reset Password for {selectedUser}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={forceReset}
                  onChange={(e) => setForceReset(e.target.checked)}
                  className="rounded"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">Force reset (requires user to change on next login)</span>
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">New Password</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password..."
                    className="flex-1 px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                  />
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="px-3 py-2 rounded-lg text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    Generate
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password..."
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetPassword}
                  disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
                  className="flex-1 px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:text-slate-500 dark:disabled:text-slate-400"
                >
                  Reset Password
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Password Reset History</h4>
          <div className="space-y-2">
            {passwordResets.map((reset) => (
              <div key={reset.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{reset.username}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{reset.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(reset.status)}`}>
                    {reset.status}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{reset.requestedAt}</span>
                  {reset.status === 'completed' && (
                    <button
                      type="button"
                      onClick={() => copyPassword('temp_password_123')}
                      className="p-1 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                      title="Copy temporary password"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Send Reset Link</h4>
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{user.username}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => sendResetLink(user.id)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                >
                  <Send className="h-3 w-3" />
                  Send Link
                </button>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Password Reset Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Use strong passwords with mixed characters</li>
              <li>• Force reset for security after data breach</li>
              <li>• Reset links expire after 24 hours</li>
              <li>• Always require confirmation on next login</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
