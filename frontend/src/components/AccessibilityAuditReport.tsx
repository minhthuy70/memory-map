'use client';

import { useState } from 'react';
import { FileText, X, RefreshCw, Info, CheckCircle, AlertTriangle, Download, Search, Filter, Calendar, User, Bug, Shield } from 'lucide-react';

interface AccessibilityAuditReportProps {
  onCancel?: () => void;
}

interface AuditIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  category: string;
  element: string;
  description: string;
  wcagCriterion: string;
  location: string;
  discoveredAt: string;
  status: 'open' | 'fixed' | 'ignored';
}

export default function AccessibilityAuditReport({ onCancel }: AccessibilityAuditReportProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [auditIssues, setAuditIssues] = useState<AuditIssue[]>([
    { id: '1', type: 'error', severity: 'critical', category: 'Images', element: 'img', description: 'Image missing alt attribute', wcagCriterion: '1.1.1', location: '/home', discoveredAt: '2026-09-14', status: 'open' },
    { id: '2', type: 'warning', severity: 'serious', category: 'Contrast', element: 'button', description: 'Low contrast ratio 3.5:1 (requires 4.5:1)', wcagCriterion: '1.4.3', location: '/dashboard', discoveredAt: '2026-09-14', status: 'open' },
    { id: '3', type: 'error', severity: 'critical', category: 'Forms', element: 'input', description: 'Form field missing label', wcagCriterion: '1.1.1', location: '/auth/login', discoveredAt: '2026-09-13', status: 'fixed' },
    { id: '4', type: 'warning', severity: 'moderate', category: 'Headings', element: 'h2', description: 'Skipped heading level from h1 to h3', wcagCriterion: '1.3.1', location: '/memories', discoveredAt: '2026-09-13', status: 'open' },
    { id: '5', type: 'info', severity: 'minor', category: 'Links', element: 'a', description: 'Link text not descriptive', wcagCriterion: '2.4.4', location: '/settings', discoveredAt: '2026-09-12', status: 'ignored' },
    { id: '6', type: 'error', severity: 'critical', category: 'Keyboard', element: 'div', description: 'Custom element not keyboard accessible', wcagCriterion: '2.1.1', location: '/dashboard', discoveredAt: '2026-09-12', status: 'open' },
    { id: '7', type: 'warning', severity: 'serious', category: 'Focus', element: 'button', description: 'Focus indicator not visible', wcagCriterion: '2.4.7', location: '/home', discoveredAt: '2026-09-11', status: 'fixed' },
    { id: '8', type: 'info', severity: 'minor', category: 'ARIA', element: 'div', description: 'Missing aria-label for interactive element', wcagCriterion: '4.1.2', location: '/memories', discoveredAt: '2026-09-11', status: 'open' },
  ]);

  const filteredIssues = auditIssues.filter(issue => {
    const matchesType = selectedType === 'all' || issue.type === selectedType;
    const matchesSeverity = selectedSeverity === 'all' || issue.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'all' || issue.status === selectedStatus;
    const matchesSearch = issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.element.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.wcagCriterion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSeverity && matchesStatus && matchesSearch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'info': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'serious': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'moderate': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'minor': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'fixed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'ignored': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error': return <Bug className="h-3 w-3" />;
      case 'warning': return <AlertTriangle className="h-3 w-3" />;
      case 'info': return <Info className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const exportReport = () => {
    const headers = ['Type', 'Severity', 'Category', 'Element', 'Description', 'WCAG Criterion', 'Location', 'Status'];
    const rows = filteredIssues.map(issue => [
      issue.type,
      issue.severity,
      issue.category,
      issue.element,
      issue.description,
      issue.wcagCriterion,
      issue.location,
      issue.status,
    ]);
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'accessibility_audit_report.csv';
    a.click();
  };

  const runAudit = () => {
    setAuditIssues([
      ...auditIssues,
      { id: '9', type: 'warning', severity: 'moderate', category: 'Color', element: 'span', description: 'Color used as only visual indicator', wcagCriterion: '1.4.1', location: '/memories', discoveredAt: new Date().toISOString().split('T')[0], status: 'open' },
    ]);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Accessibility Audit Report
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automated accessibility testing report
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Issues</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{auditIssues.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Critical</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{auditIssues.filter(i => i.severity === 'critical').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Open</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{auditIssues.filter(i => i.status === 'open').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Filtered</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{filteredIssues.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Types</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="serious">Serious</option>
            <option value="moderate">Moderate</option>
            <option value="minor">Minor</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="fixed">Fixed</option>
            <option value="ignored">Ignored</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search issues..."
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 flex-1"
          />
          <button
            type="button"
            onClick={runAudit}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Run Audit
          </button>
          <button
            type="button"
            onClick={exportReport}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Export
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Audit Issues ({filteredIssues.length})</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    {getTypeIcon(issue.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{issue.element}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(issue.type)}`}>
                        {issue.type}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{issue.description}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>{issue.category}</span>
                      <span>{issue.wcagCriterion}</span>
                      <span>{issue.location}</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{issue.discoveredAt}</span>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Audit Report Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Run audits regularly to catch accessibility issues</li>
              <li>• Prioritize critical and serious issues</li>
              <li>• Export reports for documentation and tracking</li>
              <li>• Review and fix issues in WCAG order</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
