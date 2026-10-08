'use client';

import { useState } from 'react';

export default function HistoricalTimeTravelSim() {
  const [year, setYear] = useState(1900);
  const [latitude, setLatitude] = useState(21.0285);
  const [longitude, setLongitude] = useState(105.8542);
  const [isGenerating, setIsGenerating] = useState(false);
  const [simulatedImage, setSimulatedImage] = useState('');
  const [historicalContext, setHistoricalContext] = useState('');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setSimulatedImage('/historical-simulated.jpg');
      setHistoricalContext(`Historical reconstruction of coordinates ${latitude}, ${longitude} in ${year}. During this era, the area was characterized by colonial architecture and traditional Vietnamese culture.`);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Historical Time-travel Simulator</h2>
      <p className="text-gray-600 mb-6">
        Generative AI reconstruction of what the current GPS coordinates looked like in 1900 or 1950, with historical context notes.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
            min="1800"
            max="2000"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Latitude</label>
            <input
              type="number"
              step="0.0001"
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Longitude</label>
            <input
              type="number"
              step="0.0001"
              value={longitude}
              onChange={(e) => setLongitude(parseFloat(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isGenerating ? 'Generating...' : 'Generate Historical View'}
        </button>

        {simulatedImage && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-medium mb-2">Simulated Image</h3>
              <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500">Historical View: {year}</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded">
              <h3 className="font-medium mb-2">Historical Context</h3>
              <p className="text-sm text-blue-700">{historicalContext}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
