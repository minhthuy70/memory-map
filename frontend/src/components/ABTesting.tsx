'use client';

import { useState } from 'react';
import { GitCompare, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Play, Pause, Trophy, TrendingUp, Users, Target, Plus, BarChart } from 'lucide-react';

interface Variant {
  id: string;
  name: string;
  description: string;
  traffic: number;
  conversions: number;
  visitors: number;
  conversionRate: number;
  isWinner: boolean;
}

interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'paused' | 'completed';
  startDate: Date;
  endDate: Date | null;
  targetMetric: string;
  variants: Variant[];
  statisticalSignificance: number;
  winner: string | null;
}

interface ABTestingProps {
  onCancel?: () => void;
  onCreateTest?: (test: ABTest) => Promise<void>;
  onStopTest?: (testId: string) => Promise<void>;
  onDeclareWinner?: (testId: string, variantId: string) => Promise<void>;
}

const DEFAULT_TESTS: ABTest[] = [
  {
    id: 'test-1',
    name: 'CTA Button Color',
    description: 'Test màu nút CTA: xanh vs đỏ',
    status: 'running',
    startDate: new Date(Date.now() - 86400000 * 7),
    endDate: null,
    targetMetric: 'conversion_rate',
    variants: [
      {
        id: 'variant-1',
        name: 'Control (Blue)',
        description: 'Nút CTA màu xanh như hiện tại',
        traffic: 50,
        conversions: 245,
        visitors: 1250,
        conversionRate: 19.6,
        isWinner: false,
      },
      {
        id: 'variant-2',
        name: 'Variant (Red)',
        description: 'Nút CTA màu đỏ',
        traffic: 50,
        conversions: 289,
        visitors: 1250,
        conversionRate: 23.1,
        isWinner: true,
      },
    ],
    statisticalSignificance: 95,
    winner: 'variant-2',
  },
  {
    id: 'test-2',
    name: 'Hero Layout',
    description: 'Test layout hero: single vs two-column',
    status: 'running',
    startDate: new Date(Date.now() - 86400000 * 3),
    endDate: null,
    targetMetric: 'engagement_time',
    variants: [
      {
        id: 'variant-1',
        name: 'Single Column',
        description: 'Layout single column',
        traffic: 50,
        conversions: 189,
        visitors: 890,
        conversionRate: 21.2,
        isWinner: false,
      },
      {
        id: 'variant-2',
        name: 'Two Column',
        description: 'Layout hai cột',
        traffic: 50,
        conversions: 201,
        visitors: 890,
        conversionRate: 22.6,
        isWinner: false,
      },
    ],
    statisticalSignificance: 78,
    winner: null,
  },
  {
    id: 'test-3',
    name: 'Form Length',
    description: 'Test độ dài form: short vs long',
    status: 'completed',
    startDate: new Date(Date.now() - 86400000 * 14),
    endDate: new Date(Date.now() - 86400000 * 7),
    targetMetric: 'form_completion',
    variants: [
      {
        id: 'variant-1',
        name: 'Short Form',
        description: 'Form ngắn với 3 fields',
        traffic: 50,
        conversions: 345,
        visitors: 1560,
        conversionRate: 22.1,
        isWinner: true,
      },
      {
        id: 'variant-2',
        name: 'Long Form',
        description: 'Form dài với 7 fields',
        traffic: 50,
        conversions: 289,
        visitors: 1560,
        conversionRate: 18.5,
        isWinner: false,
      },
    ],
    statisticalSignificance: 99,
    winner: 'variant-1',
  },
];

