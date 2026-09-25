'use client';

import { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Code,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Key,
  Lock,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  Trash2
} from 'lucide-react';

interface OAuthClient {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  grantTypes: ('authorization-code' | 'client-credentials' | 'refresh-token' | 'implicit')[];
  scopes: string[];
  enabled: boolean;
  createdAt: Date;
  lastUsed: Date | null;
  tokenCount: number;
}

interface OAuthToken {
  id: string;
  clientId: string;
  tokenType: 'access' | 'refresh';
  expiresAt: Date;
  scopes: string[];
  createdAt: Date;
  revoked: boolean;
}

interface OAuth2Props {
  onCancel?: () => void;
  onCreateClient?: (client: Omit<OAuthClient, 'id' | 'createdAt' | 'lastUsed' | 'tokenCount'>) => Promise<OAuthClient>;
  onRevokeToken?: (tokenId: string) => Promise<void>;
  onRegenerateSecret?: (clientId: string) => Promise<string>;
}

const DEFAULT_CLIENTS: OAuthClient[] = [
  {
    id: 'client-1',
    name: 'Mobile App',
    clientId: 'mm-mobile-****',
    clientSecret: '****',
    redirectUris: ['memorymap://auth/callback', 'https://mobile.memorymap.app/callback'],
    grantTypes: ['authorization-code', 'refresh-token'],
    scopes: ['read', 'write', 'profile'],
    enabled: true,
    createdAt: new Date(Date.now() - 86400000 * 30),
    lastUsed: new Date(),
    tokenCount: 1250,
  },
  {
    id: 'client-2',
    name: 'Web Dashboard',
    clientId: 'mm-web-****',
    clientSecret: '****',
    redirectUris: ['https://dashboard.memorymap.app/callback'],
    grantTypes: ['authorization-code', 'refresh-token'],
    scopes: ['read', 'write', 'profile', 'admin'],
    enabled: true,
    createdAt: new Date(Date.now() - 86400000 * 60),
    lastUsed: new Date(Date.now() - 3600000),
    tokenCount: 890,
  },
  {
    id: 'client-3',
    name: 'API Integration',
    clientId: 'mm-api-****',
    clientSecret: '****',
    redirectUris: [],
    grantTypes: ['client-credentials'],
    scopes: ['read', 'write'],
    enabled: true,
    createdAt: new Date(Date.now() - 86400000 * 15),
    lastUsed: new Date(Date.now() - 86400000),
    tokenCount: 5420,
  },
];

const DEFAULT_TOKENS: OAuthToken[] = [
  {
    id: 'token-1',
    clientId: 'client-1',
    tokenType: 'access',
    expiresAt: new Date(Date.now() + 3600000),
    scopes: ['read', 'write', 'profile'],
    createdAt: new Date(Date.now() - 3600000),
    revoked: false,
  },
  {
    id: 'token-2',
    clientId: 'client-1',
    tokenType: 'refresh',
    expiresAt: new Date(Date.now() + 86400000 * 7),
    scopes: ['read', 'write', 'profile'],
    createdAt: new Date(Date.now() - 86400000),
    revoked: false,
  },
  {
    id: 'token-3',
    clientId: 'client-2',
    tokenType: 'access',
    expiresAt: new Date(Date.now() - 3600000),
    scopes: ['read', 'write', 'profile', 'admin'],
    createdAt: new Date(Date.now() - 7200000),
    revoked: true,
  },
];

