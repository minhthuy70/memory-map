'use client';

import { useState } from 'react';

export default function MemoryToItinerary() {
  const [memories, setMemories] = useState([{ id: 1, location: 'Paris', date: '2023-06-15' }]);
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = () => {
    setIsConverting(true);
    setTimeout(() => setIsConverting(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Memory-to-Itinerary Converter</h2>
      <p className="text-gray-600 mb-6">Convert past trip memories into day-by-day itinerary template.</p>
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-medium mb-3">Selected Memories</h3>
          {memories.map(m => (
            <div key={m.id} className="p-2 bg-white rounded mb-2">{m.location} - {m.date}</div>
          ))}
        </div>
        <button onClick={handleConvert} disabled={isConverting} className="w-full py-2 bg-blue-500 text-white rounded">
          {isConverting ? 'Converting...' : 'Convert to Itinerary'}
        </button>
      </div>
    </div>
  );
}
