'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Download,
  Info,
  MapPin,
  Plane,
  Play,
  RefreshCw,
  Settings,
  Video,
  Wifi
} from 'lucide-react';

interface DroneFootageImportProps {
  onCancel?: () => void;
}

interface DroneDevice {
  id: string;
  name: string;
  model: string;
  isConnected: boolean;
  batteryLevel: number;
  flightTime: number;
  lastFlight?: string;
}

interface DroneFootage {
  id: string;
  deviceId: string;
  deviceName: string;
  filename: string;
  duration: number;
  resolution: string;
  size: number;
  location?: string;
  altitude?: number;
  recordedAt: string;
  importedAt: string;
  status: 'pending' | 'importing' | 'completed' | 'failed';
}

interface DroneSettings {
  autoImport: boolean;
  autoDetectLocation: boolean;
  deleteAfterImport: boolean;
  resolution: '4K' | '1080p' | '720p';
}

export default function DroneFootageImport({ onCancel }: DroneFootageImportProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isImportEnabled, setIsImportEnabled] = useState(true);

  const [droneDevices, setDroneDevices] = useState<DroneDevice[]>([
    { id: '1', name: 'My Drone', model: 'DJI Mavic 3', isConnected: true, batteryLevel: 78, flightTime: 25, lastFlight: '2024-01-17 14:30' },
    { id: '2', name: 'Racing Drone', model: 'DJI FPV', isConnected: false, batteryLevel: 0, flightTime: 0 },
  ]);

  const [droneFootage, setDroneFootage] = useState<DroneFootage[]>([
    { id: '1', deviceId: '1', deviceName: 'My Drone', filename: 'DJI_0001.MP4', duration: 300, resolution: '4K', size: 4096, location: 'Beach Park', altitude: 100, recordedAt: '2024-01-15 16:30', importedAt: '2024-01-15 17:00', status: 'completed' },
    { id: '2', deviceId: '1', deviceName: 'My Drone', filename: 'DJI_0002.MP4', duration: 240, resolution: '4K', size: 3276, location: 'Mountain Trail', altitude: 150, recordedAt: '2024-01-16 10:15', importedAt: '2024-01-16 11:00', status: 'completed' },
  ]);

  const [droneSettings, setDroneSettings] = useState<DroneSettings>({
    autoImport: true,
    autoDetectLocation: true,
    deleteAfterImport: false,
    resolution: '4K',
  });

  const connectDevice = (id: string) => {
    setDroneDevices(droneDevices.map(device => 
      device.id === id ? { ...device, isConnected: true, batteryLevel: 80 } : device
    ));
  };

  const disconnectDevice = (id: string) => {
    setDroneDevices(droneDevices.map(device => 
      device.id === id ? { ...device, isConnected: false, batteryLevel: 0 } : device
    ));
  };

  const importFootage = (deviceId: string) => {
    const device = droneDevices.find(d => d.id === deviceId);
    if (!device) return;

    const newFootage: DroneFootage = {
      id: Date.now().toString(),
      deviceId,
      deviceName: device.name,
      filename: `DJI_${Date.now()}.MP4`,
      duration: 360,
      resolution: droneSettings.resolution,
      size: 5120,
      location: 'Unknown',
      altitude: 120,
      recordedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      importedAt: new Date().toISOString().split('T')[0],
      status: 'importing',
    };
    setDroneFootage([...droneFootage, newFootage]);
    
    setTimeout(() => {
      setDroneFootage(footage => footage.map(f => 
        f.id === newFootage.id ? { ...f, status: 'completed' } : f
      ));
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'importing': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl">
            <Plane className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Drone Footage Import
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Import aerial footage from drones
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isImportEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isImportEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Drones</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{droneDevices.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Connected</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{droneDevices.filter(d => d.isConnected).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Footage</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{droneFootage.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Size</p>
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{(droneFootage.reduce((acc, f) => acc + f.size, 0) / 1024).toFixed(1)}GB</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isImportEnabled}
              onChange={(e) => setIsImportEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Import</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-700 text-white border-0 flex items-center gap-1"
          >
            <Wifi className="h-3 w-3" />
            Scan Drones
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Drone Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Import</span>
              </div>
              <input
                type="checkbox"
                checked={droneSettings.autoImport}
                onChange={(e) => setDroneSettings({ ...droneSettings, autoImport: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Detect Location</span>
              </div>
              <input
                type="checkbox"
                checked={droneSettings.autoDetectLocation}
                onChange={(e) => setDroneSettings({ ...droneSettings, autoDetectLocation: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Delete After Import</span>
              </div>
              <input
                type="checkbox"
                checked={droneSettings.deleteAfterImport}
                onChange={(e) => setDroneSettings({ ...droneSettings, deleteAfterImport: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Video className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Resolution</span>
              </div>
              <select
                value={droneSettings.resolution}
                onChange={(e) => setDroneSettings({ ...droneSettings, resolution: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="4K">4K</option>
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Drone Devices</h4>
          <div className="space-y-2">
            {droneDevices.map((device) => (
              <div key={device.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Plane className="h-4 w-4 text-emerald-400" />
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
                    <p className="text-xs text-slate-500 dark:text-slate-400">Flight Time</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{device.flightTime}min</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Last Flight</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{device.lastFlight || 'Never'}</p>
                  </div>
                </div>
                {device.isConnected && (
                  <button
                    type="button"
                    onClick={() => importFootage(device.id)}
                    className="w-full px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Import Footage
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Imported Footage</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {droneFootage.map((footage) => (
              <div key={footage.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Video className="h-4 w-4 text-emerald-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{footage.filename}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(footage.status)}`}>
                          {footage.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{footage.deviceName} • {footage.resolution}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{(footage.size / 1024).toFixed(1)}GB</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{Math.floor(footage.duration / 60)}:{(footage.duration % 60).toString().padStart(2, '0')}</span>
                  {footage.location && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">📍 {footage.location}</span>
                  )}
                  {footage.altitude && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">🏔️ {footage.altitude}m</span>
                  )}
                </div>
                {footage.status === 'completed' && (
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                    >
                      <Play className="h-3 w-3" />
                      Play
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Drone Import Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Connect drones via WiFi for automatic import</li>
              <li>• Auto-detect location and altitude during flight</li>
              <li>• Monitor battery and flight time</li>
              <li>• Resolution settings: 4K, 1080p, 720p</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
