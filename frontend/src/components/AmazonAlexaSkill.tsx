'use client';

import { useState } from 'react';
import { Mic, X, RefreshCw, Info, Settings, Play, Volume2, Home, CheckCircle, AlertCircle, MessageSquare, Activity } from 'lucide-react';

interface AmazonAlexaSkillProps {
  onCancel?: () => void;
}

interface AlexaDevice {
  id: string;
  name: string;
  type: 'echo' | 'echo_dot' | 'echo_show' | 'echo_spot';
  location: string;
  isConnected: boolean;
  skillEnabled: boolean;
  lastSkillUsage?: string;
}

interface AlexaSkill {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  invocationPhrase: string;
  lastUsed?: string;
}

interface AlexaVoiceCommand {
  id: string;
  deviceId: string;
  deviceName: string;
  command: string;
  response: string;
  timestamp: string;
  status: 'success' | 'failed' | 'processing';
}

interface AlexaSettings {
  voiceControl: boolean;
  autoPlayMemories: boolean;
  memoryPlaybackMode: 'random' | 'recent' | 'favorites';
  skillNotifications: boolean;
  voiceFeedback: boolean;
}

export default function AmazonAlexaSkill({ onCancel }: AmazonAlexaSkillProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isSkillEnabled, setIsSkillEnabled] = useState(true);

  const [alexaDevices, setAlexaDevices] = useState<AlexaDevice[]>([
    { id: '1', name: 'Echo Show 8', type: 'echo_show', location: 'Living Room', isConnected: true, skillEnabled: true, lastSkillUsage: '2024-01-17 18:30' },
    { id: '2', name: 'Echo Dot', type: 'echo_dot', location: 'Bedroom', isConnected: false, skillEnabled: false },
  ]);

  const [alexaSkills, setAlexaSkills] = useState<AlexaSkill[]>([
    { id: '1', name: 'Memory Map', description: 'Access your memories with voice commands', isEnabled: true, invocationPhrase: 'Alexa, open Memory Map', lastUsed: '2024-01-17 18:30' },
    { id: '2', name: 'Memory Reminder', description: 'Get reminded of your memories', isEnabled: true, invocationPhrase: 'Alexa, remind me of my memories', lastUsed: '2024-01-16 10:15' },
  ]);

  const [voiceCommands, setVoiceCommands] = useState<AlexaVoiceCommand[]>([
    { id: '1', deviceId: '1', deviceName: 'Echo Show 8', command: 'Alexa, show me my recent memories', response: 'Here are your 5 most recent memories', timestamp: '2024-01-17 18:30', status: 'success' },
    { id: '2', deviceId: '1', deviceName: 'Echo Show 8', command: 'Alexa, play my favorite memories', response: 'Playing your top 3 favorite memories', timestamp: '2024-01-16 10:15', status: 'success' },
  ]);

  const [alexaSettings, setAlexaSettings] = useState<AlexaSettings>({
    voiceControl: true,
    autoPlayMemories: true,
    memoryPlaybackMode: 'recent',
    skillNotifications: true,
    voiceFeedback: true,
  });

  const connectDevice = (id: string) => {
    setAlexaDevices(alexaDevices.map(device => 
      device.id === id ? { ...device, isConnected: true, skillEnabled: true } : device
    ));
  };

  const disconnectDevice = (id: string) => {
    setAlexaDevices(alexaDevices.map(device => 
      device.id === id ? { ...device, isConnected: false, skillEnabled: false } : device
    ));
  };

  const toggleSkill = (id: string) => {
    setAlexaSkills(alexaSkills.map(skill => 
      skill.id === id ? { ...skill, isEnabled: !skill.isEnabled } : skill
    ));
  };

  const testCommand = (deviceId: string) => {
    const device = alexaDevices.find(d => d.id === deviceId);
    if (!device) return;

    const newCommand: AlexaVoiceCommand = {
      id: Date.now().toString(),
      deviceId,
      deviceName: device.name,
      command: 'Alexa, test Memory Map skill',
      response: 'Memory Map skill is working perfectly',
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
      case 'echo_show': return <Home className="h-4 w-4" />;
      case 'echo_spot': return <Activity className="h-4 w-4" />;
      case 'echo': return <Volume2 className="h-4 w-4" />;
      case 'echo_dot': return <Mic className="h-4 w-4" />;
      default: return <Home className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
            <Mic className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Amazon Alexa Skill
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Alexa Skill cho Memory Map
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isSkillEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isSkillEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-lg font-bold text-slate-900 dark:text-white">{alexaDevices.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Connected</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{alexaDevices.filter(d => d.isConnected).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Skills</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{alexaSkills.filter(s => s.isEnabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Commands</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{voiceCommands.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isSkillEnabled}
              onChange={(e) => setIsSkillEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Skill</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-orange-600 hover:bg-orange-700 text-white border-0 flex items-center gap-1"
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Alexa Skill Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Mic className="h-4 w-4 text-orange-400" />
                <span className="text-xs text-slate-900 dark:text-white">Voice Control</span>
              </div>
              <input
                type="checkbox"
                checked={alexaSettings.voiceControl}
                onChange={(e) => setAlexaSettings({ ...alexaSettings, voiceControl: e.target.checked })}
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
                checked={alexaSettings.autoPlayMemories}
                onChange={(e) => setAlexaSettings({ ...alexaSettings, autoPlayMemories: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Memory Playback Mode</span>
              </div>
              <select
                value={alexaSettings.memoryPlaybackMode}
                onChange={(e) => setAlexaSettings({ ...alexaSettings, memoryPlaybackMode: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="random">Random</option>
                <option value="recent">Recent</option>
                <option value="favorites">Favorites</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Skill Notifications</span>
              </div>
              <input
                type="checkbox"
                checked={alexaSettings.skillNotifications}
                onChange={(e) => setAlexaSettings({ ...alexaSettings, skillNotifications: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Voice Feedback</span>
              </div>
              <input
                type="checkbox"
                checked={alexaSettings.voiceFeedback}
                onChange={(e) => setAlexaSettings({ ...alexaSettings, voiceFeedback: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Alexa Devices</h4>
          <div className="space-y-2">
            {alexaDevices.map((device) => (
              <div key={device.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      {getDeviceTypeIcon(device.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{device.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${device.isConnected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {device.isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                        {device.skillEnabled && (
                          <span className="px-2 py-0.5 rounded text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                            Skill Enabled
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
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Skill Usage: {device.lastSkillUsage || 'Never'}</span>
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Alexa Skills</h4>
          <div className="space-y-2">
            {alexaSkills.map((skill) => (
              <div key={skill.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Settings className="h-4 w-4 text-orange-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{skill.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${skill.isEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {skill.isEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{skill.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSkill(skill.id)}
                    className={`px-2 py-1 rounded text-xs ${skill.isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {skill.isEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Invocation: {skill.invocationPhrase}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Used: {skill.lastUsed || 'Never'}</span>
                </div>
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
                    <Mic className="h-4 w-4 text-orange-400" />
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Alexa Skill Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Enable Memory Map skill on Alexa devices</li>
              <li>• Use voice commands to access memories</li>
              <li>• Configure memory playback mode: random/recent/favorites</li>
              <li>• Enable skill notifications for reminders</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
