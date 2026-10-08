'use client';

import { useState } from 'react';

export default function TravelRouteAutoNarrator() {
  const [tone, setTone] = useState<'humorous' | 'poetic' | 'adventurous' | 'neutral'>('neutral');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const samples = {
        humorous: 'And then we went to that place, and let me tell you, it was absolutely wild! The coffee was so strong it could wake the dead.',
        poetic: 'As the sun dipped below the horizon, painting the sky in hues of gold and crimson, we found ourselves at a place that would forever change our journey.',
        adventurous: 'We embarked on a daring expedition through uncharted territories, each step bringing new challenges and breathtaking discoveries.',
        neutral: 'We visited several locations during our trip, including historical sites and natural landmarks. The journey covered multiple days.',
      };
      setGeneratedContent(samples[tone]);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">AI Travel Route Auto-narrator</h2>
      <p className="text-gray-600 mb-6">
        Converts sequential map pins and timestamps into an engaging travelogue essay in choice of tones: humorous, poetic, adventurous.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Narration Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as any)}
            className="w-full p-2 border rounded"
          >
            <option value="humorous">Humorous</option>
            <option value="poetic">Poetic</option>
            <option value="adventurous">Adventurous</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isGenerating ? 'Generating...' : 'Generate Travelogue'}
        </button>

        {generatedContent && (
          <div className="p-4 bg-gray-50 rounded">
            <h3 className="font-medium mb-2">Generated Travelogue:</h3>
            <p className="text-gray-700">{generatedContent}</p>
          </div>
        )}
      </div>
    </div>
  );
}
