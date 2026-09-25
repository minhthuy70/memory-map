'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  X,
  Settings,
  Search,
  Filter,
  CheckCircle2,
  ShieldAlert,
  Clock,
  User,
  Globe,
  RefreshCw,
  Ban,
  ChevronRight,
  Flame
} from 'lucide-react';

export interface SecurityAlertItem {
  id: string;
  title: string;
  category: 'BRUTE_FORCE' | 'SUSPICIOUS_LOGIN' | 'RATE_LIMIT_SPIKE' | 'CREDENTIAL_STUFFING' | 'TOKEN_HIJACK' | 'SQLI_ATTEMPT';
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'investigating' | 'resolved' | 'dismissed';
  riskScore: number; // 0 - 100
  sourceIp: string;
  location: string;
  targetAccount?: string;
  targetEndpoint: string;
  timestamp: string;
  description: string;
  recommendation: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface SecurityAlertsProps {
  onCancel?: () => void;
  onRefreshAlerts?: () => Promise<SecurityAlertItem[]>;
  onResolveAlert?: (id: string) => Promise<void>;
  onBlockIp?: (ip: string) => Promise<void>;
}

const DEFAULT_ALERTS: SecurityAlertItem[] = [
  {
    id: 'ALT-1092',
    title: 'Tấn công Brute-force mật khẩu quy mô lớn',
    category: 'BRUTE_FORCE',
    severity: 'critical',
    status: 'active',
    riskScore: 94,
    sourceIp: '185.220.101.5',
    location: 'Frankfurt, Đức',
    targetAccount: 'admin@memorymap.io',
    targetEndpoint: '/api/auth/login',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    description: 'Hơn 45 yêu cầu POST đăng nhập thất bại trong 30 giây từ cùng một địa chỉ IP với danh sách mật khẩu phổ biến.',
    recommendation: 'Lập tức khóa IP nguồn 185.220.101.5 vào danh sách Blacklist và kích hoạt CAPTCHA bắt buộc cho trang login.',
  },
  {
    id: 'ALT-1093',
    title: 'Đăng nhập từ vị trí bất thường (Bất đồng bộ địa lý)',
    category: 'SUSPICIOUS_LOGIN',
    severity: 'high',
    status: 'investigating',
    riskScore: 82,
    sourceIp: '103.21.244.12',
    location: 'Moscow, Nga',
    targetAccount: 'minhthuy70@gmail.com',
    targetEndpoint: '/api/auth/verify',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    description: 'Tài khoản đăng nhập từ Moscow chỉ 10 phút sau khi vừa hoạt động tại Đà Nẵng, Việt Nam. Tốc độ di chuyển bất khả thi.',
    recommendation: 'Hủy toàn bộ phiên hoạt động (Revoke Sessions) của tài khoản và yêu cầu người dùng xác thực lại qua Email OTP.',
  },
  {
    id: 'ALT-1094',
    title: 'Phát hiện chuỗi tiêm nhiễm SQL Injection trong URL query',
    category: 'SQLI_ATTEMPT',
    severity: 'critical',
    status: 'active',
    riskScore: 98,
    sourceIp: '194.26.29.112',
    location: 'Amsterdam, Hà Lan',
    targetEndpoint: '/api/memories?search=1%27%20OR%201=1--',
    timestamp: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
    description: 'Hệ thống WAF phát hiện payload SQL injection pattern "\' OR 1=1--" nhằm vượt qua bộ lọc truy vấn kỷ niệm.',
    recommendation: 'Kiểm tra Prisma ORM parameterized query và thêm signature vào tường lửa IDS/IPS.',
  },
  {
    id: 'ALT-1095',
    title: 'Đột biến lưu lượng truy cập (DDoS Rate Limit Spike)',
    category: 'RATE_LIMIT_SPIKE',
    severity: 'medium',
    status: 'resolved',
    riskScore: 65,
    sourceIp: '14.161.40.88',
    location: 'TP. Hồ Chí Minh, VN',
    targetEndpoint: '/api/categories',
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    description: 'Gửi liên tục 180 request/phút vượt quá hạn mức tối đa cho phép 60 req/min của người dùng miễn phí.',
    recommendation: 'Áp dụng mã phản hồi HTTP 429 Too Many Requests và áp chế tạm thời 15 phút.',
    resolvedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    resolvedBy: 'Hệ thống tự động (RateLimiterEngine)',
  },
  {
    id: 'ALT-1096',
    title: 'Nghi vấn tái sử dụng Token đã bị thu hồi (Token Reuse)',
    category: 'TOKEN_HIJACK',
    severity: 'high',
    status: 'active',
    riskScore: 88,
    sourceIp: '113.190.23.67',
    location: 'Hà Nội, VN',
    targetAccount: 'lananh.travel@gmail.com',
    targetEndpoint: '/api/memories/export-data',
    timestamp: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
    description: 'Một yêu cầu xuất dữ liệu sử dụng JWT token đã bị gắn cờ Revoked từ 2 tiếng trước.',
    recommendation: 'Chặn yêu cầu với mã 401 Unauthorized, kiểm tra rò rỉ token phía client.',
  },
];

export default function SecurityAlerts({
  onCancel,
  onRefreshAlerts,
  onResolveAlert,
  onBlockIp,
}: SecurityAlertsProps) {
  const [alerts, setAlerts] = useState<SecurityAlertItem[]>(DEFAULT_ALERTS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlertItem | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'investigating' | 'resolved' | 'dismissed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoBlockHighRisk, setAutoBlockHighRisk] = useState(true);
  const [autoBlockThreshold, setAutoBlockThreshold] = useState(85);
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.slack.com/services/SEC/ALERTS');

  // Action status toast
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefreshAlerts) {
      const refreshed = await onRefreshAlerts();
      setAlerts(refreshed);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (alerts.filter((a) => a.status === 'active').length < 6) {
        const simulated: SecurityAlertItem = {
          id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
          title: 'Phát hiện quét cổng API không xác thực (Scraper Probe)',
          category: 'RATE_LIMIT_SPIKE',
          severity: 'medium',
          status: 'active',
          riskScore: 72,
          sourceIp: `198.51.100.${Math.floor(Math.random() * 250)}`,
          location: 'Singapore, SG',
          targetEndpoint: '/api/memories/public',
          timestamp: new Date().toISOString(),
          description: 'Robot tự động thử nghiệm quét các endpoint công khai với tần suất cao bất thường.',
          recommendation: 'Giới hạn tần suất và kích hoạt kiểm tra chữ ký User-Agent.',
        };
        setAlerts((prev) => [simulated, ...prev]);
        showNotification('Đã làm mới dữ liệu cảnh báo an ninh!');
      }
    }
    setIsRefreshing(false);
  };

