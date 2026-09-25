'use client';

import { useState } from 'react';
import {
  as,
  CheckCircle,
  ExternalLink,
  Grid,
  Image,
  ImageIcon,
  Info,
  List,
  RefreshCw,
  Share2,
  Star,
  Zap
} from 'lucide-react';

interface NFTGalleryDisplayProps {
  onCancel?: () => void;
}

interface GalleryNFT {
  id: string;
  tokenId: string;
  title: string;
  description: string;
  image: string;
  blockchain: string;
  contractAddress: string;
  createdAt: string;
  likes: number;
  views: number;
  isPublic: boolean;
}

export default function NFTGalleryDisplay({ onCancel }: NFTGalleryDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isGalleryEnabled, setIsGalleryEnabled] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [galleryNFTs, setGalleryNFTs] = useState<GalleryNFT[]>([
    { id: '1', tokenId: '1001', title: 'First Trip to Paris', description: 'Eiffel Tower sunset', image: '/images/paris.jpg', blockchain: 'Ethereum', contractAddress: '0x123...abc', createdAt: '2024-01-16', likes: 45, views: 230, isPublic: true },
    { id: '2', tokenId: '1002', title: 'Beach Day', description: 'Beautiful sunset at the beach', image: '/images/beach.jpg', blockchain: 'Polygon', contractAddress: '0x456...def', createdAt: '2024-02-21', likes: 32, views: 180, isPublic: true },
    { id: '3', tokenId: '1003', title: 'Mountain Hiking', description: 'Reached the summit', image: '/images/mountain.jpg', blockchain: 'Ethereum', contractAddress: '0x789...ghi', createdAt: '2024-03-11', likes: 67, views: 320, isPublic: true },
    { id: '4', tokenId: '1004', title: 'City Nightlife', description: 'Tokyo at night', image: '/images/tokyo.jpg', blockchain: 'Solana', contractAddress: '0xabc...def', createdAt: '2024-04-06', likes: 28, views: 150, isPublic: false },
    { id: '5', tokenId: '1005', title: 'Forest Adventure', description: 'Exploring the woods', image: '/images/forest.jpg', blockchain: 'Polygon', contractAddress: '0xdef...ghi', createdAt: '2024-05-10', likes: 55, views: 290, isPublic: true },
  ]);

  const togglePublic = (id: string) => {
    setGalleryNFTs(galleryNFTs.map(nft => 
      nft.id === id ? { ...nft, isPublic: !nft.isPublic } : nft
    ));
  };

  const likeNFT = (id: string) => {
    setGalleryNFTs(galleryNFTs.map(nft => nft.id === id ? { ...nft, likes: nft.likes + 1 } : nft));
  };

  const getBlockchainColor = (blockchain: string) => {
    switch (blockchain) {
      case 'Ethereum': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'Polygon': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'Solana': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'BSC': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <ImageIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              NFT Gallery Display
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Display NFTs in profile
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isGalleryEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isGalleryEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total NFTs</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{galleryNFTs.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Public</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{galleryNFTs.filter(n => n.isPublic).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Likes</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{galleryNFTs.reduce((acc, n) => acc + n.likes, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Views</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{galleryNFTs.reduce((acc, n) => acc + n.views, 0)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isGalleryEnabled}
              onChange={(e) => setIsGalleryEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Gallery</span>
          </div>
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            {viewMode === 'grid' ? <List className="h-3 w-3" /> : <Grid className="h-3 w-3" />}
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">NFT Gallery ({galleryNFTs.length})</h4>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {galleryNFTs.map((nft) => (
                <div key={nft.id} className={`p-3 rounded-lg border ${nft.isPublic ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                  <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-lg mb-2 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-slate-400" />
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">{nft.title}</span>
                      {nft.isPublic && (
                        <span className="px-1 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Public
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{nft.description}</p>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${getBlockchainColor(nft.blockchain)}`}>
                      {nft.blockchain}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">#{nft.tokenId}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400" />
                      {nft.likes}
                    </span>
                    <span>{nft.views} views</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => togglePublic(nft.id)}
                      className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      {nft.isPublic ? 'Hide' : 'Show'}
                    </button>
                    <button
                      type="button"
                      onClick={() => likeNFT(nft.id)}
                      className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                    >
                      <Star className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {galleryNFTs.map((nft) => (
                <div key={nft.id} className={`p-3 rounded-lg border ${nft.isPublic ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-slate-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-slate-900 dark:text-white">{nft.title}</span>
                          {nft.isPublic && (
                            <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                              Public
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{nft.description}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {nft.blockchain} • #{nft.tokenId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400" />
                          {nft.likes}
                        </span>
                        <span>{nft.views} views</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{nft.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => togglePublic(nft.id)}
                      className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      {nft.isPublic ? 'Hide' : 'Show'}
                    </button>
                    <button
                      type="button"
                      onClick={() => likeNFT(nft.id)}
                      className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                    >
                      <Star className="h-3 w-3" />
                      Like
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                    >
                      <Share2 className="h-3 w-3" />
                      Share
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Gallery Display Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Display NFTs in grid or list view</li>
              <li>• Control visibility of each NFT (public/private)</li>
              <li>• Track likes and views on each NFT</li>
              <li>• Share NFTs with external links</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
