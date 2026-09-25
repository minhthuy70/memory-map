'use client';

import { useState } from 'react';
import { Camera, X, RefreshCw, Info, Wifi, Cloud, Download, Settings, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface SmartCameraAutoUploadProps {
  onCancel?: () => void;
}

interface CameraDevice {
  id: string;
  name: string;
  model: string;
  isConnected: boolean;
  batteryLevel: number;
  storageUsed: number;
  storageTotal: number;
  lastUpload?: string;
}

interface UploadedPhoto {
  id: string;
  deviceId: string;
  deviceName: string;
  filename: string;
  resolution: string;
  size: number;
  capturedAt: string;
  uploadedAt: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
}

interface CameraSettings {
  autoUpload: boolean;
  wifiAutoConnect: boolean;
  deleteAfterUpload: boolean;
  quality: 'original' | 'high' | 'medium' | 'low';
}

export default function SmartCameraAutoUpload({ onCancel }: SmartCameraAutoUploadProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isUploadEnabled, setIsUploadEnabled] = useState(true);

  const [cameraDevices, setCameraDevices] = useState<CameraDevice[]>([
    { id: '1', name: 'Living Room Cam', model: 'Nest Cam', isConnected: true, batteryLevel: 85, storageUsed: 2, storageTotal: 32, lastUpload: '2024-01-17 10:30' },
    { id: '2', name: 'Outdoor Cam', model: 'Ring Doorbell', isConnected: false, batteryLevel: 0, storageUsed: 5, storageTotal: 16 },
  ]);

  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([
    { id: '1', deviceId: '1', deviceName: 'Living Room Cam', filename: 'IMG_0001.JPG', resolution: '4K', size: 12, capturedAt: '2024-01-15 14:30', uploadedAt: '2024-01-15 14:31', status: 'completed' },
    { id: '2', deviceId: '1', deviceName: 'Living Room Cam', filename: 'IMG_0002.JPG', resolution: '4K', size: 15, capturedAt: '2024-01-16 09:15', uploadedAt: '2024-01-16 09:16', status: 'completed' },
  ]);

  const [cameraSettings, setCameraSettings] = useState<CameraSettings>({
    autoUpload: true,
    wifiAutoConnect: true,
    deleteAfterUpload: false,
    quality: 'original',
  });

  const connectDevice = (id: string) => {
    setCameraDevices(cameraDevices.map(device => 
      device.id === id ? { ...device, isConnected: true, batteryLevel: 80 } : device
    ));
  };

  const disconnectDevice = (id: string) => {
    setCameraDevices(cameraDevices.map(device => 
      device.id === id ? { ...device, isConnected: false, batteryLevel: 0 } : device
    ));
  };

  const uploadPhoto = (deviceId: string) => {
    const device = cameraDevices.find(d => d.id === deviceId);
    if (!device) return;

    const newPhoto: UploadedPhoto = {
      id: Date.now().toString(),
      deviceId,
      deviceName: device.name,
      filename: `IMG_${Date.now()}.JPG`,
      resolution: '4K',
      size: 12,
      capturedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'uploading',
    };
    setUploadedPhotos([...uploadedPhotos, newPhoto]);
    
    setTimeout(() => {
      setUploadedPhotos(photos => photos.map(p => 
        p.id === newPhoto.id ? { ...p, status: 'completed' } : p
      ));
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'uploading': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl">
            <Camera className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Smart Camera Auto-Upload
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Auto upload photos from smart cameras
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isUploadEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isUploadEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{cameraDevices.filter(c => c.isConnected).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Photos</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">{uploadedPhotos.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Size</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{uploadedPhotos.reduce((acc, p) => acc + p.size, 0)}MB</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isUploadEnabled}
              onChange={(e) => setIsUploadEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Upload</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-rose-600 hover:bg-rose-700 text-white border-0 flex items-center gap-1"
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Camera Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-rose-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Upload</span>
              </div>
              <input
                type="checkbox"
                checked={cameraSettings.autoUpload}
                onChange={(e) => setCameraSettings({ ...cameraSettings, autoUpload: e.target.checked })}
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
                checked={cameraSettings.wifiAutoConnect}
                onChange={(e) => setCameraSettings({ ...cameraSettings, wifiAutoConnect: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Delete After Upload</span>
              </div>
              <input
                type="checkbox"
                checked={cameraSettings.deleteAfterUpload}
                onChange={(e) => setCameraSettings({ ...cameraSettings, deleteAfterUpload: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Quality</span>
              </div>
              <select
                value={cameraSettings.quality}
                onChange={(e) => setCameraSettings({ ...cameraSettings, quality: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="original">Original</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
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
                    <Camera className="h-4 w-4 text-rose-400" />
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
                    <p className="text-xs text-slate-500 dark:text-slate-400">Last Upload</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{device.lastUpload || 'Never'}</p>
                  </div>
                </div>
                {device.isConnected && (
                  <button
                    type="button"
                    onClick={() => uploadPhoto(device.id)}
                    className="w-full px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1"
                  >
                    <Cloud className="h-3 w-3" />
                    Upload Photo
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Uploaded Photos</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {uploadedPhotos.map((photo) => (
              <div key={photo.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-4 w-4 text-rose-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{photo.filename}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(photo.status)}`}>
                          {photo.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{photo.deviceName} • {photo.resolution}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{photo.size}MB</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Captured: {photo.capturedAt}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Uploaded: {photo.uploadedAt}</span>
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Smart Camera Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Connect smart cameras via WiFi for auto upload</li>
              <li>• Auto-upload photos when captured</li>
              <li>• Monitor battery and storage levels</li>
              <li>• Quality settings: original, high, medium, low</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
