'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface FamilyHeirloom {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  year: number | null;
  category: string;
  provenance: string;
}

export default function FamilyHeirloomArchive() {
  const { token } = useAuth();
  const [heirlooms, setHeirlooms] = useState<FamilyHeirloom[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHeirloom, setNewHeirloom] = useState({
    name: '',
    description: '',
    photoUrl: '',
    year: '',
    category: 'antique',
    provenance: '',
  });

  useEffect(() => {
    fetchHeirlooms();
  }, [token]);

  const fetchHeirlooms = async () => {
    try {
      const response = await fetch('http://localhost:3001/genealogy/heirlooms', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setHeirlooms(data);
    } catch (error) {
      console.error('Failed to fetch heirlooms:', error);
    }
  };

  const addHeirloom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/genealogy/heirlooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newHeirloom,
          year: newHeirloom.year ? parseInt(newHeirloom.year) : null,
        }),
      });

      setShowAddForm(false);
      setNewHeirloom({
        name: '',
        description: '',
        photoUrl: '',
        year: '',
        category: 'antique',
        provenance: '',
      });
      await fetchHeirlooms();
    } catch (error) {
      console.error('Failed to add heirloom:', error);
    }
  };

  const categoryIcons = {
    letter: '📜',
    medal: '🎖️',
    clock: '⏰',
    antique: '🏺',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Family Heirloom & Relic Digital Archive</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          Add Heirloom
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-amber-50 rounded-lg text-center">
          <p className="text-3xl font-bold text-amber-600">{heirlooms.length}</p>
          <p className="text-sm text-gray-600">Heirlooms</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg text-center">
          <p className="text-3xl font-bold text-purple-600">
            {heirlooms.filter((h) => h.year).length}
          </p>
          <p className="text-sm text-gray-600">Dated Items</p>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-amber-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Add Family Heirloom</h3>
          <form onSubmit={addHeirloom} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={newHeirloom.name}
                onChange={(e) => setNewHeirloom({ ...newHeirloom, name: e.target.value })}
                placeholder="Grandfather's Pocket Watch"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newHeirloom.description}
                onChange={(e) => setNewHeirloom({ ...newHeirloom, description: e.target.value })}
                placeholder="Story and significance of this heirloom..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
              <input
                type="url"
                value={newHeirloom.photoUrl}
                onChange={(e) => setNewHeirloom({ ...newHeirloom, photoUrl: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year (optional)</label>
              <input
                type="number"
                value={newHeirloom.year}
                onChange={(e) => setNewHeirloom({ ...newHeirloom, year: e.target.value })}
                placeholder="1920"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={newHeirloom.category}
                onChange={(e) => setNewHeirloom({ ...newHeirloom, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="letter">Letter</option>
                <option value="medal">Medal</option>
                <option value="clock">Clock</option>
                <option value="antique">Antique</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provenance</label>
              <textarea
                value={newHeirloom.provenance}
                onChange={(e) => setNewHeirloom({ ...newHeirloom, provenance: e.target.value })}
                placeholder="Who owned it, how it was passed down..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Add to Archive
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

      {/* Heirlooms */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Your Family Heirlooms</h3>

        {heirlooms.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No heirlooms recorded yet</p>
        ) : (
          heirlooms.map((heirloom) => (
            <div
              key={heirloom.id}
              className="p-4 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">
                  {categoryIcons[heirloom.category as keyof typeof categoryIcons]}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-800">{heirloom.name}</h4>
                    {heirloom.year && (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-amber-100 text-amber-700">
                        {heirloom.year}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{heirloom.description}</p>
                  {heirloom.provenance && (
                    <p className="text-xs text-gray-500 mt-2 italic">
                      Provenance: {heirloom.provenance}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg">
        <h4 className="font-semibold text-amber-800 mb-2">About Heirloom Archive</h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• 3D photo archive of family heirlooms</li>
          <li>• Vintage handwritten letters, war medals, antique clocks</li>
          <li>• Heirloom story and provenance recording</li>
          <li>• Preserve family history for future generations</li>
        </ul>
      </div>
    </div>
  );
}
