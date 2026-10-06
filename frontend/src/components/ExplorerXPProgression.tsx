'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface UserStats {
  id: string;
  xp: number;
  level: number;
  totalMemories: number;
  totalPhotos: number;
  totalDistance: number;
  locationsVisited: number;
  streakDays: number;
  longestStreak: number;
}

interface Badge {
  id: string;
  badgeType: string;
  badgeName: string;
  rarity: string;
  progress: number;
  target: number;
  unlockedAt: string | null;
}

export default function ExplorerXPProgression() {
  const { token } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    fetchStats();
    fetchBadges();
  }, [token]);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/gamification/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchBadges = async () => {
    try {
      const response = await fetch('http://localhost:3001/gamification/badges', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBadges(data);
    } catch (error) {
      console.error('Failed to fetch badges:', error);
    }
  };

  const addXP = async (amount: number) => {
    try {
      await fetch('http://localhost:3001/gamification/stats/xp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      await fetchStats();
    } catch (error) {
      console.error('Failed to add XP:', error);
    }
  };

  const getLevelTitle = (level: number) => {
    if (level < 5) return 'Novice Explorer';
    if (level < 10) return 'Wanderer';
    if (level < 20) return 'Wayfarer';
    if (level < 50) return 'Master Cartographer';
    return 'Legendary Explorer';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'platinum':
        return 'bg-gray-300 text-gray-800 border-gray-400';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'silver':
        return 'bg-gray-200 text-gray-800 border-gray-300';
      default:
        return 'bg-orange-100 text-orange-800 border-orange-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Explorer Level & XP Progression</h2>

      {stats && (
        <div className="mb-8">
          {/* Level Display */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold mb-2">
              {stats.level}
            </div>
            <p className="text-lg font-semibold text-gray-700">{getLevelTitle(stats.level)}</p>
          </div>

          {/* XP Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>XP Progress</span>
              <span>{stats.xp} / {stats.level * 100} XP</span>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all"
                style={{ width: `${(stats.xp % 100)}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.totalMemories}</p>
              <p className="text-sm text-gray-600">Memories</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{stats.totalPhotos}</p>
              <p className="text-sm text-gray-600">Photos</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.locationsVisited}</p>
              <p className="text-sm text-gray-600">Locations</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-orange-600">{(stats.totalDistance / 1000).toFixed(1)}k</p>
              <p className="text-sm text-gray-600">Km Traveled</p>
            </div>
          </div>

          {/* Add XP Demo */}
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => addXP(10)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              +10 XP
            </button>
            <button
              onClick={() => addXP(50)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              +50 XP
            </button>
          </div>
        </div>
      )}

      {/* Badges */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Achievement Badges</h3>

        {badges.length === 0 ? (
          <p className="text-gray-500 py-4 text-center">No badges earned yet</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  badge.unlockedAt
                    ? getRarityColor(badge.rarity)
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">
                    {badge.unlockedAt ? '🏆' : '🔒'}
                  </div>
                  <p className="font-medium text-sm">{badge.badgeName}</p>
                  <p className="text-xs mt-1">
                    {badge.progress} / {badge.target}
                  </p>
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                    <div
                      className="h-2 bg-current rounded-full"
                      style={{ width: `${(badge.progress / badge.target) * 100}%` }}
                    />
                  </div>
                  {badge.unlockedAt && (
                    <p className="text-xs mt-2 capitalize">{badge.rarity}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
