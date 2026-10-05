'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface OfflineSync {
  id: string;
  entityType: string;
  entityId: string;
  operation: string;
  data: string;
  createdAt: string;
  syncedAt?: string;
  isSynced: boolean;
}

export default function OfflineCRDTSync() {
  const { token } = useAuth();
  const [pendingSyncs, setPendingSyncs] = useState<OfflineSync[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      fetchPendingSyncs();
    }
  }, [isOnline, token]);

  const fetchPendingSyncs = async () => {
    try {
      const response = await fetch('http://localhost:3001/hybrid-cloud/offline-sync/pending', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPendingSyncs(data);
    } catch (error) {
      console.error('Failed to fetch pending syncs:', error);
    }
  };

  const syncAllChanges = async () => {
    setIsSyncing(true);
    setSyncStatus('Syncing...');

    try {
      const response = await fetch('http://localhost:3001/hybrid-cloud/offline-sync/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ forceSync: false }),
      });

      const data = await response.json();
      setSyncStatus(`Synced ${data.syncedCount} changes`);
      await fetchPendingSyncs();
    } catch (error) {
      setSyncStatus('Sync failed');
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(''), 3000);
    }
  };

  const createOfflineChange = async (entityType: string, entityId: string, operation: string, data: any) => {
    try {
      await fetch('http://localhost:3001/hybrid-cloud/offline-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          entityType,
          entityId,
          operation,
          data: JSON.stringify(data),
        }),
      });

      await fetchPendingSyncs();
    } catch (error) {
      console.error('Failed to create offline change:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Offline Sync with CRDTs</h2>

      {/* Connection Status */}
      <div className="mb-6">
        <div className={`flex items-center gap-2 ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="font-medium">
            {isOnline ? 'Online - Sync available' : 'Offline - Changes queued locally'}
          </span>
        </div>
      </div>

      {/* Sync Controls */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={syncAllChanges}
          disabled={!isOnline || isSyncing || pendingSyncs.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSyncing ? 'Syncing...' : `Sync ${pendingSyncs.length} Pending Changes`}
        </button>

        <button
          onClick={fetchPendingSyncs}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Sync Status */}
      {syncStatus && (
        <div className="mb-6 p-3 bg-blue-50 text-blue-700 rounded-lg">
          {syncStatus}
        </div>
      )}

      {/* Pending Changes List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Pending Changes</h3>

        {pendingSyncs.length === 0 ? (
          <p className="text-gray-500 py-4">No pending changes to sync</p>
        ) : (
          <div className="space-y-2">
            {pendingSyncs.map((sync) => (
              <div
                key={sync.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        sync.operation === 'create' ? 'bg-green-100 text-green-700' :
                        sync.operation === 'update' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {sync.operation.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">{sync.entityType}</span>
                    </div>
                    <p className="text-sm text-gray-500">ID: {sync.entityId}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Created: {new Date(sync.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Demo Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Demo Actions</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => createOfflineChange('memory', 'demo-1', 'create', { title: 'Test Memory' })}
            className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm transition-colors"
          >
            Add Demo Create
          </button>
          <button
            onClick={() => createOfflineChange('memory', 'demo-1', 'update', { title: 'Updated Memory' })}
            className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 text-sm transition-colors"
          >
            Add Demo Update
          </button>
          <button
            onClick={() => createOfflineChange('memory', 'demo-1', 'delete', {})}
            className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm transition-colors"
          >
            Add Demo Delete
          </button>
        </div>
      </div>
    </div>
  );
}
