'use client';

import { useState } from 'react';
import { Camera, X, RefreshCw, Info, Wifi, Play, Download, Settings, CheckCircle, AlertCircle, Video, Calendar } from 'lucide-react';

interface GoProIntegrationProps {
  onCancel?: () => void;
}

interface GoProDevice {
  id: string;
  name: string;
  model: string;
  isConnected: boolean;
  batteryLevel: number;
  storageUsed: number;
  storageTotal: number;
  lastSync?: string;
}

interface ImportedFootage {
  id: string;
  deviceId: string;
  deviceName: string;
  filename: string;
  duration: number;
  resolution: string;
  size: number;
  recordedAt: string;
  importedAt: string;
  status: 'pending' | 'importing' | 'completed' | 'failed';
}

interface GoProSettings {
  autoImport: boolean;
  wifiAutoConnect: boolean;
  deleteAfterImport: boolean;
  quality: 'high' | 'medium' | 'low';
}

export default function GoProIntegration({ onCancel }: GoProIntegrationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isIntegrationEnabled, setIsIntegrationEnabled] = useState(true);

  const [goProDevices, setGoProDevices] = useState<GoProDevice[]>([
    { id: '1', name: 'My GoPro', model: 'Hero 11', isConnected: true, batteryLevel: 85, storageUsed: 32, storageTotal: 64, lastSync: '2024-01-17 10:30' },
    { id: '2', name: 'Adventure Cam', model: 'Hero 10', isConnected: false, batteryLevel: 0, storageUsed: 48, storageTotal: 64 },
  ]);

  const [importedFootage, setImportedFootage] = useState<ImportedFootage[]>([
    { id: '1', deviceId: '1', deviceName: 'My GoPro', filename: 'GOPR0001.MP4', duration: 180, resolution: '4K', size: 2048, recordedAt: '2024-01-15 14:30', importedAt: '2024-01-15 15:00', status: 'completed' },
    { id: '2', deviceId: '1', deviceName: 'My GoPro', filename: 'GOPR0002.MP4', duration: 300, resolution: '4K', size: 3584, recordedAt: '2024-01-16 09:15', importedAt: '2024-01-16 10:00', status: 'completed' },
  ]);

  const [goProSettings, setGoProSettings] = useState<GoProSettings>({
    autoImport: true,
    wifiAutoConnect: true,
    deleteAfterImport: false,
    quality: 'high',
  });

  const connectDevice = (id: string) => {
    setGoProDevices(goProDevices.map(device => 
      device.id === id ? { ...device, isConnected: true, batteryLevel: 75 } : device
    ));
  };

  const disconnectDevice = (id: string) => {
    setGoProDevices(goProDevices.map(device => 
      device.id === id ? { ...device, isConnected: false, batteryLevel: 0 } : device
    ));
  };

  const importFootage = (deviceId: string) => {
    const device = goProDevices.find(d => d.id === deviceId);
    if (!device) return;

    const newFootage: ImportedFootage = {
      id: Date.now().toString(),
      deviceId,
      deviceName: device.name,
      filename: `GOPR${Date.now()}.MP4`,
      duration: 240,
      resolution: '4K',
      size: 2560,
      recordedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      importedAt: new Date().toISOString().split('T')[0],
      status: 'importing',
    };
    setImportedFootage([...importedFootage, newFootage]);
    
    setTimeout(() => {
      setImportedFootage(footage => footage.map(f => 
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
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
            <Camera className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              GoPro Integration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Auto import video from GoPro cameras
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Devices</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{goProDevices.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Connected</p>
            <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{goProDevices.filter(d => d.isConnected).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Footage</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{importedFootage.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Size</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{(importedFootage.reduce((acc, f) => acc + f.size, 0) / 1024).toFixed(1)}GB</p>
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
            className="px-3 py-1.5 rounded-lg text-xs bg-cyan-600 hover:bg-cyan-700 text-white border-0 flex items-center gap-1"
          >
            <Wifi className="h-3 w-3" />
            Scan Devices
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">GoPro Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-cyan-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Import</span>
              </div>
              <input
                type="checkbox"
                checked={goProSettings.autoImport}
                onChange={(e) => setGoProSettings({ ...goProSettings, autoImport: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Wifi className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">WiFi Auto Connect</span>
              </div>
              <input
                type="checkbox"
                checked={goProSettings.wifiAutoConnect}
                onChange={(e) => setGoProSettings({ ...goProSettings, wifiAutoConnect: e.target.checked })}
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
                checked={goProSettings.deleteAfterImport}
                onChange={(e) => setGoProSettings({ ...goProSettings, deleteAfterImport: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Video className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Quality</span>
              </div>
              <select
                value={goProSettings.quality}
                onChange={(e) => setGoProSettings({ ...goProSettings, quality: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="high">High (4K)</option>
                <option value="medium">Medium (1080p)</option>
                <option value="low">Low (720p)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">GoPro Devices</h4>
          <div className="space-y-2">
            {goProDevices.map((device) => (
              <div key={device.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Camera className="h-4 w-4 text-cyan-400" />
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
                    <p className="text-xs text-slate-500 dark:text-slate-400">Storage</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{device.storageUsed}/{device.storageTotal}GB</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Last Sync</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{device.lastSync || 'Never'}</p>
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
            {importedFootage.map((footage) => (
              <div key={footage.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Video className="h-4 w-4 text-cyan-400" />
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
                  <span className="text-xs text-slate-500 dark:text-slate-400">Recorded: {footage.recordedAt}</span>
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">GoPro Integration Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Connect GoPro via WiFi for automatic import</li>
              <li>• Auto-import footage when connected</li>
              <li>• Monitor battery and storage levels</li>
              <li>• Quality settings: 4K, 1080p, 720p</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