export default function ABTesting({ onCancel, onCreateTest, onStopTest, onDeclareWinner }: ABTestingProps) {
  const [tests, setTests] = useState<ABTest[]>(DEFAULT_TESTS);
  const [showSettings, setShowSettings] = useState(false);
  const [showNewTest, setShowNewTest] = useState(false);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);

  const handleStopTest = async (testId: string) => {
    if (onStopTest) {
      await onStopTest(testId);
    }
    setTests(prev => prev.map(test => 
      test.id === testId 
        ? { ...test, status: 'completed' as const, endDate: new Date() }
        : test
    ));
  };

  const handleDeclareWinner = async (testId: string, variantId: string) => {
    if (onDeclareWinner) {
      await onDeclareWinner(testId, variantId);
    }
    setTests(prev => prev.map(test => 
      test.id === testId 
        ? { 
            ...test, 
            winner: variantId,
            variants: test.variants.map(v => ({
              ...v,
              isWinner: v.id === variantId
            }))
          }
        : test
    ));
  };

  const getStatusColor = (status: ABTest['status']) => {
    switch (status) {
      case 'running':
        return 'from-green-400 to-emerald-500';
      case 'paused':
        return 'from-amber-400 to-orange-500';
      case 'completed':
        return 'from-blue-400 to-cyan-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getStatusLabel = (status: ABTest['status']) => {
    switch (status) {
      case 'running':
        return 'Running';
      case 'paused':
        return 'Paused';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const getImprovement = (variants: Variant[]) => {
    if (variants.length < 2) return 0;
    const sorted = [...variants].sort((a, b) => b.conversionRate - a.conversionRate);
    const improvement = ((sorted[0].conversionRate - sorted[1].conversionRate) / sorted[1].conversionRate) * 100;
    return improvement;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <GitCompare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Thử nghiệm A/B
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tests.length} tests • {tests.filter(t => t.status === 'running').length} running
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNewTest(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Tạo test mới"
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
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt A/B testing
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Statistical significance
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">95%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Minimum sample size
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">1000 visitors</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-stop on winner
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Tests List */}
      <div className="space-y-3 mb-4">
        {tests.map((test) => (
          <div
            key={test.id}
            className="p-4 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GitCompare className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {test.name}
                </span>
                <span className={`px-2 py-0.5 bg-gradient-to-r ${getStatusColor(test.status)} text-white text-[10px] font-bold rounded-full`}>
                  {getStatusLabel(test.status)}
                </span>
                {test.winner && (
                  <Trophy className="h-3 w-3 text-amber-500" />
                )}
              </div>
              {test.status === 'running' && (
                <button
                  type="button"
                  onClick={() => handleStopTest(test.id)}
                  className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Stop
                </button>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              {test.description}
            </p>

            {/* Variants */}
            <div className="space-y-2 mb-3">
              {test.variants.map((variant) => (
                <div
                  key={variant.id}
                  className={`p-3 rounded-lg border-2 ${
                    variant.isWinner 
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700'
                      : 'bg-slate-100 dark:bg-slate-600/50 border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {variant.isWinner && (
                        <Trophy className="h-3 w-3 text-amber-500" />
                      )}
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {variant.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {variant.conversionRate.toFixed(1)}%
                      </span>
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Traffic</div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {variant.traffic}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Visitors</div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {variant.visitors.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Conversions</div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {variant.conversions}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  <span>Target: {test.targetMetric}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart className="h-3 w-3" />
                  <span>Significance: {test.statisticalSignificance}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Improvement: {getImprovement(test.variants).toFixed(1)}%</span>
                </div>
              </div>
              {!test.winner && test.status === 'running' && (
                <button
                  type="button"
                  onClick={() => {
                    const bestVariant = test.variants.reduce((best, current) => 
                      current.conversionRate > best.conversionRate ? current : best
                    );
                    handleDeclareWinner(test.id, bestVariant.id);
                  }}
                  className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Declare Winner
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Test Button */}
      {showNewTest && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Tạo test mới
          </h4>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Tên test"
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
            <textarea
              placeholder="Mô tả test"
              rows={2}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
            />
            <select className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none">
              <option>conversion_rate</option>
              <option>engagement_time</option>
              <option>form_completion</option>
              <option>click_through_rate</option>
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowNewTest(false)}
                className="flex-1 px-3 py-2 bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => setShowNewTest(false)}
                className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-[10px] text-green-700 dark:text-green-400">
          <strong>Lưu ý:</strong> Thử nghiệm A/B cho phép test các biến thể UI/UX khác nhau với statistical analysis và automatic winner declaration.
        </p>
      </div>
    </div>
  );
}