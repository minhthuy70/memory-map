'use client';

import { useState } from 'react';
import { CheckCircle, CreditCard, Globe, Info, RefreshCw, Shield, Star, Zap } from 'lucide-react';

interface PaymentGatewayProps {
  onCancel?: () => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  isEnabled: boolean;
  supportedCurrencies: string[];
  transactionFee: number;
  monthlyVolume: number;
  successRate: number;
}

interface Transaction {
  id: string;
  gateway: string;
  amount: number;
  currency: string;
  status: 'success' | 'pending' | 'failed' | 'refunded';
  timestamp: string;
}

export default function PaymentGateway({ onCancel }: PaymentGatewayProps) {
  const [showDetails, setShowDetails] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', name: 'Stripe', icon: '🏦', isEnabled: true, supportedCurrencies: ['USD', 'EUR', 'VND'], transactionFee: 2.9, monthlyVolume: 125000, successRate: 99.9 },
    { id: '2', name: 'PayPal', icon: '💳', isEnabled: true, supportedCurrencies: ['USD', 'EUR', 'VND'], transactionFee: 3.49, monthlyVolume: 85000, successRate: 99.5 },
    { id: '3', name: 'Momo', icon: '📱', isEnabled: true, supportedCurrencies: ['VND'], transactionFee: 1.5, monthlyVolume: 45000, successRate: 98.5 },
    { id: '4', name: 'VNPay', icon: '🇻🇳', isEnabled: true, supportedCurrencies: ['VND'], transactionFee: 1.0, monthlyVolume: 35000, successRate: 97.8 },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', gateway: 'Stripe', amount: 19.99, currency: 'USD', status: 'success', timestamp: '2024-01-15 10:30' },
    { id: '2', gateway: 'PayPal', amount: 9.99, currency: 'USD', status: 'success', timestamp: '2024-01-15 11:45' },
    { id: '3', gateway: 'Momo', amount: 250000, currency: 'VND', status: 'success', timestamp: '2024-01-15 14:20' },
    { id: '4', gateway: 'VNPay', amount: 1999000, currency: 'VND', status: 'pending', timestamp: '2024-01-15 15:30' },
    { id: '5', gateway: 'Stripe', amount: 24.99, currency: 'USD', status: 'failed', timestamp: '2024-01-15 16:45' },
  ]);

  const toggleGateway = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => 
      method.id === id ? { ...method, isEnabled: !method.isEnabled } : method
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'refunded': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Payment Gateway
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Stripe, PayPal, Momo, VNPay
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Gateways</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{paymentMethods.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{paymentMethods.filter(m => m.isEnabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Success Rate</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{(paymentMethods.reduce((acc, m) => acc + m.successRate, 0) / paymentMethods.length).toFixed(1)}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Monthly Volume</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">$290K</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Globe className="h-3 w-3" />
            Add Gateway
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Payment Gateways</h4>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <div key={method.id} className={`p-3 rounded-lg border ${method.isEnabled ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{method.name}</span>
                        {method.isEnabled && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Fee: {method.transactionFee}% • Success: {method.successRate}%
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleGateway(method.id)}
                    className={`px-2 py-1 rounded text-xs ${method.isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {method.isEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Currencies: {method.supportedCurrencies.join(', ')}</span>
                  <span>•</span>
                  <span>Volume: ${method.monthlyVolume.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Recent Transactions</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{transaction.gateway}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{transaction.timestamp}</p>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Payment Gateway Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Stripe: Global support, high success rate</li>
              <li>• PayPal: User-friendly, trusted worldwide</li>
              <li>• Momo: Popular in Vietnam, low fees</li>
              <li>• VNPay: Bank integration, VND support</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
