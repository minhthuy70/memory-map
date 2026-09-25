'use client';

import { useState } from 'react';
import {
  AlertCircle,
  as,
  Calendar,
  CheckCircle,
  Clock,
  Frame,
  Heart,
  Image,
  ImageIcon,
  Info,
  Layout,
  Play,
  RefreshCw,
  Settings,
  Wifi
} from 'lucide-react';

interface SmartFrameIntegrationProps {
  onCancel?: () => void;
}

interface FrameDevice {
  id: string;
  name: string;
  brand: string;
  model: string;
  location: string;
  isConnected: boolean;
  brightness: number;
  photoCount: number;
  lastSync?: string;
}

interface FramePhoto {
  id: string;
  deviceId: string;
  deviceName: string;
  memoryId: string;
  memoryTitle: string;
  filename: string;
  size: number;
  uploadedAt: string;
  isDisplayed: boolean;
}

interface FrameSettings {
  autoUpload: boolean;
  uploadMode: 'random' | 'recent' | 'favorites' | 'album';
  photoQuality: 'original' | 'high' | 'medium' | 'low';
  rotationInterval: number;
  showCaptions: boolean;
  showDate: boolean;
  autoBrightness: boolean;
}

export default function SmartFrameIntegration({ onCancel }: SmartFrameIntegrationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isFrameEnabled, setIsFrameEnabled] = useState(true);

  const [frameDevices, setFrameDevices] = useState<FrameDevice[]>([
    { id: '1', name: 'Living Room Frame', brand: 'Aura', model: 'Aura Carver', location: 'Living Room', isConnected: true, brightness: 75, photoCount: 150, lastSync: '2024-01-17 18:30' },
    { id: '2', name: 'Bedroom Frame', brand: 'Skylight', model: 'Skylight Calendar', location: 'Bedroom', isConnected: false, brightness: 50, photoCount: 0 },
  ]);

  const [framePhotos, setFramePhotos] = useState<FramePhoto[]>([
    { id: '1', deviceId: '1', deviceName: 'Living Room Frame', memoryId: 'mem1', memoryTitle: 'Summer Vacation 2024', filename: 'IMG_1234.JPG', size: 8, uploadedAt: '2024-01-17 18:30', isDisplayed: true },
    { id: '2', deviceId: '1', deviceName: 'Living Room Frame', memoryId: 'mem2', memoryTitle: 'Family Gathering', filename: 'IMG_1235.JPG', size: 10, uploadedAt: '2024-01-16 10:15', isDisplayed: false },
  ]);

  const [frameSettings, setFrameSettings] = useState<FrameSettings>({
    autoUpload: true,
    uploadMode: 'recent',
    photoQuality: 'high',
    rotationInterval: 30,
    showCaptions: true,
    showDate: true,
    autoBrightness: true,
  });

  const connectDevice = (id: string) => {
    setFrameDevices(frameDevices.map(device => 
      device.id === id ? { ...device, isConnected: true } : device
    ));
  };

  const disconnectDevice = (id: string) => {
    setFrameDevices(frameDevices.map(device => 
      device.id === id ? { ...device, isConnected: false } : device
    ));
  };

  const displayPhoto = (id: string) => {
    setFramePhotos(framePhotos.map(photo => 
      photo.id === id ? { ...photo, isDisplayed: true } : photo
    ));
  };

  const uploadPhoto = (deviceId: string) => {
    const device = frameDevices.find(d => d.id === deviceId);
    if (!device) return;

    const newPhoto: FramePhoto = {
      id: Date.now().toString(),
      deviceId,
      deviceName: device.name,
      memoryId: `mem${Date.now()}`,
      memoryTitle: 'New Memory Photo',
      filename: `IMG_${Date.now()}.JPG`,
      size: 9,
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isDisplayed: false,
    };
    setFramePhotos([...framePhotos, newPhoto]);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <Frame className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Smart Frame Integration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tích hợp khung ảnh thông minh
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isFrameEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isFrameEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Frames</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{frameDevices.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Connected</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{frameDevices.filter(d => d.isConnected).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Photos</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{framePhotos.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Displayed</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{framePhotos.filter(p => p.isDisplayed).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isFrameEnabled}
              onChange={(e) => setIsFrameEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Frame</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-amber-600 hover:bg-amber-700 text-white border-0 flex items-center gap-1"
          >
            <Wifi className="h-3 w-3" />
            Scan Frames
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Frame Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Frame className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Upload</span>
              </div>
              <input
                type="checkbox"
                checked={frameSettings.autoUpload}
                onChange={(e) => setFrameSettings({ ...frameSettings, autoUpload: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Layout className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Upload Mode</span>
              </div>
              <select
                value={frameSettings.uploadMode}
                onChange={(e) => setFrameSettings({ ...frameSettings, uploadMode: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="random">Random</option>
                <option value="recent">Recent</option>
                <option value="favorites">Favorites</option>
                <option value="album">Album</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Photo Gauge</span>
              </div>
              <select
                value={frameSettings.photoQuality}
                onChange={(e) => setFrameSettings({ ...frameSettings, photoQuality: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="original">Original</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Rotation Interval (min)</span>
              </div>
              <input
                type="number"
                value={frameSettings.rotationInterval}
                onChange={(e) => setFrameSettings({ ...frameSettings, rotationInterval: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Show Captions</span>
              </div>
              <input
                type="checkbox"
                checked={frameSettings.showCaptions}
                onChange={(e) => setFrameSettings({ ...frameSettings, showCaptions: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Show Date</span>
              </div>
              <input
                type="checkbox"
                checked={frameSettings.showDate}
                onChange={(e) => setFrameSettings({ ...frameSettings, showDate: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Brightness</span>
              </div>
              <input
                type="checkbox"
                checked={frameSettings.autoBrightness}
                onChange={(e) => setFrameSettings({ ...frameSettings, autoBrightness: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Smart Frame Devices</h4>
          <div className="space-y-2">
            {frameDevices.map((device) => (
              <div key={device.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <Frame className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{device.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${device.isConnected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {device.isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{device.brand} {device.model} • {device.location}</p>
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
                <div className="flex gap-2 mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Brightness: {device.brightness}%</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Photos: {device.photoCount}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last RefreshCcw: {device.lastSync || 'Never'}</span>
                </div>
                {device.isConnected && (
                  <button
                    type="button"
                    onClick={() => uploadPhoto(device.id)}
                    className="w-full px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1"
                  >
                    <ImageIcon className="h-3 w-3" />
                    Upload Photo
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Frame Photos</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {framePhotos.map((photo) => (
              <div key={photo.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <ImageIcon className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{photo.memoryTitle}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${photo.isDisplayed ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {photo.isDisplayed ? 'Displayed' : 'Not Displayed'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{photo.deviceName} • {photo.filename}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{photo.size}MB</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Uploaded: {photo.uploadedAt}</span>
                </div>
                {!photo.isDisplayed && (
                  <button
                    type="button"
                    onClick={() => displayPhoto(photo.id)}
                    className="mt-2 px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                  >
                    <Play className="h-3 w-3" />
                    Display on Frame
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Smart Frame Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Connect smart frames like Aura, Skylight</li>
              <li>• Auto-upload photos to frames</li>
              <li>• Configure upload mode: random/recent/favorites/album</li>
              <li>• Adjust rotation interval and photo quality</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
