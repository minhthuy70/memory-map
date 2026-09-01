'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, Calendar, MapPin, Smile, User } from 'lucide-react';
import { memoriesApi, Statistics } from '@/lib/memories-api';
import { useAuthStore } from '@/store/auth-store';

const MOOD_EMOJIS: Record<string, string> = {
  HAPPY: '😊',
  SAD: '😢',
  EXCITED: '🤩',
  PEACEFUL: '😌',
  NOSTALGIC: '😊',
  LOVE: '❤️',
  ANGRY: '😡',
  TIRED: '😴',
  NEUTRAL: '😐',
};

export default function StatisticsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStatistics = async () => {
    try {
      setIsLoading(true);
      const data = await memoriesApi.getStatistics();
      setStatistics(data);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    loadStatistics();
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Statistics
          </h1>
          <button
            onClick={() => router.push('/profile')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            <User className="h-4 w-4" />
            {user?.name || user?.email}
          </button>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto">
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {statistics && statistics.totalMemories === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No data yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Start creating memories to see your statistics
            </p>
            <button
              onClick={() => router.push('/memories/new')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              Add Your First Memory
            </button>
          </div>
        ) : statistics ? (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm">Total</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {statistics.totalMemories}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">This Year</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {statistics.memoriesThisYear}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                  <MapPin className="h-5 w-5" />
                  <span className="text-sm">Locations</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {statistics.uniqueLocations}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                  <Smile className="h-5 w-5" />
                  <span className="text-sm">Categories</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {statistics.uniqueCategories}
                </p>
              </div>
            </div>

            {/* Mood Distribution */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Mood Distribution
              </h2>
              <div className="space-y-3">
                {Object.entries(statistics.moodDistribution).map(([mood, count]) => {
                  const percentage = statistics.totalMemories > 0 
                    ? (count / statistics.totalMemories) * 100 
                    : 0;
                  return (
                    <div key={mood}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <span className="text-lg">{MOOD_EMOJIS[mood] || '😐'}</span>
                          {mood}
                        </span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Category Distribution
              </h2>
              <div className="space-y-3">
                {Object.entries(statistics.categoryDistribution).map(([category, count]) => {
                  const percentage = statistics.totalMemories > 0 
                    ? (count / statistics.totalMemories) * 100 
                    : 0;
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {category}
                        </span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-secondary h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Activity */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Monthly Activity (Last 12 Months)
              </h2>
              <div className="space-y-2">
                {Object.entries(statistics.monthlyActivity).map(([month, count]) => {
                  const maxCount = Math.max(...Object.values(statistics.monthlyActivity));
                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  return (
                    <div key={month}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {month}
                        </span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {count}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
