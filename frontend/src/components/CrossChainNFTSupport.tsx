'use client';

import { useState } from 'react';
import { Link2, X, RefreshCw, Info, CheckCircle, Star, Zap, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';

interface CrossChainNFTSupportProps {
  onCancel?: () => void;
}

interface Blockchain {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  isEnabled: boolean;
  networkId: string;
  gasPrice: number;
  blockTime: number;
}

interface CrossChainBridge {
  id: string;
  fromChain: string;
  toChain: string;
  nftId: string;
  status: 'pending' | 'completed' | 'failed';
  initiatedAt: string;
  completedAt?: string;
  transactionHash: string;
}

interface NFTLocation {
  nftId: string;
  tokenId: string;
  blockchain: string;
  contractAddress: string;
  owner: string;
}

export default function CrossChainNFTSupport({ onCancel }: CrossChainNFTSupportProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isCrossChainEnabled, setIsCrossChainEnabled] = useState(true);

  const [blockchains, setBlockchains] = useState<Blockchain[]>([
    { id: '1', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', isEnabled: true, networkId: '1', gasPrice: 20, blockTime: 15 },
    { id: '2', name: 'Polygon', symbol: 'MATIC', icon: '⬡', isEnabled: true, networkId: '137', gasPrice: 1, blockTime: 2 },
    { id: '3', name: 'Solana', symbol: 'SOL', icon: '◎', isEnabled: true, networkId: 'mainnet-beta', gasPrice: 0.00025, blockTime: 0.4 },
    { id: '4', name: 'BSC', symbol: 'BNB', icon: '◈', isEnabled: false, networkId: '56', gasPrice: 3, blockTime: 3 },
  ]);

  const [crossChainBridges, setCrossChainBridges] = useState<CrossChainBridge[]>([
    { id: '1', fromChain: 'Ethereum', toChain: 'Polygon', nftId: '1001', status: 'completed', initiatedAt: '2024-01-16', completedAt: '2024-01-16', transactionHash: '0x123...abc' },
    { id: '2', fromChain: 'Polygon', toChain: 'Ethereum', nftId: '1002', status: 'pending', initiatedAt: '2024-02-21', transactionHash: '0x456...def' },
    { id: '3', fromChain: 'Ethereum', toChain: 'Solana', nftId: '1003', status: 'failed', initiatedAt: '2024-03-11', transactionHash: '0x789...ghi' },
  ]);

  const [nftLocations, setNftLocations] = useState<NFTLocation[]>([
    { nftId: '1001', tokenId: '1001', blockchain: 'Polygon', contractAddress: '0xabc...def', owner: '0x123...abc' },
    { nftId: '1002', tokenId: '1002', blockchain: 'Ethereum', contractAddress: '0xdef...ghi', owner: '0x456...def' },
    { nftId: '1003', tokenId: '1003', blockchain: 'Ethereum', contractAddress: '0xghi...jkl', owner: '0x789...ghi' },
  ]);

  const toggleBlockchain = (id: string) => {
    setBlockchains(blockchains.map(chain => 
      chain.id === id ? { ...chain, isEnabled: !chain.isEnabled } : chain
    ));
  };

  const initiateBridge = (fromChain: string, toChain: string, nftId: string) => {
    const newBridge: CrossChainBridge = {
      id: Date.now().toString(),
      fromChain,
      toChain,
      nftId,
      status: 'pending',
      initiatedAt: new Date().toISOString().split('T')[0],
      transactionHash: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 3)}`,
    };
    setCrossChainBridges([...crossChainBridges, newBridge]);
  };

  const completeBridge = (id: string) => {
    setCrossChainBridges(crossChainBridges.map(bridge => 
      bridge.id === id 
        ? { ...bridge, status: 'completed' as const, completedAt: new Date().toISOString().split('T')[0] }
        : bridge
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
            <Link2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Cross-chain NFT Support
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Support NFTs across multiple blockchains
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isCrossChainEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isCrossChainEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Blockchains</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{blockchains.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{blockchains.filter(b => b.isEnabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Bridges</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{crossChainBridges.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Completed</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{crossChainBridges.filter(b => b.status === 'completed').length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isCrossChainEnabled}
              onChange={(e) => setIsCrossChainEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Cross-chain</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Link2 className="h-3 w-3" />
            Initiate Bridge
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Supported Blockchains</h4>
          <div className="space-y-2">
            {blockchains.map((blockchain) => (
              <div key={blockchain.id} className={`p-3 rounded-lg border ${blockchain.isEnabled ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{blockchain.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{blockchain.name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{blockchain.symbol}</span>
                        {blockchain.isEnabled && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Network ID: {blockchain.networkId} • Block Time: {blockchain.blockTime}s
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{blockchain.gasPrice} Gwei</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Gas Price</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleBlockchain(blockchain.id)}
                  className={`px-2 py-1 rounded text-xs ${blockchain.isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                >
                  {blockchain.isEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Cross-chain Bridges</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {crossChainBridges.map((bridge) => (
              <div key={bridge.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Link2 className="h-4 w-4 text-cyan-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">#{bridge.nftId}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(bridge.status)}`}>
                          {bridge.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>{bridge.fromChain}</span>
                        <ArrowRight className="h-3 w-3" />
                        <span>{bridge.toChain}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{bridge.initiatedAt}</p>
                    {bridge.completedAt && (
                      <p className="text-xs text-green-600 dark:text-green-400">Completed: {bridge.completedAt}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{bridge.transactionHash}</span>
                  {bridge.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => completeBridge(bridge.id)}
                      className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">NFT Locations</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {nftLocations.map((location) => (
              <div key={location.nftId} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-blue-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">Token #{location.tokenId}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {location.blockchain} • {location.contractAddress}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Owner: {location.owner}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Cross-chain Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• NFTs can be bridged across multiple blockchains</li>
              <li>• Supported chains: Ethereum, Polygon, Solana, BSC</li>
              <li>• Bridge transactions track status and hash</li>
              <li>• NFT locations tracked across all chains</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
