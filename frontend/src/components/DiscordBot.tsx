'use client';

import { useState } from 'react';
import {
  AlertCircle,
  as,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Gamepad2,
  Hash,
  HashIcon,
  Info,
  Plus,
  RefreshCw,
  Send,
  Settings,
  Trash2
} from 'lucide-react';

interface DiscordBotProps {
  onCancel?: () => void;
}

interface DiscordServer {
  id: string;
  name: string;
  icon: string;
  isConnected: boolean;
  channelCount: number;
  memberCount: number;
  lastSync?: string;
}

interface DiscordChannel {
  id: string;
  serverId: string;
  serverName: string;
  name: string;
  type: 'text' | 'voice' | 'category';
  isEnabled: boolean;
  messageCount: number;
  lastPosted?: string;
}

interface DiscordCommand {
  id: string;
  name: string;
  description: string;
  trigger: string;
  isEnabled: boolean;
  usageCount: number;
  lastUsed?: string;
}

interface DiscordMessage {
  id: string;
  channelId: string;
  channelName: string;
  memoryId: string;
  memoryTitle: string;
  content: string;
  postedAt: string;
  status: 'success' | 'failed' | 'pending';
}

interface DiscordSettings {
  autoPost: boolean;
  postInterval: number;
  includeAttachments: boolean;
  mentionRoles: boolean;
  defaultChannel: string;
  botPrefix: string;
}

