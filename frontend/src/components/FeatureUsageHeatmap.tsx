'use client';

import { useState } from 'react';
import { Flame, X, Calendar, BarChart3, Download, RefreshCw, Filter, Eye, EyeOff, Info, Grid, Zap, Activity, Layers, CheckCircle, AlertTriangle } from 'lucide-react';

interface FeatureUsageHeatmapProps {
  onCancel?: () => void;
}

interface FeatureUsage {
  feature: string;
  usage: number;
  category: string;
  trend: 'up' | 'down' | 'stable';
}

export default function FeatureUsageHeatmap({ onCancel }: FeatureUsageHeatmapProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDetails, setShowDetails] = useState(false);

  const [featureUsage, setFeatureUsage] = useState<FeatureUsage[]>([
    { feature: 'Memory Creation', usage: 95, category: 'Core', trend: 'up' },
    { feature: 'Photo Upload', usage: 92, category: 'Core', trend: 'up' },
    { feature: 'Location Tracking', usage: 88, category: 'Core', trend: 'stable' },
    { feature: 'Map View', usage: 85, category: 'Core', trend: 'up' },
    { feature: 'Video Editing', usage: 78, category: 'Media', trend: 'up' },
    { feature: 'Music Integration', usage: 72, category: 'Media', trend: 'stable' },
    { feature: 'Voice Commands', usage: 65, category: 'Accessibility', trend: 'up' },
    { feature: 'Search', usage: 90, category: 'Core', trend: 'up' },
    { feature: 'Filters', usage: 82, category: 'Media', trend: 'stable' },
    { feature: 'Export PDF', usage: 68, category: 'Export', trend: 'up' },
    { feature: 'Export EPUB', usage: 55, category: 'Export', trend: 'down' },
    { feature: 'Export Word', usage: 62, category: 'Export', trend: 'stable' },
    { feature: 'Badges', usage: 75, category: 'Gamification', trend: 'up' },
    { feature: 'XP System', usage: 80, category: 'Gamification', trend: 'up' },
    { feature: 'Leaderboards', usage: 70, category: 'Gamification', trend: 'stable' },
    { feature: 'Offline Mode', usage: 45, category: 'Mobile', trend: 'down' },
    { feature: 'Push Notifications', usage: 58, category: 'Mobile', trend: 'stable' },
    { feature: 'AR Features', usage: 40, category: 'Advanced', trend: 'up' },
    { feature: 'VR Features', usage: 35, category: 'Advanced', trend: 'up' },
    { feature: 'AI Features', usage: 50, category: 'Advanced', trend: 'up' },
  ]);

  const categories = ['all', 'Core', 'Media', 'Export', 'Gamification', 'Mobile', 'Advanced', 'Accessibility'];
  const filteredFeatures = selectedCategory === 'all' ? featureUsage : featureUsage.filter(f => f.category === selectedCategory);
  const averageUsage = Math.round(filteredFeatures.reduce((sum, f) => sum + f.usage, 0) / filteredFeatures.length);

  const getUsageColor = (usage: number) => {
    if (usage >= 80) return 'bg-green-500';
    if (usage >= 60) return 'bg-blue-500';
    if (usage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <Activity className="h-3 w-3 text-green-500" />;
    if (trend === 'down') return <Activity className="h-3 w-3 text-red-500 rotate-180" />;
    return <Activity className="h-3 w-3 text-slate-400" />;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Feature Usage Heatmap
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track feature adoption and engagement
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Features</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{featureUsage.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Usage</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{averageUsage}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">High Usage</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{featureUsage.filter(f => f.usage >= 80).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Low Usage</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{featureUsage.filter(f => f.usage < 40).length}</p>
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
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Feature Usage Heatmap</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {filteredFeatures.map((feature) => (
              <div key={feature.feature} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">{feature.feature}</span>
                  {getTrendIcon(feature.trend)}
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-1">
                  <div
                    className={`h-2 rounded-full ${getUsageColor(feature.usage)}`}
                    style={{ width: `${feature.usage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{feature.category}</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{feature.usage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Usage Insights</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Core features: Highest usage (85%+)</li>
              <li>• Media features: Strong adoption (70%+)</li>
              <li>• Advanced features: Growing but lower usage</li>
              <li>• Mobile features: Need more promotion</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
