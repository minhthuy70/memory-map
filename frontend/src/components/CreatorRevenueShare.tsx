'use client';

import { useState } from 'react';
import { DollarSign, X, RefreshCw, Info, CheckCircle, Plus, Trash2, TrendingUp, Users, Download } from 'lucide-react';

interface CreatorRevenueShareProps {
  onCancel?: () => void;
}

interface Creator {
  id: string;
  name: string;
  creatorType: 'theme' | 'template' | 'sticker' | 'icon' | 'font' | 'map';
  productsCount: number;
  totalSales: number;
  totalRevenue: number;
  commissionRate: number;
  pendingPayout: number;
  paidPayout: number;
  isActive: boolean;
  isVerified: boolean;
  isCustom: boolean;
}

export default function CreatorRevenueShare({ onCancel }: CreatorRevenueShareProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  const [creators, setCreators] = useState<Creator[]>([
    { id: '1', name: 'ThemeMaster', creatorType: 'theme', productsCount: 12, totalSales: 45600, totalRevenue: 23400, commissionRate: 70, pendingPayout: 3400, paidPayout: 20000, isActive: true, isVerified: true, isCustom: false },
    { id: '2', name: 'TemplateKing', creatorType: 'template', productsCount: 8, totalSales: 32100, totalRevenue: 18900, commissionRate: 70, pendingPayout: 2800, paidPayout: 16100, isActive: true, isVerified: true, isCustom: false },
    { id: '3', name: 'StickerFactory', creatorType: 'sticker', productsCount: 15, totalSales: 67800, totalRevenue: 28900, commissionRate: 65, pendingPayout: 4500, paidPayout: 24400, isActive: true, isVerified: true, isCustom: false },
    { id: '4', name: 'IconMaster', creatorType: 'icon', productsCount: 10, totalSales: 28900, totalRevenue: 15600, commissionRate: 70, pendingPayout: 2200, paidPayout: 13400, isActive: true, isVerified: false, isCustom: false },
    { id: '5', name: 'FontDesigner', creatorType: 'font', productsCount: 6, totalSales: 15600, totalRevenue: 8900, commissionRate: 75, pendingPayout: 1200, paidPayout: 7700, isActive: false, isVerified: true, isCustom: false },
  ]);

  const filteredCreators = selectedType === 'all' 
    ? creators 
    : creators.filter(creator => creator.creatorType === selectedType);

  const types = ['all', 'theme', 'template', 'sticker', 'icon', 'font', 'map'];

  const toggleActive = (id: string) => {
    setCreators(creators.map(creator => 
      creator.id === id ? { ...creator, isActive: !creator.isActive } : creator
    ));
  };

  const toggleVerified = (id: string) => {
    setCreators(creators.map(creator => 
      creator.id === id ? { ...creator, isVerified: !creator.isVerified } : creator
    ));
  };

  const addCreator = () => {
    const newCreator: Creator = {
      id: Date.now().toString(),
      name: 'New Creator',
      creatorType: 'theme',
      productsCount: 0,
      totalSales: 0,
      totalRevenue: 0,
      commissionRate: 70,
      pendingPayout: 0,
      paidPayout: 0,
      isActive: true,
      isVerified: false,
      isCustom: true,
    };
    setCreators([...creators, newCreator]);
  };

  const deleteCreator = (id: string) => {
    setCreators(creators.filter(creator => creator.id !== id));
  };

  const processPayout = (id: string) => {
    setCreators(creators.map(creator => 
      creator.id === id 
        ? { ...creator, paidPayout: creator.paidPayout + creator.pendingPayout, pendingPayout: 0 }
        : creator
    ));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'theme': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'template': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300';
      case 'sticker': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'icon': return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300';
      case 'font': return 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300';
      case 'map': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return `$${num.toLocaleString()}`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Creator Revenue Share
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Revenue sharing for designers
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Creators</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{creators.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{creators.filter(c => c.isActive).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Revenue</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(creators.reduce((sum, c) => sum + c.totalRevenue, 0))}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pending Payout</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{formatCurrency(creators.reduce((sum, c) => sum + c.pendingPayout, 0))}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          >
            {types.map((type) => (
              <option key={type} value={type}>{type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={addCreator}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Creator
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Creators ({filteredCreators.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredCreators.map((creator) => (
              <div key={creator.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{creator.name}</span>
                      {creator.isActive && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Active
                        </span>
                      )}
                      {creator.isVerified && (
                        <span className="px-2 py-0.5 rounded text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          Verified
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(creator.creatorType)}`}>
                        {creator.creatorType}
                      </span>
                      {creator.isCustom && (
                        <span className="px-2 py-0.5 rounded text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                          Custom
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{creator.productsCount} products</span>
                      <span className="flex items-center gap-1"><Download className="h-3 w-3" />{formatNumber(creator.totalSales)} sales</span>
                      <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{creator.commissionRate}% commission</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Total: {formatCurrency(creator.totalRevenue)}</span>
                      <span>Pending: {formatCurrency(creator.pendingPayout)}</span>
                      <span>Paid: {formatCurrency(creator.paidPayout)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleActive(creator.id)}
                    className={`px-2 py-1 rounded text-xs ${creator.isActive ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {creator.isActive ? 'Pause' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleVerified(creator.id)}
                    className={`px-2 py-1 rounded text-xs ${creator.isVerified ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                  >
                    {creator.isVerified ? 'Unverify' : 'Verify'}
                  </button>
                  <button
                    type="button"
                    onClick={() => processPayout(creator.id)}
                    disabled={creator.pendingPayout === 0}
                    className={`px-2 py-1 rounded text-xs ${creator.pendingPayout > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white disabled:opacity-50`}
                  >
                    Payout
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Info className="h-3 w-3" />
                  </button>
                  {creator.isCustom && (
                    <button
                      type="button"
                      onClick={() => deleteCreator(creator.id)}
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Revenue Overview</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Total Sales</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{formatNumber(creators.reduce((sum, c) => sum + c.totalSales, 0))}</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">Total Payout</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{formatCurrency(creators.reduce((sum, c) => sum + c.paidPayout, 0))}</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Avg Commission</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {(creators.reduce((sum, c) => sum + c.commissionRate, 0) / creators.length).toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">Avg Payout</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatCurrency(creators.reduce((sum, c) => sum + c.paidPayout, 0) / creators.length)}
              </p>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Revenue Share Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Creators earn commission on product sales</li>
              <li>• Commission rates vary by product type</li>
              <li>• Process payouts for pending revenue</li>
              <li>• Verification adds credibility to creators</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
