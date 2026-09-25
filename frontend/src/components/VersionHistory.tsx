'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Filter,
  GitBranch,
  History,
  Plus,
  Redo,
  RotateCcw,
  Settings,
  Trash2,
  Undo,
  Users,
  Zap
} from 'lucide-react';

interface Version {
  id: string;
  version: string;
  description: string;
  author: string;
  createdAt: Date;
  changes: string[];
  size: number;
  isCurrent: boolean;
  isBranch: boolean;
  branchName?: string;
}

interface VersionDiff {
  versionId: string;
  changes: {
    type: 'added' | 'modified' | 'deleted';
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

interface VersionHistoryProps {
  onCancel?: () => void;
  onRestoreVersion?: (versionId: string) => Promise<void>;
  onCreateBranch?: (versionId: string, branchName: string) => Promise<void>;
  onDeleteVersion?: (versionId: string) => Promise<void>;
}

const DEFAULT_VERSIONS: Version[] = [
  {
    id: 'version-1',
    version: 'v1.3',
    description: 'Added new photos and captions',
    author: 'Dad',
    createdAt: new Date('2024-01-12'),
    changes: ['Added 5 photos', 'Updated captions', 'Changed mood to happy'],
    size: 2450,
    isCurrent: true,
    isBranch: false,
  },
  {
    id: 'version-2',
    version: 'v1.2',
    description: 'Fixed title and location',
    author: 'Mom',
    createdAt: new Date('2024-01-10'),
    changes: ['Fixed title typo', 'Updated location', 'Changed category'],
    size: 2100,
    isCurrent: false,
    isBranch: false,
  },
  {
    id: 'version-3',
    version: 'v1.1',
    description: 'Initial version',
    author: 'Dad',
    createdAt: new Date('2024-01-05'),
    changes: ['Created memory', 'Added description', 'Set initial tags'],
    size: 1800,
    isCurrent: false,
    isBranch: false,
  },
  {
    id: 'version-4',
    version: 'v1.0-branch',
    description: 'Alternative version',
    author: 'Mom',
    createdAt: new Date('2024-01-08'),
    changes: ['Different photo selection', 'Alternative description'],
    size: 1950,
    isCurrent: false,
    isBranch: true,
    branchName: 'mom-edits',
  },
];

const DEFAULT_DIFFS: VersionDiff[] = [
  {
    versionId: 'version-1',
    changes: [
      { type: 'added', field: 'photos', oldValue: '', newValue: 'Added 5 photos' },
      { type: 'modified', field: 'caption', oldValue: 'Old caption', newValue: 'New caption' },
      { type: 'modified', field: 'mood', oldValue: 'neutral', newValue: 'happy' },
    ],
  },
];

export default function VersionHistory({ onCancel, onRestoreVersion, onCreateBranch, onDeleteVersion }: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>(DEFAULT_VERSIONS);
  const [diffs, setDiffs] = useState<VersionDiff[]>(DEFAULT_DIFFS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('version-1');
  const [autoSave, setAutoSave] = useState(true);
  const [maxVersions, setMaxVersions] = useState(10);
  const [showDiff, setShowDiff] = useState(false);

  const totalVersions = versions.length;
  const currentVersion = versions.find(v => v.isCurrent);
  const branchCount = versions.filter(v => v.isBranch).length;

  const handleRestore = async (versionId: string) => {
    await onRestoreVersion?.(versionId);
    setVersions(versions.map(v => 
      v.id === versionId ? { ...v, isCurrent: true } : { ...v, isCurrent: false }
    ));
  };

  const handleCreateBranch = async (versionId: string, branchName: string) => {
    await onCreateBranch?.(versionId, branchName);
  };

  const handleDelete = async (versionId: string) => {
    await onDeleteVersion?.(versionId);
    setVersions(versions.filter(v => v.id !== versionId));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'added':
        return <Plus className="h-3 w-3 text-green-500" />;
      case 'modified':
        return <RotateCcw className="h-3 w-3 text-blue-500" />;
      case 'deleted':
        return <Trash2 className="h-3 w-3 text-red-500" />;
      default:
        return <Activity className="h-3 w-3 text-slate-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'added':
        return 'text-green-500';
      case 'modified':
        return 'text-blue-500';
      case 'deleted':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  const selectedDiff = diffs.find(d => d.versionId === selectedVersion);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <History className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Lịch sử phiên bản
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalVersions} versions, {branchCount} branches
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt version history
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-save versions
              </span>
              <button
                type="button"
                onClick={() => setAutoSave(!autoSave)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoSave ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoSave ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Max versions: {maxVersions}
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={maxVersions}
                onChange={(e) => setMaxVersions(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Branch support
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
            <History className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Versions</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalVersions}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <GitBranch className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Branches</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {branchCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Size</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(versions.reduce((sum, v) => sum + v.size, 0) / 1024).toFixed(1)}KB
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Current</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {currentVersion?.version || 'N/A'}
          </div>
        </div>
      </div>

      {/* Current Version */}
      {currentVersion && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Current Version
          </h4>
          <div className="p-4 rounded-lg border-2 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {currentVersion.version}
                  </span>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    by {currentVersion.author}
                  </div>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full">
                Current
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
              {currentVersion.description}
            </p>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Created</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {currentVersion.createdAt.toLocaleDateString('vi-VN')}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Size</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {(currentVersion.size / 1024).toFixed(1)}KB
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Changes</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {currentVersion.changes.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version List */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
            Version History
          </h4>
          <button
            type="button"
            onClick={() => setShowDiff(!showDiff)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            <Eye className="h-3 w-3" />
            {showDiff ? 'Hide Diff' : 'Show Diff'}
          </button>
        </div>
        <div className="space-y-2">
          {versions.map((version, index) => (
            <div
              key={version.id}
              className={`p-4 rounded-lg border-2 ${
                version.isCurrent
                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                  : version.isBranch
                  ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {version.isBranch ? (
                    <GitBranch className="h-4 w-4 text-purple-500" />
                  ) : (
                    <History className="h-4 w-4 text-slate-500" />
                  )}
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {version.version}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      by {version.author}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {version.isBranch && (
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-semibold rounded-full">
                      {version.branchName}
                    </span>
                  )}
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {(version.size / 1024).toFixed(1)}KB
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {version.description}
              </p>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Created</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {version.createdAt.toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Changes</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {version.changes.length}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Index</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {index + 1}
                  </div>
                </div>
              </div>

              {!version.isCurrent && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleRestore(version.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Restore
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCreateBranch(version.id, 'new-branch')}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <GitBranch className="h-3 w-3" />
                    Branch
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(version.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Version Diff */}
      {showDiff && selectedDiff && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Version Diff
          </h4>
          <div className="space-y-2">
            {selectedDiff.changes.map((change, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-start gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${getTypeColor(change.type)}`}>
                    {getTypeIcon(change.type)}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                      {change.type}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Field: {change.field}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Old Value</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {change.oldValue || '(empty)'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">New Value</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {change.newValue}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
        <p className="text-[10px] text-amber-700 dark:text-amber-400">
          <strong>Lưu ý:</strong> Lịch sử phiên bản lưu lại mọi thay đổi của kỷ niệm và cho phép khôi phục với version tracking, change history, restore functionality, branch support, diff visualization, auto-save, và max version limits.
        </p>
      </div>
    </div>
  );
}