'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface JournalingStreak {
  id: string;
  currentStreak: number;
  longestStreak: number;
  lastJournalDate: string | null;
  freezeTokens: number;
  milestones: string;
}

export default function JournalingStreaks() {
  const { token } = useAuth();
  const [streak, setStreak] = useState<JournalingStreak | null>(null);

  useEffect(() => {
    fetchStreak();
  }, [token]);

  const fetchStreak = async () => {
    try {
      const response = await fetch('http://localhost:3001/gamification/streak', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setStreak(data);
    } catch (error) {
      console.error('Failed to fetch streak:', error);
    }
  };

  const recordJournalEntry = async () => {
    try {
      await fetch('http://localhost:3001/gamification/streak/record', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchStreak();
    } catch (error) {
      console.error('Failed to record journal entry:', error);
    }
  };

  const milestones = streak ? JSON.parse(streak.milestones || '[]') : [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Memory Journaling Streaks</h2>

      {streak && (
        <div>
          {/* Streak Display */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white mb-4">
              <div>
                <p className="text-5xl font-bold">{streak.currentStreak}</p>
                <p className="text-sm">days</p>
              </div>
            </div>
            <p className="text-lg font-semibold text-gray-700">Current Streak</p>
            <p className="text-sm text-gray-500">Longest: {streak.longestStreak} days</p>
          </div>

          {/* Freeze Tokens */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-3xl font-bold text-blue-600 mb-2">❄️ {streak.freezeTokens}</p>
            <p className="text-sm text-gray-600">Freeze Tokens Available</p>
            <p className="text-xs text-gray-500 mt-1">
              Use to protect your streak when you miss a day
            </p>
          </div>

          {/* Milestones */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Milestones</h3>
            <div className="grid grid-cols-4 gap-4">
              {[7, 30, 100, 365].map((milestone) => {
                const achieved = milestones.includes(milestone.toString());
                return (
                  <div
                    key={milestone}
                    className={`p-4 rounded-lg text-center ${
                      achieved
                        ? 'bg-green-100 border-2 border-green-300'
                        : 'bg-gray-100 border-2 border-gray-200'
                    }`}
                  >
                    <p className="text-2xl font-bold">{milestone}</p>
                    <p className="text-xs text-gray-600">days</p>
                    {achieved && <p className="text-xs text-green-600 mt-1">✓</p>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Record Entry */}
          <div className="text-center">
            <button
              onClick={recordJournalEntry}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              📝 Record Today's Journal Entry
            </button>
            {streak.lastJournalDate && (
              <p className="text-sm text-gray-500 mt-2">
                Last entry: {new Date(streak.lastJournalDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 bg-orange-50 rounded-lg">
        <h4 className="font-semibold text-orange-800 mb-2">How Streaks Work</h4>
        <ul className="text-sm text-orange-700 space-y-1">
          <li>• Record a journal entry every day to maintain your streak</li>
          <li>• Use freeze tokens to protect your streak when you miss a day</li>
          <li>• Earn rewards at 7, 30, 100, and 365 day milestones</li>
          <li>• Celebratory confetti animations for milestone achievements</li>
        </ul>
      </div>
    </div>
  );
}
