'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  as,
  BarChart3,
  Bell,
  Calendar,
  CalendarIcon,
  CheckCircle,
  Clock,
  Download,
  Eye,
  EyeOff,
  Filter,
  Grid,
  Info,
  Layers,
  Mail,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Send,
  Settings,
  Trash2,
  Zap
} from 'lucide-react';

interface ScheduledReportDeliveryProps {
  onCancel?: () => void;
}

interface Schedule {
  id: string;
  name: string;
  reportId: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  enabled: boolean;
  lastSent: string;
  nextSend: string;
}

export default function ScheduledReportDelivery({ onCancel }: ScheduledReportDeliveryProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: '1', name: 'Weekly User Growth', reportId: 'weekly-user-growth', frequency: 'weekly', recipients: ['admin@example.com', 'team@example.com'], enabled: true, lastSent: '2026-09-07', nextSend: '2026-09-14' },
    { id: '2', name: 'Monthly Revenue', reportId: 'monthly-revenue', frequency: 'monthly', recipients: ['finance@example.com'], enabled: true, lastSent: '2026-08-31', nextSend: '2026-09-30' },
    { id: '3', name: 'Daily Churn Rate', reportId: 'daily-churn', frequency: 'daily', recipients: ['admin@example.com'], enabled: false, lastSent: '2026-09-10', nextSend: '2026-09-15' },
  ]);

  const [newSchedule, setNewSchedule] = useState({
    name: '',
    reportId: '',
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
    recipients: '',
  });

  const [isCreating, setIsCreating] = useState(false);

  const toggleSchedule = (id: string) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const startCreating = () => {
    setIsCreating(true);
    setNewSchedule({ name: '', reportId: '', frequency: 'weekly', recipients: '' });
  };

  const cancelCreating = () => {
    setIsCreating(false);
    setNewSchedule({ name: '', reportId: '', frequency: 'weekly', recipients: '' });
  };

  const createSchedule = () => {
    if (newSchedule.name && newSchedule.reportId && newSchedule.recipients) {
      const newId = Date.now().toString();
      const recipients = newSchedule.recipients.split(',').map(r => r.trim());
      const today = new Date().toISOString().split('T')[0];
      
      let nextSend = today;
      if (newSchedule.frequency === 'weekly') {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextSend = nextWeek.toISOString().split('T')[0];
      } else if (newSchedule.frequency === 'monthly') {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextSend = nextMonth.toISOString().split('T')[0];
      }

      setSchedules([...schedules, {
        id: newId,
        name: newSchedule.name,
        reportId: newSchedule.reportId,
        frequency: newSchedule.frequency,
        recipients,
        enabled: true,
        lastSent: '',
        nextSend,
      }]);
      cancelCreating();
    }
  };

  const sendNow = (id: string) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, lastSent: new Date().toISOString().split('T')[0] } : s));
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'daily': return <Zap className="h-4 w-4" />;
      case 'weekly': return <CalendarIcon className="h-4 w-4" />;
      case 'monthly': return <Calendar className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'weekly': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'monthly': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Scheduled Report Delivery
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automate report delivery via email
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
            {showDetails ? <BarChart3 className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Schedules</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{schedules.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{schedules.filter(s => s.enabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Inactive</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{schedules.filter(s => !s.enabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Recipients</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{schedules.reduce((sum, s) => sum + s.recipients.length, 0)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={startCreating}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            New Schedule
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Create New Schedule</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Schedule Name</label>
                <input
                  type="text"
                  value={newSchedule.name}
                  onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                  placeholder="Enter schedule name..."
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Report ID</label>
                <input
                  type="text"
                  value={newSchedule.reportId}
                  onChange={(e) => setNewSchedule({ ...newSchedule, reportId: e.target.value })}
                  placeholder="Enter report ID..."
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Frequency</label>
                <select
                  value={newSchedule.frequency}
                  onChange={(e) => setNewSchedule({ ...newSchedule, frequency: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Recipients (comma-separated)</label>
                <input
                  type="text"
                  value={newSchedule.recipients}
                  onChange={(e) => setNewSchedule({ ...newSchedule, recipients: e.target.value })}
                  placeholder="email1@example.com, email2@example.com"
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={createSchedule}
                  disabled={!newSchedule.name || !newSchedule.reportId || !newSchedule.recipients}
                  className="flex-1 px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:text-slate-500 dark:disabled:text-slate-400 transition-colors"
                >
                  Create Schedule
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Scheduled Reports</h4>
          <div className="space-y-2">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleSchedule(schedule.id)}
                    className={`p-2 rounded-lg transition-colors ${schedule.enabled ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}
                  >
                    {schedule.enabled ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </button>
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{schedule.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs ${getFrequencyColor(schedule.frequency)}`}>
                        {getFrequencyIcon(schedule.frequency)}
                        {schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{schedule.recipients.length} recipients</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Next Send</p>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{schedule.nextSend}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => sendNow(schedule.id)}
                    className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                    title="Send now"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSchedule(schedule.id)}
                    className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Delivery Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Use daily frequency for time-sensitive metrics</li>
              <li>• Weekly for regular team updates</li>
              <li>• Monthly for executive summaries</li>
              <li>• Verify recipient emails before scheduling</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
