'use client';

import { useState } from 'react';
import {
  Award,
  CheckCircle,
  Info,
  Lock,
  RefreshCw,
  Star,
  TrendingUp,
  Unlock,
  Wallet,
  Zap
} from 'lucide-react';

interface DeFiStakingProps {
  onCancel?: () => void;
}

interface StakingPool {
  id: string;
  name: string;
  tokenSymbol: string;
  apy: number;
  lockPeriod: number;
  minStake: number;
  totalStaked: number;
  isEnabled: boolean;
}

interface UserStake {
  id: string;
  userId: string;
  userName: string;
  poolId: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'withdrawn';
  rewards: number;
}

export default function DeFiStaking({ onCancel }: DeFiStakingProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isStakingEnabled, setIsStakingEnabled] = useState(true);

  const [stakingPools, setStakingPools] = useState<StakingPool[]>([
    { id: '1', name: 'Basic Plan Pool', tokenSymbol: 'MMT', apy: 10, lockPeriod: 30, minStake: 1000, totalStaked: 50000, isEnabled: true },
    { id: '2', name: 'Pro Plan Pool', tokenSymbol: 'MMT', apy: 15, lockPeriod: 60, minStake: 2000, totalStaked: 35000, isEnabled: true },
    { id: '3', name: 'Family Plan Pool', tokenSymbol: 'MMT', apy: 20, lockPeriod: 90, minStake: 5000, totalStaked: 25000, isEnabled: true },
    { id: '4', name: 'Enterprise Pool', tokenSymbol: 'MMT', apy: 25, lockPeriod: 180, minStake: 10000, totalStaked: 15000, isEnabled: false },
  ]);

  const [userStakes, setUserStakes] = useState<UserStake[]>([
    { id: '1', userId: 'user1', userName: 'John Doe', poolId: '1', amount: 1500, startDate: '2024-01-01', endDate: '2024-01-31', status: 'active', rewards: 12.5 },
    { id: '2', userId: 'user2', userName: 'Jane Smith', poolId: '2', amount: 2500, startDate: '2024-01-15', endDate: '2024-03-15', status: 'active', rewards: 31.25 },
    { id: '3', userId: 'user3', userName: 'Mike Johnson', poolId: '3', amount: 6000, startDate: '2023-12-01', endDate: '2024-03-01', status: 'active', rewards: 100 },
    { id: '4', userId: 'user4', userName: 'Sarah Wilson', poolId: '1', amount: 1200, startDate: '2023-12-15', endDate: '2024-01-15', status: 'completed', rewards: 10 },
  ]);

  const togglePool = (id: string) => {
    setStakingPools(stakingPools.map(pool => 
      pool.id === id ? { ...pool, isEnabled: !pool.isEnabled } : pool
    ));
  };

  const withdrawStake = (id: string) => {
    setUserStakes(userStakes.map(stake => 
      stake.id === id ? { ...stake, status: 'withdrawn' as const } : stake
    ));
  };

  const calculateReward = (amount: number, apy: number, days: number) => {
    return ((amount * apy / 100) * (days / 365)).toFixed(2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'completed': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'withdrawn': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              DeFi Staking for Premium
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Stake tokens to get premium for free
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isStakingEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isStakingEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Staked</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{stakingPools.reduce((acc, p) => acc + p.totalStaked, 0).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Stakes</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{userStakes.filter(s => s.status === 'active').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Rewards Earned</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{userStakes.reduce((acc, s) => acc + s.rewards, 0).toFixed(2)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pools</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{stakingPools.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isStakingEnabled}
              onChange={(e) => setIsStakingEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Staking</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Wallet className="h-3 w-3" />
            Stake Tokens
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Staking Pools</h4>
          <div className="space-y-2">
            {stakingPools.map((pool) => (
              <div key={pool.id} className={`p-3 rounded-lg border ${pool.isEnabled ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{pool.name}</span>
                        {pool.isEnabled && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {pool.tokenSymbol} • Lock: {pool.lockPeriod} days
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-green-600 dark:text-green-400">{pool.apy}% APY</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Min: {pool.minStake} {pool.tokenSymbol}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Total Staked: {pool.totalStaked.toLocaleString()} {pool.tokenSymbol}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePool(pool.id)}
                    className={`px-2 py-1 rounded text-xs ${pool.isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {pool.isEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">User Stakes</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {userStakes.map((stake) => (
              <div key={stake.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Lock className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{stake.userName}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(stake.status)}`}>
                          {stake.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {stake.amount} {stakingPools.find(p => p.id === stake.poolId)?.tokenSymbol || 'MMT'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-purple-600 dark:text-purple-400">{stake.rewards} {stakingPools.find(p => p.id === stake.poolId)?.tokenSymbol || 'MMT'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Rewards</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Start: {stake.startDate}</span>
                    <span>•</span>
                    <span>End: {stake.endDate}</span>
                  </div>
                </div>
                {stake.status === 'active' && (
                  <button
                    type="button"
                    onClick={() => withdrawStake(stake.id)}
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <Unlock className="h-3 w-3" />
                    Withdraw
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">DeFi Staking Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Stake tokens to earn APY rewards</li>
              <li>• Higher stakes earn higher APY rates</li>
              <li>• Locked period determines rewards</li>
              <li>• Rewards can be used for premium features</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
