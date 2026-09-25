'use client';

import { useState } from 'react';
import { DollarSign, X, Calendar, TrendingUp, ArrowUp, ArrowDown, BarChart3, Download, RefreshCw, Wallet, CreditCard, PieChart, Zap, CheckCircle, AlertTriangle, Info, Eye, EyeOff } from 'lucide-react';

interface RevenueDashboardProps {
  onCancel?: () => void;
}

interface RevenueData {
  period: string;
  total: number;
  subscriptions: number;
  oneTime: number;
  marketplace: number;
}

export default function RevenueDashboard({ onCancel }: RevenueDashboardProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [showDetails, setShowDetails] = useState(false);

  const [revenueData, setRevenueData] = useState<RevenueData[]>([
    { period: '2026-09-01', total: 5000, subscriptions: 3500, oneTime: 1000, marketplace: 500 },
    { period: '2026-09-02', total: 5200, subscriptions: 3600, oneTime: 1100, marketplace: 500 },
    { period: '2026-09-03', total: 4800, subscriptions: 3300, oneTime: 1000, marketplace: 500 },
    { period: '2026-09-04', total: 5500, subscriptions: 3900, oneTime: 1100, marketplace: 500 },
    { period: '2026-09-05', total: 5800, subscriptions: 4200, oneTime: 1100, marketplace: 500 },
    { period: '2026-09-06', total: 5600, subscriptions: 4000, oneTime: 1100, marketplace: 500 },
    { period: '2026-09-07', total: 6000, subscriptions: 4400, oneTime: 1100, marketplace: 500 },
    { period: '2026-09-08', total: 6200, subscriptions: 4600, oneTime: 1100, marketplace: 500 },
    { period: '2026-09-09', total: 5900, subscriptions: 4300, oneTime: 1100, marketplace: 500 },
    { period: '2026-09-10', total: 6100, subscriptions: 4500, oneTime: 1100, marketplace: 500 },
    { period: '2026-09-11', total: 6300, subscriptions: 4700, oneTime: 1100, marketplace: 500 },
    { period: '2026-09-12', total: 6500, subscriptions: 4900, oneTime: 1100, marketplace: 500 },
    { period: '2026-09-13', total: 6400, subscriptions: 4800, oneTime: 1100, marketplace: 500 },
    { period: '2026-09-14', total: 6600, subscriptions: 5000, oneTime: 1100, marketplace: 500 },
  ]);

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.total, 0);
  const subscriptionRevenue = revenueData.reduce((sum, d) => sum + d.subscriptions, 0);
  const marketplaceRevenue = revenueData.reduce((sum, d) => sum + d.marketplace, 0);
  const oneTimeRevenue = revenueData.reduce((sum, d) => sum + d.oneTime, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Revenue Dashboard
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track income and subscriptions
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
            {showDetails ? <BarChart3 className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Revenue</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Subscriptions</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">${subscriptionRevenue.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Marketplace</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">${marketplaceRevenue.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">One-Time</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">${oneTimeRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Export
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Revenue Breakdown</h4>
          <div className="space-y-2">
            {revenueData.map((data) => (
              <div key={data.period} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-xs text-slate-700 dark:text-slate-300">{data.period}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">${data.total.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Sub</p>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">${data.subscriptions.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Market</p>
                    <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">${data.marketplace.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Revenue Insights</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Subscription revenue: ~75% of total</li>
              <li>• Marketplace: ~8% steady income</li>
              <li>• One-time purchases: ~17% of total</li>
              <li>• MRR: ~$5,000 monthly recurring</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
