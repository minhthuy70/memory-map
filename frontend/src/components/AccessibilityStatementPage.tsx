'use client';

import { useState } from 'react';
import { FileText, X, RefreshCw, Info, CheckCircle, AlertTriangle, Calendar, Mail, Phone, Globe, Shield, Eye } from 'lucide-react';

interface AccessibilityStatementPageProps {
  onCancel?: () => void;
}

interface ComplianceInfo {
  standard: string;
  level: string;
  date: string;
  status: 'compliant' | 'partially-compliant' | 'non-compliant';
}

export default function AccessibilityStatementPage({ onCancel }: AccessibilityStatementPageProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('2026-09-14');

  const [complianceInfo] = useState<ComplianceInfo[]>([
    { standard: 'WCAG 2.2', level: 'AA', date: '2026-09-14', status: 'compliant' },
    { standard: 'WCAG 2.2', level: 'AAA', date: '2026-09-14', status: 'partially-compliant' },
    { standard: 'Section 508', level: 'A', date: '2026-09-14', status: 'compliant' },
    { standard: 'EN 301 549', level: 'AA', date: '2026-09-14', status: 'compliant' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'partially-compliant': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'non-compliant': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-3 w-3" />;
      case 'partially-compliant': return <AlertTriangle className="h-3 w-3" />;
      case 'non-compliant': return <AlertTriangle className="h-3 w-3" />;
      default: return <Info className="h-3 w-3" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Accessibility Statement Page
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Public accessibility statement
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
        <div className="p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
          <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Accessibility Statement</h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
            Memory Map is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Last Updated: {lastUpdated}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Standards</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{complianceInfo.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Compliant</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{complianceInfo.filter(c => c.status === 'compliant').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Partial</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{complianceInfo.filter(c => c.status === 'partially-compliant').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">AA Level</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {complianceInfo.filter(c => c.level === 'AA').length}/4
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Update Statement
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            Preview Page
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Compliance Status</h4>
          <div className="space-y-2">
            {complianceInfo.map((info) => (
              <div key={info.standard} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    {getIcon(info.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{info.standard}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(info.status)}`}>
                        {info.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Level: {info.level}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{info.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Accessibility Features</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs text-slate-700 dark:text-slate-300">Keyboard Navigation</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs text-slate-700 dark:text-slate-300">Screen Reader Support</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs text-slate-700 dark:text-slate-300">High Contrast Mode</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs text-slate-700 dark:text-slate-300">Text Resizing</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs text-slate-700 dark:text-slate-300">Color Independence</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs text-slate-700 dark:text-slate-300">Skip Navigation Links</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Contact Information</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <Mail className="h-4 w-4 text-slate-500" />
              <span className="text-xs text-slate-700 dark:text-slate-300">Email: accessibility@memorymap.com</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <Phone className="h-4 w-4 text-slate-500" />
              <span className="text-xs text-slate-700 dark:text-slate-300">Phone: +84 123 456 789</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <Globe className="h-4 w-4 text-slate-500" />
              <span className="text-xs text-slate-700 dark:text-slate-300">Website: www.memorymap.com/accessibility</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Feedback & Testing</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span className="text-xs text-slate-700 dark:text-slate-300">Annual audit conducted: September 2026</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <Shield className="h-4 w-4 text-slate-500" />
              <span className="text-xs text-slate-700 dark:text-slate-300">Testing with screen readers: NVDA, JAWS, VoiceOver</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <AlertTriangle className="h-4 w-4 text-slate-500" />
              <span className="text-xs text-slate-700 dark:text-slate-300">We welcome feedback on accessibility</span>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Statement Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Keep statement updated with regular audits</li>
              <li>• Provide clear contact information for feedback</li>
              <li>• Include testing methods and tools used</li>
              <li>• Document known limitations and workarounds</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
