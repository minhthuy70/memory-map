'use client';

import { useState } from 'react';
import { EyeOff, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Shield, Hash, CreditCard, Mail, Phone, Eye, Lock, Plus, FileText } from 'lucide-react';

interface MaskingRule {
  id: string;
  fieldName: string;
  dataType: 'email' | 'phone' | 'credit-card' | 'ssn' | 'custom';
  maskingStrategy: 'full' | 'partial' | 'hash' | 'tokenize';
  enabled: boolean;
  pattern: string;
  preview: string;
}

interface DataMaskingProps {
  onCancel?: () => void;
  onToggleRule?: (ruleId: string, enabled: boolean) => Promise<void>;
  onUpdateRule?: (ruleId: string, strategy: MaskingRule['maskingStrategy']) => Promise<void>;
  onCreateRule?: (rule: MaskingRule) => Promise<void>;
}

const DEFAULT_RULES: MaskingRule[] = [
  {
    id: 'rule-1',
    fieldName: 'user_email',
    dataType: 'email',
    maskingStrategy: 'partial',
    enabled: true,
    pattern: '***@***.***',
    preview: 'j***@g***.com',
  },
  {
    id: 'rule-2',
    fieldName: 'user_phone',
    dataType: 'phone',
    maskingStrategy: 'partial',
    enabled: true,
    pattern: '***-***-****',
    preview: '***-***-1234',
  },
  {
    id: 'rule-3',
    fieldName: 'credit_card',
    dataType: 'credit-card',
    maskingStrategy: 'partial',
    enabled: true,
    pattern: '****-****-****-****',
    preview: '****-****-****-1234',
  },
  {
    id: 'rule-4',
    fieldName: 'ssn',
    dataType: 'ssn',
    maskingStrategy: 'full',
    enabled: true,
    pattern: '***-**-****',
    preview: '***-**-****',
  },
  {
    id: 'rule-5',
    fieldName: 'address',
    dataType: 'custom',
    maskingStrategy: 'partial',
    enabled: false,
    pattern: '*** Street, ***, ***',
    preview: '123 Street, City, State',
  },
];

export default function DataMasking({ onCancel, onToggleRule, onUpdateRule, onCreateRule }: DataMaskingProps) {
  const [rules, setRules] = useState<MaskingRule[]>(DEFAULT_RULES);
  const [showSettings, setShowSettings] = useState(false);
  const [showNewRule, setShowNewRule] = useState(false);
  const [selectedDataType, setSelectedDataType] = useState<'all' | 'email' | 'phone' | 'credit-card' | 'ssn' | 'custom'>('all');

  const handleToggle = async (ruleId: string, enabled: boolean) => {
    if (onToggleRule) {
      await onToggleRule(ruleId, enabled);
    }
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled } : rule
    ));
  };

  const handleUpdateStrategy = async (ruleId: string, strategy: MaskingRule['maskingStrategy']) => {
    if (onUpdateRule) {
      await onUpdateRule(ruleId, strategy);
    }
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, maskingStrategy: strategy } : rule
    ));
  };

  const getDataTypeIcon = (dataType: MaskingRule['dataType']) => {
    switch (dataType) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'credit-card':
        return <CreditCard className="h-4 w-4" />;
      case 'ssn':
        return <FileText className="h-4 w-4" />;
      case 'custom':
        return <Hash className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getStrategyLabel = (strategy: MaskingRule['maskingStrategy']) => {
    switch (strategy) {
      case 'full':
        return 'Full Mask';
      case 'partial':
        return 'Partial Mask';
      case 'hash':
        return 'Hash';
      case 'tokenize':
        return 'Tokenize';
      default:
        return strategy;
    }
  };

  const getStrategyColor = (strategy: MaskingRule['maskingStrategy']) => {
    switch (strategy) {
      case 'full':
        return 'from-red-400 to-rose-500';
      case 'partial':
        return 'from-amber-400 to-orange-500';
      case 'hash':
        return 'from-blue-400 to-cyan-500';
      case 'tokenize':
        return 'from-purple-400 to-pink-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const filteredRules = selectedDataType === 'all' 
    ? rules 
    : rules.filter(rule => rule.dataType === selectedDataType);

  const enabledRules = rules.filter(r => r.enabled).length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <EyeOff className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Che giấu dữ liệu
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {enabledRules}/{rules.length} rules enabled
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNewRule(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Tạo rule mới"
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
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt masking
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Mask in production logs
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Mask in development logs
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Mask in UI preview
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="mb-4">
        <select
          value={selectedDataType}
          onChange={(e) => setSelectedDataType(e.target.value as any)}
          className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
        >
          <option value="all">Tất cả data types</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="credit-card">Credit Card</option>
          <option value="ssn">SSN</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Masking Rules */}
      <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getDataTypeIcon(rule.dataType)}
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {rule.fieldName}
                </span>
                <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-600 rounded text-[10px] text-slate-600 dark:text-slate-400">
                  {rule.dataType}
                </span>
                {rule.enabled && (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
              </div>
              <button
                type="button"
                onClick={() => handleToggle(rule.id, !rule.enabled)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  rule.enabled ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    rule.enabled ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600 dark:text-slate-400">Strategy</span>
              <select
                value={rule.maskingStrategy}
                onChange={(e) => handleUpdateStrategy(rule.id, e.target.value as any)}
                className="px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="full">Full Mask</option>
                <option value="partial">Partial Mask</option>
                <option value="hash">Hash</option>
                <option value="tokenize">Tokenize</option>
              </select>
            </div>

            <div className="mb-2">
              <span className="text-xs text-slate-600 dark:text-slate-400">Pattern</span>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                  {rule.pattern}
                </code>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Eye className="h-3 w-3 text-slate-500" />
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Preview:</span>
              <code className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                {rule.preview}
              </code>
            </div>
          </div>
        ))}
      </div>

      {/* New Rule Form */}
      {showNewRule && (
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Tạo masking rule mới
          </h4>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Field name (snake_case)"
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
            <select className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none">
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="credit-card">Credit Card</option>
              <option value="ssn">SSN</option>
              <option value="custom">Custom</option>
            </select>
            <select className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none">
              <option value="full">Full Mask</option>
              <option value="partial">Partial Mask</option>
              <option value="hash">Hash</option>
              <option value="tokenize">Tokenize</option>
            </select>
            <input
              type="text"
              placeholder="Pattern (e.g., ***@***.***)"
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowNewRule(false)}
                className="flex-1 px-3 py-2 bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => setShowNewRule(false)}
                className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> Che giấu dữ liệu bảo vệ thông tin nhạy cảm với field-level masking strategies (full/partial/hash/tokenize).
        </p>
      </div>
    </div>
  );
}