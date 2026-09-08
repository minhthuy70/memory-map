'use client';

import { useState } from 'react';
import { Moon, Sun, Clock, Check, X, Save, Settings, Volume2, VolumeX } from 'lucide-react';

interface QuietHoursSettings {
  enabled: boolean;
  periods: Array<{
    id: string;
    name: string;
    start: string;
    end: string;
    days: number[]; // 0-6, where 0 is Sunday
    enabled: boolean;
  }>;
  exceptions: {
    important: boolean; // Allow important notifications
    reminders: boolean; // Allow reminder notifications
  };
}

interface QuietHoursProps {
  settings?: QuietHoursSettings;
  onSave?: (settings: QuietHoursSettings) => Promise<void>;
  onCancel?: () => void;
  isSaving?: boolean;
}

const DEFAULT_SETTINGS: QuietHoursSettings = {
  enabled: false,
  periods: [
    {
      id: 'night',
      name: 'Ban đêm',
      start: '22:00',
      end: '08:00',
      days: [0, 1, 2, 3, 4, 5, 6], // All days
      enabled: true,
    },
  ],
  exceptions: {
    important: true,
    reminders: true,
  },
};

const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export default function QuietHours({
  settings = DEFAULT_SETTINGS,
  onSave,
  onCancel,
  isSaving = false,
}: QuietHoursProps) {
  const [localSettings, setLocalSettings] = useState<QuietHoursSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAddPeriod, setShowAddPeriod] = useState(false);
  const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null);
  const [periodForm, setPeriodForm] = useState({
    name: '',
    start: '22:00',
    end: '08:00',
    days: [0, 1, 2, 3, 4, 5, 6],
  });

  const handleToggleEnabled = (enabled: boolean) => {
    setLocalSettings(prev => ({ ...prev, enabled }));
    setHasChanges(true);
  };

  const handleToggleException = (exception: keyof QuietHoursSettings['exceptions']) => {
    setLocalSettings(prev => ({
      ...prev,
      exceptions: {
        ...prev.exceptions,
        [exception]: !prev.exceptions[exception],
      },
    }));
    setHasChanges(true);
  };

  const handleTogglePeriod = (periodId: string) => {
    setLocalSettings(prev => ({
      ...prev,
      periods: prev.periods.map(p =>
        p.id === periodId ? { ...p, enabled: !p.enabled } : p
      ),
    }));
    setHasChanges(true);
  };

  const handleAddPeriod = () => {
    if (periodForm.name) {
      const newPeriod = {
        id: `period-${Date.now()}`,
        ...periodForm,
        enabled: true,
      };
      setLocalSettings(prev => ({
        ...prev,
        periods: [...prev.periods, newPeriod],
      }));
      setShowAddPeriod(false);
      resetPeriodForm();
      setHasChanges(true);
    }
  };

  const handleUpdatePeriod = (periodId: string) => {
    setLocalSettings(prev => ({
      ...prev,
      periods: prev.periods.map(p =>
        p.id === periodId ? { ...p, ...periodForm, enabled: true } : p
      ),
    }));
    setEditingPeriodId(null);
    resetPeriodForm();
    setHasChanges(true);
  };

  const handleDeletePeriod = (periodId: string) => {
    setLocalSettings(prev => ({
      ...prev,
      periods: prev.periods.filter(p => p.id !== periodId),
    }));
    setHasChanges(true);
  };

  const handleEditPeriod = (period: any) => {
    setEditingPeriodId(period.id);
    setPeriodForm({
      name: period.name,
      start: period.start,
      end: period.end,
      days: period.days,
    });
  };

  const handleToggleDay = (dayIndex: number) => {
    setPeriodForm(prev => ({
      ...prev,
      days: prev.days.includes(dayIndex)
        ? prev.days.filter(d => d !== dayIndex)
        : [...prev.days, dayIndex],
    }));
  };

  const resetPeriodForm = () => {
    setPeriodForm({
      name: '',
      start: '22:00',
      end: '08:00',
      days: [0, 1, 2, 3, 4, 5, 6],
    });
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(localSettings);
      setHasChanges(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setLocalSettings(settings);
    setHasChanges(false);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const isCurrentlyQuiet = () => {
    if (!localSettings.enabled) return false;
    
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return localSettings.periods.some(period => {
      if (!period.enabled || !period.days.includes(currentDay)) return false;
      
      const [startHours, startMinutes] = period.start.split(':').map(Number);
      const [endHours, endMinutes] = period.end.split(':').map(Number);
      const startTime = startHours * 60 + startMinutes;
      const endTime = endHours * 60 + endMinutes;
      
      // Handle overnight periods (e.g., 22:00 to 08:00)
      if (startTime > endTime) {
        return currentTime >= startTime || currentTime <= endTime;
      }
      
      return currentTime >= startTime && currentTime <= endTime;
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${
            localSettings.enabled
              ? 'bg-gradient-to-br from-indigo-400 to-purple-500'
              : 'bg-slate-200 dark:bg-slate-600'
          }`}>
            {localSettings.enabled ? (
              <Moon className="h-5 w-5 text-white" />
            ) : (
              <Sun className="h-5 w-5 text-slate-400" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Giờ yên tĩnh
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isCurrentlyQuiet() ? '🔇 Đang trong giờ yên tĩnh' : '🔊 Không phải giờ yên tĩnh'}
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

      {/* Enable/Disable */}
      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg mb-4">
        <div className="flex items-center gap-2">
          {localSettings.enabled ? (
            <VolumeX className="h-4 w-4 text-indigo-500" />
          ) : (
            <Volume2 className="h-4 w-4 text-slate-500" />
          )}
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Bật giờ yên tĩnh
          </span>
        </div>
        <button
          type="button"
          onClick={() => handleToggleEnabled(!localSettings.enabled)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            localSettings.enabled ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              localSettings.enabled ? 'translate-x-6' : ''
            }`}
          />
        </button>
      </div>

      {localSettings.enabled && (
        <>
          {/* Periods */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Khoảng thời gian
              </h4>
              <button
                type="button"
                onClick={() => setShowAddPeriod(!showAddPeriod)}
                className="flex items-center gap-1 px-2 py-1 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <Clock className="h-3 w-3" />
                Thêm khoảng
              </button>
            </div>

            {/* Add/Edit Period Form */}
            {(showAddPeriod || editingPeriodId) && (
              <div className="mb-3 p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                <h4 className="font-semibold text-slate-900 dark:text-white text-xs mb-3">
                  {editingPeriodId ? 'Chỉnh sửa khoảng thời gian' : 'Thêm khoảng thời gian mới'}
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                      Tên khoảng
                    </label>
                    <input
                      type="text"
                      value={periodForm.name}
                      onChange={(e) => setPeriodForm({ ...periodForm, name: e.target.value })}
                      placeholder="Ví dụ: Ban đêm, Giờ làm việc..."
                      className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Bắt đầu
                      </label>
                      <input
                        type="time"
                        value={periodForm.start}
                        onChange={(e) => setPeriodForm({ ...periodForm, start: e.target.value })}
                        className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Kết thúc
                      </label>
                      <input
                        type="time"
                        value={periodForm.end}
                        onChange={(e) => setPeriodForm({ ...periodForm, end: e.target.value })}
                        className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                      Áp dụng cho ngày
                    </label>
                    <div className="flex gap-1 flex-wrap">
                      {DAY_NAMES.map((day, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleToggleDay(index)}
                          className={`px-2 py-1 text-[10px] font-medium rounded-lg transition-colors ${
                            periodForm.days.includes(index)
                              ? 'bg-indigo-500 text-white'
                              : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-800">
                  <button
                    type="button"
                    onClick={editingPeriodId ? () => handleUpdatePeriod(editingPeriodId) : handleAddPeriod}
                    disabled={!periodForm.name}
                    className="flex-1 px-2 py-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    {editingPeriodId ? 'Cập nhật' : 'Thêm'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddPeriod(false);
                      setEditingPeriodId(null);
                      resetPeriodForm();
                    }}
                    className="px-2 py-1.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {/* Periods List */}
            <div className="space-y-2">
              {localSettings.periods.map((period) => (
                <div
                  key={period.id}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    period.enabled
                      ? 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-300 dark:border-indigo-700'
                      : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-indigo-500" />
                      <span className={`text-xs font-medium ${
                        period.enabled
                          ? 'text-indigo-900 dark:text-indigo-100'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {period.name}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {formatTime(period.start)} - {formatTime(period.end)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {period.days.map(d => DAY_NAMES[d]).join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleTogglePeriod(period.id)}
                        className={`relative w-8 h-4 rounded-full transition-colors ${
                          period.enabled ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${
                            period.enabled ? 'translate-x-4' : ''
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditPeriod(period)}
                        className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded transition-colors"
                      >
                        <Settings className="h-3 w-3 text-slate-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePeriod(period.id)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors"
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exceptions */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Ngoại lệ (Cho phép thông báo quan trọng)
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Thông báo quan trọng
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleException('important')}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    localSettings.exceptions.important ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      localSettings.exceptions.important ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Nhắc nhở kỷ niệm
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleException('reminders')}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    localSettings.exceptions.reminders ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      localSettings.exceptions.reminders ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
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
      <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-lg">
        <p className="text-[10px] text-indigo-700 dark:text-indigo-400">
          <strong>Lưu ý:</strong> Trong giờ yên tĩnh, thông báo sẽ bị tắt trừ các ngoại lệ đã đặt. 
          Bạn vẫn có thể xem thông báo trong trung tâm thông báo.
        </p>
      </div>
    </div>
  );
}