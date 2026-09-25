'use client';

import { useState } from 'react';
import { Bitcoin, X, RefreshCw, Info, CheckCircle, Star, Zap, Wallet, ExternalLink } from 'lucide-react';

interface CryptoPaymentProps {
  onCancel?: () => void;
}

interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  isEnabled: boolean;
  exchangeRate: number;
  network: string;
  confirmations: number;
  minAmount: number;
}

interface CryptoTransaction {
  id: string;
  userId: string;
  userName: string;
  currency: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'failed' | 'completed';
  txHash: string;
  timestamp: string;
  confirmations: number;
}

export default function CryptoPayment({ onCancel }: CryptoPaymentProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isCryptoPaymentEnabled, setIsCryptoPaymentEnabled] = useState(true);

  const [cryptoCurrencies, setCryptoCurrencies] = useState<CryptoCurrency[]>([
    { id: '1', name: 'Bitcoin', symbol: 'BTC', icon: '₿', isEnabled: true, exchangeRate: 0.00023, network: 'Bitcoin', confirmations: 6, minAmount: 0.0001 },
    { id: '2', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', isEnabled: true, exchangeRate: 0.0035, network: 'Ethereum', confirmations: 12, minAmount: 0.01 },
    { id: '3', name: 'USDT', symbol: 'USDT', icon: '₮', isEnabled: true, exchangeRate: 1, network: 'TRC20', confirmations: 6, minAmount: 10 },
    { id: '4', name: 'Polygon', symbol: 'MATIC', icon: '⬡', isEnabled: false, exchangeRate: 0.8, network: 'Polygon', confirmations: 10, minAmount: 1 },
  ]);

  const [transactions, setTransactions] = useState<CryptoTransaction[]>([
    { id: '1', userId: 'user1', userName: 'John Doe', currency: 'BTC', amount: 0.00023, status: 'completed', txHash: '0x123...abc', timestamp: '2024-01-15 10:30', confirmations: 6 },
    { id: '2', userId: 'user2', userName: 'Jane Smith', currency: 'ETH', amount: 0.0035, status: 'completed', txHash: '0x456...def', timestamp: '2024-01-15 11:45', confirmations: 12 },
    { id: '3', userId: 'user3', userName: 'Mike Johnson', currency: 'USDT', amount: 19.99, status: 'pending', txHash: '0x789...ghi', timestamp: '2024-01-15 14:20', confirmations: 3 },
    { id: '4', userId: 'user4', userName: 'Sarah Wilson', currency: 'BTC', amount: 0.00023, status: 'failed', txHash: '0xabc...jkl', timestamp: '2024-01-15 15:30', confirmations: 0 },
  ]);

  const toggleCurrency = (id: string) => {
    setCryptoCurrencies(cryptoCurrencies.map(currency => 
      currency.id === id ? { ...currency, isEnabled: !currency.isEnabled } : currency
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'confirmed': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getUsdEquivalent = (amount: number, rate: number) => {
    return (amount * (1 / rate)).toFixed(2);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
            <Bitcoin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Crypto Payment for Premium
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pay for premium using cryptocurrency
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isCryptoPaymentEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isCryptoPaymentEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Currencies</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{cryptoCurrencies.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{cryptoCurrencies.filter(c => c.isEnabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Transactions</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{transactions.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Completed</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{transactions.filter(t => t.status === 'completed').length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isCryptoPaymentEnabled}
              onChange={(e) => setIsCryptoPaymentEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Crypto Payment</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Wallet className="h-3 w-3" />
            Connect Wallet
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Supported Cryptocurrencies</h4>
          <div className="space-y-2">
            {cryptoCurrencies.map((currency) => (
              <div key={currency.id} className={`p-3 rounded-lg border ${currency.isEnabled ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{currency.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{currency.name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{currency.symbol}</span>
                        {currency.isEnabled && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Network: {currency.network} • Confs: {currency.confirmations}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">1 USDT = {currency.exchangeRate} {currency.symbol}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Min: {currency.minAmount} {currency.symbol}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => toggleCurrency(currency.id)}
                    className={`px-2 py-1 rounded text-xs ${currency.isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {currency.isEnabled ? 'Disable' : 'Enable'}
                  </button>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    ~${getUsdEquivalent(19.99, currency.exchangeRate)} for Pro Plan
                  </span>
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
                    <Bitcoin className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{transaction.userName}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{transaction.amount} {transaction.currency}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">${getUsdEquivalent(transaction.amount, cryptoCurrencies.find(c => c.symbol === transaction.currency)?.exchangeRate || 1)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{transaction.timestamp}</span>
                    <span>•</span>
                    <span className="font-mono">{transaction.txHash}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {transaction.confirmations}/{cryptoCurrencies.find(c => c.symbol === transaction.currency)?.confirmations || 0} Confs
                    </span>
                    <button
                      type="button"
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                      title="View on Explorer"
                    >
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Crypto Payment Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Multiple cryptocurrencies supported (BTC, ETH, USDT, MATIC)</li>
              <li>• Automatic conversion to USD equivalent</li>
              <li>• Blockchain confirmations required for completion</li>
              <li>• Transaction tracking with hash verification</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
