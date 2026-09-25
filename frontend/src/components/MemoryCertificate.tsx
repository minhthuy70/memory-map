'use client';

import { useState } from 'react';
import { Award, X, RefreshCw, Info, CheckCircle, Star, Zap, Shield, Download, Share2, ExternalLink, Hash } from 'lucide-react';

interface MemoryCertificateProps {
  onCancel?: () => void;
}

interface CertificateData {
  id: string;
  memoryId: string;
  memoryTitle: string;
  certificateNumber: string;
  issueDate: string;
  issuer: string;
  blockchain: string;
  contractAddress: string;
  transactionHash: string;
  signature: string;
  isValid: boolean;
  status: 'valid' | 'revoked' | 'expired';
}

export default function MemoryCertificate({ onCancel }: MemoryCertificateProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isCertificateEnabled, setIsCertificateEnabled] = useState(true);

  const [certificates, setCertificates] = useState<CertificateData[]>([
    { 
      id: '1', 
      memoryId: 'mem1', 
      memoryTitle: 'First Trip to Paris', 
      certificateNumber: 'CERT-2024-001', 
      issueDate: '2024-01-16', 
      issuer: 'Memory Map DAO', 
      blockchain: 'Ethereum', 
      contractAddress: '0x123...abc', 
      transactionHash: '0x456...def', 
      signature: '0x789...012', 
      isValid: true, 
      status: 'valid' 
    },
    { 
      id: '2', 
      memoryId: 'mem2', 
      memoryTitle: 'Beach Day', 
      certificateNumber: 'CERT-2024-002', 
      issueDate: '2024-02-21', 
      issuer: 'Memory Map DAO', 
      blockchain: 'Polygon', 
      contractAddress: '0xabc...def', 
      transactionHash: '0xdef...ghi', 
      signature: '0xghi...jkl', 
      isValid: true, 
      status: 'valid' 
    },
    { 
      id: '3', 
      memoryId: 'mem3', 
      memoryTitle: 'Mountain Hiking', 
      certificateNumber: 'CERT-2024-003', 
      issueDate: '2023-03-11', 
      issuer: 'Memory Map DAO', 
      blockchain: 'Ethereum', 
      contractAddress: '0x123...abc', 
      transactionHash: '0x789...abc', 
      signature: '0x012...345', 
      isValid: false, 
      status: 'expired' 
    },
  ]);

  const issueCertificate = (memoryId: string, memoryTitle: string) => {
    const newCertificate: CertificateData = {
      id: Date.now().toString(),
      memoryId,
      memoryTitle,
      certificateNumber: `CERT-2024-${String(certificates.length + 1).padStart(3, '0')}`,
      issueDate: new Date().toISOString().split('T')[0],
      issuer: 'Memory Map DAO',
      blockchain: 'Ethereum',
      contractAddress: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 3)}`,
      transactionHash: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 3)}`,
      signature: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 3)}`,
      isValid: true,
      status: 'valid',
    };
    setCertificates([...certificates, newCertificate]);
  };

  const revokeCertificate = (id: string) => {
    setCertificates(certificates.map(cert => 
      cert.id === id ? { ...cert, isValid: false, status: 'revoked' as const } : cert
    ));
  };

  const verifyCertificate = (id: string) => {
    setCertificates(certificates.map(cert => 
      cert.id === id ? { ...cert, isValid: true, status: 'valid' as const } : cert
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'revoked': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'expired': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getBlockchainColor = (blockchain: string) => {
    switch (blockchain) {
      case 'Ethereum': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'Polygon': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'Solana': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'BSC': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <Certificate className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Memory Certificate
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Blockchain digital signature verification
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isCertificateEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isCertificateEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{certificates.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Valid</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{certificates.filter(c => c.status === 'valid').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Revoked</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{certificates.filter(c => c.status === 'revoked').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Expired</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{certificates.filter(c => c.status === 'expired').length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isCertificateEnabled}
              onChange={(e) => setIsCertificateEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Certificates</span>
          </div>
          <button
            type="button"
            onClick={() => issueCertificate('mem4', 'New Memory')}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Certificate className="h-3 w-3" />
            Issue Certificate
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Certificates</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {certificates.map((cert) => (
              <div key={cert.id} className={`p-3 rounded-lg border ${cert.isValid ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-amber-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{cert.memoryTitle}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(cert.status)}`}>
                          {cert.status}
                        </span>
                        {cert.isValid && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {cert.certificateNumber} • Issued: {cert.issueDate}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-xs ${getBlockchainColor(cert.blockchain)}`}>
                      {cert.blockchain}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Issuer: {cert.issuer}</span>
                    <span>•</span>
                    <span className="font-mono">{cert.contractAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Hash className="h-3 w-3" />
                    <span className="font-mono">{cert.transactionHash}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Signature: {cert.signature}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {cert.status === 'valid' && (
                    <button
                      type="button"
                      onClick={() => revokeCertificate(cert.id)}
                      className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white"
                    >
                      Revoke
                    </button>
                  )}
                  {cert.status !== 'valid' && (
                    <button
                      type="button"
                      onClick={() => verifyCertificate(cert.id)}
                      className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white"
                    >
                      Verify
                    </button>
                  )}
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1"
                  >
                    <Share2 className="h-3 w-3" />
                    Share
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View on Chain
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Certificate Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Certificates provide blockchain-verified authenticity</li>
              <li>• Digital signatures are stored on-chain</li>
              <li>• Certificates can be revoked if needed</li>
              <li>• Verification happens instantly on blockchain</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
