'use client';

import { useState } from 'react';
import {
  Building2,
  Calendar,
  CheckCircle,
  Info,
  MapPin,
  Plus,
  RefreshCw,
  Trash2,
  Users
} from 'lucide-react';

interface BusinessAccountsProps {
  onCancel?: () => void;
}

interface BusinessAccount {
  id: string;
  name: string;
  industry: string;
  plan: 'starter' | 'professional' | 'enterprise';
  teamSize: number;
  memoriesCount: number;
  storageUsed: number;
  storageLimit: number;
  isActive: boolean;
  createdAt: string;
  isCustom: boolean;
}

export default function BusinessAccounts({ onCancel }: BusinessAccountsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('all');

  const [businessAccounts, setBusinessAccounts] = useState<BusinessAccount[]>([
    { id: '1', name: 'Acme Corporation', industry: 'Technology', plan: 'enterprise', teamSize: 150, memoriesCount: 2450, storageUsed: 850, storageLimit: 1000, isActive: true, createdAt: '2024-01-15', isCustom: false },
    { id: '2', name: 'Green Valley Resort', industry: 'Hospitality', plan: 'professional', teamSize: 45, memoriesCount: 890, storageUsed: 320, storageLimit: 500, isActive: true, createdAt: '2024-03-22', isCustom: false },
    { id: '3', name: 'Urban Design Studio', industry: 'Design', plan: 'starter', teamSize: 12, memoriesCount: 156, storageUsed: 45, storageLimit: 100, isActive: true, createdAt: '2024-05-10', isCustom: false },
    { id: '4', name: 'Mountain Adventures', industry: 'Travel', plan: 'professional', teamSize: 28, memoriesCount: 420, storageUsed: 180, storageLimit: 500, isActive: false, createdAt: '2024-06-18', isCustom: false },
  ]);

  const filteredAccounts = selectedPlan === 'all' 
    ? businessAccounts 
    : businessAccounts.filter(account => account.plan === selectedPlan);

  const plans = ['all', 'starter', 'professional', 'enterprise'];

  const toggleAccount = (id: string) => {
    setBusinessAccounts(businessAccounts.map(account => 
      account.id === id ? { ...account, isActive: !account.isActive } : account
    ));
  };

  const addBusinessAccount = () => {
    const newAccount: BusinessAccount = {
      id: Date.now().toString(),
      name: 'New Business',
      industry: 'Other',
      plan: 'starter',
      teamSize: 5,
      memoriesCount: 0,
      storageUsed: 0,
      storageLimit: 100,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      isCustom: true,
    };
    setBusinessAccounts([...businessAccounts, newAccount]);
  };

  const deleteAccount = (id: string) => {
    setBusinessAccounts(businessAccounts.filter(account => account.id !== id));
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'starter': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'professional': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'enterprise': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const formatStorage = (gb: number) => {
    return gb >= 1000 ? `${(gb / 1000).toFixed(1)}TB` : `${gb}GB`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Business Accounts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Company and team memory management
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Accounts</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{businessAccounts.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{businessAccounts.filter(a => a.isActive).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Team</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{businessAccounts.reduce((sum, a) => sum + a.teamSize, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Memories</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{businessAccounts.reduce((sum, a) => sum + a.memoriesCount, 0)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          >
            {plans.map((plan) => (
              <option key={plan} value={plan}>{plan === 'all' ? 'All Plans' : plan.charAt(0).toUpperCase() + plan.slice(1)}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={addBusinessAccount}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Account
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Business Accounts ({filteredAccounts.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{account.name}</span>
                      {account.isActive && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Active
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs ${getPlanColor(account.plan)}`}>
                        {account.plan}
                      </span>
                      {account.isCustom && (
                        <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{account.industry}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{account.teamSize}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{account.memoriesCount}</span>
                      <span className="flex items-center gap-1">{formatStorage(account.storageUsed)}/{formatStorage(account.storageLimit)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleAccount(account.id)}
                    className={`px-2 py-1 rounded text-xs ${account.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
                  >
                    {account.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Info className="h-3 w-3" />
                  </button>
                  {account.isCustom && (
                    <button
                      type="button"
                      onClick={() => deleteAccount(account.id)}
                      className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Plan Overview</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">Starter</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{businessAccounts.filter(a => a.plan === 'starter').length} accounts</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">100GB storage</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Professional</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{businessAccounts.filter(a => a.plan === 'professional').length} accounts</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">500GB storage</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Enterprise</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{businessAccounts.filter(a => a.plan === 'enterprise').length} accounts</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">1TB+ storage</p>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Business Account Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Business accounts allow team collaboration on memories</li>
              <li>• Storage limits scale with plan tier</li>
              <li>• Team members can be invited with role-based access</li>
              <li>• Enterprise plans include dedicated support</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
