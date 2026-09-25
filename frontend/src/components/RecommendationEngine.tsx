'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Filter,
  RefreshCw,
  Settings,
  Sparkles,
  Target,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Zap
} from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'memory' | 'activity' | 'location' | 'category';
  title: string;
  description: string;
  confidence: number;
  reason: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

interface RecommendationModel {
  id: string;
  name: string;
  type: 'collaborative' | 'content' | 'hybrid';
  accuracy: number;
  lastUpdated: Date;
}

interface RecommendationEngineProps {
  onCancel?: () => void;
  onGenerateRecommendations?: () => Promise<void>;
}

const DEFAULT_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    type: 'memory',
    title: 'Capture Weekend Memories',
    description: 'Based on your pattern, you tend to create more memories on weekends',
    confidence: 0.92,
    reason: 'High weekend activity pattern detected',
    timestamp: new Date(),
    status: 'pending',
  },
  {
    id: 'rec-2',
    type: 'location',
    title: 'Visit Da Nang Beach',
    description: 'Perfect weather conditions and your travel history suggest this location',
    confidence: 0.85,
    reason: 'Travel preference + seasonal pattern',
    timestamp: new Date(Date.now() - 3600000),
    status: 'pending',
  },
  {
    id: 'rec-3',
    type: 'activity',
    title: 'Create Travel Album',
    description: 'Your travel memories are scattered; organize them into albums',
    confidence: 0.78,
    reason: 'High travel memory count',
    timestamp: new Date(Date.now() - 7200000),
    status: 'pending',
  },
  {
    id: 'rec-4',
    type: 'category',
    title: 'Add Career Milestones',
    description: 'Your career memories are underrepresented',
    confidence: 0.72,
    reason: 'Category imbalance detected',
    timestamp: new Date(Date.now() - 10800000),
    status: 'accepted',
  },
];

const DEFAULT_MODELS: RecommendationModel[] = [
  {
    id: 'model-1',
    name: 'Collaborative Filtering',
    type: 'collaborative',
    accuracy: 0.88,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'model-2',
    name: 'Content-Based',
    type: 'content',
    accuracy: 0.82,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'model-3',
    name: 'Hybrid Model',
    type: 'hybrid',
    accuracy: 0.92,
    lastUpdated: new Date('2024-01-01'),
  },
];

export default function RecommendationEngine({ onCancel, onGenerateRecommendations }: RecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(DEFAULT_RECOMMENDATIONS);
  const [models, setModels] = useState<RecommendationModel[]>(DEFAULT_MODELS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState('model-3');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'memory':
        return <Activity className="h-4 w-4" />;
      case 'activity':
        return <Sparkles className="h-4 w-4" />;
      case 'location':
        return <Target className="h-4 w-4" />;
      case 'category':
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'memory':
        return 'text-blue-500';
      case 'activity':
        return 'text-purple-500';
      case 'location':
        return 'text-green-500';
      case 'category':
        return 'text-orange-500';
      default:
        return 'text-slate-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  const handleAccept = (id: string) => {
    setRecommendations(recs => recs.map(r => 
      r.id === id ? { ...r, status: 'accepted' as const } : r
    ));
  };

  const handleReject = (id: string) => {
    setRecommendations(recs => recs.map(r => 
      r.id === id ? { ...r, status: 'rejected' as const } : r
    ));
  };

  const filteredRecommendations = recommendations.filter(r => 
    selectedType === 'all' || r.type === selectedType
  );

  const avgConfidence = recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length;
  const acceptedCount = recommendations.filter(r => r.status === 'accepted').length;
  const pendingCount = recommendations.filter(r => r.status === 'pending').length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Engine đề xuất
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI-powered recommendations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Cài đặt"
          >
            <Settings className="h-4 w-4 text-slate-500" />
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

      {showSettings && (
        <div className="mb-4 p-4 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt recommendation engine
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Recommendation model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
              >
                {models.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({(m.accuracy * 100).toFixed(0)}% accuracy)</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-refresh
              </span>
              <button
                type="button"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoRefresh ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoRefresh ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {recommendations.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <ThumbsUp className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Accepted</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {acceptedCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Pending</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {pendingCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Confidence</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(avgConfidence * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Type Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedType('all')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'all'
                ? 'bg-pink-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('memory')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'memory'
                ? 'bg-pink-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Memory
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('activity')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'activity'
                ? 'bg-pink-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Activity
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('location')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'location'
                ? 'bg-pink-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Location
          </button>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Recommendations
        </h4>
        <div className="space-y-2">
          {filteredRecommendations.map((rec) => (
            <div
              key={rec.id}
              className={`p-4 rounded-lg border-2 ${
                rec.status === 'accepted'
                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                  : rec.status === 'rejected'
                  ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getTypeColor(rec.type)}`}>
                    {getTypeIcon(rec.type)}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {rec.title}
                    </span>
                    <div className={`text-xs ${getStatusColor(rec.status)} capitalize`}>
                      {rec.status}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-pink-500" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {(rec.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {rec.description}
              </p>

              <div className="mb-2">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">Reason</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {rec.reason}
                </div>
              </div>

              {rec.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleAccept(rec.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(rec.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <ThumbsDown className="h-3 w-3" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Model Information */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Recommendation Models
        </h4>
        <div className="space-y-2">
          {models.map((model) => (
            <div
              key={model.id}
              className={`p-4 rounded-lg border-2 ${
                model.id === selectedModel
                  ? 'bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {model.name}
                  </span>
                </div>
                {model.id === selectedModel && (
                  <CheckCircle className="h-4 w-4 text-pink-500" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Type</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 capitalize">
                    {model.type}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Accuracy</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {(model.accuracy * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 rounded-lg">
        <p className="text-[10px] text-pink-700 dark:text-pink-400">
          <strong>Lưu ý:</strong> Engine đề xuất sử dụng AI để đề xuất kỷ niệm và hoạt động phù hợp với collaborative filtering, content-based filtering, và hybrid models.
        </p>
      </div>
    </div>
  );
}