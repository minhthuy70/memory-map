'use client';

import { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Coins,
  CreditCard,
  Crown,
  Eye,
  EyeOff,
  Filter,
  Gift,
  Heart,
  History,
  Lock,
  Minus,
  Plus,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  Unlock,
  Wallet
} from 'lucide-react';

interface MemoryCoinsProps {
  onCancel?: () => void;
}

interface CoinTransaction {
  id: string;
  type: 'earned' | 'spent' | 'bonus';
  amount: number;
  description: string;
  date: string;
  category: 'daily' | 'achievement' | 'purchase' | 'referral' | 'bonus';
}

interface CoinItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  category: 'theme' | 'sticker' | 'badge' | 'effect';
  purchased: boolean;
}

export default function MemoryCoins({ onCancel }: MemoryCoinsProps) {
  const [balance, setBalance] = useState(1250);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('price-asc');

  const [transactions, setTransactions] = useState<CoinTransaction[]>([
    {
      id: '1',
      type: 'earned',
      amount: 50,
      description: 'Daily login bonus',
      date: '2026-09-14',
      category: 'daily',
    },
    {
      id: '2',
      type: 'earned',
      amount: 100,
      description: 'Completed 30-day streak',
      date: '2026-09-13',
      category: 'achievement',
    },
    {
      id: '3',
      type: 'spent',
      amount: -200,
      description: 'Purchased premium theme',
      date: '2026-09-12',
      category: 'purchase',
    },
    {
      id: '4',
      type: 'earned',
      amount: 500,
      description: 'Referred a friend',
      date: '2026-09-10',
      category: 'referral',
    },
    {
      id: '5',
      type: 'bonus',
      amount: 1000,
      description: 'Welcome bonus',
      date: '2026-01-01',
      category: 'bonus',
    },
  ]);

  const [items, setItems] = useState<CoinItem[]>([
    {
      id: '1',
      name: 'Premium Dark Theme',
      description: 'Exclusive dark theme with gradients',
      cost: 200,
      icon: 'theme',
      category: 'theme',
      purchased: true,
    },
    {
      id: '2',
      name: 'Neon Sticker Pack',
      description: '12 neon-style stickers',
      cost: 150,
      icon: 'sticker',
      category: 'sticker',
      purchased: false,
    },
    {
      id: '3',
      name: 'Golden Badge',
      description: 'Premium golden badge for profile',
      cost: 500,
      icon: 'badge',
      category: 'badge',
      purchased: false,
    },
    {
      id: '4',
      name: 'Sparkle Effect',
      description: 'Animated sparkle effect on memories',
      cost: 300,
      icon: 'effect',
      category: 'effect',
      purchased: true,
    },
    {
      id: '5',
      name: 'Nature Theme',
      description: 'Beautiful nature-inspired theme',
      cost: 250,
      icon: 'theme',
      category: 'theme',
      purchased: false,
    },
    {
      id: '6',
      name: 'Retro Sticker Pack',
      description: '20 retro-style stickers',
      cost: 200,
      icon: 'sticker',
      category: 'sticker',
      purchased: false,
    },
    {
      id: '7',
      name: 'Platinum Badge',
      description: 'Exclusive platinum badge',
      cost: 1000,
      icon: 'badge',
      category: 'badge',
      purchased: false,
    },
    {
      id: '8',
      name: 'Confetti Effect',
      description: 'Celebratory confetti animation',
      cost: 400,
      icon: 'effect',
      category: 'effect',
      purchased: false,
    },
  ]);

  const handlePurchase = (item: CoinItem) => {
    if (balance >= item.cost && !item.purchased) {
      setBalance(balance - item.cost);
      setItems(items.map(i => i.id === item.id ? { ...i, purchased: true } : i));
      setTransactions([
        {
          id: Date.now().toString(),
          type: 'spent',
          amount: -item.cost,
          description: `Purchased ${item.name}`,
          date: new Date().toISOString().split('T')[0],
          category: 'purchase',
        },
        ...transactions,
      ]);
    }
  };

  const filteredItems = items.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'price-asc') return a.cost - b.cost;
    if (sortBy === 'price-desc') return b.cost - a.cost;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'theme': return <Star className="h-4 w-4" />;
      case 'sticker': return <Gift className="h-4 w-4" />;
      case 'badge': return <Crown className="h-4 w-4" />;
      case 'effect': return <Sparkles className="h-4 w-4" />;
      default: return <ShoppingBag className="h-4 w-4" />;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned': return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'spent': return <ArrowDownLeft className="h-4 w-4 text-red-500" />;
      case 'bonus': return <Gift className="h-4 w-4 text-purple-500" />;
      default: return <Coins className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
            <Coins className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Memory Coins
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Balance: {balance} coins
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Transaction History"
          >
            <History className="h-4 w-4 text-slate-500" />
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

      {showHistory && (
        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Transaction History
            </h4>
            <button
              type="button"
              onClick={() => setShowHistory(false)}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-center gap-2">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="text-xs font-medium text-slate-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {transaction.date}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${
                  transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Categories</option>
            <option value="theme">Themes</option>
            <option value="sticker">Stickers</option>
            <option value="badge">Badges</option>
            <option value="effect">Effects</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                item.purchased
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600'
                  : balance >= item.cost
                  ? 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-yellow-400 dark:hover:border-yellow-500'
                  : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  item.purchased
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                }`}>
                  {getCategoryIcon(item.category)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                      {item.cost} coins
                    </span>
                    {item.purchased ? (
                      <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Purchased
                      </span>
                    ) : balance >= item.cost ? (
                      <button
                        type="button"
                        onClick={() => handlePurchase(item)}
                        className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors"
                      >
                        Buy
                      </button>
                    ) : (
                      <span className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Insufficient
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Ways to Earn Coins
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Daily login: +50 coins</li>
            <li>• Create a memory: +10 coins</li>
            <li>• Complete achievements: +100-1000 coins</li>
            <li>• Refer a friend: +500 coins</li>
            <li>• Weekly streak bonus: +200 coins</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
