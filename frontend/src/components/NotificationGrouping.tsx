'use client';

import { useState } from 'react';
import { Layers, Check, X, Save, Settings, Group, AlertTriangle, Info, Heart, MessageSquare, Shield } from 'lucide-react';

interface NotificationGroup {
  id: string;
  type: 'milestone' | 'social' | 'system' | 'reminder';
  title: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  latestTime: Date;
  enabled: boolean;
  groupingMode: 'type' | 'time' | 'priority';
  maxGroupSize: number;
}

interface NotificationGroupingProps {
  groups?: NotificationGroup[];
  onSave?: (groups: NotificationGroup[]) => Promise<void>;
  onCancel?: () => void;
  isSaving?: boolean;
}

const DEFAULT_GROUPS: NotificationGroup[] = [
  {
    id: 'milestones',
    type: 'milestone',
    title: 'Cột mốc thành tích',
    description: 'Gom nhóm các thông báo cột mốc',
    icon: <Group className="h-4 w-4" />,
    count: 0,
    latestTime: new Date(),
    enabled: true,
    groupingMode: 'type',
    maxGroupSize: 5,
  },
  {
    id: 'social',
    type: 'social',
    title: 'Thông báo xã hội',
    description: 'Gom nhóm các thông báo like, comment, share',
    icon: <Heart className="h-4 w-4" />,
    count: 0,
    latestTime: new Date(),
    enabled: true,
    groupingMode: 'type',
    maxGroupSize: 10,
  },
  {
    id: 'system',
    type: 'system',
    title: 'Thông báo hệ thống',
    description: 'Gom nhóm các thông báo hệ thống',
    icon: <Shield className="h-4 w-4" />,
    count: 0,
    latestTime: new Date(),
    enabled: true,
    groupingMode: 'priority',
    maxGroupSize: 3,
  },
  {
    id: 'reminders',
    type: 'reminder',
    title: 'Nhắc nhở kỷ niệm',
    description: 'Gom nhóm các nhắc nhở kỷ niệm',
    icon: <AlertTriangle className="h-4 w-4" />,
    count: 0,
    latestTime: new Date(),
    enabled: true,
    groupingMode: 'time',
    maxGroupSize: 7,
  },
];

export default function NotificationGrouping({
  groups = DEFAULT_GROUPS,
  onSave,
  onCancel,
  isSaving = false,
}: NotificationGroupingProps) {
  const [localGroups, setLocalGroups] = useState<NotificationGroup[]>(groups);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggleEnabled = (id: string) => {
    setLocalGroups(prev => 
      prev.map(group => 
        group.id === id ? { ...group, enabled: !group.enabled } : group
      )
    );
    setHasChanges(true);
  };

  const handleGroupingModeChange = (id: string, mode: NotificationGroup['groupingMode']) => {
    setLocalGroups(prev => 
      prev.map(group => 
        group.id === id ? { ...group, groupingMode: mode } : group
      )
    );
    setHasChanges(true);
  };

  const handleMaxGroupSizeChange = (id: string, size: number) => {
    setLocalGroups(prev => 
      prev.map(group => 
        group.id === id ? { ...group, maxGroupSize: Math.max(1, Math.min(20, size)) } : group
      )
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(localGroups);
      setHasChanges(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setLocalGroups(groups);
    setHasChanges(false);
  };

  const getGroupingModeLabel = (mode: NotificationGroup['groupingMode']) => {
    switch (mode) {
      case 'type':
        return 'Theo loại';
      case 'time':
        return 'Theo thời gian';
      case 'priority':
        return 'Theo ưu tiên';
      default:
        return 'Không gom nhóm';
    }
  };

  const getGroupingModeDescription = (mode: NotificationGroup['groupingMode']) => {
    switch (mode) {
      case 'type':
        return 'Gom nhóm thông báo cùng loại';
      case 'time':
        return 'Gom nhóm thông báo gần trong thời gian';
      case 'priority':
        return 'Gom nhóm theo mức độ quan trọng';
      default:
        return 'Không gom nhóm';
    }
  };

  const enabledCount = localGroups.filter(g => g.enabled).length;
  const totalNotifications = localGroups.reduce((sum, g) => sum + g.count, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Gom nhóm thông báo
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {enabledCount} nhóm đang hoạt động • {totalNotifications} thông báo
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-lg">
              Có thay đổi chưa lưu
            </span>
          )}
          <button
            type="button"
            onClick={handleCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Đóng"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Overview */}
      <div className="mb-6 p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Group className="h-4 w-4 text-teal-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Trạng thái gom nhóm
            </span>
          </div>
          <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">
            {enabledCount > 0 ? 'Đang hoạt động' : 'Đã tắt'}
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
          Gom nhóm giúp giảm số lượng thông báo hiển thị và làm cho trải nghiệm người dùng gọn gàng hơn.
        </p>
      </div>

      {/* Groups Configuration */}
      <div className="space-y-4">
        {localGroups.map((group) => (
          <div
            key={group.id}
            className={`p-4 rounded-xl border-2 transition-all ${
              group.enabled
                ? 'bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border-teal-300 dark:border-teal-700'
                : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 opacity-60'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                group.enabled
                  ? 'bg-gradient-to-br from-teal-400 to-cyan-500'
                  : 'bg-slate-200 dark:bg-slate-600'
              }`}>
                {group.enabled ? (
                  <div className="text-white">
                    {group.icon}
                  </div>
                ) : (
                  <div className="text-slate-400">
                    {group.icon}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className={`font-semibold ${
                      group.enabled
                        ? 'text-teal-900 dark:text-teal-100'
                        : 'text-slate-700 dark:text-slate-300'
                    } text-sm`}>
                      {group.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {group.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleEnabled(group.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      group.enabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        group.enabled ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                {group.enabled && (
                  <div className="space-y-3 pt-3 border-t border-teal-200 dark:border-teal-800">
                    {/* Grouping Mode */}
                    <div>
                      <label className="text-[10px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Chế độ gom nhóm
                      </label>
                      <select
                        value={group.groupingMode}
                        onChange={(e) => handleGroupingModeChange(group.id, e.target.value as NotificationGroup['groupingMode'])}
                        className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                      >
                        <option value="type">Theo loại</option>
                        <option value="time">Theo thời gian</option>
                        <option value="priority">Theo ưu tiên</option>
                      </select>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {getGroupingModeDescription(group.groupingMode)}
                      </p>
                    </div>

                    {/* Max Group Size */}
                    <div>
                      <label className="text-[10px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Kích thước nhóm tối đa: {group.maxGroupSize}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={group.maxGroupSize}
                        onChange={(e) => handleMaxGroupSizeChange(group.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>1</span>
                        <span>20</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Số thông báo hiện tại:</span>
                      <span className="font-medium">{group.count}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Gom nhóm thông báo đang hoạt động
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Giảm {Math.round((1 - enabledCount / localGroups.length) * 100)}% số lượng thông báo
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {isSaving ? (
            <>
              <Settings className="h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Lưu thay đổi
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={!hasChanges}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors disabled:opacity-50"
        >
          Hủy
        </button>
      </div>

      {/* Info Text */}
      <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-lg">
        <p className="text-[10px] text-teal-700 dark:text-teal-400">
          <strong>Lưu ý:</strong> Gom nhóm thông báo sẽ tự động kết hợp các thông báo tương tự 
          thành một nhóm duy nhất để giảm clutter. Bạn vẫn có thể xem từng thông báo riêng lẻ.
        </p>
      </div>
    </div>
  );
}