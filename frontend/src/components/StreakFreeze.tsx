'use client';

import { useState } from 'react';
import { Snowflake, X, Shield, Clock, Gift, RefreshCw, Star, Award, Zap, Info, BarChart3, CheckCircle, Calendar, Flame, Plus, Minus, ShoppingBag } from 'lucide-react';

interface StreakFreezeProps {
  onCancel?: () => void;
}

interface FreezeUsage {
  id: string;
  date: string;
  reason: string;
  autoUsed: boolean;
}

export default function StreakFreeze({ onCancel }: StreakFreezeProps) {
  const [freezesAvailable, setFreezesAvailable] = useState(3);
  const [autoUseEnabled, setAutoUseEnabled] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const [freezeHistory, setFreezeHistory] = useState<FreezeUsage[]>([
    {
      id: '1',
      date: '2026-09-05',
      reason: 'Auto-used when streak was at risk',
      autoUsed: true,
    },
    {
      id: '2',
      date: '2026-08-20',
      reason: 'Manual activation - travel day',
      autoUsed: false,
    },
  ]);

  const purchaseOptions = [
    { id: '1', count: 1, cost: 500, currency: 'coins' },
    { id: '2', count: 3, cost: 1200, currency: 'coins', discount: '20%' },
    { id: '3', count: 5, cost: 1800, currency: 'coins', discount: '28%' },
    { id: '4', count: 10, cost: 3000, currency: 'coins', discount: '40%' },
  ];

  const freezeBenefits = [
    'Protects your streak for 1 missed day',
    'Auto-activates when you forget to log',
    'Can be used manually before the day ends',
    'Stackable - use multiple for consecutive days',
    'No XP penalty when freeze is active',
  ];

  const handlePurchase = (count: number, cost: number) => {
    if (cost <= 5000) {
      setFreezesAvailable(freezesAvailable + count);
    }
  };

  const handleManualActivate = () => {
    if (freezesAvailable > 0) {
      setFreezesAvailable(freezesAvailable - 1);
      setFreezeHistory([
        {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          reason: 'Manual activation',
          autoUsed: false,
        },
        ...freezeHistory,
      ]);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
            <Snowflake className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Streak Freeze
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Protect your streak when busy
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show history"
          >
            {showHistory ? <BarChart3 className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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
        <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl text-white">
                <Snowflake className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-3xl">{freezesAvailable}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">freezes available</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm text-cyan-600 dark:text-cyan-400 font-semibold">Active Protection</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoUse"
                checked={autoUseEnabled}
                onChange={(e) => setAutoUseEnabled(e.target.checked)}
                className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
              />
              <label htmlFor="autoUse" className="text-sm text-slate-700 dark:text-slate-300">
                Auto-use when streak is at risk
              </label>
            </div>
            <button
              type="button"
              onClick={handleManualActivate}
              disabled={freezesAvailable === 0}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${freezesAvailable > 0 ? 'bg-cyan-500 text-white hover:bg-cyan-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'}`}
            >
              Activate Now
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Available</p>
            <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{freezesAvailable}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Used This Month</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{freezeHistory.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Auto-Use</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{autoUseEnabled ? 'On' : 'Off'}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Protection</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">1 Day</p>
          </div>
        </div>

        {showHistory && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Freeze Usage History</h4>
            <div className="space-y-2">
              {freezeHistory.map((usage) => (
                <div key={usage.id} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{usage.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {usage.autoUsed && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        Auto
                      </span>
                    )}
                    <span className="text-xs text-slate-500 dark:text-slate-400">{usage.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Purchase Freeze Credits</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {purchaseOptions.map((option) => (
              <div
                key={option.id}
                className="p-3 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg text-center hover:border-cyan-300 dark:hover:border-cyan-600 transition-all cursor-pointer"
                onClick={() => handlePurchase(option.count, option.cost)}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Snowflake className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{option.count}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">freeze{option.count > 1 ? 's' : ''}</p>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{option.cost}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">coins</span>
                </div>
                {option.discount && (
                  <div className="mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Save {option.discount}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              How Streak Freeze Works
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            {freezeBenefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-indigo-500 mt-0.5 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Freeze Timing
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Auto-use activates 2 hours before day ends</li>
            <li>• Manual activation works until 11:59 PM</li>
            <li>• Freeze protects for the entire missed day</li>
            <li>• Streak continues normally the next day</li>
            <li>• Each freeze protects exactly 1 missed day</li>
          </ul>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-4 w-4 text-green-600 dark:text-green-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Earn Free Freezes
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• 7-day streak: +1 freeze</li>
            <li>• 30-day streak: +3 freezes</li>
            <li>• Complete monthly challenges: +1 freeze</li>
            <li>• Premium members: +1 freeze per month</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
