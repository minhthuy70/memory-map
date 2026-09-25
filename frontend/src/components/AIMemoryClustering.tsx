'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Folder,
  Info,
  Layers,
  RefreshCw,
  Sparkles,
  Star,
  Tag,
  Zap
} from 'lucide-react';

interface AIMemoryClusteringProps {
  onCancel?: () => void;
}

interface MemoryCluster {
  id: string;
  name: string;
  description: string;
  memoryCount: number;
  similarity: number;
  category: string;
  createdAt: string;
}

interface ClusteredMemory {
  id: string;
  title: string;
  clusterId: string;
  similarity: number;
  date: string;
}

interface ClusteringAlgorithm {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export default function AIMemoryClustering({ onCancel }: AIMemoryClusteringProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isClusteringEnabled, setIsClusteringEnabled] = useState(true);

  const [memoryClusters, setMemoryClusters] = useState<MemoryCluster[]>([
    { id: '1', name: 'Beach Memories', description: 'All beach-related memories', memoryCount: 25, similarity: 0.92, category: 'Travel', createdAt: '2024-01-15' },
    { id: '2', name: 'Family Events', description: 'Family gatherings and celebrations', memoryCount: 18, similarity: 0.88, category: 'Social', createdAt: '2024-02-20' },
    { id: '3', name: 'Mountain Adventures', description: 'Hiking and mountain trips', memoryCount: 12, similarity: 0.85, category: 'Adventure', createdAt: '2024-03-10' },
    { id: '4', name: 'City Explorations', description: 'Urban experiences and city tours', memoryCount: 15, similarity: 0.90, category: 'Travel', createdAt: '2024-04-05' },
  ]);

  const [clusteredMemories, setClusteredMemories] = useState<ClusteredMemory[]>([
    { id: '1', title: 'Sunny Beach Day', clusterId: '1', similarity: 0.95, date: '2024-01-15' },
    { id: '2', title: 'Family PartyPopper', clusterId: '2', similarity: 0.92, date: '2024-02-20' },
    { id: '3', title: 'Mountain Summit', clusterId: '3', similarity: 0.88, date: '2024-03-10' },
    { id: '4', title: 'City Sunset Walk', clusterId: '4', similarity: 0.90, date: '2024-04-05' },
  ]);

  const [clusteringAlgorithms, setClusteringAlgorithms] = useState<ClusteringAlgorithm[]>([
    { id: '1', name: 'K-Means', description: 'Iterative clustering algorithm', isActive: true },
    { id: '2', name: 'DBSCAN', description: 'Density-based clustering', isActive: false },
    { id: '3', name: 'Hierarchical', description: 'Tree-based clustering', isActive: false },
  ]);

  const runClustering = () => {
    const newCluster: MemoryCluster = {
      id: Date.now().toString(),
      name: `Cluster ${memoryClusters.length + 1}`,
      description: 'AI-generated memory cluster',
      memoryCount: Math.floor(Math.random() * 20) + 5,
      similarity: Math.random() * 0.15 + 0.75,
      category: 'General',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMemoryClusters([...memoryClusters, newCluster]);
  };

  const toggleAlgorithm = (id: string) => {
    setClusteringAlgorithms(clusteringAlgorithms.map(algo => 
      algo.id === id ? { ...algo, isActive: !algo.isActive } : algo
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Travel': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'Social': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'Adventure': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'General': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Memory Clustering
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Group related memories with AI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isClusteringEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isClusteringEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Clusters</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{memoryClusters.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Memories</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{memoryClusters.reduce((acc, c) => acc + c.memoryCount, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Similarity</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{(memoryClusters.reduce((acc, c) => acc + c.similarity, 0) / memoryClusters.length).toFixed(2)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Algorithms</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{clusteringAlgorithms.filter(a => a.isActive).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isClusteringEnabled}
              onChange={(e) => setIsClusteringEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Clustering</span>
          </div>
          <button
            type="button"
            onClick={runClustering}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3" />
            Run Clustering
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Clustering Algorithms</h4>
          <div className="space-y-2">
            {clusteringAlgorithms.map((algorithm) => (
              <div key={algorithm.id} className={`p-3 rounded-lg border ${algorithm.isActive ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Layers className="h-4 w-4 text-cyan-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{algorithm.name}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{algorithm.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleAlgorithm(algorithm.id)}
                    className={`px-2 py-1 rounded text-xs ${algorithm.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {algorithm.isActive ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Memory Clusters</h4>
          <div className="space-y-2">
            {memoryClusters.map((cluster) => (
              <div key={cluster.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Folder className="h-4 w-4 text-cyan-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{cluster.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(cluster.category)}`}>
                          {cluster.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{cluster.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{cluster.memoryCount}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">memories</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Similarity: {(cluster.similarity * 100).toFixed(0)}%</span>
                    <span>•</span>
                    <span>Created: {cluster.createdAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Clustered Memories</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {clusteredMemories.map((memory) => (
              <div key={memory.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Tag className="h-4 w-4 text-cyan-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{memory.title}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Cluster: {memoryClusters.find(c => c.id === memory.clusterId)?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{(memory.similarity * 100).toFixed(0)}% match</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Memory Clustering Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI groups related memories automatically</li>
              <li>• Multiple clustering algorithms (K-Means, DBSCAN, Hierarchical)</li>
              <li>• Similarity scores for cluster quality</li>
              <li>• Categorization by travel, social, adventure, general</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
