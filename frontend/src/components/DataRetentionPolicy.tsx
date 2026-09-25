'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Database,
  Eye,
  FileText,
  Lock,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  Trash2
} from 'lucide-react';

interface RetentionPolicy {
  id: string;
  dataType: string;
  retentionPeriod: number;
  retentionUnit: 'days' | 'months' | 'years';
  policyType: 'automatic' | 'manual';
  enabled: boolean;
  lastRun: Date | null;
  nextRun: Date | null;
  totalDeleted: number;
  dataSize: string;
}

interface DataRetentionPolicyProps {
  onCancel?: () => void;
  onUpdatePolicy?: (policyId: string, policy: Partial<RetentionPolicy>) => Promise<void>;
  onRunPolicy?: (policyId: string) => Promise<void>;
  onDeletePolicy?: (policyId: string) => Promise<void>;
}

const DEFAULT_POLICIES: RetentionPolicy[] = [
  {
    id: 'policy-1',
    dataType: 'Session Logs',
    retentionPeriod: 30,
    retentionUnit: 'days',
    policyType: 'automatic',
    enabled: true,
    lastRun: new Date(Date.now() - 86400000),
    nextRun: new Date(Date.now() + 86400000),
    totalDeleted: 1250,
    dataSize: '2.5 GB',
  },
  {
    id: 'policy-2',
    dataType: 'Error Logs',
    retentionPeriod: 90,
    retentionUnit: 'days',
    policyType: 'automatic',
    enabled: true,
    lastRun: new Date(Date.now() - 86400000 * 3),
    nextRun: new Date(Date.now() + 86400000 * 3),
    totalDeleted: 890,
    dataSize: '1.8 GB',
  },
  {
    id: 'policy-3',
    dataType: 'Analytics Data',
    retentionPeriod: 1,
    retentionUnit: 'years',
    policyType: 'automatic',
    enabled: true,
    lastRun: new Date(Date.now() - 86400000 * 30),
    nextRun: new Date(Date.now() + 86400000 * 30),
    totalDeleted: 320,
    dataSize: '15.2 GB',
  },
  {
    id: 'policy-4',
    dataType: 'Temporary Files',
    retentionPeriod: 7,
    retentionUnit: 'days',
    policyType: 'automatic',
    enabled: true,
    lastRun: new Date(Date.now() - 86400000),
    nextRun: new Date(Date.now() + 86400000),
    totalDeleted: 5420,
    dataSize: '8.5 GB',
  },
  {
    id: 'policy-5',
    dataType: 'Deleted Memories',
    retentionPeriod: 30,
    retentionUnit: 'days',
    policyType: 'manual',
    enabled: false,
    lastRun: null,
    nextRun: null,
    totalDeleted: 0,
    dataSize: '0 GB',
  },
];

