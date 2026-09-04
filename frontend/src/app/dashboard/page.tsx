
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Plus, Search, LogOut, Menu, X, User, ArrowUpDown, TrendingUp, Smile, Folder, Filter, RotateCcw, Calendar } from 'lucide-react';
import dynamic from 'next/dynamic';

const MemoryMap = dynamic(() => import('@/components/Map'), { ssr: false });

import { memoriesApi, Memory as ApiMemory, Statistics } from '@/lib/memories-api';
import { categoriesApi } from '@/lib/categories-api';
import { useAuthStore } from '@/store/auth-store';
import { useMemoriesStore } from '@/store/memories-store';
import ThemeToggle from '@/components/ThemeToggle';

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

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query || !query.trim() || !text) {
    return <>{text}</>;
  }

  const q = query.trim();
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-amber-200 dark:bg-amber-800/80 text-amber-950 dark:text-amber-100 rounded-xs px-0.5 font-semibold"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('date-newest');
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [showStats, setShowStats] = useState(false);
  const isFirstRender = useRef(true);

  const activeFilterCount = [
    selectedCategory,
    selectedMood,
    searchQuery.trim(),
    startDate,
    endDate,
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedMood('');
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
  };

  // Support reading query params on mount to filter by category or mood
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const moodParam = params.get('mood');
      const categoryParam = params.get('category');
      if (moodParam) setSelectedMood(moodParam);
      if (categoryParam) setSelectedCategory(categoryParam);
    }
  }, []);

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
        from?: string;
        to?: string;
      } = {};

      if (selectedCategory) {
        filters.categoryId = selectedCategory;
      }

      if (selectedMood) {
        filters.mood = selectedMood;
      }

      const trimmedSearch = searchQuery.trim();
      if (trimmedSearch.length >= 2) {
        filters.search = trimmedSearch;
      }

      if (startDate) {
        filters.from = startDate;
      }

      if (endDate) {
        filters.to = endDate;
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
   * Reload memories when filters change (with 300ms debounce for search and dates).
   */
  useEffect(() => {
    if (!isAuthenticated()) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
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
    startDate,
    endDate,
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

            <ThemeToggle />

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
          <div className="p-4 space-y-5">
            {/* Active Filters Summary & Clear Button */}
            {activeFilterCount > 0 && (
              <div className="flex items-center justify-between p-2.5 bg-primary/10 rounded-xl border border-primary/20 animate-in fade-in">
                <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Đang lọc: {activeFilterCount} điều kiện</span>
                </span>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                  title="Xóa tất cả bộ lọc"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Xóa lọc</span>
                </button>
              </div>
            )}

            {/* Search */}
            <div className="space-y-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />

                <input
                  type="text"
                  placeholder="Tìm kiếm theo tiêu đề, địa điểm... (tối thiểu 2 ký tự)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-xs sm:text-sm"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                    title="Xóa tìm kiếm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {searchQuery.trim().length === 1 && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 pl-1">
                  Nhập thêm ít nhất 1 ký tự để tìm kiếm...
                </p>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Danh mục
              </h3>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm cursor-pointer"
              >
                <option value="">Tất cả danh mục</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mood Filter */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tâm trạng
              </h3>

              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm cursor-pointer"
              >
                <option value="">Tất cả tâm trạng</option>

                {MOODS.map((mood) => (
                  <option key={mood.value} value={mood.value}>
                    {mood.emoji} {mood.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Khoảng thời gian</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Sort */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
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
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Danh sách kỷ niệm
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {memories.length} {activeFilterCount > 0 ? 'kết quả' : 'kỷ niệm'}
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-6 text-slate-500 text-xs flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span>Đang tải danh sách...</span>
                  </div>
                ) : memories.length === 0 ? (
                  <div className="text-center py-6 px-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-600">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {searchQuery.trim().length >= 2
                        ? `Không tìm thấy kết quả cho "${searchQuery}"`
                        : 'Không có kỷ niệm nào phù hợp'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {searchQuery.trim().length >= 2
                        ? 'Thử tìm với từ khóa khác hoặc xóa bộ lọc.'
                        : 'Hãy thử thay đổi điều kiện lọc hoặc tạo kỷ niệm mới.'}
                    </p>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="text-xs font-semibold text-primary hover:underline mt-2 inline-block cursor-pointer"
                      >
                        Xóa từ khóa tìm kiếm
                      </button>
                    )}
                  </div>
                ) : (
                  memories.slice(0, 15).map((memory) => (
                    <button
                      key={memory.id}
                      onClick={() => handleMemoryClick(memory)}
                      className="w-full text-left p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/60 dark:hover:bg-slate-700 rounded-xl transition-all border border-slate-200/60 dark:border-slate-600/60 hover:border-slate-300 dark:hover:border-slate-500 cursor-pointer group"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-lg shrink-0 mt-0.5" title={memory.category.name}>
                          {memory.category.icon}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                              <HighlightText text={memory.title} query={searchQuery} />
                            </h4>
                            <span className="text-sm shrink-0" title={`Tâm trạng: ${memory.mood}`}>
                              {MOOD_EMOJIS[memory.mood] || '😐'}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            <HighlightText
                              text={memory.locationName || `${memory.latitude.toFixed(4)}, ${memory.longitude.toFixed(4)}`}
                              query={searchQuery}
                            />
                          </p>

                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                            <span>{new Date(memory.memoryDate).toLocaleDateString('vi-VN')}</span>
                            <span>•</span>
                            <span className="truncate">{memory.category.name}</span>
                          </div>
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
                          const foundCat = categories.find((c) => c.name === category);
                          return (
                            <div
                              key={category}
                              onClick={() => {
                                if (foundCat) {
                                  setSelectedCategory(selectedCategory === foundCat.id ? '' : foundCat.id);
                                }
                              }}
                              className="flex items-center justify-between text-xs cursor-pointer hover:text-primary transition-colors py-0.5 group"
                              title={`Bấm để lọc theo ${category}`}
                            >
                              <span className="text-slate-700 dark:text-slate-300 group-hover:text-primary truncate">
                                {category}
                              </span>
                              <span className="text-slate-600 dark:text-slate-400 group-hover:text-primary font-medium">
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
                            <div
                              key={mood}
                              onClick={() => setSelectedMood(selectedMood === mood ? '' : mood)}
                              className="flex items-center justify-between text-xs cursor-pointer hover:text-primary transition-colors py-0.5 group"
                              title={`Bấm để lọc theo ${mood}`}
                            >
                              <span className="text-slate-700 dark:text-slate-300 group-hover:text-primary flex items-center gap-1">
                                <span>{MOOD_EMOJIS[mood] || '😐'}</span>
                                <span>{mood}</span>
                              </span>
                              <span className="text-slate-600 dark:text-slate-400 group-hover:text-primary font-medium">
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