'use client';

import { useState } from 'react';
import { DollarSign, X, RefreshCw, Globe, Info, CheckCircle, Coins } from 'lucide-react';

interface CurrencyLocalizationProps {
  onCancel?: () => void;
}

interface LocaleCurrency {
  locale: string;
  name: string;
  region: string;
  currency: string;
  currencySymbol: string;
  currencyName: string;
  example: string;
}

export default function CurrencyLocalization({ onCancel }: CurrencyLocalizationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState<string>('vi-VN');
  const [customAmount, setCustomAmount] = useState('1234567.89');

  const [localeCurrencies, setLocaleCurrencies] = useState<LocaleCurrency[]>([
    { locale: 'vi-VN', name: 'Vietnamese', region: 'Vietnam', currency: 'VND', currencySymbol: '₫', currencyName: 'Vietnamese Dong', example: '1.234.567,89 ₫' },
    { locale: 'en-US', name: 'English', region: 'United States', currency: 'USD', currencySymbol: '$', currencyName: 'US Dollar', example: '$1,234,567.89' },
    { locale: 'ja-JP', name: 'Japanese', region: 'Japan', currency: 'JPY', currencySymbol: '¥', currencyName: 'Japanese Yen', example: '¥1,234,568' },
    { locale: 'ko-KR', name: 'Korean', region: 'South Korea', currency: 'KRW', currencySymbol: '₩', currencyName: 'South Korean Won', example: '₩1,234,568' },
    { locale: 'zh-CN', name: 'Chinese Simplified', region: 'China', currency: 'CNY', currencySymbol: '¥', currencyName: 'Chinese Yuan', example: '¥1,234,567.89' },
    { locale: 'fr-FR', name: 'French', region: 'France', currency: 'EUR', currencySymbol: '€', currencyName: 'Euro', example: '1 234 567,89 €' },
    { locale: 'de-DE', name: 'German', region: 'Germany', currency: 'EUR', currencySymbol: '€', currencyName: 'Euro', example: '1.234.567,89 €' },
    { locale: 'es-ES', name: 'Spanish', region: 'Spain', currency: 'EUR', currencySymbol: '€', currencyName: 'Euro', example: '1.234.567,89 €' },
    { locale: 'pt-BR', name: 'Portuguese', region: 'Brazil', currency: 'BRL', currencySymbol: 'R$', currencyName: 'Brazilian Real', example: 'R$ 1.234.567,89' },
    { locale: 'th-TH', name: 'Thai', region: 'Thailand', currency: 'THB', currencySymbol: '฿', currencyName: 'Thai Baht', example: '฿1,234,567.89' },
    { locale: 'id-ID', name: 'Indonesian', region: 'Indonesia', currency: 'IDR', currencySymbol: 'Rp', currencyName: 'Indonesian Rupiah', example: 'Rp1.234.567,89' },
    { locale: 'ar-SA', name: 'Arabic', region: 'Saudi Arabia', currency: 'SAR', currencySymbol: 'ر.س', currencyName: 'Saudi Riyal', example: '1,234,567.89 ر.س' },
    { locale: 'hi-IN', name: 'Hindi', region: 'India', currency: 'INR', currencySymbol: '₹', currencyName: 'Indian Rupee', example: '₹12,34,567.89' },
  ]);

  const formatCurrency = (amount: number, locale: string) => {
    const format = localeCurrencies.find(f => f.locale === locale);
    if (!format) return '';
    return amount.toLocaleString(locale, {
      style: 'currency',
      currency: format.currency,
    });
  };

  const getCurrentCurrency = () => {
    return localeCurrencies.find(f => f.locale === selectedLocale) || localeCurrencies[0];
  };

  const currentCurrency = getCurrentCurrency();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Currency Localization
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Format currency by locale/region
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Currencies</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{localeCurrencies.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Selected</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{currentCurrency.name}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Currency</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{currentCurrency.currency}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Symbol</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{currentCurrency.currencySymbol}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedLocale}
            onChange={(e) => setSelectedLocale(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          >
            {localeCurrencies.map((currency) => (
              <option key={currency.locale} value={currency.locale}>
                {currency.name} ({currency.region})
              </option>
            ))}
          </select>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="Enter amount..."
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 flex-1"
          />
          <button
            type="button"
            onClick={() => setCustomAmount('1234567.89')}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Preview: {currentCurrency.name}</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Formatted Currency</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {formatCurrency(parseFloat(customAmount) || 0, selectedLocale)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Currency Name</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {currentCurrency.currencyName}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Format Example</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {currentCurrency.example}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Available Currencies</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {localeCurrencies.map((currency) => (
              <button
                key={currency.locale}
                type="button"
                onClick={() => setSelectedLocale(currency.locale)}
                className={`p-3 rounded-lg border text-left ${
                  selectedLocale === currency.locale
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {selectedLocale === currency.locale && <CheckCircle className="h-3 w-3 text-blue-500" />}
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">{currency.name}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{currency.region}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {currency.currencySymbol} {currency.currency}
                </p>
              </button>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Currency Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Vietnamese Dong (VND) has no decimal places</li>
              <li>• Euro (EUR) used by multiple European countries</li>
              <li>• Currency symbol position varies by locale</li>
              <li>• Some currencies use different symbols for same sign</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
