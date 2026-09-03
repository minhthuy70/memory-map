
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Plus, Search, LogOut, Menu, X, User, ArrowUpDown, TrendingUp, Smile, Folder } from 'lucide-react';
import dynamic from 'next/dynamic';

const MemoryMap = dynamic(() => import('@/components/Map'), { ssr: false });

import { memoriesApi, Memory as ApiMemory, Statistics } from '@/lib/memories-api';
import { categoriesApi } from '@/lib/categories-api';
import { useAuthStore } from '@/store/auth-store';
import { useMemoriesStore } from '@/store/memories-store';

type Memory = ApiMemory;

const MOODS = [
  { value: 'HAPPY', emoji: '😊' },
  { value: 'SAD', emoji: '😢' },
  { value: 'EXCITED', emoji: '🤩' },
  { value: 'PEACEFUL', emoji: '😌' },
  { value: 'NOSTALGIC', emoji: '🥹' },
  { value: 'LOVE', emoji: '❤️' },
  { value: 'ANGRY', emoji: '😡' },
  { value: 'TIRED', emoji: '😴' },
  { value: 'NEUTRAL', emoji: '😐' },
];

const MOOD_EMOJIS: Record<string, string> = {
  HAPPY: '😊',
  SAD: '😢',
  EXCITED: '🤩',
  PEACEFUL: '😌',
  NOSTALGIC: '🥹',
  LOVE: '❤️',
  ANGRY: '😡',
  TIRED: '😴',
  NEUTRAL: '😐',
};

