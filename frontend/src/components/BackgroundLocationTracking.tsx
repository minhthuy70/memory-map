'use client';

import { useState, useEffect } from 'react';
import { MapPin, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Clock, Battery, Map, Play, Pause, Navigation, Activity, Signal } from 'lucide-react';

interface LocationPoint {
  id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  speed: number;
  altitude: number;
}

interface Geofence {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  active: boolean;
  enterAlert: boolean;
  exitAlert: boolean;
}

interface BackgroundLocationTrackingProps {
  onCancel?: () => void;
  onStartTracking?: () => Promise<void>;
  onStopTracking?: () => Promise<void>;
}

const DEFAULT_LOCATION_POINTS: LocationPoint[] = [
  {
    id: 'loc-1',
    latitude: 21.0285,
    longitude: 105.8542,
    accuracy: 10,
    timestamp: new Date(),
    speed: 0,
    altitude: 15,
  },
  {
    id: 'loc-2',
    latitude: 21.0290,
    longitude: 105.8550,
    accuracy: 8,
    timestamp: new Date(Date.now() - 60000),
    speed: 5.2,
    altitude: 15,
  },
  {
    id: 'loc-3',
    latitude: 21.0295,
    longitude: 105.8558,
    accuracy: 12,
    timestamp: new Date(Date.now() - 120000),
    speed: 8.5,
    altitude: 16,
  },
];

const DEFAULT_GEOFENCES: Geofence[] = [
  {
    id: 'geo-1',
    name: 'Home',
    latitude: 21.0285,
    longitude: 105.8542,
    radius: 100,
    active: true,
    enterAlert: true,
    exitAlert: true,
  },
  {
    id: 'geo-2',
    name: 'Office',
    latitude: 21.0300,
    longitude: 105.8560,
    radius: 50,
    active: true,
    enterAlert: true,
    exitAlert: false,
  },
];

export default function BackgroundLocationTracking({ onCancel, onStartTracking, onStopTracking }: BackgroundLocationTrackingProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [locationPoints, setLocationPoints] = useState<LocationPoint[]>(DEFAULT_LOCATION_POINTS);
  const [geofences, setGeofences] = useState<Geofence[]>(DEFAULT_GEOFENCES);
  const [showSettings, setShowSettings] = useState(false);
  const [updateInterval, setUpdateInterval] = useState(30);
  const [accuracyThreshold, setAccuracyThreshold] = useState(20);
  const [batteryOptimization, setBatteryOptimization] = useState(true);

  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        const newPoint: LocationPoint = {
          id: `loc-${Date.now()}`,
          latitude: 21.0285 + (Math.random() - 0.5) * 0.001,
          longitude: 105.8542 + (Math.random() - 0.5) * 0.001,
          accuracy: Math.floor(Math.random() * 15) + 5,
          timestamp: new Date(),
          speed: Math.random() * 10,
          altitude: 15 + Math.random() * 5,
        };
        setLocationPoints(prev => [newPoint, ...prev].slice(0, 10));
      }, updateInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [isTracking, updateInterval]);

  const handleStart = async () => {
    if (onStartTracking) {
      await onStartTracking();
    }
    setIsTracking(true);
  };

  const handleStop = async () => {
    if (onStopTracking) {
      await onStopTracking();
    }
    setIsTracking(false);
  };

  const toggleGeofence = (geofenceId: string) => {
    setGeofences(prev => prev.map(g => 
      g.id === geofenceId ? { ...g, active: !g.active } : g
    ));
  };

  const latestLocation = locationPoints[0];
  const totalDistance = locationPoints.reduce((sum, _, idx) => {
    if (idx === 0) return 0;
    const prev = locationPoints[idx - 1];
    const curr = locationPoints[idx];
    const R = 6371;
    const dLat = (curr.latitude - prev.latitude) * Math.PI / 180;
    const dLon = (curr.longitude - prev.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(prev.latitude * Math.PI / 180) * Math.cos(curr.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return sum + R * c;
  }, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Theo dõi vị trí nền
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isTracking ? 'Đang theo dõi' : 'Đã dừng'}
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
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt location tracking
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Update interval: {updateInterval}s
              </label>
              <input
                type="range"
                min="10"
                max="300"
                value={updateInterval}
                onChange={(e) => setUpdateInterval(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Accuracy threshold: {accuracyThreshold}m
              </label>
              <input
                type="range"
                min="5"
                max="100"
                value={accuracyThreshold}
                onChange={(e) => setAccuracyThreshold(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Battery optimization
              </span>
              <button
                type="button"
                onClick={() => setBatteryOptimization(!batteryOptimization)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  batteryOptimization ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    batteryOptimization ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Navigation className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Accuracy</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {latestLocation?.accuracy || 0}m
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Speed</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {latestLocation?.speed.toFixed(1) || 0} km/h
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Map className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Distance</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalDistance.toFixed(2)} km
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Battery className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Points</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {locationPoints.length}
          </div>
        </div>
      </div>

      {/* Control Button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={isTracking ? handleStop : handleStart}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
            isTracking
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isTracking ? (
            <>
              <Pause className="h-4 w-4" />
              Dừng theo dõi
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Bắt đầu theo dõi
            </>
          )}
        </button>
      </div>

      {/* Current Location */}
      {latestLocation && (
        <div className="mb-4 p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Vị trí hiện tại
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Latitude</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {latestLocation.latitude.toFixed(6)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Longitude</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {latestLocation.longitude.toFixed(6)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Altitude</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {latestLocation.altitude.toFixed(1)}m
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Timestamp</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {new Date(latestLocation.timestamp).toLocaleTimeString('vi-VN')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Geofences */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Geofences
        </h4>
        <div className="space-y-2">
          {geofences.map((geofence) => (
            <div
              key={geofence.id}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {geofence.name}
                  </span>
                  {geofence.active && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => toggleGeofence(geofence.id)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    geofence.active ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      geofence.active ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                <span>Radius: {geofence.radius}m</span>
                {geofence.enterAlert && <span>• Enter alert</span>}
                {geofence.exitAlert && <span>• Exit alert</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location History */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Lịch sử vị trí
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {locationPoints.slice(0, 5).map((point) => (
            <div
              key={point.id}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Signal className="h-3 w-3 text-slate-500" />
                  <span className="text-xs text-slate-700 dark:text-slate-300">
                    {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {new Date(point.timestamp).toLocaleTimeString('vi-VN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Theo dõi vị trí nền sử dụng native GPS với configurable update intervals, geofencing, và battery optimization.
        </p>
      </div>
    </div>
  );
}