'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface DailySerendipity {
  id: string;
  memoryId: string;
  date: string;
  viewedAt: string | null;
  isViewed: boolean;
  moodBefore: string | null;
  moodAfter: string | null;
}

export default function DailySerendipity() {
  const { token } = useAuth();
  const [serendipity, setSerendipity] = useState<DailySerendipity | null>(null);
  const [moodBefore, setMoodBefore] = useState('');
  const [moodAfter, setMoodAfter] = useState('');

  useEffect(() => {
    fetchSerendipity();
  }, [token]);

  const fetchSerendipity = async () => {
    try {
      const response = await fetch('http://localhost:3001/psychology/serendipity', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setSerendipity(data);
    } catch (error) {
      console.error('Failed to fetch serendipity:', error);
    }
  };

  const markViewed = async () => {
    try {
      await fetch('http://localhost:3001/psychology/serendipity/viewed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ moodBefore, moodAfter }),
      });

      await fetchSerendipity();
    } catch (error) {
      console.error('Failed to mark viewed:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Daily Serendipity Memory Resurfacing</h2>

      {serendipity ? (
        <div>
          {/* Memory Card */}
          <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
            <div className="text-center">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-purple-800 mb-2">Today's Memory</h3>
              <p className="text-sm text-gray-600 mb-4">
                {new Date(serendipity.date).toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                A delightful, long-forgotten memory from your past
              </p>
            </div>
          </div>

          {/* Mood Tracking */}
          {!serendipity.isViewed ? (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">How does this memory make you feel?</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mood Before</label>
                  <select
                    value={moodBefore}
                    onChange={(e) => setMoodBefore(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select mood...</option>
                    <option value="happy">😊 Happy</option>
                    <option value="neutral">😐 Neutral</option>
                    <option value="sad">😢 Sad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mood After</label>
                  <select
                    value={moodAfter}
                    onChange={(e) => setMoodAfter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select mood...</option>
                    <option value="happy">😊 Happy</option>
                    <option value="neutral">😐 Neutral</option>
                    <option value="sad">😢 Sad</option>
                  </select>
                </div>

                <button
                  onClick={markViewed}
                  disabled={!moodBefore || !moodAfter}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Log Mood
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-green-50 rounded-lg text-center">
              <p className="text-lg font-semibold text-green-800 mb-2">✓ Mood Logged</p>
              <p className="text-sm text-green-600">
                {serendipity.moodBefore} → {serendipity.moodAfter}
              </p>
            </div>
          )}

          {/* Info */}
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">About Daily Serendipity</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Intelligent algorithm resurfaces a memory each morning at 8:00 AM</li>
              <li>• Mood booster card to start your day positively</li>
              <li>• Track how memories affect your mood over time</li>
              <li>• Widget integration for quick access</li>
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 py-8 text-center">Loading today's serendipity...</p>
      )}
    </div>
  );
}
