'use client';

import { useState } from 'react';
import { CheckCircle, Crown, Info, Lock, RefreshCw, Unlock, Zap } from 'lucide-react';

interface FreemiumModelProps {
  onCancel?: () => void;
}

interface FeatureLimit {
  id: string;
  name: string;
  description: string;
  freeLimit: number;
  currentUsage: number;
  isUnlimitedForPremium: boolean;
  unit: string;
}

export default function FreemiumModel({ onCancel }: FreemiumModelProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isFreemiumEnabled, setIsFreemiumEnabled] = useState(true);

  const [featureLimits, setFeatureLimits] = useState<FeatureLimit[]>([
    { id: '1', name: 'Memories', description: 'Total memories created', freeLimit: 50, currentUsage: 42, isUnlimitedForPremium: true, unit: 'memories' },
    { id: '2', name: 'Storage', description: 'Storage space used', freeLimit: 2, currentUsage: 1.8, isUnlimitedForPremium: true, unit: 'GB' },
    { id: '3', name: 'Photos', description: 'Photos per memory', freeLimit: 10, currentUsage: 8, isUnlimitedForPremium: true, unit: 'photos' },
    { id: '4', name: 'Videos', description: 'Videos per memory', freeLimit: 1, currentUsage: 1, isUnlimitedForPremium: true, unit: 'video' },
    { id: '5', name: 'AI Features', description: 'AI-powered features', freeLimit: 5, currentUsage: 5, isUnlimitedForPremium: true, unit: 'uses/day' },
    { id: '6', name: 'Collaboration', description: 'Shared workspaces', freeLimit: 1, currentUsage: 1, isUnlimitedForPremium: true, unit: 'workspace' },
  ]);

  const updateUsage = (id: string, usage: number) => {
    setFeatureLimits(featureLimits.map(limit => 
      limit.id === id ? { ...limit, currentUsage: usage } : limit
    ));
  };

  const getUsagePercentage = (limit: FeatureLimit) => {
    return Math.min((limit.currentUsage / limit.freeLimit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const isAtLimit = (limit: FeatureLimit) => {
    return limit.currentUsage >= limit.freeLimit;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <Crown className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Freemium Model
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Free model with limitations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isFreemiumEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isFreemiumEnabled ? 'Enabled' : 'Disabled'}
          </span>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show details"
          >
            {showDetails ? <Info className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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

      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Features</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{featureLimits.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">At Limit</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{featureLimits.filter(f => isAtLimit(f)).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Near Limit</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{featureLimits.filter(f => getUsagePercentage(f) >= 70 && !isAtLimit(f)).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Safe</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{featureLimits.filter(f => getUsagePercentage(f) < 70).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isFreemiumEnabled}
              onChange={(e) => setIsFreemiumEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Freemium</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Zap className="h-3 w-3" />
            Upgrade to Premium
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Feature Limits</h4>
          <div className="space-y-3">
            {featureLimits.map((limit) => {
              const percentage = getUsagePercentage(limit);
              const atLimit = isAtLimit(limit);
              return (
                <div key={limit.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {atLimit ? <Lock className="h-4 w-4 text-red-500" /> : <Unlock className="h-4 w-4 text-green-500" />}
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{limit.name}</span>
                      {limit.isUnlimitedForPremium && (
                        <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          Unlimited for Premium
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {limit.currentUsage} / {limit.freeLimit} {limit.unit}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{limit.description}</p>
                  <div className="space-y-1">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${getUsageColor(percentage)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <input
                        type="range"
                        min="0"
                        max={limit.freeLimit}
                        value={limit.currentUsage}
                        onChange={(e) => updateUsage(limit.id, parseInt(e.target.value))}
                        className="w-32"
                      />
                      <span>{percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Free vs Premium Comparison</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <p className="text-xs font-semibold text-slate-900 dark:text-white mb-1">Free Plan</p>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <li>• 50 memories limit</li>
                <li>• 2GB storage</li>
                <li>• 5 AI uses/day</li>
                <li>• Basic features</li>
              </ul>
            </div>
            <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">Premium Plan</p>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <li>• Unlimited memories</li>
                <li>• 100GB storage</li>
                <li>• Unlimited AI</li>
                <li>• All features</li>
              </ul>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Freemium Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Freemium model allows users to try before buying</li>
              <li>• Limits encourage upgrade to premium</li>
              <li>• Premium users get unlimited access</li>
              <li>• Monitor usage to optimize conversion</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
