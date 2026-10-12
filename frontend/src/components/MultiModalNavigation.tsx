'use client';

import { useState } from 'react';

export default function MultiModalNavigation() {
  const [showEVStations, setShowEVStations] = useState(true);
  const [showGasStations, setShowGasStations] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Multi-modal Route Navigation</h2>
      <p className="text-gray-600 mb-6">Turn-by-turn route preview, transit step details, EV charging station markers.</p>
      <div className="space-y-4">
        <div className="flex gap-2">
          <label className="flex items-center gap-2"><input type="checkbox" checked={showEVStations} onChange={(e) => setShowEVStations(e.target.checked)} /> EV Stations</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={showGasStations} onChange={(e) => setShowGasStations(e.target.checked)} /> Gas Stations</label>
        </div>
        <div className="h-48 bg-gray-100 rounded flex items-center justify-center">Map Preview</div>
      </div>
    </div>
  );
}
