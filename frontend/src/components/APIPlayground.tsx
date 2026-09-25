'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Code,
  ExternalLink,
  Info,
  Play,
  Plus,
  RefreshCw,
  Send,
  Settings,
  Trash2
} from 'lucide-react';

interface APIPlaygroundProps {
  onCancel?: () => void;
}

interface PlaygroundRequest {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  headers: { key: string; value: string }[];
  body?: string;
  response?: string;
  statusCode?: number;
  lastExecuted?: string;
}

interface PlaygroundHistory {
  id: string;
  name: string;
  method: string;
  endpoint: string;
  executedAt: string;
  statusCode: number;
}

export default function APIPlayground({ onCancel }: APIPlaygroundProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isPlaygroundEnabled, setIsPlaygroundEnabled] = useState(true);

  const [playgroundRequests, setPlaygroundRequests] = useState<PlaygroundRequest[]>([
    { 
      id: '1', 
      name: 'Get Memories', 
      method: 'GET', 
      endpoint: '/api/v2/memories', 
      headers: [{ key: 'Authorization', value: 'Bearer sk_live_...' }],
      response: '{"data": [...], "total": 100}',
      statusCode: 200,
      lastExecuted: '2024-01-17 18:30'
    },
    { 
      id: '2', 
      name: 'Create Memory', 
      method: 'POST', 
      endpoint: '/api/v2/memories', 
      headers: [{ key: 'Authorization', value: 'Bearer sk_live_...' }, { key: 'Content-Type', value: 'application/json' }],
      body: '{"title": "Test Memory", "content": "Test content"}',
      response: '{"id": "mem123", "title": "Test Memory"}',
      statusCode: 201,
      lastExecuted: '2024-01-16 10:15'
    },
  ]);

  const [playgroundHistory, setPlaygroundHistory] = useState<PlaygroundHistory[]>([
    { id: '1', name: 'Get Memories', method: 'GET', endpoint: '/api/v2/memories', executedAt: '2024-01-17 18:30', statusCode: 200 },
    { id: '2', name: 'Create Memory', method: 'POST', endpoint: '/api/v2/memories', executedAt: '2024-01-16 10:15', statusCode: 201 },
    { id: '3', name: 'Get Memory', method: 'GET', endpoint: '/api/v2/memories/mem123', executedAt: '2024-01-15 14:00', statusCode: 200 },
  ]);

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'POST': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'PUT': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'DELETE': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'PATCH': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const executeRequest = (id: string) => {
    const request = playgroundRequests.find(r => r.id === id);
    if (!request) return;

    setPlaygroundRequests(playgroundRequests.map(r => 
      r.id === id ? { ...r, lastExecuted: new Date().toISOString().replace('T', ' ').substring(0, 16) } : r
    ));

    const historyItem: PlaygroundHistory = {
      id: Date.now().toString(),
      name: request.name,
      method: request.method,
      endpoint: request.endpoint,
      executedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      statusCode: request.statusCode || 200,
    };
    setPlaygroundHistory([historyItem, ...playgroundHistory]);
  };

  const createRequest = () => {
    const newRequest: PlaygroundRequest = {
      id: Date.now().toString(),
      name: 'New Request',
      method: 'GET',
      endpoint: '/api/v2/',
      headers: [{ key: 'Authorization', value: 'Bearer sk_live_...' }],
    };
    setPlaygroundRequests([...playgroundRequests, newRequest]);
  };

  const deleteRequest = (id: string) => {
    setPlaygroundRequests(playgroundRequests.filter(r => r.id !== id));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl">
            <Play className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              API Playground (Swagger UI)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Playground API tương tác
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isPlaygroundEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isPlaygroundEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Requests</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{playgroundRequests.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">History</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{playgroundHistory.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Success Rate</p>
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400">
              {((playgroundHistory.filter(h => h.statusCode < 400).length / playgroundHistory.length) * 100).toFixed(0)}%
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Response</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">200ms</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isPlaygroundEnabled}
              onChange={(e) => setIsPlaygroundEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Playground</span>
          </div>
          <button
            type="button"
            onClick={createRequest}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            New Request
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Saved Requests</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {playgroundRequests.map((request) => (
              <div key={request.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                      <Code className="h-4 w-4 text-teal-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{request.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getMethodColor(request.method)}`}>
                          {request.method}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{request.endpoint}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => executeRequest(request.id)}
                      className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                    >
                      <Send className="h-3 w-3" />
                      Execute
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteRequest(request.id)}
                      className="px-2 py-1 rounded text-xs bg-slate-600 hover:bg-slate-700 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {request.statusCode && (
                  <div className="flex gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Status: {request.statusCode}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Last: {request.lastExecuted}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Execution History</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {playgroundHistory.map((history) => (
              <div key={history.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <Clock className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{history.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getMethodColor(history.method)}`}>
                          {history.method}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${history.statusCode < 400 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
                          {history.statusCode}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{history.endpoint}</p>
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">API Playground Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Test API endpoints interactively</li>
              <li>• Save frequently used requests</li>
              <li>• View execution history</li>
              <li>• Configure headers and body</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
