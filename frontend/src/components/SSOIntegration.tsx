'use client';

import { useState } from 'react';
import { Building2, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Shield, Clock, User, Users, Key, Globe, Lock, Plus, Trash2, Link, FileText, Check, AlertCircle } from 'lucide-react';

interface SSOProvider {
  id: string;
  name: string;
  type: 'saml' | 'oidc' | 'ldap' | 'azure-ad' | 'okta' | 'auth0';
  enabled: boolean;
  configured: boolean;
  entityId: string;
  ssoUrl: string;
  certificateExpiry: Date | null;
  lastSync: Date | null;
  connectedUsers: number;
}

interface SSOUserMapping {
  id: string;
  ssoProvider: SSOProvider['type'];
  ssoUserId: string;
  localUserId: string;
  email: string;
  username: string;
  mappedAt: Date;
  lastLogin: Date;
  status: 'active' | 'inactive' | 'suspended';
}

interface SSOIntegrationProps {
  onCancel?: () => void;
  onEnableProvider?: (providerId: string) => Promise<void>;
  onDisableProvider?: (providerId: string) => Promise<void>;
  onTestConnection?: (providerId: string) => Promise<{ success: boolean; message: string }>;
  onSyncUsers?: (providerId: string) => Promise<void>;
}

const DEFAULT_PROVIDERS: SSOProvider[] = [
  {
    id: 'provider-1',
    name: 'Azure AD',
    type: 'azure-ad',
    enabled: true,
    configured: true,
    entityId: 'memorymap-saml',
    ssoUrl: 'https://login.microsoftonline.com/...',
    certificateExpiry: new Date(Date.now() + 86400000 * 180),
    lastSync: new Date(),
    connectedUsers: 125,
  },
  {
    id: 'provider-2',
    name: 'Okta',
    type: 'okta',
    enabled: true,
    configured: true,
    entityId: 'memorymap-okta',
    ssoUrl: 'https://company.okta.com/...',
    certificateExpiry: new Date(Date.now() + 86400000 * 90),
    lastSync: new Date(Date.now() - 86400000),
    connectedUsers: 89,
  },
  {
    id: 'provider-3',
    name: 'SAML Generic',
    type: 'saml',
    enabled: false,
    configured: false,
    entityId: '',
    ssoUrl: '',
    certificateExpiry: null,
    lastSync: null,
    connectedUsers: 0,
  },
  {
    id: 'provider-4',
    name: 'LDAP',
    type: 'ldap',
    enabled: false,
    configured: false,
    entityId: '',
    ssoUrl: 'ldap://ldap.company.com',
    certificateExpiry: null,
    lastSync: null,
    connectedUsers: 0,
  },
];

const DEFAULT_MAPPINGS: SSOUserMapping[] = [
  {
    id: 'map-1',
    ssoProvider: 'azure-ad',
    ssoUserId: 'azure-user-123',
    localUserId: 'user-123',
    email: 'user@company.com',
    username: 'user.company',
    mappedAt: new Date(Date.now() - 86400000 * 30),
    lastLogin: new Date(),
    status: 'active',
  },
  {
    id: 'map-2',
    ssoProvider: 'okta',
    ssoUserId: 'okta-user-456',
    localUserId: 'user-456',
    email: 'user2@company.com',
    username: 'user2.company',
    mappedAt: new Date(Date.now() - 86400000 * 15),
    lastLogin: new Date(Date.now() - 86400000),
    status: 'active',
  },
  {
    id: 'map-3',
    ssoProvider: 'azure-ad',
    ssoUserId: 'azure-user-789',
    localUserId: 'user-789',
    email: 'user3@company.com',
    username: 'user3.company',
    mappedAt: new Date(Date.now() - 86400000 * 7),
    lastLogin: new Date(Date.now() - 86400000 * 3),
    status: 'inactive',
  },
];

