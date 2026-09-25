'use client';

import { useState } from 'react';
import { MessageSquare, X, RefreshCw, Info, Settings, Plus, Trash2, CheckCircle, AlertCircle, Clock, Calendar, ExternalLink, Send, Hash } from 'lucide-react';

interface SlackIntegrationProps {
  onCancel?: () => void;
}

interface SlackWorkspace {
  id: string;
  name: string;
  domain: string;
  isConnected: boolean;
  channelCount: number;
  lastSync?: string;
}

interface SlackChannel {
  id: string;
  workspaceId: string;
  workspaceName: string;
  name: string;
  type: 'public' | 'private' | 'dm';
  isEnabled: boolean;
  messageCount: number;
  lastPosted?: string;
}

interface SlackMessage {
  id: string;
  channelId: string;
  channelName: string;
  memoryId: string;
  memoryTitle: string;
  content: string;
  postedAt: string;
  status: 'success' | 'failed' | 'pending';
}

interface SlackSettings {
  autoPost: boolean;
  postInterval: number;
  includeAttachments: boolean;
  mentionUsers: boolean;
  defaultChannel: string;
}

export default function SlackIntegration({ onCancel }: SlackIntegrationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isSlackEnabled, setIsSlackEnabled] = useState(true);

  const [slackWorkspaces, setSlackWorkspaces] = useState<SlackWorkspace[]>([
    { id: '1', name: 'Company Team', domain: 'company-team', isConnected: true, channelCount: 12, lastSync: '2024-01-17 18:30' },
    { id: '2', name: 'Personal', domain: 'personal-workspace', isConnected: true, channelCount: 5, lastSync: '2024-01-16 10:15' },
  ]);

  const [slackChannels, setSlackChannels] = useState<SlackChannel[]>([
    { id: '1', workspaceId: '1', workspaceName: 'Company Team', name: '#memories', type: 'public', isEnabled: true, messageCount: 45, lastPosted: '2024-01-17 18:30' },
    { id: '2', workspaceId: '1', workspaceName: 'Company Team', name: '#team-updates', type: 'public', isEnabled: true, messageCount: 32, lastPosted: '2024-01-16 10:15' },
    { id: '3', workspaceId: '2', workspaceName: 'Personal', name: '#family', type: 'private', isEnabled: true, messageCount: 28, lastPosted: '2024-01-15 14:00' },
  ]);

  const [slackMessages, setSlackMessages] = useState<SlackMessage[]>([
    { id: '1', channelId: '1', channelName: '#memories', memoryId: 'mem1', memoryTitle: 'Summer Vacation', content: 'Check out this memory from summer vacation!', postedAt: '2024-01-17 18:30', status: 'success' },
    { id: '2', channelId: '2', channelName: '#team-updates', memoryId: 'mem2', memoryTitle: 'Project Milestone', content: 'We reached a major milestone!', postedAt: '2024-01-16 10:15', status: 'success' },
  ]);

  const [slackSettings, setSlackSettings] = useState<SlackSettings>({
    autoPost: true,
    postInterval: 15,
    includeAttachments: true,
    mentionUsers: false,
    defaultChannel: '#memories',
  });

  const connectWorkspace = (id: string) => {
    setSlackWorkspaces(slackWorkspaces.map(workspace => 
      workspace.id === id ? { ...workspace, isConnected: true } : workspace
    ));
  };

  const disconnectWorkspace = (id: string) => {
    setSlackWorkspaces(slackWorkspaces.map(workspace => 
      workspace.id === id ? { ...workspace, isConnected: false } : workspace
    ));
  };

  const toggleChannel = (id: string) => {
    setSlackChannels(slackChannels.map(channel => 
      channel.id === id ? { ...channel, isEnabled: !channel.isEnabled } : channel
    ));
  };

  const postMessage = (channelId: string) => {
    const channel = slackChannels.find(c => c.id === channelId);
    if (!channel) return;

    const newMessage: SlackMessage = {
      id: Date.now().toString(),
      channelId,
      channelName: channel.name,
      memoryId: `mem${Date.now()}`,
      memoryTitle: 'New Memory',
      content: 'Sharing a new memory!',
      postedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
    };
    setSlackMessages([...slackMessages, newMessage]);
    
    setTimeout(() => {
      setSlackMessages(messages => messages.map(m => 
        m.id === newMessage.id ? { ...m, status: 'success' } : m
      ));
      setSlackChannels(channels => channels.map(c => 
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
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Slack Integration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tích hợp Slack (share memories to channel)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isSlackEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isSlackEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Workspaces</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{slackWorkspaces.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Channels</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{slackChannels.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Messages</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">{slackMessages.filter(m => m.status === 'success').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Auto Post</p>
            <p className="text-lg font-bold text-fuchsia-600 dark:text-fuchsia-400">{slackSettings.autoPost ? 'On' : 'Off'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isSlackEnabled}
              onChange={(e) => setIsSlackEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Slack</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-purple-600 hover:bg-purple-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Connect Workspace
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Slack Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Post</span>
              </div>
              <input
                type="checkbox"
                checked={slackSettings.autoPost}
                onChange={(e) => setSlackSettings({ ...slackSettings, autoPost: e.target.checked })}
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
                value={slackSettings.postInterval}
                onChange={(e) => setSlackSettings({ ...slackSettings, postInterval: parseInt(e.target.value) })}
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
                checked={slackSettings.includeAttachments}
                onChange={(e) => setSlackSettings({ ...slackSettings, includeAttachments: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Hash className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Mention Users</span>
              </div>
              <input
                type="checkbox"
                checked={slackSettings.mentionUsers}
                onChange={(e) => setSlackSettings({ ...slackSettings, mentionUsers: e.target.checked })}
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
                value={slackSettings.defaultChannel}
                onChange={(e) => setSlackSettings({ ...slackSettings, defaultChannel: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-24"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Slack Workspaces</h4>
          <div className="space-y-2">
            {slackWorkspaces.map((workspace) => (
              <div key={workspace.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <MessageSquare className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{workspace.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${workspace.isConnected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {workspace.isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{workspace.domain}.slack.com</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => workspace.isConnected ? disconnectWorkspace(workspace.id) : connectWorkspace(workspace.id)}
                    className={`px-2 py-1 rounded text-xs ${workspace.isConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {workspace.isConnected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Channels: {workspace.channelCount}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Sync: {workspace.lastSync || 'Never'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Slack Channels</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {slackChannels.map((channel) => (
              <div key={channel.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                      <Hash className="h-4 w-4 text-pink-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{channel.name}</span>
                        {channel.isEnabled && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Enabled
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{channel.workspaceName} • {channel.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => toggleChannel(channel.id)}
                      className={`px-2 py-1 rounded text-xs ${channel.isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                    >
                      {channel.isEnabled ? 'Disable' : 'Enable'}
                    </button>
                    {channel.isEnabled && (
                      <button
                        type="button"
                        onClick={() => postMessage(channel.id)}
                        className="px-2 py-1 rounded text-xs bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Send className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Messages: {channel.messageCount}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Posted: {channel.lastPosted || 'Never'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Slack Integration Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Connect Slack workspaces for memory sharing</li>
              <li>• Enable channels for posting memories</li>
              <li>• Configure auto-post and intervals</li>
              <li>• Include attachments and mention users</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
