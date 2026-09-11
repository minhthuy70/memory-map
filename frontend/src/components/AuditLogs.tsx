'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  X,
  Settings,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Shield,
  Clock,
  User,
  Globe,
  Trash2,
  ChevronRight
} from 'lucide-react';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: {
    id: string;
    email: string;
    role: 'ADMIN' | 'USER' | 'SYSTEM';
    ip: string;
    location: string;
    userAgent: string;
  };
  action: string;
  category: 'AUTH' | 'DATA' | 'SECURITY' | 'ADMIN' | 'SESSION';
  resource: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  severity: 'info' | 'warning' | 'critical';
  details: string;
  metadata?: Record<string, unknown>;
}

export interface AuditLogsProps {
  onCancel?: () => void;
  onRefreshLogs?: () => Promise<AuditLogEntry[]>;
  onExportLogs?: () => Promise<void>;
  onClearLogs?: () => Promise<void>;
}

const DEFAULT_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-801',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    actor: {
      id: 'usr-adm-01',
      email: 'admin@memorymap.io',
      role: 'ADMIN',
      ip: '118.70.144.22',
      location: 'Hà Nội, VN',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
    },
    action: 'SECURITY_POLICY_UPDATE',
    category: 'SECURITY',
    resource: 'RateLimitingConfig/Global',
    status: 'SUCCESS',
    severity: 'info',
    details: 'Cập nhật ngưỡng Rate Limit cho API login từ 10 xuống 5 req/min.',
    metadata: { previousLimit: 10, newLimit: 5, targetPath: '/api/auth/login' },
  },
  {
    id: 'log-802',
    timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    actor: {
      id: 'anonymous',
      email: 'unknown@attacker.net',
      role: 'USER',
      ip: '45.143.201.89',
      location: 'Frankfurt, DE',
      userAgent: 'python-requests/2.31.0',
    },
    action: 'AUTH_LOGIN_BRUTE_FORCE',
    category: 'AUTH',
    resource: 'Auth/LoginEndpoint',
    status: 'BLOCKED',
    severity: 'critical',
    details: 'Phát hiện 8 lần đăng nhập thất bại liên tiếp trong 1 phút bằng từ điển password.',
    metadata: { attemptCount: 8, targetAccount: 'minhthuy@memorymap.io', blockDuration: '3600s' },
  },
  {
    id: 'log-803',
    timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    actor: {
      id: 'usr-092',
      email: 'minhthuy70@gmail.com',
      role: 'USER',
      ip: '14.232.208.45',
      location: 'Đà Nẵng, VN',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) Safari/605.1',
    },
    action: 'DATA_EXPORT_ALL',
    category: 'DATA',
    resource: 'Memories/ArchiveExport',
    status: 'SUCCESS',
    severity: 'warning',
    details: 'Người dùng xuất toàn bộ 142 kỷ niệm kèm file ảnh đa phương tiện dưới định dạng JSON.',
    metadata: { memoryCount: 142, fileSizeMb: 18.4, format: 'JSON+ZIP' },
  },
  {
    id: 'log-804',
    timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    actor: {
      id: 'usr-044',
      email: 'lananh.travel@gmail.com',
      role: 'USER',
      ip: '27.72.61.104',
      location: 'TP. Hồ Chí Minh, VN',
      userAgent: 'MemoryMapApp/2.4 (iOS 17.5)',
    },
    action: 'AUTH_PASSWORD_CHANGE',
    category: 'AUTH',
    resource: 'User/Credentials',
    status: 'SUCCESS',
    severity: 'info',
    details: 'Thay đổi mật khẩu thành công qua giao diện cài đặt tài khoản cá nhân.',
    metadata: { method: 'ProfileSettings', ipLocationVerified: true },
  },
  {
    id: 'log-805',
    timestamp: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    actor: {
      id: 'system',
      email: 'ids-engine@system.internal',
      role: 'SYSTEM',
      ip: '10.0.4.1',
      location: 'AWS ap-southeast-1',
      userAgent: 'SystemSecurityDaemon/1.0',
    },
    action: 'IP_AUTO_QUARANTINE',
    category: 'SECURITY',
    resource: 'Network/FirewallRules',
    status: 'SUCCESS',
    severity: 'critical',
    details: 'Tự động đưa IP 185.220.101.5 vào danh sách cách ly 24 giờ do hành vi SQL Injection.',
    metadata: { ruleId: 'SQLI-RULE-901', threatScore: 95, durationHours: 24 },
  },
  {
    id: 'log-806',
    timestamp: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    actor: {
      id: 'usr-108',
      email: 'hoangnam99@yahoo.com',
      role: 'USER',
      ip: '171.244.12.87',
      location: 'Hải Phòng, VN',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/128.0',
    },
    action: 'SESSION_REVOKE_ALL',
    category: 'SESSION',
    resource: 'Auth/UserSessions',
    status: 'SUCCESS',
    severity: 'info',
    details: 'Người dùng thực hiện đăng xuất khỏi tất cả 3 thiết bị đang hoạt động.',
    metadata: { revokedCount: 3, initiatedFromDevice: 'Firefox-Desktop' },
  },
  {
    id: 'log-807',
    timestamp: new Date(Date.now() - 210 * 60 * 1000).toISOString(),
    actor: {
      id: 'anonymous',
      email: 'guest@crawler-bot.org',
      role: 'USER',
      ip: '194.26.29.112',
      location: 'Amsterdam, NL',
      userAgent: 'HeadlessChrome/120.0',
    },
    action: 'UNAUTHORIZED_API_ACCESS',
    category: 'ADMIN',
    resource: 'Admin/InternalMetrics',
    status: 'FAILED',
    severity: 'warning',
    details: 'Yêu cầu truy cập trái phép vào endpoint nội bộ không có JWT Bearer token.',
    metadata: { httpCode: 401, path: '/api/admin/metrics' },
  },
];

