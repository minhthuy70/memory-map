'use client';

import { useState } from 'react';
import { Bot, X, RefreshCw, CheckCircle, AlertTriangle, Info, Settings, Zap, Shield, Sliders, ToggleLeft, ToggleRight, BarChart3, TrendingUp, Target } from 'lucide-react';

interface AutoContentModerationProps {
  onCancel?: () => void;
}

interface ModerationRule {
  id: string;
  name: string;
  type: 'text' | 'image' | 'video';
  category: 'spam' | 'offensive' | 'nsfw' | 'harassment' | 'spam_link';
  enabled: boolean;
  sensitivity: 'low' | 'medium' | 'high';
  autoAction: 'flag' | 'hide' | 'delete';
  accuracy: number;
}

export default function AutoContentModeration({ onCancel }: AutoContentModerationProps) {
  const [showDetails, setShowDetails] = useState(false);

  const [rules, setRules] = useState<ModerationRule[]>([
    { id: '1', name: 'Offensive Language Detection', type: 'text', category: 'offensive', enabled: true, sensitivity: 'high', autoAction: 'flag', accuracy: 92 },
    { id: '2', name: 'Spam Detection', type: 'text', category: 'spam', enabled: true, sensitivity: 'medium', autoAction: 'hide', accuracy: 88 },
    { id: '3', name: 'NSFW Image Detection', type: 'image', category: 'nsfw', enabled: true, sensitivity: 'high', autoAction: 'hide', accuracy: 95 },
    { id: '4', name: 'Harassment Detection', type: 'text', category: 'harassment', enabled: true, sensitivity: 'high', autoAction: 'delete', accuracy: 90 },
    { id: '5', name: 'Spam Link Detection', type: 'text', category: 'spam_link', enabled: true, sensitivity: 'medium', autoAction: 'flag', accuracy: 85 },
    { id: '6', name: 'Video Content Analysis', type: 'video', category: 'nsfw', enabled: false, sensitivity: 'high', autoAction: 'flag', accuracy: 82 },
  ]);

  const [stats, setStats] = useState({
    totalScanned: 15420,
    autoFlagged: 325,
    autoHidden: 89,
    autoDeleted: 12,
    falsePositives: 5,
    accuracy: 94.2,
  });

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => rule.id === id ? { ...rule, enabled: !rule.enabled } : rule));
  };

  const updateSensitivity = (id: string, sensitivity: 'low' | 'medium' | 'high') => {
    setRules(rules.map(rule => rule.id === id ? { ...rule, sensitivity } : rule));
  };

  const updateAutoAction = (id: string, autoAction: 'flag' | 'hide' | 'delete') => {
    setRules(rules.map(rule => rule.id === id ? { ...rule, autoAction } : rule));
  };

  const runManualScan = () => {
    // Simulate manual scan
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'spam': return <Zap className="h-4 w-4" />;
      case 'offensive': return <AlertTriangle className="h-4 w-4" />;
      case 'nsfw': return <Shield className="h-4 w-4" />;
      case 'harassment': return <Target className="h-4 w-4" />;
      case 'spam_link': return <BarChart3 className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'spam': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'offensive': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'nsfw': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'harassment': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'spam_link': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'flag': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'hide': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'delete': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Auto Content Moderation (AI)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI-powered content moderation
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Auto Flagged</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.autoFlagged}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Accuracy</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{stats.accuracy}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">False Positives</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{stats.falsePositives}</p>
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
            Configure AI
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Moderation Rules</h4>
          <div className="space-y-2">
            {rules.map((rule) => (
              <div key={rule.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleRule(rule.id)}
                      className={`p-2 rounded-lg transition-colors ${rule.enabled ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}
                    >
                      {rule.enabled ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                    </button>
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{rule.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${getCategoryColor(rule.category)}`}>
                          {getCategoryIcon(rule.category)}
                          {rule.category}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{rule.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{rule.accuracy}% accuracy</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Sensitivity:</span>
                    <select
                      value={rule.sensitivity}
                      onChange={(e) => updateSensitivity(rule.id, e.target.value as any)}
                      disabled={!rule.enabled}
                      className="px-2 py-1 rounded text-xs bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 disabled:opacity-50"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Action:</span>
                    <select
                      value={rule.autoAction}
                      onChange={(e) => updateAutoAction(rule.id, e.target.value as any)}
                      disabled={!rule.enabled}
                      className="px-2 py-1 rounded text-xs bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 disabled:opacity-50"
                    >
                      <option value="flag">Flag</option>
                      <option value="hide">Hide</option>
                      <option value="delete">Delete</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Recent Activity</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs text-slate-900 dark:text-white">Offensive language detected in comment</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">2 min ago</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-xs text-slate-900 dark:text-white">Potential spam link flagged</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">5 min ago</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-500" />
                <span className="text-xs text-slate-900 dark:text-white">NSFW image hidden automatically</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">10 min ago</span>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">AI Moderation Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Balance sensitivity to reduce false positives</li>
              <li>• Review auto-flagged content regularly</li>
              <li>• Adjust rules based on community feedback</li>
              <li>• Monitor accuracy metrics for improvement</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
