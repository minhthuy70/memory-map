'use client';

import { useState } from 'react';

export default function WatchFaceComplications() {
  const [appleWatchEnabled, setAppleWatchEnabled] = useState(false);
  const [wearOSEnabled, setWearOSEnabled] = useState(false);
  const [complications, setComplications] = useState([
    { id: 'audio-memo', action: 'audio-memo', label: 'Audio Memo', enabled: false },
    { id: 'heart-rate', action: 'heart-rate', label: 'Heart Rate Capture', enabled: false },
    { id: 'coordinate', action: 'coordinate', label: 'Current Coordinate Pin', enabled: false },
    { id: 'step-count', action: 'step-count', label: 'Step Count Sync', enabled: false },
  ]);

  const toggleComplication = (id: string) => {
    setComplications(complications.map(c =>
      c.id === id ? { ...c, enabled: !c.enabled } : c
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Wearable Watch Face Complications</h2>
      <p className="text-gray-600 mb-6">
        Apple Watch & Wear OS complications: one-tap audio memo, heart rate capture, current coordinate pin, step count sync.
      </p>

      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-3">Apple Watch</h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm">Enable Apple Watch Complications</span>
            <input
              type="checkbox"
              checked={appleWatchEnabled}
              onChange={(e) => setAppleWatchEnabled(e.target.checked)}
              className="w-5 h-5"
            />
          </div>
          {appleWatchEnabled && (
            <div className="space-y-2">
              {complications.map((comp) => (
                <div key={comp.id} className="flex items-center justify-between text-sm">
                  <span>{comp.label}</span>
                  <input
                    type="checkbox"
                    checked={comp.enabled}
                    onChange={() => toggleComplication(comp.id)}
                    className="w-4 h-4"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-3">Wear OS (Android)</h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm">Enable Wear OS Complications</span>
            <input
              type="checkbox"
              checked={wearOSEnabled}
              onChange={(e) => setWearOSEnabled(e.target.checked)}
              className="w-5 h-5"
            />
          </div>
          {wearOSEnabled && (
            <div className="space-y-2">
              {complications.map((comp) => (
                <div key={comp.id} className="flex items-center justify-between text-sm">
                  <span>{comp.label}</span>
                  <input
                    type="checkbox"
                    checked={comp.enabled}
                    onChange={() => toggleComplication(comp.id)}
                    className="w-4 h-4"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={() => alert('Configuration saved!')}
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}
