'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  MapPin,
  Smile,
  User,
  Folder,
  BarChart3,
  Award,
  Sparkles,
  Plus,
  Compass,
} from 'lucide-react';
import { memoriesApi, Statistics } from '@/lib/memories-api';
import { categoriesApi, Category } from '@/lib/categories-api';
import { useAuthStore } from '@/store/auth-store';
import ThemeToggle from '@/components/ThemeToggle';

const MOOD_META: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  HAPPY: { label: 'Vui vẻ', emoji: '😊', color: '#F59E0B', bg: 'bg-amber-500' },
  LOVE: { label: 'Yêu thương', emoji: '❤️', color: '#EF4444', bg: 'bg-rose-500' },
  EXCITED: { label: 'Hào hứng', emoji: '🤩', color: '#EC4899', bg: 'bg-pink-500' },
  PEACEFUL: { label: 'Bình yên', emoji: '😌', color: '#10B981', bg: 'bg-emerald-500' },
  NOSTALGIC: { label: 'Hoài niệm', emoji: '🥹', color: '#8B5CF6', bg: 'bg-purple-500' },
  SAD: { label: 'Buồn', emoji: '😢', color: '#3B82F6', bg: 'bg-blue-500' },
  TIRED: { label: 'Mệt mỏi', emoji: '😴', color: '#64748B', bg: 'bg-slate-500' },
  ANGRY: { label: 'Tức giận', emoji: '😡', color: '#F97316', bg: 'bg-orange-500' },
  NEUTRAL: { label: 'Bình thường', emoji: '😐', color: '#94A3B8', bg: 'bg-slate-400' },
};

const CATEGORY_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#14B8A6', // Teal
];

