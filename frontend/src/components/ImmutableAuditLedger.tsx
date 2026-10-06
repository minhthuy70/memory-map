'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  previousHash: string | null;
  currentHash: string;
  createdAt: string;
}

export default function ImmutableAuditLedger() {
  const { token } = useAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filterAction, setFilterAction] = useState('');
  const [integrityResult, setIntegrityResult] = useState<any>(null);

  useEffect(() => {
    fetchAuditLogs();
  }, [token, filterAction]);

  const fetchAuditLogs = async () => {
    try {
      const url = filterAction
        ? `http://localhost:3001/privacy-vault/audit-log?action=${filterAction}`
        : 'http://localhost:3001/privacy-vault/audit-log';

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAuditLogs(data);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    }
  };

  const verifyIntegrity = async () => {
    try {
      const response = await fetch('http://localhost:3001/privacy-vault/audit-log/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setIntegrityResult(data);
    } catch (error) {
      console.error('Failed to verify integrity:', error);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login':
        return 'bg-blue-100 text-blue-700';
      case 'vault_access':
        return 'bg-purple-100 text-purple-700';
      case 'vault_create':
        return 'bg-green-100 text-green-700';
      case 'vault_destroy':
        return 'bg-red-100 text-red-700';
      case 'duress_password_used':
        return 'bg-orange-100 text-orange-700';
      case 'emergency_kill_switch':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Immutable Audit Log Ledger</h2>
        <button
          onClick={verifyIntegrity}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔐 Verify Integrity
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Action</label>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Actions</option>
          <option value="login">Login</option>
          <option value="vault_access">Vault Access</option>
          <option value="vault_create">Vault Create</option>
          <option value="vault_destroy">Vault Destroy</option>
          <option value="duress_password_used">Duress Password Used</option>
          <option value="emergency_kill_switch">Emergency Kill Switch</option>
        </select>
      </div>

      {/* Integrity Result */}
      {integrityResult && (
        <div className={`mb-6 p-4 rounded-lg ${
          integrityResult.allValid
            ? 'bg-green-50 border-2 border-green-200'
            : 'bg-red-50 border-2 border-red-200'
        }`}>
          <h3 className="font-semibold mb-2">
            {integrityResult.allValid ? '✓ Audit Log Integrity Verified' : '⚠️ Audit Log Integrity Compromised'}
          </h3>
          <p className="text-sm text-gray-600">
            Checked {integrityResult.results.length} log entries
          </p>
        </div>
      )}

      {/* Audit Logs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Audit Logs ({auditLogs.length})
        </h3>

        {auditLogs.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No audit logs found</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getActionColor(log.action)}`}>
                      {log.action.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">{log.entityType}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {log.entityId && (
                    <div>
                      <span className="text-gray-500">Entity ID:</span>{' '}
                      <span className="font-mono">{log.entityId.substring(0, 16)}...</span>
                    </div>
                  )}
                  {log.ipAddress && (
                    <div>
                      <span className="text-gray-500">IP:</span> {log.ipAddress}
                    </div>
                  )}
                </div>

                <div className="mt-2 p-2 bg-gray-100 rounded">
                  <div className="text-xs">
                    <span className="text-gray-500">Hash:</span>{' '}
                    <code className="text-xs">{log.currentHash.substring(0, 32)}...</code>
                  </div>
                  {log.previousHash && (
                    <div className="text-xs mt-1">
                      <span className="text-gray-500">Previous:</span>{' '}
                      <code className="text-xs">{log.previousHash.substring(0, 32)}...</code>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Cryptographic Chain</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• SHA-256 cryptographic chained audit log</li>
          <li>• Tamper-evident security tracking</li>
          <li>• Logs all logins, exports, edits, viewings</li>
          <li>• Vault entries tracked for security</li>
        </ul>
      </div>
    </div>
  );
}
