'use client';

import { useState } from 'react';
import {
  Gauge,
  X,
  Settings,
  Search,
  RefreshCw,
  AlertTriangle,
  User,
  Zap,
  RotateCcw,
  Shield,
  TrendingUp
} from 'lucide-react';

export interface RateLimitPolicy {
  id: string;
  name: string;
  target: 'ROLE' | 'ENDPOINT';
  roleOrPath: string;
  limit: number;
  windowSeconds: number;
  actionOnExceed: 'HTTP_429' | 'CAPTCHA' | 'TEMP_BLOCK';
  enabled: boolean;
}

export interface UserRateUsage {
  id: string;
  userId: string;
  email: string;
  role: 'ANONYMOUS' | 'FREE' | 'PRO' | 'ADMIN';
  ip: string;
  currentRequests: number;
  limit: number;
  windowResetSeconds: number;
  status: 'NORMAL' | 'WARNING' | 'THROTTLED';
  throttledCount: number;
  lastActive: string;
}

export interface RateLimitingPerUserProps {
  onCancel?: () => void;
  onRefreshUsage?: () => Promise<UserRateUsage[]>;
  onResetUserQuota?: (userId: string) => Promise<void>;
  onUpdatePolicy?: (policy: RateLimitPolicy) => Promise<void>;
}

const DEFAULT_POLICIES: RateLimitPolicy[] = [
  {
    id: 'pol-1',
    name: 'Khách vãng lai (Anonymous)',
    target: 'ROLE',
    roleOrPath: 'ANONYMOUS',
    limit: 30,
    windowSeconds: 60,
    actionOnExceed: 'HTTP_429',
    enabled: true,
  },
  {
    id: 'pol-2',
    name: 'Người dùng Cơ bản (Free Tier)',
    target: 'ROLE',
    roleOrPath: 'FREE',
    limit: 60,
    windowSeconds: 60,
    actionOnExceed: 'HTTP_429',
    enabled: true,
  },
  {
    id: 'pol-3',
    name: 'Người dùng Cao cấp (Pro Tier)',
    target: 'ROLE',
    roleOrPath: 'PRO',
    limit: 300,
    windowSeconds: 60,
    actionOnExceed: 'HTTP_429',
    enabled: true,
  },
  {
    id: 'pol-4',
    name: 'Đăng nhập Nghiêm ngặt (Login Endpoint)',
    target: 'ENDPOINT',
    roleOrPath: '/api/auth/login',
    limit: 5,
    windowSeconds: 60,
    actionOnExceed: 'TEMP_BLOCK',
    enabled: true,
  },
  {
    id: 'pol-5',
    name: 'Xuất Dữ liệu Toàn bộ (Export Data)',
    target: 'ENDPOINT',
    roleOrPath: '/api/memories/export-data',
    limit: 10,
    windowSeconds: 3600,
    actionOnExceed: 'HTTP_429',
    enabled: true,
  },
];

const DEFAULT_USERS: UserRateUsage[] = [
  {
    id: 'usr-1',
    userId: 'usr-092',
    email: 'minhthuy70@gmail.com',
    role: 'PRO',
    ip: '14.232.208.45',
    currentRequests: 142,
    limit: 300,
    windowResetSeconds: 24,
    status: 'NORMAL',
    throttledCount: 0,
    lastActive: 'Vừa xong',
  },
  {
    id: 'usr-2',
    userId: 'usr-044',
    email: 'lananh.travel@gmail.com',
    role: 'FREE',
    ip: '27.72.61.104',
    currentRequests: 54,
    limit: 60,
    windowResetSeconds: 12,
    status: 'WARNING',
    throttledCount: 1,
    lastActive: '12s trước',
  },
  {
    id: 'usr-3',
    userId: 'anonymous-882',
    email: 'guest-crawler@bot.io',
    role: 'ANONYMOUS',
    ip: '45.143.201.89',
    currentRequests: 30,
    limit: 30,
    windowResetSeconds: 45,
    status: 'THROTTLED',
    throttledCount: 18,
    lastActive: '3s trước',
  },
  {
    id: 'usr-4',
    userId: 'usr-108',
    email: 'hoangnam99@yahoo.com',
    role: 'FREE',
    ip: '171.244.12.87',
    currentRequests: 18,
    limit: 60,
    windowResetSeconds: 38,
    status: 'NORMAL',
    throttledCount: 0,
    lastActive: '1m trước',
  },
  {
    id: 'usr-5',
    userId: 'usr-adm-01',
    email: 'admin@memorymap.io',
    role: 'ADMIN',
    ip: '118.70.144.22',
    currentRequests: 42,
    limit: 1200,
    windowResetSeconds: 18,
    status: 'NORMAL',
    throttledCount: 0,
    lastActive: 'Vừa xong',
  },
];

