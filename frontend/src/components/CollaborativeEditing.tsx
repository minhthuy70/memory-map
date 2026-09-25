'use client';

import { useState } from 'react';
import { Edit3, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Users, Lock, Unlock, Eye, Save, RotateCcw, MessageSquare, Sparkles } from 'lucide-react';

interface ActiveUser {
  id: string;
  name: string;
  avatar: string;
  cursorX: number;
  cursorY: number;
  isEditing: boolean;
  lastActive: Date;
}

interface EditSession {
  id: string;
  memoryId: string;
  memoryTitle: string;
  activeUsers: string[];
  lockedBy: string | null;
  lockedAt: Date | null;
  autoSave: boolean;
  lastSaved: Date;
  conflictCount: number;
}

interface EditConflict {
  id: string;
  type: 'concurrent_edit' | 'version_mismatch' | 'merge_conflict';
  description: string;
  user: string;
  timestamp: Date;
  resolved: boolean;
}

interface CollaborativeEditingProps {
  onCancel?: () => void;
  onSave?: () => Promise<void>;
  onResolveConflict?: (conflictId: string) => Promise<void>;
}

const DEFAULT_USERS: ActiveUser[] = [
  {
    id: 'user-1',
    name: 'Dad',
    avatar: '/dad.jpg',
    cursorX: 150,
    cursorY: 200,
    isEditing: true,
    lastActive: new Date(),
  },
  {
    id: 'user-2',
    name: 'Mom',
    avatar: '/mom.jpg',
    cursorX: 300,
    cursorY: 250,
    isEditing: true,
    lastActive: new Date(),
  },
];

const DEFAULT_SESSIONS: EditSession[] = [
  {
    id: 'session-1',
    memoryId: 'mem-1',
    memoryTitle: 'Family Vacation 2024',
    activeUsers: ['user-1', 'user-2'],
    lockedBy: null,
    lockedAt: null,
    autoSave: true,
    lastSaved: new Date(),
    conflictCount: 0,
  },
  {
    id: 'session-2',
    memoryId: 'mem-2',
    memoryTitle: 'Birthday Party',
    activeUsers: ['user-3'],
    lockedBy: 'user-3',
    lockedAt: new Date(),
    autoSave: true,
    lastSaved: new Date('2024-01-12'),
    conflictCount: 1,
  },
];

const DEFAULT_CONFLICTS: EditConflict[] = [
  {
    id: 'conflict-1',
    type: 'concurrent_edit',
    description: 'Dad and Mom edited the same section',
    user: 'Mom',
    timestamp: new Date('2024-01-12'),
    resolved: false,
  },
];

export default function CollaborativeEditing({ onCancel, onSave, onResolveConflict }: CollaborativeEditingProps) {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>(DEFAULT_USERS);
  const [sessions, setSessions] = useState<EditSession[]>(DEFAULT_SESSIONS);
  const [conflicts, setConflicts] = useState<EditConflict[]>(DEFAULT_CONFLICTS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSession, setSelectedSession] = useState('session-1');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [conflictResolution, setConflictResolution] = useState<'manual' | 'auto' | 'timestamp'>('manual');

  const activeUsersCount = activeUsers.filter(u => u.isEditing).length;
  const totalSessions = sessions.length;
  const unresolvedConflicts = conflicts.filter(c => !c.resolved).length;

  const handleLockSession = (sessionId: string) => {
    setSessions(sessions.map(s => 
      s.id === sessionId ? { ...s, lockedBy: 'user-1', lockedAt: new Date() } : s
    ));
  };

  const handleUnlockSession = (sessionId: string) => {
    setSessions(sessions.map(s => 
      s.id === sessionId ? { ...s, lockedBy: null, lockedAt: null } : s
    ));
  };

  const handleResolveConflict = async (conflictId: string) => {
    await onResolveConflict?.(conflictId);
    setConflicts(conflicts.map(c => 
      c.id === conflictId ? { ...c, resolved: true } : c
    ));
  };

  const handleSave = async () => {
    await onSave?.();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <Edit3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Chỉnh sửa hợp tác
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeUsersCount} users editing
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
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt collaborative editing
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-save
              </span>
              <button
                type="button"
                onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoSaveEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoSaveEnabled ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Conflict resolution
              </label>
              <select
                value={conflictResolution}
                onChange={(e) => setConflictResolution(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="manual">Manual</option>
                <option value="auto">Auto-merge</option>
                <option value="timestamp">Timestamp-based</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Real-time cursors
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
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Active Users</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {activeUsersCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Edit3 className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Sessions</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalSessions}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Conflicts</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {unresolvedConflicts}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Save className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Auto-save</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {autoSaveEnabled ? 'On' : 'Off'}
          </div>
        </div>
      </div>

      {/* Active Users */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Active Users
        </h4>
        <div className="space-y-2">
          {activeUsers.map((user) => (
            <div
              key={user.id}
              className={`p-4 rounded-lg border-2 ${
                user.isEditing
                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                    <Users className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {user.name}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Cursor: ({user.cursorX}, {user.cursorY})
                    </div>
                  </div>
                </div>
                {user.isEditing && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full">
                    Editing
                  </span>
                )}
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Last active: {user.lastActive.toLocaleTimeString('vi-VN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Sessions */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Edit Sessions
        </h4>
        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-slate-500" />
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {session.memoryTitle}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {session.activeUsers.length} users
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {session.lockedBy ? (
                    <button
                      type="button"
                      onClick={() => handleUnlockSession(session.id)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                      title="Unlock"
                    >
                      <Unlock className="h-3 w-3 text-blue-500" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleLockSession(session.id)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                      title="Lock"
                    >
                      <Lock className="h-3 w-3 text-slate-500" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Locked By</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {session.lockedBy || 'None'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Last Saved</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {session.lastSaved.toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Conflicts</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {session.conflictCount}
                  </div>
                </div>
              </div>

              {session.lockedBy && (
                <div className="flex items-center gap-2 text-[10px] text-blue-600 dark:text-blue-400">
                  <Lock className="h-3 w-3" />
                  <span>Locked by {session.lockedBy} at {session.lockedAt?.toLocaleTimeString('vi-VN')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit Conflicts */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Edit Conflicts
        </h4>
        <div className="space-y-2">
          {conflicts.map((conflict) => (
            <div
              key={conflict.id}
              className={`p-4 rounded-lg border-2 ${
                conflict.resolved
                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                      {conflict.type.replace('_', ' ')}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      by {conflict.user}
                    </div>
                  </div>
                </div>
                {!conflict.resolved && (
                  <button
                    type="button"
                    onClick={() => handleResolveConflict(conflict.id)}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Resolve
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {conflict.description}
              </p>

              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {conflict.timestamp.toLocaleDateString('vi-VN')} at {conflict.timestamp.toLocaleTimeString('vi-VN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        <Save className="h-4 w-4" />
        Save Changes
      </button>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Chỉnh sửa hợp tác sử dụng real-time sync để nhiều người có thể chỉnh sửa cùng lúc với active users tracking, cursor positions, session locking, conflict resolution, và auto-save.
        </p>
      </div>
    </div>
  );
}