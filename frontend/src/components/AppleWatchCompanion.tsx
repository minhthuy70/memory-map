'use client';

import { useState } from 'react';
import { Watch, X, RefreshCw, Info, Settings, Smartphone, Battery, Wifi, Bell, CheckCircle, AlertCircle, Heart, Activity } from 'lucide-react';

interface AppleWatchCompanionProps {
  onCancel?: () => void;
}

interface WatchDevice {
  id: string;
  name: string;
  model: string;
  series: string;
  isConnected: boolean;
  batteryLevel: number;
  watchOSVersion: string;
  lastSync?: string;
  pairedWith?: string;
}

interface WatchApp {
  id: string;
  deviceId: string;
  deviceName: string;
  appName: string;
  isInstalled: boolean;
  version: string;
  lastUsed?: string;
}

interface WatchNotification {
  id: string;
  deviceId: string;
  deviceName: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface WatchSettings {
  autoSync: boolean;
  notificationsEnabled: boolean;
  quickCaptureEnabled: boolean;
  healthDataSync: boolean;
  syncInterval: number;
}

export default function AppleWatchCompanion({ onCancel }: AppleWatchCompanionProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isCompanionEnabled, setIsCompanionEnabled] = useState(true);

  const [watchDevices, setWatchDevices] = useState<WatchDevice[]>([
    { id: '1', name: 'My Apple Watch', model: 'Apple Watch Ultra', series: 'Series 2', isConnected: true, batteryLevel: 72, watchOSVersion: '10.2', lastSync: '2024-01-17 18:30', pairedWith: 'iPhone 15 Pro' },
    { id: '2', name: 'Family Watch', model: 'Apple Watch SE', series: 'Series 2', isConnected: false, batteryLevel: 0, watchOSVersion: '10.1' },
  ]);

  const [watchApps, setWatchApps] = useState<WatchApp[]>([
    { id: '1', deviceId: '1', deviceName: 'My Apple Watch', appName: 'Memory Map', isInstalled: true, version: '2.1.0', lastUsed: '2024-01-17 18:30' },
    { id: '2', deviceId: '1', deviceName: 'My Apple Watch', appName: 'Quick Capture', isInstalled: true, version: '1.5.0', lastUsed: '2024-01-16 10:15' },
  ]);

  const [watchNotifications, setWatchNotifications] = useState<WatchNotification[]>([
    { id: '1', deviceId: '1', deviceName: 'My Apple Watch', title: 'Memory Reminder', message: 'Remember your summer vacation from last year', timestamp: '2024-01-17 18:30', isRead: true },
    { id: '2', deviceId: '1', deviceName: 'My Apple Watch', title: 'New Memory', message: 'You captured a new memory today', timestamp: '2024-01-16 10:15', isRead: false },
  ]);

  const [watchSettings, setWatchSettings] = useState<WatchSettings>({
    autoSync: true,
    notificationsEnabled: true,
    quickCaptureEnabled: true,
    healthDataSync: true,
    syncInterval: 60,
  });

  const connectDevice = (id: string) => {
    setWatchDevices(watchDevices.map(device => 
      device.id === id ? { ...device, isConnected: true, batteryLevel: 75 } : device
    ));
  };

  const disconnectDevice = (id: string) => {
    setWatchDevices(watchDevices.map(device => 
      device.id === id ? { ...device, isConnected: false, batteryLevel: 0 } : device
    ));
  };

  const syncDevice = (id: string) => {
    const device = watchDevices.find(d => d.id === id);
    if (!device) return;

    setWatchDevices(watchDevices.map(d => 
      d.id === id ? { ...d, lastSync: new Date().toISOString().replace('T', ' ').substring(0, 16) } : d
    ));
  };

  const markNotificationRead = (id: string) => {
    setWatchNotifications(watchNotifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-gray-600 to-slate-700 rounded-xl">
            <Watch className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Apple Watch Companion App
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              App đồng hành Apple Watch
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isCompanionEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isCompanionEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Watches</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{watchDevices.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Connected</p>
            <p className="text-lg font-bold text-gray-600 dark:text-gray-400">{watchDevices.filter(d => d.isConnected).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Apps</p>
            <p className="text-lg font-bold text-slate-600 dark:text-slate-400">{watchApps.filter(a => a.isInstalled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Notifications</p>
            <p className="text-lg font-bold text-zinc-600 dark:text-zinc-400">{watchNotifications.filter(n => !n.isRead).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isCompanionEnabled}
              onChange={(e) => setIsCompanionEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Companion</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-gray-600 hover:bg-gray-700 text-white border-0 flex items-center gap-1"
          >
            <Watch className="h-3 w-3" />
            Scan Watches
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Companion Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Sync</span>
              </div>
              <input
                type="checkbox"
                checked={watchSettings.autoSync}
                onChange={(e) => setWatchSettings({ ...watchSettings, autoSync: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Notifications Enabled</span>
              </div>
              <input
                type="checkbox"
                checked={watchSettings.notificationsEnabled}
                onChange={(e) => setWatchSettings({ ...watchSettings, notificationsEnabled: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Quick Capture Enabled</span>
              </div>
              <input
                type="checkbox"
                checked={watchSettings.quickCaptureEnabled}
                onChange={(e) => setWatchSettings({ ...watchSettings, quickCaptureEnabled: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Heart className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Health Data Sync</span>
              </div>
              <input
                type="checkbox"
                checked={watchSettings.healthDataSync}
                onChange={(e) => setWatchSettings({ ...watchSettings, healthDataSync: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Wifi className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Sync Interval (min)</span>
              </div>
              <input
                type="number"
                value={watchSettings.syncInterval}
                onChange={(e) => setWatchSettings({ ...watchSettings, syncInterval: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Apple Watch Devices</h4>
          <div className="space-y-2">
            {watchDevices.map((device) => (
              <div key={device.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                      <Watch className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{device.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${device.isConnected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {device.isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{device.model} • {device.series} • watchOS {device.watchOSVersion}</p>
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
                  <span className="text-xs text-slate-500 dark:text-slate-400">Battery: {device.batteryLevel}%</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Paired with: {device.pairedWith || 'None'}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Sync: {device.lastSync || 'Never'}</span>
                </div>
                {device.isConnected && (
                  <button
                    type="button"
                    onClick={() => syncDevice(device.id)}
                    className="w-full px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Sync Now
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Watch Apps</h4>
          <div className="space-y-2">
            {watchApps.map((app) => (
              <div key={app.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{app.appName}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${app.isInstalled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {app.isInstalled ? 'Installed' : 'Not Installed'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{app.deviceName} • v{app.version}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Used: {app.lastUsed || 'Never'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Watch Notifications</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {watchNotifications.map((notif) => (
              <div key={notif.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{notif.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${notif.isRead ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'}`}>
                          {notif.isRead ? 'Read' : 'Unread'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{notif.deviceName} • {notif.timestamp}</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{notif.message}</p>
                {!notif.isRead && (
                  <button
                    type="button"
                    onClick={() => markNotificationRead(notif.id)}
                    className="mt-2 px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Apple Watch Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Pair Apple Watch with iPhone for memory access</li>
              <li>• Install Memory Map companion app on watch</li>
              <li>• Quick capture memories directly from wrist</li>
              <li>• Sync health data for memory context</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
