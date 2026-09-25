'use client';

import { useState } from 'react';
import { Wrench, X, Save, RefreshCw, CheckCircle, AlertTriangle, Info, Clock, Calendar, Shield, Users, Globe, Zap, ToggleLeft, ToggleRight, Play, Pause, Trash2 } from 'lucide-react';

interface MaintenanceModeProps {
  onCancel?: () => void;
}

export default function MaintenanceMode({ onCancel }: MaintenanceModeProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);

  const [maintenanceConfig, setMaintenanceConfig] = useState({
    message: 'System is under maintenance. We will be back soon.',
    startTime: '',
    endTime: '',
    allowAdminAccess: true,
    allowedIPs: '',
    notifyUsers: true,
    notifyHoursBefore: 24,
  });

  const [scheduledMaintenance, setScheduledMaintenance] = useState([
    { id: '1', date: '2026-09-20', time: '02:00', duration: 2, reason: 'Database upgrade', status: 'scheduled' },
    { id: '2', date: '2026-08-15', time: '03:00', duration: 1, reason: 'Security patch', status: 'completed' },
  ]);

  const toggleMaintenance = () => {
    setMaintenanceEnabled(!maintenanceEnabled);
  };

  const saveConfig = () => {
    // Save configuration
  };

  const scheduleMaintenance = () => {
    if (maintenanceConfig.startTime && maintenanceConfig.endTime) {
      const newId = Date.now().toString();
      setScheduledMaintenance([...scheduledMaintenance, {
        id: newId,
        date: maintenanceConfig.startTime,
        time: '02:00',
        duration: 2,
        reason: 'Scheduled maintenance',
        status: 'scheduled',
      }]);
    }
  };

  const deleteSchedule = (id: string) => {
    setScheduledMaintenance(scheduledMaintenance.filter(s => s.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Maintenance Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Control system maintenance state
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {maintenanceEnabled && (
            <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Active
            </span>
          )}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Status</p>
            <p className={`text-lg font-bold ${maintenanceEnabled ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {maintenanceEnabled ? 'Active' : 'Normal'}
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Scheduled</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{scheduledMaintenance.filter(s => s.status === 'scheduled').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Completed</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{scheduledMaintenance.filter(s => s.status === 'completed').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Admin Access</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{maintenanceConfig.allowAdminAccess ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={toggleMaintenance}
            className={`px-3 py-1.5 rounded-lg text-xs border-0 flex items-center gap-1 ${maintenanceEnabled ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
          >
            {maintenanceEnabled ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            {maintenanceEnabled ? 'Disable Maintenance' : 'Enable Maintenance'}
          </button>
          <button
            type="button"
            onClick={saveConfig}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Save className="h-3 w-3" />
            Save Config
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Maintenance Configuration</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Maintenance Message</label>
              <textarea
                value={maintenanceConfig.message}
                onChange={(e) => setMaintenanceConfig({ ...maintenanceConfig, message: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Start Time</label>
                <input
                  type="datetime-local"
                  value={maintenanceConfig.startTime}
                  onChange={(e) => setMaintenanceConfig({ ...maintenanceConfig, startTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">End Time</label>
                <input
                  type="datetime-local"
                  value={maintenanceConfig.endTime}
                  onChange={(e) => setMaintenanceConfig({ ...maintenanceConfig, endTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Allowed IPs (comma-separated)</label>
                <input
                  type="text"
                  value={maintenanceConfig.allowedIPs}
                  onChange={(e) => setMaintenanceConfig({ ...maintenanceConfig, allowedIPs: e.target.value })}
                  placeholder="192.168.1.1, 10.0.0.1"
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Notify Users (hours before)</label>
                <input
                  type="number"
                  value={maintenanceConfig.notifyHoursBefore}
                  onChange={(e) => setMaintenanceConfig({ ...maintenanceConfig, notifyHoursBefore: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setMaintenanceConfig({ ...maintenanceConfig, allowAdminAccess: !maintenanceConfig.allowAdminAccess })}
                className={`p-2 rounded-lg transition-colors ${maintenanceConfig.allowAdminAccess ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}
              >
                {maintenanceConfig.allowAdminAccess ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
              </button>
              <span className="text-xs text-slate-700 dark:text-slate-300">Allow Admin Access</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setMaintenanceConfig({ ...maintenanceConfig, notifyUsers: !maintenanceConfig.notifyUsers })}
                className={`p-2 rounded-lg transition-colors ${maintenanceConfig.notifyUsers ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}
              >
                {maintenanceConfig.notifyUsers ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
              </button>
              <span className="text-xs text-slate-700 dark:text-slate-300">Notify Users Before Maintenance</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Scheduled Maintenance</h4>
          <div className="space-y-2">
            {scheduledMaintenance.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{schedule.date} at {schedule.time}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{schedule.reason} ({schedule.duration}h)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(schedule.status)}`}>
                    {schedule.status}
                  </span>
                  {schedule.status === 'scheduled' && (
                    <button
                      type="button"
                      onClick={() => deleteSchedule(schedule.id)}
                      className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Maintenance Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Schedule maintenance during low-traffic hours</li>
              <li>• Notify users in advance for planned maintenance</li>
              <li>• Allow admin access for emergency fixes</li>
              <li>• Test maintenance page before enabling</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
