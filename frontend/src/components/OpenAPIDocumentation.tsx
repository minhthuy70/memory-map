'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Info,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Trash2
} from 'lucide-react';

interface OpenAPIDocumentationProps {
  onCancel?: () => void;
}

interface DocEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  summary: string;
  description: string;
  hasSchema: boolean;
  lastUpdated: string;
}

interface DocSchema {
  id: string;
  name: string;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean';
  fields: number;
  lastUpdated: string;
}

interface DocSettings {
  autoGenerate: boolean;
  includeExamples: boolean;
  validationLevel: 'strict' | 'lenient' | 'none';
  outputFormat: 'json' | 'yaml';
}

export default function OpenAPIDocumentation({ onCancel }: OpenAPIDocumentationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isDocsEnabled, setIsDocsEnabled] = useState(true);

  const [docEndpoints, setDocEndpoints] = useState<DocEndpoint[]>([
    { id: '1', path: '/api/v2/memories', method: 'GET', summary: 'List memories', description: 'Retrieve a paginated list of memories', hasSchema: true, lastUpdated: '2024-01-17' },
    { id: '2', path: '/api/v2/memories', method: 'POST', summary: 'Create memory', description: 'Create a new memory', hasSchema: true, lastUpdated: '2024-01-17' },
    { id: '3', path: '/api/v2/memories/:id', method: 'GET', summary: 'Get memory', description: 'Retrieve a specific memory by ID', hasSchema: true, lastUpdated: '2024-01-16' },
    { id: '4', path: '/api/v2/memories/:id', method: 'PUT', summary: 'Update memory', description: 'Update an existing memory', hasSchema: true, lastUpdated: '2024-01-16' },
    { id: '5', path: '/api/v2/memories/:id', method: 'DELETE', summary: 'Delete memory', description: 'Delete a memory', hasSchema: false, lastUpdated: '2024-01-15' },
  ]);

  const [docSchemas, setDocSchemas] = useState<DocSchema[]>([
    { id: '1', name: 'Memory', type: 'object', fields: 12, lastUpdated: '2024-01-17' },
    { id: '2', name: 'MemoryCreateRequest', type: 'object', fields: 8, lastUpdated: '2024-01-17' },
    { id: '3', name: 'MemoryUpdateRequest', type: 'object', fields: 10, lastUpdated: '2024-01-16' },
    { id: '4', name: 'PaginatedResponse', type: 'object', fields: 5, lastUpdated: '2024-01-15' },
  ]);

  const [docSettings, setDocSettings] = useState<DocSettings>({
    autoGenerate: true,
    includeExamples: true,
    validationLevel: 'strict',
    outputFormat: 'json',
  });

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'POST': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'PUT': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'DELETE': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'PATCH': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const downloadSpec = (format: string) => {
    console.log(`Downloading spec in ${format} format`);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              OpenAPI/Swagger Documentation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tài liệu OpenAPI/Swagger đầy đủ
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Endpoints</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{docEndpoints.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Schemas</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{docSchemas.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">With Schema</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{docEndpoints.filter(e => e.hasSchema).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Format</p>
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{docSettings.outputFormat.toUpperCase()}</p>
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
            onClick={() => downloadSpec('json')}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Download JSON
          </button>
          <button
            type="button"
            onClick={() => downloadSpec('yaml')}
            className="px-3 py-1.5 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-700 text-white border-0 flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Download YAML
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Documentation Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-green-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Generate</span>
              </div>
              <input
                type="checkbox"
                checked={docSettings.autoGenerate}
                onChange={(e) => setDocSettings({ ...docSettings, autoGenerate: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Examples</span>
              </div>
              <input
                type="checkbox"
                checked={docSettings.includeExamples}
                onChange={(e) => setDocSettings({ ...docSettings, includeExamples: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Validation Level</span>
              </div>
              <select
                value={docSettings.validationLevel}
                onChange={(e) => setDocSettings({ ...docSettings, validationLevel: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="strict">Strict</option>
                <option value="lenient">Lenient</option>
                <option value="none">None</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Search className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Output Format</span>
              </div>
              <select
                value={docSettings.outputFormat}
                onChange={(e) => setDocSettings({ ...docSettings, outputFormat: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Documented Endpoints</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {docEndpoints.map((endpoint) => (
              <div key={endpoint.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <FileText className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getMethodColor(endpoint.method)}`}>
                          {endpoint.method}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{endpoint.path}</span>
                        {endpoint.hasSchema && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Has Schema
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{endpoint.summary}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-600 hover:bg-slate-700 text-white flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View
                  </button>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Updated: {endpoint.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Data Schemas</h4>
          <div className="space-y-2">
            {docSchemas.map((schema) => (
              <div key={schema.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                      <FileText className="h-4 w-4 text-teal-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{schema.name}</span>
                        <span className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {schema.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Fields: {schema.fields} • Updated: {schema.lastUpdated}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-600 hover:bg-slate-700 text-white flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">OpenAPI/Swagger Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Auto-generate documentation from code</li>
              <li>• Include request/response examples</li>
              <li>• Export in JSON or YAML format</li>
              <li>• Validation level for schema compliance</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
