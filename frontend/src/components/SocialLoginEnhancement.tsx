'use client';

import { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle,
  Clock,
  ExternalLink,
  Globe,
  Link,
  Lock,
  Mail,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  Trash2,
  Users
} from 'lucide-react';

interface SocialProvider {
  id: string;
  name: string;
  type: 'google' | 'facebook' | 'apple' | 'github' | 'linkedin' | 'twitter';
  enabled: boolean;
  clientId: string;
  scopes: string[];
  lastUsed: Date | null;
  connectedAccounts: number;
}

interface SocialConnection {
  id: string;
  provider: SocialProvider['type'];
  email: string;
  username: string;
  connectedAt: Date;
  lastSync: Date;
  status: 'active' | 'revoked' | 'expired';
}

interface SocialLoginEnhancementProps {
  onCancel?: () => void;
  onEnableProvider?: (providerId: string) => Promise<void>;
  onDisableProvider?: (providerId: string) => Promise<void>;
  onConnectAccount?: (provider: SocialProvider['type']) => Promise<SocialConnection>;
  onDisconnectAccount?: (connectionId: string) => Promise<void>;
  onSyncAccount?: (connectionId: string) => Promise<void>;
}

const DEFAULT_PROVIDERS: SocialProvider[] = [
  {
    id: 'provider-1',
    name: 'Google',
    type: 'google',
    enabled: true,
    clientId: '****@apps.googleusercontent.com',
    scopes: ['email', 'profile', 'openid'],
    lastUsed: new Date(),
    connectedAccounts: 5,
  },
  {
    id: 'provider-2',
    name: 'Globe2',
    type: 'facebook',
    enabled: true,
    clientId: '****',
    scopes: ['email', 'public_profile'],
    lastUsed: new Date(Date.now() - 86400000),
    connectedAccounts: 3,
  },
  {
    id: 'provider-3',
    name: 'Apple',
    type: 'apple',
    enabled: false,
    clientId: 'com.memorymap.service',
    scopes: ['email', 'name'],
    lastUsed: null,
    connectedAccounts: 0,
  },
  {
    id: 'provider-4',
    name: 'GitHub',
    type: 'github',
    enabled: true,
    clientId: '****',
    scopes: ['user:email', 'read:user'],
    lastUsed: new Date(Date.now() - 86400000 * 2),
    connectedAccounts: 2,
  },
  {
    id: 'provider-5',
    name: 'LinkedIn',
    type: 'linkedin',
    enabled: false,
    clientId: '****',
    scopes: ['r_liteprofile', 'r_emailaddress'],
    lastUsed: null,
    connectedAccounts: 0,
  },
];

const DEFAULT_CONNECTIONS: SocialConnection[] = [
  {
    id: 'conn-1',
    provider: 'google',
    email: 'user@gmail.com',
    username: 'user',
    connectedAt: new Date(Date.now() - 86400000 * 30),
    lastSync: new Date(),
    status: 'active',
  },
  {
    id: 'conn-2',
    provider: 'facebook',
    email: 'user@facebook.com',
    username: 'user.facebook',
    connectedAt: new Date(Date.now() - 86400000 * 15),
    lastSync: new Date(Date.now() - 86400000),
    status: 'active',
  },
  {
    id: 'conn-3',
    provider: 'github',
    email: 'user@github.com',
    username: 'githubuser',
    connectedAt: new Date(Date.now() - 86400000 * 7),
    lastSync: new Date(Date.now() - 86400000 * 2),
    status: 'active',
  },
];

