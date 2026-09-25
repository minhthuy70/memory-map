'use client';

import { useState } from 'react';
import {
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Home,
  Info,
  MapPin,
  Moon,
  RefreshCw,
  Star,
  Sun,
  Zap
} from 'lucide-react';

interface AIContextAwareNotificationsProps {
  onCancel?: () => void;
}

interface ContextTrigger {
  id: string;
  name: string;
  description: string;
  type: 'location' | 'time' | 'weather' | 'calendar' | 'activity';
  isEnabled: boolean;
  sensitivity: 'low' | 'medium' | 'high';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  context: string;
  trigger: string;
  timestamp: string;
  status: 'sent' | 'pending' | 'dismissed';
  type: 'memory' | 'reminder' | 'suggestion' | 'insight';
}

interface NotificationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  isActive: boolean;
}

export default function AIContextAwareNotifications({ onCancel }: AIContextAwareNotificationsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  const [contextTriggers, setContextTriggers] = useState<ContextTrigger[]>([
    { id: '1', name: 'Location-based', description: 'Notify when near memory locations', type: 'location', isEnabled: true, sensitivity: 'medium' },
    { id: '2', name: 'Time-based', description: 'Notify at specific times', type: 'time', isEnabled: true, sensitivity: 'medium' },
    { id: '3', name: 'Weather-based', description: 'Notify based on weather conditions', type: 'weather', isEnabled: false, sensitivity: 'low' },
    { id: '4', name: 'Calendar-based', description: 'Notify on calendar events', type: 'calendar', isEnabled: true, sensitivity: 'high' },
    { id: '5', name: 'Activity-based', description: 'Notify based on user activity', type: 'activity', isEnabled: false, sensitivity: 'low' },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Memory Nearby', message: 'You are near a location from your memory: Eiffel Tower', context: 'Location: Paris, France', trigger: 'Location-based', timestamp: '2024-01-15 10:30', status: 'sent', type: 'memory' },
    { id: '2', title: 'Time-based Reminder', message: 'It\'s the same time as your memory from last year', context: 'Time: 10:30 AM', trigger: 'Time-based', timestamp: '2024-02-20 10:30', status: 'sent', type: 'reminder' },
    { id: '3', title: 'Suggestion', message: 'Similar weather to your beach memory', context: 'Weather: Sunny', trigger: 'Weather-based', timestamp: '2024-03-10 14:20', status: 'pending', type: 'suggestion' },
  ]);

  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([
    { id: '1', name: 'Location Proximity', condition: 'Within 100m of memory location', action: 'Show memory notification', isActive: true },
    { id: '2', name: 'Time Anniversary', condition: 'Same time as memory date', action: 'Show anniversary reminder', isActive: true },
    { id: '3', name: 'Weather Match', condition: 'Similar weather to memory', action: 'Show memory suggestion', isActive: false },
  ]);

  const toggleTrigger = (id: string) => {
    setContextTriggers(contextTriggers.map(trigger => 
      trigger.id === id ? { ...trigger, isEnabled: !trigger.isEnabled } : trigger
    ));
  };

  const toggleRule = (id: string) => {
    setNotificationRules(notificationRules.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const dismissNotification = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, status: 'dismissed' as const } : notification
    ));
  };

  const sendNotification = () => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: 'Context-based Notification',
      message: 'AI detected relevant context for your memories',
      context: 'Location: Current Location',
      trigger: 'Location-based',
      timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
      status: 'sent',
      type: 'insight',
    };
    setNotifications([...notifications, newNotification]);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'memory': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'reminder': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'suggestion': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'insight': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'location': return <MapPin className="h-4 w-4" />;
      case 'time': return <Clock className="h-4 w-4" />;
      case 'weather': return <Sun className="h-4 w-4" />;
      case 'calendar': return <Calendar className="h-4 w-4" />;
      case 'activity': return <Home className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Context-aware Notifications
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Smart notifications based on context
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isNotificationsEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isNotificationsEnabled ? 'Enabled' : 'Disabled'}
          </span>
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Triggers</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{contextTriggers.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{contextTriggers.filter(t => t.isEnabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Notifications</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{notifications.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Rules</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{notificationRules.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isNotificationsEnabled}
              onChange={(e) => setIsNotificationsEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Notifications</span>
          </div>
          <button
            type="button"
            onClick={sendNotification}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Bell className="h-3 w-3" />
            Test Notification
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Context Triggers</h4>
          <div className="space-y-2">
            {contextTriggers.map((trigger) => (
              <div key={trigger.id} className={`p-3 rounded-lg border ${trigger.isEnabled ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-lg">
                      {getTriggerIcon(trigger.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{trigger.name}</span>
                        {trigger.isEnabled && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{trigger.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-xs ${getSensitivityColor(trigger.sensitivity)}`}>
                      {trigger.sensitivity}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleTrigger(trigger.id)}
                  className={`px-2 py-1 rounded text-xs ${trigger.isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                >
                  {trigger.isEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Notification Rules</h4>
          <div className="space-y-2">
            {notificationRules.map((rule) => (
              <div key={rule.id} className={`p-3 rounded-lg border ${rule.isActive ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{rule.name}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {rule.condition} → {rule.action}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleRule(rule.id)}
                    className={`px-2 py-1 rounded text-xs ${rule.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {rule.isActive ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Recent Notifications</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-amber-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{notification.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(notification.type)}`}>
                          {notification.type}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${notification.status === 'sent' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {notification.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{notification.message}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{notification.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Context: {notification.context}</span>
                    <span>•</span>
                    <span>Trigger: {notification.trigger}</span>
                  </div>
                </div>
                {notification.status === 'sent' && (
                  <button
                    type="button"
                    onClick={() => dismissNotification(notification.id)}
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Context-aware Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Location-based notifications when near memory spots</li>
              <li>• Time-based reminders for anniversaries</li>
              <li>• Weather-aware suggestions for activities</li>
              <li>• Calendar event integration for contextual alerts</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
