'use client';

import { useState } from 'react';

export default function RouteOptimizerTSP() {
  const [transportMode, setTransportMode] = useState('car');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => setIsOptimizing(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Smart Traveling Salesman Route Optimization</h2>
      <p className="text-gray-600 mb-6">TSP algorithm for minimizing travel distance/time across multi-stop memory route.</p>
      <div className="space-y-4">
        <select value={transportMode} onChange={(e) => setTransportMode(e.target.value)} className="w-full p-2 border rounded">
          <option value="walking">Walking</option>
          <option value="motorbike">Motorbike</option>
          <option value="car">Car</option>
          <option value="transit">Transit</option>
        </select>
        <button onClick={handleOptimize} disabled={isOptimizing} className="w-full py-2 bg-green-500 text-white rounded">
          {isOptimizing ? 'Optimizing...' : 'Optimize Route'}
        </button>
      </div>
    </div>
  );
}
