'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Edit2,
  Eye,
  Info,
  Megaphone,
  Plus,
  RefreshCw,
  Send,
  Target,
  Trash2,
  Zap
} from 'lucide-react';

interface AnnouncementSystemProps {
  onCancel?: () => void;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  target: 'all' | 'premium' | 'beta' | 'specific';
  startDate: string;
  endDate: string;
  active: boolean;
  views: number;
  clicks: number;
}

export default function AnnouncementSystem({ onCancel }: AnnouncementSystemProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: '1', title: 'New AI Features', content: 'We are excited to announce new AI-powered features for memory analysis!', type: 'success', target: 'all', startDate: '2026-09-01', endDate: '2026-09-30', active: true, views: 5420, clicks: 1250 },
    { id: '2', title: 'Scheduled Maintenance', content: 'System maintenance scheduled for September 20th from 2-4 AM UTC.', type: 'warning', target: 'all', startDate: '2026-09-15', endDate: '2026-09-20', active: true, views: 3200, clicks: 180 },
    { id: '3', title: 'Beta Program', content: 'Join our beta program to test new features before public release.', type: 'info', target: 'beta', startDate: '2026-09-01', endDate: '2026-12-31', active: true, views: 890, clicks: 340 },
    { id: '4', title: 'Premium Discount', content: 'Limited time 50% off premium subscriptions!', type: 'urgent', target: 'premium', startDate: '2026-09-10', endDate: '2026-09-25', active: true, views: 2100, clicks: 890 },
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'urgent',
    target: 'all' as 'all' | 'premium' | 'beta' | 'specific',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const toggleAnnouncement = (id: string) => {
    setAnnouncements(announcements.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const startCreating = () => {
    setIsCreating(true);
    setNewAnnouncement({
      title: '',
      content: '',
      type: 'info',
      target: 'all',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
  };

  const cancelCreating = () => {
    setIsCreating(false);
    setNewAnnouncement({
      title: '',
      content: '',
      type: 'info',
      target: 'all',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
  };

  const createAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.content && newAnnouncement.endDate) {
      const newId = Date.now().toString();
      setAnnouncements([...announcements, {
        id: newId,
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        type: newAnnouncement.type,
        target: newAnnouncement.target,
        startDate: newAnnouncement.startDate,
        endDate: newAnnouncement.endDate,
        active: true,
        views: 0,
        clicks: 0,
      }]);
      cancelCreating();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'urgent': return <Zap className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'success': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'urgent': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getTargetColor = (target: string) => {
    switch (target) {
      case 'all': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'premium': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'beta': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'specific': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Megaphone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Announcement System
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage site-wide announcements
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Announcements</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{announcements.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{announcements.filter(a => a.active).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Views</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{announcements.reduce((sum, a) => sum + a.views, 0).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Clicks</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{announcements.reduce((sum, a) => sum + a.clicks, 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={startCreating}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            New Announcement
          </button>
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Create New Announcement</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Title</label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="Enter announcement title..."
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Content</label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  placeholder="Enter announcement content..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Type</label>
                  <select
                    value={newAnnouncement.type}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Target</label>
                  <select
                    value={newAnnouncement.target}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, target: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                  >
                    <option value="all">All Users</option>
                    <option value="premium">Premium</option>
                    <option value="beta">Beta</option>
                    <option value="specific">Specific</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Start Date</label>
                  <input
                    type="date"
                    value={newAnnouncement.startDate}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">End Date</label>
                  <input
                    type="date"
                    value={newAnnouncement.endDate}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={createAnnouncement}
                  disabled={!newAnnouncement.title || !newAnnouncement.content || !newAnnouncement.endDate}
                  className="flex-1 px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:text-slate-500 dark:disabled:text-slate-400 transition-colors"
                >
                  Create Announcement
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Announcements</h4>
          <div className="space-y-2">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleAnnouncement(announcement.id)}
                    className={`p-2 rounded-lg transition-colors ${announcement.active ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}
                  >
                    <Bell className="h-4 w-4" />
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{announcement.title}</span>
                      <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${getTypeColor(announcement.type)}`}>
                        {getTypeIcon(announcement.type)}
                        {announcement.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{announcement.content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs ${getTargetColor(announcement.target)}`}>
                        {announcement.target}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {announcement.startDate} - {announcement.endDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {announcement.views.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {announcement.clicks.toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteAnnouncement(announcement.id)}
                    className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Announcement Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Use urgent type for critical notifications</li>
              <li>• Target specific user groups when relevant</li>
              <li>• Monitor views and clicks for engagement</li>
              <li>• Set appropriate start/end dates</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
