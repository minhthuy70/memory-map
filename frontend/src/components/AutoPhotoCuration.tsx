'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface PhotoCuration {
  id: string;
  memoryId: string;
  photoId: string;
  aestheticScore: number;
  focusScore: number;
  smileScore: number;
  overallScore: number;
  isHighlighted: boolean;
  isRejected: boolean;
  reasons: string | null;
}

export default function AutoPhotoCuration() {
  const { token } = useAuth();
  const [curations, setCurations] = useState<PhotoCuration[]>([]);
  const [selectedMemoryId, setSelectedMemoryId] = useState('');
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  useEffect(() => {
    fetchCurations();
  }, [token, selectedMemoryId]);

  const fetchCurations = async () => {
    try {
      const url = selectedMemoryId
        ? `http://localhost:3001/ai-companion/photo-curation?memoryId=${selectedMemoryId}`
        : 'http://localhost:3001/ai-companion/photo-curation';

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCurations(data);
    } catch (error) {
      console.error('Failed to fetch curations:', error);
    }
  };

  const batchCuration = async () => {
    if (!selectedMemoryId) {
      alert('Please select a memory ID first');
      return;
    }

    setIsBatchProcessing(true);
    try {
      // Simulate photo IDs for the memory
      const photoIds = ['photo-1', 'photo-2', 'photo-3', 'photo-4', 'photo-5'];

      await fetch('http://localhost:3001/ai-companion/photo-curation/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          memoryId: selectedMemoryId,
          photoIds,
        }),
      });

      await fetchCurations();
    } catch (error) {
      console.error('Batch curation failed:', error);
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const toggleHighlight = async (id: string, isHighlighted: boolean) => {
    try {
      await fetch(`http://localhost:3001/ai-companion/photo-curation/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isHighlighted: !isHighlighted }),
      });

      await fetchCurations();
    } catch (error) {
      console.error('Failed to toggle highlight:', error);
    }
  };

  const toggleReject = async (id: string, isRejected: boolean) => {
    try {
      await fetch(`http://localhost:3001/ai-companion/photo-curation/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isRejected: !isRejected }),
      });

      await fetchCurations();
    } catch (error) {
      console.error('Failed to toggle reject:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Automated Multi-photo Quality Curation</h2>

      {/* Controls */}
      <div className="mb-6 flex gap-4 items-center">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Memory ID</label>
          <input
            type="text"
            value={selectedMemoryId}
            onChange={(e) => setSelectedMemoryId(e.target.value)}
            placeholder="Enter memory ID to curate photos"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={batchCuration}
          disabled={isBatchProcessing || !selectedMemoryId}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mt-6"
        >
          {isBatchProcessing ? 'Processing...' : '✨ AI Curate Photos'}
        </button>
      </div>

      {/* Curations List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Photo Curations ({curations.length})
        </h3>

        {curations.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">
            No photo curations yet. Select a memory and click "AI Curate Photos"
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {curations.map((curation) => (
              <div
                key={curation.id}
                className={`p-4 border rounded-lg transition-colors ${
                  curation.isHighlighted
                    ? 'border-yellow-400 bg-yellow-50'
                    : curation.isRejected
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {curation.isHighlighted && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-700">
                          ⭐ Highlight
                        </span>
                      )}
                      {curation.isRejected && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
                          ✗ Rejected
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">Photo: {curation.photoId}</p>
                  </div>
                </div>

                {/* Scores */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Aesthetic</span>
                    <span className={`text-sm font-medium ${getScoreColor(curation.aestheticScore)}`}>
                      {curation.aestheticScore.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-blue-600 rounded-full"
                      style={{ width: `${curation.aestheticScore * 10}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Focus</span>
                    <span className={`text-sm font-medium ${getScoreColor(curation.focusScore)}`}>
                      {curation.focusScore.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-green-600 rounded-full"
                      style={{ width: `${curation.focusScore * 10}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Smile</span>
                    <span className={`text-sm font-medium ${getScoreColor(curation.smileScore)}`}>
                      {curation.smileScore.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-purple-600 rounded-full"
                      style={{ width: `${curation.smileScore * 10}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium text-gray-700">Overall</span>
                    <span className={`text-lg font-bold ${getScoreColor(curation.overallScore)}`}>
                      {curation.overallScore.toFixed(1)}/10
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleHighlight(curation.id, curation.isHighlighted)}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      curation.isHighlighted
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-yellow-100'
                    }`}
                  >
                    {curation.isHighlighted ? 'Unhighlight' : 'Highlight'}
                  </button>
                  <button
                    onClick={() => toggleReject(curation.id, curation.isRejected)}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      curation.isRejected
                        ? 'bg-red-200 text-red-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                    }`}
                  >
                    {curation.isRejected ? 'Restore' : 'Reject'}
                  </button>
                </div>

                {/* Rejection Reasons */}
                {curation.reasons && (
                  <div className="mt-3 p-2 bg-red-50 rounded text-xs text-red-700">
                    <strong>Reasons:</strong> {JSON.parse(curation.reasons).join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <h4 className="font-semibold text-purple-800 mb-2">AI Curation Criteria</h4>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• <strong>Aesthetic:</strong> Composition, lighting, color harmony</li>
          <li>• <strong>Focus:</strong> Sharpness, clarity, detail</li>
          <li>• <strong>Smile:</strong> Facial expression detection</li>
          <li>• Automatically removes blurry and closed-eye shots</li>
          <li>• Picks top 5 highlight photos automatically</li>
        </ul>
      </div>
    </div>
  );
}
