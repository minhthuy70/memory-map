'use client';

import { useState } from 'react';

export default function MultiPerspectiveSynthesizer() {
  const [tone, setTone] = useState<'humorous' | 'poetic' | 'adventurous' | 'neutral'>('neutral');
  const [isGenerating, setIsGenerating] = useState(false);
  const [synthesisContent, setSynthesisContent] = useState('');
  const [participantCount, setParticipantCount] = useState(4);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setSynthesisContent(`Multi-chapter memoir combining perspectives from ${participantCount} friends on the same trip. Each chapter presents a unique viewpoint, weaving together shared experiences into a harmonious narrative.`);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Multi-perspective Memory Synthesizer</h2>
      <p className="text-gray-600 mb-6">
        Combines notes and photos from multiple friends on the same trip into a harmonious unified multi-chapter memoir.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Number of Participants</label>
          <input
            type="number"
            value={participantCount}
            onChange={(e) => setParticipantCount(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
            min="2"
            max="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Synthesis Tone</label>
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
          {isGenerating ? 'Synthesizing...' : 'Generate Multi-perspective Memoir'}
        </button>

        {synthesisContent && (
          <div className="p-4 bg-gray-50 rounded">
            <h3 className="font-medium mb-2">Synthesis Result:</h3>
            <p className="text-gray-700">{synthesisContent}</p>
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Chapters:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Chapter 1: The Beginning</li>
                <li>• Chapter 2: Adventures</li>
                <li>• Chapter 3: Shared Memories</li>
                <li>• Chapter 4: Farewell</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
