'use client';

import { useState } from 'react';
import { AlertTriangle, Award, CheckCircle, FileText, Info, RefreshCw, Shield, Star } from 'lucide-react';

interface LevelAAComplianceProps {
  onCancel?: () => void;
}

interface ComplianceCheck {
  id: string;
  category: string;
  criterion: string;
  description: string;
  status: 'pass' | 'fail' | 'partial';
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  lastChecked: string;
}

export default function LevelAACompliance({ onCancel }: LevelAAComplianceProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([
    { id: '1', category: 'Perceivable', criterion: '1.1.1 Non-text Content', description: 'Provide text alternatives for non-text content', status: 'pass', impact: 'critical', lastChecked: '2026-09-14' },
    { id: '2', category: 'Perceivable', criterion: '1.2.1 Audio-only and Video-only', description: 'Provide alternatives for time-based media', status: 'pass', impact: 'critical', lastChecked: '2026-09-14' },
    { id: '3', category: 'Perceivable', criterion: '1.3.1 Info and Relationships', description: 'Create content that can be presented in different ways', status: 'pass', impact: 'serious', lastChecked: '2026-09-14' },
    { id: '4', category: 'Perceivable', criterion: '1.4.1 Use of Color', description: 'Do not use color as the only visual means', status: 'pass', impact: 'serious', lastChecked: '2026-09-14' },
    { id: '5', category: 'Perceivable', criterion: '1.4.3 Contrast (Minimum)', description: 'Contrast ratio at least 4.5:1 for normal text', status: 'pass', impact: 'critical', lastChecked: '2026-09-14' },
    { id: '6', category: 'Perceivable', criterion: '1.4.4 Resize text', description: 'Text can be resized without assistive technology', status: 'pass', impact: 'moderate', lastChecked: '2026-09-14' },
    { id: '7', category: 'Operable', criterion: '2.1.1 Keyboard', description: 'All functionality is available using a keyboard', status: 'pass', impact: 'critical', lastChecked: '2026-09-14' },
    { id: '8', category: 'Operable', criterion: '2.1.2 No Keyboard Trap', description: 'No keyboard trap', status: 'pass', impact: 'critical', lastChecked: '2026-09-14' },
    { id: '9', category: 'Operable', criterion: '2.2.1 Timing Adjustable', description: 'Provide users enough time to read and use content', status: 'partial', impact: 'moderate', lastChecked: '2026-09-13' },
    { id: '10', category: 'Operable', criterion: '2.3.1 Three Flashes or Below', description: 'Do not design content in a way that is known to cause seizures', status: 'pass', impact: 'critical', lastChecked: '2026-09-14' },
    { id: '11', category: 'Operable', criterion: '2.4.1 Bypass Blocks', description: 'Provide a way to bypass repeated content', status: 'pass', impact: 'serious', lastChecked: '2026-09-14' },
    { id: '12', category: 'Operable', criterion: '2.4.2 Page Titled', description: 'Web pages have titles that describe topic or purpose', status: 'pass', impact: 'moderate', lastChecked: '2026-09-14' },
    { id: '13', category: 'Understandable', criterion: '3.1.1 Language of Page', description: 'Human language of each page can be programmatically determined', status: 'pass', impact: 'serious', lastChecked: '2026-09-14' },
    { id: '14', category: 'Understandable', criterion: '3.2.1 On Focus', description: 'When any component receives focus, it does not cause a change of context', status: 'pass', impact: 'moderate', lastChecked: '2026-09-14' },
    { id: '15', category: 'Understandable', criterion: '3.3.1 Error Identification', description: 'If an input error is automatically detected, the item is identified and the error is described', status: 'pass', impact: 'serious', lastChecked: '2026-09-14' },
    { id: '16', category: 'Robust', criterion: '4.1.1 Parsing', description: 'Content is implemented using technologies with sufficient support', status: 'pass', impact: 'critical', lastChecked: '2026-09-14' },
    { id: '17', category: 'Robust', criterion: '4.1.2 Name, Role, Value', description: 'For all user interface components, the name and role can be programmatically determined', status: 'pass', impact: 'critical', lastChecked: '2026-09-14' },
  ]);

  const filteredChecks = selectedCategory === 'all' 
    ? complianceChecks 
    : complianceChecks.filter(check => check.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(complianceChecks.map(c => c.category)))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'fail': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'partial': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'serious': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'moderate': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'minor': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const passCount = complianceChecks.filter(c => c.status === 'pass').length;
  const partialCount = complianceChecks.filter(c => c.status === 'partial').length;
  const failCount = complianceChecks.filter(c => c.status === 'fail').length;
  const compliancePercentage = Math.round((passCount / complianceChecks.length) * 100);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Level AA Compliance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              WCAG 2.2 Level AA compliance status
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${
            compliancePercentage >= 95 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
            compliancePercentage >= 80 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
            'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}>
            {compliancePercentage}% Compliant
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Checks</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{complianceChecks.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Passed</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{passCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Partial</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{partialCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Failed</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{failCount}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Run Audit
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <FileText className="h-3 w-3" />
            Export Report
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Compliance Overview</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Overall Compliance</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {compliancePercentage}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Level Target</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                AA
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Critical Issues</span>
              </div>
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                {complianceChecks.filter(c => c.status === 'fail' && c.impact === 'critical').length}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Compliance Checks ({filteredChecks.length})</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredChecks.map((check) => (
              <div key={check.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    {check.status === 'pass' ? <CheckCircle className="h-5 w-5 text-green-500" /> : 
                     check.status === 'partial' ? <AlertTriangle className="h-5 w-5 text-yellow-500" /> :
                     <AlertTriangle className="h-5 w-5 text-red-500" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{check.criterion}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(check.status)}`}>
                        {check.status}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getImpactColor(check.impact)}`}>
                        {check.impact}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{check.description}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{check.category}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{check.lastChecked}</span>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">WCAG AA Compliance Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Level AA requires contrast ratio of at least 4.5:1 for normal text</li>
              <li>• All functionality must be keyboard accessible</li>
              <li>• Provide sufficient time for users to read and interact</li>
              <li>• Ensure content is compatible with assistive technologies</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
