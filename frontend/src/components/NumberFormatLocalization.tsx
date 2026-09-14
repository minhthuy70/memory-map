'use client';

import { useState } from 'react';
import { Hash, X, RefreshCw, Globe, Info, Calculator, CheckCircle } from 'lucide-react';

interface NumberFormatLocalizationProps {
  onCancel?: () => void;
}

interface LocaleNumberFormat {
  locale: string;
  name: string;
  region: string;
  decimalSeparator: string;
  thousandsSeparator: string;
  example: string;
}

export default function NumberFormatLocalization({ onCancel }: NumberFormatLocalizationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState<string>('vi-VN');
  const [customNumber, setCustomNumber] = useState('1234567.89');

  const [localeFormats, setLocaleFormats] = useState<LocaleNumberFormat[]>([
    { locale: 'vi-VN', name: 'Vietnamese', region: 'Vietnam', decimalSeparator: ',', thousandsSeparator: '.', example: '1.234.567,89' },
    { locale: 'en-US', name: 'English', region: 'United States', decimalSeparator: '.', thousandsSeparator: ',', example: '1,234,567.89' },
    { locale: 'ja-JP', name: 'Japanese', region: 'Japan', decimalSeparator: '.', thousandsSeparator: ',', example: '1,234,567.89' },
    { locale: 'ko-KR', name: 'Korean', region: 'South Korea', decimalSeparator: '.', thousandsSeparator: ',', example: '1,234,567.89' },
    { locale: 'zh-CN', name: 'Chinese Simplified', region: 'China', decimalSeparator: '.', thousandsSeparator: ',', example: '1,234,567.89' },
    { locale: 'fr-FR', name: 'French', region: 'France', decimalSeparator: ',', thousandsSeparator: ' ', example: '1 234 567,89' },
    { locale: 'de-DE', name: 'German', region: 'Germany', decimalSeparator: ',', thousandsSeparator: '.', example: '1.234.567,89' },
    { locale: 'es-ES', name: 'Spanish', region: 'Spain', decimalSeparator: ',', thousandsSeparator: '.', example: '1.234.567,89' },
    { locale: 'pt-BR', name: 'Portuguese', region: 'Brazil', decimalSeparator: ',', thousandsSeparator: '.', example: '1.234.567,89' },
    { locale: 'th-TH', name: 'Thai', region: 'Thailand', decimalSeparator: '.', thousandsSeparator: ',', example: '1,234,567.89' },
    { locale: 'id-ID', name: 'Indonesian', region: 'Indonesia', decimalSeparator: ',', thousandsSeparator: '.', example: '1.234.567,89' },
    { locale: 'ar-SA', name: 'Arabic', region: 'Saudi Arabia', decimalSeparator: '.', thousandsSeparator: ',', example: '1,234,567.89' },
    { locale: 'hi-IN', name: 'Hindi', region: 'India', decimalSeparator: '.', thousandsSeparator: ',', example: '12,34,567.89' },
  ]);

  const formatNumber = (num: number, locale: string) => {
    return num.toLocaleString(locale);
  };

  const formatPercentage = (num: number, locale: string) => {
    return num.toLocaleString(locale, { style: 'percent' });
  };

  const getCurrentFormat = () => {
    return localeFormats.find(f => f.locale === selectedLocale) || localeFormats[0];
  };

  const currentFormat = getCurrentFormat();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Hash className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Number Format Localization
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Format numbers by locale/region
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Decimal</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{currentFormat.decimalSeparator}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Thousands</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{currentFormat.thousandsSeparator}</p>
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
            type="number"
            value={customNumber}
            onChange={(e) => setCustomNumber(e.target.value)}
            placeholder="Enter number..."
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 flex-1"
          />
          <button
            type="button"
            onClick={() => setCustomNumber('1234567.89')}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Preview: {currentFormat.name}</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Number</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {formatNumber(parseFloat(customNumber) || 0, selectedLocale)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Percentage</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {formatPercentage(0.75, selectedLocale)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Format Example</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {currentFormat.example}
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
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Dec: {format.decimalSeparator} | Thous: {format.thousandsSeparator}
                </p>
              </button>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Number Format Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Vietnamese uses comma for decimal, dot for thousands</li>
              <li>• US/English uses dot for decimal, comma for thousands</li>
              <li>• French uses space for thousands separator</li>
              <li>• Hindi uses lakhs/crores grouping system</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
