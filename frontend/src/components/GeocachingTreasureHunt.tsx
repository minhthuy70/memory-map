'use client';

import { useState } from 'react';

export default function GeocachingTreasureHunt() {
  const [geocaches, setGeocaches] = useState([
    { id: 1, title: 'Hidden Garden', difficulty: 2, terrain: 1, size: 'small', isFound: false },
    { id: 2, title: 'Mountain Peak', difficulty: 4, terrain: 5, size: 'regular', isFound: false },
    { id: 3, title: 'City Park Bench', difficulty: 1, terrain: 1, size: 'micro', isFound: true },
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [newCache, setNewCache] = useState({
    title: '',
    difficulty: 1,
    terrain: 1,
    size: 'regular',
    riddle: '',
    hint: '',
  });

  const handleCreate = () => {
    setIsCreating(true);
    setTimeout(() => {
      setGeocaches(prev => [
        ...prev,
        {
          id: prev.length + 1,
          title: newCache.title,
          difficulty: newCache.difficulty,
          terrain: newCache.terrain,
          size: newCache.size,
          isFound: false,
        },
      ]);
      setNewCache({ title: '', difficulty: 1, terrain: 1, size: 'regular', riddle: '', hint: '' });
      setIsCreating(false);
    }, 1500);
  };

  const handleMarkFound = (id: number) => {
    setGeocaches(prev =>
      prev.map(cache =>
        cache.id === id ? { ...cache, isFound: true } : cache
      )
    );
  };

  const getDifficultyColor = (level: number) => {
    if (level <= 2) return 'bg-green-100 text-green-800';
    if (level <= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Geo-caching & Real-world Treasure Hunt</h2>
      <p className="text-gray-600 mb-6">
        Create and discover community geocaches, cryptic riddles with GPS coordinates, digital logbook signing.
      </p>

      <div className="space-y-4">
        {/* Create New Geocache */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Create New Geocache</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Title"
              value={newCache.title}
              onChange={(e) => setNewCache({ ...newCache, title: e.target.value })}
              className="p-2 border rounded"
            />
            <select
              value={newCache.size}
              onChange={(e) => setNewCache({ ...newCache, size: e.target.value })}
              className="p-2 border rounded"
            >
              <option value="micro">Micro</option>
              <option value="small">Small</option>
              <option value="regular">Regular</option>
              <option value="large">Large</option>
            </select>
            <select
              value={newCache.difficulty}
              onChange={(e) => setNewCache({ ...newCache, difficulty: parseInt(e.target.value) })}
              className="p-2 border rounded"
            >
              <option value="1">Difficulty: 1</option>
              <option value="2">Difficulty: 2</option>
              <option value="3">Difficulty: 3</option>
              <option value="4">Difficulty: 4</option>
              <option value="5">Difficulty: 5</option>
            </select>
            <select
              value={newCache.terrain}
              onChange={(e) => setNewCache({ ...newCache, terrain: parseInt(e.target.value) })}
              className="p-2 border rounded"
            >
              <option value="1">Terrain: 1</option>
              <option value="2">Terrain: 2</option>
              <option value="3">Terrain: 3</option>
              <option value="4">Terrain: 4</option>
              <option value="5">Terrain: 5</option>
            </select>
          </div>
          <textarea
            placeholder="Riddle (optional)"
            value={newCache.riddle}
            onChange={(e) => setNewCache({ ...newCache, riddle: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            rows={2}
          />
          <textarea
            placeholder="Hint (optional)"
            value={newCache.hint}
            onChange={(e) => setNewCache({ ...newCache, hint: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            rows={2}
          />
          <button
            onClick={handleCreate}
            disabled={isCreating || !newCache.title}
            className={`w-full py-2 rounded font-medium ${
              isCreating || !newCache.title
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isCreating ? 'Creating...' : 'Create Geocache'}
          </button>
        </div>

        {/* Geocache List */}
        <div>
          <h3 className="font-medium mb-3">Nearby Geocaches</h3>
          <div className="space-y-3">
            {geocaches.map(cache => (
              <div
                key={cache.id}
                className={`p-4 rounded border ${
                  cache.isFound ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{cache.title}</h4>
                  {cache.isFound && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Found</span>
                  )}
                </div>
                <div className="flex gap-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(cache.difficulty)}`}>
                    D{cache.difficulty}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">
                    T{cache.terrain}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                    {cache.size}
                  </span>
                </div>
                {!cache.isFound && (
                  <button
                    onClick={() => handleMarkFound(cache.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark as Found
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded">
          <h4 className="font-medium text-blue-800 mb-2">Geocaching Guide:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Difficulty (D): How hard to find (1=easy, 5=extreme)</li>
            <li>• Terrain (T): Physical challenge (1=flat, 5=mountain)</li>
            <li>• Size: Micro (tiny) to Large (container)</li>
            <li>• Log your find digitally in the app</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
