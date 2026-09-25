'use client';

import { useState } from 'react';
import { MapPin, X, Settings, CheckCircle, AlertTriangle, Globe, Navigation, Activity, Clock, Filter, Map, Route, Star, Zap } from 'lucide-react';

interface LocationPattern {
  id: string;
  location: string;
  lat: number;
  lng: number;
  frequency: number;
  lastVisited: Date;
  category: 'home' | 'work' | 'travel' | 'social' | 'other';
  averageStay: number;
}

interface LocationCluster {
  id: string;
  name: string;
  locations: string[];
  totalVisits: number;
  centroid: { lat: number; lng: number };
}

interface LocationPatternsProps {
  onCancel?: () => void;
  onAnalyzePatterns?: () => Promise<void>;
}

const DEFAULT_PATTERNS: LocationPattern[] = [
  {
    id: 'loc-1',
    location: 'Home',
    lat: 21.0285,
    lng: 105.8542,
    frequency: 245,
    lastVisited: new Date(),
    category: 'home',
    averageStay: 480,
  },
  {
    id: 'loc-2',
    location: 'Office',
    lat: 21.0200,
    lng: 105.8400,
    frequency: 180,
    lastVisited: new Date(Date.now() - 86400000),
    category: 'work',
    averageStay: 480,
  },
  {
    id: 'loc-3',
    location: 'Coffee Shop',
    lat: 21.0150,
    lng: 105.8350,
    frequency: 45,
    lastVisited: new Date(Date.now() - 172800000),
    category: 'social',
    averageStay: 60,
  },
  {
    id: 'loc-4',
    location: 'Beach Resort',
    lat: 16.0500,
    lng: 108.2000,
    frequency: 12,
    lastVisited: new Date(Date.now() - 2592000000),
    category: 'travel',
    averageStay: 7200,
  },
];

const DEFAULT_CLUSTERS: LocationCluster[] = [
  {
    id: 'cluster-1',
    name: 'Downtown Area',
    locations: ['Home', 'Office', 'Coffee Shop'],
    totalVisits: 470,
    centroid: { lat: 21.0212, lng: 105.8431 },
  },
  {
    id: 'cluster-2',
    name: 'Travel Destinations',
    locations: ['Beach Resort'],
    totalVisits: 12,
    centroid: { lat: 16.0500, lng: 108.2000 },
  },
];

export default function LocationPatterns({ onCancel, onAnalyzePatterns }: LocationPatternsProps) {
  const [patterns, setPatterns] = useState<LocationPattern[]>(DEFAULT_PATTERNS);
  const [clusters, setClusters] = useState<LocationCluster[]>(DEFAULT_CLUSTERS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showMapView, setShowMapView] = useState(false);
  const [clusteringEnabled, setClusteringEnabled] = useState(true);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'home':
        return <MapPin className="h-4 w-4" />;
      case 'work':
        return <Activity className="h-4 w-4" />;
      case 'travel':
        return <Globe className="h-4 w-4" />;
      case 'social':
        return <Star className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'home':
        return 'text-blue-500';
      case 'work':
        return 'text-green-500';
      case 'travel':
        return 'text-orange-500';
      case 'social':
        return 'text-purple-500';
      default:
        return 'text-slate-500';
    }
  };

  const filteredPatterns = patterns.filter(p => 
    selectedCategory === 'all' || p.category === selectedCategory
  );

  const totalVisits = patterns.reduce((sum, p) => sum + p.frequency, 0);
  const avgFrequency = totalVisits / patterns.length;
  const mostFrequent = patterns.reduce((max, p) => p.frequency > max.frequency ? p : max, patterns[0]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Mẫu địa điểm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {patterns.length} locations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMapView(!showMapView)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Map view"
          >
            <Map className="h-4 w-4 text-slate-500" />
          </button>
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
            Cài đặt location patterns
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Enable clustering
              </span>
              <button
                type="button"
                onClick={() => setClusteringEnabled(!clusteringEnabled)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  clusteringEnabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    clusteringEnabled ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Track routes
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Geofencing
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
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Visits</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalVisits}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Freq</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgFrequency.toFixed(0)}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Top Location</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {mostFrequent.location}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Clusters</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {clusters.length}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('home')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === 'home'
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('work')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === 'work'
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Work
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('travel')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === 'travel'
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Travel
          </button>
        </div>
      </div>

      {/* Location Patterns */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Location Patterns
        </h4>
        <div className="space-y-2">
          {filteredPatterns.map((pattern) => (
            <div
              key={pattern.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getCategoryColor(pattern.category)}`}>
                    {getCategoryIcon(pattern.category)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {pattern.location}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {pattern.category}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Frequency</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {pattern.frequency} visits
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Avg Stay</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {pattern.averageStay}m
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Last Visit</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {new Date(pattern.lastVisited).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <div>Lat: {pattern.lat.toFixed(4)}</div>
                <div>Lng: {pattern.lng.toFixed(4)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Clusters */}
      {clusteringEnabled && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Location Clusters
          </h4>
          <div className="space-y-2">
            {clusters.map((cluster) => (
              <div
                key={cluster.id}
                className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {cluster.name}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {cluster.totalVisits} visits
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {cluster.locations.map((loc) => (
                    <span
                      key={loc}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] rounded-full"
                    >
                      {loc}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                  <div>Lat: {cluster.centroid.lat.toFixed(4)}</div>
                  <div>Lng: {cluster.centroid.lng.toFixed(4)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-[10px] text-green-700 dark:text-green-400">
          <strong>Lưu ý:</strong> Mẫu địa điểm phân tích các địa điểm thường xuyên xuất hiện với frequency tracking, location clustering, và geo-spatial insights.
        </p>
      </div>
    </div>
  );
}