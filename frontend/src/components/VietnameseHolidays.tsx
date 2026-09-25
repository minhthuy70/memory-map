'use client';

import { useState } from 'react';
import { Calendar, X, RefreshCw, Info, CheckCircle, Star, Bell, Clock } from 'lucide-react';

interface VietnameseHolidaysProps {
  onCancel?: () => void;
}

interface Holiday {
  id: string;
  name: string;
  nameVN: string;
  date: string;
  lunarDate?: string;
  type: 'fixed' | 'lunar';
  isPublic: boolean;
  description: string;
}

export default function VietnameseHolidays({ onCancel }: VietnameseHolidaysProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2026');
  const [showLunar, setShowLunar] = useState(true);

  const [holidays, setHolidays] = useState<Holiday[]>([
    { id: '1', name: 'New Year', nameVN: 'Tết Dương Lịch', date: '2026-01-01', type: 'fixed', isPublic: true, description: 'International New Year Day' },
    { id: '2', name: 'Tet Holiday', nameVN: 'Tết Nguyên Đán', date: '2026-01-29', lunarDate: '2026年正月初一', type: 'lunar', isPublic: true, description: 'Vietnamese Lunar New Year - 3 days off' },
    { id: '3', name: 'King Hung Temple Festival', nameVN: 'Giỗ Tổ Hùng Vương', date: '2026-04-14', lunarDate: '2026年三月初十', type: 'lunar', isPublic: true, description: 'Commemoration of Hung Kings' },
    { id: '4', name: 'Reunification Day', nameVN: 'Ngày Giải Phóng', date: '2026-04-30', type: 'fixed', isPublic: true, description: 'Fall of Saigon / Reunification Day' },
    { id: '5', name: 'Labor Day', nameVN: 'Ngày Quốc tế Lao động', date: '2026-05-01', type: 'fixed', isPublic: true, description: 'International Workers Day' },
    { id: '6', name: 'Independence Day', nameVN: 'Ngày Quốc Khánh', date: '2026-09-02', type: 'fixed', isPublic: true, description: 'Vietnam Independence Day' },
    { id: '7', name: 'Mid-Autumn Festival', nameVN: 'Tết Trung Thu', date: '2026-09-25', lunarDate: '2026年八月十五', type: 'lunar', isPublic: false, description: 'Children Festival' },
    { id: '8', name: 'Vietnamese Women Day', nameVN: 'Ngày Phụ nữ Việt Nam', date: '2026-10-20', type: 'fixed', isPublic: false, description: 'Vietnamese Women Day' },
    { id: '9', name: 'Vietnamese Teachers Day', nameVN: 'Ngày Nhà giáo Việt Nam', date: '2026-11-20', type: 'fixed', isPublic: false, description: 'Vietnamese Teachers Day' },
    { id: '10', name: 'Christmas', nameVN: 'Giáng Sinh', date: '2026-12-25', type: 'fixed', isPublic: false, description: 'Christmas Day' },
  ]);

  const getHolidayIcon = (type: string) => {
    switch (type) {
      case 'lunar': return <Star className="h-3 w-3" />;
      case 'fixed': return <Calendar className="h-3 w-3" />;
      default: return <Calendar className="h-3 w-3" />;
    }
  };

  const isTodayHoliday = () => {
    const today = new Date().toISOString().split('T')[0];
    return holidays.some(h => h.date === today);
  };

  const upcomingHolidays = holidays.filter(h => new Date(h.date) >= new Date()).slice(0, 3);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Vietnamese Holidays
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Vietnamese holiday calendar integration
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isTodayHoliday() && (
            <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded flex items-center gap-1">
              <Bell className="h-3 w-3" />
              Today is Holiday
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show details"
          >
            {showDetails ? <Info className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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

      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Holidays</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{holidays.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Public Holidays</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{holidays.filter(h => h.isPublic).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Lunar Holidays</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{holidays.filter(h => h.type === 'lunar').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Selected Year</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{selectedYear}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2027">2027</option>
          </select>
          <button
            type="button"
            onClick={() => setShowLunar(!showLunar)}
            className={`px-3 py-1.5 rounded-lg text-xs border-0 flex items-center gap-1 ${
              showLunar
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Star className="h-3 w-3" />
            {showLunar ? 'Hide Lunar' : 'Show Lunar'}
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        {upcomingHolidays.length > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Upcoming Holidays</h4>
            <div className="space-y-2">
              {upcomingHolidays.map((holiday) => (
                <div key={holiday.id} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center gap-2">
                    {getHolidayIcon(holiday.type)}
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{holiday.nameVN}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{holiday.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{holiday.date}</span>
                    {holiday.isPublic && (
                      <span className="px-2 py-0.5 rounded text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                        Public
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Vietnamese Holidays ({selectedYear})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {holidays.map((holiday) => (
              <div key={holiday.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    {getHolidayIcon(holiday.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{holiday.nameVN}</span>
                      {holiday.isPublic && (
                        <span className="px-2 py-0.5 rounded text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                          Public
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{holiday.name}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {holiday.date}
                      </span>
                      {showLunar && holiday.lunarDate && (
                        <span>({holiday.lunarDate})</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Vietnamese Holiday Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Tet (Lunar New Year) is the most important holiday</li>
              <li>• Public holidays typically have days off</li>
              <li>• Lunar holidays vary each year on solar calendar</li>
              <li>• King Hung Temple Festival honors Vietnamese ancestors</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
