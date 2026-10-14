'use client';

import { useState } from 'react';

export default function WeatherSimulation3D() {
  const [location, setLocation] = useState('');
  const [weatherType, setWeatherType] = useState('sunny');
  const [temperature, setTemperature] = useState(25);
  const [isDay, setIsDay] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getWeatherIcon = () => {
    switch (weatherType) {
      case 'sunny': return '☀️';
      case 'rainy': return '🌧️';
      case 'snowy': return '❄️';
      case 'foggy': return '🌫️';
      default: return '☀️';
    }
  };

  const getWeatherColor = () => {
    switch (weatherType) {
      case 'sunny': return 'from-yellow-200 to-orange-300';
      case 'rainy': return 'from-gray-300 to-blue-400';
      case 'snowy': return 'from-blue-100 to-white';
      case 'foggy': return 'from-gray-200 to-gray-400';
      default: return 'from-yellow-200 to-orange-300';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Day/Night Cycle & Realistic Weather Simulation</h3>
      <p className="text-gray-600 mb-4">Mô phỏng chu kỳ ngày/đêm, thời tiết (mưa/tuyết/sương mù) với realistic lighting</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., Hanoi"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Weather Type</label>
          <select
            value={weatherType}
            onChange={(e) => setWeatherType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="sunny">Sunny ☀️</option>
            <option value="rainy">Rainy 🌧️</option>
            <option value="snowy">Snowy ❄️</option>
            <option value="foggy">Foggy 🌫️</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Temperature (°C)</label>
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full p-2 border rounded"
            placeholder="25"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isDay}
            onChange={(e) => setIsDay(e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm">Day Mode</label>
        </div>

        <div className={`bg-gradient-to-b ${getWeatherColor()} p-4 rounded ${!isDay ? 'opacity-60' : ''}`}>
          <h4 className="font-semibold mb-2">Weather Preview</h4>
          <div className="h-32 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-2">{getWeatherIcon()}</div>
              <span className="text-white font-bold text-lg">{temperature}°C</span>
              <div className="text-white text-sm">{isDay ? '☀️ Day' : '🌙 Night'}</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
        >
          {saved ? 'Saved!' : 'Save Weather Simulation'}
        </button>
      </div>
    </div>
  );
}
