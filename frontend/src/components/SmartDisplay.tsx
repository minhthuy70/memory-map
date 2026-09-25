'use client';

import { useState } from 'react';
import {
  AlertCircle,
  as,
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  Image,
  ImageIcon,
  Info,
  Layout,
  Monitor,
  Play,
  RefreshCw,
  Settings
} from 'lucide-react';

interface SmartDisplayProps {
  onCancel?: () => void;
}

interface DisplayDevice {
  id: string;
  name: string;
  model: string;
  location: string;
  isConnected: boolean;
  screenMode: 'photo' | 'slideshow' | 'video';
  brightness: number;
  lastSync?: string;
}

interface DisplayContent {
  id: string;
  deviceId: string;
  deviceName: string;
  memoryId: string;
  memoryTitle: string;
  contentType: 'photo' | 'video' | 'slideshow';
  duration: number;
  scheduledAt: string;
  isPlaying: boolean;
}

interface DisplaySettings {
  autoDisplay: boolean;
  displayMode: 'random' | 'recent' | 'favorites' | 'timeline';
  slideshowInterval: number;
  showCaptions: boolean;
  showDate: boolean;
  dimAtNight: boolean;
}

export default function SmartDisplay({ onCancel }: SmartDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isDisplayEnabled, setIsDisplayEnabled] = useState(true);

  const [displayDevices, setDisplayDevices] = useState<DisplayDevice[]>([
    { id: '1', name: 'Nest Hub Max', model: 'Google Nest Hub Max', location: 'Living Room', isConnected: true, screenMode: 'slideshow', brightness: 80, lastSync: '2024-01-17 18:30' },
    { id: '2', name: 'Nest Hub (2nd Gen)', model: 'Google Nest Hub', location: 'Bedroom', isConnected: false, screenMode: 'photo', brightness: 50 },
  ]);

  const [displayContent, setDisplayContent] = useState<DisplayContent[]>([
    { id: '1', deviceId: '1', deviceName: 'Nest Hub Max', memoryId: 'mem1', memoryTitle: 'Summer Vacation 2024', contentType: 'slideshow', duration: 300, scheduledAt: '2024-01-17 18:30', isPlaying: true },
    { id: '2', deviceId: '1', deviceName: 'Nest Hub Max', memoryId: 'mem2', memoryTitle: 'Family Gathering', contentType: 'photo', duration: 30, scheduledAt: '2024-01-16 10:15', isPlaying: false },
  ]);

  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    autoDisplay: true,
    displayMode: 'recent',
    slideshowInterval: 10,
    showCaptions: true,
    showDate: true,
    dimAtNight: true,
  });

  const connectDevice = (id: string) => {
    setDisplayDevices(displayDevices.map(device => 
      device.id === id ? { ...device, isConnected: true } : device
    ));
  };

  const disconnectDevice = (id: string) => {
    setDisplayDevices(displayDevices.map(device => 
      device.id === id ? { ...device, isConnected: false } : device
    ));
  };

  const playContent = (id: string) => {
    setDisplayContent(displayContent.map(content => 
      content.id === id ? { ...content, isPlaying: true } : content
    ));
  };

  const stopContent = (id: string) => {
    setDisplayContent(displayContent.map(content => 
      content.id === id ? { ...content, isPlaying: false } : content
    ));
  };

  const scheduleContent = (deviceId: string) => {
    const device = displayDevices.find(d => d.id === deviceId);
    if (!device) return;

    const newContent: DisplayContent = {
      id: Date.now().toString(),
      deviceId,
      deviceName: device.name,
      memoryId: `mem${Date.now()}`,
      memoryTitle: 'New Memory Display',
      contentType: 'slideshow',
      duration: 300,
      scheduledAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isPlaying: false,
    };
    setDisplayContent([...displayContent, newContent]);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return <ImageIcon className="h-4 w-4" />;
      case 'video': return <Play className="h-4 w-4" />;
      case 'slideshow': return <Layout className="h-4 w-4" />;
      default: return <ImageIcon className="h-4 w-4" />;
    }
  };

  const getScreenModeColor = (mode: string) => {
    switch (mode) {
      case 'photo': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'slideshow': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'video': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl">
            <Monitor className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Smart Display
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hiển thị kỷ niệm trên smart display
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isDisplayEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isDisplayEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Displays</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{displayDevices.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Connected</p>
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{displayDevices.filter(d => d.isConnected).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Content</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{displayContent.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Playing</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{displayContent.filter(c => c.isPlaying).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isDisplayEnabled}
              onChange={(e) => setIsDisplayEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Display</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-teal-600 hover:bg-teal-700 text-white border-0 flex items-center gap-1"
          >
            <Monitor className="h-3 w-3" />
            Scan Displays
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Display Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Monitor className="h-4 w-4 text-teal-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Display</span>
              </div>
              <input
                type="checkbox"
                checked={displaySettings.autoDisplay}
                onChange={(e) => setDisplaySettings({ ...displaySettings, autoDisplay: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Layout className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Display Mode</span>
              </div>
              <select
                value={displaySettings.displayMode}
                onChange={(e) => setDisplaySettings({ ...displaySettings, displayMode: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="random">Random</option>
                <option value="recent">Recent</option>
                <option value="favorites">Favorites</option>
                <option value="timeline">Timeline</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Slideshow Interval (sec)</span>
              </div>
              <input
                type="number"
                value={displaySettings.slideshowInterval}
                onChange={(e) => setDisplaySettings({ ...displaySettings, slideshowInterval: parseInt(e.target.value) })}
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
                checked={displaySettings.showCaptions}
                onChange={(e) => setDisplaySettings({ ...displaySettings, showCaptions: e.target.checked })}
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
                checked={displaySettings.showDate}
                onChange={(e) => setDisplaySettings({ ...displaySettings, showDate: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Dim at Sunset</span>
              </div>
              <input
                type="checkbox"
                checked={displaySettings.dimAtNight}
                onChange={(e) => setDisplaySettings({ ...displaySettings, dimAtNight: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Display Devices</h4>
          <div className="space-y-2">
            {displayDevices.map((device) => (
              <div key={device.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                      <Monitor className="h-4 w-4 text-teal-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{device.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${device.isConnected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {device.isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getScreenModeColor(device.screenMode)}`}>
                          {device.screenMode}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{device.model} • {device.location}</p>
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
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last RefreshCcw: {device.lastSync || 'Never'}</span>
                </div>
                {device.isConnected && (
                  <button
                    type="button"
                    onClick={() => scheduleContent(device.id)}
                    className="w-full px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1"
                  >
                    <Play className="h-3 w-3" />
                    Schedule Content
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Display Content</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {displayContent.map((content) => (
              <div key={content.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                      {getContentTypeIcon(content.contentType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{content.memoryTitle}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${content.isPlaying ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {content.isPlaying ? 'Playing' : 'Stopped'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{content.deviceName} • {content.contentType}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{content.duration}s</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Scheduled: {content.scheduledAt}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {!content.isPlaying ? (
                    <button
                      type="button"
                      onClick={() => playContent(content.id)}
                      className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                    >
                      <Play className="h-3 w-3" />
                      Play
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => stopContent(content.id)}
                      className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      Stop
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Smart Display Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Connect smart displays like Google Nest Hub</li>
              <li>• Display photos, videos, or slideshows</li>
              <li>• Configure display mode: random/recent/favorites/timeline</li>
              <li>• Adjust slideshow interval and brightness</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
