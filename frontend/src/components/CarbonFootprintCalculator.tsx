'use client';

import { useState } from 'react';

export default function CarbonFootprintCalculator() {
  const [distance, setDistance] = useState(1000);
  const [tripType, setTripType] = useState('flight');
  const [co2, setCo2] = useState(250);

  const handleCalculate = () => {
    const emission = tripType === 'flight' ? distance * 0.25 : distance * 0.15;
    setCo2(Math.round(emission));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Carbon Footprint & Eco-Travel Calculator</h2>
      <p className="text-gray-600 mb-6">Carbon emission estimate based on flight/drive distance and vehicle type.</p>
      <div className="space-y-4">
        <select value={tripType} onChange={(e) => setTripType(e.target.value)} className="w-full p-2 border rounded">
          <option value="flight">Flight</option>
          <option value="drive">Drive</option>
          <option value="train">Train</option>
        </select>
        <input type="number" value={distance} onChange={(e) => setDistance(parseInt(e.target.value))} className="w-full p-2 border rounded" placeholder="Distance (km)" />
        <button onClick={handleCalculate} className="w-full py-2 bg-green-500 text-white rounded">Calculate CO2</button>
        <p className="text-center text-xl font-bold">{co2} kg CO2</p>
      </div>
    </div>
  );
}