  const handleResolve = async (alertId: string) => {
    if (onResolveAlert) {
      await onResolveAlert(alertId);
    }
    setAlerts((prev) =>
      prev.map((item) =>
        item.id === alertId
          ? {
              ...item,
              status: 'resolved' as const,
              resolvedAt: new Date().toISOString(),
              resolvedBy: 'Quản trị viên (Admin)',
            }
          : item
      )
    );
    if (selectedAlert?.id === alertId) {
      setSelectedAlert((prev) =>
        prev
          ? {
              ...prev,
              status: 'resolved',
              resolvedAt: new Date().toISOString(),
              resolvedBy: 'Quản trị viên (Admin)',
            }
          : null
      );
    }
    showNotification(`Đã đánh dấu giải quyết cảnh báo #${alertId}`);
  };

  const handleInvestigate = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((item) =>
        item.id === alertId ? { ...item, status: 'investigating' as const } : item
      )
    );
    if (selectedAlert?.id === alertId) {
      setSelectedAlert((prev) => (prev ? { ...prev, status: 'investigating' } : null));
    }
    showNotification(`Đang chuyển cảnh báo #${alertId} sang chế độ điều tra.`);
  };

  const handleDismiss = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((item) =>
        item.id === alertId ? { ...item, status: 'dismissed' as const } : item
      )
    );
    if (selectedAlert?.id === alertId) {
      setSelectedAlert(null);
    }
    showNotification(`Đã bỏ qua cảnh báo #${alertId} (False Positive).`);
  };

  const handleBlockIp = async (ip: string) => {
    if (onBlockIp) {
      await onBlockIp(ip);
    }
    showNotification(`🛡️ Đã chặn thành công địa chỉ IP ${ip} vào danh sách cấm!`);
  };

  const handleResolveAll = () => {
    setAlerts((prev) =>
      prev.map((item) => ({
        ...item,
        status: item.status === 'active' ? 'resolved' : item.status,
        resolvedAt: item.status === 'active' ? new Date().toISOString() : item.resolvedAt,
        resolvedBy: item.status === 'active' ? 'Admin (Batch)' : item.resolvedBy,
      }))
    );
    showNotification('Đã giải quyết tất cả cảnh báo đang mở.');
  };

  const getSeverityStyle = (sev: SecurityAlertItem['severity']) => {
    switch (sev) {
      case 'critical':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60';
      case 'high':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/60';
      case 'medium':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60';
      case 'low':
      default:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60';
    }
  };

  const getStatusBadge = (status: SecurityAlertItem['status']) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300';
      case 'investigating':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300';
      case 'resolved':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
      case 'dismissed':
        return 'bg-slate-100 text-slate-600 dark:bg-slate-750 dark:text-slate-400';
    }
  };

  const filteredAlerts = alerts.filter((item) => {
    const matchesQuery =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sourceIp.includes(searchQuery) ||
      (item.targetAccount && item.targetAccount.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.targetEndpoint.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === 'all' || item.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

    return matchesQuery && matchesSeverity && matchesStatus && matchesCategory;
  });

  const activeThreats = alerts.filter((a) => a.status === 'active').length;
  const criticalThreats = alerts.filter((a) => a.severity === 'critical' && a.status === 'active').length;
  const investigatingThreats = alerts.filter((a) => a.status === 'investigating').length;
  const resolvedCount = alerts.filter((a) => a.status === 'resolved').length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-5 md:p-6 transition-colors">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-medium flex items-center justify-between animate-fadeIn">
          <span>{actionNotice}</span>
          <button type="button" onClick={() => setActionNotice(null)}>
            <X className="h-3.5 w-3.5 text-emerald-600" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl shadow-md shadow-red-500/20">
            <ShieldAlert className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg md:text-xl">
                Cảnh báo an ninh & Đe dọa (Security Alerts)
              </h3>
              {criticalThreats > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 animate-pulse">
                  {criticalThreats} Khẩn cấp
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Phát hiện tức thì các cuộc tấn công Brute-force, rò rỉ token, xâm nhập SQLi và hành vi bất thường.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          <button
            type="button"
            onClick={handleResolveAll}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Giải quyết tất cả</span>
          </button>
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${
              showSettings
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="Cài đặt cấu hình cảnh báo"
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Mối đe dọa Đang mở</span>
            <Flame className="h-3.5 w-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400">{activeThreats}</div>
          <p className="text-[10px] text-slate-400">Đang chờ xử lý</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Mức độ Nghiêm trọng</span>
            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
          </div>
          <div className="text-xl font-bold text-red-600 dark:text-red-400">{criticalThreats}</div>
          <p className="text-[10px] text-slate-400">Yêu cầu can thiệp ngay</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Đang điều tra</span>
            <Clock className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{investigatingThreats}</div>
          <p className="text-[10px] text-slate-400">Đang phân tích hành vi</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Đã khắc phục</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{resolvedCount}</div>
          <p className="text-[10px] text-slate-400">Xử lý thành công</p>
        </div>
      </div>

      {/* Settings Modal / Panel */}
      {showSettings && (
        <div className="mb-5 p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-rose-900 dark:text-rose-300 uppercase tracking-wider">
              Cấu hình Thông báo & Ngưỡng Phòng thủ Tự động
            </h4>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="text-rose-700 dark:text-rose-300 hover:opacity-75"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-2.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-rose-100 dark:border-rose-900/40 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 block">
                  Email Khẩn cấp
                </span>
                <span className="text-[10px] text-slate-500">Gửi mail khi có mối đe dọa Critical</span>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-rose-100 dark:border-rose-900/40">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                  Tự động Chặn IP Nguy hiểm
                </span>
                <input
                  type="checkbox"
                  checked={autoBlockHighRisk}
                  onChange={(e) => setAutoBlockHighRisk(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500">Ngưỡng rủi ro:</span>
                <select
                  value={autoBlockThreshold}
                  onChange={(e) => setAutoBlockThreshold(Number(e.target.value))}
                  className="px-1.5 py-0.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-white outline-none"
                >
                  <option value={75}>&gt; 75 điểm</option>
                  <option value={80}>&gt; 80 điểm</option>
                  <option value={85}>&gt; 85 điểm (Khuyến nghị)</option>
                  <option value={90}>&gt; 90 điểm</option>
                </select>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-rose-100 dark:border-rose-900/40">
              <label className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                Webhook tích hợp (Slack/Discord)
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full px-2 py-1 text-[11px] font-mono bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-slate-100 outline-none"
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
              placeholder="Tìm theo tiêu đề, địa chỉ IP, tài khoản nạn nhân hoặc URL..."
              className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 disabled:opacity-50 rounded-xl transition-all shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Đang quét...' : 'Quét đe dọa'}</span>
          </button>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 mr-1">
            <Filter className="h-3 w-3" />
            <span className="text-[11px]">Bộ lọc:</span>
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as 'all' | 'critical' | 'high' | 'medium' | 'low')}
            className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="all">Tất cả mức độ</option>
            <option value="critical">Khẩn cấp (Critical)</option>
            <option value="high">Cao (High)</option>
            <option value="medium">Trung bình (Medium)</option>
            <option value="low">Thấp (Low)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'investigating' | 'resolved' | 'dismissed')}
            className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang mở (Active)</option>
            <option value="investigating">Đang điều tra</option>
            <option value="resolved">Đã giải quyết</option>
            <option value="dismissed">Đã bỏ qua</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="all">Tất cả nhóm đe dọa</option>
            <option value="BRUTE_FORCE">Brute Force Login</option>
            <option value="SUSPICIOUS_LOGIN">Địa lý bất thường</option>
            <option value="SQLI_ATTEMPT">SQL Injection</option>
            <option value="RATE_LIMIT_SPIKE">Đột biến Rate Limit</option>
            <option value="TOKEN_HIJACK">Tái sử dụng Token</option>
          </select>

          {(searchQuery || severityFilter !== 'all' || statusFilter !== 'all' || categoryFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSeverityFilter('all');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline ml-auto"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Alerts List */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mb-4">
        <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-200 dark:divide-slate-700">
          {filteredAlerts.length === 0 ? (
            <div className="py-12 text-center p-4">
              <CheckCircle2 className="h-9 w-9 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Hệ thống an toàn - Không có cảnh báo phù hợp
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Tất cả các mối đe dọa đã được giải quyết hoặc không phát hiện bất thường.
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-750/60 cursor-pointer transition-colors ${
                  selectedAlert?.id === alert.id ? 'bg-rose-50/50 dark:bg-rose-950/20' : ''
                } ${alert.status === 'resolved' || alert.status === 'dismissed' ? 'opacity-70' : ''}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getSeverityStyle(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${getStatusBadge(alert.status)}`}>
                      {alert.status.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">#{alert.id}</span>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                      <span>Rủi ro: {alert.riskScore}/100</span>
                    </div>
                  </div>

                  <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {alert.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mb-1.5">
                    {alert.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3 text-slate-500" />
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                        {alert.sourceIp}
                      </span>
                      <span>({alert.location})</span>
                    </span>

                    {alert.targetAccount && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3 text-slate-500" />
                        <span className="text-slate-600 dark:text-slate-300">{alert.targetAccount}</span>
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span>{new Date(alert.timestamp).toLocaleTimeString('vi-VN')}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  {alert.status === 'active' && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBlockIp(alert.sourceIp);
                        }}
                        className="px-2 py-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900/60 transition-colors flex items-center gap-1"
                        title="Chặn IP ngay"
                      >
                        <Ban className="h-3 w-3" />
                        <span>Chặn IP</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResolve(alert.id);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Giải quyết</span>
                      </button>
                    </>
                  )}
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-850 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-100 dark:bg-rose-950/60 rounded-lg">
                  <ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Chi tiết Cảnh báo an ninh #{selectedAlert.id}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Phát hiện lúc {new Date(selectedAlert.timestamp).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 overflow-y-auto flex-1">
              <div className="p-4 rounded-xl bg-gradient-to-r from-rose-500/10 via-orange-500/10 to-amber-500/10 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase">
                    Điểm số Rủi ro Mối đe dọa
                  </span>
                  <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
                    {selectedAlert.riskScore} <span className="text-sm font-normal text-slate-500">/ 100</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getStatusBadge(selectedAlert.status)}`}>
                    {selectedAlert.status.toUpperCase()}
                  </span>
                  <span className={`ml-2 px-2.5 py-1 text-xs font-bold rounded-full border ${getSeverityStyle(selectedAlert.severity)}`}>
                    {selectedAlert.severity.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{selectedAlert.title}</h5>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  {selectedAlert.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">IP Nguồn & Địa phương</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {selectedAlert.sourceIp} ({selectedAlert.location})
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Endpoint Mục tiêu</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 break-all">
                    {selectedAlert.targetEndpoint}
                  </span>
                </div>
                {selectedAlert.targetAccount && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tài khoản nhắm tới</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedAlert.targetAccount}</span>
                  </div>
                )}
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Phân loại đe dọa</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedAlert.category}</span>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold text-xs mb-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Khuyến nghị phòng thủ từ AI Security:</span>
                </div>
                <p className="text-xs text-amber-900 dark:text-amber-200 leading-normal">
                  {selectedAlert.recommendation}
                </p>
              </div>

              {selectedAlert.resolvedAt && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                  Đã được giải quyết bởi <span className="font-bold">{selectedAlert.resolvedBy}</span> vào lúc{' '}
                  {new Date(selectedAlert.resolvedAt).toLocaleString('vi-VN')}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleBlockIp(selectedAlert.sourceIp)}
                  className="px-3 py-2 bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                >
                  <Ban className="h-3.5 w-3.5" />
                  <span>Chặn vĩnh viễn IP {selectedAlert.sourceIp}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {selectedAlert.status === 'active' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleInvestigate(selectedAlert.id)}
                      className="px-3 py-2 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold rounded-xl hover:bg-amber-200 dark:hover:bg-amber-900"
                    >
                      Bắt đầu điều tra
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDismiss(selectedAlert.id)}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      Bỏ qua
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResolve(selectedAlert.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                    >
                      Giải quyết cảnh báo
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedAlert(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-3 bg-slate-50 dark:bg-slate-750/40 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>
          ⚡ Hệ thống cảnh báo liên tục giám sát 24/7 theo mô hình Zero-Trust và MITRE ATT&CK Framework.
        </span>
        <span className="font-medium text-slate-700 dark:text-slate-300 shrink-0">
          Chặn tự động: {autoBlockHighRisk ? `Bật (Điểm > ${autoBlockThreshold})` : 'Tắt'}
        </span>
      </div>
    </div>
  );
}