'use client';

import { useState } from 'react';
import { Flag, X, Plus, Trash2, RefreshCw, CheckCircle, AlertTriangle, Info, Shield, ToggleLeft, ToggleRight, Users, Globe, Zap, Layers, Target } from 'lucide-react';

interface FeatureFlagManagementProps {
  onCancel?: () => void;
}

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rollout: number;
  targetAudience: 'all' | 'beta' | 'enterprise' | 'specific';
  lastModified: string;
}

export default function FeatureFlagManagement({ onCancel }: FeatureFlagManagementProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [flags, setFlags] = useState<FeatureFlag[]>([
    { id: '1', name: 'AI Features', description: 'Enable AI-powered features', enabled: true, rollout: 100, targetAudience: 'all', lastModified: '2026-09-10' },
    { id: '2', name: 'AR Mode', description: 'Augmented reality mode', enabled: true, rollout: 50, targetAudience: 'beta', lastModified: '2026-09-12' },
    { id: '3', name: 'Dark Mode', description: 'Dark theme support', enabled: true, rollout: 100, targetAudience: 'all', lastModified: '2026-09-01' },
    { id: '4', name: 'Export PDF', description: 'PDF export functionality', enabled: true, rollout: 100, targetAudience: 'all', lastModified: '2026-08-20' },
    { id: '5', name: 'Voice Commands', description: 'Voice control features', enabled: false, rollout: 0, targetAudience: 'beta', lastModified: '2026-09-13' },
    { id: '6', name: 'Mobile Widgets', description: 'Home screen widgets', enabled: true, rollout: 30, targetAudience: 'beta', lastModified: '2026-09-14' },
  ]);

  const [newFlag, setNewFlag] = useState({
    name: '',
    description: '',
    rollout: 0,
    targetAudience: 'beta' as 'all' | 'beta' | 'enterprise' | 'specific',
  });

  const toggleFlag = (id: string) => {
    setFlags(flags.map(f => f.id === id ? { ...f, enabled: !f.enabled, lastModified: new Date().toISOString().split('T')[0] } : f));
  };

  const updateRollout = (id: string, rollout: number) => {
    setFlags(flags.map(f => f.id === id ? { ...f, rollout, lastModified: new Date().toISOString().split('T')[0] } : f));
  };

  const deleteFlag = (id: string) => {
    setFlags(flags.filter(f => f.id !== id));
  };

  const startCreating = () => {
    setIsCreating(true);
    setNewFlag({ name: '', description: '', rollout: 0, targetAudience: 'beta' });
  };

  const cancelCreating = () => {
    setIsCreating(false);
    setNewFlag({ name: '', description: '', rollout: 0, targetAudience: 'beta' });
  };

  const createFlag = () => {
    if (newFlag.name && newFlag.description) {
      const newId = Date.now().toString();
      setFlags([...flags, {
        id: newId,
        name: newFlag.name,
        description: newFlag.description,
        enabled: false,
        rollout: newFlag.rollout,
        targetAudience: newFlag.targetAudience,
        lastModified: new Date().toISOString().split('T')[0],
      }]);
      cancelCreating();
    }
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'all': return <Globe className="h-4 w-4" />;
      case 'beta': return <Target className="h-4 w-4" />;
      case 'enterprise': return <Shield className="h-4 w-4" />;
      case 'specific': return <Users className="h-4 w-4" />;
      default: return <Layers className="h-4 w-4" />;
    }
  };

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'all': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'beta': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'enterprise': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'specific': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <Flag className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Feature Flag Management
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Control feature rollout and access
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Flags</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{flags.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Enabled</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{flags.filter(f => f.enabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Disabled</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{flags.filter(f => !f.enabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Rollout</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{Math.round(flags.reduce((sum, f) => sum + f.rollout, 0) / flags.length)}%</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={startCreating}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            New Flag
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Create New Feature Flag</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Flag Name</label>
                <input
                  type="text"
                  value={newFlag.name}
                  onChange={(e) => setNewFlag({ ...newFlag, name: e.target.value })}
                  placeholder="Enter flag name..."
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Description</label>
                <input
                  type="text"
                  value={newFlag.description}
                  onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })}
                  placeholder="Enter description..."
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Initial Rollout (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newFlag.rollout}
                  onChange={(e) => setNewFlag({ ...newFlag, rollout: parseInt(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{newFlag.rollout}%</span>
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Target Audience</label>
                <select
                  value={newFlag.targetAudience}
                  onChange={(e) => setNewFlag({ ...newFlag, targetAudience: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                >
                  <option value="all">All Users</option>
                  <option value="beta">Beta Users</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="specific">Specific Users</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={createFlag}
                  disabled={!newFlag.name || !newFlag.description}
                  className="flex-1 px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:text-slate-500 dark:disabled:text-slate-400 transition-colors"
                >
                  Create Flag
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Feature Flags</h4>
          <div className="space-y-2">
            {flags.map((flag) => (
              <div key={flag.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleFlag(flag.id)}
                    className={`p-2 rounded-lg transition-colors ${flag.enabled ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}
                  >
                    {flag.enabled ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  </button>
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{flag.name}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{flag.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${getAudienceColor(flag.targetAudience)}`}>
                      {getAudienceIcon(flag.targetAudience)}
                      {flag.targetAudience}
                    </span>
                  </div>
                  <div className="w-20">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={flag.rollout}
                      onChange={(e) => updateRollout(flag.id, parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400">{flag.rollout}%</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteFlag(flag.id)}
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Feature Flag Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Use gradual rollout for new features</li>
              <li>• Target beta users for testing</li>
              <li>• Monitor metrics after enabling</li>
              <li>• Keep descriptions clear for team</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
