'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Filter,
  Gavel,
  Info,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  User,
  XCircle
} from 'lucide-react';

interface AppealSystemProps {
  onCancel?: () => void;
}

interface Appeal {
  id: string;
  originalAction: 'removed' | 'rejected' | 'flagged';
  contentType: 'memory' | 'comment' | 'photo' | 'video';
  contentId: string;
  contentSummary: string;
  appellant: string;
  reason: string;
  submittedAt: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  decisionReason?: string;
}

export default function AppealSystem({ onCancel }: AppealSystemProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [appeals, setAppeals] = useState<Appeal[]>([
    { id: '1', originalAction: 'removed', contentType: 'memory', contentId: 'mem_123', contentSummary: 'Summer vacation memory', appellant: 'user_123', reason: 'Content was incorrectly flagged as inappropriate', submittedAt: '2026-09-14', status: 'pending' },
    { id: '2', originalAction: 'rejected', contentType: 'comment', contentId: 'com_456', contentSummary: 'Helpful comment', appellant: 'user_456', reason: 'Comment was not spam', submittedAt: '2026-09-13', status: 'under_review', reviewedBy: 'admin_1' },
    { id: '3', originalAction: 'removed', contentType: 'photo', contentId: 'photo_789', contentSummary: 'Nature photo', appellant: 'user_789', reason: 'Photo is not NSFW', submittedAt: '2026-09-12', status: 'approved', reviewedBy: 'admin_2', reviewedAt: '2026-09-13', decisionReason: 'False positive confirmed' },
    { id: '4', originalAction: 'flagged', contentType: 'video', contentId: 'vid_654', contentSummary: 'Family video', appellant: 'user_321', reason: 'Video does not violate copyright', submittedAt: '2026-09-11', status: 'rejected', reviewedBy: 'admin_1', reviewedAt: '2026-09-12', decisionReason: 'Copyright violation confirmed' },
  ]);

  const [newAppeal, setNewAppeal] = useState({
    contentType: 'memory' as 'memory' | 'comment' | 'photo' | 'video',
    contentId: '',
    reason: '',
  });

  const filteredAppeals = appeals.filter(appeal => {
    const matchesStatus = selectedStatus === 'all' || appeal.status === selectedStatus;
    const matchesSearch = appeal.contentSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appeal.appellant.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appeal.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const approveAppeal = (id: string) => {
    setAppeals(appeals.map(appeal => appeal.id === id ? {
      ...appeal,
      status: 'approved' as const,
      reviewedBy: 'admin',
      reviewedAt: new Date().toISOString().split('T')[0],
      decisionReason: 'Appeal approved'
    } : appeal));
  };

  const rejectAppeal = (id: string) => {
    setAppeals(appeals.map(appeal => appeal.id === id ? {
      ...appeal,
      status: 'rejected' as const,
      reviewedBy: 'admin',
      reviewedAt: new Date().toISOString().split('T')[0],
      decisionReason: 'Appeal rejected - original decision upheld'
    } : appeal));
  };

  const startReview = (id: string) => {
    setAppeals(appeals.map(appeal => appeal.id === id ? { ...appeal, status: 'under_review' as const, reviewedBy: 'admin' } : appeal));
  };

  const deleteAppeal = (id: string) => {
    setAppeals(appeals.filter(appeal => appeal.id !== id));
  };

  const startCreating = () => {
    setIsCreating(true);
    setNewAppeal({ contentType: 'memory', contentId: '', reason: '' });
  };

  const cancelCreating = () => {
    setIsCreating(false);
    setNewAppeal({ contentType: 'memory', contentId: '', reason: '' });
  };

  const createAppeal = () => {
    if (newAppeal.contentId && newAppeal.reason) {
      const newId = Date.now().toString();
      setAppeals([...appeals, {
        id: newId,
        originalAction: 'removed',
        contentType: newAppeal.contentType,
        contentId: newAppeal.contentId,
        contentSummary: 'Appealed content',
        appellant: 'current_user',
        reason: newAppeal.reason,
        submittedAt: new Date().toISOString().split('T')[0],
        status: 'pending',
      }]);
      cancelCreating();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'under_review': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'approved': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'removed': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'flagged': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Gavel className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Appeal System
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage content moderation appeals
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Appeals</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{appeals.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pending</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{appeals.filter(a => a.status === 'pending').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Approved</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{appeals.filter(a => a.status === 'approved').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Rejected</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{appeals.filter(a => a.status === 'rejected').length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={startCreating}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            New Appeal
          </button>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search appeals..."
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

        {isCreating && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Create New Appeal</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Content Type</label>
                <select
                  value={newAppeal.contentType}
                  onChange={(e) => setNewAppeal({ ...newAppeal, contentType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                >
                  <option value="memory">Memory</option>
                  <option value="comment">Comment</option>
                  <option value="photo">Photo</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Content ID</label>
                <input
                  type="text"
                  value={newAppeal.contentId}
                  onChange={(e) => setNewAppeal({ ...newAppeal, contentId: e.target.value })}
                  placeholder="Enter content ID..."
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Appeal Reason</label>
                <textarea
                  value={newAppeal.reason}
                  onChange={(e) => setNewAppeal({ ...newAppeal, reason: e.target.value })}
                  placeholder="Explain why you believe the moderation decision was incorrect..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={createAppeal}
                  disabled={!newAppeal.contentId || !newAppeal.reason}
                  className="flex-1 px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:text-slate-500 dark:disabled:text-slate-400 transition-colors"
                >
                  Submit Appeal
                </button>
                <button
                  type="button"
                  onClick={cancelCreating}
                  className="px-4 py-2 rounded-lg text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Appeals</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredAppeals.map((appeal) => (
              <div key={appeal.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-slate-500" />
                    <div>
                      <span className={`px-2 py-0.5 rounded text-xs ${getActionColor(appeal.originalAction)}`}>
                        {appeal.originalAction.charAt(0).toUpperCase() + appeal.originalAction.slice(1)}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">{appeal.contentType}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(appeal.status)}`}>
                    {appeal.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-900 dark:text-white mb-1">{appeal.contentSummary}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 italic">{appeal.reason}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {appeal.appellant}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {appeal.submittedAt}
                  </span>
                </div>
                {appeal.decisionReason && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="font-semibold">Decision:</span> {appeal.decisionReason}
                  </p>
                )}
                <div className="flex gap-2">
                  {appeal.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => startReview(appeal.id)}
                      className="flex-1 px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1"
                    >
                      <Shield className="h-3 w-3" />
                      Start Review
                    </button>
                  )}
                  {appeal.status === 'under_review' && (
                    <>
                      <button
                        type="button"
                        onClick={() => approveAppeal(appeal.id)}
                        className="flex-1 px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => rejectAppeal(appeal.id)}
                        className="flex-1 px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1"
                      >
                        <XCircle className="h-3 w-3" />
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteAppeal(appeal.id)}
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Appeal Process Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Review appeals promptly and fairly</li>
              <li>• Provide clear reasons for decisions</li>
              <li>• Consider context when reviewing</li>
              <li>• Document decisions for future reference</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
