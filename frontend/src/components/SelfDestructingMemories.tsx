'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface VaultMemory {
  id: string;
  memoryId: string;
  vaultType: string;
  isEncrypted: boolean;
  viewCount: number;
  maxViews: number | null;
  expiresAt: string | null;
  isDestroyed: boolean;
  destroyedAt: string | null;
  createdAt: string;
}

export default function SelfDestructingMemories() {
  const { token } = useAuth();
  const [vaultMemories, setVaultMemories] = useState<VaultMemory[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemory, setNewMemory] = useState({
    memoryId: '',
    vaultType: 'ephemeral',
    maxViews: 1,
    expiresAfter: '24h',
  });

  useEffect(() => {
    fetchVaultMemories();
  }, [token]);

  const fetchVaultMemories = async () => {
    try {
      const response = await fetch('http://localhost:3001/privacy-vault/vault?vaultType=ephemeral', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setVaultMemories(data);
    } catch (error) {
      console.error('Failed to fetch vault memories:', error);
    }
  };

  const createVaultMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const expiresAt = new Date();
      if (newMemory.expiresAfter === '24h') {
        expiresAt.setHours(expiresAt.getHours() + 24);
      } else if (newMemory.expiresAfter === '7d') {
        expiresAt.setDate(expiresAt.getDate() + 7);
      }

      await fetch('http://localhost:3001/privacy-vault/vault', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newMemory,
          expiresAt: expiresAt.toISOString(),
        }),
      });

      setShowAddForm(false);
      setNewMemory({ memoryId: '', vaultType: 'ephemeral', maxViews: 1, expiresAfter: '24h' });
      await fetchVaultMemories();
    } catch (error) {
      console.error('Failed to create vault memory:', error);
    }
  };

  const accessMemory = async (id: string) => {
    try {
      await fetch(`http://localhost:3001/privacy-vault/vault/${id}/access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ accessMethod: 'password' }),
      });

      await fetchVaultMemories();
    } catch (error) {
      console.error('Failed to access memory:', error);
    }
  };

  const destroyMemory = async (id: string) => {
    if (!confirm('Are you sure you want to destroy this memory immediately?')) return;

    try {
      await fetch(`http://localhost:3001/privacy-vault/vault/${id}/destroy`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchVaultMemories();
    } catch (error) {
      console.error('Failed to destroy memory:', error);
    }
  };

  const deleteMemory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vault memory?')) return;

    try {
      await fetch(`http://localhost:3001/privacy-vault/vault/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchVaultMemories();
    } catch (error) {
      console.error('Failed to delete memory:', error);
    }
  };

  const getTimeRemaining = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Ephemeral Self-destructing Memories</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Add Self-destruct Memory
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg border-2 border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-4">Create Self-destructing Memory</h3>
          <form onSubmit={createVaultMemory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Memory ID</label>
              <input
                type="text"
                value={newMemory.memoryId}
                onChange={(e) => setNewMemory({ ...newMemory, memoryId: e.target.value })}
                placeholder="Enter memory ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Views</label>
              <input
                type="number"
                value={newMemory.maxViews}
                onChange={(e) => setNewMemory({ ...newMemory, maxViews: parseInt(e.target.value) })}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Memory will auto-destroy after this many views</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expires After</label>
              <select
                value={newMemory.expiresAfter}
                onChange={(e) => setNewMemory({ ...newMemory, expiresAfter: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="24h">24 hours</option>
                <option value="7d">7 days</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Create Self-destruct Memory
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

      {/* Vault Memories */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Self-destructing Memories</h3>

        {vaultMemories.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No self-destructing memories</p>
        ) : (
          <div className="space-y-3">
            {vaultMemories.map((memory) => (
              <div
                key={memory.id}
                className={`p-4 border rounded-lg transition-colors ${
                  memory.isDestroyed
                    ? 'border-red-400 bg-red-50 opacity-60'
                    : 'border-red-200 hover:bg-red-50'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {memory.isDestroyed && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
                          Destroyed
                        </span>
                      )}
                      {memory.isEncrypted && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-700">
                          Encrypted
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Memory ID: {memory.memoryId}</p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(memory.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      {memory.viewCount} / {memory.maxViews || '∞'} views
                    </div>
                    {getTimeRemaining(memory.expiresAt) && (
                      <div className="text-xs text-gray-500">
                        {getTimeRemaining(memory.expiresAt)} remaining
                      </div>
                    )}
                  </div>
                </div>

                {!memory.isDestroyed && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => accessMemory(memory.id)}
                      disabled={memory.maxViews && memory.viewCount >= memory.maxViews}
                      className="flex-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      View Memory
                    </button>
                    <button
                      onClick={() => destroyMemory(memory.id)}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm transition-colors"
                    >
                      Destroy Now
                    </button>
                    <button
                      onClick={() => deleteMemory(memory.id)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}

                {memory.destroyedAt && (
                  <p className="text-xs text-red-600 mt-2">
                    Destroyed at: {new Date(memory.destroyedAt).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-red-50 rounded-lg">
        <h4 className="font-semibold text-red-800 mb-2">⚠️ Warning</h4>
        <ul className="text-sm text-red-700 space-y-1">
          <li>• Memories are permanently wiped from database</li>
          <li>• No recovery possible after destruction</li>
          <li>• Use for highly sensitive information only</li>
          <li>• Zero trace left after auto-destruction</li>
        </ul>
      </div>
    </div>
  );
}
