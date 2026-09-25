'use client';

import { useState } from 'react';
import { History, X, RefreshCw, CheckCircle, XCircle, AlertTriangle, Info, Search, Filter, Calendar, User, Shield, FileText, Download, Trash2, Clock } from 'lucide-react';

interface ModerationHistoryProps {
  onCancel?: () => void;
}

interface ModerationAction {
  id: string;
  action: 'approved' | 'rejected' | 'removed' | 'restored' | 'flagged';
  contentType: 'memory' | 'comment' | 'photo' | 'video';
  contentId: string;
  contentSummary: string;
  moderator: string;
  timestamp: string;
  reason?: string;
  status: 'completed' | 'pending' | 'overturned';
}

export default function ModerationHistory({ onCancel }: ModerationHistoryProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedContentType, setSelectedContentType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [moderationActions, setModerationActions] = useState<ModerationAction[]>([
    { id: '1', action: 'approved', contentType: 'memory', contentId: 'mem_123', contentSummary: 'Summer vacation memory', moderator: 'admin_1', timestamp: '2026-09-14 14:30:00', status: 'completed' },
    { id: '2', action: 'rejected', contentType: 'comment', contentId: 'com_456', contentSummary: 'Inappropriate comment', moderator: 'admin_1', timestamp: '2026-09-14 14:25:00', reason: 'Offensive language', status: 'completed' },
    { id: '3', action: 'removed', contentType: 'photo', contentId: 'photo_789', contentSummary: 'NSFW image', moderator: 'system', timestamp: '2026-09-14 14:20:00', reason: 'Auto-detected NSFW', status: 'completed' },
    { id: '4', action: 'restored', contentType: 'memory', contentId: 'mem_321', contentSummary: 'Restored memory', moderator: 'admin_2', timestamp: '2026-09-13 16:45:00', reason: 'False positive', status: 'completed' },
    { id: '5', action: 'flagged', contentType: 'video', contentId: 'vid_654', contentSummary: 'Flagged video', moderator: 'user_987', timestamp: '2026-09-13 15:30:00', reason: 'Copyright violation', status: 'pending' },
    { id: '6', action: 'rejected', contentType: 'comment', contentId: 'com_111', contentSummary: 'Spam comment', moderator: 'admin_1', timestamp: '2026-09-12 10:15:00', reason: 'Spam', status: 'overturned' },
  ]);

  const filteredActions = moderationActions.filter(action => {
    const matchesAction = selectedAction === 'all' || action.action === selectedAction;
    const matchesContentType = selectedContentType === 'all' || action.contentType === selectedContentType;
    const matchesSearch = action.contentSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         action.moderator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAction && matchesContentType && matchesSearch;
  });

  const exportHistory = () => {
    // Export moderation history
  };

  const clearHistory = () => {
    setModerationActions([]);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'removed': return <Trash2 className="h-4 w-4" />;
      case 'restored': return <RefreshCw className="h-4 w-4" />;
      case 'flagged': return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'approved': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'removed': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'restored': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'flagged': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'overturned': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <History className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Moderation History
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track all moderation actions
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Actions</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{moderationActions.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Completed</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{moderationActions.filter(a => a.status === 'completed').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pending</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{moderationActions.filter(a => a.status === 'pending').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Overturned</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{moderationActions.filter(a => a.status === 'overturned').length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Actions</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="removed">Removed</option>
            <option value="restored">Restored</option>
            <option value="flagged">Flagged</option>
          </select>
          <select
            value={selectedContentType}
            onChange={(e) => setSelectedContentType(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Types</option>
            <option value="memory">Memories</option>
            <option value="comment">Comments</option>
            <option value="photo">Photos</option>
            <option value="video">Videos</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history..."
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 flex-1"
          />
          <button
            type="button"
            onClick={exportHistory}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Export
          </button>
          <button
            type="button"
            onClick={clearHistory}
            className="px-3 py-1.5 rounded-lg text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-0 flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" />
            Clear
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Moderation Actions</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredActions.map((action) => (
              <div key={action.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getActionIcon(action.action)}
                    <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${getActionColor(action.action)}`}>
                      {action.action.charAt(0).toUpperCase() + action.action.slice(1)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{action.contentType}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(action.status)}`}>
                    {action.status}
                  </span>
                </div>
                <p className="text-xs text-slate-900 dark:text-white mb-1">{action.contentSummary}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {action.moderator}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {action.timestamp}
                  </span>
                </div>
                {action.reason && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">{action.reason}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">History Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Use filters to find specific actions</li>
              <li>• Export history for audit purposes</li>
              <li>• Monitor overturned decisions for patterns</li>
              <li>• Regular review of moderation actions</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
