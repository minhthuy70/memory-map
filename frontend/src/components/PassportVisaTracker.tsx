'use client';

import { useState } from 'react';

export default function PassportVisaTracker() {
  const [countries, setCountries] = useState([
    { code: 'VN', name: 'Vietnam', visited: true },
    { code: 'JP', name: 'Japan', visited: true },
    { code: 'FR', name: 'France', visited: false },
  ]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Country Passport & Visa Tracker</h2>
      <p className="text-gray-600 mb-6">Color-coded world map of visited countries, visa validity countdown.</p>
      <div className="space-y-2">
        {countries.map(c => (
          <div key={c.code} className="flex justify-between p-2 bg-gray-50 rounded">
            <span>{c.name}</span>
            <span className={c.visited ? 'text-green-600' : 'text-gray-400'}>{c.visited ? '✓' : '○'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