export default function DataRetentionPolicy({ onCancel, onUpdatePolicy, onRunPolicy, onDeletePolicy }: DataRetentionPolicyProps) {
  const [policies, setPolicies] = useState<RetentionPolicy[]>(DEFAULT_POLICIES);
  const [showSettings, setShowSettings] = useState(false);
  const [showNewPolicy, setShowNewPolicy] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'automatic' | 'manual'>('all');

  const handleUpdatePolicy = async (policyId: string, updates: Partial<RetentionPolicy>) => {
    if (onUpdatePolicy) {
      await onUpdatePolicy(policyId, updates);
    }
    setPolicies(prev => prev.map(policy => 
      policy.id === policyId ? { ...policy, ...updates } : policy
    ));
  };

  const handleRunPolicy = async (policyId: string) => {
    if (onRunPolicy) {
      await onRunPolicy(policyId);
    }
    setPolicies(prev => prev.map(policy => 
      policy.id === policyId 
        ? { 
            ...policy, 
            lastRun: new Date(),
            totalDeleted: policy.totalDeleted + Math.floor(Math.random() * 100) + 10,
            nextRun: new Date(Date.now() + 86400000 * (policy.retentionPeriod * (policy.retentionUnit === 'years' ? 365 : policy.retentionUnit === 'months' ? 30 : 1)))
          }
        : policy
    ));
  };

  const handleDeletePolicy = async (policyId: string) => {
    if (onDeletePolicy) {
      await onDeletePolicy(policyId);
    }
    setPolicies(prev => prev.filter(policy => policy.id !== policyId));
  };

  const getTypeIcon = (policyType: RetentionPolicy['policyType']) => {
    switch (policyType) {
      case 'automatic':
        return <Play className="h-4 w-4" />;
      case 'manual':
        return <Pause className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getRetentionLabel = (period: number, unit: RetentionPolicy['retentionUnit']) => {
    switch (unit) {
      case 'days':
        return `${period} ngày`;
      case 'months':
        return `${period} tháng`;
      case 'years':
        return `${period} năm`;
      default:
        return `${period} ${unit}`;
    }
  };

  const filteredPolicies = selectedType === 'all' 
    ? policies 
    : policies.filter(policy => policy.policyType === selectedType);

  const enabledPolicies = policies.filter(p => p.enabled).length;
  const totalDeleted = policies.reduce((sum, p) => sum + p.totalDeleted, 0);
  const totalDataSize = policies.reduce((sum, p) => sum + parseFloat(p.dataSize), 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Chính sách lưu trữ dữ liệu
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {enabledPolicies}/{policies.length} policies • {totalDeleted.toLocaleString()} deleted
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNewPolicy(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Tạo policy mới"
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
        <div className="mb-4 p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt retention
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Compliance framework
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">GDPR</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Legal hold period
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">30 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-backup before deletion
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Trash2 className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Deleted</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalDeleted.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Database className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Data Freed</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalDataSize.toFixed(1)} GB
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Active Policies</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {enabledPolicies}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Compliance</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            GDPR
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as any)}
          className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
        >
          <option value="all">Tất cả types</option>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      {/* Policies List */}
      <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
        {filteredPolicies.map((policy) => (
          <div
            key={policy.id}
            className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getTypeIcon(policy.policyType)}
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {policy.dataType}
                </span>
                <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-600 rounded text-[10px] text-slate-600 dark:text-slate-400">
                  {policy.policyType}
                </span>
                {policy.enabled && (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdatePolicy(policy.id, { enabled: !policy.enabled })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    policy.enabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      policy.enabled ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePolicy(policy.id)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                  title="Delete policy"
                >
                  <Trash2 className="h-3 w-3 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-2">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Retention</div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  {getRetentionLabel(policy.retentionPeriod, policy.retentionUnit)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Deleted</div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  {policy.totalDeleted.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Size</div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  {policy.dataSize}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Next Run</div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  {policy.nextRun ? new Date(policy.nextRun).toLocaleDateString('vi-VN') : 'Manual'}
                </div>
              </div>
            </div>

            {policy.enabled && policy.policyType === 'automatic' && (
              <button
                type="button"
                onClick={() => handleRunPolicy(policy.id)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Run Now
              </button>
            )}
          </div>
        ))}
      </div>

      {/* New Policy Form */}
      {showNewPolicy && (
        <div className="mb-4 p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Tạo retention policy mới
          </h4>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Data type name"
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Period"
                className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
              <select className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none">
                <option value="days">Ngày</option>
                <option value="months">Tháng</option>
                <option value="years">Năm</option>
              </select>
            </div>
            <select className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none">
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowNewPolicy(false)}
                className="flex-1 px-3 py-2 bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => setShowNewPolicy(false)}
                className="flex-1 px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-lg">
        <p className="text-[10px] text-teal-700 dark:text-teal-400">
          <strong>Lưu ý:</strong> Chính sách lưu trữ dữ liệu tự động xóa dữ liệu cũ theo retention period với compliance tracking và backup protection.
        </p>
      </div>
    </div>
  );
}