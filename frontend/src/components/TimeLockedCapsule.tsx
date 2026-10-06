'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface TimeLockedCapsule {
  id: string;
  title: string;
  description: string;
  memoryIds: string;
  unlockDate: string;
  isUnlocked: boolean;
  unlockedAt: string | null;
}

export default function TimeLockedCapsule() {
  const { token } = useAuth();
  const [capsules, setCapsules] = useState<TimeLockedCapsule[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCapsule, setNewCapsule] = useState({
    title: '',
    description: '',
    unlockDate: '',
    memoryIds: [] as string[],
  });

  useEffect(() => {
    fetchCapsules();
  }, [token]);

  const fetchCapsules = async () => {
    try {
      const response = await fetch('http://localhost:3001/genealogy/time-capsules', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCapsules(data);
    } catch (error) {
      console.error('Failed to fetch capsules:', error);
    }
  };

  const addCapsule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/genealogy/time-capsules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCapsule),
      });

      setShowAddForm(false);
      setNewCapsule({ title: '', description: '', unlockDate: '', memoryIds: [] });
      await fetchCapsules();
    } catch (error) {
      console.error('Failed to add capsule:', error);
    }
  };

  const unlockCapsule = async (id: string) => {
    try {
      await fetch(`http://localhost:3001/genealogy/time-capsules/${id}/unlock`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchCapsules();
    } catch (error) {
      console.error('Failed to unlock capsule:', error);
    }
  };

  const getTimeRemaining = (unlockDate: string) => {
    const now = new Date();
    const unlock = new Date(unlockDate);
    const diff = unlock.getTime() - now.getTime();

    if (diff <= 0) return 'Ready to unlock';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;

    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}, ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
    }
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Time-locked Smart Capsules</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Capsule
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Create Time Capsule</h3>
          <form onSubmit={addCapsule} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newCapsule.title}
                onChange={(e) => setNewCapsule({ ...newCapsule, title: e.target.value })}
                placeholder="My 2025 Memories"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newCapsule.description}
                onChange={(e) => setNewCapsule({ ...newCapsule, description: e.target.value })}
                placeholder="A message to my future self..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unlock Date</label>
              <input
                type="date"
                value={newCapsule.unlockDate}
                onChange={(e) => setNewCapsule({ ...newCapsule, unlockDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Seal Capsule
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

      {/* Capsules */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Your Time Capsules</h3>

        {capsules.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No time capsules created yet</p>
        ) : (
          capsules.map((capsule) => (
            <div
              key={capsule.id}
              className={`p-4 border-2 rounded-lg ${
                capsule.isUnlocked
                  ? 'bg-green-50 border-green-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{capsule.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{capsule.description}</p>
                </div>
                <div className="text-4xl">{capsule.isUnlocked ? '📦' : '🔒'}</div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div>
                  <p className="text-gray-600">
                    Unlock: {new Date(capsule.unlockDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-500">{getTimeRemaining(capsule.unlockDate)}</p>
                </div>

                {!capsule.isUnlocked && new Date() >= new Date(capsule.unlockDate) && (
                  <button
                    onClick={() => unlockCapsule(capsule.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Unlock
                  </button>
                )}
              </div>

              {capsule.unlockedAt && (
                <p className="text-xs text-green-600 mt-2">
                  Unlocked on {new Date(capsule.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">About Time Capsules</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Cryptographically sealed memory capsules</li>
          <li>• Unlock date picker: 1 year, 5 years, 10 years or custom</li>
          <li>• Countdown timer display</li>
          <li>• Seal animation on creation</li>
        </ul>
      </div>
    </div>
  );
}
