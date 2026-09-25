'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Fingerprint,
  Info,
  Key,
  Lock,
  RefreshCw,
  ShieldCheck,
  Star,
  Unlock,
  Zap
} from 'lucide-react';

interface ZeroKnowledgeProofAuthProps {
  onCancel?: () => void;
}

interface ZKPMethod {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  verificationTime: number;
  securityLevel: 'low' | 'medium' | 'high';
}

interface ZKPVerification {
  id: string;
  userId: string;
  userName: string;
  method: string;
  status: 'pending' | 'verified' | 'failed';
  timestamp: string;
  proofHash: string;
}

interface ZKPConfig {
  enableZKP: boolean;
  requireProof: boolean;
  proofTimeout: number;
  maxAttempts: number;
}

export default function ZeroKnowledgeProofAuth({ onCancel }: ZeroKnowledgeProofAuthProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isZKPEnabled, setIsZKPEnabled] = useState(true);

  const [zkpMethods, setZkpMethods] = useState<ZKPMethod[]>([
    { id: '1', name: 'ZK-SNARK', description: 'Zero-Knowledge Succinct Non-Interactive Argument of Knowledge', isEnabled: true, verificationTime: 0.5, securityLevel: 'high' },
    { id: '2', name: 'ZK-STARK', description: 'Zero-Knowledge Scalable Transparent Argument of Knowledge', isEnabled: true, verificationTime: 1.0, securityLevel: 'high' },
    { id: '3', name: 'Bulletproofs', description: 'Zero-knowledge proof without trusted setup', isEnabled: false, verificationTime: 0.8, securityLevel: 'medium' },
    { id: '4', name: 'Ring Signatures', description: 'Anonymity-preserving signature scheme', isEnabled: false, verificationTime: 0.3, securityLevel: 'medium' },
  ]);

  const [zkpVerifications, setZkpVerifications] = useState<ZKPVerification[]>([
    { id: '1', userId: 'user1', userName: 'John Doe', method: 'ZK-SNARK', status: 'verified', timestamp: '2024-01-15 10:30', proofHash: '0x123...abc' },
    { id: '2', userId: 'user2', userName: 'Jane Smith', method: 'ZK-STARK', status: 'verified', timestamp: '2024-02-20 11:45', proofHash: '0x456...def' },
    { id: '3', userId: 'user3', userName: 'Mike Johnson', method: 'ZK-SNARK', status: 'failed', timestamp: '2024-03-10 14:20', proofHash: '0x789...ghi' },
  ]);

  const [zkpConfig, setZkpConfig] = useState<ZKPConfig>({
    enableZKP: true,
    requireProof: true,
    proofTimeout: 30,
    maxAttempts: 3,
  });

  const toggleMethod = (id: string) => {
    setZkpMethods(zkpMethods.map(method => 
      method.id === id ? { ...method, isEnabled: !method.isEnabled } : method
    ));
  };

  const verifyProof = (userId: string, userName: string, method: string) => {
    const newVerification: ZKPVerification = {
      id: Date.now().toString(),
      userId,
      userName,
      method,
      status: 'verified',
      timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
      proofHash: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 3)}`,
    };
    setZkpVerifications([...zkpVerifications, newVerification]);
  };

  const getSecurityColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'low': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Zero-knowledge Proof Auth
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Authentication without revealing secrets
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isZKPEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isZKPEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Methods</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{zkpMethods.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{zkpMethods.filter(m => m.isEnabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Verifications</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{zkpVerifications.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Success Rate</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{((zkpVerifications.filter(v => v.status === 'verified').length / zkpVerifications.length) * 100).toFixed(0)}%</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isZKPEnabled}
              onChange={(e) => setIsZKPEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable ZKP Auth</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Fingerprint className="h-3 w-3" />
            Generate Proof
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">ZKP Methods</h4>
          <div className="space-y-2">
            {zkpMethods.map((method) => (
              <div key={method.id} className={`p-3 rounded-lg border ${method.isEnabled ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-violet-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{method.name}</span>
                        {method.isEnabled && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{method.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{method.verificationTime}s</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Verification</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${getSecurityColor(method.securityLevel)}`}>
                      {method.securityLevel}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleMethod(method.id)}
                    className={`px-2 py-1 rounded text-xs ${method.isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {method.isEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">ZKP Configuration</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Require Proof</span>
              </div>
              <input
                type="checkbox"
                checked={zkpConfig.requireProof}
                onChange={(e) => setZkpConfig({ ...zkpConfig, requireProof: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Key className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Proof Timeout</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={zkpConfig.proofTimeout}
                  onChange={(e) => setZkpConfig({ ...zkpConfig, proofTimeout: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">seconds</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Unlock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Max Attempts</span>
              </div>
              <input
                type="number"
                value={zkpConfig.maxAttempts}
                onChange={(e) => setZkpConfig({ ...zkpConfig, maxAttempts: parseInt(e.target.value) })}
                className="w-20 px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Verification History</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {zkpVerifications.map((verification) => (
              <div key={verification.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Fingerprint className="h-4 w-4 text-violet-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{verification.userName}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(verification.status)}`}>
                          {verification.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Method: {verification.method}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{verification.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Proof Hash: {verification.proofHash}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">ZKP Auth Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• ZK-SNARK: Fast verification, high security</li>
              <li>• ZK-STARK: Transparent, no trusted setup</li>
              <li>• Bulletproofs: No trusted setup, efficient</li>
              <li>• Authentication without revealing passwords</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
