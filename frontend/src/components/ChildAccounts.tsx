'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Baby,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Filter,
  Lock,
  Monitor,
  Plus,
  Settings,
  Shield,
  Smartphone,
  Timer,
  Unlock,
  Users,
  Zap
} from 'lucide-react';

interface ChildAccount {
  id: string;
  name: string;
  age: number;
  avatar: string;
  parentIds: string[];
  createdAt: Date;
  isActive: boolean;
  screenTimeLimit: number;
  currentScreenTime: number;
  contentFilterLevel: 'strict' | 'moderate' | 'none';
}

interface ScreenTimeSession {
  id: string;
  childId: string;
  date: Date;
  duration: number;
  activities: string[];
}

interface ActivityLog {
  id: string;
  childId: string;
  type: 'login' | 'logout' | 'content_viewed' | 'content_blocked' | 'limit_reached';
  description: string;
  timestamp: Date;
}

interface ChildAccountsProps {
  onCancel?: () => void;
  onCreateAccount?: () => Promise<void>;
}

const DEFAULT_CHILDREN: ChildAccount[] = [
  {
    id: 'child-1',
    name: 'Tom',
    age: 8,
    avatar: '/tom.jpg',
    parentIds: ['parent-1', 'parent-2'],
    createdAt: new Date('2023-06-15'),
    isActive: true,
    screenTimeLimit: 120,
    currentScreenTime: 45,
    contentFilterLevel: 'moderate',
  },
  {
    id: 'child-2',
    name: 'Emma',
    age: 6,
    avatar: '/emma.jpg',
    parentIds: ['parent-1', 'parent-2'],
    createdAt: new Date('2023-06-15'),
    isActive: true,
    screenTimeLimit: 90,
    currentScreenTime: 30,
    contentFilterLevel: 'strict',
  },
];

const DEFAULT_SESSIONS: ScreenTimeSession[] = [
  {
    id: 'session-1',
    childId: 'child-1',
    date: new Date('2024-01-13'),
    duration: 120,
    activities: ['memories', 'games', 'photos'],
  },
  {
    id: 'session-2',
    childId: 'child-2',
    date: new Date('2024-01-13'),
    duration: 90,
    activities: ['memories', 'photos'],
  },
];

const DEFAULT_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    childId: 'child-1',
    type: 'login',
    description: 'Logged in',
    timestamp: new Date('2024-01-13T09:00:00'),
  },
  {
    id: 'log-2',
    childId: 'child-1',
    type: 'content_viewed',
    description: 'Viewed "Family Vacation"',
    timestamp: new Date('2024-01-13T09:30:00'),
  },
  {
    id: 'log-3',
    childId: 'child-2',
    type: 'content_blocked',
    description: 'Blocked content',
    timestamp: new Date('2024-01-13T10:00:00'),
  },
];

export default function ChildAccounts({ onCancel, onCreateAccount }: ChildAccountsProps) {
  const [children, setChildren] = useState<ChildAccount[]>(DEFAULT_CHILDREN);
  const [sessions, setSessions] = useState<ScreenTimeSession[]>(DEFAULT_SESSIONS);
  const [logs, setLogs] = useState<ActivityLog[]>(DEFAULT_LOGS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedChild, setSelectedChild] = useState('child-1');
  const [activeTab, setActiveTab] = useState<'accounts' | 'screentime' | 'logs'>('accounts');

  const activeChildren = children.filter(c => c.isActive).length;
  const totalSessions = sessions.length;
  const totalLogs = logs.length;

  const getFilterLevelColor = (level: string) => {
    switch (level) {
      case 'strict':
        return 'text-red-500';
      case 'moderate':
        return 'text-yellow-500';
      case 'none':
        return 'text-green-500';
      default:
        return 'text-slate-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <Unlock className="h-3 w-3" />;
      case 'logout':
        return <Lock className="h-3 w-3" />;
      case 'content_viewed':
        return <Eye className="h-3 w-3" />;
      case 'content_blocked':
        return <EyeOff className="h-3 w-3" />;
      case 'limit_reached':
        return <Timer className="h-3 w-3" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  const handleToggleActive = (childId: string) => {
    setChildren(children.map(c => 
      c.id === childId ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const handleUpdateScreenTime = (childId: string, limit: number) => {
    setChildren(children.map(c => 
      c.id === childId ? { ...c, screenTimeLimit: limit } : c
    ));
  };

  const handleUpdateFilterLevel = (childId: string, level: 'strict' | 'moderate' | 'none') => {
    setChildren(children.map(c => 
      c.id === childId ? { ...c, contentFilterLevel: level } : c
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <Baby className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tài khoản trẻ em
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeChildren} active accounts
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
            Cài đặt child accounts
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-logout on limit
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Content filtering
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Activity logging
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
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Active</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {activeChildren}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Timer className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Sessions</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalSessions}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Logs</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalLogs}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Protected</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {children.length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('accounts')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'accounts'
                ? 'bg-pink-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Accounts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('screentime')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'screentime'
                ? 'bg-pink-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Screen Time
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'logs'
                ? 'bg-pink-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Activity Logs
          </button>
        </div>
      </div>

      {/* Accounts Tab */}
      {activeTab === 'accounts' && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Child Accounts
            </h4>
            <button
              type="button"
              onClick={onCreateAccount}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Plus className="h-3 w-3" />
              Add Account
            </button>
          </div>
          <div className="space-y-2">
            {children.map((child) => (
              <div
                key={child.id}
                className={`p-4 rounded-lg border-2 ${
                  child.isActive
                    ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                      <Baby className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {child.name}
                      </span>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Age: {child.age}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(child.id)}
                    className={`p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded`}
                    title={child.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {child.isActive ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Lock className="h-4 w-4 text-slate-500" />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Screen Time</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {child.currentScreenTime}/{child.screenTimeLimit}m
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Filter</div>
                    <div className={`text-xs ${getFilterLevelColor(child.contentFilterLevel)} capitalize`}>
                      {child.contentFilterLevel}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Created</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {child.createdAt.toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-400 to-rose-500"
                      style={{ width: `${(child.currentScreenTime / child.screenTimeLimit) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {((child.currentScreenTime / child.screenTimeLimit) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screen Time Tab */}
      {activeTab === 'screentime' && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Screen Time Management
          </h4>
          <div className="space-y-2">
            {children.map((child) => (
              <div
                key={child.id}
                className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {child.name}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {child.currentScreenTime}m used
                  </span>
                </div>

                <div className="mb-2">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Daily Limit: {child.screenTimeLimit} minutes
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="180"
                    step="15"
                    value={child.screenTimeLimit}
                    onChange={(e) => handleUpdateScreenTime(child.id, parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Content Filter
                  </label>
                  <select
                    value={child.contentFilterLevel}
                    onChange={(e) => handleUpdateFilterLevel(child.id, e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  >
                    <option value="strict">Strict</option>
                    <option value="moderate">Moderate</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Logs Tab */}
      {activeTab === 'logs' && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Activity Logs
          </h4>
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-start gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${log.type === 'content_blocked' ? 'text-red-500' : 'text-slate-500'}`}>
                    {getTypeIcon(log.type)}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                      {log.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {' '}{log.description}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {log.timestamp.toLocaleDateString('vi-VN')} at {log.timestamp.toLocaleTimeString('vi-VN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 rounded-lg">
        <p className="text-[10px] text-pink-700 dark:text-pink-400">
          <strong>Lưu ý:</strong> Tài khoản trẻ em cho phép tạo tài khoản an toàn cho trẻ em với screen time limits, content filtering, activity logging, và parental controls.
        </p>
      </div>
    </div>
  );
}