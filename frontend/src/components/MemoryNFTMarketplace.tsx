'use client';

import { useState } from 'react';
import { ShoppingBag, X, RefreshCw, Info, CheckCircle, Star, Zap, Gem, TrendingUp, Heart, Share2 } from 'lucide-react';

interface MemoryNFTMarketplaceProps {
  onCancel?: () => void;
}

interface ListedNFT {
  id: string;
  tokenId: string;
  title: string;
  description: string;
  image: string;
  seller: string;
  price: number;
  currency: string;
  blockchain: string;
  likes: number;
  views: number;
  status: 'listed' | 'sold' | 'cancelled';
  listedAt: string;
}

interface Sale {
  id: string;
  nftId: string;
  buyer: string;
  seller: string;
  price: number;
  currency: string;
  timestamp: string;
}

export default function MemoryNFTMarketplace({ onCancel }: MemoryNFTMarketplaceProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isMarketplaceEnabled, setIsMarketplaceEnabled] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [listedNFTs, setListedNFTs] = useState<ListedNFT[]>([
    { id: '1', tokenId: '1001', title: 'First Trip to Paris', description: 'Eiffel Tower sunset', image: '/images/paris.jpg', seller: '0x123...abc', price: 0.5, currency: 'ETH', blockchain: 'Ethereum', likes: 45, views: 230, status: 'listed', listedAt: '2024-01-16' },
    { id: '2', tokenId: '1002', title: 'Beach Day', description: 'Beautiful sunset at the beach', image: '/images/beach.jpg', seller: '0x456...def', price: 0.3, currency: 'ETH', blockchain: 'Polygon', likes: 32, views: 180, status: 'listed', listedAt: '2024-02-21' },
    { id: '3', tokenId: '1003', title: 'Mountain Hiking', description: 'Reached the summit', image: '/images/mountain.jpg', seller: '0x789...ghi', price: 0.8, currency: 'ETH', blockchain: 'Ethereum', likes: 67, views: 320, status: 'sold', listedAt: '2024-03-11' },
    { id: '4', tokenId: '1004', title: 'City Nightlife', description: 'Tokyo at night', image: '/images/tokyo.jpg', seller: '0xabc...def', price: 0.4, currency: 'ETH', blockchain: 'Solana', likes: 28, views: 150, status: 'cancelled', listedAt: '2024-04-06' },
  ]);

  const [sales, setSales] = useState<Sale[]>([
    { id: '1', nftId: '3', buyer: '0xdef...ghi', seller: '0x789...ghi', price: 0.8, currency: 'ETH', timestamp: '2024-03-15' },
  ]);

  const buyNFT = (id: string) => {
    const nft = listedNFTs.find(n => n.id === id);
    if (!nft) return;

    const newSale: Sale = {
      id: Date.now().toString(),
      nftId: id,
      buyer: '0x000...000',
      seller: nft.seller,
      price: nft.price,
      currency: nft.currency,
      timestamp: new Date().toISOString().split('T')[0],
    };

    setSales([...sales, newSale]);
    setListedNFTs(listedNFTs.map(n => n.id === id ? { ...n, status: 'sold' as const } : n));
  };

  const cancelListing = (id: string) => {
    setListedNFTs(listedNFTs.map(n => n.id === id ? { ...n, status: 'cancelled' as const } : n));
  };

  const likeNFT = (id: string) => {
    setListedNFTs(listedNFTs.map(n => n.id === id ? { ...n, likes: n.likes + 1 } : n));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'listed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'sold': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const filteredNFTs = statusFilter === 'all' 
    ? listedNFTs 
    : listedNFTs.filter(nft => nft.status === statusFilter);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Memory NFT Marketplace
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Buy and sell memory NFTs
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isMarketplaceEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isMarketplaceEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Listed</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{listedNFTs.filter(n => n.status === 'listed').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Sold</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{listedNFTs.filter(n => n.status === 'sold').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Volume</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{sales.reduce((acc, s) => acc + s.price, 0).toFixed(2)} ETH</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Views</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{listedNFTs.reduce((acc, n) => acc + n.views, 0)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isMarketplaceEnabled}
              onChange={(e) => setIsMarketplaceEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Marketplace</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Status</option>
            <option value="listed">Listed</option>
            <option value="sold">Sold</option>
            <option value="cancelled">Cancelled</option>
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Listed NFTs ({filteredNFTs.length})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredNFTs.map((nft) => (
              <div key={nft.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Gem className="h-4 w-4 text-purple-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{nft.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(nft.status)}`}>
                          {nft.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{nft.description}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Token ID: {nft.tokenId} • {nft.blockchain}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{nft.price} {nft.currency}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Seller: {nft.seller}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-400" />
                      {nft.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-blue-400" />
                      {nft.views} views
                    </span>
                    <span>Listed: {nft.listedAt}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {nft.status === 'listed' && (
                    <>
                      <button
                        type="button"
                        onClick={() => buyNFT(nft.id)}
                        className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white"
                      >
                        Buy
                      </button>
                      <button
                        type="button"
                        onClick={() => likeNFT(nft.id)}
                        className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                      >
                        <Heart className="h-3 w-3" />
                        Like
                      </button>
                      <button
                        type="button"
                        onClick={() => cancelListing(nft.id)}
                        className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <Share2 className="h-3 w-3" />
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Recent Sales</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {sales.map((sale) => (
              <div key={sale.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">Token {listedNFTs.find(n => n.id === sale.nftId)?.tokenId}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {sale.seller} → {sale.buyer}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-green-600 dark:text-green-400">{sale.price} {sale.currency}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{sale.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Marketplace Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• List memory NFTs for sale on the marketplace</li>
              <li>• Buy NFTs from other users</li>
              <li>• Track likes, views, and sales history</li>
              <li>• Support multiple blockchains (Ethereum, Polygon, Solana)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
