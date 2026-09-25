'use client';

import { useState } from 'react';
import { Network, X, RefreshCw, Info, CheckCircle, Star, Zap, Link, Circle, ArrowRight } from 'lucide-react';

interface AIMemoryConnectionGraphProps {
  onCancel?: () => void;
}

interface MemoryNode {
  id: string;
  title: string;
  date: string;
  category: string;
  connections: number;
}

interface MemoryConnection {
  id: string;
  fromId: string;
  toId: string;
  strength: number;
  type: 'temporal' | 'spatial' | 'thematic' | 'social';
}

interface GraphView {
  id: string;
  name: string;
  description: string;
  nodeCount: number;
  edgeCount: number;
}

export default function AIMemoryConnectionGraph({ onCancel }: AIMemoryConnectionGraphProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isGraphEnabled, setIsGraphEnabled] = useState(true);

  const [memoryNodes, setMemoryNodes] = useState<MemoryNode[]>([
    { id: '1', title: 'Paris Trip', date: '2024-01-15', category: 'Travel', connections: 3 },
    { id: '2', title: 'Beach Day', date: '2024-02-20', category: 'Relaxation', connections: 2 },
    { id: '3', title: 'Family Dinner', date: '2024-03-10', category: 'Social', connections: 4 },
    { id: '4', title: 'Mountain Hike', date: '2024-04-05', category: 'Adventure', connections: 2 },
  ]);

  const [memoryConnections, setMemoryConnections] = useState<MemoryConnection[]>([
    { id: '1', fromId: '1', toId: '2', strength: 0.85, type: 'temporal' },
    { id: '2', fromId: '1', toId: '3', strength: 0.72, type: 'thematic' },
    { id: '3', fromId: '2', toId: '4', strength: 0.68, type: 'spatial' },
    { id: '4', fromId: '3', toId: '4', strength: 0.75, type: 'social' },
  ]);

  const [graphViews, setGraphViews] = useState<GraphView[]>([
    { id: '1', name: 'Timeline View', description: 'Connections over time', nodeCount: 4, edgeCount: 4 },
    { id: '2', name: 'Category View', description: 'Connections by category', nodeCount: 4, edgeCount: 6 },
    { id: '3', name: 'Influence View', description: 'Strongest connections', nodeCount: 4, edgeCount: 3 },
  ]);

  const generateGraph = () => {
    const newNode: MemoryNode = {
      id: Date.now().toString(),
      title: `Memory ${memoryNodes.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      category: 'General',
      connections: Math.floor(Math.random() * 3) + 1,
    };
    setMemoryNodes([...memoryNodes, newNode]);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'temporal': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'spatial': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'thematic': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'social': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Travel': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'Relaxation': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'Social': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'Adventure': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'General': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl">
            <Network className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Memory Connection Graph
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Visualize connections between memories
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isGraphEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isGraphEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Nodes</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{memoryNodes.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Connections</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{memoryConnections.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Strength</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{(memoryConnections.reduce((acc, c) => acc + c.strength, 0) / memoryConnections.length).toFixed(2)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Graph Views</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{graphViews.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isGraphEnabled}
              onChange={(e) => setIsGraphEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Graph</span>
          </div>
          <button
            type="button"
            onClick={generateGraph}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Network className="h-3 w-3" />
            Generate Graph
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Graph Views</h4>
          <div className="space-y-2">
            {graphViews.map((view) => (
              <div key={view.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Network className="h-4 w-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{view.name}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{view.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{view.nodeCount} nodes</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{view.edgeCount} edges</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Memory Nodes</h4>
          <div className="space-y-2">
            {memoryNodes.map((node) => (
              <div key={node.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Circle className="h-4 w-4 text-emerald-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{node.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(node.category)}`}>
                          {node.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{node.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{node.connections}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">connections</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Memory Connections</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {memoryConnections.map((connection) => (
              <div key={connection.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Link className="h-4 w-4 text-emerald-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {memoryNodes.find(n => n.id === connection.fromId)?.title}
                        </span>
                        <ArrowRight className="h-3 w-3 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {memoryNodes.find(n => n.id === connection.toId)?.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(connection.type)}`}>
                          {connection.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{(connection.strength * 100).toFixed(0)}%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">strength</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Connection Graph Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Visualize relationships between memories</li>
              <li>• Connection types: temporal, spatial, thematic, social</li>
              <li>• Multiple graph views (timeline, category, influence)</li>
              <li>• Connection strength indicates relationship depth</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
