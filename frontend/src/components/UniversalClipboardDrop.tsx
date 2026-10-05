'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface ClipboardSync {
  id: string;
  clipboardId: string;
  dataType: string;
  data: string;
  sourceDevice: string;
  expiresAt: string;
  createdAt: string;
}

export default function UniversalClipboardDrop() {
  const { token } = useAuth();
  const [clipboardSyncs, setClipboardSyncs] = useState<ClipboardSync[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSync, setNewSync] = useState({
    dataType: 'text',
    data: '',
    sourceDevice: '',
    expiresAt: '',
  });
  const [clipboardId, setClipboardId] = useState('');
  const [syncedData, setSyncedData] = useState<ClipboardSync | null>(null);

  useEffect(() => {
    fetchClipboardSyncs();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchClipboardSyncs, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const fetchClipboardSyncs = async () => {
    try {
      const response = await fetch('http://localhost:3001/hybrid-cloud/clipboard-sync', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setClipboardSyncs(data);
    } catch (error) {
      console.error('Failed to fetch clipboard syncs:', error);
    }
  };

  const createSync = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/hybrid-cloud/clipboard-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSync),
      });

      setShowAddForm(false);
      setNewSync({ dataType: 'text', data: '', sourceDevice: '', expiresAt: '' });
      await fetchClipboardSyncs();
    } catch (error) {
      console.error('Failed to create sync:', error);
    }
  };

  const fetchSync = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/hybrid-cloud/clipboard-sync/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSyncedData(data);

        // Copy to clipboard
        const parsedData = JSON.parse(data.data);
        if (data.dataType === 'text' && parsedData.text) {
          await navigator.clipboard.writeText(parsedData.text);
          alert('Copied to clipboard!');
        }
      }
    } catch (error) {
      console.error('Failed to fetch sync:', error);
    }
  };

  const deleteSync = async (clipboardId: string) => {
    try {
      await fetch(`http://localhost:3001/hybrid-cloud/clipboard-sync/${clipboardId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchClipboardSyncs();
    } catch (error) {
      console.error('Failed to delete sync:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };

      setNewSync({
        ...newSync,
        dataType: 'location',
        data: JSON.stringify(locationData),
      });
    } catch (error) {
      alert('Failed to get location');
    }
  };

  const dataTypeOptions = [
    { value: 'text', label: 'Text', icon: '📝' },
    { value: 'location', label: 'Location', icon: '📍' },
    { value: 'photo', label: 'Photo', icon: '📷' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Universal Cross-device Clipboard</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Share to Clipboard
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Share to Other Devices</h3>
          <form onSubmit={createSync} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Type</label>
              <select
                value={newSync.dataType}
                onChange={(e) => setNewSync({ ...newSync, dataType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {dataTypeOptions.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            {newSync.dataType === 'location' && (
              <div>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Get Current Location
                </button>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data (JSON)</label>
              <textarea
                value={newSync.data}
                onChange={(e) => setNewSync({ ...newSync, data: e.target.value })}
                placeholder='{"text": "Hello World"}'
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source Device</label>
              <input
                type="text"
                value={newSync.sourceDevice}
                onChange={(e) => setNewSync({ ...newSync, sourceDevice: e.target.value })}
                placeholder="iPhone 15 Pro"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expires In (minutes)</label>
              <input
                type="number"
                value={newSync.expiresAt}
                onChange={(e) => setNewSync({ ...newSync, expiresAt: e.target.value })}
                placeholder="5"
                min="1"
                max="60"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Share
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

      {/* Clipboard Syncs List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Available Syncs</h3>

        {clipboardSyncs.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No clipboard syncs available</p>
        ) : (
          <div className="space-y-2">
            {clipboardSyncs.map((sync) => {
              const isExpired = new Date(sync.expiresAt) < new Date();
              const timeLeft = Math.max(0, Math.floor((new Date(sync.expiresAt).getTime() - Date.now()) / 1000));

              return (
                <div
                  key={sync.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    isExpired ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">
                          {sync.dataType === 'text' ? '📝' : sync.dataType === 'location' ? '📍' : '📷'}
                        </span>
                        <span className="font-medium text-gray-800 capitalize">{sync.dataType}</span>
                        <span className="text-xs text-gray-500">from {sync.sourceDevice}</span>
                        {isExpired && (
                          <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
                            Expired
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 mb-1">
                        Created: {new Date(sync.createdAt).toLocaleString()}
                      </p>

                      {!isExpired && (
                        <p className="text-xs text-gray-400">
                          Expires in: {Math.floor(timeLeft / 60)}m {timeLeft % 60}s
                        </p>
                      )}

                      <code className="text-xs text-gray-600 mt-2 block">
                        {sync.data.substring(0, 100)}{sync.data.length > 100 ? '...' : ''}
                      </code>
                    </div>

                    <div className="flex gap-2 ml-4">
                      {!isExpired && (
                        <button
                          onClick={() => fetchSync(sync.clipboardId)}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm transition-colors"
                        >
                          Copy
                        </button>
                      )}
                      <button
                        onClick={() => deleteSync(sync.clipboardId)}
                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">How It Works</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Copy location or photo on your phone</li>
          <li>• Share to clipboard via this app</li>
          <li>• Paste directly into memory editor on desktop</li>
          <li>• Zero latency - works instantly</li>
        </ul>
      </div>
    </div>
  );
}
