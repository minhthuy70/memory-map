'use client';

import { useState } from 'react';
import { Calendar, CheckCircle, Clock, Globe, Info, RefreshCw } from 'lucide-react';

interface DateFormatLocalizationProps {
  onCancel?: () => void;
}

interface LocaleFormat {
  locale: string;
  name: string;
  region: string;
  shortDate: string;
  longDate: string;
  timeFormat: string;
}

export default function DateFormatLocalization({ onCancel }: DateFormatLocalizationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState<string>('vi-VN');
  const [customDate, setCustomDate] = useState(new Date());

  const [localeFormats, setLocaleFormats] = useState<LocaleFormat[]>([
    { locale: 'vi-VN', name: 'Vietnamese', region: 'Vietnam', shortDate: 'dd/MM/yyyy', longDate: 'dddd, dd MMMM yyyy', timeFormat: 'HH:mm:ss' },
    { locale: 'en-US', name: 'English', region: 'United States', shortDate: 'MM/dd/yyyy', longDate: 'MMMM d, yyyy', timeFormat: 'h:mm:ss a' },
    { locale: 'ja-JP', name: 'Japanese', region: 'Japan', shortDate: 'yyyy/MM/dd', longDate: 'yyyy年MM月dd日', timeFormat: 'HH:mm:ss' },
    { locale: 'ko-KR', name: 'Korean', region: 'South Korea', shortDate: 'yyyy.MM.dd', longDate: 'yyyy년 MM월 dd일', timeFormat: 'HH:mm:ss' },
    { locale: 'zh-CN', name: 'Chinese Simplified', region: 'China', shortDate: 'yyyy/MM/dd', longDate: 'yyyy年M月d日', timeFormat: 'HH:mm:ss' },
    { locale: 'fr-FR', name: 'French', region: 'France', shortDate: 'dd/MM/yyyy', longDate: 'd MMMM yyyy', timeFormat: 'HH:mm:ss' },
    { locale: 'de-DE', name: 'German', region: 'Germany', shortDate: 'dd.MM.yyyy', longDate: 'd. MMMM yyyy', timeFormat: 'HH:mm:ss' },
    { locale: 'es-ES', name: 'Spanish', region: 'Spain', shortDate: 'dd/MM/yyyy', longDate: 'd de MMMM de yyyy', timeFormat: 'HH:mm:ss' },
    { locale: 'pt-BR', name: 'Portuguese', region: 'Brazil', shortDate: 'dd/MM/yyyy', longDate: 'd de MMMM de yyyy', timeFormat: 'HH:mm:ss' },
    { locale: 'th-TH', name: 'Thai', region: 'Thailand', shortDate: 'dd/MM/yyyy', longDate: 'd MMMM yyyy', timeFormat: 'HH:mm:ss' },
    { locale: 'id-ID', name: 'Indonesian', region: 'Indonesia', shortDate: 'dd/MM/yyyy', longDate: 'd MMMM yyyy', timeFormat: 'HH:mm:ss' },
    { locale: 'ar-SA', name: 'Arabic', region: 'Saudi Arabia', shortDate: 'dd/MM/yyyy', longDate: 'd MMMM yyyy', timeFormat: 'HH:mm:ss' },
    { locale: 'hi-IN', name: 'Hindi', region: 'India', shortDate: 'dd/MM/yyyy', longDate: 'd MMMM yyyy', timeFormat: 'HH:mm:ss' },
  ]);

  const formatDate = (date: Date, locale: string, format: 'short' | 'long') => {
    const options: Intl.DateTimeFormatOptions = format === 'short'
      ? { year: 'numeric', month: '2-digit', day: '2-digit' }
      : { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(locale, options);
  };

  const formatTime = (date: Date, locale: string) => {
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getDateTime = (locale: string) => {
    const format = localeFormats.find(f => f.locale === locale);
    return format || localeFormats[0];
  };

  const currentFormat = getDateTime(selectedLocale);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Date Format Localization
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Format dates by locale/region
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Locales</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{localeFormats.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Selected</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{currentFormat.name}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Region</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{currentFormat.region}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {selectedLocale === 'vi-VN' ? 'Default' : 'Custom'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedLocale}
            onChange={(e) => setSelectedLocale(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          >
            {localeFormats.map((format) => (
              <option key={format.locale} value={format.locale}>
                {format.name} ({format.region})
              </option>
            ))}
          </select>
          <input
            type="date"
            value={customDate.toISOString().split('T')[0]}
            onChange={(e) => setCustomDate(new Date(e.target.value))}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          />
          <button
            type="button"
            onClick={() => setCustomDate(new Date())}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Today
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Preview: {currentFormat.name}</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Short Date</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {formatDate(customDate, selectedLocale, 'short')}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Long Date</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {formatDate(customDate, selectedLocale, 'long')}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Time</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {formatTime(customDate, selectedLocale)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Available Locales</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {localeFormats.map((format) => (
              <button
                key={format.locale}
                type="button"
                onClick={() => setSelectedLocale(format.locale)}
                className={`p-3 rounded-lg border text-left ${
                  selectedLocale === format.locale
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {selectedLocale === format.locale && <CheckCircle className="h-3 w-3 text-blue-500" />}
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">{format.name}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{format.region}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{format.shortDate}</p>
              </button>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Date Format Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Use short format for compact displays</li>
              <li>• Use long format for detailed views</li>
              <li>• Time format varies by locale (12h/24h)</li>
              <li>• Vietnamese uses DD/MM/YYYY format</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
