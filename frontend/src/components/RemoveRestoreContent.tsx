'use client';

import { useState } from 'react';
import { Trash2, RefreshCw, CheckCircle, XCircle, AlertTriangle, Info, Undo2, FileText, Image, Video, MessageSquare, Search, Filter, Calendar, User, ArrowUpRight } from 'lucide-react';

interface RemoveRestoreContentProps {
  onCancel?: () => void;
}

interface ContentItem {
  id: string;
  type: 'memory' | 'comment' | 'photo' | 'video';
  content: string;
  author: string;
  status: 'active' | 'removed' | 'restored';
  removedAt?: string;
  removedBy?: string;
  reason?: string;
  date: string;
}

export default function RemoveRestoreContent({ onCancel }: RemoveRestoreContentProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [contentItems, setContentItems] = useState<ContentItem[]>([
    { id: '1', type: 'memory', content: 'Inappropriate content removed', author: 'user_123', status: 'removed', removedAt: '2026-09-14', removedBy: 'admin', reason: 'Violation of community guidelines', date: '2026-09-10' },
    { id: '2', type: 'comment', content: 'Spam comment removed', author: 'user_456', status: 'removed', removedAt: '2026-09-13', removedBy: 'system', reason: 'Auto-detected spam', date: '2026-09-12' },
    { id: '3', type: 'photo', content: 'Restored photo after review', author: 'user_789', status: 'restored', removedAt: '2026-09-11', removedBy: 'admin', reason: 'False positive', date: '2026-09-09' },
    { id: '4', type: 'video', content: 'Active video content', author: 'user_321', status: 'active', date: '2026-09-14' },
    { id: '5', type: 'memory', content: 'Harassment removed', author: 'user_654', status: 'removed', removedAt: '2026-09-12', removedBy: 'admin', reason: 'Harassment', date: '2026-09-08' },
  ]);

  const [removedItems, setRemovedItems] = useState([
    { id: '6', type: 'comment', content: 'Old spam comment', author: 'user_987', status: 'removed', removedAt: '2026-09-01', removedBy: 'system', reason: 'Spam', date: '2026-08-30' },
  ]);

  const filteredItems = [...contentItems, ...removedItems].filter(item => {
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesSearch = item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const removeContent = (id: string) => {
    const item = [...contentItems, ...removedItems].find(i => i.id === id);
    if (item) {
      const updatedItem = { ...item, status: 'removed' as const, removedAt: new Date().toISOString().split('T')[0], removedBy: 'admin', reason: 'Manual removal' };
      setContentItems(contentItems.map(i => i.id === id ? updatedItem : i));
    }
  };

  const restoreContent = (id: string) => {
    const item = [...contentItems, ...removedItems].find(i => i.id === id);
    if (item) {
      const updatedItem = { ...item, status: 'restored' as const };
      setContentItems(contentItems.map(i => i.id === id ? updatedItem : i));
    }
  };

  const permanentDelete = (id: string) => {
    setContentItems(contentItems.filter(i => i.id !== id));
    setRemovedItems(removedItems.filter(i => i.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'memory': return <MessageSquare className="h-4 w-4" />;
      case 'comment': return <MessageSquare className="h-4 w-4" />;
      case 'photo': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'removed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'restored': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-orange-500 rounded-xl">
            <Trash2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Remove/Restore Content
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage content removal and restoration
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Items</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{contentItems.length + removedItems.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{contentItems.filter(i => i.status === 'active').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Removed</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{contentItems.filter(i => i.status === 'removed').length + removedItems.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Restored</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{contentItems.filter(i => i.status === 'restored').length}</p>
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
            <option value="removed">Removed</option>
            <option value="restored">Restored</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search content..."
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

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Content Items</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredItems.map((item) => (
              <div key={item.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{item.date}</span>
                </div>
                <p className="text-xs text-slate-900 dark:text-white line-clamp-1 mb-2">{item.content}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {item.author}
                  </span>
                  {item.removedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Removed: {item.removedAt}
                    </span>
                  )}
                  {item.reason && (
                    <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded">
                      {item.reason}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {item.status === 'active' && (
                    <button
                      type="button"
                      onClick={() => removeContent(item.id)}
                      className="flex-1 px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove
                    </button>
                  )}
                  {item.status === 'removed' && (
                    <>
                      <button
                        type="button"
                        onClick={() => restoreContent(item.id)}
                        className="flex-1 px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-1"
                      >
                        <Undo2 className="h-3 w-3" />
                        Restore
                      </button>
                      <button
                        type="button"
                        onClick={() => permanentDelete(item.id)}
                        className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1"
                      >
                        <XCircle className="h-3 w-3" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Content Management Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Always provide reason for content removal</li>
              <li>• Review removed content before permanent deletion</li>
              <li>• Keep track of removal reasons for patterns</li>
              <li>• Allow appeals for controversial removals</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
