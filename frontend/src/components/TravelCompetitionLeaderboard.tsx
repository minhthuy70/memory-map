'use client';

import { useState } from 'react';

export default function TravelCompetitionLeaderboard() {
  const [leaderboards, setLeaderboards] = useState([
    {
      id: 1,
      name: 'Weekly Distance',
      type: 'km_traversed',
      period: 'weekly',
      entries: [
        { rank: 1, username: 'ExplorerAlex', score: 245.5 },
        { rank: 2, username: 'TravelerTom', score: 198.2 },
        { rank: 3, username: 'WandererJane', score: 156.8 },
        { rank: 4, username: 'You', score: 134.5 },
        { rank: 5, username: 'NomadMike', score: 112.3 },
      ],
    },
    {
      id: 2,
      name: 'Provinces Unlocked',
      type: 'provinces_unlocked',
      period: 'monthly',
      entries: [
        { rank: 1, username: 'ExplorerAlex', score: 12 },
        { rank: 2, username: 'You', score: 10 },
        { rank: 3, username: 'TravelerTom', score: 8 },
        { rank: 4, username: 'WandererJane', score: 7 },
        { rank: 5, username: 'NomadMike', score: 5 },
      ],
    },
  ]);
  const [selectedLeaderboard, setSelectedLeaderboard] = useState(leaderboards[0]);
  const [isCreating, setIsCreating] = useState(false);
  const [newLeaderboard, setNewLeaderboard] = useState({
    name: '',
    type: 'km_traversed',
    period: 'weekly',
  });

  const handleCreate = () => {
    setIsCreating(true);
    setTimeout(() => {
      const newBoard = {
        id: leaderboards.length + 1,
        name: newLeaderboard.name,
        type: newLeaderboard.type,
        period: newLeaderboard.period,
        entries: [
          { rank: 1, username: 'You', score: 0 },
        ],
      };
      setLeaderboards(prev => [...prev, newBoard]);
      setSelectedLeaderboard(newBoard);
      setNewLeaderboard({ name: '', type: 'km_traversed', period: 'weekly' });
      setIsCreating(false);
    }, 1500);
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getScoreLabel = (type: string) => {
    switch (type) {
      case 'km_traversed': return 'km';
      case 'provinces_unlocked': return 'provinces';
      case 'steps_taken': return 'steps';
      default: return 'points';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Friendly Travel Competition Leaderboard</h2>
      <p className="text-gray-600 mb-6">
        Private leaderboards among friend circles: total km traversed, provinces unlocked, steps taken, monthly podium winners.
      </p>

      <div className="space-y-4">
        {/* Leaderboard Selector */}
        <div className="flex gap-2 mb-4">
          {leaderboards.map(board => (
            <button
              key={board.id}
              onClick={() => setSelectedLeaderboard(board)}
              className={`px-4 py-2 rounded ${
                selectedLeaderboard.id === board.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {board.name}
            </button>
          ))}
        </div>

        {/* Create New Leaderboard */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Create New Leaderboard</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Leaderboard Name"
              value={newLeaderboard.name}
              onChange={(e) => setNewLeaderboard({ ...newLeaderboard, name: e.target.value })}
              className="p-2 border rounded"
            />
            <select
              value={newLeaderboard.type}
              onChange={(e) => setNewLeaderboard({ ...newLeaderboard, type: e.target.value })}
              className="p-2 border rounded"
            >
              <option value="km_traversed">Total KM Traversed</option>
              <option value="provinces_unlocked">Provinces Unlocked</option>
              <option value="steps_taken">Steps Taken</option>
            </select>
            <select
              value={newLeaderboard.period}
              onChange={(e) => setNewLeaderboard({ ...newLeaderboard, period: e.target.value })}
              className="p-2 border rounded"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <button
            onClick={handleCreate}
            disabled={isCreating || !newLeaderboard.name}
            className={`w-full py-2 rounded font-medium ${
              isCreating || !newLeaderboard.name
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isCreating ? 'Creating...' : 'Create Leaderboard'}
          </button>
        </div>

        {/* Leaderboard Display */}
        <div className="bg-gradient-to-b from-yellow-50 to-white p-4 rounded border-2 border-yellow-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">{selectedLeaderboard.name}</h3>
            <span className="text-sm text-gray-600">
              {selectedLeaderboard.period.charAt(0).toUpperCase() + selectedLeaderboard.period.slice(1)}
            </span>
          </div>

          {/* Podium */}
          <div className="flex justify-center items-end gap-4 mb-6 h-32">
            {selectedLeaderboard.entries.slice(0, 3).map((entry, index) => (
              <div
                key={entry.rank}
                className="flex flex-col items-center"
                style={{ height: `${(4 - entry.rank) * 25 + 20}%` }}
              >
                <div className="text-2xl mb-1">{getRankBadge(entry.rank)}</div>
                <div
                  className={`w-16 rounded-t-lg ${
                    entry.rank === 1
                      ? 'bg-yellow-400'
                      : entry.rank === 2
                      ? 'bg-gray-300'
                      : 'bg-orange-400'
                  }`}
                  style={{ height: '100%' }}
                ></div>
                <div className="text-xs mt-1 text-center">
                  <div className="font-medium">{entry.username}</div>
                  <div className="text-gray-600">{entry.score} {getScoreLabel(selectedLeaderboard.type)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Full List */}
          <div className="space-y-2">
            {selectedLeaderboard.entries.map(entry => (
              <div
                key={entry.rank}
                className={`flex justify-between items-center p-2 rounded ${
                  entry.username === 'You' ? 'bg-blue-100' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg w-8">{getRankBadge(entry.rank)}</span>
                  <span className="font-medium">{entry.username}</span>
                </div>
                <span className="font-bold">{entry.score} {getScoreLabel(selectedLeaderboard.type)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded">
          <h4 className="font-medium text-blue-800 mb-2">Leaderboard Rules:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Only friends in your circle can participate</li>
            <li>• Scores update automatically based on activity</li>
            <li>• Weekly/Monthly/Yearly periods available</li>
            <li>• Podium celebration for top 3 each period</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
