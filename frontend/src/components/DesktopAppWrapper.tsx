'use client';

import { useState } from 'react';

export default function DesktopAppWrapper() {
  const [platform, setPlatform] = useState<'windows' | 'macos' | 'linux'>('windows');
  const [version, setVersion] = useState('1.0.0');
  const [systemTray, setSystemTray] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [installPath, setInstallPath] = useState('');
  const [isInstalled, setIsInstalled] = useState(false);

  const handleInstall = () => {
    // Simulate installation
    setIsInstalled(true);
  };

  const handleUninstall = () => {
    setIsInstalled(false);
  };

  const handleSync = () => {
    // Simulate sync
    alert('Syncing desktop app with cloud...');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Native Desktop App (Tauri / Electron)</h2>
      <p className="text-gray-600 mb-6">
        Ultra-lightweight Tauri v2 desktop client with system tray integration, global keyboard shortcuts, and drag-and-drop native file imports.
      </p>

      {!isInstalled ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as any)}
              className="w-full p-2 border rounded"
            >
              <option value="windows">Windows</option>
              <option value="macos">macOS</option>
              <option value="linux">Linux</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Install Path</label>
            <input
              type="text"
              value={installPath}
              onChange={(e) => setInstallPath(e.target.value)}
              placeholder="C:\Program Files\Memory Map"
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            onClick={handleInstall}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Install Desktop App
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded">
            <p className="text-green-700 font-medium">✓ Desktop App Installed</p>
            <p className="text-sm text-green-600">Version: {version}</p>
            <p className="text-sm text-green-600">Platform: {platform}</p>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">System Tray Integration</label>
            <input
              type="checkbox"
              checked={systemTray}
              onChange={(e) => setSystemTray(e.target.checked)}
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Auto Start on Login</label>
            <input
              type="checkbox"
              checked={autoStart}
              onChange={(e) => setAutoStart(e.target.checked)}
              className="w-5 h-5"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSync}
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Sync Now
            </button>
            <button
              onClick={handleUninstall}
              className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Uninstall
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