export default function AuditLogs({
  onCancel,
  onRefreshLogs,
  onExportLogs,
  onClearLogs,
}: AuditLogsProps) {
  const [logs, setLogs] = useState<AuditLogEntry[]>(DEFAULT_AUDIT_LOGS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warning' | 'critical'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'AUTH' | 'DATA' | 'SECURITY' | 'ADMIN' | 'SESSION'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'SUCCESS' | 'FAILED' | 'BLOCKED'>('all');

  // Settings
  const [retentionDays, setRetentionDays] = useState(90);
  const [anonymizeIp, setAnonymizeIp] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    if (onRefreshLogs) {
      const refreshed = await onRefreshLogs();
      setLogs(refreshed);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const simulatedActions = [
        {
          action: 'AUTH_TOKEN_VERIFIED',
          category: 'AUTH' as const,
          details: 'Xác thực token JWT định kỳ thành công.',
          severity: 'info' as const,
          status: 'SUCCESS' as const,
          resource: 'Auth/SessionPing',
        },
        {
          action: 'MEMORY_SYNC_COMPLETED',
          category: 'DATA' as const,
          details: 'Đồng bộ 3 kỷ niệm mới từ ứng dụng di động.',
          severity: 'info' as const,
          status: 'SUCCESS' as const,
          resource: 'Memories/Sync',
        },
      ];
      const randomAction = simulatedActions[Math.floor(Math.random() * simulatedActions.length)];
      const newEntry: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: {
          id: 'usr-092',
          email: 'minhthuy70@gmail.com',
          role: 'USER',
          ip: '14.232.208.45',
          location: 'Đà Nẵng, VN',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
        action: randomAction.action,
        category: randomAction.category,
        resource: randomAction.resource,
        status: randomAction.status,
        severity: randomAction.severity,
        details: randomAction.details,
      };
      setLogs((prev) => [newEntry, ...prev.slice(0, 19)]);
    }
    setIsRefreshing(false);
  }, [onRefreshLogs]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        handleRefresh();
      }, refreshInterval);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, handleRefresh]);

  const handleExport = async () => {
    if (onExportLogs) {
      await onExportLogs();
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `audit_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleClear = async () => {
    if (onClearLogs) {
      await onClearLogs();
    }
    setLogs([]);
    setSelectedLog(null);
    setShowClearConfirm(false);
  };

  const formatIp = (ip: string) => {
    if (!anonymizeIp) return ip;
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.*.*`;
    }
    return ip;
  };

  const getSeverityBadge = (sev: AuditLogEntry['severity']) => {
    switch (sev) {
      case 'critical':
        return 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
  };

  const getStatusIcon = (status: AuditLogEntry['status']) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-amber-500 shrink-0" />;
      case 'BLOCKED':
        return <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />;
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchQuery === '' ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.ip.includes(searchQuery) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesCategory && matchesStatus;
  });

  const totalLogs = logs.length;
  const criticalCount = logs.filter((l) => l.severity === 'critical').length;
  const blockedCount = logs.filter((l) => l.status === 'BLOCKED').length;
  const successRate = totalLogs > 0 ? Math.round((logs.filter((l) => l.status === 'SUCCESS').length / totalLogs) * 100) : 100;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-5 md:p-6 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md shadow-blue-500/20">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg md:text-xl">
                Nhật ký kiểm tra an ninh (Audit Logs)
              </h3>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                Live
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ghi nhận và truy vết toàn bộ hoạt động xác thực, ủy quyền, thay đổi dữ liệu và cảnh báo hệ thống.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors"
            title="Xuất file JSON"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Xuất báo cáo</span>
          </button>
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${
              showSettings
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="Cài đặt cấu hình"
          >
            <Settings className="h-4 w-4" />
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Đóng"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Tổng sự kiện</span>
            <FileText className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">{totalLogs}</div>
          <p className="text-[10px] text-slate-400">Trong phiên làm việc</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Tỷ lệ thành công</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{successRate}%</div>
          <p className="text-[10px] text-slate-400">Yêu cầu hợp lệ</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Sự kiện Nguy hiểm</span>
            <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400">{criticalCount}</div>
          <p className="text-[10px] text-slate-400">Cần giám sát đặc biệt</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Yêu cầu bị Chặn</span>
            <Shield className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{blockedCount}</div>
          <p className="text-[10px] text-slate-400">Chặn tự động bởi firewall/IDS</p>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-5 p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
              Cấu hình Audit Logs & Chính sách lưu trữ
            </h4>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="text-blue-700 dark:text-blue-300 hover:opacity-75"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Thời gian lưu trữ
              </label>
              <select
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={30}>30 ngày</option>
                <option value={90}>90 ngày (Khuyến nghị)</option>
                <option value={180}>180 ngày</option>
                <option value={365}>1 năm (Tiêu chuẩn ISO)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Tần suất Polling
              </label>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={2000}>2 giây</option>
                <option value={5000}>5 giây</option>
                <option value={10000}>10 giây</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-blue-100 dark:border-blue-900/40">
              <div>
                <span className="text-[11px] font-medium text-slate-800 dark:text-slate-200 block">
                  Ẩn danh IP
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Mask IP 118.70.*.*</span>
              </div>
              <input
                type="checkbox"
                checked={anonymizeIp}
                onChange={(e) => setAnonymizeIp(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-blue-100 dark:border-blue-900/40">
              <div>
                <span className="text-[11px] font-medium text-slate-800 dark:text-slate-200 block">
                  Auto Refresh
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Bật polling tự động</span>
              </div>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-2.5 mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo hành động, email, IP, tài nguyên hoặc chi tiết..."
              className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 rounded-xl transition-all shadow-sm"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Đang tải...' : 'Làm mới'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
              title="Xóa toàn bộ nhật ký"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 mr-1">
            <Filter className="h-3 w-3" />
            <span className="text-[11px]">Lọc:</span>
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as 'all' | 'info' | 'warning' | 'critical')}
            className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="all">Tất cả mức độ</option>
            <option value="info">Thông tin (Info)</option>
            <option value="warning">Cảnh báo (Warning)</option>
            <option value="critical">Nghiêm trọng (Critical)</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as 'all' | 'AUTH' | 'DATA' | 'SECURITY' | 'ADMIN' | 'SESSION')}
            className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="AUTH">Xác thực (AUTH)</option>
            <option value="SECURITY">Bảo mật (SECURITY)</option>
            <option value="DATA">Dữ liệu (DATA)</option>
            <option value="SESSION">Phiên (SESSION)</option>
            <option value="ADMIN">Quản trị (ADMIN)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'SUCCESS' | 'FAILED' | 'BLOCKED')}
            className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="SUCCESS">Thành công (SUCCESS)</option>
            <option value="FAILED">Thất bại (FAILED)</option>
            <option value="BLOCKED">Bị chặn (BLOCKED)</option>
          </select>

          {(searchQuery || severityFilter !== 'all' || categoryFilter !== 'all' || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSeverityFilter('all');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline ml-auto"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mb-4">
        <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-200 dark:divide-slate-700">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center p-4">
              <FileText className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Không tìm thấy nhật ký kiểm tra phù hợp
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Thử đổi từ khóa tìm kiếm hoặc điều chỉnh lại bộ lọc severity/danh mục.
              </p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-750/60 cursor-pointer transition-colors ${
                  selectedLog?.id === log.id ? 'bg-blue-50/70 dark:bg-blue-950/30' : ''
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="pt-0.5">{getStatusIcon(log.status)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                        {log.action}
                      </span>
                      <span className={`px-2 py-0.2 text-[10px] font-semibold rounded-full border ${getSeverityBadge(log.severity)}`}>
                        {log.severity.toUpperCase()}
                      </span>
                      <span className="px-1.5 py-0.2 text-[10px] font-medium rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {log.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 truncate mb-1.5">
                      {log.details}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="text-slate-600 dark:text-slate-400 font-medium truncate max-w-[140px]">
                          {log.actor.email}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        <span>{formatIp(log.actor.ip)}</span>
                        <span className="text-slate-300 dark:text-slate-600">({log.actor.location})</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(log.timestamp).toLocaleTimeString('vi-VN')}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
                    {log.resource}
                  </span>
                  <button
                    type="button"
                    className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="Xem chi tiết"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Selected Log Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-850 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Chi tiết sự kiện kiểm tra #{selectedLog.id}
                  </h4>
                  <p className="text-xs text-slate-500">{new Date(selectedLog.timestamp).toLocaleString('vi-VN')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Hành động</span>
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{selectedLog.action}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Trạng thái</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {getStatusIcon(selectedLog.status)}
                    <span className="text-xs font-bold">{selectedLog.status}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Mức độ</span>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold rounded-full border ${getSeverityBadge(selectedLog.severity)}`}>
                    {selectedLog.severity.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Thông tin Tác nhân (Actor)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Email:</span> <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedLog.actor.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Vai trò:</span> <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedLog.actor.role}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">IP & Vị trí:</span> <span className="font-mono text-slate-700 dark:text-slate-300">{selectedLog.actor.ip} ({selectedLog.actor.location})</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Tài nguyên đích:</span> <span className="font-mono text-slate-700 dark:text-slate-300">{selectedLog.resource}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400">User Agent:</span> <span className="font-mono text-[11px] break-all">{selectedLog.actor.userAgent}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Mô tả sự kiện:</span>
                <p className="text-xs p-3 bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl text-slate-800 dark:text-slate-200">
                  {selectedLog.details}
                </p>
              </div>

              {selectedLog.metadata && (
                <div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Payload Metadata (JSON):</span>
                  <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 text-xs font-semibold rounded-xl transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal to Clear Logs */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-900 p-5 text-center">
            <div className="w-10 h-10 bg-rose-100 dark:bg-rose-950/60 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
              Xác nhận xóa toàn bộ nhật ký?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Hành động này sẽ xóa vĩnh viễn tất cả các bản ghi nhật ký kiểm tra hiện tại và không thể hoàn tác.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm shadow-rose-600/20"
              >
                Xóa sạch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-3 bg-slate-50 dark:bg-slate-750/40 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>
          🛡️ Hệ thống Audit Logs tuân thủ tiêu chuẩn an toàn thông tin ISO 27001 và OWASP Security Logging Guidelines.
        </span>
        <span className="font-medium text-slate-700 dark:text-slate-300 shrink-0">
          Chính sách lưu: {retentionDays} ngày
        </span>
      </div>
    </div>
  );
}