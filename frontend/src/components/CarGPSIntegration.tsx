'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  Car,
  CheckCircle,
  Info,
  MapPin,
  Navigation,
  Play,
  RefreshCw,
  Route,
  Settings
} from 'lucide-react';

interface CarGPSIntegrationProps {
  onCancel?: () => void;
}

interface CarDevice {
  id: string;
  name: string;
  model: string;
  isConnected: boolean;
  batteryLevel: number;
  lastJourney?: string;
  mileage: number;
}

interface JourneyLog {
  id: string;
  deviceId: string;
  deviceName: string;
  startPoint: string;
  endPoint: string;
  distance: number;
  duration: number;
  startTime: string;
  endTime: string;
  averageSpeed: number;
  memoryLinked: boolean;
}

interface GPSSettings {
  autoLog: boolean;
  autoLinkMemories: boolean;
  deleteAfterSync: boolean;
  loggingInterval: number;
}

export default function CarGPSIntegration({ onCancel }: CarGPSIntegrationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isIntegrationEnabled, setIsIntegrationEnabled] = useState(true);

  const [carDevices, setCarDevices] = useState<CarDevice[]>([
    { id: '1', name: 'My Car', model: 'Tesla Model 3', isConnected: true, batteryLevel: 72, lastJourney: '2024-01-17 18:30', mileage: 45000 },
    { id: '2', name: 'Family SUV', model: 'Honda CR-V', isConnected: false, batteryLevel: 0, lastJourney: undefined, mileage: 35000 },
  ]);

  const [journeyLogs, setJourneyLogs] = useState<JourneyLog[]>([
    { id: '1', deviceId: '1', deviceName: 'My Car', startPoint: 'Home', endPoint: 'Beach Park', distance: 15.5, duration: 25, startTime: '2024-01-17 14:30', endTime: '2024-01-17 14:55', averageSpeed: 37, memoryLinked: true },
    { id: '2', deviceId: '1', deviceName: 'My Car', startPoint: 'Office', endPoint: 'Home', distance: 12.3, duration: 20, startTime: '2024-01-16 08:00', endTime: '2024-01-16 08:20', averageSpeed: 37, memoryLinked: true },
  ]);

  const [gpsSettings, setGpsSettings] = useState<GPSSettings>({
    autoLog: true,
    autoLinkMemories: true,
    deleteAfterSync: false,
    loggingInterval: 60,
  });

  const connectDevice = (id: string) => {
    setCarDevices(carDevices.map(device => 
      device.id === id ? { ...device, isConnected: true, batteryLevel: 75 } : device
    ));
  };

  const disconnectDevice = (id: string) => {
    setCarDevices(carDevices.map(device => 
      device.id === id ? { ...device, isConnected: false, batteryLevel: 0 } : device
    ));
  };

  const linkMemory = (id: string) => {
    setJourneyLogs(journeyLogs.map(log => 
      log.id === id ? { ...log, memoryLinked: true } : log
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-slate-400 to-gray-500 rounded-xl">
            <Car className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Car GPS Integration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Auto log journey from car GPS
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isIntegrationEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isIntegrationEnabled ? 'Enabled' : 'Disabled'}
          </span>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show details"
          >
            {showDetails ? <Info className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Cars</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{carDevices.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Connected</p>
            <p className="text-lg font-bold text-slate-600 dark:text-slate-400">{carDevices.filter(c => c.isConnected).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Journeys</p>
            <p className="text-lg font-bold text-gray-600 dark:text-gray-400">{journeyLogs.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Distance</p>
            <p className="text-lg font-bold text-zinc-600 dark:text-zinc-400">{journeyLogs.reduce((acc, j) => acc + j.distance, 0).toFixed(1)}km</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isIntegrationEnabled}
              onChange={(e) => setIsIntegrationEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Integration</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-600 hover:bg-slate-700 text-white border-0 flex items-center gap-1"
          >
            <Navigation className="h-3 w-3" />
            Scan Cars
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">GPS Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Log</span>
              </div>
              <input
                type="checkbox"
                checked={gpsSettings.autoLog}
                onChange={(e) => setGpsSettings({ ...gpsSettings, autoLog: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Link Memories</span>
              </div>
              <input
                type="checkbox"
                checked={gpsSettings.autoLinkMemories}
                onChange={(e) => setGpsSettings({ ...gpsSettings, autoLinkMemories: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Delete After RefreshCcw</span>
              </div>
              <input
                type="checkbox"
                checked={gpsSettings.deleteAfterSync}
                onChange={(e) => setGpsSettings({ ...gpsSettings, deleteAfterSync: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Route className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Logging Interval (min)</span>
              </div>
              <input
                type="number"
                value={gpsSettings.loggingInterval}
                onChange={(e) => setGpsSettings({ ...gpsSettings, loggingInterval: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Car Devices</h4>
          <div className="space-y-2">
            {carDevices.map((device) => (
              <div key={device.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Car className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{device.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${device.isConnected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {device.isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{device.model}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => device.isConnected ? disconnectDevice(device.id) : connectDevice(device.id)}
                    className={`px-2 py-1 rounded text-xs ${device.isConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {device.isConnected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Battery</p>
                    <p className={`text-xs font-bold ${device.batteryLevel > 50 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {device.batteryLevel}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Mileage</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{device.mileage.toLocaleString()}km</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Last Journey</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{device.lastJourney || 'Never'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Journey Logs</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {journeyLogs.map((log) => (
              <div key={log.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Route className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{log.startPoint} → {log.endPoint}</span>
                        {log.memoryLinked && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Linked
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{log.deviceName} • {log.startTime}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{log.distance}km</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{log.duration}min</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{log.averageSpeed}km/h</span>
                </div>
                {!log.memoryLinked && (
                  <button
                    type="button"
                    onClick={() => linkMemory(log.id)}
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <MapPin className="h-3 w-3" />
                    Link Memory
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Car GPS Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Auto-log journeys from car GPS data</li>
              <li>• Track start point, end point, distance, and duration</li>
              <li>• Auto-link journeys to memories</li>
                <li>• Configurable logging interval</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
