'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  User,
  ArrowUpDown,
  Filter,
  RotateCcw,
  Plus,
  Image as ImageIcon,
  ChevronRight,
  Smile,
  Folder,
} from 'lucide-react';
import { memoriesApi, Memory } from '@/lib/memories-api';
import { categoriesApi, Category } from '@/lib/categories-api';
import { useAuthStore } from '@/store/auth-store';

const MOODS = [
  { value: 'HAPPY', label: 'Vui vẻ', emoji: '😊' },
  { value: 'SAD', label: 'Buồn', emoji: '😢' },
  { value: 'EXCITED', label: 'Hào hứng', emoji: '🤩' },
  { value: 'PEACEFUL', label: 'Bình yên', emoji: '😌' },
  { value: 'NOSTALGIC', label: 'Hoài niệm', emoji: '🥹' },
  { value: 'LOVE', label: 'Yêu thương', emoji: '❤️' },
  { value: 'ANGRY', label: 'Tức giận', emoji: '😡' },
  { value: 'TIRED', label: 'Mệt mỏi', emoji: '😴' },
  { value: 'NEUTRAL', label: 'Bình thường', emoji: '😐' },
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

const MOOD_LABELS: Record<string, string> = {
  HAPPY: 'Vui vẻ',
  SAD: 'Buồn',
  EXCITED: 'Hào hứng',
  PEACEFUL: 'Bình yên',
  NOSTALGIC: 'Hoài niệm',
  LOVE: 'Yêu thương',
  ANGRY: 'Tức giận',
  TIRED: 'Mệt mỏi',
  NEUTRAL: 'Bình thường',
};

export default function TimelinePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const [memories, setMemories] = useState<Memory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & Sorting state
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [sortBy, setSortBy] = useState('date-newest');

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [memoriesData, categoriesData] = await Promise.all([
        memoriesApi.getAll(),
        categoriesApi.getAll(),
      ]);
      setMemories(memoriesData);
      setCategories(categoriesData);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Không thể tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    loadData();
  }, [isAuthenticated, router]);

  // Extract unique years from all memories
  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>();
    memories.forEach((m) => {
      if (m.memoryDate) {
        const y = new Date(m.memoryDate).getFullYear();
        if (!isNaN(y)) {
          yearsSet.add(String(y));
        }
      }
    });
    return Array.from(yearsSet).sort((a, b) => Number(b) - Number(a));
  }, [memories]);

  // Count active filters
  const activeFilterCount = [selectedYear, selectedCategory, selectedMood].filter(Boolean).length;

  const handleClearFilters = () => {
    setSelectedYear('');
    setSelectedCategory('');
    setSelectedMood('');
  };

  // Filter memories
  const filteredMemories = useMemo(() => {
    return memories.filter((m) => {
      if (selectedYear) {
        const y = String(new Date(m.memoryDate).getFullYear());
        if (y !== selectedYear) return false;
      }
      if (selectedCategory && m.categoryId !== selectedCategory) {
        return false;
      }
      if (selectedMood && m.mood !== selectedMood) {
        return false;
      }
      return true;
    });
  }, [memories, selectedYear, selectedCategory, selectedMood]);

  // Group filtered memories by Year and then by Month within each year
  const groupedMemories = useMemo(() => {
    const isOldest = sortBy === 'date-oldest';

    // Sort list according to sortBy
    const sorted = [...filteredMemories].sort((a, b) => {
      switch (sortBy) {
        case 'date-newest':
          return new Date(b.memoryDate).getTime() - new Date(a.memoryDate).getTime();
        case 'date-oldest':
          return new Date(a.memoryDate).getTime() - new Date(b.memoryDate).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title, 'vi');
        case 'title-desc':
          return b.title.localeCompare(a.title, 'vi');
        default:
          return 0;
      }
    });

    const yearMap = new Map<string, Map<string, Memory[]>>();

    sorted.forEach((memory) => {
      const date = new Date(memory.memoryDate);
      const yearStr = String(date.getFullYear());
      const monthNum = date.getMonth() + 1;
      const monthStr = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;

      if (!yearMap.has(yearStr)) {
        yearMap.set(yearStr, new Map());
      }
      const monthMap = yearMap.get(yearStr)!;
      if (!monthMap.has(monthStr)) {
        monthMap.set(monthStr, []);
      }
      monthMap.get(monthStr)!.push(memory);
    });

    const years = Array.from(yearMap.keys()).sort((a, b) =>
      isOldest ? Number(a) - Number(b) : Number(b) - Number(a)
    );

    return years.map((year) => {
      const monthMap = yearMap.get(year)!;
      const monthKeys = Array.from(monthMap.keys()).sort((a, b) =>
        isOldest ? Number(a) - Number(b) : Number(b) - Number(a)
      );

      let totalInYear = 0;
      const months = monthKeys.map((mKey) => {
        const mMemories = monthMap.get(mKey)!;
        totalInYear += mMemories.length;
        return {
          monthKey: mKey,
          monthName: `Tháng ${mKey}`,
          memories: mMemories,
        };
      });

      return {
        year,
        totalMemories: totalInYear,
        months,
      };
    });
  }, [filteredMemories, sortBy]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Đang tải dòng thời gian...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-5xl mx-auto">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline text-sm font-medium">Bản đồ</span>
          </button>

          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span>Dòng thời gian</span>
          </h1>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => router.push('/memories/new')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Tạo mới</span>
            </button>

            <button
              onClick={() => router.push('/profile')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <User className="h-4 w-4 text-primary" />
              <span className="max-w-[120px] truncate">{user?.name || user?.email}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 max-w-4xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Filter & Sort Controls Card */}
        {memories.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-700 mb-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                  Bộ lọc & Sắp xếp
                </span>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                    {activeFilterCount} đang áp dụng
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Filter count display */}
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Hiển thị <span className="font-bold text-slate-800 dark:text-slate-200">{filteredMemories.length}</span> / {memories.length} kỷ niệm
                </span>

                {/* Clear filters button */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Xóa bộ lọc</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter inputs grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Year Filter */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>Năm</span>
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <option value="">Tất cả các năm</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      Năm {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Folder className="h-3.5 w-3.5 text-primary" />
                  <span>Danh mục</span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary cursor-pointer"
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
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Smile className="h-3.5 w-3.5 text-primary" />
                  <span>Tâm trạng</span>
                </label>
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <option value="">Tất cả tâm trạng</option>
                  {MOODS.map((mood) => (
                    <option key={mood.value} value={mood.value}>
                      {mood.emoji} {mood.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
                  <span>Sắp xếp</span>
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <option value="date-newest">Ngày (Mới nhất trước)</option>
                  <option value="date-oldest">Ngày (Cũ nhất trước)</option>
                  <option value="title-asc">Tiêu đề (A-Z)</option>
                  <option value="title-desc">Tiêu đề (Z-A)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Empty States */}
        {memories.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Chưa có kỷ niệm nào
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6 text-sm">
              Hãy bắt đầu lưu giữ những kỷ niệm đáng nhớ đầu tiên của bạn để khám phá dòng thời gian tuyệt đẹp này.
            </p>
            <button
              onClick={() => router.push('/memories/new')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl shadow-sm transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Thêm kỷ niệm đầu tiên</span>
            </button>
          </div>
        ) : filteredMemories.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Không tìm thấy kỷ niệm nào phù hợp
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6 text-sm">
              Không có kỷ niệm nào khớp với tiêu chí bộ lọc đã chọn. Hãy thử thay đổi hoặc xóa bộ lọc.
            </p>
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors text-sm"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Xóa bộ lọc</span>
            </button>
          </div>
        ) : (
          /* Timeline Tree */
          <div className="space-y-12">
            {groupedMemories.map((yearGroup) => (
              <section key={yearGroup.year} className="relative">
                {/* Year Header Marker */}
                <div className="sticky top-16 z-20 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm py-2 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white shadow-md ring-4 ring-primary/20">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {yearGroup.year}
                      </h2>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {yearGroup.totalMemories} kỷ niệm
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline vertical line with month groups */}
                <div className="relative border-l-2 border-primary/20 dark:border-primary/30 ml-5 sm:ml-5 pl-6 sm:pl-8 space-y-8">
                  {yearGroup.months.map((monthGroup) => (
                    <div key={monthGroup.monthKey} className="space-y-4">
                      {/* Month subheader with connecting node */}
                      <div className="relative flex items-center gap-2 -ml-[31px] sm:-ml-[39px]">
                        <div className="w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-slate-50 dark:ring-slate-900" />
                        <span className="text-sm font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-md bg-primary/10 dark:bg-primary/20">
                          {monthGroup.monthName}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          ({monthGroup.memories.length})
                        </span>
                      </div>

                      {/* Memory Cards inside month */}
                      <div className="space-y-4 pt-1">
                        {monthGroup.memories.map((memory) => (
                          <article
                            key={memory.id}
                            onClick={() => router.push(`/memories/${memory.id}`)}
                            className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg border border-slate-200 dark:border-slate-700 hover:border-primary/40 dark:hover:border-primary/40 p-4 sm:p-5 transition-all duration-200 cursor-pointer"
                          >
                            {/* Connecting dot from timeline line to memory card */}
                            <div className="absolute -left-[31px] sm:-left-[39px] top-6 w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-800 border-4 border-primary group-hover:scale-125 group-hover:border-primary-hover transition-transform duration-200 ring-2 ring-slate-50 dark:ring-slate-900" />

                            <div className="flex flex-col gap-3">
                              {/* Card Header: Category & Mood */}
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {memory.category && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                                      <span>{memory.category.icon}</span>
                                      <span>{memory.category.name}</span>
                                    </span>
                                  )}

                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                                    <span>{MOOD_EMOJIS[memory.mood] || '😐'}</span>
                                    <span>{MOOD_LABELS[memory.mood] || memory.mood}</span>
                                  </span>
                                </div>

                                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                              </div>

                              {/* Title */}
                              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                                {memory.title}
                              </h3>

                              {/* Meta information: Date & Location */}
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5 text-primary" />
                                  <span>{formatDate(memory.memoryDate)}</span>
                                </span>

                                <span className="flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5 text-primary" />
                                  <span className="max-w-[200px] truncate">
                                    {memory.locationName || 'Không có tên địa điểm'}
                                  </span>
                                </span>
                              </div>

                              {/* Content description preview */}
                              {memory.content && (
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                                  {memory.content}
                                </p>
                              )}

                              {/* Image gallery thumbnails preview */}
                              {memory.images && memory.images.length > 0 && (
                                <div className="flex items-center gap-2 pt-1 overflow-hidden">
                                  {memory.images.slice(0, 4).map((img, idx) => (
                                    <div
                                      key={img.id || idx}
                                      className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0 border border-slate-200 dark:border-slate-700"
                                    >
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={img.imageUrl}
                                        alt={memory.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                      />
                                    </div>
                                  ))}
                                  {memory.images.length > 4 && (
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex-shrink-0">
                                      +{memory.images.length - 4}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