export default function DiscordBot({ onCancel }: DiscordBotProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isBotEnabled, setIsBotEnabled] = useState(true);

  const [discordServers, setDiscordServers] = useState<DiscordServer[]>([
    { id: '1', name: 'Memory Community', icon: '🎮', isConnected: true, channelCount: 15, memberCount: 1250, lastSync: '2024-01-17 18:30' },
    { id: '2', name: 'Family Server', icon: '👨‍👩‍👧‍👦', isConnected: true, channelCount: 8, memberCount: 12, lastSync: '2024-01-16 10:15' },
  ]);

  const [discordChannels, setDiscordChannels] = useState<DiscordChannel[]>([
    { id: '1', serverId: '1', serverName: 'Memory Community', name: '#memories', type: 'text', isEnabled: true, messageCount: 68, lastPosted: '2024-01-17 18:30' },
    { id: '2', serverId: '1', serverName: 'Memory Community', name: '#announcements', type: 'text', isEnabled: true, messageCount: 45, lastPosted: '2024-01-16 10:15' },
    { id: '3', serverId: '2', serverName: 'Family Server', name: '#family-photos', type: 'text', isEnabled: true, messageCount: 32, lastPosted: '2024-01-15 14:00' },
  ]);

  const [discordCommands, setDiscordCommands] = useState<DiscordCommand[]>([
    { id: '1', name: '!memory', description: 'Create a new memory', trigger: '!memory [title] [content]', isEnabled: true, usageCount: 124, lastUsed: '2024-01-17 18:30' },
    { id: '2', name: '!search', description: 'Search memories', trigger: '!search [query]', isEnabled: true, usageCount: 87, lastUsed: '2024-01-16 10:15' },
    { id: '3', name: '!random', description: 'Show a random memory', trigger: '!random', isEnabled: true, usageCount: 56, lastUsed: '2024-01-15 14:00' },
  ]);

  const [discordMessages, setDiscordMessages] = useState<DiscordMessage[]>([
    { id: '1', channelId: '1', channelName: '#memories', memoryId: 'mem1', memoryTitle: 'Summer Vacation', content: 'Check out this memory from summer vacation!', postedAt: '2024-01-17 18:30', status: 'success' },
    { id: '2', channelId: '2', channelName: '#announcements', memoryId: 'mem2', memoryTitle: 'Project Milestone', content: 'We reached a major milestone!', postedAt: '2024-01-16 10:15', status: 'success' },
  ]);

  const [discordSettings, setDiscordSettings] = useState<DiscordSettings>({
    autoPost: true,
    postInterval: 20,
    includeAttachments: true,
    mentionRoles: false,
    defaultChannel: '#memories',
    botPrefix: '!',
  });

  const connectServer = (id: string) => {
    setDiscordServers(discordServers.map(server => 
      server.id === id ? { ...server, isConnected: true } : server
    ));
  };

  const disconnectServer = (id: string) => {
    setDiscordServers(discordServers.map(server => 
      server.id === id ? { ...server, isConnected: false } : server
    ));
  };

  const toggleChannel = (id: string) => {
    setDiscordChannels(discordChannels.map(channel => 
      channel.id === id ? { ...channel, isEnabled: !channel.isEnabled } : channel
    ));
  };

  const toggleCommand = (id: string) => {
    setDiscordCommands(discordCommands.map(command => 
      command.id === id ? { ...command, isEnabled: !command.isEnabled } : command
    ));
  };

  const postMessage = (channelId: string) => {
    const channel = discordChannels.find(c => c.id === channelId);
    if (!channel) return;

    const newMessage: DiscordMessage = {
      id: Date.now().toString(),
      channelId,
      channelName: channel.name,
      memoryId: `mem${Date.now()}`,
      memoryTitle: 'New Memory',
      content: 'Sharing a new memory!',
      postedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
    };
    setDiscordMessages([...discordMessages, newMessage]);
    
    setTimeout(() => {
      setDiscordMessages(messages => messages.map(m => 
        m.id === newMessage.id ? { ...m, status: 'success' } : m
      ));
      setDiscordChannels(channels => channels.map(c => 
        c.id === channelId ? { ...c, messageCount: c.messageCount + 1, lastPosted: new Date().toISOString().replace('T', ' ').substring(0, 16) } : c
      ));
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            <Gamepad2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Discord Bot
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bot Discord
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isBotEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isBotEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Servers</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{discordServers.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Channels</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{discordChannels.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Commands</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{discordCommands.filter(c => c.isEnabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Usage</p>
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{discordCommands.reduce((acc, c) => acc + c.usageCount, 0)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isBotEnabled}
              onChange={(e) => setIsBotEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Bot</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-indigo-600 hover:bg-indigo-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Server
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Bot Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-indigo-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Post</span>
              </div>
              <input
                type="checkbox"
                checked={discordSettings.autoPost}
                onChange={(e) => setDiscordSettings({ ...discordSettings, autoPost: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Post Interval (min)</span>
              </div>
              <input
                type="number"
                value={discordSettings.postInterval}
                onChange={(e) => setDiscordSettings({ ...discordSettings, postInterval: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ExternalLink className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Attachments</span>
              </div>
              <input
                type="checkbox"
                checked={discordSettings.includeAttachments}
                onChange={(e) => setDiscordSettings({ ...discordSettings, includeAttachments: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <HashIcon className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Mention Roles</span>
              </div>
              <input
                type="checkbox"
                checked={discordSettings.mentionRoles}
                onChange={(e) => setDiscordSettings({ ...discordSettings, mentionRoles: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Send className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Channel</span>
              </div>
              <input
                type="text"
                value={discordSettings.defaultChannel}
                onChange={(e) => setDiscordSettings({ ...discordSettings, defaultChannel: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-24"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Gamepad2 className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Bot Prefix</span>
              </div>
              <input
                type="text"
                value={discordSettings.botPrefix}
                onChange={(e) => setDiscordSettings({ ...discordSettings, botPrefix: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-16"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Discord Servers</h4>
          <div className="space-y-2">
            {discordServers.map((server) => (
              <div key={server.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <span className="text-lg">{server.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{server.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${server.isConnected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {server.isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => server.isConnected ? disconnectServer(server.id) : connectServer(server.id)}
                    className={`px-2 py-1 rounded text-xs ${server.isConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {server.isConnected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Channels: {server.channelCount}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Members: {server.memberCount}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last RefreshCcw: {server.lastSync || 'Never'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Bot Commands</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {discordCommands.map((command) => (
              <div key={command.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Gamepad2 className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{command.name}</span>
                        {command.isEnabled && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Enabled
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{command.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCommand(command.id)}
                    className={`px-2 py-1 rounded text-xs ${command.isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {command.isEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Trigger: {command.trigger}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Usage: {command.usageCount}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Used: {command.lastUsed || 'Never'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Discord Bot Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Connect Discord servers for bot functionality</li>
              <li>• Configure bot commands for memory interactions</li>
              <li>• Enable channels for posting memories</li>
              <li>• Set bot prefix and mention roles</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
