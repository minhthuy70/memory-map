'use client';

import { useState } from 'react';
import { Smartphone, Bell, BellOff, Check, X, Save, Settings, Shield, AlertTriangle, Wifi, Signal } from 'lucide-react';

interface MobilePushSettings {
  enabled: boolean;
  deviceType: 'ios' | 'android';
  permissionStatus: 'granted' | 'denied' | 'not_determined' | 'limited';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  categories: {
    milestones: boolean;
    social: boolean;
    system: boolean;
    reminders: boolean;
    location: boolean;
  };
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  badgeEnabled: boolean;
}

interface MobilePushNotificationsProps {
  settings?: MobilePushSettings;
  onRequestPermission?: () => Promise<'granted' | 'denied' | 'limited'>;
  onSettingsChange?: (settings: MobilePushSettings) => Promise<void>;
  onCancel?: () => void;
  isSaving?: boolean;
}

const DEFAULT_SETTINGS: MobilePushSettings = {
  enabled: false,
  deviceType: 'ios',
  permissionStatus: 'not_determined',
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
  categories: {
    milestones: true,
    social: true,
    system: true,
    reminders: true,
    location: true,
  },
  soundEnabled: true,
  vibrationEnabled: true,
  badgeEnabled: true,
};

export default function MobilePushNotifications({
  settings = DEFAULT_SETTINGS,
  onRequestPermission,
  onSettingsChange,
  onCancel,
  isSaving = false,
}: MobilePushNotificationsProps) {
  const [localSettings, setLocalSettings] = useState<MobilePushSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const handleRequestPermission = async () => {
    if (!onRequestPermission) return;
    
    setIsRequestingPermission(true);
    try {
      const permission = await onRequestPermission();
      setLocalSettings(prev => ({
        ...prev,
        permissionStatus: permission,
        enabled: permission === 'granted',
      }));
      setHasChanges(true);
    } catch (error) {
      console.error('Failed to request permission:', error);
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleToggleEnabled = (enabled: boolean) => {
    setLocalSettings(prev => ({ ...prev, enabled }));
    setHasChanges(true);
  };

  const handleToggleQuietHours = (enabled: boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      quietHours: { ...prev.quietHours, enabled },
    }));
    setHasChanges(true);
  };

  const handleQuietHoursChange = (field: 'start' | 'end', value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      quietHours: { ...prev.quietHours, [field]: value },
    }));
    setHasChanges(true);
  };

  const handleCategoryToggle = (category: keyof MobilePushSettings['categories']) => {
    setLocalSettings(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: !prev.categories[category],
      },
    }));
    setHasChanges(true);
  };

  const handleToggleSetting = (setting: 'soundEnabled' | 'vibrationEnabled' | 'badgeEnabled') => {
    setLocalSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (onSettingsChange) {
      await onSettingsChange(localSettings);
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

  const isPermissionDenied = localSettings.permissionStatus === 'denied';
  const isPermissionGranted = localSettings.permissionStatus === 'granted';
  const isPermissionLimited = localSettings.permissionStatus === 'limited';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${
            isPermissionGranted
              ? 'bg-gradient-to-br from-green-400 to-emerald-500'
              : isPermissionDenied
              ? 'bg-gradient-to-br from-red-400 to-rose-500'
              : 'bg-gradient-to-br from-blue-400 to-indigo-500'
          }`}>
            <Smartphone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Thông báo đẩy Mobile
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isPermissionGranted
                ? 'Đã bật thông báo'
                : isPermissionDenied
                ? 'Đã từ chối thông báo'
                : isPermissionLimited
                ? 'Đã bật giới hạn'
                : 'Chưa bật thông báo'}
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

      {/* Device Info */}
      <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-200 dark:bg-slate-600 rounded-lg">
            {localSettings.deviceType === 'ios' ? (
              <Signal className="h-4 w-4 text-slate-500" />
            ) : (
              <Wifi className="h-4 w-4 text-slate-500" />
            )}
          </div>
          <div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {localSettings.deviceType === 'ios' ? 'iOS Device' : 'Android Device'}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Push notifications supported
            </p>
          </div>
        </div>
      </div>

      {/* Permission Status */}
      <div className={`mb-4 p-4 rounded-xl border-2 ${
        isPermissionGranted
          ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700'
          : isPermissionDenied
          ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700'
          : isPermissionLimited
          ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700'
          : 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPermissionGranted ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : isPermissionDenied ? (
              <X className="h-4 w-4 text-red-500" />
            ) : isPermissionLimited ? (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            ) : (
              <Shield className="h-4 w-4 text-blue-500" />
            )}
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {isPermissionGranted
                ? 'Đã cấp quyền thông báo'
                : isPermissionDenied
                ? 'Đã từ chối quyền thông báo'
                : isPermissionLimited
                ? 'Đã cấp quyền giới hạn'
                : 'Chưa cấp quyền thông báo'}
            </span>
          </div>
          {!isPermissionGranted && !isPermissionDenied && (
            <button
              type="button"
              onClick={handleRequestPermission}
              disabled={isRequestingPermission}
              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              {isRequestingPermission ? 'Đang yêu cầu...' : 'Yêu cầu quyền'}
            </button>
          )}
        </div>
      </div>

      {isPermissionDenied && (
        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            Bạn đã từ chối quyền thông báo. Để bật lại:
          </p>
          <ol className="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-decimal list-inside">
            <li>Đi vào Cài đặt thiết bị</li>
            <li>Tìm Memory Map trong danh sách ứng dụng</li>
            <li>Bật "Thông báo" hoặc "Notifications"</li>
            <li>Quay lại ứng dụng để áp dụng thay đổi</li>
          </ol>
        </div>
      )}

      {isPermissionLimited && (
        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Quyền thông báo đang ở chế độ giới hạn. Một số tính năng có thể không hoạt động đầy đủ.
              Vui lòng kiểm tra cài đặt thiết bị để cấp quyền đầy đủ.
            </p>
          </div>
        </div>
      )}

      {/* Settings */}
      {isPermissionGranted && (
        <div className="space-y-4">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Bật thông báo đẩy
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleEnabled(!localSettings.enabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                localSettings.enabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  localSettings.enabled ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          {/* Notification Options */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Tùy chọn thông báo
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Âm thanh
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleSetting('soundEnabled')}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    localSettings.soundEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      localSettings.soundEnabled ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Rung
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleSetting('vibrationEnabled')}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    localSettings.vibrationEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      localSettings.vibrationEnabled ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Badge trên icon ứng dụng
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleSetting('badgeEnabled')}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    localSettings.badgeEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      localSettings.badgeEnabled ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BellOff className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Giờ yên tĩnh
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleQuietHours(!localSettings.quietHours.enabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  localSettings.quietHours.enabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    localSettings.quietHours.enabled ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
            
            {localSettings.quietHours.enabled && (
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                <div className="flex-1">
                  <label className="text-[10px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Bắt đầu
                  </label>
                  <input
                    type="time"
                    value={localSettings.quietHours.start}
                    onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Kết thúc
                  </label>
                  <input
                    type="time"
                    value={localSettings.quietHours.end}
                    onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Loại thông báo
            </h4>
            <div className="space-y-2">
              {Object.entries(localSettings.categories).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                    {key === 'milestones' && 'Cột mốc thành tích'}
                    {key === 'social' && 'Thông báo xã hội'}
                    {key === 'system' && 'Thông báo hệ thống'}
                    {key === 'reminders' && 'Nhắc nhở kỷ niệm'}
                    {key === 'location' && 'Thông báo vị trí'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCategoryToggle(key as keyof MobilePushSettings['categories'])}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      value ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        value ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {isPermissionGranted && (
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
      )}

      {/* Info Text */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Thông báo đẩy mobile sẽ hiển thị ngay cả khi ứng dụng không đang mở. 
          Bạn có thể tắt bất cứ lúc nào trong cài đặt thiết bị.
        </p>
      </div>
    </div>
  );
}