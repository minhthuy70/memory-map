'use client';

import { useState } from 'react';
import { ShieldCheck, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Eye, EyeOff, Globe, Download, Trash2, Clock, FileText, User, Lock } from 'lucide-react';

interface PrivacySetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'data-collection' | 'data-sharing' | 'data-processing' | 'data-storage';
  lastUpdated: Date;
}

interface ConsentRecord {
  id: string;
  category: string;
  version: string;
  consentGiven: boolean;
  consentDate: Date;
  ipAddress: string;
  userAgent: string;
}

interface PrivacyControlsProps {
  onCancel?: () => void;
  onUpdateSetting?: (settingId: string, enabled: boolean) => Promise<void>;
  onExportData?: () => Promise<void>;
  onDeleteData?: () => Promise<void>;
  onRefreshConsents?: () => Promise<ConsentRecord[]>;
}

const DEFAULT_SETTINGS: PrivacySetting[] = [
  {
    id: 'setting-1',
    name: 'Analytics Tracking',
    description: 'Cho phép theo dõi hành vi người dùng để cải thiện trải nghiệm',
    enabled: true,
    category: 'data-collection',
    lastUpdated: new Date(Date.now() - 86400000 * 7),
  },
  {
    id: 'setting-2',
    name: 'Personalized Ads',
    description: 'Cho phép hiển thị quảng cáo được cá nhân hóa',
    enabled: false,
    category: 'data-processing',
    lastUpdated: new Date(Date.now() - 86400000 * 14),
  },
  {
    id: 'setting-3',
    name: 'Location Services',
    description: 'Cho phép sử dụng vị trí cho các tính năng bản đồ',
    enabled: true,
    category: 'data-collection',
    lastUpdated: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: 'setting-4',
    name: 'Data Sharing',
    description: 'Cho phép chia sẻ dữ liệu với đối tác third-party',
    enabled: false,
    category: 'data-sharing',
    lastUpdated: new Date(Date.now() - 86400000 * 30),
  },
  {
    id: 'setting-5',
    name: 'Cloud Backup',
    description: 'Cho phép sao lưu dữ liệu lên cloud',
    enabled: true,
    category: 'data-storage',
    lastUpdated: new Date(Date.now() - 86400000 * 10),
  },
  {
    id: 'setting-6',
    name: 'AI Processing',
    description: 'Cho phép xử lý dữ liệu bằng AI để gợi ý và phân tích',
    enabled: true,
    category: 'data-processing',
    lastUpdated: new Date(Date.now() - 86400000 * 5),
  },
];

const DEFAULT_CONSENTS: ConsentRecord[] = [
  {
    id: 'consent-1',
    category: 'Essential',
    version: '1.0',
    consentGiven: true,
    consentDate: new Date(Date.now() - 86400000 * 90),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
  },
  {
    id: 'consent-2',
    category: 'Analytics',
    version: '2.0',
    consentGiven: true,
    consentDate: new Date(Date.now() - 86400000 * 30),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
  },
  {
    id: 'consent-3',
    category: 'Marketing',
    version: '1.5',
    consentGiven: false,
    consentDate: new Date(Date.now() - 86400000 * 30),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
  },
];

