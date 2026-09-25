'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Apple,
  CheckCircle,
  Home,
  Info,
  Laptop,
  MessageSquare,
  Mic,
  Play,
  RefreshCw,
  Settings,
  Smartphone,
  Tablet,
  Volume2
} from 'lucide-react';

interface AppleHomeKitSiriProps {
  onCancel?: () => void;
}

interface AppleDevice {
  id: string;
  name: string;
  type: 'iphone' | 'ipad' | 'homepod' | 'apple_tv' | 'mac';
  location: string;
  isConnected: boolean;
  homeKitEnabled: boolean;
  lastCommand?: string;
  lastUsed?: string;
}

interface SiriShortcut {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  triggerPhrase: string;
  action: string;
  lastUsed?: string;
}

interface SiriCommand {
  id: string;
  deviceId: string;
  deviceName: string;
  command: string;
  response: string;
  timestamp: string;
  status: 'success' | 'failed' | 'processing';
}

interface HomeKitSettings {
  siriControl: boolean;
  autoPlayMemories: boolean;
  memoryPlaybackMode: 'random' | 'recent' | 'favorites';
  shortcutSync: boolean;
  homeKitSecure: boolean;
}

export default function AppleHomeKitSiri({ onCancel }: AppleHomeKitSiriProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isIntegrationEnabled, setIsIntegrationEnabled] = useState(true);

  const [appleDevices, setAppleDevices] = useState<AppleDevice[]>([
    { id: '1', name: 'iPhone 15 Pro', type: 'iphone', location: 'Pocket', isConnected: true, homeKitEnabled: true, lastCommand: 'Siri, show my recent memories', lastUsed: '2024-01-17 18:30' },
    { id: '2', name: 'HomePod Mini', type: 'homepod', location: 'Living Room', isConnected: false, homeKitEnabled: false },
  ]);

  const [siriShortcuts, setSiriShortcuts] = useState<SiriShortcut[]>([
    { id: '1', name: 'Quick Memory Capture', description: 'Quickly capture a new memory', isEnabled: true, triggerPhrase: 'Hey Siri, quick memory', action: 'capture_memory', lastUsed: '2024-01-17 18:30' },
    { id: '2', name: 'Show Favorites', description: 'Display favorite memories', isEnabled: true, triggerPhrase: 'Hey Siri, show favorites', action: 'show_favorites', lastUsed: '2024-01-16 10:15' },
  ]);

  const [siriCommands, setSiriCommands] = useState<SiriCommand[]>([
    { id: '1', deviceId: '1', deviceName: 'iPhone 15 Pro', command: 'Siri, show my recent memories', response: 'Here are your 5 most recent memories', timestamp: '2024-01-17 18:30', status: 'success' },
    { id: '2', deviceId: '1', deviceName: 'iPhone 15 Pro', command: 'Siri, play my favorite memories', response: 'Playing your top 3 favorite memories', timestamp: '2024-01-16 10:15', status: 'success' },
  ]);

  const [homeKitSettings, setHomeKitSettings] = useState<HomeKitSettings>({
    siriControl: true,
    autoPlayMemories: true,
    memoryPlaybackMode: 'recent',
    shortcutSync: true,
    homeKitSecure: true,
  });

  const connectDevice = (id: string) => {
    setAppleDevices(appleDevices.map(device => 
      device.id === id ? { ...device, isConnected: true, homeKitEnabled: true } : device
    ));
  };

  const disconnectDevice = (id: string) => {
    setAppleDevices(appleDevices.map(device => 
      device.id === id ? { ...device, isConnected: false, homeKitEnabled: false } : device
    ));
  };

  const toggleShortcut = (id: string) => {
    setSiriShortcuts(siriShortcuts.map(shortcut => 
      shortcut.id === id ? { ...shortcut, isEnabled: !shortcut.isEnabled } : shortcut
    ));
  };

  const testCommand = (deviceId: string) => {
    const device = appleDevices.find(d => d.id === deviceId);
    if (!device) return;

    const newCommand: SiriCommand = {
      id: Date.now().toString(),
      deviceId,
      deviceName: device.name,
      command: 'Siri, test Memory Map integration',
      response: 'Memory Map integration is working perfectly',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'processing',
    };
    setSiriCommands([...siriCommands, newCommand]);
    
    setTimeout(() => {
      setSiriCommands(commands => commands.map(c => 
        c.id === newCommand.id ? { ...c, status: 'success' } : c
      ));
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'processing': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getDeviceTypeIcon = (type: string) => {
    switch (type) {
      case 'iphone': return <Smartphone className="h-4 w-4" />;
      case 'ipad': return <Tablet className="h-4 w-4" />;
      case 'homepod': return <Volume2 className="h-4 w-4" />;
      case 'apple_tv': return <Home className="h-4 w-4" />;
      case 'mac': return <Laptop className="h-4 w-4" />;
      default: return <Apple className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-gray-600 to-slate-700 rounded-xl">
            <Apple className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Apple HomeKit/Siri
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tích hợp Siri/HomeKit
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
            <p className="text-lg font-bold text-slate-900 dark:text-white">{appleDevices.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Connected</p>
            <p className="text-lg font-bold text-gray-600 dark:text-gray-400">{appleDevices.filter(d => d.isConnected).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Shortcuts</p>
            <p className="text-lg font-bold text-slate-600 dark:text-slate-400">{siriShortcuts.filter(s => s.isEnabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Commands</p>
            <p className="text-lg font-bold text-zinc-600 dark:text-zinc-400">{siriCommands.length}</p>
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
            className="px-3 py-1.5 rounded-lg text-xs bg-gray-600 hover:bg-gray-700 text-white border-0 flex items-center gap-1"
          >
            <Apple className="h-3 w-3" />
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">HomeKit/Siri Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Mic className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-slate-900 dark:text-white">Siri Control</span>
              </div>
              <input
                type="checkbox"
                checked={homeKitSettings.siriControl}
                onChange={(e) => setHomeKitSettings({ ...homeKitSettings, siriControl: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Play className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Play Memories</span>
              </div>
              <input
                type="checkbox"
                checked={homeKitSettings.autoPlayMemories}
                onChange={(e) => setHomeKitSettings({ ...homeKitSettings, autoPlayMemories: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Memory Playback Mode</span>
              </div>
              <select
                value={homeKitSettings.memoryPlaybackMode}
                onChange={(e) => setHomeKitSettings({ ...homeKitSettings, memoryPlaybackMode: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="random">Random</option>
                <option value="recent">Recent</option>
                <option value="favorites">Favorites</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Shortcut RefreshCcw</span>
              </div>
              <input
                type="checkbox"
                checked={homeKitSettings.shortcutSync}
                onChange={(e) => setHomeKitSettings({ ...homeKitSettings, shortcutSync: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">HomeKit Secure</span>
              </div>
              <input
                type="checkbox"
                checked={homeKitSettings.homeKitSecure}
                onChange={(e) => setHomeKitSettings({ ...homeKitSettings, homeKitSecure: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Apple Devices</h4>
          <div className="space-y-2">
            {appleDevices.map((device) => (
              <div key={device.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                      {getDeviceTypeIcon(device.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{device.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${device.isConnected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {device.isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                        {device.homeKitEnabled && (
                          <span className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300">
                            HomeKit
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{device.location} • {device.type}</p>
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
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Command: {device.lastCommand || 'None'}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Used: {device.lastUsed || 'Never'}</span>
                </div>
                {device.isConnected && (
                  <button
                    type="button"
                    onClick={() => testCommand(device.id)}
                    className="w-full px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1"
                  >
                    <Mic className="h-3 w-3" />
                    Test Siri Command
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Siri Shortcuts</h4>
          <div className="space-y-2">
            {siriShortcuts.map((shortcut) => (
              <div key={shortcut.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Settings className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{shortcut.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${shortcut.isEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {shortcut.isEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{shortcut.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleShortcut(shortcut.id)}
                    className={`px-2 py-1 rounded text-xs ${shortcut.isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {shortcut.isEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Trigger: {shortcut.triggerPhrase}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Action: {shortcut.action}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Used: {shortcut.lastUsed || 'Never'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Siri Command History</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {siriCommands.map((command) => (
              <div key={command.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Mic className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{command.command}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(command.status)}`}>
                          {command.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{command.deviceName} • {command.timestamp}</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{command.response}</p>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">HomeKit/Siri Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Connect Apple devices for Siri control</li>
              <li>• Create Siri shortcuts for quick memory actions</li>
              <li>• Use HomeKit for secure home automation</li>
              <li>• Configure memory playback mode: random/recent/favorites</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
