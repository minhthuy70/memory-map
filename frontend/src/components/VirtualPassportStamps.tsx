'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface PassportStamp {
  id: string;
  country: string;
  city: string;
  province: string;
  stampDate: string;
  stampDesign: string;
}

export default function VirtualPassportStamps() {
  const { token } = useAuth();
  const [stamps, setStamps] = useState<PassportStamp[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStamp, setNewStamp] = useState({
    country: '',
    city: '',
    province: '',
  });

  useEffect(() => {
    fetchStamps();
  }, [token]);

  const fetchStamps = async () => {
    try {
      const response = await fetch('http://localhost:3001/gamification/passport', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setStamps(data);
    } catch (error) {
      console.error('Failed to fetch stamps:', error);
    }
  };

  const addStamp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/gamification/passport/stamp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newStamp),
      });

      setShowAddForm(false);
      setNewStamp({ country: '', city: '', province: '' });
      await fetchStamps();
    } catch (error) {
      console.error('Failed to add stamp:', error);
    }
  };

  const uniqueCountries = Array.from(new Set(stamps.map((s) => s.country)));
  const uniqueCities = stamps.length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Virtual Passport Stamps</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Stamp
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-3xl font-bold text-blue-600">{uniqueCountries.length}</p>
          <p className="text-sm text-gray-600">Countries</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg text-center">
          <p className="text-3xl font-bold text-green-600">{uniqueCities}</p>
          <p className="text-sm text-gray-600">Cities</p>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Add New Stamp</h3>
          <form onSubmit={addStamp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                value={newStamp.country}
                onChange={(e) => setNewStamp({ ...newStamp, country: e.target.value })}
                placeholder="Vietnam"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={newStamp.city}
                onChange={(e) => setNewStamp({ ...newStamp, city: e.target.value })}
                placeholder="Ho Chi Minh City"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Province/State</label>
              <input
                type="text"
                value={newStamp.province}
                onChange={(e) => setNewStamp({ ...newStamp, province: e.target.value })}
                placeholder="Ho Chi Minh"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Stamp
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stamps Grid */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Passport Stamps</h3>

        {stamps.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No passport stamps yet</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stamps.map((stamp) => (
              <div
                key={stamp.id}
                className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">🛂</div>
                  <p className="font-medium text-sm text-gray-800">{stamp.city}</p>
                  <p className="text-xs text-gray-600">{stamp.province}</p>
                  <p className="text-xs text-gray-500 mt-1">{stamp.country}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(stamp.stampDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">About Virtual Passport</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Digital passport booklet with realistic rubber stamps</li>
          <li>• Stamped automatically upon arrival in new cities</li>
          <li>• Vintage graphic designs per province</li>
          <li>• Track your travel journey around the world</li>
        </ul>
      </div>
    </div>
  );
}
