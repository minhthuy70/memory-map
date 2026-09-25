'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Code,
  Database,
  ExternalLink,
  Info,
  Play,
  Plus,
  RefreshCw,
  Settings,
  Trash2
} from 'lucide-react';

interface GraphQLEndpointProps {
  onCancel?: () => void;
}

interface GraphQLType {
  id: string;
  name: string;
  kind: 'scalar' | 'object' | 'interface' | 'enum' | 'union' | 'input';
  description: string;
  fields: number;
}

interface GraphQLQuery {
  id: string;
  name: string;
  type: 'query' | 'mutation' | 'subscription';
  query: string;
  variables?: string;
  lastExecuted?: string;
  executionTime?: number;
}

interface GraphQLHistory {
  id: string;
  queryName: string;
  type: string;
  executedAt: string;
  duration: number;
  status: 'success' | 'error';
}

export default function GraphQLEndpoint({ onCancel }: GraphQLEndpointProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isGraphQLEnabled, setIsGraphQLEnabled] = useState(true);

  const [graphQLTypes, setGraphQLTypes] = useState<GraphQLType[]>([
    { id: '1', name: 'Memory', kind: 'object', description: 'Memory object type', fields: 12 },
    { id: '2', name: 'Query', kind: 'object', description: 'Root query type', fields: 8 },
    { id: '3', name: 'Mutation', kind: 'object', description: 'Root mutation type', fields: 5 },
    { id: '4', name: 'MemoryStatus', kind: 'enum', description: 'Memory status enum', fields: 3 },
    { id: '5', name: 'ID', kind: 'scalar', description: 'ID scalar type', fields: 0 },
  ]);

  const [graphQLQueries, setGraphQLQueries] = useState<GraphQLQuery[]>([
    { 
      id: '1', 
      name: 'Get Memories', 
      type: 'query', 
      query: 'query { memories { id title content createdAt } }',
      lastExecuted: '2024-01-17 18:30',
      executionTime: 45
    },
    { 
      id: '2', 
      name: 'Create Memory', 
      type: 'mutation', 
      query: 'mutation { createMemory(input: { title: "Test", content: "Test" }) { id title } }',
      variables: '{ "title": "Test", "content": "Test" }',
      lastExecuted: '2024-01-16 10:15',
      executionTime: 62
    },
  ]);

  const [graphQLHistory, setGraphQLHistory] = useState<GraphQLHistory[]>([
    { id: '1', queryName: 'Get Memories', type: 'query', executedAt: '2024-01-17 18:30', duration: 45, status: 'success' },
    { id: '2', queryName: 'Create Memory', type: 'mutation', executedAt: '2024-01-16 10:15', duration: 62, status: 'success' },
    { id: '3', queryName: 'Get Memory', type: 'query', executedAt: '2024-01-15 14:00', duration: 38, status: 'success' },
  ]);

  const getTypeColor = (kind: string) => {
    switch (kind) {
      case 'scalar': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'object': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'interface': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'enum': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'union': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'input': return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const executeQuery = (id: string) => {
    const query = graphQLQueries.find(q => q.id === id);
    if (!query) return;

    setGraphQLQueries(graphQLQueries.map(q => 
      q.id === id ? { ...q, lastExecuted: new Date().toISOString().replace('T', ' ').substring(0, 16), executionTime: Math.floor(Math.random() * 100) + 20 } : q
    ));

    const historyItem: GraphQLHistory = {
      id: Date.now().toString(),
      queryName: query.name,
      type: query.type,
      executedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      duration: Math.floor(Math.random() * 100) + 20,
      status: 'success',
    };
    setGraphQLHistory([historyItem, ...graphQLHistory]);
  };

  const createQuery = () => {
    const newQuery: GraphQLQuery = {
      id: Date.now().toString(),
      name: 'New Query',
      type: 'query',
      query: 'query { }',
    };
    setGraphQLQueries([...graphQLQueries, newQuery]);
  };

  const deleteQuery = (id: string) => {
    setGraphQLQueries(graphQLQueries.filter(q => q.id !== id));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              GraphQL Endpoint
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Endpoint GraphQL
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isGraphQLEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isGraphQLEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Types</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{graphQLTypes.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Queries</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">{graphQLQueries.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">History</p>
            <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{graphQLHistory.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Time</p>
            <p className="text-lg font-bold text-fuchsia-600 dark:text-fuchsia-400">
              {graphQLHistory.length > 0 ? Math.floor(graphQLHistory.reduce((acc, h) => acc + h.duration, 0) / graphQLHistory.length) : 0}ms
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isGraphQLEnabled}
              onChange={(e) => setIsGraphQLEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable GraphQL</span>
          </div>
          <button
            type="button"
            onClick={createQuery}
            className="px-3 py-1.5 rounded-lg text-xs bg-pink-600 hover:bg-pink-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            New Query
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">GraphQL Schema Types</h4>
          <div className="space-y-2">
            {graphQLTypes.map((type) => (
              <div key={type.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                      <Database className="h-4 w-4 text-rose-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{type.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(type.kind)}`}>
                          {type.kind}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{type.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Fields: {type.fields}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Saved Queries</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {graphQLQueries.map((query) => (
              <div key={query.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-lg">
                      <Code className="h-4 w-4 text-fuchsia-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{query.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${query.type === 'query' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : query.type === 'mutation' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'}`}>
                          {query.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">{query.query.substring(0, 50)}...</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => executeQuery(query.id)}
                      className="px-2 py-1 rounded text-xs bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-1"
                    >
                      <Play className="h-3 w-3" />
                      Execute
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteQuery(query.id)}
                      className="px-2 py-1 rounded text-xs bg-slate-600 hover:bg-slate-700 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  {query.executionTime && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">Time: {query.executionTime}ms</span>
                  )}
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last: {query.lastExecuted || 'Never'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Query History</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {graphQLHistory.map((history) => (
              <div key={history.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                      <Clock className="h-4 w-4 text-violet-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{history.queryName}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${history.status === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
                          {history.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{history.type} • {history.duration}ms</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{history.executedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">GraphQL Endpoint Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Use GraphQL for flexible data queries</li>
              <li>• Save frequently used queries</li>
              <li>• View schema types and fields</li>
              <li>• Monitor query execution times</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