export default function SocialLoginEnhancement({ onCancel, onEnableProvider, onDisableProvider, onConnectAccount, onDisconnectAccount, onSyncAccount }: SocialLoginEnhancementProps) {
  const [providers, setProviders] = useState<SocialProvider[]>(DEFAULT_PROVIDERS);
  const [connections, setConnections] = useState<SocialConnection[]>(DEFAULT_CONNECTIONS);
  const [showSettings, setShowSettings] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<SocialProvider['type'] | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleEnableProvider = async (providerId: string) => {
    if (onEnableProvider) {
      await onEnableProvider(providerId);
    }
    setProviders(prev => prev.map(p => 
      p.id === providerId ? { ...p, enabled: true } : p
    ));
  };

  const handleDisableProvider = async (providerId: string) => {
    if (onDisableProvider) {
      await onDisableProvider(providerId);
    }
    setProviders(prev => prev.map(p => 
      p.id === providerId ? { ...p, enabled: false } : p
    ));
  };

  const handleConnect = async (provider: SocialProvider['type']) => {
    if (onConnectAccount) {
      const newConnection = await onConnectAccount(provider);
      setConnections(prev => [newConnection, ...prev]);
    } else {
      const newConnection: SocialConnection = {
        id: `conn-${Date.now()}`,
        provider,
        email: `user@${provider}.com`,
        username: `user.${provider}`,
        connectedAt: new Date(),
        lastSync: new Date(),
        status: 'active',
      };
      setConnections(prev => [newConnection, ...prev]);
    }
    setShowConnectModal(false);
    setSelectedProvider(null);
  };

  const handleDisconnect = async (connectionId: string) => {
    if (onDisconnectAccount) {
      await onDisconnectAccount(connectionId);
    }
    setConnections(prev => prev.filter(c => c.id !== connectionId));
  };

  const handleSync = async (connectionId: string) => {
    setIsSyncing(true);
    if (onSyncAccount) {
      await onSyncAccount(connectionId);
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    setIsSyncing(false);
    setConnections(prev => prev.map(c => 
      c.id === connectionId ? { ...c, lastSync: new Date() } : c
    ));
  };

  const getProviderIcon = (type: SocialProvider['type']) => {
    switch (type) {
      case 'google':
        return <Globe className="h-4 w-4" />;
      case 'facebook':
        return <Users className="h-4 w-4" />;
      case 'apple':
        return <Globe className="h-4 w-4" />;
      case 'github':
        return <Globe className="h-4 w-4" />;
      case 'linkedin':
        return <Users className="h-4 w-4" />;
      case 'twitter':
        return <Globe className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getProviderColor = (type: SocialProvider['type']) => {
    switch (type) {
      case 'google':
        return 'from-red-400 to-orange-500';
      case 'facebook':
        return 'from-blue-400 to-blue-600';
      case 'apple':
        return 'from-slate-400 to-slate-600';
      case 'github':
        return 'from-slate-700 to-slate-900';
      case 'linkedin':
        return 'from-blue-500 to-blue-700';
      case 'twitter':
        return 'from-sky-400 to-sky-600';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const enabledProviders = providers.filter(p => p.enabled).length;
  const totalConnections = connections.length;
  const activeConnections = connections.filter(c => c.status === 'active').length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Đăng nhập xã hội nâng cao
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {enabledProviders} providers • {activeConnections} connections
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Cài đặt"
          >
            <Settings className="h-4 w-4 text-slate-500" />
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

      {showSettings && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt social login
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-link accounts
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Require email verification
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Yes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Session duration
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">30 days</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Providers</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {enabledProviders}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Link className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Connections</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalConnections}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Active</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {activeConnections}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Security</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            OAuth 2.0
          </div>
        </div>
      </div>

      {/* Social Providers */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Providers
        </h4>
        <div className="space-y-2">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 bg-gradient-to-r ${getProviderColor(provider.type)} rounded-lg`}>
                    {getProviderIcon(provider.type)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {provider.name}
                  </span>
                  {provider.enabled && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => provider.enabled ? handleDisableProvider(provider.id) : handleEnableProvider(provider.id)}
                  className={`px-2 py-1 text-[10px] font-semibold rounded-lg transition-colors ${
                    provider.enabled 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {provider.enabled ? 'Disable' : 'Enable'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Client ID</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {provider.clientId}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Accounts</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {provider.connectedAccounts}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Scopes</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {provider.scopes.length}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {provider.scopes.map((scope, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-200 dark:bg-slate-600 rounded text-[10px] text-slate-600 dark:text-slate-400">
                    {scope}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
            Connected Accounts
          </h4>
          <button
            type="button"
            onClick={() => setShowConnectModal(true)}
            className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Plus className="h-3 w-3" />
            Connect
          </button>
        </div>
        <div className="space-y-2">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getProviderIcon(connection.provider)}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {connection.username}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    connection.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}>
                    {connection.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {connection.status === 'active' && (
                    <button
                      type="button"
                      onClick={() => handleSync(connection.id)}
                      disabled={isSyncing}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                      title="RefreshCcw"
                    >
                      <RefreshCw className={`h-3 w-3 text-slate-500 ${isSyncing ? 'animate-spin' : ''}`} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDisconnect(connection.id)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                    title="Disconnect"
                  >
                    <Trash2 className="h-3 w-3 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                <Mail className="h-3 w-3" />
                <span>{connection.email}</span>
                <span>•</span>
                <Clock className="h-3 w-3" />
                <span>Last sync: {new Date(connection.lastSync).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Connect Social Account
              </h4>
              <button
                type="button"
                onClick={() => {
                  setShowConnectModal(false);
                  setSelectedProvider(null);
                }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-2">
              {providers.filter(p => p.enabled).map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => handleConnect(provider.type)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 hover:border-green-500 dark:hover:border-green-500 transition-colors"
                >
                  <div className={`p-2 bg-gradient-to-r ${getProviderColor(provider.type)} rounded-lg`}>
                    {getProviderIcon(provider.type)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Connect with {provider.name}
                  </span>
                  <ExternalLink className="h-4 w-4 text-slate-500 ml-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-[10px] text-green-700 dark:text-green-400">
          <strong>Lưu ý:</strong> Đăng nhập xã hội nâng cao hỗ trợ Google, Globe2, Apple, GitHub, LinkedIn với OAuth 2.0, account linking, và sync functionality.
        </p>
      </div>
    </div>
  );
}