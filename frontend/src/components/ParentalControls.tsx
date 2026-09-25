'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Ban,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Filter,
  Lock,
  MapPin,
  MessageSquare,
  Settings,
  Shield,
  ShoppingBag,
  Smartphone,
  Zap
} from 'lucide-react';

interface ControlRule {
  id: string;
  name: string;
  type: 'content_filter' | 'app_block' | 'time_limit' | 'location' | 'purchase' | 'communication';
  enabled: boolean;
  description: string;
}

interface ContentFilter {
  id: string;
  category: string;
  level: 'allow' | 'block' | 'limit';
  description: string;
}

interface BlockedItem {
  id: string;
  name: string;
  type: 'app' | 'website' | 'content';
  blockedAt: Date;
}

interface ParentalControlsProps {
  onCancel?: () => void;
  onUpdateRule?: (ruleId: string, enabled: boolean) => Promise<void>;
}

const DEFAULT_RULES: ControlRule[] = [
  {
    id: 'rule-1',
    name: 'Content Filtering',
    type: 'content_filter',
    enabled: true,
    description: 'Filter inappropriate content',
  },
  {
    id: 'rule-2',
    name: 'App Blocking',
    type: 'app_block',
    enabled: true,
    description: 'Block specific apps',
  },
  {
    id: 'rule-3',
    name: 'Screen Time Limits',
    type: 'time_limit',
    enabled: true,
    description: 'Limit daily screen time',
  },
  {
    id: 'rule-4',
    name: 'Location Tracking',
    type: 'location',
    enabled: true,
    description: 'Track child location',
  },
  {
    id: 'rule-5',
    name: 'Purchase Restrictions',
    type: 'purchase',
    enabled: true,
    description: 'Block in-app purchases',
  },
  {
    id: 'rule-6',
    name: 'Communication Controls',
    type: 'communication',
    enabled: true,
    description: 'Control who they can contact',
  },
];

const DEFAULT_FILTERS: ContentFilter[] = [
  {
    id: 'filter-1',
    category: 'Violence',
    level: 'block',
    description: 'Block violent content',
  },
  {
    id: 'filter-2',
    category: 'Adult Content',
    level: 'block',
    description: 'Block adult content',
  },
  {
    id: 'filter-3',
    category: 'Social Media',
    level: 'limit',
    description: 'Limit social media access',
  },
  {
    id: 'filter-4',
    category: 'Games',
    level: 'allow',
    description: 'Allow age-appropriate games',
  },
];

const DEFAULT_BLOCKED: BlockedItem[] = [
  {
    id: 'blocked-1',
    name: 'Inappropriate Site',
    type: 'website',
    blockedAt: new Date('2024-01-12'),
  },
  {
    id: 'blocked-2',
    name: 'Unapproved App',
    type: 'app',
    blockedAt: new Date('2024-01-10'),
  },
];

export default function ParentalControls({ onCancel, onUpdateRule }: ParentalControlsProps) {
  const [rules, setRules] = useState<ControlRule[]>(DEFAULT_RULES);
  const [filters, setFilters] = useState<ContentFilter[]>(DEFAULT_FILTERS);
  const [blockedItems, setBlockedItems] = useState<BlockedItem[]>(DEFAULT_BLOCKED);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [alertOnViolation, setAlertOnViolation] = useState(true);

  const enabledRules = rules.filter(r => r.enabled).length;
  const totalFilters = filters.length;
  const blockedCount = blockedItems.length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'content_filter':
        return <Shield className="h-4 w-4" />;
      case 'app_block':
        return <Ban className="h-4 w-4" />;
      case 'time_limit':
        return <Clock className="h-4 w-4" />;
      case 'location':
        return <MapPin className="h-4 w-4" />;
      case 'purchase':
        return <ShoppingBag className="h-4 w-4" />;
      case 'communication':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'allow':
        return 'text-green-500';
      case 'block':
        return 'text-red-500';
      case 'limit':
        return 'text-yellow-500';
      default:
        return 'text-slate-500';
    }
  };

  const handleToggleRule = async (ruleId: string) => {
    await onUpdateRule?.(ruleId, !rules.find(r => r.id === ruleId)?.enabled);
    setRules(rules.map(r => 
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const handleUpdateFilterLevel = (filterId: string, level: 'allow' | 'block' | 'limit') => {
    setFilters(filters.map(f => 
      f.id === filterId ? { ...f, level } : f
    ));
  };

  const filteredRules = selectedType === 'all'
    ? rules
    : rules.filter(r => r.type === selectedType);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Kiểm soát phụ huynh
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {enabledRules} rules active
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
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt parental controls
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Alert on violation
              </span>
              <button
                type="button"
                onClick={() => setAlertOnViolation(!alertOnViolation)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  alertOnViolation ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    alertOnViolation ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-block detected violations
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Weekly reports
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Active Rules</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {enabledRules}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Filter className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Filters</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalFilters}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Ban className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Blocked</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {blockedCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Alerts</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {alertOnViolation ? 'On' : 'Off'}
          </div>
        </div>
      </div>

      {/* Type Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedType('all')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'all'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('content_filter')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'content_filter'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Content
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('app_block')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'app_block'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Apps
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('time_limit')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'time_limit'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Time
          </button>
        </div>
      </div>

      {/* Control Rules */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Control Rules
        </h4>
        <div className="space-y-2">
          {filteredRules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-lg border-2 ${
                rule.enabled
                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${rule.enabled ? 'text-green-500' : 'text-slate-500'}`}>
                    {getTypeIcon(rule.type)}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {rule.name}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {rule.type.replace('_', ' ')}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleRule(rule.id)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    rule.enabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      rule.enabled ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                {rule.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Content Filters */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Content Filters
        </h4>
        <div className="space-y-2">
          {filters.map((filter) => (
            <div
              key={filter.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {filter.category}
                  </span>
                </div>
                <select
                  value={filter.level}
                  onChange={(e) => handleUpdateFilterLevel(filter.id, e.target.value as any)}
                  className="px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="allow">Allow</option>
                  <option value="limit">Limit</option>
                  <option value="block">Block</option>
                </select>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {filter.description}
              </p>

              <div className={`text-xs font-semibold ${getLevelColor(filter.level)} capitalize`}>
                {filter.level}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blocked Items */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Recently Blocked
        </h4>
        <div className="space-y-2">
          {blockedItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg border-2 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Ban className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {item.type}
                </span>
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Blocked: {item.blockedAt.toLocaleDateString('vi-VN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> Kiểm soát phụ huynh cho phép quản lý quyền truy cập và hoạt động của tài khoản trẻ em với content filtering, app blocking, screen time limits, location tracking, purchase restrictions, và communication controls.
        </p>
      </div>
    </div>
  );
}