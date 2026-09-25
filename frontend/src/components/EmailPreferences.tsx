'use client';

import { useState } from 'react';
import { Mail, Calendar, Clock, TrendingUp, Heart, Check, X, Save, Settings } from 'lucide-react';

interface EmailPreference {
  id: string;
  type: 'daily' | 'weekly' | 'anniversary' | 'reminder' | 'activity' | 'social';
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  frequency?: 'immediate' | 'daily' | 'weekly' | 'monthly';
  time?: string;
}

interface EmailPreferencesProps {
  preferences?: EmailPreference[];
  onSave?: (preferences: EmailPreference[]) => Promise<void>;
  onCancel?: () => void;
  isSaving?: boolean;
}

const DEFAULT_PREFERENCES: EmailPreference[] = [
  {
    id: 'daily-digest',
    type: 'daily',
    title: 'Tóm tắt kỷ niệm hàng ngày',
    description: 'Nhận email tóm tắt các kỷ niệm mới mỗi ngày',
    icon: <Mail className="h-4 w-4" />,
    enabled: false,
    frequency: 'daily',
    time: '09:00',
  },
  {
    id: 'weekly-summary',
    type: 'weekly',
    title: 'Tóm tắt kỷ niệm hàng tuần',
    description: 'Nhận email tổng hợp kỷ niệm của tuần mỗi thứ 7',
    icon: <Calendar className="h-4 w-4" />,
    enabled: false,
    frequency: 'weekly',
    time: '10:00',
  },
  {
    id: 'memory-anniversary',
    type: 'anniversary',
    title: 'Nhắc nhở ngày kỷ niệm',
    description: 'Nhận email nhắc nhở vào ngày kỷ niệm quan trọng',
    icon: <Heart className="h-4 w-4" />,
    enabled: true,
    frequency: 'immediate',
  },
  {
    id: 'reminder-emails',
    type: 'reminder',
    title: 'Email nhắc nhở',
    description: 'Nhận email nhắc nhở trước ngày kỷ niệm',
    icon: <Clock className="h-4 w-4" />,
    enabled: true,
    frequency: 'daily',
    time: '08:00',
  },
  {
    id: 'activity-reports',
    type: 'activity',
    title: 'Báo cáo hoạt động',
    description: 'Nhận báo cáo thống kê hoạt động hàng tháng',
    icon: <TrendingUp className="h-4 w-4" />,
    enabled: false,
    frequency: 'monthly',
    time: '09:00',
  },
  {
    id: 'social-notifications',
    type: 'social',
    title: 'Thông báo xã hội',
    description: 'Nhận email khi có tương tác xã hội với kỷ niệm của bạn',
    icon: <Mail className="h-4 w-4" />,
    enabled: false,
    frequency: 'immediate',
  },
];

export default function EmailPreferences({
  preferences = DEFAULT_PREFERENCES,
  onSave,
  onCancel,
  isSaving = false,
}: EmailPreferencesProps) {
  const [localPreferences, setLocalPreferences] = useState<EmailPreference[]>(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (id: string) => {
    setLocalPreferences(prev => 
      prev.map(pref => 
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
    setHasChanges(true);
  };

  const handleFrequencyChange = (id: string, frequency: EmailPreference['frequency']) => {
    setLocalPreferences(prev => 
      prev.map(pref => 
        pref.id === id ? { ...pref, frequency } : pref
      )
    );
    setHasChanges(true);
  };

  const handleTimeChange = (id: string, time: string) => {
    setLocalPreferences(prev => 
      prev.map(pref => 
        pref.id === id ? { ...pref, time } : pref
      )
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(localPreferences);
      setHasChanges(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setLocalPreferences(preferences);
    setHasChanges(false);
  };

  const getFrequencyLabel = (frequency?: EmailPreference['frequency']) => {
    switch (frequency) {
      case 'immediate':
        return 'Ngay lập tức';
      case 'daily':
        return 'Hàng ngày';
      case 'weekly':
        return 'Hàng tuần';
      case 'monthly':
        return 'Hàng tháng';
      default:
        return 'Không đặt';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tùy chọn Email
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cấu hình email thông báo
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

      <div className="space-y-4">
        {localPreferences.map((preference) => (
          <div
            key={preference.id}
            className={`p-4 rounded-xl border-2 transition-all ${
              preference.enabled
                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-300 dark:border-blue-700'
                : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 opacity-60'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                preference.enabled
                  ? 'bg-gradient-to-br from-blue-400 to-indigo-500'
                  : 'bg-slate-200 dark:bg-slate-600'
              }`}>
                {preference.enabled ? (
                  <div className="text-white">
                    {preference.icon}
                  </div>
                ) : (
                  <div className="text-slate-400">
                    {preference.icon}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${
                    preference.enabled
                      ? 'text-blue-900 dark:text-blue-100'
                      : 'text-slate-700 dark:text-slate-300'
                  } text-sm`}>
                    {preference.title}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleToggle(preference.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      preference.enabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        preference.enabled ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                  {preference.description}
                </p>
                
                {preference.enabled && (
                  <div className="flex items-center gap-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                    <div className="flex-1">
                      <label className="text-[10px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Tần suất
                      </label>
                      <select
                        value={preference.frequency}
                        onChange={(e) => handleFrequencyChange(preference.id, e.target.value as EmailPreference['frequency'])}
                        className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option value="immediate">Ngay lập tức</option>
                        <option value="daily">Hàng ngày</option>
                        <option value="weekly">Hàng tuần</option>
                        <option value="monthly">Hàng tháng</option>
                      </select>
                    </div>
                    {preference.frequency !== 'immediate' && (
                      <div className="flex-1">
                        <label className="text-[10px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                          Giờ gửi
                        </label>
                        <input
                          type="time"
                          value={preference.time || '09:00'}
                          onChange={(e) => handleTimeChange(preference.id, e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                    )}
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
              {localPreferences.filter(p => p.enabled).length} loại email đang bật
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {getFrequencyLabel(localPreferences.find(p => p.enabled)?.frequency)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
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
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Email sẽ được gửi đến địa chỉ email đã đăng ký. 
          Bạn có thể thay đổi email trong cài đặt tài khoản.
        </p>
      </div>
    </div>
  );
}