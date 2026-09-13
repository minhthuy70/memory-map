'use client';

import { useState } from 'react';
import { LineChart, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Users, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Image as ImageIcon, MapPin, Heart, Filter as FilterIcon } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  type: 'memory' | 'milestone' | 'birthday' | 'anniversary' | 'vacation';
  date: Date;
  participants: string[];
  location: string;
  imageUrl: string;
  likes: number;
  isFavorite: boolean;
}

interface TimelineYear {
  year: number;
  eventCount: number;
  firstEvent: Date;
  lastEvent: Date;
}

interface FamilyTimelineProps {
  onCancel?: () => void;
  onViewMemory?: (memoryId: string) => Promise<void>;
}

const DEFAULT_EVENTS: TimelineEvent[] = [
  {
    id: 'event-1',
    title: 'Family Vacation to Da Nang',
    type: 'vacation',
    date: new Date('2024-01-05'),
    participants: ['Dad', 'Mom', 'Tom', 'Emma'],
    location: 'Da Nang',
    imageUrl: '/vacation.jpg',
    likes: 15,
    isFavorite: true,
  },
  {
    id: 'event-2',
    title: "Tom's 8th Birthday",
    type: 'birthday',
    date: new Date('2024-01-20'),
    participants: ['Dad', 'Mom', 'Emma'],
    location: 'Home',
    imageUrl: '/birthday.jpg',
    likes: 23,
    isFavorite: true,
  },
  {
    id: 'event-3',
    title: 'Christmas Celebration',
    type: 'milestone',
    date: new Date('2023-12-25'),
    participants: ['Dad', 'Mom', 'Tom', 'Emma'],
    location: 'Home',
    imageUrl: '/christmas.jpg',
    likes: 18,
    isFavorite: false,
  },
  {
    id: 'event-4',
    title: 'First Day of School',
    type: 'milestone',
    date: new Date('2023-09-01'),
    participants: ['Tom', 'Emma'],
    location: 'School',
    imageUrl: '/school.jpg',
    likes: 12,
    isFavorite: false,
  },
  {
    id: 'event-5',
    title: 'Summer Trip',
    type: 'vacation',
    date: new Date('2023-07-15'),
    participants: ['Dad', 'Mom', 'Tom', 'Emma'],
    location: 'Ha Long',
    imageUrl: '/summer.jpg',
    likes: 20,
    isFavorite: true,
  },
];

const DEFAULT_YEARS: TimelineYear[] = [
  {
    year: 2024,
    eventCount: 2,
    firstEvent: new Date('2024-01-05'),
    lastEvent: new Date('2024-01-20'),
  },
  {
    year: 2023,
    eventCount: 3,
    firstEvent: new Date('2023-07-15'),
    lastEvent: new Date('2023-12-25'),
  },
];

export default function FamilyTimeline({ onCancel, onViewMemory }: FamilyTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>(DEFAULT_EVENTS);
  const [years, setYears] = useState<TimelineYear[]>(DEFAULT_YEARS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showFavorites, setShowFavorites] = useState(false);

  const totalEvents = events.length;
  const totalYears = years.length;
  const favoriteCount = events.filter(e => e.isFavorite).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'memory':
        return <ImageIcon className="h-4 w-4" />;
      case 'milestone':
        return <Activity className="h-4 w-4" />;
      case 'birthday':
        return <Heart className="h-4 w-4" />;
      case 'anniversary':
        return <Heart className="h-4 w-4" />;
      case 'vacation':
        return <MapPin className="h-4 w-4" />;
      default:
        return <ImageIcon className="h-4 w-4" />;
    }
  };

  const handleToggleFavorite = (eventId: string) => {
    setEvents(events.map(e => 
      e.id === eventId ? { ...e, isFavorite: !e.isFavorite } : e
    ));
  };

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 0.25, 0.5));
  };

  const filteredEvents = events.filter(e => {
    const yearMatch = e.date.getFullYear() === selectedYear;
    const memberMatch = selectedMember === 'all' || e.participants.includes(selectedMember);
    const typeMatch = selectedType === 'all' || e.type === selectedType;
    const favoriteMatch = !showFavorites || e.isFavorite;
    return yearMatch && memberMatch && typeMatch && favoriteMatch;
  });

  const allMembers = Array.from(new Set(events.flatMap(e => e.participants)));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <LineChart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Timeline gia đình
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalEvents} events, {totalYears} years
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
        <div className="mb-4 p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt family timeline
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show favorites only
              </span>
              <button
                type="button"
                onClick={() => setShowFavorites(!showFavorites)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  showFavorites ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    showFavorites ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-refresh
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Animate transitions
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Events</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalEvents}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Years</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalYears}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Favorites</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {favoriteCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Members</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {allMembers.length}
          </div>
        </div>
      </div>

      {/* Year Navigation */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedYear(Math.max(selectedYear - 1, Math.min(...years.map(y => y.year))))}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            disabled={selectedYear === Math.min(...years.map(y => y.year))}
          >
            <ChevronLeft className="h-4 w-4 text-slate-500" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {selectedYear}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({years.find(y => y.year === selectedYear)?.eventCount || 0} events)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedYear(Math.min(selectedYear + 1, Math.max(...years.map(y => y.year))))}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            disabled={selectedYear === Math.max(...years.map(y => y.year))}
          >
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 dark:text-slate-400">Zoom:</span>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            disabled={zoomLevel <= 0.5}
          >
            <ZoomOut className="h-4 w-4 text-slate-500" />
          </button>
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {zoomLevel.toFixed(2)}x
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            disabled={zoomLevel >= 2}
          >
            <ZoomIn className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Member
            </label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            >
              <option value="all">All Members</option>
              {allMembers.map(member => (
                <option key={member} value={member}>{member}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            >
              <option value="all">All Types</option>
              <option value="memory">Memory</option>
              <option value="milestone">Milestone</option>
              <option value="birthday">Birthday</option>
              <option value="anniversary">Anniversary</option>
              <option value="vacation">Vacation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Timeline - {selectedYear}
        </h4>
        <div className="space-y-2">
          {filteredEvents.length === 0 ? (
            <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No events found for this year
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'left' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${event.isFavorite ? 'text-red-500' : 'text-slate-500'}`}>
                      {getTypeIcon(event.type)}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {event.title}
                      </span>
                      <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                        {event.type}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(event.id)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                  >
                    <Heart className={`h-4 w-4 ${event.isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-500'}`} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Date</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {event.date.toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Location</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {event.location}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Likes</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {event.likes}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {event.participants.map((participant) => (
                    <span
                      key={participant}
                      className="px-2 py-1 text-[10px] rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                    >
                      {participant}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Year Overview */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Year Overview
        </h4>
        <div className="space-y-2">
          {years.map((year) => (
            <div
              key={year.year}
              className={`p-4 rounded-lg border-2 ${
                year.year === selectedYear
                  ? 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {year.year}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {year.eventCount} events
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">First Event</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {year.firstEvent.toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Last Event</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {year.lastEvent.toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-lg">
        <p className="text-[10px] text-teal-700 dark:text-teal-400">
          <strong>Lưu ý:</strong> Timeline gia đình hiển thị kỷ niệm theo thời gian của cả gia đình với year navigation, zoom controls, member/type filtering, favorite toggling, và year overview.
        </p>
      </div>
    </div>
  );
}