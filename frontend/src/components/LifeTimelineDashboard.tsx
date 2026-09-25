'use client';

import { useState } from 'react';
import { Timeline, X, Settings, CheckCircle, AlertTriangle, Calendar, MapPin, Activity, Clock, Filter, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, BarChart3, Star } from 'lucide-react';

interface TimelineMemory {
  id: string;
  title: string;
  date: Date;
  location: string;
  category: string;
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'nostalgic';
  importance: number;
}

interface LifeTimelineDashboardProps {
  onCancel?: () => void;
  onFilterMemories?: (filter: any) => Promise<void>;
}

const DEFAULT_MEMORIES: TimelineMemory[] = [
  {
    id: 'mem-1',
    title: 'First Day at Work',
    date: new Date('2020-01-15'),
    location: 'Hanoi',
    category: 'Career',
    mood: 'excited',
    importance: 5,
  },
  {
    id: 'mem-2',
    title: 'Birthday Party',
    date: new Date('2020-06-20'),
    location: 'Da Nang',
    category: 'Personal',
    mood: 'happy',
    importance: 4,
  },
  {
    id: 'mem-3',
    title: 'Graduation',
    date: new Date('2019-07-10'),
    location: 'Ho Chi Minh City',
    category: 'Education',
    mood: 'happy',
    importance: 5,
  },
  {
    id: 'mem-4',
    title: 'Family Trip',
    date: new Date('2021-08-15'),
    location: 'Ha Long Bay',
    category: 'Travel',
    mood: 'happy',
    importance: 4,
  },
  {
    id: 'mem-5',
    title: 'Moving to New City',
    date: new Date('2022-03-01'),
    location: 'Can Tho',
    category: 'Life',
    mood: 'nostalgic',
    importance: 5,
  },
];

export default function LifeTimelineDashboard({ onCancel, onFilterMemories }: LifeTimelineDashboardProps) {
  const [memories, setMemories] = useState<TimelineMemory[]>(DEFAULT_MEMORIES);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2020);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const years = Array.from(new Set(memories.map(m => m.date.getFullYear()))).sort((a, b) => b - a);
  const filteredMemories = memories.filter(m => 
    m.date.getFullYear() === selectedYear && 
    (filterCategory === 'all' || m.category === filterCategory)
  );
  const categories = Array.from(new Set(memories.map(m => m.category)));

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy':
        return 'text-green-500';
      case 'sad':
        return 'text-blue-500';
      case 'neutral':
        return 'text-slate-500';
      case 'excited':
        return 'text-orange-500';
      case 'nostalgic':
        return 'text-purple-500';
      default:
        return 'text-slate-500';
    }
  };

  const getImportanceStars = (importance: number) => {
    return Array.from({ length: importance }, (_, i) => <Star key={i} className="h-3 w-3 text-amber-500" />);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <Timeline className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Dashboard timeline cuộc đời
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {filteredMemories.length} memories in {selectedYear}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Bộ lọc"
          >
            <Filter className="h-4 w-4 text-slate-500" />
          </button>
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Cài đặt"
          >
            <Settings className="h-4 w-4 text-slate-500" />
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Đóng"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt timeline
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show location
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show mood
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-scroll
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {showFilters && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Bộ lọc
          </h4>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Year Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSelectedYear(Math.max(...years) - 1)}
          disabled={selectedYear <= Math.min(...years)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4 text-slate-500" />
        </button>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-500" />
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {selectedYear}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setSelectedYear(Math.min(...years) + 1)}
          disabled={selectedYear >= Math.max(...years)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {memories.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">This Year</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {filteredMemories.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Locations</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {new Set(memories.map(m => m.location)).size}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Rating</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(memories.reduce((sum, m) => sum + m.importance, 0) / memories.length).toFixed(1)}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Timeline
        </h4>
        <div className="space-y-2">
          {filteredMemories.map((memory) => (
            <div
              key={memory.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Timeline className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {memory.title}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {getImportanceStars(memory.importance)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Date</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {memory.date.toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Location</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {memory.location}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Category</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {memory.category}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Mood</div>
                  <div className={`text-xs font-semibold ${getMoodColor(memory.mood)}`}>
                    {memory.mood}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <ZoomOut className="h-4 w-4" />
          Zoom Out
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <ZoomIn className="h-4 w-4" />
          Zoom In
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Dashboard timeline cuộc đời hiển thị tất cả kỷ niệm theo dòng thời gian với filtering, zoom, và statistics.
        </p>
      </div>
    </div>
  );
}