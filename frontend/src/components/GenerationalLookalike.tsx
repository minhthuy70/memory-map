'use client';

import { useState } from 'react';

export default function GenerationalLookalike() {
  const [comparisons, setComparisons] = useState([
    { id: 1, parentPhotoUrl: '/parent1.jpg', childPhotoUrl: '/child1.jpg', parentAge: 25, childAge: 25, similarityScore: 0.85 },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newComparison, setNewComparison] = useState({
    parentAge: 25,
    childAge: 25,
  });

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const score = Math.random() * 0.3 + 0.7; // Random score between 0.7 and 1.0
      setComparisons(prev => [
        ...prev,
        {
          id: prev.length + 1,
          parentPhotoUrl: '/parent.jpg',
          childPhotoUrl: '/child.jpg',
          parentAge: newComparison.parentAge,
          childAge: newComparison.childAge,
          similarityScore: score,
        },
      ]);
      setNewComparison({ parentAge: 25, childAge: 25 });
      setIsAnalyzing(false);
    }, 2000);
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 0.9) return 'bg-green-500';
    if (score >= 0.8) return 'bg-blue-500';
    if (score >= 0.7) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getSimilarityLabel = (score: number) => {
    if (score >= 0.9) return 'Very Similar';
    if (score >= 0.8) return 'Similar';
    if (score >= 0.7) return 'Somewhat Similar';
    return 'Not Very Similar';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Generational Photo Comparison (Lookalike)</h2>
      <p className="text-gray-600 mb-6">
        Side-by-side comparison of parent and child at the exact same age, facial similarity AI scoring, genetic trait highlights.
      </p>

      <div className="space-y-4">
        {/* New Comparison */}
        <div className="bg-purple-50 p-4 rounded">
          <h3 className="font-medium mb-3">Create New Comparison</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm mb-1">Parent Age in Photo</label>
              <input
                type="number"
                value={newComparison.parentAge}
                onChange={(e) => setNewComparison({ ...newComparison, parentAge: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
                min={1}
                max={100}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Child Age in Photo</label>
              <input
                type="number"
                value={newComparison.childAge}
                onChange={(e) => setNewComparison({ ...newComparison, childAge: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
                min={1}
                max={100}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm mb-1">Parent Photo</label>
              <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
                <p className="text-gray-500">📷 Upload parent photo</p>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Child Photo</label>
              <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
                <p className="text-gray-500">📷 Upload child photo</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`w-full py-2 rounded font-medium ${
              isAnalyzing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Similarity'}
          </button>
        </div>

        {/* Comparisons List */}
        <div>
          <h3 className="font-medium mb-3">Comparison Results</h3>
          <div className="space-y-3">
            {comparisons.map(comparison => (
              <div key={comparison.id} className="p-4 bg-white border rounded">
                <div className="flex gap-4 mb-3">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Parent at {comparison.parentAge}</p>
                    <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-4xl">👨</span>
                    </div>
                  </div>
                  <div className="flex items-center text-2xl text-gray-400">→</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Child at {comparison.childAge}</p>
                    <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-4xl">👶</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Similarity Score:</span>
                    <div className="w-32 bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${getSimilarityColor(comparison.similarityScore)}`}
                        style={{ width: `${comparison.similarityScore * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{Math.round(comparison.similarityScore * 100)}%</span>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded-full text-white ${getSimilarityColor(comparison.similarityScore)}`}>
                    {getSimilarityLabel(comparison.similarityScore)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded">
          <h4 className="font-medium text-blue-800 mb-2">Genetic Trait Analysis:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Facial structure comparison</li>
            <li>• Eye shape and color analysis</li>
            <li>• Smile pattern matching</li>
            <li>• AI-powered similarity scoring</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