export default function OAuth2({ onCancel, onCreateClient, onRevokeToken, onRegenerateSecret }: OAuth2Props) {
  const [clients, setClients] = useState<OAuthClient[]>(DEFAULT_CLIENTS);
  const [tokens, setTokens] = useState<OAuthToken[]>(DEFAULT_TOKENS);
  const [showSettings, setShowSettings] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSecret, setShowSecret] = useState<{ [key: string]: boolean }>({});
  const [selectedClient, setSelectedClient] = useState<OAuthClient | null>(null);

  const handleCreateClient = async (client: Omit<OAuthClient, 'id' | 'createdAt' | 'lastUsed' | 'tokenCount'>) => {
    if (onCreateClient) {
      const newClient = await onCreateClient(client);
      setClients(prev => [newClient, ...prev]);
    } else {
      const newClient: OAuthClient = {
        ...client,
        id: `client-${Date.now()}`,
        createdAt: new Date(),
        lastUsed: null,
        tokenCount: 0,
      };
      setClients(prev => [newClient, ...prev]);
    }
    setShowCreateModal(false);
  };

  const handleRevokeToken = async (tokenId: string) => {
    if (onRevokeToken) {
      await onRevokeToken(tokenId);
    }
    setTokens(prev => prev.map(t => 
      t.id === tokenId ? { ...t, revoked: true } : t
    ));
  };

  const handleRegenerateSecret = async (clientId: string) => {
    if (onRegenerateSecret) {
      const newSecret = await onRegenerateSecret(clientId);
      setClients(prev => prev.map(c => 
        c.id === clientId ? { ...c, clientSecret: newSecret } : c
      ));
    }
  };

  const toggleSecretVisibility = (clientId: string) => {
    setShowSecret(prev => ({ ...prev, [clientId]: !prev[clientId] }));
  };

  const activeClients = clients.filter(c => c.enabled).length;
  const activeTokens = tokens.filter(t => !t.revoked).length;
  const totalRequests = clients.reduce((sum, c) => sum + c.tokenCount, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl">
            <Key className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              OAuth 2.0
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeClients} clients • {activeTokens} active tokens
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Tạo client mới"
          >
            <Plus className="h-4 w-4 text-slate-500" />
          </button>
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
        <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt OAuth 2.0
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Access token expiry
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">1 hour</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Refresh token expiry
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">7 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                PKCE enabled
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Yes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Require consent
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Yes</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Clients</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {activeClients}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Key className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Active Tokens</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {activeTokens}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Requests</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalRequests.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Security</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            PKCE
          </div>
        </div>
      </div>

      {/* OAuth Clients */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          OAuth Clients
        </h4>
        <div className="space-y-2">
          {clients.map((client) => (
            <div
              key={client.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {client.name}
                  </span>
                  {client.enabled && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRegenerateSecret(client.id)}
                  className="px-2 py-1 bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-semibold rounded-lg transition-colors"
                >
                  Regenerate Secret
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Client ID</div>
                  <div className="flex items-center gap-1">
                    <code className="text-xs text-slate-700 dark:text-slate-300">
                      {client.clientId}
                    </code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(client.clientId);
                      }}
                      className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                    >
                      <Copy className="h-3 w-3 text-slate-500" />
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Client Secret</div>
                  <div className="flex items-center gap-1">
                    <code className={`text-xs ${showSecret[client.id] ? 'text-slate-700 dark:text-slate-300' : 'blur-sm'}`}>
                      {client.clientSecret}
                    </code>
                    <button
                      type="button"
                      onClick={() => toggleSecretVisibility(client.id)}
                      className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                    >
                      {showSecret[client.id] ? <EyeOff className="h-3 w-3 text-slate-500" /> : <Eye className="h-3 w-3 text-slate-500" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Grant Types</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {client.grantTypes.map((type, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] rounded">
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-2">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Scopes</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {client.scopes.map((scope, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400 text-[10px] rounded">
                      {scope}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3" />
                <span>Last used: {client.lastUsed ? new Date(client.lastUsed).toLocaleDateString('vi-VN') : 'Never'}</span>
                <span>•</span>
                <span>Tokens: {client.tokenCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Tokens */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Active Tokens
        </h4>
        <div className="space-y-2">
          {tokens.slice(0, 5).map((token) => (
            <div
              key={token.id}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {token.tokenType}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    token.revoked
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      : token.expiresAt < new Date()
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  }`}>
                    {token.revoked ? 'Revoked' : token.expiresAt < new Date() ? 'Expired' : 'Active'}
                  </span>
                </div>
                {!token.revoked && (
                  <button
                    type="button"
                    onClick={() => handleRevokeToken(token.id)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                    title="Revoke"
                  >
                    <Trash2 className="h-3 w-3 text-slate-500" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3" />
                <span>Expires: {new Date(token.expiresAt).toLocaleString('vi-VN')}</span>
                <span>•</span>
                <span>Scopes: {token.scopes.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Client Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Tạo OAuth Client
              </h4>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  placeholder="My App"
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Redirect URIs
                </label>
                <textarea
                  placeholder="https://example.com/callback"
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Grant Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {['authorization-code', 'client-credentials', 'refresh-token'].map((type) => (
                    <label key={type} className="flex items-center gap-1">
                      <input type="checkbox" className="rounded" />
                      <span className="text-xs text-slate-700 dark:text-slate-300">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Scopes
                </label>
                <div className="flex flex-wrap gap-2">
                  {['read', 'write', 'profile', 'admin'].map((scope) => (
                    <label key={scope} className="flex items-center gap-1">
                      <input type="checkbox" className="rounded" />
                      <span className="text-xs text-slate-700 dark:text-slate-300">{scope}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-3 py-2 bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleCreateClient({
                      name: 'New Client',
                      clientId: 'mm-new-****',
                      clientSecret: '****',
                      redirectUris: [],
                      grantTypes: ['authorization-code'],
                      scopes: ['read'],
                      enabled: true,
                    });
                  }}
                  className="flex-1 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Tạo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-lg">
        <p className="text-[10px] text-indigo-700 dark:text-indigo-400">
          <strong>Lưu ý:</strong> OAuth 2.0 hỗ trợ authorization-code, client-credentials, refresh-token flows với PKCE, scope management, và token revocation.
        </p>
      </div>
    </div>
  );
}