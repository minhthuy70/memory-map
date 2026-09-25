'use client';

import { useState } from 'react';
import { LayoutDashboard, X, RefreshCw, Users, FileText, AlertTriangle, TrendingUp, Activity, Calendar, BarChart3, Zap, Shield, Eye } from 'lucide-react';

interface AdminDashboardOverviewProps {
  onCancel?: () => void;
}

export default function AdminDashboardOverview({ onCancel }: AdminDashboardOverviewProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');

  const [stats, setStats] = useState({
    totalUsers: 10350,
    activeUsers: 8590,
    newUsers: 150,
    totalContent: 45230,
    reportedContent: 25,
    systemHealth: 98,
    serverUptime: '99.9%',
    avgResponseTime: 150,
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: '1', type: 'user', message: 'New user registered', user: 'user_123', time: '2 min ago' },
    { id: '2', type: 'content', message: 'New memory created', user: 'user_456', time: '5 min ago' },
    { id: '3', type: 'alert', message: 'High traffic detected', user: 'system', time: '10 min ago' },
    { id: '4', type: 'moderation', message: 'Content approved', user: 'admin_1', time: '15 min ago' },
    { id: '5', type: 'user', message: 'User account banned', user: 'admin_2', time: '20 min ago' },
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4" />;
      case 'content': return <FileText className="h-4 w-4" />;
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
      case 'moderation': return <Shield className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'content': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'alert': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'moderation': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Admin Dashboard Overview
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              System overview and statistics
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
        <div className="flex flex-wrap gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Users</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalUsers.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Users</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{stats.activeUsers.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">New Users</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">+{stats.newUsers}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Content</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{stats.totalContent.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Reported Content</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{stats.reportedContent}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">System Health</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{stats.systemHealth}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Server Uptime</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.serverUptime}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Response</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{stats.avgResponseTime}ms</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Recent Activity</h4>
          <div className="space-y-2">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                    {activity.type}
                  </span>
                  <span className="text-xs text-slate-900 dark:text-white">{activity.message}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{activity.user}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white text-left flex items-center gap-2">
                <Users className="h-4 w-4" />
                Manage Users
              </button>
              <button className="w-full px-3 py-2 rounded-lg text-xs bg-purple-600 hover:bg-purple-700 text-white text-left flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Content Moderation
              </button>
              <button className="w-full px-3 py-2 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white text-left flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                View Analytics
              </button>
              <button className="w-full px-3 py-2 rounded-lg text-xs bg-orange-600 hover:bg-orange-700 text-white text-left flex items-center gap-2">
                <Zap className="h-4 w-4" />
                System Settings
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">System Status</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Database</span>
                <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">API Server</span>
                <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Running
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Cache</span>
                <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Storage</span>
                <span className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  72% Used
                </span>
              </div>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Dashboard Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Monitor system health regularly</li>
              <li>• Review reported content promptly</li>
              <li>• Track user growth trends</li>
              <li>• Use quick actions for common tasks</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
