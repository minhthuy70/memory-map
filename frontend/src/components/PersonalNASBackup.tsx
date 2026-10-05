'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface NASBackup {
  id: string;
  provider: string;
  backupPath: string;
  backupSize: string;
  lastBackupAt?: string;
  schedule: string;
  isActive: boolean;
  status: string;
  errorMessage?: string;
  createdAt: string;
}

export default function PersonalNASBackup() {
  const { token } = useAuth();
  const [backups, setBackups] = useState<NASBackup[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBackup, setNewBackup] = useState({
    provider: 'webdav',
    backupPath: '',
    schedule: 'daily',
    isActive: true,
  });

  useEffect(() => {
    fetchBackups();
  }, [token]);

  const fetchBackups = async () => {
    try {
      const response = await fetch('http://localhost:3001/hybrid-cloud/nas-backup', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBackups(data);
    } catch (error) {
      console.error('Failed to fetch backups:', error);
    }
  };

  const createBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/hybrid-cloud/nas-backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBackup),
      });

      setShowAddForm(false);
      setNewBackup({ provider: 'webdav', backupPath: '', schedule: 'daily', isActive: true });
      await fetchBackups();
    } catch (error) {
      console.error('Failed to create backup:', error);
    }
  };

  const triggerBackup = async (id: string) => {
    try {
      await fetch(`http://localhost:3001/hybrid-cloud/nas-backup/${id}/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ backupId: id }),
      });

      await fetchBackups();
    } catch (error) {
      console.error('Failed to trigger backup:', error);
    }
  };

  const deleteBackup = async (id: string) => {
    if (!confirm('Are you sure you want to delete this backup configuration?')) return;

    try {
      await fetch(`http://localhost:3001/hybrid-cloud/nas-backup/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchBackups();
    } catch (error) {
      console.error('Failed to delete backup:', error);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await fetch(`http://localhost:3001/hybrid-cloud/nas-backup/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      await fetchBackups();
    } catch (error) {
      console.error('Failed to toggle backup:', error);
    }
  };

  const formatSize = (size: string) => {
    const num = BigInt(size);
    const gb = Number(num) / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Personal NAS & Private Cloud Backup</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Backup Configuration
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Configure New Backup</h3>
          <form onSubmit={createBackup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
              <select
                value={newBackup.provider}
                onChange={(e) => setNewBackup({ ...newBackup, provider: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="webdav">WebDAV</option>
                <option value="s3">S3 Compatible</option>
                <option value="dropbox">Dropbox</option>
                <option value="onedrive">OneDrive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Backup Path</label>
              <input
                type="text"
                value={newBackup.backupPath}
                onChange={(e) => setNewBackup({ ...newBackup, backupPath: e.target.value })}
                placeholder="/backups/memory-map"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
              <select
                value={newBackup.schedule}
                onChange={(e) => setNewBackup({ ...newBackup, schedule: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Backup
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

      {/* Backups List */}
      <div className="space-y-4">
        {backups.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No backup configurations found</p>
        ) : (
          backups.map((backup) => (
            <div
              key={backup.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700 uppercase">
                      {backup.provider}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      backup.status === 'success' ? 'bg-green-100 text-green-700' :
                      backup.status === 'running' ? 'bg-yellow-100 text-yellow-700' :
                      backup.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {backup.status}
                    </span>
                    {!backup.isActive && (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                        Inactive
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-1">Path: {backup.backupPath}</p>
                  <p className="text-sm text-gray-500 mb-1">Schedule: {backup.schedule}</p>

                  {backup.lastBackupAt && (
                    <p className="text-xs text-gray-400">
                      Last backup: {new Date(backup.lastBackupAt).toLocaleString()}
                    </p>
                  )}

                  {backup.backupSize && backup.backupSize !== '0' && (
                    <p className="text-xs text-gray-400">Size: {formatSize(backup.backupSize)}</p>
                  )}

                  {backup.errorMessage && (
                    <p className="text-xs text-red-500 mt-1">Error: {backup.errorMessage}</p>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => triggerBackup(backup.id)}
                    disabled={backup.status === 'running' || !backup.isActive}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Backup Now
                  </button>
                  <button
                    onClick={() => toggleActive(backup.id, backup.isActive)}
                    className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 text-sm transition-colors"
                  >
                    {backup.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => deleteBackup(backup.id)}
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
        <h4 className="font-semibold text-blue-800 mb-2">Supported Providers</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>WebDAV:</strong> Synology NAS, QNAP, Nextcloud, TrueNAS</li>
          <li>• <strong>S3 Compatible:</strong> AWS S3, MinIO, Wasabi, Backblaze</li>
          <li>• <strong>Cloud Storage:</strong> Dropbox, OneDrive</li>
        </ul>
      </div>
    </div>
  );
}
