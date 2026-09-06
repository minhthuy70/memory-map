'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, RotateCcw } from 'lucide-react';

interface UserPreferences {
  defaultView: 'map' | 'list';
  itemsPerPage: number;
  defaultSort: 'date-newest' | 'date-oldest' | 'title-az' | 'title-za';
  showStatistics: boolean;
  sidebarPosition: 'left' | 'right';
}

const DEFAULT_PREFERENCES: UserPreferences = {
  defaultView: 'map',
  itemsPerPage: 15,
  defaultSort: 'date-newest',
  showStatistics: true,
  sidebarPosition: 'left',
};

export default function UserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs));
      } catch (e) {
        console.error('Failed to parse preferences:', e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setPreferences(DEFAULT_PREFERENCES);
    localStorage.removeItem('userPreferences');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
            Tùy chỉnh người dùng
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
        {/* Default View */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
            Chế độ xem mặc định
          </label>
          <select
            value={preferences.defaultView}
            onChange={(e) => setPreferences({ ...preferences, defaultView: e.target.value as 'map' | 'list' })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="map">Bản đồ</option>
            <option value="list">Danh sách</option>
          </select>
        </div>

        {/* Items Per Page */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
            Số lượng kỷ niệm hiển thị
          </label>
          <select
            value={preferences.itemsPerPage}
            onChange={(e) => setPreferences({ ...preferences, itemsPerPage: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
          </select>
        </div>

        {/* Default Sort */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
            Sắp xếp mặc định
          </label>
          <select
            value={preferences.defaultSort}
            onChange={(e) => setPreferences({ ...preferences, defaultSort: e.target.value as any })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="date-newest">Mới nhất trước</option>
            <option value="date-oldest">Cũ nhất trước</option>
            <option value="title-az">Tiêu đề A-Z</option>
            <option value="title-za">Tiêu đề Z-A</option>
          </select>
        </div>

        {/* Show Statistics */}
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
          <span className="text-sm text-slate-700 dark:text-slate-300">
            Hiển thị thống kê
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.showStatistics}
              onChange={(e) => setPreferences({ ...preferences, showStatistics: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Sidebar Position */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
            Vị trí sidebar
          </label>
          <select
            value={preferences.sidebarPosition}
            onChange={(e) => setPreferences({ ...preferences, sidebarPosition: e.target.value as 'left' | 'right' })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="left">Bên trái</option>
            <option value="right">Bên phải</option>
          </select>
        </div>
      </div>

      <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-200 dark:border-slate-700">
        <p>• Các tùy chỉnh được lưu trên trình duyệt của bạn</p>
        <p>• Đặt lại mặc định sẽ xóa tất cả tùy chỉnh</p>
      </div>
    </div>
  );
}
