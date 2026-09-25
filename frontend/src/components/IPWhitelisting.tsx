'use client';

import { useState } from 'react';
import {
  Globe,
  X,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Terminal,
  Play
} from 'lucide-react';

export interface WhitelistRule {
  id: string;
  ipOrCidr: string;
  label: string;
  addedBy: string;
  createdAt: string;
  lastAccess: string;
  expiration: 'PERMANENT' | '24_HOURS' | '7_DAYS' | '30_DAYS';
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface BlacklistRule {
  id: string;
  ipOrCidr: string;
  reason: string;
  blockedAt: string;
  totalHitsBlocked: number;
}

export interface IPWhitelistingProps {
  onCancel?: () => void;
  onRefreshList?: () => Promise<WhitelistRule[]>;
  onAddRule?: (rule: Omit<WhitelistRule, 'id' | 'createdAt' | 'lastAccess'>) => Promise<void>;
  onDeleteRule?: (id: string) => Promise<void>;
}

const DEFAULT_WHITELIST: WhitelistRule[] = [
  {
    id: 'wl-1',
    ipOrCidr: '118.70.144.22',
    label: 'Văn phòng Quản trị Hà Nội',
    addedBy: 'admin@memorymap.io',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    lastAccess: 'Vừa xong',
    expiration: 'PERMANENT',
    status: 'ACTIVE',
  },
  {
    id: 'wl-2',
    ipOrCidr: '14.232.208.0/24',
    label: 'Dải mạng VPN Công ty Đà Nẵng',
    addedBy: 'minhthuy70@gmail.com',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    lastAccess: '10 phút trước',
    expiration: 'PERMANENT',
    status: 'ACTIVE',
  },
  {
    id: 'wl-3',
    ipOrCidr: '27.72.61.104',
    label: 'Kỹ sư On-call (TP.HCM)',
    addedBy: 'admin@memorymap.io',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    lastAccess: '2 tiếng trước',
    expiration: '7_DAYS',
    status: 'ACTIVE',
  },
];

const DEFAULT_BLACKLIST: BlacklistRule[] = [
  {
    id: 'bl-1',
    ipOrCidr: '185.220.101.5',
    reason: 'Tấn công Brute-force & SQLi',
    blockedAt: new Date(Date.now() - 3600000).toISOString(),
    totalHitsBlocked: 342,
  },
  {
    id: 'bl-2',
    ipOrCidr: '194.26.29.112',
    reason: 'Botnet crawler scraping dữ liệu',
    blockedAt: new Date(Date.now() - 7200000).toISOString(),
    totalHitsBlocked: 118,
  },
];

export default function IPWhitelisting({
  onCancel,
  onRefreshList,
  onAddRule,
  onDeleteRule,
}: IPWhitelistingProps) {
  const [whitelist, setWhitelist] = useState<WhitelistRule[]>(DEFAULT_WHITELIST);
  const [blacklist, setBlacklist] = useState<BlacklistRule[]>(DEFAULT_BLACKLIST);
  const [activeTab, setActiveTab] = useState<'whitelist' | 'blacklist' | 'tester'>('whitelist');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Enforcement Mode
  const [enforcementMode, setEnforcementMode] = useState<'DISABLED' | 'STRICT' | 'SELECTIVE'>('SELECTIVE');

  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIp, setNewIp] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newExpiration, setNewExpiration] = useState<WhitelistRule['expiration']>('PERMANENT');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Tester State
  const [testIp, setTestIp] = useState('');
  const [testPath, setTestPath] = useState('/api/admin/system');
  const [testResult, setTestResult] = useState<{ allowed: boolean; reason: string } | null>(null);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefreshList) {
      const refreshed = await onRefreshList();
      setWhitelist(refreshed);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 500));
      showToast('Đã làm mới danh sách kiểm soát IP.');
    }
    setIsRefreshing(false);
  };

  const handleAddRule = async () => {
    const trimmedIp = newIp.trim();
    if (!trimmedIp || !newLabel.trim()) return;

    if (onAddRule) {
      await onAddRule({
        ipOrCidr: trimmedIp,
        label: newLabel.trim(),
        addedBy: 'admin@memorymap.io',
        expiration: newExpiration,
        status: 'ACTIVE',
      });
    }

    const newEntry: WhitelistRule = {
      id: `wl-${Date.now()}`,
      ipOrCidr: trimmedIp,
      label: newLabel.trim(),
      addedBy: 'admin@memorymap.io',
      createdAt: new Date().toISOString(),
      lastAccess: 'Chưa có',
      expiration: newExpiration,
      status: 'ACTIVE',
    };

    setWhitelist((prev) => [newEntry, ...prev]);
    setNewIp('');
    setNewLabel('');
    setShowAddModal(false);
    showToast(`Đã thêm IP ${trimmedIp} vào Whitelist thành công!`);
  };

  const handleDeleteRule = async (id: string) => {
    if (onDeleteRule) {
      await onDeleteRule(id);
    }
    setWhitelist((prev) => prev.filter((r) => r.id !== id));
    showToast('Đã gỡ bỏ quy tắc khỏi danh sách Whitelist.');
  };

  const handleToggleStatus = (id: string) => {
    setWhitelist((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : r
      )
    );
    showToast('Đã thay đổi trạng thái kích hoạt IP.');
  };

  const handleUnban = (id: string) => {
    setBlacklist((prev) => prev.filter((b) => b.id !== id));
    showToast('Đã mở khóa IP và xóa khỏi Blacklist.');
  };

  const handleQuickAddMyIp = () => {
    setNewIp('14.232.208.45');
    setNewLabel('IP Máy tính Quản trị Hiện tại');
  };

  const handleRunTest = () => {
    if (!testIp.trim()) return;
    const ip = testIp.trim();

    // Check blacklist first
    const isBlacklisted = blacklist.some((b) => b.ipOrCidr === ip);
    if (isBlacklisted) {
      setTestResult({
        allowed: false,
        reason: `Từ chối (Blocked): Địa chỉ IP ${ip} nằm trong danh sách đen (Blacklist).`,
      });
      return;
    }

    if (enforcementMode === 'DISABLED') {
      setTestResult({
        allowed: true,
        reason: 'Cho phép (Allowed): Chế độ kiểm soát IP đang Tắt (Disabled), mọi IP đều được vào.',
      });
      return;
    }

    const inWhitelist = whitelist.some(
      (w) => w.status === 'ACTIVE' && (w.ipOrCidr === ip || w.ipOrCidr.includes('/'))
    );

    if (enforcementMode === 'STRICT') {
      if (inWhitelist) {
        setTestResult({
          allowed: true,
          reason: `Cho phép (Allowed): IP ${ip} khớp với quy tắc Whitelist đang kích hoạt.`,
        });
      } else {
        setTestResult({
          allowed: false,
          reason: `Từ chối (403 Forbidden): Hệ thống đang bật chế độ Strict, IP ${ip} không nằm trong Whitelist.`,
        });
      }
      return;
    }

    if (enforcementMode === 'SELECTIVE') {
      const isSensitivePath = testPath.startsWith('/api/admin') || testPath.includes('export');
      if (isSensitivePath) {
        if (inWhitelist) {
          setTestResult({
            allowed: true,
            reason: `Cho phép (Allowed): Truy cập khu vực nhạy cảm (${testPath}) thành công nhờ IP Whitelist.`,
          });
        } else {
          setTestResult({
            allowed: false,
            reason: `Từ chối (403 Forbidden): Endpoint ${testPath} yêu cầu IP nằm trong Whitelist.`,
          });
        }
      } else {
        setTestResult({
          allowed: true,
          reason: `Cho phép (Allowed): Đường dẫn thông thường (${testPath}) không bắt buộc Whitelist ở chế độ Selective.`,
        });
      }
    }
  };

  const filteredWhitelist = whitelist.filter(
    (w) =>
      searchQuery === '' ||
      w.ipOrCidr.includes(searchQuery) ||
      w.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-5 md:p-6 transition-colors">
      {/* Toast Alert */}
      {toast && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-medium flex items-center justify-between animate-fadeIn">
          <span>{toast}</span>
          <button type="button" onClick={() => setToast(null)}>
            <X className="h-3.5 w-3.5 text-emerald-600" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-md shadow-emerald-500/20">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg md:text-xl">
                Kiểm soát truy cập IP (IP Whitelisting & ACL)
              </h3>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                CIDR / IPv4 / IPv6
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quản lý danh sách IP được phép truy cập khu vực quản trị và chặn các dải mạng độc hại.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Làm mới danh sách"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm IP</span>
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

      {/* Enforcement Mode Selector Banner */}
      <div className="p-4 mb-5 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
            Chế độ Thực thi Danh sách IP:
          </span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {enforcementMode === 'SELECTIVE' && 'Chỉ bắt buộc Whitelist đối với các API quản trị và tải dữ liệu nhạy cảm.'}
            {enforcementMode === 'STRICT' && 'Bắt buộc toàn hệ thống: Chỉ các IP có trong Whitelist mới được gửi request.'}
            {enforcementMode === 'DISABLED' && 'Đang tắt kiểm soát IP: Cho phép tất cả các IP hợp lệ truy cập tự do.'}
          </p>
        </div>

        <div className="flex rounded-xl p-1 bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shrink-0">
          <button
            type="button"
            onClick={() => {
              setEnforcementMode('SELECTIVE');
              showToast('Đã chọn chế độ: Áp dụng chọn lọc (Selective Enforcement)');
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              enforcementMode === 'SELECTIVE'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Chọn lọc (Khuyến nghị)
          </button>
          <button
            type="button"
            onClick={() => {
              setEnforcementMode('STRICT');
              showToast('Đã chọn chế độ: Nghiêm ngặt (Strict Whitelist)');
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              enforcementMode === 'STRICT'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Nghiêm ngặt
          </button>
          <button
            type="button"
            onClick={() => {
              setEnforcementMode('DISABLED');
              showToast('Đã tắt kiểm soát IP.');
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              enforcementMode === 'DISABLED'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Tắt
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('whitelist')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all ${
              activeTab === 'whitelist'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            IP Whitelist ({whitelist.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('blacklist')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all ${
              activeTab === 'blacklist'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Danh sách Đen (Blacklist: {blacklist.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tester')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all ${
              activeTab === 'tester'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Kiểm tra Quyền IP (Access Simulator)
          </button>
        </div>
      </div>

      {activeTab === 'whitelist' && (
        <>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm IP, CIDR hoặc nhãn văn phòng..."
                className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mb-4">
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredWhitelist.length === 0 ? (
                <div className="py-10 text-center p-4">
                  <Globe className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Không có IP nào trong Whitelist phù hợp
                  </p>
                </div>
              ) : (
                filteredWhitelist.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-750/60 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                          {rule.ipOrCidr}
                        </span>
                        <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                          - {rule.label}
                        </span>
                        <span
                          className={`px-2 py-0.2 text-[10px] font-bold rounded-full ${
                            rule.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                          }`}
                        >
                          {rule.status === 'ACTIVE' ? 'KÍCH HOẠT' : 'TẠM NGỪNG'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Thêm bởi: {rule.addedBy} • Hiệu lực:{' '}
                        <strong className="text-emerald-600 dark:text-emerald-400">{rule.expiration}</strong> • Lần truy cập cuối: {rule.lastAccess}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(rule.id)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                          rule.status === 'ACTIVE'
                            ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {rule.status === 'ACTIVE' ? 'Tạm ngừng' : 'Kích hoạt lại'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Xóa quy tắc"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'blacklist' && (
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mb-4">
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {blacklist.length === 0 ? (
              <div className="py-10 text-center p-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Không có IP nào bị chặn trong Blacklist
                </p>
              </div>
            ) : (
              blacklist.map((b) => (
                <div
                  key={b.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-750/60 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold text-rose-600 dark:text-rose-400">
                        {b.ipOrCidr}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        - {b.reason}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Bị chặn lúc: {new Date(b.blockedAt).toLocaleString('vi-VN')} • Đã chặn {b.totalHitsBlocked} lượt request
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUnban(b.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors self-end sm:self-center"
                  >
                    Gỡ chặn (Unban)
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'tester' && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-750/50 border border-slate-200 dark:border-slate-700 mb-4">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
            <Terminal className="h-4 w-4 text-emerald-500" />
            <span>Mô phỏng Kiểm tra Quyền Truy cập của Địa chỉ IP</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Nhập một địa chỉ IP và đường dẫn endpoint để kiểm tra hệ thống sẽ cấp quyền Cho phép hay Từ chối dưới chính sách hiện tại.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Địa chỉ IP kiểm tra:
              </label>
              <input
                type="text"
                placeholder="Ví dụ: 118.70.144.22 hoặc 1.1.1.1"
                value={testIp}
                onChange={(e) => setTestIp(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Đường dẫn Endpoint đích:
              </label>
              <input
                type="text"
                value={testPath}
                onChange={(e) => setTestPath(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTestIp('118.70.144.22')}
                className="text-[11px] px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-300"
              >
                Thử IP Whitelist
              </button>
              <button
                type="button"
                onClick={() => setTestIp('185.220.101.5')}
                className="text-[11px] px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-300"
              >
                Thử IP Blacklist
              </button>
              <button
                type="button"
                onClick={() => setTestIp('203.0.113.1')}
                className="text-[11px] px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-300"
              >
                Thử IP Lạ (Unknown)
              </button>
            </div>

            <button
              type="button"
              onClick={handleRunTest}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Chạy kiểm tra</span>
            </button>
          </div>

          {testResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-medium animate-fadeIn ${
                testResult.allowed
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {testResult.allowed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                )}
                <span>{testResult.reason}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add IP Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-850 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-4">
              Thêm Địa chỉ IP vào Whitelist
            </h4>

            <div className="space-y-3 mb-5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Địa chỉ IPv4 / IPv6 hoặc dải CIDR:
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickAddMyIp}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Lấy IP của tôi
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Ví dụ: 14.232.208.45 hoặc 10.0.0.0/24"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Tên nhãn / Mô tả nguồn gốc:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Văn phòng đại diện Hà Nội"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Thời hạn hiệu lực:
                </label>
                <select
                  value={newExpiration}
                  onChange={(e) => setNewExpiration(e.target.value as WhitelistRule['expiration'])}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white outline-none"
                >
                  <option value="PERMANENT">Vĩnh viễn (Permanent)</option>
                  <option value="24_HOURS">24 giờ</option>
                  <option value="7_DAYS">7 ngày</option>
                  <option value="30_DAYS">30 ngày</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAddRule}
                disabled={!newIp.trim() || !newLabel.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50"
              >
                Thêm vào danh sách
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer info */}
      <div className="p-3 bg-slate-50 dark:bg-slate-750/40 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>
          🛡️ Hỗ trợ phân giải dải mạng CIDR / subnet mask chuẩn IETF RFC 4632 và bảo vệ khu vực quản trị.
        </span>
        <span className="font-medium text-slate-700 dark:text-slate-300 shrink-0">
          Chế độ: {enforcementMode}
        </span>
      </div>
    </div>
  );
}