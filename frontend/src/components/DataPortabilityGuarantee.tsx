'use client';

import { useState } from 'react';
import {
  ArrowRightLeft,
  CheckCircle,
  Download,
  ExternalLink,
  FileText,
  Info,
  RefreshCw,
  Shield,
  Star,
  Upload,
  Zap
} from 'lucide-react';

interface DataPortabilityGuaranteeProps {
  onCancel?: () => void;
}

interface PortabilityFeature {
  id: string;
  name: string;
  description: string;
  isSupported: boolean;
  compliance: 'GDPR' | 'CCPA' | 'PDPA' | 'LGPD';
}

interface PortabilityRequest {
  id: string;
  type: 'export' | 'import' | 'transfer';
  platform: string;
  status: 'pending' | 'completed' | 'failed';
  requestedAt: string;
  completedAt?: string;
  dataSize: number;
}

interface SupportedPlatform {
  id: string;
  name: string;
  icon: string;
  exportSupported: boolean;
  importSupported: boolean;
  transferSupported: boolean;
}

export default function DataPortabilityGuarantee({ onCancel }: DataPortabilityGuaranteeProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isPortabilityEnabled, setIsPortabilityEnabled] = useState(true);

  const [portabilityFeatures, setPortabilityFeatures] = useState<PortabilityFeature[]>([
    { id: '1', name: 'Data Export', description: 'Export data in standard formats', isSupported: true, compliance: 'GDPR' },
    { id: '2', name: 'Data Import', description: 'Import data from other platforms', isSupported: true, compliance: 'GDPR' },
    { id: '3', name: 'Data Transfer', description: 'Transfer data between platforms', isSupported: true, compliance: 'GDPR' },
    { id: '4', name: 'API Access', description: 'API for programmatic access', isSupported: true, compliance: 'GDPR' },
    { id: '5', name: 'Machine-readable', description: 'Machine-readable data formats', isSupported: true, compliance: 'GDPR' },
  ]);

  const [portabilityRequests, setPortabilityRequests] = useState<PortabilityRequest[]>([
    { id: '1', type: 'export', platform: 'Google Photos', status: 'completed', requestedAt: '2024-01-15', completedAt: '2024-01-16', dataSize: 250 },
    { id: '2', type: 'import', platform: 'ImagePlus', status: 'completed', requestedAt: '2024-02-20', completedAt: '2024-02-21', dataSize: 180 },
    { id: '3', type: 'transfer', platform: 'Globe2', status: 'pending', requestedAt: '2024-03-10', dataSize: 320 },
  ]);

  const [supportedPlatforms, setSupportedPlatforms] = useState<SupportedPlatform[]>([
    { id: '1', name: 'Google Photos', icon: '📷', exportSupported: true, importSupported: true, transferSupported: true },
    { id: '2', name: 'ImagePlus', icon: '📸', exportSupported: true, importSupported: true, transferSupported: false },
    { id: '3', name: 'Globe2', icon: '📘', exportSupported: true, importSupported: false, transferSupported: true },
    { id: '4', name: 'Apple Photos', icon: '🍎', exportSupported: true, importSupported: true, transferSupported: false },
  ]);

  const toggleFeature = (id: string) => {
    setPortabilityFeatures(portabilityFeatures.map(feature => 
      feature.id === id ? { ...feature, isSupported: !feature.isSupported } : feature
    ));
  };

  const requestExport = (platform: string) => {
    const newRequest: PortabilityRequest = {
      id: Date.now().toString(),
      type: 'export',
      platform,
      status: 'pending',
      requestedAt: new Date().toISOString().split('T')[0],
      dataSize: Math.random() * 100,
    };
    setPortabilityRequests([...portabilityRequests, newRequest]);
  };

  const requestImport = (platform: string) => {
    const newRequest: PortabilityRequest = {
      id: Date.now().toString(),
      type: 'import',
      platform,
      status: 'pending',
      requestedAt: new Date().toISOString().split('T')[0],
      dataSize: Math.random() * 100,
    };
    setPortabilityRequests([...portabilityRequests, newRequest]);
  };

  const completeRequest = (id: string) => {
    setPortabilityRequests(portabilityRequests.map(request => 
      request.id === id 
        ? { ...request, status: 'completed' as const, completedAt: new Date().toISOString().split('T')[0] }
        : request
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'export': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'import': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'transfer': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case 'GDPR': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'CCPA': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'PDPA': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'LGPD': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl">
            <ArrowRightLeft className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Data Portability Guarantee
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Commitment to data portability
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isPortabilityEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isPortabilityEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Features</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{portabilityFeatures.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Supported</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{portabilityFeatures.filter(f => f.isSupported).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Requests</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{portabilityRequests.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Platforms</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{supportedPlatforms.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isPortabilityEnabled}
              onChange={(e) => setIsPortabilityEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Portability</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Request Export
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Upload className="h-3 w-3" />
            Request Import
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Portability Features</h4>
          <div className="space-y-2">
            {portabilityFeatures.map((feature) => (
              <div key={feature.id} className={`p-3 rounded-lg border ${feature.isSupported ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-cyan-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{feature.name}</span>
                        {feature.isSupported && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Supported
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${getComplianceColor(feature.compliance)}`}>
                      {feature.compliance}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleFeature(feature.id)}
                      className={`px-2 py-1 rounded text-xs ${feature.isSupported ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                    >
                      {feature.isSupported ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Supported Platforms</h4>
          <div className="space-y-2">
            {supportedPlatforms.map((platform) => (
              <div key={platform.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{platform.name}</span>
                  </div>
                  <div className="flex gap-2">
                    {platform.exportSupported && (
                      <span className="px-2 py-0.5 rounded text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        Export
                      </span>
                    )}
                    {platform.importSupported && (
                      <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        Import
                      </span>
                    )}
                    {platform.transferSupported && (
                      <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                        Transfer
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {platform.exportSupported && (
                    <button
                      type="button"
                      onClick={() => requestExport(platform.name)}
                      className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Export
                    </button>
                  )}
                  {platform.importSupported && (
                    <button
                      type="button"
                      onClick={() => requestImport(platform.name)}
                      className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                    >
                      <Upload className="h-3 w-3" />
                      Import
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Portability Requests</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {portabilityRequests.map((request) => (
              <div key={request.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{request.platform}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(request.type)}`}>
                          {request.type}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {request.dataSize.toFixed(1)} MB • {request.requestedAt}
                      </p>
                    </div>
                  </div>
                  {request.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => completeRequest(request.id)}
                      className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Portability Guarantee Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• GDPR-compliant data export and import</li>
              <li>• Support for multiple platforms (Google, ImagePlus, Globe2, Apple)</li>
              <li>• Standard data formats for easy transfer</li>
              <li>• API access for programmatic data access</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
