'use client';

import { useState } from 'react';
import { Coins, X, RefreshCw, Info, CheckCircle, Star, Zap, Gift, TrendingUp, Award } from 'lucide-react';

interface TokenRewardsProps {
  onCancel?: () => void;
}

interface RewardCriteria {
  id: string;
  name: string;
  description: string;
  tokensPerAction: number;
  isEnabled: boolean;
  maxDaily: number;
}

interface TokenBalance {
  userId: string;
  userName: string;
  balance: number;
  earned: number;
  redeemed: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface RewardHistory {
  id: string;
  userId: string;
  userName: string;
  action: string;
  tokens: number;
  timestamp: string;
}

export default function TokenRewards({ onCancel }: TokenRewardsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isTokenRewardsEnabled, setIsTokenRewardsEnabled] = useState(true);

  const [rewardCriteria, setRewardCriteria] = useState<RewardCriteria[]>([
    { id: '1', name: 'Create Memory', description: 'Reward for creating new memories', tokensPerAction: 10, isEnabled: true, maxDaily: 100 },
    { id: '2', name: 'Upload Photo', description: 'Reward for uploading photos', tokensPerAction: 5, isEnabled: true, maxDaily: 50 },
    { id: '3', name: 'Share Memory', description: 'Reward for sharing memories', tokensPerAction: 3, isEnabled: true, maxDaily: 30 },
    { id: '4', name: 'Comment', description: 'Reward for commenting', tokensPerAction: 2, isEnabled: true, maxDaily: 20 },
    { id: '5', name: 'Daily Login', description: 'Reward for daily login', tokensPerAction: 5, isEnabled: true, maxDaily: 5 },
  ]);

  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([
    { userId: 'user1', userName: 'John Doe', balance: 1250, earned: 2000, redeemed: 750, tier: 'gold' },
    { userId: 'user2', userName: 'Jane Smith', balance: 850, earned: 1500, redeemed: 650, tier: 'silver' },
    { userId: 'user3', userName: 'Mike Johnson', balance: 3200, earned: 5000, redeemed: 1800, tier: 'platinum' },
    { userId: 'user4', userName: 'Sarah Wilson', balance: 150, earned: 200, redeemed: 50, tier: 'bronze' },
  ]);

  const [rewardHistory, setRewardHistory] = useState<RewardHistory[]>([
    { id: '1', userId: 'user1', userName: 'John Doe', action: 'Create Memory', tokens: 10, timestamp: '2024-01-15 10:30' },
    { id: '2', userId: 'user2', userName: 'Jane Smith', action: 'Upload Photo', tokens: 5, timestamp: '2024-01-15 11:45' },
    { id: '3', userId: 'user3', userName: 'Mike Johnson', action: 'Share Memory', tokens: 3, timestamp: '2024-01-15 14:20' },
    { id: '4', userId: 'user4', userName: 'Sarah Wilson', action: 'Daily Login', tokens: 5, timestamp: '2024-01-15 15:30' },
  ]);

  const toggleCriteria = (id: string) => {
    setRewardCriteria(rewardCriteria.map(criteria => 
      criteria.id === id ? { ...criteria, isEnabled: !criteria.isEnabled } : criteria
    ));
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'gold': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'silver': return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
      case 'bronze': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const redeemTokens = (userId: string, amount: number) => {
    setTokenBalances(tokenBalances.map(balance => 
      balance.userId === userId 
        ? { ...balance, balance: balance.balance - amount, redeemed: balance.redeemed + amount }
        : balance
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl">
            <Coins className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Token Rewards
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reward tokens for active users
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isTokenRewardsEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isTokenRewardsEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Earned</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{tokenBalances.reduce((acc, b) => acc + b.earned, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Redeemed</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{tokenBalances.reduce((acc, b) => acc + b.redeemed, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Users</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{tokenBalances.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Criteria</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{rewardCriteria.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isTokenRewardsEnabled}
              onChange={(e) => setIsTokenRewardsEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Token Rewards</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Gift className="h-3 w-3" />
            Add Reward Criteria
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Reward Criteria</h4>
          <div className="space-y-2">
            {rewardCriteria.map((criteria) => (
              <div key={criteria.id} className={`p-3 rounded-lg border ${criteria.isEnabled ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Coins className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{criteria.name}</span>
                        {criteria.isEnabled && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{criteria.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{criteria.tokensPerAction} tokens</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Max: {criteria.maxDaily}/day</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCriteria(criteria.id)}
                  className={`px-2 py-1 rounded text-xs ${criteria.isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                >
                  {criteria.isEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">User Token Balances</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {tokenBalances.map((balance) => (
              <div key={balance.userId} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{balance.userName}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getTierColor(balance.tier)}`}>
                          {balance.tier}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Earned: {balance.earned} • Redeemed: {balance.redeemed}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-yellow-600 dark:text-yellow-400">{balance.balance} tokens</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Available</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => redeemTokens(balance.userId, 100)}
                    className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white"
                  >
                    Redeem 100
                  </button>
                  <button
                    type="button"
                    onClick={() => redeemTokens(balance.userId, 500)}
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Redeem 500
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Recent Rewards</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {rewardHistory.map((history) => (
              <div key={history.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{history.userName}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{history.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-yellow-600 dark:text-yellow-400">+{history.tokens} tokens</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{history.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Token Rewards Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Tokens awarded for user engagement actions</li>
              <li>• Multiple reward criteria with configurable token amounts</li>
              <li>• Tier system: Bronze, Silver, Gold, Platinum</li>
              <li>• Tokens can be redeemed for premium features</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
