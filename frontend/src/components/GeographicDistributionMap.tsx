'use client';

import { useState } from 'react';
import { Globe, X, MapPin, BarChart3, Download, RefreshCw, Filter, Eye, EyeOff, Info, Grid, Users, Layers, CheckCircle, AlertTriangle, ZoomIn, ZoomOut } from 'lucide-react';

interface GeographicDistributionMapProps {
  onCancel?: () => void;
}

interface RegionData {
  region: string;
  country: string;
  users: number;
  percentage: number;
  growth: number;
}

export default function GeographicDistributionMap({ onCancel }: GeographicDistributionMapProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [showDetails, setShowDetails] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const [regionData, setRegionData] = useState<RegionData[]>([
    { region: 'North America', country: 'USA', users: 3500, percentage: 34, growth: 12 },
    { region: 'North America', country: 'Canada', users: 800, percentage: 8, growth: 8 },
    { region: 'Europe', country: 'UK', users: 1200, percentage: 12, growth: 15 },
    { region: 'Europe', country: 'Germany', users: 950, percentage: 9, growth: 10 },
    { region: 'Europe', country: 'France', users: 750, percentage: 7, growth: 12 },
    { region: 'Asia', country: 'Vietnam', users: 1800, percentage: 17, growth: 25 },
    { region: 'Asia', country: 'Japan', users: 600, percentage: 6, growth: 5 },
    { region: 'Asia', country: 'South Korea', users: 450, percentage: 4, growth: 8 },
    { region: 'South America', country: 'Brazil', users: 300, percentage: 3, growth: 20 },
    { region: 'Oceania', country: 'Australia', users: 250, percentage: 2, growth: 10 },
  ]);

  const totalUsers = regionData.reduce((sum, r) => sum + r.users, 0);
  const topRegion = regionData.reduce((max, r) => r.users > max.users ? r : max, regionData[0]);
  const averageGrowth = Math.round(regionData.reduce((sum, r) => sum + r.growth, 0) / regionData.length);

  const getRegionColor = (region: string) => {
    const colors: Record<string, string> = {
      'North America': 'bg-blue-500',
      'Europe': 'bg-green-500',
      'Asia': 'bg-purple-500',
      'South America': 'bg-orange-500',
      'Oceania': 'bg-pink-500',
    };
    return colors[region] || 'bg-slate-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Geographic Distribution Map
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              User distribution by region and country
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Countries</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{regionData.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Top Region</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{topRegion.region}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Growth</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{averageGrowth}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Coverage</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">5 Regions</p>
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
            onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <ZoomOut className="h-3 w-3" />
            Zoom Out
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <ZoomIn className="h-3 w-3" />
            Zoom In
          </button>
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Regional Distribution</h4>
          <div className="space-y-2">
            {regionData.map((data) => (
              <div key={`${data.region}-${data.country}`} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{data.country}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">({data.region})</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getRegionColor(data.region)}`}
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Users</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{data.users.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Growth</p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">+{data.growth}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Geographic Insights</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Vietnam: Fastest growing market (+25%)</li>
              <li>• North America: Largest user base (42%)</li>
              <li>• Asia: Strong growth potential</li>
              <li>• Europe: Steady growth across countries</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
