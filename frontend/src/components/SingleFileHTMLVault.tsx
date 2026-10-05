'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface VaultExport {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: string;
  exportDate: string;
  expiresAt?: string;
  downloadCount: number;
  isPublic: boolean;
  accessCode?: string;
}

export default function SingleFileHTMLVault() {
  const { token } = useAuth();
  const [exports, setExports] = useState<VaultExport[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExport, setNewExport] = useState({
    fileName: '',
    isPublic: false,
    expiresAt: '',
  });
  const [accessCode, setAccessCode] = useState('');
  const [accessedExport, setAccessedExport] = useState<VaultExport | null>(null);

  useEffect(() => {
    fetchExports();
  }, [token]);

  const fetchExports = async () => {
    try {
      const response = await fetch('http://localhost:3001/hybrid-cloud/vault-export', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setExports(data);
    } catch (error) {
      console.error('Failed to fetch exports:', error);
    }
  };

  const createExport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/hybrid-cloud/vault-export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExport),
      });

      setShowAddForm(false);
      setNewExport({ fileName: '', isPublic: false, expiresAt: '' });
      await fetchExports();
    } catch (error) {
      console.error('Failed to create export:', error);
    }
  };

  const deleteExport = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vault export?')) return;

    try {
      await fetch(`http://localhost:3001/hybrid-cloud/vault-export/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchExports();
    } catch (error) {
      console.error('Failed to delete export:', error);
    }
  };

  const verifyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/hybrid-cloud/vault-export/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessCode }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessedExport(data);
      } else {
        alert('Invalid or expired access code');
      }
    } catch (error) {
      console.error('Failed to verify access:', error);
      alert('Failed to verify access code');
    }
  };

  const formatSize = (size: string) => {
    const num = BigInt(size);
    const mb = Number(num) / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Single-file HTML Vault Export</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Export Vault
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Export Your Memory Vault</h3>
          <form onSubmit={createExport} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File Name</label>
              <input
                type="text"
                value={newExport.fileName}
                onChange={(e) => setNewExport({ ...newExport, fileName: e.target.value })}
                placeholder="my-memory-vault"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={newExport.isPublic}
                onChange={(e) => setNewExport({ ...newExport, isPublic: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-700">
                Make publicly accessible (requires access code)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date (Optional)</label>
              <input
                type="datetime-local"
                value={newExport.expiresAt}
                onChange={(e) => setNewExport({ ...newExport, expiresAt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Generate Export
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Access Code Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Access Public Export</h3>
        <form onSubmit={verifyAccess} className="flex gap-2">
          <input
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Enter access code"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Access
          </button>
        </form>

        {accessedExport && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800 font-medium">Access Granted!</p>
            <p className="text-sm text-green-700">File: {accessedExport.fileName}</p>
            <p className="text-sm text-green-700">Downloads: {accessedExport.downloadCount}</p>
          </div>
        )}
      </div>

      {/* Exports List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Your Exports</h3>

        {exports.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No vault exports found</p>
        ) : (
          exports.map((vaultExport) => (
            <div
              key={vaultExport.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-gray-800">{vaultExport.fileName}.html</span>
                    {vaultExport.isPublic && (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                        Public
                      </span>
                    )}
                    {vaultExport.expiresAt && new Date(vaultExport.expiresAt) < new Date() && (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
                        Expired
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-1">Size: {formatSize(vaultExport.fileSize)}</p>
                  <p className="text-sm text-gray-500 mb-1">
                    Exported: {new Date(vaultExport.exportDate).toLocaleString()}
                  </p>

                  {vaultExport.expiresAt && (
                    <p className="text-xs text-gray-400">
                      Expires: {new Date(vaultExport.expiresAt).toLocaleString()}
                    </p>
                  )}

                  <p className="text-xs text-gray-400">Downloads: {vaultExport.downloadCount}</p>

                  {vaultExport.accessCode && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-500">Access Code:</span>
                      <code className="px-2 py-1 bg-gray-100 rounded text-xs">{vaultExport.accessCode}</code>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm transition-colors"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => deleteExport(vaultExport.id)}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">What's Included</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• All memories with metadata</li>
          <li>• Images embedded as base64</li>
          <li>• Interactive map viewer</li>
          <li>• Full-text search engine</li>
          <li>• Completely self-contained - no internet required</li>
        </ul>
      </div>
    </div>
  );
}
