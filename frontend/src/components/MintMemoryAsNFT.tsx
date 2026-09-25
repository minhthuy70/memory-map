'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Gem,
  Image,
  Info,
  RefreshCw,
  Share2,
  Star,
  Upload,
  Wallet,
  Zap
} from 'lucide-react';

interface MintMemoryAsNFTProps {
  onCancel?: () => void;
}

interface Memory {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  isMinted: boolean;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

interface MintedNFT {
  id: string;
  memoryId: string;
  tokenId: string;
  contractAddress: string;
  blockchain: string;
  owner: string;
  mintedAt: string;
  transactionHash: string;
}

export default function MintMemoryAsNFT({ onCancel }: MintMemoryAsNFTProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isMintingEnabled, setIsMintingEnabled] = useState(true);

  const [memories, setMemories] = useState<Memory[]>([
    { id: '1', title: 'First Trip to Paris', description: 'Eiffel Tower sunset', image: '/images/paris.jpg', date: '2024-01-15', location: 'Paris, France', isMinted: true },
    { id: '2', title: 'Beach Day', description: 'Beautiful sunset at the beach', image: '/images/beach.jpg', date: '2024-02-20', location: 'California, USA', isMinted: false },
    { id: '3', title: 'Mountain Hiking', description: 'Reached the summit', image: '/images/mountain.jpg', date: '2024-03-10', location: 'Swiss Alps', isMinted: false },
    { id: '4', title: 'City Nightlife', description: 'Tokyo at night', image: '/images/tokyo.jpg', date: '2024-04-05', location: 'Tokyo, Japan', isMinted: true },
  ]);

  const [mintedNFTs, setMintedNFTs] = useState<MintedNFT[]>([
    { id: '1', memoryId: '1', tokenId: '1001', contractAddress: '0x123...abc', blockchain: 'Ethereum', owner: '0x456...def', mintedAt: '2024-01-16', transactionHash: '0x789...ghi' },
    { id: '2', memoryId: '4', tokenId: '1002', contractAddress: '0xabc...def', blockchain: 'Polygon', owner: '0xdef...ghi', mintedAt: '2024-04-06', transactionHash: '0xghi...jkl' },
  ]);

  const [selectedBlockchain, setSelectedBlockchain] = useState('Ethereum');

  const blockchains = ['Ethereum', 'Polygon', 'Solana', 'BSC'];

  const mintNFT = (memoryId: string) => {
    const memory = memories.find(m => m.id === memoryId);
    if (!memory) return;

    const newNFT: MintedNFT = {
      id: Date.now().toString(),
      memoryId,
      tokenId: (1000 + mintedNFTs.length + 1).toString(),
      contractAddress: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 3)}`,
      blockchain: selectedBlockchain,
      owner: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 3)}`,
      mintedAt: new Date().toISOString().split('T')[0],
      transactionHash: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 3)}`,
    };

    setMintedNFTs([...mintedNFTs, newNFT]);
    setMemories(memories.map(m => m.id === memoryId ? { ...m, isMinted: true } : m));
  };

  const generateMetadata = (memory: Memory): NFTMetadata => {
    return {
      name: memory.title,
      description: memory.description,
      image: memory.image,
      attributes: [
        { trait_type: 'Date', value: memory.date },
        { trait_type: 'Location', value: memory.location },
        { trait_type: 'Type', value: 'Memory' },
      ],
    };
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Gem className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Mint Memory as NFT
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Turn memories into NFTs on blockchain
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isMintingEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isMintingEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Memories</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{memories.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Minted</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{memories.filter(m => m.isMinted).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total NFTs</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{mintedNFTs.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Blockchains</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{blockchains.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isMintingEnabled}
              onChange={(e) => setIsMintingEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Minting</span>
          </div>
          <select
            value={selectedBlockchain}
            onChange={(e) => setSelectedBlockchain(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            {blockchains.map(chain => (
              <option key={chain} value={chain}>{chain}</option>
            ))}
          </select>
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Memories</h4>
          <div className="space-y-2">
            {memories.map((memory) => (
              <div key={memory.id} className={`p-3 rounded-lg border ${memory.isMinted ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Image className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{memory.title}</span>
                        {memory.isMinted && (
                          <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            Minted
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{memory.description}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{memory.date} • {memory.location}</p>
                    </div>
                  </div>
                  {!memory.isMinted && (
                    <button
                      type="button"
                      onClick={() => mintNFT(memory.id)}
                      className="px-2 py-1 rounded text-xs bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1"
                    >
                      <Gem className="h-3 w-3" />
                      Mint NFT
                    </button>
                  )}
                </div>
                {memory.isMinted && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Token ID: {mintedNFTs.find(n => n.memoryId === memory.id)?.tokenId}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Minted NFTs</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {mintedNFTs.map((nft) => {
              const memory = memories.find(m => m.id === nft.memoryId);
              return (
                <div key={nft.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Gem className="h-4 w-4 text-purple-400" />
                      <div>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{memory?.title}</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Token ID: {nft.tokenId} • {nft.blockchain}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                      >
                        <Share2 className="h-3 w-3" />
                        Share
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Contract: {nft.contractAddress}</span>
                    <span>•</span>
                    <span>Minted: {nft.mintedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">NFT Minting Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Memories can be minted as NFTs on multiple blockchains</li>
              <li>• Each NFT has unique metadata and token ID</li>
              <li>• Minted NFTs are verifiable on blockchain</li>
              <li>• NFTs can be traded on marketplaces</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
