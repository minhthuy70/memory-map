'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface GratitudeEntry {
  id: string;
  content: string;
  category: string;
  isShared: boolean;
  createdAt: string;
}

export default function GratitudeGrowthTree() {
  const { token } = useAuth();
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    content: '',
    category: 'people',
    isShared: false,
  });

  useEffect(() => {
    fetchEntries();
  }, [token]);

  const fetchEntries = async () => {
    try {
      const response = await fetch('http://localhost:3001/psychology/gratitude', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    }
  };

  const addEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/psychology/gratitude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEntry),
      });

      setShowAddForm(false);
      setNewEntry({ content: '', category: 'people', isShared: false });
      await fetchEntries();
    } catch (error) {
      console.error('Failed to add entry:', error);
    }
  };

  const categoryIcons = {
    people: '👥',
    experience: '✨',
    opportunity: '🌟',
    nature: '🌿',
  };

  const categoryColors = {
    people: 'bg-pink-100 text-pink-800',
    experience: 'bg-purple-100 text-purple-800',
    opportunity: 'bg-blue-100 text-blue-800',
    nature: 'bg-green-100 text-green-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gratitude Growth Tree</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Add Gratitude
        </button>
      </div>

      {/* Tree Visualization */}
      <div className="mb-6 p-8 bg-gradient-to-b from-green-50 to-green-100 rounded-lg text-center">
        <div className="text-8xl mb-4">🌳</div>
        <p className="text-2xl font-bold text-green-800 mb-2">{entries.length} Leaves of Gratitude</p>
        <p className="text-sm text-green-600">Each gratitude helps your tree grow</p>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Express Gratitude</h3>
          <form onSubmit={addEntry} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">What are you grateful for?</label>
              <textarea
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                placeholder="I'm grateful for..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={newEntry.category}
                onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="people">People</option>
                <option value="experience">Experience</option>
                <option value="opportunity">Opportunity</option>
                <option value="nature">Nature</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isShared"
                checked={newEntry.isShared}
                onChange={(e) => setNewEntry({ ...newEntry, isShared: e.target.checked })}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="isShared" className="text-sm text-gray-700">
                Share publicly
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add to Tree
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

      {/* Entries */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Your Gratitude Journal</h3>

        {entries.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No gratitude entries yet</p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{categoryIcons[entry.category as keyof typeof categoryIcons]}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${categoryColors[entry.category as keyof typeof categoryColors]}`}>
                      {entry.category}
                    </span>
                    {entry.isShared && (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
                        Shared
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700">{entry.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">Benefits of Gratitude</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Improves mental wellbeing and happiness</li>
          <li>• Reduces stress and anxiety</li>
          <li>• Strengthens relationships</li>
          <li>• Builds resilience and optimism</li>
        </ul>
      </div>
    </div>
  );
}
