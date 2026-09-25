'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Filter,
  Image,
  Info,
  MessageSquare,
  RefreshCw,
  Search,
  Shield,
  Tag,
  User,
  Video,
  XCircle,
  Zap
} from 'lucide-react';

interface ContentReviewInterfaceProps {
  onCancel?: () => void;
}

interface ContentItem {
  id: string;
  type: 'memory' | 'comment' | 'photo' | 'video';
  content: string;
  author: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  tags: string[];
  metadata: {
    location?: string;
    mentions?: string[];
  };
}

export default function ContentReviewInterface({ onCancel }: ContentReviewInterfaceProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedType, setSelectedType] = useState<string>('all');

  const [contentItems, setContentItems] = useState<ContentItem[]>([
    { id: '1', type: 'memory', content: 'Summer vacation at the beach with family. Best memories ever!', author: 'user_123', date: '2026-09-14', status: 'pending', tags: ['vacation', 'beach', 'family'], metadata: { location: 'Da Nang, Vietnam', mentions: ['user_456'] } },
    { id: '2', type: 'comment', content: 'Great photo! Love the colors and composition.', author: 'user_789', date: '2026-09-13', status: 'pending', tags: ['positive'], metadata: {} },
    { id: '3', type: 'photo', content: 'Sunset view from the mountain peak', author: 'user_321', date: '2026-09-12', status: 'approved', tags: ['sunset', 'mountain', 'nature'], metadata: { location: 'Sapa, Vietnam' } },
    { id: '4', type: 'video', content: 'Family trip to Ha Long Bay', author: 'user_654', date: '2026-09-11', status: 'pending', tags: ['travel', 'family', 'bay'], metadata: { location: 'Ha Long Bay, Vietnam' } },
    { id: '5', type: 'memory', content: 'First day at university - exciting new chapter!', author: 'user_987', date: '2026-09-10', status: 'rejected', tags: ['university', 'milestone'], metadata: {} },
  ]);

  const filteredItems = selectedType === 'all' ? contentItems : contentItems.filter(item => item.type === selectedType);
  const currentItem = filteredItems[currentIndex];

  const approveContent = () => {
    if (currentItem) {
      setContentItems(contentItems.map(item => item.id === currentItem.id ? { ...item, status: 'approved' } : item));
      goToNext();
    }
  };

  const rejectContent = () => {
    if (currentItem) {
      setContentItems(contentItems.map(item => item.id === currentItem.id ? { ...item, status: 'rejected' } : item));
      goToNext();
    }
  };

  const skipContent = () => {
    goToNext();
  };

  const goToNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(filteredItems.length - 1);
    }
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
      case 'approved': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <Eye className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Content Review Interface
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review and approve/reject content
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
            <p className="text-lg font-bold text-slate-900 dark:text-white">{contentItems.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pending</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{contentItems.filter(i => i.status === 'pending').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Approved</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{contentItems.filter(i => i.status === 'approved').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Rejected</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{contentItems.filter(i => i.status === 'rejected').length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentIndex(0);
            }}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Types</option>
            <option value="memory">Memories</option>
            <option value="comment">Comments</option>
            <option value="photo">Photos</option>
            <option value="video">Videos</option>
          </select>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        {currentItem && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getTypeIcon(currentItem.type)}
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  {currentItem.type.charAt(0).toUpperCase() + currentItem.type.slice(1)} #{currentIndex + 1}/{filteredItems.length}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(currentItem.status)}`}>
                  {currentItem.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToPrevious}
                  disabled={filteredItems.length <= 1}
                  className="p-1 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  disabled={filteredItems.length <= 1}
                  className="p-1 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded disabled:opacity-50"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-900 dark:text-white mb-2">{currentItem.content}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentItem.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <User className="h-3 w-3" />
                  <span>{currentItem.author}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Calendar className="h-3 w-3" />
                  <span>{currentItem.date}</span>
                </div>
                {currentItem.metadata.location && (
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Zap className="h-3 w-3" />
                    <span>{currentItem.metadata.location}</span>
                  </div>
                )}
                {currentItem.metadata.mentions && currentItem.metadata.mentions.length > 0 && (
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Shield className="h-3 w-3" />
                    <span>{currentItem.metadata.mentions.length} mentions</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={approveContent}
                  className="flex-1 px-4 py-2 rounded-lg text-sm bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-1"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={rejectContent}
                  className="flex-1 px-4 py-2 rounded-lg text-sm bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
                <button
                  type="button"
                  onClick={skipContent}
                  className="px-4 py-2 rounded-lg text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center gap-1"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Review Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Review content context before making decisions</li>
              <li>• Check metadata for additional information</li>
              <li>• Use navigation arrows to browse items</li>
              <li>• Skip if unsure, mark for later review</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
