'use client';

import { useState } from 'react';
import { Flame, X, Settings, CheckCircle, AlertTriangle, Calendar, MapPin, Activity, Clock, Filter, Grid, BarChart3, Thermometer } from 'lucide-react';

interface HeatmapData {
  id: string;
  month: string;
  year: number;
  count: number;
  intensity: number;
}

interface LocationHeatmap {
  id: string;
  location: string;
  lat: number;
  lng: number;
  count: number;
  intensity: number;
}

interface MemoryHeatmapsProps {
  onCancel?: () => void;
  onGenerateHeatmap?: (type: string) => Promise<void>;
}

const DEFAULT_MONTHLY_DATA: HeatmapData[] = [
  { id: 'data-1', month: 'Jan', year: 2023, count: 15, intensity: 0.3 },
  { id: 'data-2', month: 'Feb', year: 2023, count: 22, intensity: 0.45 },
  { id: 'data-3', month: 'Mar', year: 2023, count: 18, intensity: 0.36 },
  { id: 'data-4', month: 'Apr', year: 2023, count: 25, intensity: 0.5 },
  { id: 'data-5', month: 'May', year: 2023, count: 30, intensity: 0.6 },
  { id: 'data-6', month: 'Jun', year: 2023, count: 28, intensity: 0.56 },
  { id: 'data-7', month: 'Jul', year: 2023, count: 35, intensity: 0.7 },
  { id: 'data-8', month: 'Aug', year: 2023, count: 40, intensity: 0.8 },
  { id: 'data-9', month: 'Sep', year: 2023, count: 32, intensity: 0.64 },
  { id: 'data-10', month: 'Oct', year: 2023, count: 28, intensity: 0.56 },
  { id: 'data-11', month: 'Nov', year: 2023, count: 20, intensity: 0.4 },
  { id: 'data-12', month: 'Dec', year: 2023, count: 45, intensity: 0.9 },
];

const DEFAULT_LOCATION_DATA: LocationHeatmap[] = [
  { id: 'loc-1', location: 'Hanoi', lat: 21.0285, lng: 105.8542, count: 125, intensity: 0.85 },
  { id: 'loc-2', location: 'Ho Chi Minh City', lat: 10.8231, lng: 106.6297, count: 98, intensity: 0.67 },
  { id: 'loc-3', location: 'Da Nang', lat: 16.0544, lng: 108.2022, count: 45, intensity: 0.31 },
  { id: 'loc-4', location: 'Can Tho', lat: 10.0452, lng: 105.7469, count: 32, intensity: 0.22 },
];

