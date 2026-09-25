'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Aperture,
  as,
  Camera,
  CheckCircle,
  Download,
  HardDrive,
  Image,
  ImageIcon,
  Info,
  RefreshCw,
  Settings,
  Wifi
} from 'lucide-react';

interface DSLRMirrorlessSyncProps {
  onCancel?: () => void;
}

interface CameraDevice {
  id: string;
  name: string;
  brand: string;
  model: string;
  isConnected: boolean;
  batteryLevel: number;
  sdCardUsed: number;
  sdCardTotal: number;
  photosCount: number;
  lastSync?: string;
}

interface SyncedPhoto {
  id: string;
  deviceId: string;
  deviceName: string;
  filename: string;
  format: 'RAW' | 'JPEG' | 'Video';
  resolution: string;
  size: number;
  capturedAt: string;
  syncedAt: string;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  metadata?: {
    lens?: string;
    aperture?: string;
    iso?: number;
    shutterSpeed?: string;
  };
}

interface CameraSyncSettings {
  autoSync: boolean;
  syncFormat: 'all' | 'raw_only' | 'jpeg_only';
  wifiAutoConnect: boolean;
  deleteAfterSync: boolean;
  preserveStructure: boolean;
}

export default function DSLRMirrorlessSync({ onCancel }: DSLRMirrorlessSyncProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isSyncEnabled, setIsSyncEnabled] = useState(true);

  const [cameraDevices, setCameraDevices] = useState<CameraDevice[]>([
    { id: '1', name: 'Canon EOS R5', brand: 'Canon', model: 'EOS R5', isConnected: true, batteryLevel: 78, sdCardUsed: 45, sdCardTotal: 128, photosCount: 1250, lastSync: '2024-01-17 16:45' },
    { id: '2', name: 'Sony A7 IV', brand: 'Sony', model: 'A7 IV', isConnected: false, batteryLevel: 0, sdCardUsed: 60, sdCardTotal: 256, photosCount: 2100 },
  ]);

  const [syncedPhotos, setSyncedPhotos] = useState<SyncedPhoto[]>([
    { id: '1', deviceId: '1', deviceName: 'Canon EOS R5', filename: 'IMG_1234.CR3', format: 'RAW', resolution: '8192x5464', size: 45, capturedAt: '2024-01-15 14:30', syncedAt: '2024-01-15 14:31', status: 'completed', metadata: { lens: 'RF 24-70mm f/2.8L', aperture: 'f/2.8', iso: 400, shutterSpeed: '1/250' } },
    { id: '2', deviceId: '1', deviceName: 'Canon EOS R5', filename: 'IMG_1235.JPG', format: 'JPEG', resolution: '8192x5464', size: 12, capturedAt: '2024-01-16 09:15', syncedAt: '2024-01-16 09:16', status: 'completed', metadata: { lens: 'RF 50mm f/1.2L', aperture: 'f/1.8', iso: 200, shutterSpeed: '1/500' } },
  ]);

  const [cameraSyncSettings, setCameraSyncSettings] = useState<CameraSyncSettings>({
    autoSync: true,
    syncFormat: 'all',
    wifiAutoConnect: true,
    deleteAfterSync: false,
    preserveStructure: true,
  });

  const connectDevice = (id: string) => {
    setCameraDevices(cameraDevices.map(device => 
      device.id === id ? { ...device, isConnected: true, batteryLevel: 75 } : device
    ));
  };

  const disconnectDevice = (id: string) => {
    setCameraDevices(cameraDevices.map(device => 
      device.id === id ? { ...device, isConnected: false, batteryLevel: 0 } : device
    ));
  };

  const syncPhotos = (deviceId: string) => {
    const device = cameraDevices.find(d => d.id === deviceId);
    if (!device) return;

    const newPhoto: SyncedPhoto = {
      id: Date.now().toString(),
      deviceId,
      deviceName: device.name,
      filename: `IMG_${Date.now()}.CR3`,
      format: 'RAW',
      resolution: '8192x5464',
      size: 48,
      capturedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      syncedAt: new Date().toISOString().split('T')[0],
      status: 'syncing',
      metadata: { lens: 'RF 24-70mm f/2.8L', aperture: 'f/2.8', iso: 400, shutterSpeed: '1/250' },
    };
    setSyncedPhotos([...syncedPhotos, newPhoto]);
    
    setTimeout(() => {
      setSyncedPhotos(photos => photos.map(p => 
        p.id === newPhoto.id ? { ...p, status: 'completed' } : p
      ));
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'syncing': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'RAW': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'JPEG': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'Video': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl">
            <Camera className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              DSLR/Mirrorless RefreshCcw
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              RefreshCcw photos from DSLR/mirrorless cameras
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isSyncEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isSyncEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Cameras</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{cameraDevices.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Connected</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{cameraDevices.filter(c => c.isConnected).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Photos</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{syncedPhotos.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Size</p>
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{syncedPhotos.reduce((acc, p) => acc + p.size, 0)}MB</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isSyncEnabled}
              onChange={(e) => setIsSyncEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable RefreshCcw</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-purple-600 hover:bg-purple-700 text-white border-0 flex items-center gap-1"
          >
            <Wifi className="h-3 w-3" />
            Scan Cameras
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">RefreshCcw Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto RefreshCcw</span>
              </div>
              <input
                type="checkbox"
                checked={cameraSyncSettings.autoSync}
                onChange={(e) => setCameraSyncSettings({ ...cameraSyncSettings, autoSync: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">RefreshCcw Format</span>
              </div>
              <select
                value={cameraSyncSettings.syncFormat}
                onChange={(e) => setCameraSyncSettings({ ...cameraSyncSettings, syncFormat: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="all">All (RAW + JPEG)</option>
                <option value="raw_only">RAW Only</option>
                <option value="jpeg_only">JPEG Only</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Wifi className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">WiFi Auto Connect</span>
              </div>
              <input
                type="checkbox"
                checked={cameraSyncSettings.wifiAutoConnect}
                onChange={(e) => setCameraSyncSettings({ ...cameraSyncSettings, wifiAutoConnect: e.target.checked })}
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
                checked={cameraSyncSettings.deleteAfterSync}
                onChange={(e) => setCameraSyncSettings({ ...cameraSyncSettings, deleteAfterSync: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <HardDrive className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Preserve Structure</span>
              </div>
              <input
                type="checkbox"
                checked={cameraSyncSettings.preserveStructure}
                onChange={(e) => setCameraSyncSettings({ ...cameraSyncSettings, preserveStructure: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Camera Devices</h4>
          <div className="space-y-2">
            {cameraDevices.map((device) => (
              <div key={device.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Camera className="h-4 w-4 text-purple-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{device.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${device.isConnected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {device.isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{device.brand} {device.model}</p>
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
                <div className="grid grid-cols-4 gap-2 mb-2">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Battery</p>
                    <p className={`text-xs font-bold ${device.batteryLevel > 50 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {device.batteryLevel}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">SD Card</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{device.sdCardUsed}/{device.sdCardTotal}GB</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Photos</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{device.photosCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Last RefreshCcw</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{device.lastSync || 'Never'}</p>
                  </div>
                </div>
                {device.isConnected && (
                  <button
                    type="button"
                    onClick={() => syncPhotos(device.id)}
                    className="w-full px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    RefreshCcw Photos
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Synced Photos</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {syncedPhotos.map((photo) => (
              <div key={photo.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-4 w-4 text-purple-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{photo.filename}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getFormatColor(photo.format)}`}>
                          {photo.format}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(photo.status)}`}>
                          {photo.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{photo.deviceName} • {photo.resolution}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{photo.size}MB</span>
                </div>
                {photo.metadata && (
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{photo.metadata.lens}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{photo.metadata.aperture}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">ISO {photo.metadata.iso}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{photo.metadata.shutterSpeed}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Captured: {photo.capturedAt}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Synced: {photo.syncedAt}</span>
                </div>
                {photo.status === 'completed' && (
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">DSLR/Mirrorless Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Connect DSLR/mirrorless cameras via WiFi for sync</li>
              <li>• RefreshCcw RAW, JPEG, or video files</li>
              <li>• Preserve camera folder structure</li>
              <li>• View metadata: lens, aperture, ISO, shutter speed</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
