'use client';

import { useState } from 'react';
import { Flag, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Plus, ToggleLeft, ToggleRight, Users, Globe, Code, Clock, Shield } from 'lucide-react';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: 'boolean' | 'percentage' | 'user-segment' | 'environment';
  rollout: number;
  targetUsers: string[];
  targetEnvironments: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

interface FeatureFlagsProps {
  onCancel?: () => void;
  onToggleFlag?: (flagId: string, enabled: boolean) => Promise<void>;
  onUpdateRollout?: (flagId: string, rollout: number) => Promise<void>;
  onCreateFlag?: (flag: FeatureFlag) => Promise<void>;
}

const DEFAULT_FLAGS: FeatureFlag[] = [
  {
    id: 'flag-1',
    name: 'new-ui-theme',
    description: 'Enable new UI theme with dark mode improvements',
    enabled: true,
    type: 'boolean',
    rollout: 100,
    targetUsers: [],
    targetEnvironments: ['production', 'staging'],
    createdAt: new Date(Date.now() - 86400000 * 7),
    updatedAt: new Date(Date.now() - 86400000),
    createdBy: 'admin',
  },
  {
    id: 'flag-2',
    name: 'ai-recommendations',
    description: 'AI-powered memory recommendations',
    enabled: true,
    type: 'percentage',
    rollout: 50,
    targetUsers: [],
    targetEnvironments: ['production'],
    createdAt: new Date(Date.now() - 86400000 * 14),
    updatedAt: new Date(Date.now() - 86400000 * 2),
    createdBy: 'product-team',
  },
  {
    id: 'flag-3',
    name: 'beta-export',
    description: 'Beta export functionality for PDF and CSV',
    enabled: false,
    type: 'user-segment',
    rollout: 0,
    targetUsers: ['user-123', 'user-456', 'user-789'],
    targetEnvironments: ['staging'],
    createdAt: new Date(Date.now() - 86400000 * 21),
    updatedAt: new Date(Date.now() - 86400000 * 5),
    createdBy: 'engineering',
  },
  {
    id: 'flag-4',
    name: 'map-3d-view',
    description: '3D map view with enhanced visualization',
    enabled: true,
    type: 'environment',
    rollout: 100,
    targetUsers: [],
    targetEnvironments: ['development'],
    createdAt: new Date(Date.now() - 86400000 * 3),
    updatedAt: new Date(Date.now() - 86400000),
    createdBy: 'frontend-team',
  },
  {
    id: 'flag-5',
    name: 'advanced-search',
    description: 'Advanced search with filters and saved queries',
    enabled: true,
    type: 'percentage',
    rollout: 25,
    targetUsers: [],
    targetEnvironments: ['production', 'staging'],
    createdAt: new Date(Date.now() - 86400000 * 10),
    updatedAt: new Date(Date.now() - 86400000),
    createdBy: 'product-team',
  },
];

export default function FeatureFlags({ onCancel, onToggleFlag, onUpdateRollout, onCreateFlag }: FeatureFlagsProps) {
  const [flags, setFlags] = useState<FeatureFlag[]>(DEFAULT_FLAGS);
  const [showSettings, setShowSettings] = useState(false);
  const [showNewFlag, setShowNewFlag] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'boolean' | 'percentage' | 'user-segment' | 'environment'>('all');

  const handleToggle = async (flagId: string, enabled: boolean) => {
    if (onToggleFlag) {
      await onToggleFlag(flagId, enabled);
    }
    setFlags(prev => prev.map(flag => 
      flag.id === flagId ? { ...flag, enabled, updatedAt: new Date() } : flag
    ));
  };

  const handleUpdateRollout = async (flagId: string, rollout: number) => {
    if (onUpdateRollout) {
      await onUpdateRollout(flagId, rollout);
    }
    setFlags(prev => prev.map(flag => 
      flag.id === flagId ? { ...flag, rollout, enabled: rollout > 0, updatedAt: new Date() } : flag
    ));
  };

  const getTypeIcon = (type: FeatureFlag['type']) => {
    switch (type) {
      case 'boolean':
        return <ToggleRight className="h-4 w-4" />;
      case 'percentage':
        return <Users className="h-4 w-4" />;
      case 'user-segment':
        return <Shield className="h-4 w-4" />;
      case 'environment':
        return <Globe className="h-4 w-4" />;
      default:
        return <Flag className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: FeatureFlag['type']) => {
    switch (type) {
      case 'boolean':
        return 'Boolean';
      case 'percentage':
        return 'Percentage';
      case 'user-segment':
        return 'User Segment';
      case 'environment':
        return 'Environment';
      default:
        return type;
    }
  };

  const filteredFlags = selectedType === 'all' 
    ? flags 
    : flags.filter(flag => flag.type === selectedType);

  const enabledFlags = flags.filter(f => f.enabled).length;
  const totalFlags = flags.length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
            <Flag className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Feature flags
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {enabledFlags}/{totalFlags} enabled
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNewFlag(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Tạo flag mới"
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
        <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt feature flags
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Cache duration
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">5 minutes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Fallback strategy
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">Disabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Audit logging
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="mb-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as any)}
          className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
        >
          <option value="all">Tất cả types</option>
          <option value="boolean">Boolean</option>
          <option value="percentage">Percentage</option>
          <option value="user-segment">User Segment</option>
          <option value="environment">Environment</option>
        </select>
      </div>

      {/* Flags List */}
      <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
        {filteredFlags.map((flag) => (
          <div
            key={flag.id}
            className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getTypeIcon(flag.type)}
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {flag.name}
                </span>
                <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-600 rounded text-[10px] text-slate-600 dark:text-slate-400">
                  {getTypeLabel(flag.type)}
                </span>
                {flag.enabled && (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
              </div>
              <button
                type="button"
                onClick={() => handleToggle(flag.id, !flag.enabled)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  flag.enabled ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    flag.enabled ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              {flag.description}
            </p>

            {/* Rollout Control for Percentage Type */}
            {flag.type === 'percentage' && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Rollout</span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {flag.rollout}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={flag.rollout}
                  onChange={(e) => handleUpdateRollout(flag.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
            )}

            {/* Target Info */}
            <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
              {flag.targetEnvironments.length > 0 && (
                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  <span>{flag.targetEnvironments.join(', ')}</span>
                </div>
              )}
              {flag.targetUsers.length > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{flag.targetUsers.length} users</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Updated: {new Date(flag.updatedAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Flag Form */}
      {showNewFlag && (
        <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Tạo flag mới
          </h4>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Tên flag (kebab-case)"
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
            <textarea
              placeholder="Mô tả flag"
              rows={2}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
            />
            <select className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none">
              <option value="boolean">Boolean</option>
              <option value="percentage">Percentage</option>
              <option value="user-segment">User Segment</option>
              <option value="environment">Environment</option>
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowNewFlag(false)}
                className="flex-1 px-3 py-2 bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => setShowNewFlag(false)}
                className="flex-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg">
        <p className="text-[10px] text-orange-700 dark:text-orange-400">
          <strong>Lưu ý:</strong> Feature flags cho phép bật/tắt tính năng mà không cần deploy, hỗ trợ boolean, percentage, user segment, và environment-based targeting.
        </p>
      </div>
    </div>
  );
}