export default function DashboardPage() {
  const router = useRouter();

  const { user, logout, isAuthenticated } = useAuthStore();

  const {
    memories,
    categories,
    setMemories,
    setCategories,
    setSelectedMemory,
  } = useMemoriesStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('date-newest');
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [showStats, setShowStats] = useState(false);

  const sortMemoriesList = (list: Memory[], criterion: string) => {
    return [...list].sort((a, b) => {
      switch (criterion) {
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
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    // Apply sort immediately without waiting for re-fetch
    setMemories(sortMemoriesList(memories, newSortBy));
  };

  /**
   * Load initial dashboard data.
   * Memories and categories are loaded together only once.
   */
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [memoriesData, categoriesData, statsData] = await Promise.all([
        memoriesApi.getAll(),
        categoriesApi.getAll(),
        memoriesApi.getStatistics(),
      ]);

      setMemories(sortMemoriesList(memoriesData, sortBy));
      setCategories(categoriesData);
      setStatistics(statsData);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to load data';

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load memories based on current filters.
   */
  const loadMemories = async () => {
    try {
      setError('');

      const filters: {
        categoryId?: string;
        mood?: string;
        search?: string;
      } = {};

      if (selectedCategory) {
        filters.categoryId = selectedCategory;
      }

      if (selectedMood) {
        filters.mood = selectedMood;
      }

      if (searchQuery.trim()) {
        filters.search = searchQuery.trim();
      }

      const memoriesData = await memoriesApi.getAll(filters);
      setMemories(sortMemoriesList(memoriesData, sortBy));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to load memories';

      setError(message);
    }
  };

  /**
   * Check authentication and load initial data.
   */
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    loadData();
  }, [isAuthenticated, router]);

  /**
   * Reload memories when filters change.
   *
   * The initial unfiltered request is already handled by loadData(),
   * so this effect skips the first render.
   */
  useEffect(() => {
    if (
      !isAuthenticated() ||
      (!selectedCategory && !selectedMood && !searchQuery && sortBy === 'date-newest')
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      loadMemories();
    }, 300);

    return () => clearTimeout(timeout);
  }, [
    selectedCategory,
    selectedMood,
    searchQuery,
    sortBy,
    isAuthenticated,
  ]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleMemoryClick = (memory: ApiMemory) => {
    setSelectedMemory(memory as Memory);
    router.push(`/memories/${memory.id}`);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    router.push(`/memories/new?lat=${lat}&lng=${lng}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            <Link href="/" className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                Memory Map
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/timeline')}
              className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              Timeline
            </button>

            <button
              onClick={() => router.push('/statistics')}
              className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              Statistics
            </button>

            <button
              onClick={() => router.push('/profile')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              <User className="h-4 w-4" />
              {user?.name || user?.email}
            </button>

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:relative z-40 w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-full overflow-y-auto transition-transform duration-300 ease-in-out`}
        >
          <div className="p-4 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

              <input
                type="text"
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Category
              </h3>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="">All Categories</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mood Filter */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Mood
              </h3>

              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="">All Moods</option>

                {MOODS.map((mood) => (
                  <option key={mood.value} value={mood.value}>
                    {mood.emoji} {mood.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ArrowUpDown className="h-4 w-4 text-primary" />
                  <span>Sắp xếp</span>
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-primary/10 text-primary">
                  {sortBy === 'date-newest' && 'Mới nhất'}
                  {sortBy === 'date-oldest' && 'Cũ nhất'}
                  {sortBy === 'title-asc' && 'A → Z'}
                  {sortBy === 'title-desc' && 'Z → A'}
                </span>
              </div>

              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm cursor-pointer"
              >
                <option value="date-newest">Ngày (Mới nhất trước)</option>
                <option value="date-oldest">Ngày (Cũ nhất trước)</option>
                <option value="title-asc">Tiêu đề (A-Z)</option>
                <option value="title-desc">Tiêu đề (Z-A)</option>
              </select>
            </div>

            {/* Memory List */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Memories ({memories.length})
              </h3>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-4 text-slate-500">
                    Loading...
                  </div>
                ) : memories.length === 0 ? (
                  <div className="text-center py-4 text-slate-500">
                    No memories found
                  </div>
                ) : (
                  memories.slice(0, 10).map((memory) => (
                    <button
                      key={memory.id}
                      onClick={() => handleMemoryClick(memory)}
                      className="w-full text-left p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg">
                          {memory.category.icon}
                        </span>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-900 dark:text-white truncate">
                            {memory.title}
                          </h4>

                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {memory.locationName || 'Unknown location'}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Quick Stats */}
            {statistics && statistics.totalMemories > 0 && (
              <div className="space-y-4">
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      Thống kê nhanh
                    </span>
                  </div>
                  <ArrowUpDown className={`h-4 w-4 text-slate-600 dark:text-slate-400 transition-transform ${showStats ? 'rotate-180' : ''}`} />
                </button>

                {showStats && (
                  <div className="space-y-3 animate-in slide-in-from-top-2">
                    {/* Categories Summary */}
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Folder className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          Danh mục
                        </span>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(statistics.categoryDistribution).slice(0, 5).map(([category, count]) => {
                          const percentage = statistics.totalMemories > 0 
                            ? (count / statistics.totalMemories) * 100 
                            : 0;
                          return (
                            <div key={category} className="flex items-center justify-between text-xs">
                              <span className="text-slate-700 dark:text-slate-300 truncate">
                                {category}
                              </span>
                              <span className="text-slate-600 dark:text-slate-400">
                                {count} ({percentage.toFixed(0)}%)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Mood Distribution */}
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Smile className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          Tâm trạng
                        </span>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(statistics.moodDistribution).slice(0, 5).map(([mood, count]) => {
                          const percentage = statistics.totalMemories > 0 
                            ? (count / statistics.totalMemories) * 100 
                            : 0;
                          return (
                            <div key={mood} className="flex items-center justify-between text-xs">
                              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <span>{MOOD_EMOJIS[mood] || '😐'}</span>
                                {mood}
                              </span>
                              <span className="text-slate-600 dark:text-slate-400">
                                {count} ({percentage.toFixed(0)}%)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Monthly Activity */}
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          Hoạt động tháng
                        </span>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(statistics.monthlyActivity).slice(0, 6).map(([month, count]) => {
                          const maxCount = Math.max(...Object.values(statistics.monthlyActivity));
                          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                          return (
                            <div key={month} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-700 dark:text-slate-300">
                                  {month}
                                </span>
                                <span className="text-slate-600 dark:text-slate-400">
                                  {count}
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                <div
                                  className="bg-primary h-1.5 rounded-full transition-all"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Memory Growth Chart */}
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          Tăng trưởng kỷ niệm
                        </span>
                      </div>
                      <div className="relative h-24">
                        <div className="absolute inset-0 flex items-end justify-between gap-1">
                          {(() => {
                            const months = Object.entries(statistics.monthlyActivity).slice(0, 12);
                            let cumulative = 0;
                            const cumulativeData = months.map(([month, count]) => {
                              cumulative += count;
                              return { month, count: cumulative };
                            });
                            
                            const maxCumulative = Math.max(...cumulativeData.map(d => d.count), 1);
                            
                            return cumulativeData.map(({ month, count }, index) => {
                              const percentage = (count / maxCumulative) * 100;
                              return (
                                <div key={month} className="flex-1 flex flex-col items-center">
                                  <div
                                    className="w-full bg-gradient-to-t from-primary to-accent rounded-t transition-all hover:from-primary-hover hover:to-accent-hover"
                                    style={{ height: `${Math.max(percentage, 5)}%` }}
                                    title={`${month}: ${count} total memories`}
                                  />
                                  {index % 2 === 0 && (
                                    <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 truncate w-full text-center">
                                      {month.split(' ')[0]}
                                    </span>
                                  )}
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                        <span>Tổng: {statistics.totalMemories}</span>
                        <span>12 tháng gần nhất</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Add Memory Button */}
            <button
              onClick={() => router.push('/memories/new')}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              Add Memory
            </button>
          </div>
        </aside>

        {/* Main Content - Map */}
        <main className="flex-1 relative">
          {error && (
            <div className="absolute top-4 left-4 right-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg z-10">
              {error}
            </div>
          )}

          {/* Statistics Overview Cards */}
          {statistics && statistics.totalMemories > 0 && (
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-3">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs">Tổng kỷ niệm</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {statistics.totalMemories}
                  </p>
                </div>

                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-3">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                    <Folder className="h-4 w-4" />
                    <span className="text-xs">Danh mục</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {statistics.uniqueCategories}
                  </p>
                </div>

                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-3">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs">Địa điểm</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {statistics.uniqueLocations}
                  </p>
                </div>

                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-3">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                    <Smile className="h-4 w-4" />
                    <span className="text-xs">Tháng này</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {statistics.memoriesThisYear}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="h-full">
            <MemoryMap
              memories={memories}
              onLocationSelect={handleLocationSelect}
              onSelectMode={false}
              onMarkerClick={handleMemoryClick}
              showSearch={true}
              showCurrentLocationButton={true}
            />
          </div>
        </main>
      </div>
    </div>
  );
}