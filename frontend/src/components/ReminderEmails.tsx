'use client';

import { useState } from 'react';
import { Bell, Clock, Calendar, Mail, Check, X, Save, Settings, AlertTriangle, Info } from 'lucide-react';

interface ReminderEmailConfig {
  enabled: boolean;
  reminderTiming: 'same_day' | 'day_before' | 'week_before' | 'custom';
  customDaysBefore: number[];
  sendTime: string;
  includeMemoryDetails: boolean;
  includeImages: boolean;
  recipientEmails: string[];
}

interface ReminderEmailsProps {
  config?: ReminderEmailConfig;
  onSave?: (config: ReminderEmailConfig) => Promise<void>;
  onSendTest?: () => Promise<void>;
  onCancel?: () => void;
  isSaving?: boolean;
  isSending?: boolean;
}

const DEFAULT_CONFIG: ReminderEmailConfig = {
  enabled: false,
  reminderTiming: 'day_before',
  customDaysBefore: [1, 3, 7],
  sendTime: '09:00',
  includeMemoryDetails: true,
  includeImages: true,
  recipientEmails: [],
};

export default function ReminderEmails({
  config = DEFAULT_CONFIG,
  onSave,
  onSendTest,
  onCancel,
  isSaving = false,
  isSending = false,
}: ReminderEmailsProps) {
  const [localConfig, setLocalConfig] = useState<ReminderEmailConfig>(config);
  const [hasChanges, setHasChanges] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const handleToggleEnabled = (enabled: boolean) => {
    setLocalConfig(prev => ({ ...prev, enabled }));
    setHasChanges(true);
  };

  const handleConfigChange = (field: keyof ReminderEmailConfig, value: any) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleAddEmail = () => {
    if (newEmail && localConfig.recipientEmails.length < 5) {
      setLocalConfig(prev => ({
        ...prev,
        recipientEmails: [...prev.recipientEmails, newEmail],
      }));
      setNewEmail('');
      setHasChanges(true);
    }
  };

  const handleRemoveEmail = (email: string) => {
    setLocalConfig(prev => ({
      ...prev,
      recipientEmails: prev.recipientEmails.filter(e => e !== email),
    }));
    setHasChanges(true);
  };

  const handleToggleCustomDay = (day: number) => {
    setLocalConfig(prev => ({
      ...prev,
      customDaysBefore: prev.customDaysBefore.includes(day)
        ? prev.customDaysBefore.filter(d => d !== day)
        : [...prev.customDaysBefore, day].sort((a, b) => a - b),
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(localConfig);
      setHasChanges(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setLocalConfig(config);
    setHasChanges(false);
  };

  const handleSendTest = async () => {
    if (onSendTest) {
      await onSendTest();
    }
  };

  const getTimingLabel = (timing: ReminderEmailConfig['reminderTiming']) => {
    switch (timing) {
      case 'same_day':
        return 'Ngày kỷ niệm';
      case 'day_before':
        return '1 ngày trước';
      case 'week_before':
        return '1 tuần trước';
      case 'custom':
        return 'Tùy chỉnh';
      default:
        return 'Tùy chỉnh';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${
            localConfig.enabled
              ? 'bg-gradient-to-br from-amber-400 to-orange-500'
              : 'bg-slate-200 dark:bg-slate-600'
          }`}>
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Email nhắc nhở kỷ niệm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {localConfig.enabled ? 'Đang hoạt động' : 'Đã tắt'}
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
          <Mail className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Bật email nhắc nhở
          </span>
        </div>
        <button
          type="button"
          onClick={() => handleToggleEnabled(!localConfig.enabled)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            localConfig.enabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              localConfig.enabled ? 'translate-x-6' : ''
            }`}
          />
        </button>
      </div>

      {localConfig.enabled && (
        <div className="space-y-4">
          {/* Reminder Timing */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Thời gian nhắc nhở
            </label>
            <select
              value={localConfig.reminderTiming}
              onChange={(e) => handleConfigChange('reminderTiming', e.target.value as ReminderEmailConfig['reminderTiming'])}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            >
              <option value="same_day">Ngày kỷ niệm</option>
              <option value="day_before">1 ngày trước</option>
              <option value="week_before">1 tuần trước</option>
              <option value="custom">Tùy chỉnh</option>
            </select>
          </div>

          {/* Custom Days Before */}
          {localConfig.reminderTiming === 'custom' && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-2">
                Nhắc nhở trước (ngày)
              </label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 5, 7, 14, 30].map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleCustomDay(day)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                      localConfig.customDaysBefore.includes(day)
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {day} ngày
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Send Time */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Giờ gửi email
            </label>
            <input
              type="time"
              value={localConfig.sendTime}
              onChange={(e) => handleConfigChange('sendTime', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Content Options */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Nội dung email
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Bao gồm chi tiết kỷ niệm
                </span>
                <button
                  type="button"
                  onClick={() => handleConfigChange('includeMemoryDetails', !localConfig.includeMemoryDetails)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    localConfig.includeMemoryDetails ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      localConfig.includeMemoryDetails ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Bao gồm ảnh kỷ niệm
                </span>
                <button
                  type="button"
                  onClick={() => handleConfigChange('includeImages', !localConfig.includeImages)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    localConfig.includeImages ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      localConfig.includeImages ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Recipient Emails */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Email nhận ({localConfig.recipientEmails.length}/5)
            </label>
            <div className="space-y-2 mb-2">
              {localConfig.recipientEmails.map((email, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-slate-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-400 flex-1 truncate">
                    {email}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    className="p-1 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors"
                  >
                    <X className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Thêm email nhận..."
                className="flex-1 px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={handleAddEmail}
                disabled={!newEmail || localConfig.recipientEmails.length >= 5}
                className="px-2 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
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
        {localConfig.enabled && onSendTest && (
          <button
            type="button"
            onClick={handleSendTest}
            disabled={isSending}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
          >
            {isSending ? 'Đang gửi...' : 'Gửi thử'}
          </button>
        )}
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
      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
        <p className="text-[10px] text-amber-700 dark:text-amber-400">
          <strong>Lưu ý:</strong> Email nhắc nhở sẽ được gửi {getTimingLabel(localConfig.reminderTiming)} vào lúc {localConfig.sendTime} 
          cho các kỷ niệm có ngày nhắc nhở đã thiết lập.
        </p>
      </div>
    </div>
  );
}