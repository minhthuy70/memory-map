'use client';

import { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  CheckCircle,
  CreditCard,
  Info,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  Star,
  Zap
} from 'lucide-react';

interface SubscriptionManagementProps {
  onCancel?: () => void;
}

interface Subscription {
  id: string;
  userId: string;
  userName: string;
  plan: string;
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  nextBillingDate: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  autoRenew: boolean;
}

export default function SubscriptionManagement({ onCancel }: SubscriptionManagementProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { id: '1', userId: 'user1', userName: 'John Doe', plan: 'Pro Plan', status: 'active', startDate: '2024-01-01', endDate: '2024-12-31', nextBillingDate: '2024-02-01', amount: 19.99, currency: 'USD', billingCycle: 'monthly', autoRenew: true },
    { id: '2', userId: 'user2', userName: 'Jane Smith', plan: 'Basic Plan', status: 'active', startDate: '2024-01-15', endDate: '2024-12-31', nextBillingDate: '2024-02-15', amount: 9.99, currency: 'USD', billingCycle: 'monthly', autoRenew: true },
    { id: '3', userId: 'user3', userName: 'Mike Johnson', plan: 'Family Plan', status: 'paused', startDate: '2024-02-01', endDate: '2024-12-31', nextBillingDate: '2024-03-01', amount: 24.99, currency: 'USD', billingCycle: 'monthly', autoRenew: false },
    { id: '4', userId: 'user4', userName: 'Sarah Wilson', plan: 'Enterprise Plan', status: 'cancelled', startDate: '2024-01-20', endDate: '2024-01-20', nextBillingDate: '-', amount: 99.99, currency: 'USD', billingCycle: 'monthly', autoRenew: false },
    { id: '5', userId: 'user5', userName: 'Tom Brown', plan: 'Pro Plan', status: 'expired', startDate: '2023-06-01', endDate: '2023-12-31', nextBillingDate: '-', amount: 19.99, currency: 'USD', billingCycle: 'yearly', autoRenew: false },
  ]);

  const toggleAutoRenew = (id: string) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, autoRenew: !sub.autoRenew } : sub
    ));
  };

  const pauseSubscription = (id: string) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, status: 'paused' as const, autoRenew: false } : sub
    ));
  };

  const resumeSubscription = (id: string) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, status: 'active' as const, autoRenew: true } : sub
    ));
  };

  const cancelSubscription = (id: string) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, status: 'cancelled' as const, autoRenew: false } : sub
    ));
  };

  const upgradeSubscription = (id: string) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, plan: 'Pro Plan', amount: 19.99 } : sub
    ));
  };

  const downgradeSubscription = (id: string) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, plan: 'Basic Plan', amount: 9.99 } : sub
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'paused': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'expired': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const filteredSubscriptions = statusFilter === 'all' 
    ? subscriptions 
    : subscriptions.filter(sub => sub.status === statusFilter);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Subscription Management
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage subscriptions, renewals, cancellations
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{subscriptions.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{subscriptions.filter(s => s.status === 'active').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Monthly Revenue</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">${subscriptions.filter(s => s.status === 'active' && s.billingCycle === 'monthly').reduce((acc, s) => acc + s.amount, 0).toFixed(2)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Auto-Renew</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{subscriptions.filter(s => s.autoRenew).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Subscriptions ({filteredSubscriptions.length})</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredSubscriptions.map((subscription) => (
              <div key={subscription.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{subscription.userName}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(subscription.status)}`}>
                          {subscription.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{subscription.plan} • {subscription.billingCycle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">${subscription.amount}/{subscription.billingCycle === 'monthly' ? 'mo' : 'yr'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{subscription.currency}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Start: {subscription.startDate}</span>
                    <span>•</span>
                    <span>End: {subscription.endDate}</span>
                    <span>•</span>
                    <span>Next: {subscription.nextBillingDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${subscription.autoRenew ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`}>
                      {subscription.autoRenew ? 'Auto-renew ON' : 'Auto-renew OFF'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {subscription.status === 'active' && (
                    <>
                      <button
                        type="button"
                        onClick={() => toggleAutoRenew(subscription.id)}
                        className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        {subscription.autoRenew ? 'Disable Auto-renew' : 'Enable Auto-renew'}
                      </button>
                      <button
                        type="button"
                        onClick={() => pauseSubscription(subscription.id)}
                        className="px-2 py-1 rounded text-xs bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-1"
                      >
                        <PauseCircle className="h-3 w-3" />
                        Pause
                      </button>
                      <button
                        type="button"
                        onClick={() => upgradeSubscription(subscription.id)}
                        className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                      >
                        <ArrowUp className="h-3 w-3" />
                        Upgrade
                      </button>
                      <button
                        type="button"
                        onClick={() => downgradeSubscription(subscription.id)}
                        className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                      >
                        <ArrowDown className="h-3 w-3" />
                        Downgrade
                      </button>
                      <button
                        type="button"
                        onClick={() => cancelSubscription(subscription.id)}
                        className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {subscription.status === 'paused' && (
                    <button
                      type="button"
                      onClick={() => resumeSubscription(subscription.id)}
                      className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                    >
                      <PlayCircle className="h-3 w-3" />
                      Resume
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Subscription Management Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Active subscriptions are billed automatically</li>
              <li>• Paused subscriptions don't charge but can be resumed</li>
              <li>• Cancelled subscriptions end at current billing cycle</li>
              <li>• Auto-renew can be toggled per subscription</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
