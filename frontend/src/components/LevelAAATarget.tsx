'use client';

import { useState } from 'react';
import { Award, X, RefreshCw, Info, CheckCircle, AlertTriangle, Star, Target, Trophy } from 'lucide-react';

interface LevelAAATargetProps {
  onCancel?: () => void;
}

interface AAACheck {
  id: string;
  category: string;
  criterion: string;
  description: string;
  status: 'pass' | 'fail' | 'partial' | 'not-applicable';
  priority: 'high' | 'medium' | 'low';
  targetDate: string;
}

export default function LevelAAATarget({ onCancel }: LevelAAATargetProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [aaaChecks, setAaaChecks] = useState<AAACheck[]>([
    { id: '1', category: 'Perceivable', criterion: '1.1.6 Sign Language (Prerecorded)', description: 'Provide sign language interpretation for prerecorded audio content', status: 'not-applicable', priority: 'medium', targetDate: '2026-12-01' },
    { id: '2', category: 'Perceivable', criterion: '1.2.5 Audio Description (Prerecorded)', description: 'Provide audio description for prerecorded video content', status: 'not-applicable', priority: 'medium', targetDate: '2026-12-01' },
    { id: '3', category: 'Perceivable', criterion: '1.2.7 Extended Audio Description (Prerecorded)', description: 'Provide extended audio description for prerecorded video', status: 'not-applicable', priority: 'low', targetDate: '2027-03-01' },
    { id: '4', category: 'Perceivable', criterion: '1.2.8 Media Alternative (Prerecorded)', description: 'Provide alternative for time-based media', status: 'partial', priority: 'high', targetDate: '2026-10-01' },
    { id: '5', category: 'Perceivable', criterion: '1.2.9 Audio-only (Live)', description: 'Provide sign language interpretation for live audio-only content', status: 'not-applicable', priority: 'low', targetDate: '2027-06-01' },
    { id: '6', category: 'Perceivable', criterion: '1.4.3 Contrast (Enhanced)', description: 'Contrast ratio at least 7:1 for normal text', status: 'pass', priority: 'high', targetDate: '2026-09-14' },
    { id: '7', category: 'Perceivable', criterion: '1.4.6 Contrast (Enhanced)', description: 'Contrast ratio at least 7:1 for large text', status: 'pass', priority: 'high', targetDate: '2026-09-14' },
    { id: '8', category: 'Perceivable', criterion: '1.4.8 Visual Presentation', description: 'Provide visual presentation of text with foreground/background colors', status: 'pass', priority: 'medium', targetDate: '2026-09-14' },
    { id: '9', category: 'Perceivable', criterion: '1.4.9 Images of Text (No Exception)', description: 'Images of text are only used for pure decoration or where a particular presentation is essential', status: 'pass', priority: 'medium', targetDate: '2026-09-14' },
    { id: '10', category: 'Operable', criterion: '2.1.3 Keyboard (No Exception)', description: 'All functionality is available using a keyboard', status: 'pass', priority: 'high', targetDate: '2026-09-14' },
    { id: '11', category: 'Operable', criterion: '2.2.3 No Timing', description: 'Timing is not an essential part of the activity', status: 'partial', priority: 'high', targetDate: '2026-10-15' },
    { id: '12', category: 'Operable', criterion: '2.2.5 Re-authenticating', description: 'Re-authentication after a session expires does not cause loss of data', status: 'pass', priority: 'medium', targetDate: '2026-09-14' },
    { id: '13', category: 'Operable', criterion: '2.3.2 Three Flashes', description: 'Web pages do not contain anything that flashes more than three times in any one second period', status: 'pass', priority: 'high', targetDate: '2026-09-14' },
    { id: '14', category: 'Operable', criterion: '2.4.7 Visible Focus', description: 'Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible', status: 'pass', priority: 'high', targetDate: '2026-09-14' },
    { id: '15', category: 'Understandable', criterion: '3.1.3 Unusual Words', description: 'Provide a mechanism to identify specific definitions of words or phrases', status: 'partial', priority: 'medium', targetDate: '2026-11-01' },
    { id: '16', category: 'Understandable', criterion: '3.1.4 Abbreviations', description: 'Provide a mechanism to identify the expanded form or meaning of abbreviations', status: 'partial', priority: 'medium', targetDate: '2026-11-01' },
    { id: '17', category: 'Understandable', criterion: '3.1.5 Reading Level', description: 'Make text content readable and understandable', status: 'pass', priority: 'medium', targetDate: '2026-09-14' },
    { id: '18', category: 'Understandable', criterion: '3.2.3 Consistent Navigation', description: 'Navigational mechanisms that are repeated on multiple Web pages occur in the same relative order', status: 'pass', priority: 'high', targetDate: '2026-09-14' },
    { id: '19', category: 'Understandable', criterion: '3.2.4 Consistent Identification', description: 'Components that have the same functionality within a set of Web pages are identified consistently', status: 'pass', priority: 'medium', targetDate: '2026-09-14' },
    { id: '20', category: 'Understandable', criterion: '3.3.3 Error Suggestions', description: 'Provide suggestions to help users correct input errors', status: 'partial', priority: 'high', targetDate: '2026-10-01' },
  ]);

  const filteredChecks = selectedCategory === 'all' 
    ? aaaChecks 
    : aaaChecks.filter(check => check.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(aaaChecks.map(c => c.category)))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'fail': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'partial': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'not-applicable': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'low': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const passCount = aaaChecks.filter(c => c.status === 'pass').length;
  const partialCount = aaaChecks.filter(c => c.status === 'partial').length;
  const failCount = aaaChecks.filter(c => c.status === 'fail').length;
  const naCount = aaaChecks.filter(c => c.status === 'not-applicable').length;
  const applicableChecks = aaaChecks.filter(c => c.status !== 'not-applicable');
  const compliancePercentage = applicableChecks.length > 0 
    ? Math.round((passCount / applicableChecks.length) * 100) 
    : 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Level AAA Target
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              WCAG 2.2 Level AAA target progress
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${
            compliancePercentage >= 95 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
            compliancePercentage >= 80 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
            'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}>
            {compliancePercentage}% Complete
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
            <p className="text-lg font-bold text-slate-900 dark:text-white">{aaaChecks.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Passed</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{passCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">In Progress</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{partialCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Not Applicable</p>
            <p className="text-lg font-bold text-slate-600 dark:text-slate-400">{naCount}</p>
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
            Update Targets
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">AAA Target Overview</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Target Level</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                AAA
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Progress</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {compliancePercentage}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">High Priority</span>
              </div>
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                {aaaChecks.filter(c => c.priority === 'high').length}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">AAA Criteria ({filteredChecks.length})</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredChecks.map((check) => (
              <div key={check.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    {check.status === 'pass' ? <CheckCircle className="h-5 w-5 text-green-500" /> : 
                     check.status === 'partial' ? <AlertTriangle className="h-5 w-5 text-yellow-500" /> :
                     check.status === 'not-applicable' ? <Info className="h-5 w-5 text-slate-400" /> :
                     <AlertTriangle className="h-5 w-5 text-red-500" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{check.criterion}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(check.status)}`}>
                        {check.status}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(check.priority)}`}>
                        {check.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{check.description}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>{check.category}</span>
                      <span>Target: {check.targetDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">AAA Level Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AAA is the highest and most difficult to achieve</li>
              <li>• Requires 7:1 contrast ratio for normal text</li>
 <li>• Extended audio descriptions for video content</li>
              <li>• Sign language interpretation for audio content</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
