'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Download,
  Heart,
  Info,
  Plus,
  RefreshCw,
  ShoppingCart,
  Smile,
  Star
} from 'lucide-react';

interface StickerPacksProps {
  onCancel?: () => void;
}

interface StickerPack {
  id: string;
  name: string;
  creator: string;
  category: string;
  stickerCount: number;
  price: number;
  rating: number;
  downloads: number;
  reviews: number;
  isPremium: boolean;
  isPurchased: boolean;
  isFavorite: boolean;
  preview: string;
  isCustom: boolean;
}

export default function StickerPacks({ onCancel }: StickerPacksProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [stickerPacks, setStickerPacks] = useState<StickerPack[]>([
    { id: '1', name: 'Emoji Basic', creator: 'StickerFactory', category: 'Emoji', stickerCount: 24, price: 0, rating: 4.7, downloads: 89000, reviews: 4560, isPremium: false, isPurchased: true, isFavorite: true, preview: 'emoji', isCustom: false },
    { id: '2', name: 'Travel Adventures', creator: 'TravelStickers', category: 'Travel', stickerCount: 18, price: 1.99, rating: 4.6, downloads: 56700, reviews: 2890, isPremium: true, isPurchased: false, isFavorite: false, preview: 'travel', isCustom: false },
    { id: '3', name: 'Food Delights', creator: 'FoodieStickers', category: 'Food', stickerCount: 32, price: 0, rating: 4.8, downloads: 123000, reviews: 6780, isPremium: false, isPurchased: true, isFavorite: true, preview: 'food', isCustom: false },
    { id: '4', name: 'Party Time', creator: 'PartyVibes', category: 'Party', stickerCount: 20, price: 1.49, rating: 4.5, downloads: 45600, reviews: 2340, isPremium: true, isPurchased: false, isFavorite: false, preview: 'party', isCustom: false },
    { id: '5', name: 'Nature Beauty', creator: 'NatureStickers', category: 'Nature', stickerCount: 28, price: 2.99, rating: 4.7, downloads: 67800, reviews: 3450, isPremium: true, isPurchased: true, isFavorite: false, preview: 'nature', isCustom: false },
  ]);

  const filteredPacks = selectedCategory === 'all' 
    ? stickerPacks 
    : stickerPacks.filter(pack => pack.category === selectedCategory);

  const categories = ['all', 'Emoji', 'Travel', 'Food', 'Party', 'Nature'];

  const togglePurchase = (id: string) => {
    setStickerPacks(stickerPacks.map(pack => 
      pack.id === id ? { ...pack, isPurchased: !pack.isPurchased } : pack
    ));
  };

  const toggleFavorite = (id: string) => {
    setStickerPacks(stickerPacks.map(pack => 
      pack.id === id ? { ...pack, isFavorite: !pack.isFavorite } : pack
    ));
  };

  const addStickerPack = () => {
    const newPack: StickerPack = {
      id: Date.now().toString(),
      name: 'New Pack',
      creator: 'You',
      category: 'Custom',
      stickerCount: 10,
      price: 0,
      rating: 0,
      downloads: 0,
      reviews: 0,
      isPremium: false,
      isPurchased: false,
      isFavorite: false,
      preview: 'custom',
      isCustom: true,
    };
    setStickerPacks([...stickerPacks, newPack]);
  };

  const deletePack = (id: string) => {
    setStickerPacks(stickerPacks.filter(pack => pack.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Emoji': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'Travel': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'Food': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'Party': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'Nature': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
            <Smile className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Sticker Packs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              In-app sticker purchases
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Packs</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{stickerPacks.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Purchased</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{stickerPacks.filter(p => p.isPurchased).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Premium</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{stickerPacks.filter(p => p.isPremium).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Stickers</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{stickerPacks.reduce((sum, p) => sum + p.stickerCount, 0)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={addStickerPack}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Pack
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Sticker Packs ({filteredPacks.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredPacks.map((pack) => (
              <div key={pack.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Smile className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{pack.name}</span>
                      {pack.isPurchased && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Purchased
                        </span>
                      )}
                      {pack.isPremium && (
                        <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          Premium
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(pack.category)}`}>
                        {pack.category}
                      </span>
                      {pack.isFavorite && (
                        <span className="px-2 py-0.5 rounded text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                          <Heart className="h-3 w-3" />
                        </span>
                      )}
                      {pack.isCustom && (
                        <span className="px-2 py-0.5 rounded text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">by {pack.creator}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>{pack.stickerCount} stickers</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3" />{pack.rating}</span>
                      <span className="flex items-center gap-1"><Download className="h-3 w-3" />{formatNumber(pack.downloads)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {pack.price === 0 ? 'Free' : `$${pack.price}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => togglePurchase(pack.id)}
                    className={`px-2 py-1 rounded text-xs ${pack.isPurchased ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {pack.isPurchased ? 'Owned' : 'Buy'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(pack.id)}
                    className={`px-2 py-1 rounded text-xs ${pack.isFavorite ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
                  >
                    <Heart className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ShoppingCart className="h-3 w-3" />
                  </button>
                  {pack.isCustom && (
                    <button
                      type="button"
                      onClick={() => deletePack(pack.id)}
                      className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Category Overview</h4>
          <div className="grid grid-cols-5 gap-2">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 mb-1">Emoji</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{stickerPacks.filter(p => p.category === 'Emoji').length} packs</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Travel</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{stickerPacks.filter(p => p.category === 'Travel').length} packs</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">Food</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{stickerPacks.filter(p => p.category === 'Food').length} packs</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Party</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{stickerPacks.filter(p => p.category === 'Party').length} packs</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">Nature</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{stickerPacks.filter(p => p.category === 'Nature').length} packs</p>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Sticker Pack Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Sticker packs add fun to memory cards</li>
              <li>• Free packs are available for all users</li>
              <li>• Premium packs offer exclusive designs</li>
              <li>• Use stickers to personalize your memories</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
