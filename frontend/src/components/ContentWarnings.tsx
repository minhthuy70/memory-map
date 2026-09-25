'use client';

import { useState } from 'react';
import { AlertTriangle, X, Plus, Trash2, CheckCircle, Settings, Info, BarChart3, Smartphone, Eye, EyeOff, Shield, Zap, Lock, Unlock } from 'lucide-react';

interface ContentWarningsProps {
  onCancel?: () => void;
}

interface WarningRule {
  id: string;
  name: string;
  type: 'sensitive' | 'trigger' | 'mature' | 'graphic';
  description: string;
  enabled: boolean;
  level: 'low' | 'medium' | 'high';
  autoBlock: boolean;
}

export default function ContentWarnings({ onCancel }: ContentWarningsProps) {
  const [warningsEnabled, setWarningsEnabled] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const [rules, setRules] = useState<WarningRule[]>([
    {
      id: '1',
      name: 'Violence',
      type: 'graphic',
      description: 'Content depicting violence or gore',
      enabled: true,
      level: 'high',
      autoBlock: false,
    },
    {
      id: '2',
      name: 'Mature Content',
      type: 'mature',
      description: 'Adult themes or explicit content',
      enabled: true,
      level: 'high',
      autoBlock: true,
    },
    {
      id: '3',
      name: 'Mental Health',
      type: 'trigger',
      description: 'Content that may trigger mental health issues',
      enabled: true,
      level: 'medium',
      autoBlock: false,
    },
    {
      id: '4',
      name: 'Trauma',
      type: 'trigger',
      description: 'Content related to traumatic events',
      enabled: false,
      level: 'high',
      autoBlock: false,
    },
    {
      id: '5',
      name: 'Personal Information',
      type: 'sensitive',
      description: 'Content containing sensitive personal data',
      enabled: true,
      level: 'medium',
      autoBlock: false,
    },
  ]);

  const [warningHistory] = useState([
    { id: '1', type: 'Mature Content', action: 'showed', timestamp: '2026-09-14 10:30', userAcknowledged: true },
    { id: '2', type: 'Violence', action: 'blocked', timestamp: '2026-09-13 15:20', userAcknowledged: false },
    { id: '3', type: 'Mental Health', action: 'showed', timestamp: '2026-09-12 09:15', userAcknowledged: true },
  ]);

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => {
      if (rule.id === id) {
        return { ...rule, enabled: !rule.enabled };
      }
      return rule;
    }));
  };

  const toggleAutoBlock = (id: string) => {
    setRules(rules.map(rule => {
      if (rule.id === id) {
        return { ...rule, autoBlock: !rule.autoBlock };
      }
      return rule;
    }));
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const enabledCount = rules.filter(r => r.enabled).length;
  const totalCount = rules.length;
  const autoBlockCount = rules.filter(r => r.autoBlock).length;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'from-green-400 to-emerald-500';
      case 'medium': return 'from-yellow-400 to-orange-500';
      case 'high': return 'from-red-400 to-rose-500';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sensitive': return <Shield className="h-4 w-4" />;
      case 'trigger': return <Zap className="h-4 w-4" />;
      case 'mature': return <Lock className="h-4 w-4" />;
      case 'graphic': return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Content Warnings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Warn users about sensitive content
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show history"
          >
            {showHistory ? <BarChart3 className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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
        <div className={`p-4 rounded-lg border ${warningsEnabled ? 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800' : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${warningsEnabled ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                {warningsEnabled ? <CheckCircle className="h-6 w-6 text-white" /> : <AlertTriangle className="h-6 w-6 text-white" />}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-lg">
                  {warningsEnabled ? 'Warnings Enabled' : 'Warnings Disabled'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {warningsEnabled ? 'Users will be warned about sensitive content' : 'No warnings will be shown'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setWarningsEnabled(!warningsEnabled)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${warningsEnabled ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
            >
              {warningsEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Rules</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{enabledCount}/{totalCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Auto-Block</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{autoBlockCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Warnings Shown</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{warningHistory.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Acknowledged</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{warningHistory.filter(w => w.userAcknowledged).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-orange-500 text-white border-0 flex items-center gap-1 hover:bg-orange-600 transition-colors"
          >
            <Plus className="h-3 w-3" />
            Add Rule
          </button>
        </div>

        {showHistory && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Warning History</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {warningHistory.map((warning) => (
                <div key={warning.id} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{warning.type}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{warning.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${warning.action === 'blocked' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {warning.action}
                    </span>
                    {warning.userAcknowledged && (
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        <span>Acknowledged</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Warning Rules</h4>
          <div className="space-y-2">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`p-4 rounded-lg border-2 ${rule.enabled ? 'border-orange-300 dark:border-orange-600 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30 opacity-60'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-gradient-to-br ${getLevelColor(rule.level)} rounded-lg text-white ${rule.enabled ? '' : 'grayscale'}`}>
                      {getTypeIcon(rule.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{rule.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 capitalize">
                          {rule.type}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${rule.level === 'low' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : rule.level === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {rule.level}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleRule(rule.id)}
                      className={`p-1.5 rounded-lg transition-colors ${rule.enabled ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-700'}`}
                    >
                      {rule.enabled ? <CheckCircle className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteRule(rule.id)}
                      className="p-1.5 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{rule.description}</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleAutoBlock(rule.id)}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${rule.autoBlock ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700'}`}
                  >
                    {rule.autoBlock ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                    {rule.autoBlock ? 'Auto-block' : 'Show warning'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Warning Configuration
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Warnings appear before sensitive content is shown</li>
            <li>• Auto-block prevents content from being displayed</li>
            <li>• Users can acknowledge warnings to proceed</li>
            <li>• History tracks all warnings and user actions</li>
            <li>• Custom rules can be added for specific content types</li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Content Categories
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Sensitive: Personal information, private data</li>
            <li>• Trigger: Mental health, trauma-related content</li>
            <li>• Mature: Adult themes, explicit content</li>
            <li>• Graphic: Violence, gore, disturbing imagery</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
