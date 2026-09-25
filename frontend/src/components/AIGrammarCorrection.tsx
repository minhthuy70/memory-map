'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle, Copy, FileText, Info, RefreshCw, Star, Zap } from 'lucide-react';

interface AIGrammarCorrectionProps {
  onCancel?: () => void;
}

interface CorrectionItem {
  id: string;
  originalText: string;
  correctedText: string;
  errorType: 'grammar' | 'spelling' | 'punctuation' | 'style';
  severity: 'critical' | 'minor' | 'suggestion';
  explanation: string;
  isAccepted: boolean;
  createdAt: string;
}

interface CorrectionSettings {
  autoCorrect: boolean;
  checkSpelling: boolean;
  checkGrammar: boolean;
  checkPunctuation: boolean;
  checkStyle: boolean;
}

export default function AIGrammarCorrection({ onCancel }: AIGrammarCorrectionProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isCorrectionEnabled, setIsCorrectionEnabled] = useState(true);

  const [correctionItems, setCorrectionItems] = useState<CorrectionItem[]>([
    { id: '1', originalText: 'Their are many reasons', correctedText: 'There are many reasons', errorType: 'grammar', severity: 'critical', explanation: 'Common homophone error: their/there/they\'re', isAccepted: true, createdAt: '2024-01-15' },
    { id: '2', originalText: 'Its a beautiful day', correctedText: 'It\'s a beautiful day', errorType: 'grammar', severity: 'critical', explanation: 'Missing apostrophe in contraction', isAccepted: false, createdAt: '2024-02-20' },
    { id: '3', originalText: 'recieve', correctedText: 'receive', errorType: 'spelling', severity: 'critical', explanation: 'Spelling error: i before e except after c', isAccepted: true, createdAt: '2024-03-10' },
  ]);

  const [correctionSettings, setCorrectionSettings] = useState<CorrectionSettings>({
    autoCorrect: false,
    checkSpelling: true,
    checkGrammar: true,
    checkPunctuation: true,
    checkStyle: false,
  });

  const runCorrection = () => {
    const errorTypes: Array<'grammar' | 'spelling' | 'punctuation' | 'style'> = ['grammar', 'spelling', 'punctuation', 'style'];
    const severities: Array<'critical' | 'minor' | 'suggestion'> = ['critical', 'minor', 'suggestion'];
    const newCorrection: CorrectionItem = {
      id: Date.now().toString(),
      originalText: 'sample error text',
      correctedText: 'sample corrected text',
      errorType: errorTypes[Math.floor(Math.random() * errorTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      explanation: 'AI-detected error with explanation',
      isAccepted: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCorrectionItems([...correctionItems, newCorrection]);
  };

  const acceptCorrection = (id: string) => {
    setCorrectionItems(correctionItems.map(item => 
      item.id === id ? { ...item, isAccepted: true } : item
    ));
  };

  const rejectCorrection = (id: string) => {
    setCorrectionItems(correctionItems.filter(item => item.id !== id));
  };

  const getErrorTypeColor = (type: string) => {
    switch (type) {
      case 'grammar': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'spelling': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'punctuation': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'style': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'minor': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'suggestion': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Grammar Correction
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Auto-correct grammar and spelling errors
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isCorrectionEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isCorrectionEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Errors Found</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{correctionItems.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Accepted</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{correctionItems.filter(i => i.isAccepted).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Critical</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{correctionItems.filter(i => i.severity === 'critical').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Error Types</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{4}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isCorrectionEnabled}
              onChange={(e) => setIsCorrectionEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Correction</span>
          </div>
          <button
            type="button"
            onClick={runCorrection}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Run Correction
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Correction Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-green-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Correct</span>
              </div>
              <input
                type="checkbox"
                checked={correctionSettings.autoCorrect}
                onChange={(e) => setCorrectionSettings({ ...correctionSettings, autoCorrect: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Check Spelling</span>
              </div>
              <input
                type="checkbox"
                checked={correctionSettings.checkSpelling}
                onChange={(e) => setCorrectionSettings({ ...correctionSettings, checkSpelling: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Check Grammar</span>
              </div>
              <input
                type="checkbox"
                checked={correctionSettings.checkGrammar}
                onChange={(e) => setCorrectionSettings({ ...correctionSettings, checkGrammar: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Check Punctuation</span>
              </div>
              <input
                type="checkbox"
                checked={correctionSettings.checkPunctuation}
                onChange={(e) => setCorrectionSettings({ ...correctionSettings, checkPunctuation: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Correction Items</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {correctionItems.map((item) => (
              <div key={item.id} className={`p-3 rounded-lg border ${item.isAccepted ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-orange-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs ${getErrorTypeColor(item.errorType)}`}>
                          {item.errorType}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(item.severity)}`}>
                          {item.severity}
                        </span>
                        {item.isAccepted && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Accepted
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.createdAt}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-red-600 dark:text-red-400 line-through">{item.originalText}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">→</span>
                    <span className="text-xs text-green-600 dark:text-green-400">{item.correctedText}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{item.explanation}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => acceptCorrection(item.id)}
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => rejectCorrection(item.id)}
                    className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Reject
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Grammar Correction Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI detects grammar, spelling, punctuation, and style errors</li>
              <li>• Severity levels: critical, minor, suggestion</li>
              <li>• Auto-correct option for instant fixes</li>
              <li>• Accept/reject individual corrections</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
