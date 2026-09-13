'use client';

import { useState } from 'react';
import { Bell, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Link, Clock, Send, Smartphone, Globe, Eye, Trash2, Plus, Calendar, Tag, Target, ExternalLink } from 'lucide-react';

interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  body: string;
  deepLink: string;
  platform: 'ios' | 'android' | 'both';
  enabled: boolean;
  sentCount: number;
  openedCount: number;
  lastSent: Date | null;
}

interface ScheduledNotification {
  id: string;
  templateId: string;
  scheduledFor: Date;
  status: 'pending' | 'sent' | 'failed';
  targetAudience: string;
}

interface PushNotificationsDeepLinksProps {
  onCancel?: () => void;
  onSendNotification?: (templateId: string) => Promise<void>;
  onScheduleNotification?: (notification: Omit<ScheduledNotification, 'id' | 'status'>) => Promise<ScheduledNotification>;
  onDeleteTemplate?: (templateId: string) => Promise<void>;
}

const DEFAULT_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Memory Reminder',
    title: 'Memory Reminder',
    body: 'You have a memory to check out!',
    deepLink: 'memorymap://memories/123',
    platform: 'both',
    enabled: true,
    sentCount: 1250,
    openedCount: 890,
    lastSent: new Date(),
  },
  {
    id: 'tpl-2',
    name: 'New Memory Created',
    title: 'New Memory Added',
    body: 'A new memory has been added to your collection',
    deepLink: 'memorymap://memories/new',
    platform: 'both',
    enabled: true,
    sentCount: 5420,
    openedCount: 3200,
    lastSent: new Date(Date.now() - 3600000),
  },
  {
    id: 'tpl-3',
    name: 'Weekly Summary',
    title: 'Your Weekly Summary',
    body: 'Check out your memory activity this week',
    deepLink: 'memorymap://analytics/weekly',
    platform: 'both',
    enabled: false,
    sentCount: 890,
    openedCount: 650,
    lastSent: new Date(Date.now() - 86400000 * 7),
  },
];

const DEFAULT_SCHEDULED: ScheduledNotification[] = [
  {
    id: 'sched-1',
    templateId: 'tpl-1',
    scheduledFor: new Date(Date.now() + 3600000),
    status: 'pending',
    targetAudience: 'all',
  },
  {
    id: 'sched-2',
    templateId: 'tpl-2',
    scheduledFor: new Date(Date.now() + 86400000),
    status: 'pending',
    targetAudience: 'active',
  },
];

export default function PushNotificationsDeepLinks({ onCancel, onSendNotification, onScheduleNotification, onDeleteTemplate }: PushNotificationsDeepLinksProps) {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(DEFAULT_TEMPLATES);
  const [scheduled, setScheduled] = useState<ScheduledNotification[]>(DEFAULT_SCHEDULED);
  const [showSettings, setShowSettings] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);

  const handleSend = async (templateId: string) => {
    if (onSendNotification) {
      await onSendNotification(templateId);
    }
    setTemplates(prev => prev.map(t => 
      t.id === templateId 
        ? { ...t, sentCount: t.sentCount + 1, lastSent: new Date() }
        : t
    ));
  };

  const handleDelete = async (templateId: string) => {
    if (onDeleteTemplate) {
      await onDeleteTemplate(templateId);
    }
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const toggleTemplate = (templateId: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, enabled: !t.enabled } : t
    ));
  };

  const openRate = (template: NotificationTemplate) => {
    return template.sentCount > 0 
      ? ((template.openedCount / template.sentCount) * 100).toFixed(1)
      : '0';
  };

  const enabledTemplates = templates.filter(t => t.enabled).length;
  const totalSent = templates.reduce((sum, t) => sum + t.sentCount, 0);
  const totalOpened = templates.reduce((sum, t) => sum + t.openedCount, 0);
  const avgOpenRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Thông báo đẩy với deep links
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {enabledTemplates} templates • {avgOpenRate}% open rate
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Tạo template mới"
          >
            <Plus className="h-4 w-4 text-slate-500" />
          </button>
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
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt push notifications
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                iOS Push Notifications
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Android FCM
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Deep linking
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Sound
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">Default</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Templates</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {enabledTemplates}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Send className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Sent</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalSent.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Opened</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalOpened.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Open Rate</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgOpenRate}%
          </div>
        </div>
      </div>

      {/* Notification Templates */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Notification Templates
        </h4>
        <div className="space-y-2">
          {templates.map((template) => (
            <div
              key={template.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {template.name}
                  </span>
                  {template.enabled && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSend(template.id)}
                    className="px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white text-[10px] font-semibold rounded-lg transition-colors"
                  >
                    Send Test
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleTemplate(template.id)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      template.enabled ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        template.enabled ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(template.id)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="mb-2">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Title</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {template.title}
                </div>
              </div>

              <div className="mb-2">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Body</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {template.body}
                </div>
              </div>

              <div className="mb-2">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Deep Link</div>
                <div className="flex items-center gap-1">
                  <Link className="h-3 w-3 text-slate-500" />
                  <code className="text-xs text-slate-700 dark:text-slate-300">
                    {template.deepLink}
                  </code>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Sent</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {template.sentCount}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Opened</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {template.openedCount}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Open Rate</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {openRate(template)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Platform</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {template.platform}
                  </div>
                </div>
              </div>

              {template.lastSent && (
                <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                  <Clock className="h-3 w-3" />
                  <span>Last sent: {new Date(template.lastSent).toLocaleString('vi-VN')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Notifications */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Scheduled Notifications
        </h4>
        <div className="space-y-2">
          {scheduled.map((sched) => (
            <div
              key={sched.id}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {templates.find(t => t.id === sched.templateId)?.name || 'Unknown'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    sched.status === 'pending'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                      : sched.status === 'sent'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}>
                    {sched.status}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(sched.scheduledFor).toLocaleString('vi-VN')}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <Target className="h-3 w-3" />
                <span>Audience: {sched.targetAudience}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Tạo Notification Template
              </h4>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  placeholder="My Notification"
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Notification Title"
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Body
                </label>
                <textarea
                  placeholder="Notification body..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Deep Link
                </label>
                <input
                  type="text"
                  placeholder="memorymap://path"
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Platform
                </label>
                <select className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none">
                  <option value="both">Both</option>
                  <option value="ios">iOS</option>
                  <option value="android">Android</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-3 py-2 bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Tạo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> Thông báo đẩy với deep links hỗ trợ iOS/Android FCM, custom templates, scheduling, và deep linking để direct navigation.
        </p>
      </div>
    </div>
  );
}