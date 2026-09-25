'use client';

import { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Bug,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Filter,
  Info,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  Zap
} from 'lucide-react';

interface ErrorLogViewerProps {
  onCancel?: () => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info' | 'debug';
  message: string;
  source: string;
  userId?: string;
  stackTrace?: string;
}

export default function ErrorLogViewer({ onCancel }: ErrorLogViewerProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: '2026-09-14 14:32:15', level: 'error', message: 'Database connection failed', source: 'api/users', userId: 'user_123', stackTrace: 'Error: Connection timeout\n  at Database.connect (db.js:45)\n  at UserAPI.getUsers (api/users.js:12)' },
    { id: '2', timestamp: '2026-09-14 14:30:45', level: 'warning', message: 'API rate limit approaching', source: 'api/memories', userId: 'user_456' },
    { id: '3', timestamp: '2026-09-14 14:28:20', level: 'error', message: 'File upload failed: size too large', source: 'api/upload', userId: 'user_789' },
    { id: '4', timestamp: '2026-09-14 14:25:10', level: 'info', message: 'User login successful', source: 'auth/login', userId: 'user_123' },
    { id: '5', timestamp: '2026-09-14 14:22:55', level: 'warning', message: 'Memory cache miss', source: 'cache/memories' },
    { id: '6', timestamp: '2026-09-14 14:20:30', level: 'debug', message: 'Query execution time: 150ms', source: 'db/query' },
    { id: '7', timestamp: '2026-09-14 14:18:15', level: 'error', message: 'Payment gateway timeout', source: 'api/payment', userId: 'user_321' },
    { id: '8', timestamp: '2026-09-14 14:15:45', level: 'info', message: 'Backup completed successfully', source: 'backup/scheduler' },
  ]);

  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const clearLogs = () => {
    setLogs([]);
  };

  const exportLogs = () => {
    // Export logs to file
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <Info className="h-4 w-4" />;
      case 'debug': return <Bug className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'info': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'debug': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-orange-500 rounded-xl">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Error Log Viewer
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              View and analyze system logs
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
            <p className="text-lg font-bold text-slate-900 dark:text-white">{logs.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Errors</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{logs.filter(l => l.level === 'error').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Warnings</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{logs.filter(l => l.level === 'warning').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Filtered</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{filteredLogs.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Levels</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs..."
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 flex-1"
          />
          <button
            type="button"
            onClick={exportLogs}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Export
          </button>
          <button
            type="button"
            onClick={clearLogs}
            className="px-3 py-1.5 rounded-lg text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-0 flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" />
            Clear
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Log Entries</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${getLevelColor(log.level)}`}>
                      {getLevelIcon(log.level)}
                      {log.level.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {log.timestamp}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{log.source}</span>
                </div>
                <p className="text-xs text-slate-900 dark:text-white line-clamp-1">{log.message}</p>
                {log.userId && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">User: {log.userId}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {selectedLog && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Log Details</h4>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Timestamp:</span>
                <span className="text-slate-900 dark:text-white">{selectedLog.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Level:</span>
                <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${getLevelColor(selectedLog.level)}`}>
                  {getLevelIcon(selectedLog.level)}
                  {selectedLog.level.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Source:</span>
                <span className="text-slate-900 dark:text-white">{selectedLog.source}</span>
              </div>
              {selectedLog.userId && (
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">User ID:</span>
                  <span className="text-slate-900 dark:text-white">{selectedLog.userId}</span>
                </div>
              )}
              <div>
                <span className="text-slate-500 dark:text-slate-400">Message:</span>
                <p className="text-slate-900 dark:text-white mt-1">{selectedLog.message}</p>
              </div>
              {selectedLog.stackTrace && (
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Stack Trace:</span>
                  <pre className="text-slate-900 dark:text-white mt-1 bg-slate-100 dark:bg-slate-800 p-2 rounded text-xs overflow-x-auto">
                    {selectedLog.stackTrace}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Log Management Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Filter by level to focus on critical issues</li>
              <li>• Search by message or source to find specific logs</li>
              <li>• Export logs for external analysis</li>
              <li>• Regularly clear old logs to manage storage</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
