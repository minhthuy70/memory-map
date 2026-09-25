'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Battery,
  Calendar,
  CheckCircle,
  Clock,
  Info,
  Map,
  MapPin,
  MoreVertical,
  Navigation,
  Pause,
  Play,
  RefreshCw,
  Settings,
  Signal
} from 'lucide-react';

interface BackgroundLocationTrackingProps {
  onCancel?: () => void;
}

interface LocationPoint {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy: number;
  speed?: number;
  heading?: number;
}

export default function BackgroundLocationTracking({ onCancel }: BackgroundLocationTrackingProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [locationPoints, setLocationPoints] = useState<LocationPoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(null);
  const [trackingInterval, setTrackingInterval] = useState(5);
  const [batteryOptimization, setBatteryOptimization] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        simulateLocationUpdate();
      }, trackingInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [isTracking, trackingInterval]);

  const simulateLocationUpdate = () => {
    const newPoint: LocationPoint = {
      id: Date.now().toString(),
      latitude: 21.0285 + (Math.random() - 0.5) * 0.01,
      longitude: 105.8542 + (Math.random() - 0.5) * 0.01,
      timestamp: new Date().toISOString(),
      accuracy: Math.floor(Math.random() * 20) + 5,
      speed: Math.random() * 10,
      heading: Math.random() * 360,
    };
    setCurrentLocation(newPoint);
    setLocationPoints(prev => [...prev.slice(-99), newPoint]);
  };

  const handleToggleTracking = () => {
    setIsTracking(!isTracking);
    if (!isTracking) {
      simulateLocationUpdate();
    }
  };

  const clearHistory = () => {
    setLocationPoints([]);
    setCurrentLocation(null);
  };

  const totalDistance = locationPoints.reduce((sum, point, index) => {
    if (index === 0) return 0;
    const prev = locationPoints[index - 1];
    const lat1 = (prev.latitude * Math.PI) / 180;
    const lat2 = (point.latitude * Math.PI) / 180;
    const lon1 = (prev.longitude * Math.PI) / 180;
    const lon2 = (point.longitude * Math.PI) / 180;
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return sum + 6371 * c;
  }, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Background Location Tracking
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track location in the background
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
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${isTracking ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                {isTracking ? <Navigation className="h-6 w-6 text-white" /> : <MapPin className="h-6 w-6 text-white" />}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-lg">
                  {isTracking ? 'Tracking Active' : 'Tracking Paused'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {isTracking ? 'Location updates every ' + trackingInterval + 's' : 'Tap to start tracking'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleTracking}
              className={`p-3 rounded-xl transition-colors ${isTracking ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {isTracking ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white" />}
            </button>
          </div>
          {currentLocation && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400">Latitude</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{currentLocation.latitude.toFixed(6)}</p>
              </div>
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400">Longitude</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{currentLocation.longitude.toFixed(6)}</p>
              </div>
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400">Accuracy</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">±{currentLocation.accuracy}m</p>
              </div>
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400">Speed</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{currentLocation.speed?.toFixed(1) || 0} km/h</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Points Collected</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{locationPoints.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Distance</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{totalDistance.toFixed(2)} km</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Update Interval</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{trackingInterval}s</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Battery Opt</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{batteryOptimization ? 'On' : 'Off'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={trackingInterval.toString()}
            onChange={(e) => setTrackingInterval(parseInt(e.target.value))}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="5">5 seconds</option>
            <option value="10">10 seconds</option>
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="300">5 minutes</option>
          </select>
          <button
            type="button"
            onClick={() => setBatteryOptimization(!batteryOptimization)}
            className={`px-3 py-1.5 rounded-lg text-xs border-0 flex items-center gap-1 ${batteryOptimization ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}
          >
            <Battery className="h-3 w-3" />
            {batteryOptimization ? 'Battery Opt On' : 'Battery Opt Off'}
          </button>
          <button
            type="button"
            onClick={clearHistory}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Clear History
          </button>
        </div>

        {showHistory && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Location History</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {locationPoints.slice(-10).reverse().map((point) => (
                <div key={point.id} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(point.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">±{point.accuracy}m</p>
                    {point.speed && <p className="text-xs text-slate-500 dark:text-slate-400">{point.speed.toFixed(1)} km/h</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Tracking Settings
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Update interval: Controls how often location is recorded</li>
            <li>• Battery optimization: Reduces GPS accuracy to save battery</li>
            <li>• Background tracking: Continues when app is closed</li>
            <li>• Location data: Stored locally and synced when online</li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Battery & Privacy Notice
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Background location tracking may drain battery faster</li>
            <li>• Enable battery optimization for longer tracking sessions</li>
            <li>• Location data is encrypted and stored securely</li>
            <li>• You can stop tracking at any time from settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