const TRAFFIC_HISTORY = [24, 38, 45, 52, 68, 92, 110, 85, 94, 120, 140, 105];

export default function RateLimitingPerUser({
  onCancel,
  onRefreshUsage,
  onResetUserQuota,
  onUpdatePolicy,
}: RateLimitingPerUserProps) {
  const [policies, setPolicies] = useState<RateLimitPolicy[]>(DEFAULT_POLICIES);
  const [userUsages, setUserUsages] = useState<UserRateUsage[]>(DEFAULT_USERS);
  const [activeTab, setActiveTab] = useState<'users' | 'policies'>('users');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'NORMAL' | 'WARNING' | 'THROTTLED'>('all');
  const [editingPolicy, setEditingPolicy] = useState<RateLimitPolicy | null>(null);

  // Global Limiting Options in settings
  const [slidingWindowEnabled, setSlidingWindowEnabled] = useState(true);
  const [enableIpFallback, setEnableIpFallback] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefreshUsage) {
      const refreshed = await onRefreshUsage();
      setUserUsages(refreshed);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUserUsages((prev) =>
        prev.map((u) => ({
          ...u,
          windowResetSeconds: Math.max(1, u.windowResetSeconds - 5),
        }))
      );
      showToast('Đã làm mới dữ liệu tần suất yêu cầu thời gian thực.');
    }
    setIsRefreshing(false);
  };

  const handleResetQuota = async (userId: string) => {
    if (onResetUserQuota) {
      await onResetUserQuota(userId);
    }
    setUserUsages((prev) =>
      prev.map((item) =>
        item.userId === userId
          ? {
              ...item,
              currentRequests: 0,
              status: 'NORMAL' as const,
              windowResetSeconds: 60,
            }
          : item
      )
    );
    showToast(`Đã reset hạn mức và giải phóng người dùng ${userId}!`);
  };

  const handleSavePolicy = async () => {
    if (!editingPolicy) return;
    if (onUpdatePolicy) {
      await onUpdatePolicy(editingPolicy);
    }
    setPolicies((prev) =>
      prev.map((p) => (p.id === editingPolicy.id ? editingPolicy : p))
    );
    setEditingPolicy(null);
    showToast(`Đã lưu cấu hình chính sách ${editingPolicy.name}.`);
  };

  const handleTogglePolicy = (policyId: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === policyId ? { ...p, enabled: !p.enabled } : p))
    );
    showToast('Đã cập nhật trạng thái kích hoạt chính sách.');
  };

  const filteredUsers = userUsages.filter((u) => {
    const matchesSearch =
      searchQuery === '' ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.ip.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalThrottled = userUsages.filter((u) => u.status === 'THROTTLED').length;
  const warningCount = userUsages.filter((u) => u.status === 'WARNING').length;
  const totalRequestsNow = userUsages.reduce((acc, curr) => acc + curr.currentRequests, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-5 md:p-6 transition-colors">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 rounded-xl text-xs font-medium flex items-center justify-between animate-fadeIn">
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage(null)}>
            <X className="h-3.5 w-3.5 text-purple-600" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-md shadow-purple-500/20">
            <Gauge className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg md:text-xl">
                Giới hạn tốc độ theo người dùng (Rate Limiting)
              </h3>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                Token Bucket
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kiểm soát lưu lượng yêu cầu (RPS), chống quá tải máy chủ DoS và áp dụng hạn ngạch theo gói người dùng.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg transition-colors shadow-sm disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Đang cập nhật...' : 'Cập nhật'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${
              showSettings
                ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="Cài đặt Rate Limit"
          >
            <Settings className="h-4 w-4" />
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="mb-5 p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
              Cấu hình Thuật toán Rate Limiting
            </h4>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="text-purple-700 dark:text-purple-300 hover:opacity-75"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-2.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-purple-100 dark:border-purple-900/40 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 block">
                  Thuật toán Sliding Window Log
                </span>
                <span className="text-[10px] text-slate-500">Độ chính xác cao, khử giật lưu lượng tại biên cửa sổ</span>
              </div>
              <input
                type="checkbox"
                checked={slidingWindowEnabled}
                onChange={(e) => setSlidingWindowEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-purple-100 dark:border-purple-900/40 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 block">
                  Nhận diện theo IP khi thiếu JWT
                </span>
                <span className="text-[10px] text-slate-500">Fallback sang IP cho các yêu cầu công khai</span>
              </div>
              <input
                type="checkbox"
                checked={enableIpFallback}
                onChange={(e) => setEnableIpFallback(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Lưu lượng Hiện tại</span>
            <Zap className="h-3.5 w-3.5 text-purple-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">{totalRequestsNow} <span className="text-xs font-normal text-slate-400">req/m</span></div>
          <p className="text-[10px] text-slate-400">Tổng request đang xử lý</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Đang bị Chặn (HTTP 429)</span>
            <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400">{totalThrottled}</div>
          <p className="text-[10px] text-slate-400">Vượt quá quota 100%</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Cảnh báo Tiệm cận</span>
            <Gauge className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{warningCount}</div>
          <p className="text-[10px] text-slate-400">Sử dụng trên 80% hạn mức</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Chính sách Hoạt động</span>
            <Shield className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {policies.filter((p) => p.enabled).length} / {policies.length}
          </div>
          <p className="text-[10px] text-slate-400">Đang thực thi</p>
        </div>
      </div>

      {/* Traffic Bar Chart Preview */}
      <div className="p-3.5 mb-5 rounded-xl bg-slate-50 dark:bg-slate-750/50 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <span>Nhịp lưu lượng yêu cầu (Requests / phút gần nhất)</span>
          </div>
          <span className="text-[11px] text-slate-400">Đỉnh: 140 req/m</span>
        </div>
        <div className="flex items-end gap-1.5 h-10 pt-1">
          {TRAFFIC_HISTORY.map((val, idx) => {
            const pct = Math.min(100, Math.round((val / 150) * 100));
            const isSpike = val > 115;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div
                  className={`w-full rounded-t-md transition-all ${
                    isSpike
                      ? 'bg-rose-500 dark:bg-rose-400'
                      : val > 80
                      ? 'bg-amber-400 dark:bg-amber-500'
                      : 'bg-purple-500 dark:bg-purple-400'
                  }`}
                  style={{ height: `${pct}%` }}
                  title={`${val} requests`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-500'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Người dùng & Hạn mức ({userUsages.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('policies')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all ${
              activeTab === 'policies'
                ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-500'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Chính sách Quy định ({policies.length})
          </button>
        </div>
      </div>

      {activeTab === 'users' && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm người dùng theo email, ID hoặc IP..."
                className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'NORMAL' | 'WARNING' | 'THROTTLED')}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="NORMAL">Bình thường</option>
              <option value="WARNING">Cảnh báo (&gt;80%)</option>
              <option value="THROTTLED">Bị chặn (Throttled 429)</option>
            </select>
          </div>

          {/* User List */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mb-4">
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredUsers.length === 0 ? (
                <div className="py-10 text-center p-4">
                  <User className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Không tìm thấy dữ liệu người dùng phù hợp
                  </p>
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const percentUsed = Math.min(100, Math.round((u.currentRequests / u.limit) * 100));
                  return (
                    <div
                      key={u.id}
                      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-750/60 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs md:text-sm text-slate-900 dark:text-white">
                            {u.email}
                          </span>
                          <span className="px-2 py-0.2 text-[10px] font-bold rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                            {u.role}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">{u.ip}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                              u.status === 'THROTTLED'
                                ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                                : u.status === 'WARNING'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            {u.status === 'THROTTLED' ? 'ĐANG BỊ CHẶN 429' : u.status}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleResetQuota(u.userId)}
                            className="p-1.5 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                            title="Reset Quota cho người dùng này"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>Reset Quota</span>
                          </button>
                        </div>
                      </div>

                      {/* Quota Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-500 dark:text-slate-400">
                            Sử dụng: <strong>{u.currentRequests}</strong> / {u.limit} req/phút ({percentUsed}%)
                          </span>
                          <span className="text-slate-400">
                            Làm mới sau: <strong>{u.windowResetSeconds}s</strong>
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              u.status === 'THROTTLED'
                                ? 'bg-rose-500'
                                : u.status === 'WARNING'
                                ? 'bg-amber-500'
                                : 'bg-purple-600'
                            }`}
                            style={{ width: `${percentUsed}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'policies' && (
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mb-4">
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-750/60 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs md:text-sm text-slate-900 dark:text-white">
                      {policy.name}
                    </span>
                    <span className="px-2 py-0.2 text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                      {policy.target}: {policy.roleOrPath}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Hạn mức: <strong className="text-purple-600 dark:text-purple-400">{policy.limit} yêu cầu</strong> trong {policy.windowSeconds} giây • Phạt khi vượt: {policy.actionOnExceed}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setEditingPolicy(policy)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTogglePolicy(policy.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      policy.enabled
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {policy.enabled ? 'Đang bật' : 'Đã tắt'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Policy Modal */}
      {editingPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-850 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-4">
              Chỉnh sửa Chính sách Rate Limit
            </h4>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Tên quy định:
                </label>
                <input
                  type="text"
                  value={editingPolicy.name}
                  onChange={(e) => setEditingPolicy({ ...editingPolicy, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Số request tối đa:
                  </label>
                  <input
                    type="number"
                    value={editingPolicy.limit}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, limit: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Cửa sổ thời gian (giây):
                  </label>
                  <input
                    type="number"
                    value={editingPolicy.windowSeconds}
                    onChange={(e) => setEditingPolicy({ ...editingPolicy, windowSeconds: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Hành động khi vượt ngưỡng:
                </label>
                <select
                  value={editingPolicy.actionOnExceed}
                  onChange={(e) =>
                    setEditingPolicy({
                      ...editingPolicy,
                      actionOnExceed: e.target.value as 'HTTP_429' | 'CAPTCHA' | 'TEMP_BLOCK',
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white outline-none"
                >
                  <option value="HTTP_429">Trả về mã HTTP 429 kèm Retry-After header</option>
                  <option value="CAPTCHA">Bắt buộc giải mã Cloudflare CAPTCHA</option>
                  <option value="TEMP_BLOCK">Khóa tạm thời địa chỉ IP 15 phút</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setEditingPolicy(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSavePolicy}
                className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer info */}
      <div className="p-3 bg-slate-50 dark:bg-slate-750/40 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>
          ⚡ Hệ thống áp dụng thuật toán Sliding Window Counter kết hợp In-Memory Cache bảo đảm độ trễ dưới 1ms.
        </span>
        <span className="font-medium text-slate-700 dark:text-slate-300 shrink-0">
          Chống lạm dụng API & DoS
        </span>
      </div>
    </div>
  );
}