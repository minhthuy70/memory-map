'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  Eye,
  Info,
  LogOut,
  Play,
  RefreshCw,
  Search,
  Shield,
  Square,
  User,
  UserCheck
} from 'lucide-react';

interface ImpersonateUserProps {
  onCancel?: () => void;
}

interface ImpersonationSession {
  id: string;
  targetUser: string;
  startedAt: string;
  duration: number;
  status: 'active' | 'ended';
  actions: number;
}

export default function ImpersonateUser({ onCancel }: ImpersonateUserProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [currentSession, setCurrentSession] = useState<ImpersonationSession | null>(null);

  const [users, setUsers] = useState([
    { id: '1', username: 'john_doe', email: 'john@example.com', role: 'user' },
    { id: '2', username: 'jane_smith', email: 'jane@example.com', role: 'moderator' },
    { id: '3', username: 'test_user', email: 'test@example.com', role: 'user' },
  ]);

  const [sessions, setSessions] = useState<ImpersonationSession[]>([
    { id: '1', targetUser: 'john_doe', startedAt: '2026-09-14 14:30:00', duration: 5, status: 'ended', actions: 12 },
    { id: '2', targetUser: 'jane_smith', startedAt: '2026-09-13 10:15:00', duration: 15, status: 'ended', actions: 8 },
  ]);

  const startImpersonation = () => {
    if (selectedUser) {
      const newSession: ImpersonationSession = {
        id: Date.now().toString(),
        targetUser: selectedUser,
        startedAt: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString(),
        duration: 0,
        status: 'active',
        actions: 0,
      };
      setCurrentSession(newSession);
      setIsImpersonating(true);
    }
  };

  const stopImpersonation = () => {
    if (currentSession) {
      const endedSession = {
        ...currentSession,
        status: 'ended' as const,
      };
      setSessions([...sessions, endedSession]);
      setCurrentSession(null);
      setIsImpersonating(false);
      setSelectedUser('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'ended': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <UserCog className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Impersonate User
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Debug as another user
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isImpersonating && (
            <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Impersonating
            </span>
          )}
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
        {isImpersonating && currentSession && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Active Session</h4>
              <button
                type="button"
                onClick={stopImpersonation}
                className="px-3 py-1.5 rounded-lg text-xs bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
              >
                <Stop className="h-3 w-3" />
                Stop Impersonation
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Target User:</span>
                <span className="text-slate-900 dark:text-white ml-1">{currentSession.targetUser}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Started:</span>
                <span className="text-slate-900 dark:text-white ml-1">{currentSession.startedAt}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Actions:</span>
                <span className="text-slate-900 dark:text-white ml-1">{currentSession.actions}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            disabled={isImpersonating}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 disabled:opacity-50"
          >
            <option value="">Select user to impersonate...</option>
            {users.map((user) => (
              <option key={user.id} value={user.username}>{user.username} ({user.role})</option>
            ))}
          </select>
          <button
            type="button"
            onClick={startImpersonation}
            disabled={!selectedUser || isImpersonating}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:text-slate-500 dark:disabled:text-slate-400 border-0 flex items-center gap-1"
          >
            <Play className="h-3 w-3" />
            Start Impersonation
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Impersonation History</h4>
          <div className="space-y-2">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{session.targetUser}</span>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.startedAt}
                      </span>
                      <span>{session.duration} min</span>
                      <span>{session.actions} actions</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(session.status)}`}>
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Impersonation Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Only impersonate for debugging purposes</li>
              <li>• Log all actions during impersonation</li>
              <li>• Stop impersonation immediately after debugging</li>
              <li>• Review impersonation history regularly</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
