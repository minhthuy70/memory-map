'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Save, RotateCcw } from 'lucide-react';

interface NotificationPreferences {
  reminderNotifications: boolean;
  achievementNotifications: boolean;
  milestoneNotifications: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  reminderNotifications: true,
  achievementNotifications: true,
  milestoneNotifications: true,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
};

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('notificationPreferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse notification preferences:', e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setPreferences(DEFAULT_PREFERENCES);
    localStorage.removeItem('notificationPreferences');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
            Tùy chọn thông báo
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            title="Đặt lại mặc định"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Save className="h-3.5 w-3.5" />
            {saved ? 'Đã lưu' : 'Lưu'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Reminder Notifications */}
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
          <div>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              Thông báo nhắc nhở
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Nhận thông báo khi đến ngày nhắc nhở kỷ niệm
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.reminderNotifications}
              onChange={(e) => setPreferences({ ...preferences, reminderNotifications: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Achievement Notifications */}
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
          <div>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              Thông báo thành tích
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Nhận thông báo khi mở khóa thành tích mới
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.achievementNotifications}
              onChange={(e) => setPreferences({ ...preferences, achievementNotifications: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Milestone Notifications */}
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
          <div>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              Thông báo cột mốc
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Nhận thông báo khi đạt cột mốc quan trọng
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.milestoneNotifications}
              onChange={(e) => setPreferences({ ...preferences, milestoneNotifications: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Quiet Hours */}
        <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                Giờ yên tĩnh
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tắt thông báo trong khoảng thời gian
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.quietHours.enabled}
                onChange={(e) => setPreferences({
                  ...preferences,
                  quietHours: { ...preferences.quietHours, enabled: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {preferences.quietHours.enabled && (
            <div className="flex items-center gap-2 pl-2">
              <input
                type="time"
                value={preferences.quietHours.start}
                onChange={(e) => setPreferences({
                  ...preferences,
                  quietHours: { ...preferences.quietHours, start: e.target.value }
                })}
                className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">đến</span>
              <input
                type="time"
                value={preferences.quietHours.end}
                onChange={(e) => setPreferences({
                  ...preferences,
                  quietHours: { ...preferences.quietHours, end: e.target.value }
                })}
                className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
        </div>
      </div>

      <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-200 dark:border-slate-700">
        <p>• Các tùy chỉnh được lưu trên trình duyệt của bạn</p>
        <p>• Giờ yên tĩnh sẽ tắt tất cả thông báo trong khoảng thời gian</p>
      </div>
    </div>
  );
}
