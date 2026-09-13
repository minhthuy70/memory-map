'use client';

import { useState } from 'react';
import { Link, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Mail, Clock, Shield, Send, ExternalLink, Copy, Check, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react';

interface MagicLinkRequest {
  id: string;
  email: string;
  requestedAt: Date;
  expiresAt: Date;
  status: 'pending' | 'sent' | 'clicked' | 'expired' | 'used';
  clickCount: number;
  ipAddress: string;
  device: string;
}

interface MagicLinkSettings {
  expirationMinutes: number;
  maxRequestsPerHour: number;
  requireEmailVerification: boolean;
  allowMultipleDevices: boolean;
  trackingEnabled: boolean;
}

interface MagicLinkAuthenticationProps {
  onCancel?: () => void;
  onSendMagicLink?: (email: string) => Promise<MagicLinkRequest>;
  onResendMagicLink?: (requestId: string) => Promise<void>;
  onRevokeMagicLink?: (requestId: string) => Promise<void>;
  onUpdateSettings?: (settings: MagicLinkSettings) => Promise<void>;
}

const DEFAULT_REQUESTS: MagicLinkRequest[] = [
  {
    id: 'req-1',
    email: 'user@example.com',
    requestedAt: new Date(Date.now() - 3600000),
    expiresAt: new Date(Date.now() + 3600000),
    status: 'sent',
    clickCount: 0,
    ipAddress: '192.168.1.1',
    device: 'Chrome on Windows',
  },
  {
    id: 'req-2',
    email: 'user2@example.com',
    requestedAt: new Date(Date.now() - 86400000),
    expiresAt: new Date(Date.now() - 82800000),
    status: 'expired',
    clickCount: 2,
    ipAddress: '192.168.1.1',
    device: 'Safari on iPhone',
  },
  {
    id: 'req-3',
    email: 'user3@example.com',
    requestedAt: new Date(Date.now() - 7200000),
    expiresAt: new Date(Date.now() - 3600000),
    status: 'used',
    clickCount: 1,
    ipAddress: '192.168.1.1',
    device: 'Firefox on Mac',
  },
];

const DEFAULT_SETTINGS: MagicLinkSettings = {
  expirationMinutes: 15,
  maxRequestsPerHour: 5,
  requireEmailVerification: true,
  allowMultipleDevices: false,
  trackingEnabled: true,
};

export default function MagicLinkAuthentication({ onCancel, onSendMagicLink, onResendMagicLink, onRevokeMagicLink, onUpdateSettings }: MagicLinkAuthenticationProps) {
  const [requests, setRequests] = useState<MagicLinkRequest[]>(DEFAULT_REQUESTS);
  const [settings, setSettings] = useState<MagicLinkSettings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [linkVisible, setLinkVisible] = useState(false);

  const handleSend = async () => {
    if (!email) return;
    setIsSending(true);
    if (onSendMagicLink) {
      const newRequest = await onSendMagicLink(email);
      setRequests(prev => [newRequest, ...prev]);
    } else {
      const newRequest: MagicLinkRequest = {
        id: `req-${Date.now()}`,
        email,
        requestedAt: new Date(),
        expiresAt: new Date(Date.now() + settings.expirationMinutes * 60000),
        status: 'sent',
        clickCount: 0,
        ipAddress: '192.168.1.1',
        device: 'Current Device',
      };
      setRequests(prev => [newRequest, ...prev]);
    }
    setGeneratedLink(`https://memorymap.app/auth/magic-link/${Date.now()}`);
    setIsSending(false);
    setEmail('');
  };

  const handleResend = async (requestId: string) => {
    if (onResendMagicLink) {
      await onResendMagicLink(requestId);
    }
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'sent' as const, requestedAt: new Date() } : req
    ));
  };

  const handleRevoke = async (requestId: string) => {
    if (onRevokeMagicLink) {
      await onRevokeMagicLink(requestId);
    }
    setRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const handleUpdateSettings = async (newSettings: MagicLinkSettings) => {
    if (onUpdateSettings) {
      await onUpdateSettings(newSettings);
    }
    setSettings(newSettings);
  };

  const getStatusColor = (status: MagicLinkRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'from-amber-400 to-orange-500';
      case 'sent':
        return 'from-blue-400 to-cyan-500';
      case 'clicked':
        return 'from-purple-400 to-pink-500';
      case 'expired':
        return 'from-red-400 to-rose-500';
      case 'used':
        return 'from-green-400 to-emerald-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getStatusIcon = (status: MagicLinkRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'sent':
        return <Send className="h-4 w-4" />;
      case 'clicked':
        return <ExternalLink className="h-4 w-4" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4" />;
      case 'used':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'sent').length;
  const usedRequests = requests.filter(r => r.status === 'used').length;
  const totalClicks = requests.reduce((sum, r) => sum + r.clickCount, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
            <Link className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Xác thực magic link
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {pendingRequests} pending • {usedRequests} used
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSendModal(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Gửi magic link mới"
          >
            <Send className="h-4 w-4 text-slate-500" />
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
        <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt magic link
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Expiration (minutes)
              </label>
              <input
                type="number"
                value={settings.expirationMinutes}
                onChange={(e) => handleUpdateSettings({ ...settings, expirationMinutes: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Max requests per hour
              </label>
              <input
                type="number"
                value={settings.maxRequestsPerHour}
                onChange={(e) => handleUpdateSettings({ ...settings, maxRequestsPerHour: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Require email verification
              </span>
              <button
                type="button"
                onClick={() => handleUpdateSettings({ ...settings, requireEmailVerification: !settings.requireEmailVerification })}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  settings.requireEmailVerification ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.requireEmailVerification ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Allow multiple devices
              </span>
              <button
                type="button"
                onClick={() => handleUpdateSettings({ ...settings, allowMultipleDevices: !settings.allowMultipleDevices })}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  settings.allowMultipleDevices ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.allowMultipleDevices ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Mail className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Requests</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {requests.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Pending</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {pendingRequests}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Used</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {usedRequests}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <ExternalLink className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Clicks</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalClicks}
          </div>
        </div>
      </div>

      {/* Magic Link Requests */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Requests
        </h4>
        <div className="space-y-2">
          {requests.map((request) => (
            <div
              key={request.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(request.status)}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {request.email}
                  </span>
                  <span className={`px-2 py-0.5 bg-gradient-to-r ${getStatusColor(request.status)} text-white text-[10px] font-bold rounded-full`}>
                    {request.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {(request.status === 'pending' || request.status === 'sent') && (
                    <button
                      type="button"
                      onClick={() => handleResend(request.id)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                      title="Resend"
                    >
                      <RefreshCw className="h-3 w-3 text-slate-500" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRevoke(request.id)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                    title="Revoke"
                  >
                    <AlertCircle className="h-3 w-3 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Requested</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {new Date(request.requestedAt).toLocaleString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Expires</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {new Date(request.expiresAt).toLocaleString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Clicks</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {request.clickCount}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Device</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {request.device}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <Shield className="h-3 w-3" />
                <span>IP: {request.ipAddress}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Gửi Magic Link
              </h4>
              <button
                type="button"
                onClick={() => {
                  setShowSendModal(false);
                  setEmail('');
                  setGeneratedLink('');
                  setLinkVisible(false);
                }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleSend}
                disabled={!email || isSending}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Gửi Magic Link
                  </>
                )}
              </button>

              {generatedLink && (
                <div className="p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Generated Link
                    </span>
                    <button
                      type="button"
                      onClick={() => setLinkVisible(!linkVisible)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                    >
                      {linkVisible ? <EyeOff className="h-3 w-3 text-slate-500" /> : <Eye className="h-3 w-3 text-slate-500" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className={`flex-1 text-xs font-mono bg-white dark:bg-slate-800 px-2 py-1 rounded ${
                      linkVisible ? 'text-slate-900 dark:text-white' : 'blur-sm'
                    }`}>
                      {generatedLink}
                    </code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedLink);
                      }}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                      title="Copy"
                    >
                      <Copy className="h-3 w-3 text-slate-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg">
        <p className="text-[10px] text-orange-700 dark:text-orange-400">
          <strong>Lưu ý:</strong> Magic link authentication cho phép đăng nhập passwordless với email-based links, expiration control, và tracking.
        </p>
      </div>
    </div>
  );
}