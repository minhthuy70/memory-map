'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, ArrowLeft, User, ArrowUpDown } from 'lucide-react';
import { memoriesApi, Memory } from '@/lib/memories-api';
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

export default function TimelinePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('date-newest');

  const loadMemories = async () => {
    try {
      setIsLoading(true);
      const data = await memoriesApi.getAll();

      // Sort memories
      const sortedMemories = [...data].sort((a, b) => {
        switch (sortBy) {
          case 'date-newest':
            return new Date(b.memoryDate).getTime() - new Date(a.memoryDate).getTime();
          case 'date-oldest':
            return new Date(a.memoryDate).getTime() - new Date(b.memoryDate).getTime();
          case 'title-asc':
            return a.title.localeCompare(b.title);
          case 'title-desc':
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });

      setMemories(sortedMemories);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to load memories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    loadMemories();
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated()) {
      loadMemories();
    }
  }, [sortBy, isAuthenticated]);

  const groupMemoriesByYear = (memories: Memory[]) => {
    const grouped: Record<string, Memory[]> = {};
    
    memories.forEach(memory => {
      const year = new Date(memory.memoryDate).getFullYear();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(memory);
    });
    
    // Sort years in descending order
    return Object.entries(grouped).sort((a, b) => Number(b[0]) - Number(a[0]));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  const groupedMemories = groupMemoriesByYear(memories);

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
            <Clock className="h-6 w-6" />
            Timeline
          </h1>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="date-newest">Newest</option>
              <option value="date-oldest">Oldest</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
            <button
              onClick={() => router.push('/profile')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              <User className="h-4 w-4" />
              {user?.name || user?.email}
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto">
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {memories.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No memories yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Start creating memories to see your timeline
            </p>
            <button
              onClick={() => router.push('/memories/new')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              Add Your First Memory
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedMemories.map(([year, yearMemories]) => (
              <div key={year}>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  {year}
                </h2>
                <div className="space-y-4 ml-4 border-l-2 border-slate-300 dark:border-slate-600 pl-6">
                  {yearMemories
                    .sort((a, b) => new Date(b.memoryDate).getTime() - new Date(a.memoryDate).getTime())
                    .map((memory) => (
                      <div
                        key={memory.id}
                        onClick={() => router.push(`/memories/${memory.id}`)}
                        className="relative bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="absolute left-[-34px] top-4 w-4 h-4 bg-primary rounded-full border-4 border-slate-50 dark:border-slate-900" />
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">{memory.category.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                              {memory.title}
                            </h3>
                            <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(memory.memoryDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {memory.locationName || 'Unknown location'}
                              </span>
                              <span className="flex items-center gap-1">
                                {MOOD_EMOJIS[memory.mood] || '😐'}
                                {memory.mood}
                              </span>
                            </div>
                            {memory.content && (
                              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                {memory.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
