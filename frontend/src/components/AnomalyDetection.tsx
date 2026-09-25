'use client';

import { useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  CheckCircle2,
  Clock,
  Filter,
  Settings,
  Shield,
  TrendingUp,
  Zap
} from 'lucide-react';

interface Anomaly {
  id: string;
  type: 'spike' | 'drop' | 'pattern' | 'outlier';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: Date;
  value: number;
  expected: number;
  confidence: number;
  status: 'pending' | 'investigating' | 'resolved' | 'false_positive';
}

interface AnomalyRule {
  id: string;
  name: string;
  type: 'threshold' | 'statistical' | 'ml';
  enabled: boolean;
  sensitivity: number;
}

interface AnomalyDetectionProps {
  onCancel?: () => void;
  onScanAnomalies?: () => Promise<void>;
}

const DEFAULT_ANOMALIES: Anomaly[] = [
  {
    id: 'anomaly-1',
    type: 'spike',
    severity: 'high',
    description: 'Unusual spike in memory creation on 2024-01-15',
    detectedAt: new Date('2024-01-15'),
    value: 45,
    expected: 18,
    confidence: 0.92,
    status: 'investigating',
  },
  {
    id: 'anomaly-2',
    type: 'drop',
    severity: 'medium',
    description: 'Significant drop in activity during holiday period',
    detectedAt: new Date('2024-01-10'),
    value: 5,
    expected: 15,
    confidence: 0.78,
    status: 'resolved',
  },
  {
    id: 'anomaly-3',
    type: 'pattern',
    severity: 'low',
    description: 'Unusual time pattern detected',
    detectedAt: new Date('2024-01-05'),
    value: 0.35,
    expected: 0.65,
    confidence: 0.65,
    status: 'false_positive',
  },
];

const DEFAULT_RULES: AnomalyRule[] = [
  {
    id: 'rule-1',
    name: 'Memory Count Threshold',
    type: 'threshold',
    enabled: true,
    sensitivity: 0.8,
  },
  {
    id: 'rule-2',
    name: 'Statistical Deviation',
    type: 'statistical',
    enabled: true,
    sensitivity: 0.7,
  },
  {
    id: 'rule-3',
    name: 'ML-Based Detection',
    type: 'ml',
    enabled: true,
    sensitivity: 0.9,
  },
];

export default function AnomalyDetection({ onCancel, onScanAnomalies }: AnomalyDetectionProps) {
  const [anomalies, setAnomalies] = useState<Anomaly[]>(DEFAULT_ANOMALIES);
  const [rules, setRules] = useState<AnomalyRule[]>(DEFAULT_RULES);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [autoScan, setAutoScan] = useState(true);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'spike':
        return <TrendingUp className="h-4 w-4" />;
      case 'drop':
        return <TrendingUp className="h-4 w-4 rotate-180" />;
      case 'pattern':
        return <Activity className="h-4 w-4" />;
      case 'outlier':
        return <AlertOctagon className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-blue-500';
      default:
        return 'text-slate-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'text-green-500';
      case 'false_positive':
        return 'text-slate-500';
      case 'investigating':
        return 'text-yellow-500';
      default:
        return 'text-blue-500';
    }
  };

  const handleResolve = (id: string) => {
    setAnomalies(anomalies.map(a => 
      a.id === id ? { ...a, status: 'resolved' as const } : a
    ));
  };

  const handleFalsePositive = (id: string) => {
    setAnomalies(anomalies.map(a => 
      a.id === id ? { ...a, status: 'false_positive' as const } : a
    ));
  };

  const filteredAnomalies = anomalies.filter(a => 
    selectedSeverity === 'all' || a.severity === selectedSeverity
  );

  const criticalCount = anomalies.filter(a => a.severity === 'critical').length;
  const highCount = anomalies.filter(a => a.severity === 'high').length;
  const avgConfidence = anomalies.reduce((sum, a) => sum + a.confidence, 0) / anomalies.length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl">
            <AlertCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Phát hiện bất thường
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {anomalies.length} anomalies detected
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
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt anomaly detection
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-scan
              </span>
              <button
                type="button"
                onClick={() => setAutoScan(!autoScan)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoScan ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoScan ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Threshold rule
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Statistical rule
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
            <AlertCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {anomalies.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Critical</span>
          </div>
          <div className="text-lg font-bold text-red-600">
            {criticalCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">High</span>
          </div>
          <div className="text-lg font-bold text-red-500">
            {highCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Confidence</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(avgConfidence * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Severity Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedSeverity('all')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedSeverity === 'all'
                ? 'bg-red-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedSeverity('critical')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedSeverity === 'critical'
                ? 'bg-red-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Critical
          </button>
          <button
            type="button"
            onClick={() => setSelectedSeverity('high')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedSeverity === 'high'
                ? 'bg-red-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            High
          </button>
          <button
            type="button"
            onClick={() => setSelectedSeverity('medium')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedSeverity === 'medium'
                ? 'bg-red-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Medium
          </button>
        </div>
      </div>

      {/* Anomalies */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Detected Anomalies
        </h4>
        <div className="space-y-2">
          {filteredAnomalies.map((anomaly) => (
            <div
              key={anomaly.id}
              className={`p-4 rounded-lg border-2 ${
                anomaly.severity === 'critical'
                  ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
                  : anomaly.severity === 'high'
                  ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getSeverityColor(anomaly.severity)}`}>
                    {getTypeIcon(anomaly.type)}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                      {anomaly.type}
                    </span>
                    <div className={`text-xs ${getSeverityColor(anomaly.severity)} capitalize`}>
                      {anomaly.severity}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3 text-slate-500" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {(anomaly.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {anomaly.description}
              </p>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Value</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {anomaly.value}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Expected</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {anomaly.expected}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Status</div>
                  <div className={`text-xs font-semibold ${getStatusColor(anomaly.status)} capitalize`}>
                    {anomaly.status.replace('_', ' ')}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-2">
                Detected: {anomaly.detectedAt.toLocaleDateString('vi-VN')}
              </div>

              {anomaly.status === 'pending' || anomaly.status === 'investigating' ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleResolve(anomaly.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Resolve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFalsePositive(anomaly.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-500 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    False Positive
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Detection Rules */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Detection Rules
        </h4>
        <div className="space-y-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {rule.name}
                  </span>
                </div>
                <span className={`text-xs font-semibold ${rule.enabled ? 'text-green-500' : 'text-slate-500'}`}>
                  {rule.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Type</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 capitalize">
                    {rule.type}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Sensitivity</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {(rule.sensitivity * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
        <p className="text-[10px] text-red-700 dark:text-red-400">
          <strong>Lưu ý:</strong> Phát hiện bất thường xác định các mẫu bất thường trong dữ liệu kỷ niệm với threshold rules, statistical analysis, ML-based detection, và severity classification.
        </p>
      </div>
    </div>
  );
}