export default function StatisticsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [statsData, categoriesData] = await Promise.all([
        memoriesApi.getStatistics(),
        categoriesApi.getAll(),
      ]);
      setStatistics(statsData);
      setCategories(categoriesData);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Không thể tải dữ liệu thống kê');
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

  // Create a name-to-category lookup map
  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((c) => map.set(c.name, c));
    return map;
  }, [categories]);

  // Sort mood distribution by count descending
  const sortedMoods = useMemo(() => {
    if (!statistics?.moodDistribution) return [];
    return Object.entries(statistics.moodDistribution)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1]);
  }, [statistics]);

  // Sort category distribution by count descending
  const sortedCategories = useMemo(() => {
    if (!statistics?.categoryDistribution) return [];
    return Object.entries(statistics.categoryDistribution)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1]);
  }, [statistics]);

  // Monthly activity data
  const monthlyActivityEntries = useMemo(() => {
    if (!statistics?.monthlyActivity) return [];
    return Object.entries(statistics.monthlyActivity);
  }, [statistics]);

  const maxMonthCount = useMemo(() => {
    if (!monthlyActivityEntries.length) return 1;
    return Math.max(...monthlyActivityEntries.map(([, count]) => count), 1);
  }, [monthlyActivityEntries]);

  const formatMonthLabel = (monthStr: string) => {
    const d = new Date(monthStr);
    if (!isNaN(d.getTime())) {
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      return `T${m < 10 ? '0' + m : m}/${y}`;
    }
    return monthStr;
  };

  const formatFullMonthLabel = (monthStr: string) => {
    const d = new Date(monthStr);
    if (!isNaN(d.getTime())) {
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      return `Tháng ${m < 10 ? '0' + m : m}, ${y}`;
    }
    return monthStr;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Đang tải dữ liệu thống kê...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
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
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span>Thống kê kỷ niệm</span>
          </h1>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <button
              onClick={() => router.push('/profile')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <User className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline max-w-[120px] truncate">
                {user?.name || user?.email}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Empty State */}
        {statistics && statistics.totalMemories === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-700 shadow-sm max-w-lg mx-auto my-12">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Chưa có dữ liệu thống kê
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              Bạn chưa tạo kỷ niệm nào. Hãy bắt đầu lưu giữ những khoảnh khắc đáng nhớ để theo dõi các chỉ số trực quan!
            </p>
            <button
              onClick={() => router.push('/memories/new')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl shadow-sm transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Thêm kỷ niệm đầu tiên</span>
            </button>
          </div>
        ) : statistics ? (
          <div className="space-y-6">
            {/* 5.1 & 5.2 Overview Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Memories */}
              <div
                onClick={() => router.push('/dashboard')}
                className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-5 hover:shadow-md hover:border-primary/40 transition-all cursor-pointer"
                title="Bấm để xem tất cả trên bản đồ"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Tổng kỷ niệm
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {statistics.totalMemories}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">kỷ niệm</span>
                </div>
              </div>

              {/* Memories This Year */}
              <div
                onClick={() => router.push('/timeline')}
                className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-5 hover:shadow-md hover:border-primary/40 transition-all cursor-pointer"
                title="Bấm để xem dòng thời gian"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Năm nay ({new Date().getFullYear()})
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {statistics.memoriesThisYear}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">trong năm</span>
                </div>
              </div>

              {/* Unique Locations */}
              <div
                onClick={() => router.push('/dashboard')}
                className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-5 hover:shadow-md hover:border-primary/40 transition-all cursor-pointer"
                title="Bấm để xem các địa điểm trên bản đồ"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Vị trí duy nhất
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {statistics.uniqueLocations}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">địa điểm</span>
                </div>
              </div>

              {/* Unique Categories */}
              <div
                onClick={() => router.push('/dashboard')}
                className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-5 hover:shadow-md hover:border-primary/40 transition-all cursor-pointer"
                title="Bấm để khám phá danh mục"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Danh mục duy nhất
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Folder className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {statistics.uniqueCategories}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">danh mục</span>
                </div>
              </div>
            </div>

            {/* Highlights row: Most common mood & Most used category */}
            {(statistics.mostCommonMood || statistics.mostUsedCategory) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {statistics.mostCommonMood && (
                  <div
                    onClick={() =>
                      router.push(
                        `/dashboard?mood=${encodeURIComponent(
                          statistics.mostCommonMood,
                        )}`,
                      )
                    }
                    className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-amber-300 transition-all group"
                    title="Bấm để lọc kỷ niệm theo tâm trạng này trên bản đồ"
                  >
                    <div className="text-3xl p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      {MOOD_META[statistics.mostCommonMood]?.emoji || '😊'}
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                        <span>Tâm trạng phổ biến nhất</span>
                        <span className="text-[10px] bg-amber-200/60 dark:bg-amber-900/40 px-1.5 py-0.5 rounded font-medium">
                          Bấm để lọc
                        </span>
                      </div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {MOOD_META[statistics.mostCommonMood]?.label || statistics.mostCommonMood}
                      </div>
                    </div>
                  </div>
                )}

                {statistics.mostUsedCategory && (
                  <div
                    onClick={() => {
                      const cat = categoryMap.get(statistics.mostUsedCategory);
                      if (cat) {
                        router.push(
                          `/dashboard?category=${encodeURIComponent(cat.id)}`,
                        );
                      } else {
                        router.push('/dashboard');
                      }
                    }}
                    className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-200 dark:border-blue-800/40 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group"
                    title="Bấm để lọc kỷ niệm theo danh mục này trên bản đồ"
                  >
                    <div className="text-3xl p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      {categoryMap.get(statistics.mostUsedCategory)?.icon || '📁'}
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                        <span>Danh mục được dùng nhiều nhất</span>
                        <span className="text-[10px] bg-blue-200/60 dark:bg-blue-900/40 px-1.5 py-0.5 rounded font-medium">
                          Bấm để lọc
                        </span>
                      </div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {statistics.mostUsedCategory}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Main Charts: Mood Distribution & Category Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mood Distribution Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Smile className="h-5 w-5 text-primary" />
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      Phân phối tâm trạng
                    </h2>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {sortedMoods.length} cảm xúc
                  </span>
                </div>

                {sortedMoods.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    Chưa có dữ liệu tâm trạng
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {sortedMoods.map(([mood, count]) => {
                      const percentage =
                        statistics.totalMemories > 0
                          ? (count / statistics.totalMemories) * 100
                          : 0;
                      const meta = MOOD_META[mood] || {
                        label: mood,
                        emoji: '😐',
                        color: '#64748B',
                        bg: 'bg-slate-500',
                      };

                      return (
                        <div
                          key={mood}
                          onClick={() =>
                            router.push(
                              `/dashboard?mood=${encodeURIComponent(mood)}`,
                            )
                          }
                          className="space-y-1.5 p-1.5 -mx-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition-colors group"
                          title={`Bấm để lọc kỷ niệm theo ${meta.label}`}
                        >
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 group-hover:text-primary transition-colors">
                              <span className="text-base">{meta.emoji}</span>
                              <span>{meta.label}</span>
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {count}{' '}
                              <span className="text-xs text-slate-500 font-normal">
                                ({percentage.toFixed(1)}%)
                              </span>
                            </span>
                          </div>
                          {/* Progress Bar with Color-coding */}
                          <div className="w-full bg-slate-100 dark:bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: meta.color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Category Distribution Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-primary" />
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      Phân phối danh mục
                    </h2>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {sortedCategories.length} danh mục
                  </span>
                </div>

                {sortedCategories.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    Chưa có dữ liệu danh mục
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {sortedCategories.map(([categoryName, count], index) => {
                      const percentage =
                        statistics.totalMemories > 0
                          ? (count / statistics.totalMemories) * 100
                          : 0;
                      const catInfo = categoryMap.get(categoryName);
                      const barColor = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

                      return (
                        <div
                          key={categoryName}
                          onClick={() => {
                            if (catInfo) {
                              router.push(
                                `/dashboard?category=${encodeURIComponent(
                                  catInfo.id,
                                )}`,
                              );
                            } else {
                              router.push('/dashboard');
                            }
                          }}
                          className="space-y-1.5 p-1.5 -mx-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition-colors group"
                          title={`Bấm để lọc kỷ niệm theo ${categoryName}`}
                        >
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 truncate group-hover:text-primary transition-colors">
                              <span className="text-base">{catInfo?.icon || '📁'}</span>
                              <span className="truncate">{categoryName}</span>
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 flex-shrink-0">
                              {count}{' '}
                              <span className="text-xs text-slate-500 font-normal">
                                ({percentage.toFixed(1)}%)
                              </span>
                            </span>
                          </div>
                          {/* Progress Bar with Color-coding */}
                          <div className="w-full bg-slate-100 dark:bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: barColor,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Monthly Activity Chart (12 Months) */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Hoạt động hàng tháng (12 tháng gần nhất)
                  </h2>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Đỉnh điểm: {maxMonthCount} kỷ niệm/tháng
                </span>
              </div>

              {/* Vertical Column Bars Visualization */}
              <div className="relative pt-6 pb-2 mb-6 border-b border-slate-100 dark:border-slate-700/60">
                <div className="h-40 flex items-end justify-between gap-1 sm:gap-2">
                  {monthlyActivityEntries.map(([month, count]) => {
                    const heightPercent = maxMonthCount > 0 ? (count / maxMonthCount) * 100 : 0;
                    return (
                      <div
                        key={month}
                        className="group relative flex-1 h-full flex flex-col justify-end items-center"
                      >
                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 px-2 py-0.5 bg-slate-900 text-white text-[11px] rounded shadow-md pointer-events-none transition-opacity whitespace-nowrap z-10">
                          {formatFullMonthLabel(month)}: {count} kỷ niệm
                        </div>

                        {/* Column bar */}
                        <div
                          className="w-full max-w-[36px] bg-primary/20 group-hover:bg-primary/30 rounded-t-lg transition-all relative overflow-hidden flex items-end"
                          style={{ height: `${Math.max(heightPercent, count > 0 ? 8 : 2)}%` }}
                        >
                          <div
                            className="w-full bg-primary rounded-t-lg transition-all"
                            style={{ height: '100%' }}
                          />
                        </div>

                        {/* Month Label */}
                        <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-2 truncate w-full text-center">
                          {formatMonthLabel(month)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Horizontal Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {monthlyActivityEntries.map(([month, count]) => {
                  const percentage = maxMonthCount > 0 ? (count / maxMonthCount) * 100 : 0;
                  return (
                    <div
                      key={month}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {formatFullMonthLabel(month)}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {count}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
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
      </main>
    </div>
  );
}
