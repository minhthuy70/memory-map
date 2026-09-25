'use client';

import { useState } from 'react';
import { Map, X, Settings, CheckCircle, AlertTriangle, ArrowUp, ArrowDown, Activity, TrendingUp, TrendingDown, BarChart3, Filter, Zap, MapPin, Globe, Star } from 'lucide-react';

interface LocationData {
  location: string;
  lat: number;
  lng: number;
  memoryCount: number;
  moodDistribution: { happy: number; sad: number; neutral: number; excited: number; nostalgic: number };
  averageRating: number;
  growthRate: number;
  trend: 'up' | 'down' | 'stable';
  category: 'city' | 'nature' | 'landmark' | 'home' | 'other';
}

interface LocationComparisonProps {
  onCancel?: () => void;
  onCompareLocations?: () => Promise<void>;
}

const DEFAULT_LOCATIONS: LocationData[] = [
  {
    location: 'Hanoi',
    lat: 21.0285,
    lng: 105.8542,
    memoryCount: 180,
    moodDistribution: { happy: 80, sad: 30, neutral: 40, excited: 45, nostalgic: 25 },
    averageRating: 4.5,
    growthRate: 12,
    trend: 'up',
    category: 'city',
  },
  {
    location: 'Ho Chi Minh City',
    lat: 10.8231,
    lng: 106.6297,
    memoryCount: 145,
    moodDistribution: { happy: 70, sad: 25, neutral: 35, excited: 40, nostalgic: 20 },
    averageRating: 4.3,
    growthRate: 8,
    trend: 'up',
    category: 'city',
  },
  {
    location: 'Da Nang',
    lat: 16.0544,
    lng: 108.2022,
    memoryCount: 85,
    moodDistribution: { happy: 50, sad: 10, neutral: 15, excited: 35, nostalgic: 18 },
    averageRating: 4.7,
    growthRate: 20,
    trend: 'up',
    category: 'city',
  },
  {
    location: 'Ha Long Bay',
    lat: 20.9100,
    lng: 107.1833,
    memoryCount: 45,
    moodDistribution: { happy: 30, sad: 5, neutral: 8, excited: 25, nostalgic: 12 },
    averageRating: 4.8,
    growthRate: 15,
    trend: 'up',
    category: 'nature',
  },
  {
    location: 'Can Tho',
    lat: 10.0452,
    lng: 105.7469,
    memoryCount: 35,
    moodDistribution: { happy: 20, sad: 8, neutral: 10, excited: 15, nostalgic: 8 },
    averageRating: 4.1,
    growthRate: -5,
    trend: 'down',
    category: 'city',
  },
];

export default function LocationComparison({ onCancel, onCompareLocations }: LocationComparisonProps) {
  const [locations, setLocations] = useState<LocationData[]>(DEFAULT_LOCATIONS);
  const [showSettings, setShowSettings] = useState(false);
  const [comparisonType, setComparisonType] = useState<'count' | 'mood' | 'rating' | 'growth'>('count');
  const [sortBy, setSortBy] = useState<'count' | 'rating' | 'growth'>('count');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <Activity className="h-3 w-3 text-slate-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'city':
        return <MapPin className="h-4 w-4" />;
      case 'nature':
        return <Globe className="h-4 w-4" />;
      case 'landmark':
        return <Star className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const filteredLocations = locations.filter(l => 
    selectedCategory === 'all' || l.category === selectedCategory
  );

  const sortedLocations = [...filteredLocations].sort((a, b) => {
    if (sortBy === 'count') return b.memoryCount - a.memoryCount;
    if (sortBy === 'rating') return b.averageRating - a.averageRating;
    return b.growthRate - a.growthRate;
  });

  const totalMemories = locations.reduce((sum, l) => sum + l.memoryCount, 0);
  const avgRating = locations.reduce((sum, l) => sum + l.averageRating, 0) / locations.length;
  const avgGrowth = locations.reduce((sum, l) => sum + l.growthRate, 0) / locations.length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Map className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              So sánh địa điểm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {locations.length} locations
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
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt location comparison
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Comparison type
              </label>
              <select
                value={comparisonType}
                onChange={(e) => setComparisonType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                <option value="count">Memory Count</option>
                <option value="mood">Mood Distribution</option>
                <option value="rating">Average Rating</option>
                <option value="growth">Growth Rate</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                <option value="count">Count</option>
                <option value="rating">Rating</option>
                <option value="growth">Growth</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Category filter
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                <option value="all">All Categories</option>
                <option value="city">City</option>
                <option value="nature">Nature</option>
                <option value="landmark">Landmark</option>
                <option value="home">Home</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalMemories}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Rating</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgRating.toFixed(1)}/5
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Growth</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgGrowth.toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Locations</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {locations.length}
          </div>
        </div>
      </div>

      {/* Location Comparison */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Location Comparison
        </h4>
        <div className="space-y-2">
          {sortedLocations.map((location) => (
            <div
              key={location.location}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(location.category)}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {location.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(location.trend)}
                  <span className={`text-xs font-semibold ${getTrendColor(location.trend)}`}>
                    {location.growthRate > 0 ? '+' : ''}{location.growthRate}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Count</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {location.memoryCount}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Rating</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {location.averageRating.toFixed(1)}/5
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Category</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 capitalize">
                    {location.category}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-400 mb-2">
                <div>Lat: {location.lat.toFixed(4)}</div>
                <div>Lng: {location.lng.toFixed(4)}</div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                    style={{ width: `${(location.memoryCount / totalMemories) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {((location.memoryCount / totalMemories) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mood Distribution by Location */}
      {comparisonType === 'mood' && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Mood Distribution by Location
          </h4>
          <div className="space-y-2">
            {locations.map((location) => (
              <div
                key={location.location}
                className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {location.location}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {Object.entries(location.moodDistribution).map(([mood, count]) => (
                    <span
                      key={mood}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] rounded-full"
                    >
                      {mood}: {count}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-[10px] text-green-700 dark:text-green-400">
          <strong>Lưu ý:</strong> So sánh địa điểm cho phép so sánh số lượng kỷ niệm giữa các địa điểm với mood distribution, rating, growth rate, category filtering, và geo-coordinates.
        </p>
      </div>
    </div>
  );
}