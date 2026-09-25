'use client';

import { useState } from 'react';
import { BookOpen, X, RefreshCw, Info, Settings, Plus, Trash2, CheckCircle, AlertCircle, Clock, Calendar, ExternalLink, Download, FileText, Search } from 'lucide-react';

interface SDKDocumentationProps {
  onCancel?: () => void;
}

interface DocSection {
  id: string;
  title: string;
  description: string;
  pageCount: number;
  lastUpdated: string;
  isPublished: boolean;
}

interface DocGuide {
  id: string;
  title: string;
  sdk: string;
  type: 'getting-started' | 'api-reference' | 'tutorial' | 'troubleshooting';
  url: string;
  lastUpdated: string;
}

interface DocVersion {
  id: string;
  version: string;
  isLatest: boolean;
  publishedAt: string;
}

export default function SDKDocumentation({ onCancel }: SDKDocumentationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isDocsEnabled, setIsDocsEnabled] = useState(true);

  const [docSections, setDocSections] = useState<DocSection[]>([
    { id: '1', title: 'Getting Started', description: 'Quick start guide for all SDKs', pageCount: 12, lastUpdated: '2024-01-17', isPublished: true },
    { id: '2', title: 'Authentication', description: 'OAuth2 and API key authentication', pageCount: 8, lastUpdated: '2024-01-16', isPublished: true },
    { id: '3', title: 'Memory CRUD', description: 'Create, read, update, delete memories', pageCount: 15, lastUpdated: '2024-01-15', isPublished: true },
    { id: '4', title: 'File Upload', description: 'Upload photos, videos, documents', pageCount: 10, lastUpdated: '2024-01-14', isPublished: true },
    { id: '5', title: 'Webhooks', description: 'Subscribe to memory events', pageCount: 6, lastUpdated: '2024-01-13', isPublished: true },
  ]);

  const [docGuides, setDocGuides] = useState<DocGuide[]>([
    { id: '1', title: 'JavaScript SDK Quick Start', sdk: 'JavaScript/TypeScript', type: 'getting-started', url: '/docs/js/quickstart', lastUpdated: '2024-01-17' },
    { id: '2', title: 'Python SDK Quick Start', sdk: 'Python', type: 'getting-started', url: '/docs/python/quickstart', lastUpdated: '2024-01-16' },
    { id: '3', title: 'React Native SDK Guide', sdk: 'React Native', type: 'tutorial', url: '/docs/react-native/guide', lastUpdated: '2024-01-15' },
    { id: '4', title: 'Flutter Plugin Guide', sdk: 'Flutter', type: 'tutorial', url: '/docs/flutter/guide', lastUpdated: '2024-01-14' },
    { id: '5', title: 'CLI Tool Reference', sdk: 'CLI', type: 'api-reference', url: '/docs/cli/reference', lastUpdated: '2024-01-13' },
  ]);

  const [docVersions, setDocVersions] = useState<DocVersion[]>([
    { id: '1', version: '2.5.0', isLatest: true, publishedAt: '2024-01-17' },
    { id: '2', version: '2.4.8', isLatest: false, publishedAt: '2024-01-10' },
    { id: '3', version: '2.3.0', isLatest: false, publishedAt: '2023-12-15' },
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'getting-started': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'api-reference': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'tutorial': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'troubleshooting': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const togglePublish = (id: string) => {
    setDocSections(docSections.map(section => 
      section.id === id ? { ...section, isPublished: !section.isPublished } : section
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              SDK Documentation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tài liệu SDK với ví dụ
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isDocsEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isDocsEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Sections</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{docSections.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Guides</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{docGuides.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Pages</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{docSections.reduce((acc, s) => acc + s.pageCount, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Versions</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{docVersions.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isDocsEnabled}
              onChange={(e) => setIsDocsEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Docs</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-amber-600 hover:bg-amber-700 text-white border-0 flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Download PDF
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Documentation Versions</h4>
          <div className="space-y-2">
            {docVersions.map((version) => (
              <div key={version.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <BookOpen className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{version.version}</span>
                        {version.isLatest && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Latest
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Published: {version.publishedAt}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Documentation Sections</h4>
          <div className="space-y-2">
            {docSections.map((section) => (
              <div key={section.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <FileText className="h-4 w-4 text-orange-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{section.title}</span>
                        {section.isPublished && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Published
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{section.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePublish(section.id)}
                    className={`px-2 py-1 rounded text-xs ${section.isPublished ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {section.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Pages: {section.pageCount}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Updated: {section.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">SDK Guides</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {docGuides.map((guide) => (
              <div key={guide.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                      <Search className="h-4 w-4 text-yellow-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{guide.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(guide.type)}`}>
                          {guide.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{guide.sdk}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View
                  </button>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Updated: {guide.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">SDK Documentation Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Comprehensive documentation for all SDKs</li>
              <li>• Getting started guides and tutorials</li>
              <li>• API reference documentation</li>
              <li>• Troubleshooting guides</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