export default function MemoryHeatmaps({ onCancel, onGenerateHeatmap }: MemoryHeatmapsProps) {
  const [monthlyData, setMonthlyData] = useState<HeatmapData[]>(DEFAULT_MONTHLY_DATA);
  const [locationData, setLocationData] = useState<LocationHeatmap[]>(DEFAULT_LOCATION_DATA);
  const [showSettings, setShowSettings] = useState(false);
  const [heatmapType, setHeatmapType] = useState<'monthly' | 'location' | 'category'>('monthly');
  const [selectedYear, setSelectedYear] = useState(2023);
  const [colorScheme, setColorScheme] = useState<'warm' | 'cool' | 'spectral'>('warm');

  const getHeatmapColor = (intensity: number) => {
    if (colorScheme === 'warm') {
      if (intensity < 0.25) return 'bg-orange-100 dark:bg-orange-900/20';
      if (intensity < 0.5) return 'bg-orange-300 dark:bg-orange-800/40';
      if (intensity < 0.75) return 'bg-orange-500 dark:bg-orange-700/60';
      return 'bg-red-600 dark:bg-red-800/80';
    } else if (colorScheme === 'cool') {
      if (intensity < 0.25) return 'bg-blue-100 dark:bg-blue-900/20';
      if (intensity < 0.5) return 'bg-blue-300 dark:bg-blue-800/40';
      if (intensity < 0.75) return 'bg-blue-500 dark:bg-blue-700/60';
      return 'bg-indigo-600 dark:bg-indigo-800/80';
    } else {
      if (intensity < 0.25) return 'bg-green-100 dark:bg-green-900/20';
      if (intensity < 0.5) return 'bg-yellow-300 dark:bg-yellow-800/40';
      if (intensity < 0.75) return 'bg-orange-500 dark:bg-orange-700/60';
      return 'bg-red-600 dark:bg-red-800/80';
    }
  };

  const totalMemories = monthlyData.reduce((sum, d) => sum + d.count, 0);
  const avgIntensity = monthlyData.reduce((sum, d) => sum + d.intensity, 0) / monthlyData.length;
  const peakMonth = monthlyData.reduce((max, d) => d.count > max.count ? d : max, monthlyData[0]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Bản đồ nhiệt kỷ niệm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {heatmapType} heatmap
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Cài đặt"
          >
            <Settings className="h-4 w-4 text-slate-500" />
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

      {showSettings && (
        <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt heatmap
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Color scheme
              </label>
              <select
                value={colorScheme}
                onChange={(e) => setColorScheme(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="warm">Warm</option>
                <option value="cool">Cool</option>
                <option value="spectral">Spectral</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show labels
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Smooth gradients
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalMemories}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Intensity</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(avgIntensity * 100).toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Peak</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {peakMonth.month}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Locations</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {locationData.length}
          </div>
        </div>
      </div>

      {/* Heatmap Type Selector */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setHeatmapType('monthly')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              heatmapType === 'monthly'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-1" />
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setHeatmapType('location')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              heatmapType === 'location'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            <MapPin className="h-4 w-4 inline mr-1" />
            Location
          </button>
          <button
            type="button"
            onClick={() => setHeatmapType('category')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              heatmapType === 'category'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Grid className="h-4 w-4 inline mr-1" />
            Category
          </button>
        </div>
      </div>

      {/* Monthly Heatmap */}
      {heatmapType === 'monthly' && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Monthly Distribution ({selectedYear})
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {monthlyData.map((data) => (
              <div
                key={data.id}
                className={`p-3 rounded-lg border-2 ${getHeatmapColor(data.intensity)} border-slate-200 dark:border-slate-600`}
              >
                <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {data.month}
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {data.count} memories
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {(data.intensity * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Location Heatmap */}
      {heatmapType === 'location' && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Location Distribution
          </h4>
          <div className="space-y-2">
            {locationData.map((data) => (
              <div
                key={data.id}
                className={`p-4 rounded-lg border-2 ${getHeatmapColor(data.intensity)} border-slate-200 dark:border-slate-600`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {data.location}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {data.count} memories
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Lat</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {data.lat.toFixed(4)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Lng</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {data.lng.toFixed(4)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Heatmap */}
      {heatmapType === 'category' && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Category Distribution
          </h4>
          <div className="space-y-2">
            {[
              { name: 'Personal', count: 45, intensity: 0.9 },
              { name: 'Career', count: 32, intensity: 0.64 },
              { name: 'Travel', count: 28, intensity: 0.56 },
              { name: 'Education', count: 25, intensity: 0.5 },
            ].map((data) => (
              <div
                key={data.name}
                className={`p-4 rounded-lg border-2 ${getHeatmapColor(data.intensity)} border-slate-200 dark:border-slate-600`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Grid className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {data.name}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {data.count} memories
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-red-500"
                    style={{ width: `${data.intensity * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg">
        <p className="text-[10px] text-orange-700 dark:text-orange-400">
          <strong>Lưu ý:</strong> Bản đồ nhiệt kỷ niệm hiển thị phân phối kỷ niệm theo thời gian (monthly), địa điểm (location), và danh mục (category) với configurable color schemes.
        </p>
      </div>
    </div>
  );
}