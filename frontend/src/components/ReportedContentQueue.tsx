'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Filter,
  Flag,
  Image,
  Info,
  MessageSquare,
  RefreshCw,
  Search,
  Shield,
  User,
  Video,
  XCircle,
  Zap
} from 'lucide-react';

interface ReportedContentQueueProps {
  onCancel?: () => void;
}

interface ReportedItem {
  id: string;
  type: 'memory' | 'comment' | 'photo' | 'video';
  content: string;
  reporter: string;
  reason: string;
  reportedDate: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reportCount: number;
}

export default function ReportedContentQueue({ onCancel }: ReportedContentQueueProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [reportedItems, setReportedItems] = useState<ReportedItem[]>([
    { id: '1', type: 'memory', content: 'Inappropriate content in memory description', reporter: 'user_123', reason: 'Offensive language', reportedDate: '2026-09-14', status: 'pending', priority: 'high', reportCount: 3 },
    { id: '2', type: 'comment', content: 'Spam comment with links', reporter: 'user_456', reason: 'Spam', reportedDate: '2026-09-14', status: 'pending', priority: 'medium', reportCount: 2 },
    { id: '3', type: 'photo', content: 'NSFW image uploaded', reporter: 'user_789', reason: 'NSFW content', reportedDate: '2026-09-13', status: 'pending', priority: 'urgent', reportCount: 5 },
    { id: '4', type: 'video', content: 'Copyrighted material', reporter: 'user_321', reason: 'Copyright violation', reportedDate: '2026-09-13', status: 'reviewed', priority: 'high', reportCount: 1 },
    { id: '5', type: 'memory', content: 'Harassment in memory', reporter: 'user_654', reason: 'Harassment', reportedDate: '2026-09-12', status: 'approved', priority: 'high', reportCount: 4 },
    { id: '6', type: 'comment', content: 'Hate speech comment', reporter: 'user_987', reason: 'Hate speech', reportedDate: '2026-09-12', status: 'rejected', priority: 'urgent', reportCount: 6 },
  ]);

  const [selectedItem, setSelectedItem] = useState<ReportedItem | null>(null);

  const filteredItems = reportedItems.filter(item => {
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;
    const matchesSearch = item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const approveReport = (id: string) => {
    setReportedItems(reportedItems.map(item => item.id === id ? { ...item, status: 'approved' } : item));
  };

  const rejectReport = (id: string) => {
    setReportedItems(reportedItems.map(item => item.id === id ? { ...item, status: 'rejected' } : item));
  };

  const markReviewed = (id: string) => {
    setReportedItems(reportedItems.map(item => item.id === id ? { ...item, status: 'reviewed' } : item));
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
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'reviewed': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'approved': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'low': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-orange-500 rounded-xl">
            <Flag className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Reported Content Queue
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review and moderate reported content
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Reports</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{reportedItems.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pending</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{reportedItems.filter(i => i.status === 'pending').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Urgent</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{reportedItems.filter(i => i.priority === 'urgent').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Filtered</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{filteredItems.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports..."
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Reported Items</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(item.priority)}`}>
                      {item.priority.toUpperCase()}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-900 dark:text-white line-clamp-1 mb-1">{item.content}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {item.reporter}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.reportedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Flag className="h-3 w-3" />
                    {item.reportCount} reports
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedItem && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Report Details</h4>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Type:</span>
                <span className="text-slate-900 dark:text-white flex items-center gap-1">
                  {getTypeIcon(selectedItem.type)}
                  {selectedItem.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Content:</span>
                <span className="text-slate-900 dark:text-white">{selectedItem.content}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Reporter:</span>
                <span className="text-slate-900 dark:text-white">{selectedItem.reporter}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Reason:</span>
                <span className="text-slate-900 dark:text-white">{selectedItem.reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Reported Date:</span>
                <span className="text-slate-900 dark:text-white">{selectedItem.reportedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Report Count:</span>
                <span className="text-slate-900 dark:text-white">{selectedItem.reportCount}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => approveReport(selectedItem.id)}
                  className="flex-1 px-3 py-2 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-1"
                >
                  <CheckCircle className="h-3 w-3" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => rejectReport(selectedItem.id)}
                  className="flex-1 px-3 py-2 rounded-lg text-xs bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1"
                >
                  <XCircle className="h-3 w-3" />
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => markReviewed(selectedItem.id)}
                  className="flex-1 px-3 py-2 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1"
                >
                  <Shield className="h-3 w-3" />
                  Mark Reviewed
                </button>
              </div>
            </div>
          </div>
        )}

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Moderation Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Prioritize urgent reports for immediate action</li>
              <li>• Review content context before making decisions</li>
              <li>• Track report patterns for repeat offenders</li>
              <li>• Document moderation decisions for appeals</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
