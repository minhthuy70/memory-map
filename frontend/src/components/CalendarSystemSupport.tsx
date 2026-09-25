'use client';

import { useState } from 'react';
import { Calendar, CheckCircle, Info, Moon, RefreshCw, Star, Sun } from 'lucide-react';

interface CalendarSystemSupportProps {
  onCancel?: () => void;
}

interface CalendarSystem {
  id: string;
  name: string;
  region: string;
  type: 'solar' | 'lunar' | 'lunisolar';
  description: string;
  example: string;
}

export default function CalendarSystemSupport({ onCancel }: CalendarSystemSupportProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<string>('gregorian');
  const [currentDate, setCurrentDate] = useState(new Date());

  const [calendarSystems, setCalendarSystems] = useState<CalendarSystem[]>([
    { id: 'gregorian', name: 'Gregorian', region: 'International', type: 'solar', description: 'Standard solar calendar used worldwide', example: '2026-09-14' },
    { id: 'vietnamese', name: 'Vietnamese', region: 'Vietnam', type: 'lunisolar', description: 'Traditional Vietnamese lunar calendar', example: '2026年八月廿三' },
    { id: 'chinese', name: 'Chinese', region: 'China', type: 'lunisolar', description: 'Traditional Chinese lunar calendar', example: '2026年八月廿三' },
    { id: 'japanese', name: 'Japanese', region: 'Japan', type: 'solar', description: 'Japanese era calendar system', example: '令和8年9月14日' },
    { id: 'korean', name: 'Korean', region: 'South Korea', type: 'lunisolar', description: 'Traditional Korean lunar calendar', example: '2026년 8월 23일' },
    { id: 'persian', name: 'Persian', region: 'Iran', type: 'solar', description: 'Solar Hijri calendar', example: '1405/06/23' },
    { id: 'hebrew', name: 'Hebrew', region: 'Israel', type: 'lunisolar', description: 'Jewish calendar system', example: '5 Elul 5786' },
    { id: 'islamic', name: 'Islamic', region: 'Muslim countries', type: 'lunar', description: 'Hijri lunar calendar', example: '1 Rabi Al-Awwal 1448' },
  ]);

  const getSystemIcon = (type: string) => {
    switch (type) {
      case 'solar': return <Sun className="h-3 w-3" />;
      case 'lunar': return <Moon className="h-3 w-3" />;
      case 'lunisolar': return <Star className="h-3 w-3" />;
      default: return <Calendar className="h-3 w-3" />;
    }
  };

  const getCurrentSystem = () => {
    return calendarSystems.find(s => s.id === selectedSystem) || calendarSystems[0];
  };

  const currentSystem = getCurrentSystem();

  const convertDate = (date: Date, system: string) => {
    const formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return formatted;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Calendar System Support
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Support multiple calendar systems
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Systems</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{calendarSystems.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Selected</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{currentSystem.name}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Type</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400 capitalize">{currentSystem.type}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Region</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{currentSystem.region}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedSystem}
            onChange={(e) => setSelectedSystem(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          >
            {calendarSystems.map((system) => (
              <option key={system.id} value={system.id}>
                {system.name} ({system.region})
              </option>
            ))}
          </select>
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
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Preview: {currentSystem.name}</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Current Date</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {convertDate(currentDate, selectedSystem)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                {getSystemIcon(currentSystem.type)}
                <span className="text-xs text-slate-700 dark:text-slate-300">Calendar Type</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                {currentSystem.type}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Description</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {currentSystem.description}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Example Format</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {currentSystem.example}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Available Calendar Systems</h4>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {calendarSystems.map((system) => (
              <button
                key={system.id}
                type="button"
                onClick={() => setSelectedSystem(system.id)}
                className={`p-3 rounded-lg border text-left ${
                  selectedSystem === system.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {selectedSystem === system.id && <CheckCircle className="h-3 w-3 text-blue-500" />}
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">{system.name}</span>
                  {getSystemIcon(system.type)}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{system.region}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{system.description}</p>
              </button>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Calendar System Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Gregorian is the international standard calendar</li>
              <li>• Lunar calendars follow moon phases</li>
              <li>• Lunisolar calendars combine both systems</li>
              <li>• Vietnamese calendar shows both solar and lunar dates</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
