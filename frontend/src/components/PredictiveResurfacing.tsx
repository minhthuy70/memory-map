'use client';

import { useState } from 'react';

export default function PredictiveResurfacing() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [stressLevel, setStressLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [sentimentScore, setSentimentScore] = useState(0.8);
  const [scheduledMemories, setScheduledMemories] = useState<any[]>([]);

  const handleEnable = () => {
    setIsEnabled(true);
    setScheduledMemories([
      { id: '1', title: 'Peaceful Lake Moment', sentiment: 0.9, scheduledFor: '2026-10-09 09:00' },
      { id: '2', title: 'Sunset at the Beach', sentiment: 0.85, scheduledFor: '2026-10-10 14:00' },
    ]);
  };

  const handleDisable = () => {
    setIsEnabled(false);
    setScheduledMemories([]);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Predictive Resurfacing for Stress Relief</h2>
      <p className="text-gray-600 mb-6">
        Sentiment and schedule awareness detects busy/stressful periods to gently present your most calming, joyful memories.
      </p>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
          <div>
            <p className="font-medium">Predictive Resurfacing</p>
            <p className="text-sm text-gray-600">
              {isEnabled ? 'Active - Monitoring stress levels' : 'Inactive'}
            </p>
          </div>
          <button
            onClick={isEnabled ? handleDisable : handleEnable}
            className={`px-4 py-2 rounded ${
              isEnabled
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>

        {isEnabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Stress Level Detection</label>
              <select
                value={stressLevel}
                onChange={(e) => setStressLevel(e.target.value as any)}
                className="w-full p-2 border rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Minimum Sentiment Score for Resurfacing</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={sentimentScore}
                onChange={(e) => setSentimentScore(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>0.0</span>
                <span>{sentimentScore}</span>
                <span>1.0</span>
              </div>
            </div>

            {scheduledMemories.length > 0 && (
              <div className="p-4 bg-green-50 rounded">
                <h3 className="font-medium mb-3">Scheduled Calming Memories</h3>
                <div className="space-y-2">
                  {scheduledMemories.map((memory) => (
                    <div key={memory.id} className="flex items-center justify-between p-2 bg-white rounded">
                      <div>
                        <p className="font-medium text-sm">{memory.title}</p>
                        <p className="text-xs text-gray-600">Sentiment: {memory.sentiment}</p>
                      </div>
                      <span className="text-xs text-gray-500">{memory.scheduledFor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 rounded">
              <h4 className="font-medium text-blue-800 mb-2">How it works:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Monitors your calendar and activity patterns</li>
                <li>• Detects busy/stressful periods automatically</li>
                <li>• Surfaces your most positive memories</li>
                <li>• Helps you feel calmer during stressful times</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
