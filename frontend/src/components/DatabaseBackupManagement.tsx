'use client';

import { useState } from 'react';
import { Database, X, Download, Trash2, RefreshCw, CheckCircle, AlertTriangle, Info, Calendar, Clock, Play, HardDrive, Shield, Upload, Zap } from 'lucide-react';

interface DatabaseBackupManagementProps {
  onCancel?: () => void;
}

interface Backup {
  id: string;
  name: string;
  date: string;
  size: number;
  type: 'manual' | 'automatic';
  status: 'completed' | 'in_progress' | 'failed';
  retention: number;
}

export default function DatabaseBackupManagement({ onCancel }: DatabaseBackupManagementProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [backups, setBackups] = useState<Backup[]>([
    { id: '1', name: 'backup_2026-09-14', date: '2026-09-14', size: 250, type: 'automatic', status: 'completed', retention: 30 },
    { id: '2', name: 'backup_2026-09-13', date: '2026-09-13', size: 248, type: 'automatic', status: 'completed', retention: 30 },
    { id: '3', name: 'backup_2026-09-12', date: '2026-09-12', size: 245, type: 'automatic', status: 'completed', retention: 30 },
    { id: '4', name: 'manual_backup_sep10', date: '2026-09-10', size: 240, type: 'manual', status: 'completed', retention: 90 },
    { id: '5', name: 'backup_2026-09-09', date: '2026-09-09', size: 238, type: 'automatic', status: 'completed', retention: 30 },
  ]);

  const [backupConfig, setBackupConfig] = useState({
    autoBackup: true,
    frequency: 'daily' as 'hourly' | 'daily' | 'weekly',
    retentionDays: 30,
    notifyOnComplete: true,
    compressBackups: true,
    maxBackupSize: 500,
  });

  const [newBackup, setNewBackup] = useState({
    name: '',
    retention: 30,
  });

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' MB';
    return (bytes / 1024).toFixed(2) + ' GB';
  };

  const createBackup = () => {
    if (newBackup.name) {
      const newId = Date.now().toString();
      setBackups([...backups, {
        id: newId,
        name: newBackup.name,
        date: new Date().toISOString().split('T')[0],
        size: 0,
        type: 'manual',
        status: 'in_progress',
        retention: newBackup.retention,
      }]);
      setNewBackup({ name: '', retention: 30 });
      setIsCreating(false);
      
      // Simulate backup completion
      setTimeout(() => {
        setBackups(prev => prev.map(b => b.id === newId ? { ...b, status: 'completed', size: 250 } : b));
      }, 3000);
    }
  };

  const downloadBackup = (id: string) => {
    // Download backup
  };

  const deleteBackup = (id: string) => {
    setBackups(backups.filter(b => b.id !== id));
  };

  const restoreBackup = (id: string) => {
    // Restore from backup
  };

  const startCreating = () => {
    setIsCreating(true);
    setNewBackup({ name: '', retention: 30 });
  };

  const cancelCreating = () => {
    setIsCreating(false);
    setNewBackup({ name: '', retention: 30 });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'in_progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'in_progress': return <Zap className="h-3 w-3" />;
      case 'failed': return <AlertTriangle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Database Backup Management
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage database backups and restores
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Backups</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{backups.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Size</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatBytes(backups.reduce((sum, b) => sum + b.size, 0))}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Auto Backup</p>
            <p className={`text-lg font-bold ${backupConfig.autoBackup ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {backupConfig.autoBackup ? 'On' : 'Off'}
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Retention</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{backupConfig.retentionDays} days</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={startCreating}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Upload className="h-3 w-3" />
            Create Backup
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Create New Backup</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Backup Name</label>
                <input
                  type="text"
                  value={newBackup.name}
                  onChange={(e) => setNewBackup({ ...newBackup, name: e.target.value })}
                  placeholder="Enter backup name..."
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Retention (days)</label>
                <input
                  type="number"
                  value={newBackup.retention}
                  onChange={(e) => setNewBackup({ ...newBackup, retention: parseInt(e.target.value) || 30 })}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={createBackup}
                  disabled={!newBackup.name}
                  className="flex-1 px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:text-slate-500 dark:disabled:text-slate-400 transition-colors"
                >
                  Create Backup
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Backup Configuration</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Auto Backup Frequency</label>
              <select
                value={backupConfig.frequency}
                onChange={(e) => setBackupConfig({ ...backupConfig, frequency: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Retention Period (days)</label>
              <input
                type="number"
                value={backupConfig.retentionDays}
                onChange={(e) => setBackupConfig({ ...backupConfig, retentionDays: parseInt(e.target.value) || 30 })}
                className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Available Backups</h4>
          <div className="space-y-2">
            {backups.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <HardDrive className="h-4 w-4 text-slate-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{backup.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${getStatusColor(backup.status)}`}>
                        {getStatusIcon(backup.status)}
                        {backup.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {backup.date}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{formatBytes(backup.size)}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{backup.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {backup.status === 'completed' && (
                    <>
                      <button
                        type="button"
                        onClick={() => downloadBackup(backup.id)}
                        className="p-1 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => restoreBackup(backup.id)}
                        className="p-1 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                        title="Restore"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteBackup(backup.id)}
                    className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Backup Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Enable automatic backups for data safety</li>
              <li>• Set appropriate retention periods</li>
              <li>• Test restore process regularly</li>
              <li>• Monitor backup size and storage usage</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
