'use client';

import { useState } from 'react';
import { Bell, X, Plus, Trash2, RefreshCw, Clock, CheckCircle, AlertTriangle, Link, Calendar, Tag, Settings, Info, BarChart3, Smartphone, Volume2, Vibrate, Moon, Sun } from 'lucide-react';

interface PushNotificationsDeepLinksProps {
  onCancel?: () => void;
}

interface NotificationRule {
  id: string;
  name: string;
  type: 'reminder' | 'milestone' | 'social' | 'daily' | 'custom';
  trigger: string;
  deepLink: string;
  enabled: boolean;
  sound: string;
  vibration: boolean;
}

export default function PushNotificationsDeepLinks({ onCancel }: PushNotificationsDeepLinksProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const [rules, setRules] = useState<NotificationRule[]>([
    {
      id: '1',
      name: 'Daily Memory Reminder',
      type: 'daily',
      trigger: 'Every day at 9:00 AM',
      deepLink: '/memories/create',
      enabled: true,
      sound: 'default',
      vibration: true,
    },
    {
      id: '2',
      name: 'Streak Warning',
      type: 'reminder',
      trigger: 'When streak at risk (before midnight)',
      deepLink: '/memories/create',
      enabled: true,
      sound: 'urgent',
      vibration: true,
    },
    {
      id: '3',
      name: 'Milestone Achievement',
      type: 'milestone',
      trigger: 'When milestone is reached',
      deepLink: '/achievements',
      enabled: true,
      sound: 'celebration',
      vibration: true,
    },
    {
      id: '4',
      name: 'New Memory Like',
      type: 'social',
      trigger: 'When someone likes your memory',
      deepLink: '/memories/{id}',
      enabled: false,
      sound: 'subtle',
      vibration: false,
    },
    {
      id: '5',
      name: 'Weekly Summary',
      type: 'custom',
      trigger: 'Every Sunday at 8:00 PM',
      deepLink: '/analytics/weekly',
      enabled: true,
      sound: 'default',
      vibration: false,
    },
  ]);

  const [notificationHistory] = useState([
    { id: '1', title: 'Daily Memory Reminder', body: 'Don\'t forget to log your memory today!', time: '2026-09-14 09:00', opened: true },
    { id: '2', title: 'Streak Warning', body: 'Your streak is at risk! Log a memory before midnight.', time: '2026-09-13 23:00', opened: true },
    { id: '3', title: 'Milestone Achievement', body: 'Congratulations! You reached 100 memories!', time: '2026-09-12 14:30', opened: true },
    { id: '4', title: 'Weekly Summary', body: 'Check out your weekly memory summary.', time: '2026-09-10 20:00', opened: false },
  ]);

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => {
      if (rule.id === id) {
        return { ...rule, enabled: !rule.enabled };
      }
      return rule;
    }));
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const enabledCount = rules.filter(r => r.enabled).length;
  const totalCount = rules.length;
  const openedCount = notificationHistory.filter(n => n.opened).length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Push Notifications
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure notifications with deep links
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show history"
          >
            {showHistory ? <BarChart3 className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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
        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${notificationsEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-lg">
                  {notificationsEnabled ? 'Notifications Enabled' : 'Notifications Disabled'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {notificationsEnabled ? 'Push notifications are active' : 'Push notifications are turned off'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${notificationsEnabled ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
            >
              {notificationsEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Rules</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{enabledCount}/{totalCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Notifications Sent</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{notificationHistory.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Opened</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{openedCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Open Rate</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{Math.round((openedCount / notificationHistory.length) * 100)}%</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-500 text-white border-0 flex items-center gap-1 hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-3 w-3" />
            Add Rule
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Test Notification
          </button>
        </div>

        {showHistory && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Notification History</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {notificationHistory.map((notif) => (
                <div key={notif.id} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{notif.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{notif.body}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{notif.time}</p>
                    {notif.opened ? (
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        <span>Opened</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Unopened</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Notification Rules</h4>
          <div className="space-y-2">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`p-4 rounded-lg border ${rule.enabled ? 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30 opacity-60'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${rule.enabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                      <Bell className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{rule.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 capitalize">
                          {rule.type}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{rule.trigger}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleRule(rule.id)}
                      className={`p-1.5 rounded-lg transition-colors ${rule.enabled ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-700'}`}
                    >
                      {rule.enabled ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteRule(rule.id)}
                      className="p-1.5 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Link className="h-3 w-3" />
                    <span>Deep Link: {rule.deepLink}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Volume2 className="h-3 w-3" />
                    <span>Sound: {rule.sound}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Vibrate className="h-3 w-3" />
                    <span>Vibrate: {rule.vibration ? 'On' : 'Off'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Deep Link Configuration
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Deep links navigate directly to specific app screens</li>
            <li>• Supports dynamic parameters (e.g., /memories/{id})</li>
            <li>• Works even when app is closed</li>
            <li>• Custom sounds and vibration per notification type</li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Notification Settings
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• System notification permission required</li>
            <li>• Do Not Disturb mode may suppress notifications</li>
            <li>• Battery optimization can affect delivery</li>
            <li>• Configure quiet hours in system settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
