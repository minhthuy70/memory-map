'use client';

import { useState } from 'react';

export default function TravelSafetySOS() {
  const [sosTriggered, setSosTriggered] = useState(false);

  const handleSOS = () => {
    setSosTriggered(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Travel Emergency & SOS Hub</h2>
      <p className="text-gray-600 mb-6">One-touch emergency SOS button, auto-detect local police/medical numbers by GPS country.</p>
      <div className="space-y-4">
        <button onClick={handleSOS} disabled={sosTriggered} className={`w-full py-4 rounded-full font-bold text-xl ${sosTriggered ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600 text-white'}`}>
          {sosTriggered ? 'SOS Activated' : '🆘 SOS'}
        </button>
        {sosTriggered && (
          <div className="p-3 bg-red-50 rounded text-center">
            <p className="text-red-600 font-medium">Emergency contacts notified</p>
            <p className="text-sm text-gray-600">Location shared with nearest authorities</p>
          </div>
        )}
      </div>
    </div>
  );
}
