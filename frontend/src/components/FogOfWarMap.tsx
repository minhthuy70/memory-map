'use client';

import { useState } from 'react';

export default function FogOfWarMap() {
  const [exploredAreas, setExploredAreas] = useState(0);
  const [worldPercentage, setWorldPercentage] = useState(0.001);
  const [totalAreaExplored, setTotalAreaExplored] = useState(500);
  const [isExploring, setIsExploring] = useState(false);

  const handleExplore = () => {
    setIsExploring(true);
    setTimeout(() => {
      setExploredAreas(prev => prev + 1);
      setTotalAreaExplored(prev => prev + Math.random() * 50);
      setWorldPercentage(prev => prev + 0.0001);
      setIsExploring(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Fog of War Mystery Map</h2>
      <p className="text-gray-600 mb-6">
        Classic game fog of war overlay covering world map, clears dynamically around GPS tracks where user actually walks/drives.
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-600">Explored Areas</p>
            <p className="text-2xl font-bold text-blue-600">{exploredAreas}</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <p className="text-sm text-gray-600">Total Area (km²)</p>
            <p className="text-2xl font-bold text-green-600">{totalAreaExplored.toFixed(2)}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <p className="text-sm text-gray-600">World Explored</p>
            <p className="text-2xl font-bold text-purple-600">{(worldPercentage * 100).toFixed(4)}%</p>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-medium mb-2">Map Preview</h3>
          <div className="h-64 bg-gray-300 rounded flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <div className="relative z-10 text-white text-center">
              <p className="text-lg font-bold">World Map</p>
              <p className="text-sm">Fog of War Active</p>
              <div className="mt-4 flex gap-2 justify-center">
                <div className="w-16 h-16 bg-green-500 rounded-full opacity-60"></div>
                <div className="w-12 h-12 bg-green-500 rounded-full opacity-40"></div>
                <div className="w-8 h-8 bg-green-500 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleExplore}
          disabled={isExploring}
          className={`w-full py-3 rounded font-medium ${
            isExploring
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isExploring ? 'Exploring...' : 'Explore New Area'}
        </button>

        <div className="p-4 bg-yellow-50 rounded">
          <h4 className="font-medium text-yellow-800 mb-2">How it works:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Map starts covered in fog (hidden)</li>
            <li>• Fog clears around GPS tracks you travel</li>
            <li>• Explored areas persist and accumulate</li>
            <li>• Track your % of world explored</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
