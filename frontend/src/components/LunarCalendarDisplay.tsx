'use client';

import { useState } from 'react';
import { Calendar, CheckCircle, Info, Moon, RefreshCw, Star, Sun } from 'lucide-react';

interface LunarCalendarDisplayProps {
  onCancel?: () => void;
}

interface LunarDate {
  solarDate: string;
  lunarYear: string;
  lunarMonth: string;
  lunarDay: string;
  lunarZodiac: string;
  lunarElement: string;
  isLeapMonth: boolean;
}

export default function LunarCalendarDisplay({ onCancel }: LunarCalendarDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showLunar, setShowLunar] = useState(true);

  const [lunarDates, setLunarDates] = useState<LunarDate[]>([
    { solarDate: '2026-09-14', lunarYear: '2026', lunarMonth: '8', lunarDay: '23', lunarZodiac: 'Horse', lunarElement: 'Fire', isLeapMonth: false },
    { solarDate: '2026-09-15', lunarYear: '2026', lunarMonth: '8', lunarDay: '24', lunarZodiac: 'Horse', lunarElement: 'Fire', isLeapMonth: false },
    { solarDate: '2026-09-16', lunarYear: '2026', lunarMonth: '8', lunarDay: '25', lunarZodiac: 'Horse', lunarElement: 'Fire', isLeapMonth: false },
    { solarDate: '2026-09-17', lunarYear: '2026', lunarMonth: '8', lunarDay: '26', lunarZodiac: 'Horse', lunarElement: 'Fire', isLeapMonth: false },
    { solarDate: '2026-09-18', lunarYear: '2026', lunarMonth: '8', lunarDay: '27', lunarZodiac: 'Horse', lunarElement: 'Fire', isLeapMonth: false },
  ]);

  const getCurrentLunarDate = () => {
    const dateStr = currentDate.toISOString().split('T')[0];
    return lunarDates.find(d => d.solarDate === dateStr) || lunarDates[0];
  };

  const currentLunar = getCurrentLunarDate();

  const zodiacSigns = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Moon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Lunar Calendar Display
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Display lunar calendar alongside solar
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Solar Date</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{currentDate.toLocaleDateString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Lunar CalendarDays</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{currentLunar.lunarYear}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Lunar Date</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {currentLunar.lunarMonth}/{currentLunar.lunarDay}
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Zodiac</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{currentLunar.lunarZodiac}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            type="date"
            value={currentDate.toISOString().split('T')[0]}
            onChange={(e) => setCurrentDate(new Date(e.target.value))}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          />
          <button
            type="button"
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Today
          </button>
          <button
            type="button"
            onClick={() => setShowLunar(!showLunar)}
            className={`px-3 py-1.5 rounded-lg text-xs border-0 flex items-center gap-1 ${
              showLunar
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Moon className="h-3 w-3" />
            {showLunar ? 'Hide Lunar' : 'Show Lunar'}
          </button>
        </div>

        {showLunar && (
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Lunar Calendar Information</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-slate-500" />
                  <span className="text-xs text-slate-700 dark:text-slate-300">Solar Date</span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-slate-500" />
                  <span className="text-xs text-slate-700 dark:text-slate-300">Lunar Date</span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {currentLunar.lunarYear}年{currentLunar.lunarMonth}月{currentLunar.lunarDay}日
                  {currentLunar.isLeapMonth && ' (Leap)'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-slate-500" />
                  <span className="text-xs text-slate-700 dark:text-slate-300">Zodiac Sign</span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {currentLunar.lunarElement} {currentLunar.lunarZodiac}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Lunar Calendar Days</h4>
          <div className="grid grid-cols-5 gap-2">
            {lunarDates.map((date) => (
              <button
                key={date.solarDate}
                type="button"
                onClick={() => setCurrentDate(new Date(date.solarDate))}
                className={`p-3 rounded-lg border text-center ${
                  currentDate.toISOString().split('T')[0] === date.solarDate
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="text-xs font-semibold text-slate-900 dark:text-white mb-1">
                  {new Date(date.solarDate).getDate()}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {date.lunarMonth}/{date.lunarDay}
                </div>
                {date.isLeapMonth && (
                  <div className="text-xs text-purple-600 dark:text-purple-400">Leap</div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Zodiac Cycle</h4>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {zodiacSigns.map((sign) => (
              <button
                key={sign}
                type="button"
                className={`p-2 rounded-lg border text-xs ${
                  currentLunar.lunarZodiac === sign
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {sign}
              </button>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Lunar Calendar Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Vietnamese calendar uses lunisolar system</li>
              <li>• Lunar dates are important for festivals</li>
              <li>• Zodiac cycle repeats every 12 years</li>
              <li>• Element cycle repeats every 5 years</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
