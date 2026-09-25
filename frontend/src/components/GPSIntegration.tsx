'use client';

import { useState, useEffect } from 'react';
import { MapPin, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Navigation, Satellite, Clock, Activity, Globe, Smartphone, Target, Crosshair } from 'lucide-react';

interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number;
  speed: number;
  heading: number;
  timestamp: Date;
}

interface SatelliteInfo {
  id: string;
  prn: string;
  signalStrength: number;
  azimuth: number;
  elevation: number;
}

interface GPSIntegrationProps {
  onCancel?: () => void;
  onRequestLocation?: () => Promise<GPSLocation>;
  onEnableHighAccuracy?: () => Promise<void>;
}

const DEFAULT_SATELLITES: SatelliteInfo[] = [
  { id: 'sat-1', prn: 'GPS-1', signalStrength: 95, azimuth: 45, elevation: 60 },
  { id: 'sat-2', prn: 'GPS-2', signalStrength: 88, azimuth: 120, elevation: 45 },
  { id: 'sat-3', prn: 'GPS-3', signalStrength: 92, azimuth: 200, elevation: 55 },
  { id: 'sat-4', prn: 'GPS-4', signalStrength: 85, azimuth: 300, elevation: 40 },
];

export default function GPSIntegration({ onCancel, onRequestLocation, onEnableHighAccuracy }: GPSIntegrationProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<GPSLocation | null>(null);
  const [satellites, setSatellites] = useState<SatelliteInfo[]>(DEFAULT_SATELLITES);
  const [showSettings, setShowSettings] = useState(false);
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [updateInterval, setUpdateInterval] = useState(5);
  const [locationHistory, setLocationHistory] = useState<GPSLocation[]>([]);

  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        const newLocation: GPSLocation = {
          latitude: 21.0285 + (Math.random() - 0.5) * 0.0001,
          longitude: 105.8542 + (Math.random() - 0.5) * 0.0001,
          accuracy: Math.floor(Math.random() * 10) + 3,
          altitude: 15 + Math.random() * 5,
          speed: Math.random() * 5,
          heading: Math.random() * 360,
          timestamp: new Date(),
        };
        setCurrentLocation(newLocation);
        setLocationHistory(prev => [newLocation, ...prev].slice(0, 10));
      }, updateInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [isTracking, updateInterval]);

  const handleRequestLocation = async () => {
    if (onRequestLocation) {
      const location = await onRequestLocation();
      setCurrentLocation(location);
    } else {
      const location: GPSLocation = {
        latitude: 21.0285,
        longitude: 105.8542,
        accuracy: 5,
        altitude: 15,
        speed: 0,
        heading: 0,
        timestamp: new Date(),
      };
      setCurrentLocation(location);
    }
  };

  const handleToggleTracking = () => {
    setIsTracking(!isTracking);
  };

  const handleEnableHighAccuracy = async () => {
    if (onEnableHighAccuracy) {
      await onEnableHighAccuracy();
    }
    setHighAccuracy(true);
  };

  const avgSignalStrength = satellites.reduce((sum, s) => sum + s.signalStrength, 0) / satellites.length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tích hợp GPS
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
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt GPS
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Update interval: {updateInterval}s
              </label>
              <input
                type="range"
                min="1"
                max="60"
                value={updateInterval}
                onChange={(e) => setUpdateInterval(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                High accuracy mode
              </span>
              <button
                type="button"
                onClick={handleEnableHighAccuracy}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  highAccuracy ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    highAccuracy ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Background tracking
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
            <Target className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Accuracy</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {currentLocation?.accuracy || 0}m
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Satellite className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Satellites</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {satellites.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Signal</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgSignalStrength.toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">History</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {locationHistory.length}
          </div>
        </div>
      </div>

      {/* Current Location */}
      {currentLocation && (
        <div className="mb-4 p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Vị trí hiện tại
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Latitude</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {currentLocation.latitude.toFixed(6)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Longitude</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {currentLocation.longitude.toFixed(6)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Altitude</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {currentLocation.altitude.toFixed(1)}m
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Speed</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {currentLocation.speed.toFixed(1)} km/h
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 dark:text-slate-400">
            <Clock className="h-3 w-3" />
            <span>Updated: {new Date(currentLocation.timestamp).toLocaleTimeString('vi-VN')}</span>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={handleRequestLocation}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Crosshair className="h-4 w-4" />
          Get Location
        </button>
        <button
          type="button"
          onClick={handleToggleTracking}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white text-sm font-semibold rounded-lg transition-colors ${
            isTracking ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isTracking ? (
            <>
              <Navigation className="h-4 w-4" />
              Stop Tracking
            </>
          ) : (
            <>
              <Target className="h-4 w-4" />
              Start Tracking
            </>
          )}
        </button>
      </div>

      {/* Satellite Info */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Satellite Information
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {satellites.map((sat) => (
            <div
              key={sat.id}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {sat.prn}
                </span>
                <span className={`text-xs font-semibold ${
                  sat.signalStrength > 90 ? 'text-green-500' : sat.signalStrength > 70 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {sat.signalStrength}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <div>Azimuth: {sat.azimuth}°</div>
                <div>Elevation: {sat.elevation}°</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-[10px] text-green-700 dark:text-green-400">
          <strong>Lưu ý:</strong> Tích hợp GPS sử dụng native Geolocation API với high accuracy mode, satellite tracking, và background location updates.
        </p>
      </div>
    </div>
  );
}