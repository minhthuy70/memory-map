'use client';

import { useState } from 'react';

export default function EmotionalGeographyHeatmap() {
  const [emotionType, setEmotionType] = useState('happiness');
  const [heatmapData, setHeatmapData] = useState([
    { lat: 21.0285, lng: 105.8542, emotion: 'happiness', intensity: 0.9, location: 'Hanoi' },
    { lat: 16.0471, lng: 108.2062, emotion: 'peace', intensity: 0.8, location: 'Da Nang' },
    { lat: 10.8231, lng: 106.6297, emotion: 'creativity', intensity: 0.7, location: 'Ho Chi Minh' },
  ]);

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'happiness': return 'bg-yellow-400';
      case 'peace': return 'bg-blue-400';
      case 'creativity': return 'bg-purple-400';
      case 'stress': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Emotional Geography & Wellbeing Heatmap</h2>
      <p className="text-gray-600 mb-6">
        Heat map visualizing locations correlated with happiness, peace, creativity or stress, geographic mood analytics.
      </p>

      <div className="space-y-4">
        <div className="flex gap-2 mb-4">
          {['happiness', 'peace', 'creativity', 'stress'].map(emotion => (
            <button
              key={emotion}
              onClick={() => setEmotionType(emotion)}
              className={`px-4 py-2 rounded capitalize ${
                emotionType === emotion
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {emotion}
            </button>
          ))}
        </div>

        <div className="bg-gray-100 p-4 rounded h-64 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium">Emotional Heatmap</p>
              <p className="text-sm text-gray-600">Filter: {emotionType}</p>
            </div>
          </div>
          {heatmapData
            .filter(point => point.emotion === emotionType)
            .map((point, index) => (
              <div
                key={index}
                className={`absolute w-8 h-8 rounded-full ${getEmotionColor(point.emotion)} opacity-60`}
                style={{
                  left: `${30 + index * 20}%`,
                  top: `${30 + index * 15}%`,
                }}
                title={`${point.location}: ${point.intensity}`}
              />
            ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-yellow-50 p-4 rounded">
            <p className="text-sm text-gray-600">Happiness Hotspots</p>
            <p className="text-2xl font-bold text-yellow-600">3</p>
          </div>
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-600">Peaceful Locations</p>
            <p className="text-2xl font-bold text-blue-600">2</p>
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded">
          <h4 className="font-medium text-green-800 mb-2">Serene Spot Recommendations:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• 🌲 Central Park - 89% peaceful</li>
            <li>• 🏖️ Beach Boulevard - 85% calming</li>
            <li>• 🏔️ Mountain Viewpoint - 82% serene</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
