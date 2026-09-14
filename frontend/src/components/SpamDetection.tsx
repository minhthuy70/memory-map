'use client';

import { useState } from 'react';
import { Zap, X, RefreshCw, CheckCircle, AlertTriangle, Info, Shield, Sliders, ToggleLeft, ToggleRight, BarChart3, TrendingUp, Filter, Search, Link, MessageSquare } from 'lucide-react';

interface SpamDetectionProps {
  onCancel?: () => void;
}

interface SpamItem {
  id: string;
  type: 'comment' | 'message' | 'post';
  content: string;
  author: string;
  spamScore: number;
  indicators: {
    links: number;
    caps: boolean;
    repetition: boolean;
    keywords: string[];
  };
  status: 'pending' | 'confirmed' | 'false_positive';
  detectedAt: string;
}

export default function SpamDetection({ onCancel }: SpamDetectionProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [threshold, setThreshold] = useState(70);
  const [autoHide, setAutoHide] = useState(true);

  const [spamItems, setSpamItems] = useState<SpamItem[]>([
    { id: '1', type: 'comment', content: 'CLICK HERE FOR FREE MONEY!!! www.spam.com', author: 'user_123', spamScore: 95, indicators: { links: 1, caps: true, repetition: false, keywords: ['free', 'money', 'click'] }, status: 'pending', detectedAt: '2026-09-14' },
    { id: '2', type: 'message', content: 'Buy cheap followers and likes at followerboost.com', author: 'user_456', spamScore: 88, indicators: { links: 1, caps: false, repetition: false, keywords: ['buy', 'followers', 'likes'] }, status: 'confirmed', detectedAt: '2026-09-13' },
    { id: '3', type: 'post', content: 'Check out this amazing product at https://scam-site.com/offer', author: 'user_789', spamScore: 82, indicators: { links: 1, caps: false, repetition: false, keywords: ['product', 'offer', 'check'] }, status: 'pending', detectedAt: '2026-09-12' },
    { id: '4', type: 'comment', content: 'Great photo! Love the composition.', author: 'user_321', spamScore: 15, indicators: { links: 0, caps: false, repetition: false, keywords: [] }, status: 'false_positive', detectedAt: '2026-09-11' },
  ]);

  const [stats, setStats] = useState({
    totalScanned: 5420,
    detectedSpam: 325,
    falsePositives: 8,
    accuracy: 98.5,
    topKeywords: ['free', 'money', 'click', 'buy', 'followers'],
  });

  const confirmSpam = (id: string) => {
    setSpamItems(spamItems.map(item => item.id === id ? { ...item, status: 'confirmed' } : item));
  };

  const markFalsePositive = (id: string) => {
    setSpamItems(spamItems.map(item => item.id === id ? { ...item, status: 'false_positive' } : item));
  };

  const deleteSpam = (id: string) => {
    setSpamItems(spamItems.filter(item => item.id !== id));
  };

  const runManualScan = () => {
    // Simulate manual scan
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'confirmed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'false_positive': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageSquare className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      case 'post': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Spam Detection
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI-powered spam identification
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Scanned</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalScanned.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Detected Spam</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{stats.detectedSpam}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Accuracy</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{stats.accuracy}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">False Positives</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{stats.falsePositives}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={runManualScan}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Run Manual Scan
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <Sliders className="h-3 w-3" />
            Configure Rules
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Detection Settings</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Spam Threshold (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">{threshold}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAutoHide(!autoHide)}
                className={`p-2 rounded-lg transition-colors ${autoHide ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}
              >
                {autoHide ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
              </button>
              <span className="text-xs text-slate-700 dark:text-slate-300">Auto Hide Spam</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Top Spam Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {stats.topKeywords.map((keyword) => (
              <span key={keyword} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Detected Spam Items</h4>
          <div className="space-y-2">
            {spamItems.map((item) => (
              <div key={item.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{item.detectedAt}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-900 dark:text-white mb-2 line-clamp-2">{item.content}</p>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Spam Score:</span>
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className={`h-2 rounded-full ${getScoreColor(item.spamScore)}`} style={{ width: `${item.spamScore}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{item.spamScore}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    {item.indicators.links > 0 && (
                      <span className="flex items-center gap-1">
                        <Link className="h-3 w-3" />
                        {item.indicators.links}
                      </span>
                    )}
                    {item.indicators.caps && (
                      <span className="px-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">CAPS</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => confirmSpam(item.id)}
                    className="flex-1 px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1"
                  >
                    <Shield className="h-3 w-3" />
                    Confirm Spam
                  </button>
                  <button
                    type="button"
                    onClick={() => markFalsePositive(item.id)}
                    className="flex-1 px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    False Positive
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSpam(item.id)}
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Spam Detection Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Monitor false positive rate closely</li>
              <li>• Update keyword list regularly</li>
              <li>• Adjust threshold based on community feedback</li>
              <li>• Review confirmed spam for pattern analysis</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
