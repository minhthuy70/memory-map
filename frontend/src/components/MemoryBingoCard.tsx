'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface BingoChallenge {
  id: string;
  year: number;
  challenges: string;
}

interface BingoCompletion {
  id: string;
  completedIndices: string;
  completedAt: string | null;
  rewardClaimed: boolean;
}

export default function MemoryBingoCard() {
  const { token } = useAuth();
  const [year, setYear] = useState(new Date().getFullYear());
  const [challenge, setChallenge] = useState<BingoChallenge | null>(null);
  const [completion, setCompletion] = useState<BingoCompletion | null>(null);

  useEffect(() => {
    fetchBingoCompletion();
  }, [token, year]);

  const fetchBingoCompletion = async () => {
    try {
      const response = await fetch(`http://localhost:3001/gamification/bingo/${year}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setChallenge(data.challenge);
      setCompletion(data.completion);
    } catch (error) {
      console.error('Failed to fetch bingo:', error);
    }
  };

  const toggleItem = async (index: number) => {
    try {
      await fetch(`http://localhost:3001/gamification/bingo/${year}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ index }),
      });

      await fetchBingoCompletion();
    } catch (error) {
      console.error('Failed to complete item:', error);
    }
  };

  const completedIndices = completion ? JSON.parse(completion.completedIndices || '[]') : [];
  const challenges = challenge ? JSON.parse(challenge.challenges) : [];

  const checkBingo = () => {
    // Simple check: 5 items in any row
    const rows = [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24],
    ];

    for (const row of rows) {
      if (row.every((idx) => completedIndices.includes(idx))) {
        return true;
      }
    }
    return false;
  };

  const isBingo = checkBingo();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Memory Bingo Challenge Card</h2>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
        </select>
      </div>

      {completion && completion.completedAt && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-200 text-center">
          <p className="text-2xl font-bold text-green-800">🎉 BINGO!</p>
          <p className="text-sm text-green-600">Completed on {new Date(completion.completedAt).toLocaleDateString()}</p>
        </div>
      )}

      {/* Bingo Grid */}
      <div className="mb-6">
        <div className="grid grid-cols-5 gap-2">
          {challenges.map((challenge: string, index: number) => {
            const isCompleted = completedIndices.includes(index);
            return (
              <button
                key={index}
                onClick={() => toggleItem(index)}
                className={`p-3 rounded-lg text-xs text-center transition-colors ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <p className="font-medium leading-tight">{challenge}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{completedIndices.length} / 25</span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${isBingo ? 'bg-green-500' : 'bg-blue-500'}`}
            style={{ width: `${(completedIndices.length / 25) * 100}%` }}
          />
        </div>
      </div>

      {/* Info */}
      <div className="p-4 bg-purple-50 rounded-lg">
        <h4 className="font-semibold text-purple-800 mb-2">How to Play</h4>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Complete 5 experiences in a row to get Bingo</li>
          <li>• Click items to mark them as completed</li>
          <li>• Complete rows for rewards</li>
          <li>• Track your annual experiences</li>
        </ul>
      </div>
    </div>
  );
}
