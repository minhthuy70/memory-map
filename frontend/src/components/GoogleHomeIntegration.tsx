'use client';

import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Home,
  Info,
  MessageSquare,
  Mic,
  Play,
  RefreshCw,
  Settings,
  Volume2
} from 'lucide-react';

interface GoogleHomeIntegrationProps {
  onCancel?: () => void;
}

interface GoogleDevice {
  id: string;
  name: string;
  type: 'speaker' | 'display' | 'hub';
  location: string;
  isConnected: boolean;
  lastCommand?: string;
  lastUsed?: string;
}

interface VoiceCommand {
  id: string;
  deviceId: string;
  deviceName: string;
  command: string;
  response: string;
  timestamp: string;
  status: 'success' | 'failed' | 'processing';
}

interface GoogleSettings {
  voiceControl: boolean;
  autoPlayMemories: boolean;
  memoryPlaybackMode: 'random' | 'recent' | 'favorites';
  language: string;
  volumeControl: boolean;
}

export default function GoogleHomeIntegration({ onCancel }: GoogleHomeIntegrationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isIntegrationEnabled, setIsIntegrationEnabled] = useState(true);

  const [googleDevices, setGoogleDevices] = useState<GoogleDevice[]>([
    { id: '1', name: 'Living Room Nest Hub', type: 'display', location: 'Living Room', isConnected: true, lastCommand: 'Show me memories from last week', lastUsed: '2024-01-17 18:30' },
    { id: '2', name: 'Bedroom Speaker', type: 'speaker', location: 'Bedroom', isConnected: false },
  ]);

  const [voiceCommands, setVoiceCommands] = useState<VoiceCommand[]>([
    { id: '1', deviceId: '1', deviceName: 'Living Room Nest Hub', command: 'Show me memories from last week', response: 'Showing 12 memories from the past week', timestamp: '2024-01-17 18:30', status: 'success' },
    { id: '2', deviceId: '1', deviceName: 'Living Room Nest Hub', command: 'Play my favorite memories', response: 'Playing your top 5 favorite memories', timestamp: '2024-01-16 10:15', status: 'success' },
  ]);

  const [googleSettings, setGoogleSettings] = useState<GoogleSettings>({
    voiceControl: true,
    autoPlayMemories: true,
    memoryPlaybackMode: 'recent',
    language: 'en-US',
    volumeControl: true,
  });

  const connectDevice = (id: string) => {
    setGoogleDevices(googleDevices.map(device => 
      device.id === id ? { ...device, isConnected: true } : device
    ));
  };

  const disconnectDevice = (id: string) => {
    setGoogleDevices(googleDevices.map(device => 
      device.id === id ? { ...device, isConnected: false } : device
    ));
  };

  const testCommand = (deviceId: string) => {
    const device = googleDevices.find(d => d.id === deviceId);
    if (!device) return;

    const newCommand: VoiceCommand = {
      id: Date.now().toString(),
      deviceId,
      deviceName: device.name,
      command: 'Test voice command',
      response: 'Voice command test successful',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'processing',
    };
    setVoiceCommands([...voiceCommands, newCommand]);
    
    setTimeout(() => {
      setVoiceCommands(commands => commands.map(c => 
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
      case 'display': return <Home className="h-4 w-4" />;
      case 'speaker': return <Volume2 className="h-4 w-4" />;
      case 'hub': return <Settings className="h-4 w-4" />;
      default: return <Home className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <Mic className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Google Home/Assistant
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tích hợp Google Home
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
            <p className="text-lg font-bold text-slate-900 dark:text-white">{googleDevices.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Connected</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{googleDevices.filter(d => d.isConnected).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Commands</p>
            <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{voiceCommands.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Success Rate</p>
            <p className="text-lg font-bold text-sky-600 dark:text-sky-400">{voiceCommands.filter(c => c.status === 'success').length > 0 ? Math.round((voiceCommands.filter(c => c.status === 'success').length / voiceCommands.length) * 100) : 0}%</p>
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
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Mic className="h-3 w-3" />
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Google Assistant Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Mic className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-slate-900 dark:text-white">Voice Control</span>
              </div>
              <input
                type="checkbox"
                checked={googleSettings.voiceControl}
                onChange={(e) => setGoogleSettings({ ...googleSettings, voiceControl: e.target.checked })}
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
                checked={googleSettings.autoPlayMemories}
                onChange={(e) => setGoogleSettings({ ...googleSettings, autoPlayMemories: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Memory Playback Mode</span>
              </div>
              <select
                value={googleSettings.memoryPlaybackMode}
                onChange={(e) => setGoogleSettings({ ...googleSettings, memoryPlaybackMode: e.target.value as any })}
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
                <span className="text-xs text-slate-900 dark:text-white">Language</span>
              </div>
              <select
                value={googleSettings.language}
                onChange={(e) => setGoogleSettings({ ...googleSettings, language: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="en-US">English (US)</option>
                <option value="vi-VN">Vietnamese</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Volume Control</span>
              </div>
              <input
                type="checkbox"
                checked={googleSettings.volumeControl}
                onChange={(e) => setGoogleSettings({ ...googleSettings, volumeControl: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Google Devices</h4>
          <div className="space-y-2">
            {googleDevices.map((device) => (
              <div key={device.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      {getDeviceTypeIcon(device.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{device.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${device.isConnected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {device.isConnected ? 'Connected' : 'Disconnected'}
                        </span>
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
                    Test Voice Command
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Voice Command History</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {voiceCommands.map((command) => (
              <div key={command.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Mic className="h-4 w-4 text-blue-400" />
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Google Home Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Connect Google Home devices for voice control</li>
              <li>• Use voice commands to access memories</li>
              <li>• Auto-play memories on connected displays</li>
              <li>• Configure memory playback mode: random/recent/favorites</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
