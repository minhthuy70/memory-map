'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Info,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  Trash2
} from 'lucide-react';

interface SandboxEnvironmentProps {
  onCancel?: () => void;
}

interface SandboxInstance {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  environment: 'sandbox' | 'staging' | 'production';
  createdAt: string;
  lastAccessed: string;
  memoryUsage: number;
  storageUsage: number;
}

interface SandboxSetting {
  id: string;
  name: string;
  value: string | number | boolean;
  type: 'string' | 'number' | 'boolean';
}

export default function SandboxEnvironment({ onCancel }: SandboxEnvironmentProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isSandboxEnabled, setIsSandboxEnabled] = useState(true);

  const [sandboxInstances, setSandboxInstances] = useState<SandboxInstance[]>([
    { id: '1', name: 'Test Environment 1', status: 'running', environment: 'sandbox', createdAt: '2024-01-15', lastAccessed: '2024-01-17 18:30', memoryUsage: 512, storageUsage: 1024 },
    { id: '2', name: 'Staging Environment', status: 'running', environment: 'staging', createdAt: '2024-01-10', lastAccessed: '2024-01-17 10:15', memoryUsage: 1024, storageUsage: 2048 },
    { id: '3', name: 'Test Environment 2', status: 'stopped', environment: 'sandbox', createdAt: '2024-01-05', lastAccessed: '2024-01-14 14:00', memoryUsage: 0, storageUsage: 512 },
  ]);

  const [sandboxSettings, setSandboxSettings] = useState<SandboxSetting[]>([
    { id: '1', name: 'Auto-cleanup enabled', value: true, type: 'boolean' },
    { id: '2', name: 'Cleanup after (hours)', value: 24, type: 'number' },
    { id: '3', name: 'Max instances', value: 5, type: 'number' },
    { id: '4', name: 'Default memory (MB)', value: 512, type: 'number' },
    { id: '5', name: 'Default storage (MB)', value: 1024, type: 'number' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'stopped': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'error': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getEnvironmentColor = (environment: string) => {
    switch (environment) {
      case 'sandbox': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'staging': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'production': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const toggleInstance = (id: string) => {
    setSandboxInstances(sandboxInstances.map(instance => 
      instance.id === id ? { ...instance, status: instance.status === 'running' ? 'stopped' : 'running' } : instance
    ));
  };

  const createInstance = () => {
    const newInstance: SandboxInstance = {
      id: Date.now().toString(),
      name: 'New Sandbox',
      status: 'running',
      environment: 'sandbox',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 10),
      lastAccessed: new Date().toISOString().replace('T', ' ').substring(0, 16),
      memoryUsage: 512,
      storageUsage: 1024,
    };
    setSandboxInstances([...sandboxInstances, newInstance]);
  };

  const deleteInstance = (id: string) => {
    setSandboxInstances(sandboxInstances.filter(instance => instance.id !== id));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Sandbox Environment
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Môi trường sandbox để test
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isSandboxEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isSandboxEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Instances</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{sandboxInstances.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Running</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{sandboxInstances.filter(i => i.status === 'running').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Memory</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{sandboxInstances.reduce((acc, i) => acc + i.memoryUsage, 0)} MB</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Storage</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{sandboxInstances.reduce((acc, i) => acc + i.storageUsage, 0)} MB</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isSandboxEnabled}
              onChange={(e) => setIsSandboxEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Sandbox</span>
          </div>
          <button
            type="button"
            onClick={createInstance}
            className="px-3 py-1.5 rounded-lg text-xs bg-amber-600 hover:bg-amber-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Create Instance
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Sandbox Settings</h4>
          <div className="space-y-2">
            {sandboxSettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <Settings className="h-4 w-4 text-amber-400" />
                  <span className="text-xs text-slate-900 dark:text-white">{setting.name}</span>
                </div>
                {setting.type === 'boolean' ? (
                  <input
                    type="checkbox"
                    checked={setting.value as boolean}
                    onChange={(e) => setSandboxSettings(sandboxSettings.map(s => s.id === setting.id ? { ...s, value: e.target.checked } : s))}
                    className="rounded"
                  />
                ) : (
                  <input
                    type={setting.type === 'number' ? 'number' : 'text'}
                    value={setting.value}
                    onChange={(e) => setSandboxSettings(sandboxSettings.map(s => s.id === setting.id ? { ...s, value: setting.type === 'number' ? parseInt(e.target.value) : e.target.value } : s))}
                    className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Sandbox Instances</h4>
          <div className="space-y-2">
            {sandboxInstances.map((instance) => (
              <div key={instance.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                      <Shield className="h-4 w-4 text-yellow-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{instance.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(instance.status)}`}>
                          {instance.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getEnvironmentColor(instance.environment)}`}>
                          {instance.environment}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Created: {instance.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => toggleInstance(instance.id)}
                      className={`px-2 py-1 rounded text-xs ${instance.status === 'running' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white flex items-center gap-1`}
                    >
                      {instance.status === 'running' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      {instance.status === 'running' ? 'Stop' : 'Start'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteInstance(instance.id)}
                      className="px-2 py-1 rounded text-xs bg-slate-600 hover:bg-slate-700 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Memory: {instance.memoryUsage} MB</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Storage: {instance.storageUsage} MB</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Accessed: {instance.lastAccessed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Sandbox Environment Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Create isolated environments for testing</li>
              <li>• Configure auto-cleanup to save resources</li>
              <li>• Monitor memory and storage usage</li>
              <li>• Use staging for pre-production testing</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