export default function SSOIntegration({ onCancel, onEnableProvider, onDisableProvider, onTestConnection, onSyncUsers }: SSOIntegrationProps) {
  const [providers, setProviders] = useState<SSOProvider[]>(DEFAULT_PROVIDERS);
  const [mappings, setMappings] = useState<SSOUserMapping[]>(DEFAULT_MAPPINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<SSOProvider | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleEnable = async (providerId: string) => {
    if (onEnableProvider) {
      await onEnableProvider(providerId);
    }
    setProviders(prev => prev.map(p => 
      p.id === providerId ? { ...p, enabled: true } : p
    ));
  };

  const handleDisable = async (providerId: string) => {
    if (onDisableProvider) {
      await onDisableProvider(providerId);
    }
    setProviders(prev => prev.map(p => 
      p.id === providerId ? { ...p, enabled: false } : p
    ));
  };

  const handleTest = async (providerId: string) => {
    setIsTesting(true);
    if (onTestConnection) {
      const result = await onTestConnection(providerId);
      setTestResult(result);
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = { success: Math.random() > 0.2, message: 'Connection test completed' };
      setTestResult(result);
    }
    setIsTesting(false);
  };

  const handleSync = async (providerId: string) => {
    setIsSyncing(true);
    if (onSyncUsers) {
      await onSyncUsers(providerId);
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    setIsSyncing(false);
    setProviders(prev => prev.map(p => 
      p.id === providerId ? { ...p, lastSync: new Date() } : p
    ));
  };

  const getProviderIcon = (type: SSOProvider['type']) => {
    switch (type) {
      case 'azure-ad':
        return <Building2 className="h-4 w-4" />;
      case 'okta':
        return <Shield className="h-4 w-4" />;
      case 'saml':
        return <FileText className="h-4 w-4" />;
      case 'ldap':
        return <Users className="h-4 w-4" />;
      case 'oidc':
        return <Globe className="h-4 w-4" />;
      case 'auth0':
        return <Lock className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getProviderColor = (type: SSOProvider['type']) => {
    switch (type) {
      case 'azure-ad':
        return 'from-blue-400 to-blue-600';
      case 'okta':
        return 'from-teal-400 to-teal-600';
      case 'saml':
        return 'from-purple-400 to-purple-600';
      case 'ldap':
        return 'from-slate-400 to-slate-600';
      case 'oidc':
        return 'from-green-400 to-green-600';
      case 'auth0':
        return 'from-amber-400 to-amber-600';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const enabledProviders = providers.filter(p => p.enabled).length;
  const totalConnectedUsers = providers.reduce((sum, p) => sum + p.connectedUsers, 0);
  const activeMappings = mappings.filter(m => m.status === 'active').length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tích hợp SSO
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {enabledProviders} providers • {totalConnectedUsers} users
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
        <div className="mb-4 p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt SSO
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-provision users
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Just-in-time provisioning
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Session duration
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">8 hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Require MFA
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
            <Building2 className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Providers</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {enabledProviders}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Users</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalConnectedUsers}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Active Mappings</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {activeMappings}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Protocol</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            SAML/OIDC
          </div>
        </div>
      </div>

      {/* SSO Providers */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          SSO Providers
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
                  {provider.enabled && provider.configured && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {provider.configured && (
                    <button
                      type="button"
                      onClick={() => handleTest(provider.id)}
                      disabled={isTesting}
                      className="px-2 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-[10px] font-semibold rounded-lg transition-colors"
                    >
                      {isTesting ? 'Testing...' : 'Test'}
                    </button>
                  )}
                  {provider.configured && provider.enabled && (
                    <button
                      type="button"
                      onClick={() => handleSync(provider.id)}
                      disabled={isSyncing}
                      className="px-2 py-1 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-[10px] font-semibold rounded-lg transition-colors"
                    >
                      {isSyncing ? 'Syncing...' : 'Sync'}
                    </button>
                  )}
                  {provider.enabled ? (
                    <button
                      type="button"
                      onClick={() => handleDisable(provider.id)}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-semibold rounded-lg transition-colors"
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProvider(provider);
                        setShowConfigModal(true);
                      }}
                      className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-[10px] font-semibold rounded-lg transition-colors"
                    >
                      Configure
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Entity ID</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {provider.entityId || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Users</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {provider.connectedUsers}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Cert Expiry</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {provider.certificateExpiry 
                      ? new Date(provider.certificateExpiry).toLocaleDateString('vi-VN')
                      : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Last Sync</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {provider.lastSync 
                      ? new Date(provider.lastSync).toLocaleDateString('vi-VN')
                      : 'Never'}
                  </div>
                </div>
              </div>

              {testResult && (
                <div className={`p-2 rounded ${
                  testResult.success 
                    ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400' 
                    : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                }`}>
                  <p className="text-[10px]">{testResult.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* User Mappings */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          User Mappings
        </h4>
        <div className="space-y-2">
          {mappings.map((mapping) => (
            <div
              key={mapping.id}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getProviderIcon(mapping.ssoProvider)}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {mapping.username}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    mapping.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {mapping.status}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {mapping.email}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3" />
                <span>Last login: {new Date(mapping.lastLogin).toLocaleDateString('vi-VN')}</span>
                <span>•</span>
                <Link className="h-3 w-3" />
                <span>Mapped: {new Date(mapping.mappedAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Config Modal */}
      {showConfigModal && selectedProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Configure {selectedProvider.name}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setShowConfigModal(false);
                  setSelectedProvider(null);
                }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Entity ID
                </label>
                <input
                  type="text"
                  placeholder="memorymap-saml"
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  SSO URL
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Certificate
                </label>
                <textarea
                  placeholder="Paste X.509 certificate..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowConfigModal(false);
                    setSelectedProvider(null);
                  }}
                  className="flex-1 px-3 py-2 bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleEnable(selectedProvider.id);
                    setShowConfigModal(false);
                    setSelectedProvider(null);
                  }}
                  className="flex-1 px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Save & Enable
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-lg">
        <p className="text-[10px] text-teal-700 dark:text-teal-400">
          <strong>Lưu ý:</strong> Tích hợp SSO hỗ trợ Azure AD, Okta, SAML, LDAP với auto-provisioning, user mapping, và session management.
        </p>
      </div>
    </div>
  );
}