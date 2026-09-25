'use client';

import { useState } from 'react';
import {
  Activity,
  Calendar,
  Download,
  Edit2,
  Eye,
  FileText,
  Filter,
  Info,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  User
} from 'lucide-react';

interface UserActivityLogProps {
  onCancel?: () => void;
}

interface ActivityLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed' | 'warning';
}

export default function UserActivityLog({ onCancel }: UserActivityLogProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: '1', userId: '1', username: 'john_doe', action: 'Login', details: 'Successful login', timestamp: '2026-09-14 14:30:00', ipAddress: '192.168.1.1', userAgent: 'Chrome/120', status: 'success' },
    { id: '2', userId: '1', username: 'john_doe', action: 'Create Memory', details: 'Created memory "Summer Vacation"', timestamp: '2026-09-14 14:35:00', ipAddress: '192.168.1.1', userAgent: 'Chrome/120', status: 'success' },
    { id: '3', userId: '2', username: 'jane_smith', action: 'Upload Photo', details: 'Uploaded 5 photos', timestamp: '2026-09-14 15:00:00', ipAddress: '192.168.1.2', userAgent: 'Safari/17', status: 'success' },
    { id: '4', userId: '3', username: 'admin_user', action: 'Ban User', details: 'Banned user "spam_user"', timestamp: '2026-09-14 15:30:00', ipAddress: '192.168.1.100', userAgent: 'Chrome/120', status: 'success' },
    { id: '5', userId: '1', username: 'john_doe', action: 'Password Change', details: 'Failed password change - old password incorrect', timestamp: '2026-09-14 16:00:00', ipAddress: '192.168.1.1', userAgent: 'Chrome/120', status: 'failed' },
    { id: '6', userId: '4', username: 'spam_user', action: 'Login Attempt', details: 'Account banned', timestamp: '2026-09-14 16:15:00', ipAddress: '192.168.1.50', userAgent: 'Firefox/121', status: 'failed' },
    { id: '7', userId: '2', username: 'jane_smith', action: 'Delete Memory', details: 'Deleted memory "Old Trip"', timestamp: '2026-09-14 16:30:00', ipAddress: '192.168.1.2', userAgent: 'Safari/17', status: 'warning' },
  ]);

  const filteredLogs = activityLogs.filter(log => {
    const matchesUser = selectedUser === 'all' || log.userId === selectedUser;
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    const matchesStatus = selectedStatus === 'all' || log.status === selectedStatus;
    const matchesSearch = log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = (!dateRange.start || log.timestamp >= dateRange.start) &&
                       (!dateRange.end || log.timestamp <= dateRange.end);
    return matchesUser && matchesAction && matchesStatus && matchesSearch && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Login': return <LogOut className="h-3 w-3" />;
      case 'Ban User': return <Shield className="h-3 w-3" />;
      case 'Create Memory': return <Plus className="h-3 w-3" />;
      case 'Delete Memory': return <Trash2 className="h-3 w-3" />;
      case 'Upload Photo': return <Eye className="h-3 w-3" />;
      case 'Password Change': return <Edit2 className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  const exportLogs = () => {
    const headers = ['User', 'Action', 'Details', 'Timestamp', 'IP Address', 'Status'];
    const rows = filteredLogs.map(log => [
      log.username,
      log.action,
      log.details,
      log.timestamp,
      log.ipAddress,
      log.status,
    ]);
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'activity_logs.csv';
    a.click();
  };

  const clearLogs = () => {
    setActivityLogs([]);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              User Activity Log
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track user actions and events
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Logs</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{activityLogs.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Success</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{activityLogs.filter(l => l.status === 'success').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Failed</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{activityLogs.filter(l => l.status === 'failed').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Filtered</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{filteredLogs.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Users</option>
            <option value="1">john_doe</option>
            <option value="2">jane_smith</option>
            <option value="3">admin_user</option>
            <option value="4">spam_user</option>
          </select>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Actions</option>
            <option value="Login">Login</option>
            <option value="Create Memory">Create Memory</option>
            <option value="Upload Photo">Upload Photo</option>
            <option value="Delete Memory">Delete Memory</option>
            <option value="Password Change">Password Change</option>
            <option value="Ban User">Ban User</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="warning">Warning</option>
          </select>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs..."
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 flex-1"
          />
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
          <button
            type="button"
            onClick={exportLogs}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Export
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Activity Logs</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{log.username}</span>
                      <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        {getActionIcon(log.action)}
                        {log.action}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{log.details}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {log.timestamp}
                      </span>
                      <span>IP: {log.ipAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={clearLogs}
            className="px-3 py-1.5 rounded-lg text-xs bg-red-600 hover:bg-red-700 text-white border-0 flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" />
            Clear Logs
          </button>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Activity Log Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Monitor failed login attempts for security</li>
              <li>• Track admin actions for audit purposes</li>
              <li>• Export logs for compliance and analysis</li>
              <li>• Regularly review suspicious activity patterns</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
