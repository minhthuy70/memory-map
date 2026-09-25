'use client';

import { useState } from 'react';
import {
  CheckCircle,
  DollarSign,
  Eye,
  Info,
  MapPin,
  Plus,
  RefreshCw,
  Trash2,
  TrendingUp
} from 'lucide-react';

interface SponsoredMemoriesProps {
  onCancel?: () => void;
}

interface SponsoredMemory {
  id: string;
  title: string;
  sponsor: string;
  location: string;
  type: 'location' | 'event' | 'product' | 'service';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  status: 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  isCustom: boolean;
}

export default function SponsoredMemories({ onCancel }: SponsoredMemoriesProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  const [sponsoredMemories, setSponsoredMemories] = useState<SponsoredMemory[]>([
    { id: '1', title: 'Da Nang Beach Resort', sponsor: 'Vinpearl', location: 'Da Nang, Vietnam', type: 'location', budget: 5000, spent: 3200, impressions: 125000, clicks: 8900, ctr: 7.12, status: 'active', startDate: '2024-06-01', endDate: '2024-08-31', isCustom: false },
    { id: '2', title: 'Hanoi Food Festival', sponsor: 'Vietnam Tourism', location: 'Hanoi, Vietnam', type: 'event', budget: 3000, spent: 2800, impressions: 89000, clicks: 6200, ctr: 6.97, status: 'active', startDate: '2024-07-01', endDate: '2024-07-31', isCustom: false },
    { id: '3', title: 'Pho Promotion', sponsor: 'Pho 24', location: 'Ho Chi Minh City', type: 'product', budget: 1500, spent: 1200, impressions: 45000, clicks: 3800, ctr: 8.44, status: 'active', startDate: '2024-07-15', endDate: '2024-08-15', isCustom: false },
    { id: '4', title: 'Halong Bay Tours', sponsor: 'Indochina Junk', location: 'Halong Bay, Vietnam', type: 'service', budget: 8000, spent: 7500, impressions: 156000, clicks: 11200, ctr: 7.18, status: 'paused', startDate: '2024-05-01', endDate: '2024-07-31', isCustom: false },
  ]);

  const filteredMemories = selectedType === 'all' 
    ? sponsoredMemories 
    : sponsoredMemories.filter(memory => memory.type === selectedType);

  const types = ['all', 'location', 'event', 'product', 'service'];

  const toggleStatus = (id: string) => {
    setSponsoredMemories(sponsoredMemories.map(memory => 
      memory.id === id ? { ...memory, status: memory.status === 'active' ? 'paused' : 'active' } : memory
    ));
  };

  const addSponsoredMemory = () => {
    const newMemory: SponsoredMemory = {
      id: Date.now().toString(),
      title: 'New Sponsorship',
      sponsor: 'Sponsor Name',
      location: 'Location',
      type: 'location',
      budget: 1000,
      spent: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isCustom: true,
    };
    setSponsoredMemories([...sponsoredMemories, newMemory]);
  };

  const deleteMemory = (id: string) => {
    setSponsoredMemories(sponsoredMemories.filter(memory => memory.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'location': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'event': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'product': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'service': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'paused': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'completed': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
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
              Sponsored Memories
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sponsored location memories (advertising)
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Sponsored</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{sponsoredMemories.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{sponsoredMemories.filter(m => m.status === 'active').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Budget</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(sponsoredMemories.reduce((sum, m) => sum + m.budget, 0))}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg CTR</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {(sponsoredMemories.reduce((sum, m) => sum + m.ctr, 0) / sponsoredMemories.length).toFixed(2)}%
            </p>
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
            onClick={addSponsoredMemory}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Sponsorship
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Sponsored Memories ({filteredMemories.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredMemories.map((memory) => (
              <div key={memory.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{memory.title}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(memory.status)}`}>
                        {memory.status}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(memory.type)}`}>
                        {memory.type}
                      </span>
                      {memory.isCustom && (
                        <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{memory.sponsor}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{memory.location}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{formatNumber(memory.impressions)}</span>
                      <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{memory.ctr}% CTR</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Budget: {formatCurrency(memory.budget)}</span>
                      <span>Spent: {formatCurrency(memory.spent)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleStatus(memory.id)}
                    className={`px-2 py-1 rounded text-xs ${memory.status === 'active' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {memory.status === 'active' ? 'Pause' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Info className="h-3 w-3" />
                  </button>
                  {memory.isCustom && (
                    <button
                      type="button"
                      onClick={() => deleteMemory(memory.id)}
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Performance Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Total Impressions</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{formatNumber(sponsoredMemories.reduce((sum, m) => sum + m.impressions, 0))}</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">Total Clicks</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{formatNumber(sponsoredMemories.reduce((sum, m) => sum + m.clicks, 0))}</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Total Spent</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{formatCurrency(sponsoredMemories.reduce((sum, m) => sum + m.spent, 0))}</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">Avg CPM</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {sponsoredMemories.length > 0 
                  ? formatCurrency(sponsoredMemories.reduce((sum, m) => sum + m.spent, 0) / (sponsoredMemories.reduce((sum, m) => sum + m.impressions, 0) / 1000))
                  : '$0'}
              </p>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Sponsored Memory Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Sponsored memories promote locations to relevant users</li>
              <li>• CTR measures click-through rate effectiveness</li>
              <li>• Budget can be allocated per campaign</li>
              <li>• Pause campaigns to adjust budget or creative</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
