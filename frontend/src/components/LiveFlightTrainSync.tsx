'use client';

import { useState } from 'react';

export default function LiveFlightTrainSync() {
  const [status, setStatus] = useState('on_time');

  const statusColor = status === 'on_time' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Live Flight & Train Status Sync</h2>
      <p className="text-gray-600 mb-6">Flight number tracking via FlightAware/AviationStack API, gate changes, delay alerts.</p>
      <div className="space-y-4">
        <div className="p-3 bg-gray-50 rounded">
          <p className="font-medium">Flight VN123</p>
          <p className="text-sm">Status: <span className={statusColor + ' capitalize'}>{status}</span></p>
        </div>
      </div>
    </div>
  );
}
