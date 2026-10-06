'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface ResilienceMoment {
  id: string;
  title: string;
  description: string;
  date: string;
  difficulty: number;
  overcomeAt: string | null;
  selfEncouragement: string | null;
}

export default function ResilienceArchive() {
  const { token } = useAuth();
  const [moments, setMoments] = useState<ResilienceMoment[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMoment, setNewMoment] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    difficulty: 5,
    selfEncouragement: '',
  });

  useEffect(() => {
    fetchMoments();
  }, [token]);

  const fetchMoments = async () => {
    try {
      const response = await fetch('http://localhost:3001/psychology/resilience', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setMoments(data);
    } catch (error) {
      console.error('Failed to fetch moments:', error);
    }
  };

  const addMoment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/psychology/resilience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMoment),
      });

      setShowAddForm(false);
      setNewMoment({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        difficulty: 5,
        selfEncouragement: '',
      });
      await fetchMoments();
    } catch (error) {
      console.error('Failed to add moment:', error);
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'bg-green-100 text-green-800';
    if (difficulty <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Resilience & Strength Archive</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Add Triumph
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-orange-50 rounded-lg text-center">
          <p className="text-3xl font-bold text-orange-600">{moments.length}</p>
          <p className="text-sm text-gray-600">Triumphs</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg text-center">
          <p className="text-3xl font-bold text-purple-600">
            {moments.filter((m) => m.overcomeAt).length}
          </p>
          <p className="text-sm text-gray-600">Overcome</p>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-orange-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Record Your Triumph</h3>
          <form onSubmit={addMoment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newMoment.title}
                onChange={(e) => setNewMoment({ ...newMoment, title: e.target.value })}
                placeholder="Overcame a major challenge"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newMoment.description}
                onChange={(e) => setNewMoment({ ...newMoment, description: e.target.value })}
                placeholder="Describe the challenge and how you overcame it..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newMoment.date}
                onChange={(e) => setNewMoment({ ...newMoment, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty (1-10)</label>
              <input
                type="number"
                value={newMoment.difficulty}
                onChange={(e) => setNewMoment({ ...newMoment, difficulty: parseInt(e.target.value) })}
                min="1"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Self-Encouragement Note</label>
              <textarea
                value={newMoment.selfEncouragement}
                onChange={(e) => setNewMoment({ ...newMoment, selfEncouragement: e.target.value })}
                placeholder="A note to your future self..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
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

      {/* Moments */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Your Triumphs</h3>

        {moments.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No triumphs recorded yet</p>
        ) : (
          moments.map((moment) => (
            <div
              key={moment.id}
              className="p-4 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(moment.difficulty)}`}>
                      Difficulty: {moment.difficulty}/10
                    </span>
                    {moment.overcomeAt && (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                        ✓ Overcome
                      </span>
                    )}
                  </div>
                  <h4 className="font-medium text-gray-800">{moment.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{moment.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(moment.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {moment.selfEncouragement && (
                <div className="mt-3 p-3 bg-purple-50 rounded">
                  <p className="text-xs text-purple-600 italic">"{moment.selfEncouragement}"</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-orange-50 rounded-lg">
        <h4 className="font-semibold text-orange-800 mb-2">About Resilience Archive</h4>
        <ul className="text-sm text-orange-700 space-y-1">
          <li>• Dedicated vault of triumphs over adversity</li>
          <li>• Past challenges conquered and lessons learned</li>
          <li>• Self-encouragement letters for tough times</li>
          <li>• Emergency confidence booster mode</li>
        </ul>
      </div>
    </div>
  );
}
