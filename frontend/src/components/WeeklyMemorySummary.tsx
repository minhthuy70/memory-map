'use client';

import { useState } from 'react';
import { Calendar, Clock, FileText, TrendingUp, Check, X, Save, Settings, Sparkles, BarChart3 } from 'lucide-react';

interface WeeklySummaryConfig {
  enabled: boolean;
  dayOfWeek: number; // 0-6, where 0 is Sunday
  time: string;
  includeImages: boolean;
  includeStats: boolean;
  includeTrends: boolean;
  maxMemories: number;
  recipientEmails: string[];
}

interface WeeklyMemorySummaryProps {
  config?: WeeklySummaryConfig;
  onSave?: (config: WeeklySummaryConfig) => Promise<void>;
  onSendTest?: () => Promise<void>;
  onCancel?: () => void;
  isSaving?: boolean;
  isSending?: boolean;
}

const DEFAULT_CONFIG: WeeklySummaryConfig = {
  enabled: false,
  dayOfWeek: 0, // Sunday
  time: '10:00',
  includeImages: true,
  includeStats: true,
  includeTrends: true,
  maxMemories: 20,
  recipientEmails: [],
};

const DAYS_OF_WEEK = [
  { value: 0, label: 'Chủ Nhật' },
  { value: 1, label: 'Thứ Hai' },
  { value: 2, label: 'Thứ Ba' },
  { value: 3, label: 'Thứ Tư' },
  { value: 4, label: 'Thứ Sáu' },
  { value: 5, label: 'Thứ Bảy' },
  { value: 6, label: 'Thứ Bảy' },
];

export default function WeeklyMemorySummary({
  config = DEFAULT_CONFIG,
  onSave,
  onSendTest,
  onCancel,
  isSaving = false,
  isSending = false,
}: WeeklyMemorySummaryProps) {
  const [localConfig, setLocalConfig] = useState<WeeklySummaryConfig>(config);
  const [hasChanges, setHasChanges] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const handleToggleEnabled = (enabled: boolean) => {
    setLocalConfig(prev => ({ ...prev, enabled }));
    setHasChanges(true);
  };

  const handleConfigChange = (field: keyof WeeklySummaryConfig, value: any) => {
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

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${
            localConfig.enabled
              ? 'bg-gradient-to-br from-green-400 to-emerald-500'
              : 'bg-slate-200 dark:bg-slate-600'
          }`}>
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tóm tắt kỷ niệm hàng tuần
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
          <Calendar className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Bật tóm tắt hàng tuần
          </span>
        </div>
        <button
          type="button"
          onClick={() => handleToggleEnabled(!localConfig.enabled)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            localConfig.enabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
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
          {/* Schedule */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Ngày trong tuần
              </label>
              <select
                value={localConfig.dayOfWeek}
                onChange={(e) => handleConfigChange('dayOfWeek', parseInt(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                {DAYS_OF_WEEK.map(day => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Giờ gửi
              </label>
              <input
                type="time"
                value={localConfig.time}
                onChange={(e) => handleConfigChange('time', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Content Options */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Nội dung tóm tắt
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3 text-slate-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Bao gồm ảnh kỷ niệm
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleConfigChange('includeImages', !localConfig.includeImages)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    localConfig.includeImages ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      localConfig.includeImages ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-slate-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Bao gồm thống kê
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleConfigChange('includeStats', !localConfig.includeStats)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    localConfig.includeStats ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      localConfig.includeStats ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-3 w-3 text-slate-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Bao gồm xu hướng
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleConfigChange('includeTrends', !localConfig.includeTrends)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    localConfig.includeTrends ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      localConfig.includeTrends ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Max Memories */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Số kỷ niệm tối đa: {localConfig.maxMemories}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={localConfig.maxMemories}
              onChange={(e) => handleConfigChange('maxMemories', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>5</span>
              <span>50</span>
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
                  <FileText className="h-3 w-3 text-slate-500" />
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
                className="flex-1 px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={handleAddEmail}
                disabled={!newEmail || localConfig.recipientEmails.length >= 5}
                className="px-2 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors"
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
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
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
      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-[10px] text-green-700 dark:text-green-400">
          <strong>Lưu ý:</strong> Tóm tắt hàng tuần sẽ gửi email vào {DAYS_OF_WEEK.find(d => d.value === localConfig.dayOfWeek)?.label} lúc {localConfig.time} 
          với tổng quan các kỷ niệm trong tuần bao gồm thống kê và xu hướng.
        </p>
      </div>
    </div>
  );
}