'use client';

import { useState } from 'react';

export default function CarDashboardIntegration() {
  const [carPlayEnabled, setCarPlayEnabled] = useState(false);
  const [androidAutoEnabled, setAndroidAutoEnabled] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [deviceId, setDeviceId] = useState('');

  const handlePairDevice = () => {
    if (deviceId) {
      alert(`Device ${deviceId} paired successfully!`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Apple CarPlay & Android Auto In-car Dashboard</h2>
      <p className="text-gray-600 mb-6">
        In-car map display highlighting memories passed along your driving route, audio voice narration through car speakers.
      </p>

      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-3">Apple CarPlay</h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm">Enable CarPlay Integration</span>
            <input
              type="checkbox"
              checked={carPlayEnabled}
              onChange={(e) => setCarPlayEnabled(e.target.checked)}
              className="w-5 h-5"
            />
          </div>
          {carPlayEnabled && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Device ID</label>
                <input
                  type="text"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  placeholder="Enter CarPlay device ID"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-play memories when driving</span>
                <input
                  type="checkbox"
                  checked={autoPlay}
                  onChange={(e) => setAutoPlay(e.target.checked)}
                  className="w-5 h-5"
                />
              </div>
              <button
                onClick={handlePairDevice}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Pair Device
              </button>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-3">Android Auto</h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm">Enable Android Auto Integration</span>
            <input
              type="checkbox"
              checked={androidAutoEnabled}
              onChange={(e) => setAndroidAutoEnabled(e.target.checked)}
              className="w-5 h-5"
            />
          </div>
          {androidAutoEnabled && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Device ID</label>
                <input
                  type="text"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  placeholder="Enter Android Auto device ID"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-play memories when driving</span>
                <input
                  type="checkbox"
                  checked={autoPlay}
                  onChange={(e) => setAutoPlay(e.target.checked)}
                  className="w-5 h-5"
                />
              </div>
              <button
                onClick={handlePairDevice}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Pair Device
              </button>
            </div>
          )}
        </div>

        <div className="p-4 bg-blue-50 rounded">
          <h4 className="font-medium text-blue-800 mb-2">Features:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• In-car map display with memory pins</li>
            <li>• Audio voice narration through car speakers</li>
            <li>• Hands-free memory playback</li>
            <li>• Route-based memory suggestions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
