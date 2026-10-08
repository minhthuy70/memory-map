'use client';

import { useState } from 'react';

export default function AgeRegressionProgression() {
  const [ageAdjustment, setAgeAdjustment] = useState(-10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [youngerPhoto, setYoungerPhoto] = useState('');
  const [olderPhoto, setOlderPhoto] = useState('');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      if (ageAdjustment < 0) {
        setYoungerPhoto('/age-younger.jpg');
      } else if (ageAdjustment > 0) {
        setOlderPhoto('/age-older.jpg');
      }
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Visual Age Regression & Progression</h2>
      <p className="text-gray-600 mb-6">
        AI generative portrait adjusting user's appearance at this landmark to 10 years younger or predicting look 20 years into the future.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Age Adjustment (Years)</label>
          <input
            type="range"
            min="-30"
            max="30"
            value={ageAdjustment}
            onChange={(e) => setAgeAdjustment(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>-30 years</span>
            <span>{ageAdjustment > 0 ? `+${ageAdjustment} years` : `${ageAdjustment} years`}</span>
            <span>+30 years</span>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isGenerating ? 'Generating...' : 'Generate Age Progression'}
        </button>

        {(youngerPhoto || olderPhoto) && (
          <div className="grid grid-cols-2 gap-4">
            {youngerPhoto && (
              <div className="p-4 bg-green-50 rounded">
                <h3 className="font-medium mb-2">Younger Version</h3>
                <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500">Age -{Math.abs(ageAdjustment)}</span>
                </div>
              </div>
            )}
            {olderPhoto && (
              <div className="p-4 bg-purple-50 rounded">
                <h3 className="font-medium mb-2">Older Version</h3>
                <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500">Age +{ageAdjustment}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