export default function PrivacyControls({ onCancel, onUpdateSetting, onExportData, onDeleteData, onRefreshConsents }: PrivacyControlsProps) {
  const [settings, setSettings] = useState<PrivacySetting[]>(DEFAULT_SETTINGS);
  const [consents, setConsents] = useState<ConsentRecord[]>(DEFAULT_CONSENTS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'data-collection' | 'data-sharing' | 'data-processing' | 'data-storage'>('all');
  const [showDataManagement, setShowDataManagement] = useState(false);

  const handleUpdateSetting = async (settingId: string, enabled: boolean) => {
    if (onUpdateSetting) {
      await onUpdateSetting(settingId, enabled);
    }
    setSettings(prev => prev.map(setting => 
      setting.id === settingId ? { ...setting, enabled, lastUpdated: new Date() } : setting
    ));
  };

  const handleExportData = async () => {
    if (onExportData) {
      await onExportData();
    } else {
      console.log('Exporting user data...');
    }
  };

  const handleDeleteData = async () => {
    if (onDeleteData) {
      await onDeleteData();
    } else {
      console.log('Deleting user data...');
    }
  };

  const getCategoryIcon = (category: PrivacySetting['category']) => {
    switch (category) {
      case 'data-collection':
        return <Eye className="h-4 w-4" />;
      case 'data-sharing':
        return <Globe className="h-4 w-4" />;
      case 'data-processing':
        return <FileText className="h-4 w-4" />;
      case 'data-storage':
        return <Download className="h-4 w-4" />;
      default:
        return <ShieldCheck className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: PrivacySetting['category']) => {
    switch (category) {
      case 'data-collection':
        return 'Data Collection';
      case 'data-sharing':
        return 'Data Sharing';
      case 'data-processing':
        return 'Data Processing';
      case 'data-storage':
        return 'Data Storage';
      default:
        return category;
    }
  };

  const filteredSettings = selectedCategory === 'all' 
    ? settings 
    : settings.filter(setting => setting.category === selectedCategory);

  const enabledSettings = settings.filter(s => s.enabled).length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Kiểm soát quyền riêng tư
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {enabledSettings}/{settings.length} enabled
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDataManagement(!showDataManagement)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Quản lý dữ liệu"
          >
            <User className="h-4 w-4 text-slate-500" />
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
            Cài đặt privacy
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Consent version
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">2.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Cookie policy
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                CCPA compliant
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Yes</span>
            </div>
          </div>
        </div>
      )}

      {/* Data Management */}
      {showDataManagement && (
        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Quản lý dữ liệu
          </h4>
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleExportData}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              Export dữ liệu cá nhân
            </button>
            <button
              type="button"
              onClick={handleDeleteData}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Xóa dữ liệu cá nhân
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as any)}
          className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
        >
          <option value="all">Tất cả categories</option>
          <option value="data-collection">Data Collection</option>
          <option value="data-sharing">Data Sharing</option>
          <option value="data-processing">Data Processing</option>
          <option value="data-storage">Data Storage</option>
        </select>
      </div>

      {/* Privacy Settings */}
      <div className="space-y-2 mb-4">
        {filteredSettings.map((setting) => (
          <div
            key={setting.id}
            className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getCategoryIcon(setting.category)}
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {setting.name}
                </span>
                <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-600 rounded text-[10px] text-slate-600 dark:text-slate-400">
                  {getCategoryLabel(setting.category)}
                </span>
                {setting.enabled && (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
              </div>
              <button
                type="button"
                onClick={() => handleUpdateSetting(setting.id, !setting.enabled)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  setting.enabled ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    setting.enabled ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
              {setting.description}
            </p>

            <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
              <Clock className="h-3 w-3" />
              <span>Last updated: {new Date(setting.lastUpdated).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Consent Records */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Lịch sử consent
        </h4>
        <div className="space-y-2">
          {consents.map((consent) => (
            <div
              key={consent.id}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {consent.category}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    v{consent.version}
                  </span>
                  {consent.consentGiven ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <EyeOff className="h-3 w-3 text-red-500" />
                  )}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  consent.consentGiven 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}>
                  {consent.consentGiven ? 'Consented' : 'Denied'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3" />
                <span>{new Date(consent.consentDate).toLocaleString('vi-VN')}</span>
                <span>•</span>
                <FileText className="h-3 w-3" />
                <span>{consent.ipAddress}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg">
        <p className="text-[10px] text-orange-700 dark:text-orange-400">
          <strong>Lưu ý:</strong> Kiểm soát quyền riêng tư cho phép người dùng quản lý data collection, sharing, processing, và storage preferences với consent tracking.
        </p>
      </div>
    </div>
  );
}