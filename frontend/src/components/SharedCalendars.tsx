'use client';

import { useState } from 'react';
import { Calendar, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Plus, Users, Bell, MapPin, Cake, Plane, Gift, Heart, Clock as ClockIcon } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'birthday' | 'anniversary' | 'vacation' | 'family_event' | 'reminder';
  date: Date;
  endDate: Date | null;
  location: string;
  description: string;
  participants: string[];
  reminder: boolean;
  reminderTime: number;
  color: string;
}

interface SharedCalendar {
  id: string;
  name: string;
  members: string[];
  eventCount: number;
  color: string;
}

interface SharedCalendarsProps {
  onCancel?: () => void;
  onCreateEvent?: () => Promise<void>;
}

const DEFAULT_EVENTS: CalendarEvent[] = [
  {
    id: 'event-1',
    title: "Tom's Birthday",
    type: 'birthday',
    date: new Date('2024-01-20'),
    endDate: null,
    location: 'Home',
    description: 'Tom turns 9 years old!',
    participants: ['Dad', 'Mom', 'Emma'],
    reminder: true,
    reminderTime: 60,
    color: 'bg-pink-500',
  },
  {
    id: 'event-2',
    title: 'Family Vacation',
    type: 'vacation',
    date: new Date('2024-02-15'),
    endDate: new Date('2024-02-20'),
    location: 'Da Nang',
    description: 'Beach trip to Da Nang',
    participants: ['Dad', 'Mom', 'Tom', 'Emma'],
    reminder: true,
    reminderTime: 1440,
    color: 'bg-blue-500',
  },
  {
    id: 'event-3',
    title: 'Parents Anniversary',
    type: 'anniversary',
    date: new Date('2024-03-10'),
    endDate: null,
    location: 'Restaurant',
    description: '10th anniversary celebration',
    participants: ['Dad', 'Mom'],
    reminder: true,
    reminderTime: 1440,
    color: 'bg-red-500',
  },
];

const DEFAULT_CALENDARS: SharedCalendar[] = [
  {
    id: 'cal-1',
    name: 'Family Calendar',
    members: ['Dad', 'Mom', 'Tom', 'Emma'],
    eventCount: 12,
    color: 'bg-green-500',
  },
  {
    id: 'cal-2',
    name: 'Vacation Planning',
    members: ['Dad', 'Mom'],
    eventCount: 5,
    color: 'bg-blue-500',
  },
];

export default function SharedCalendars({ onCancel, onCreateEvent }: SharedCalendarsProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(DEFAULT_EVENTS);
  const [calendars, setCalendars] = useState<SharedCalendar[]>(DEFAULT_CALENDARS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState('cal-1');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('month');
  const [syncEnabled, setSyncEnabled] = useState(true);

  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.date >= new Date()).length;
  const totalCalendars = calendars.length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'birthday':
        return <BirthdayCake className="h-4 w-4" />;
      case 'anniversary':
        return <Heart className="h-4 w-4" />;
      case 'vacation':
        return <Plane className="h-4 w-4" />;
      case 'family_event':
        return <Users className="h-4 w-4" />;
      case 'reminder':
        return <Bell className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const handleToggleReminder = (eventId: string) => {
    setEvents(events.map(e => 
      e.id === eventId ? { ...e, reminder: !e.reminder } : e
    ));
  };

  const filteredEvents = selectedType === 'all'
    ? events
    : events.filter(e => e.type === selectedType);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Lịch chia sẻ
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalEvents} events, {upcomingEvents} upcoming
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
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt shared calendars
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Calendar sync
              </span>
              <button
                type="button"
                onClick={() => setSyncEnabled(!syncEnabled)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  syncEnabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    syncEnabled ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Default reminders
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">1 hour before</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Event notifications
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
            <Calendar className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Events</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalEvents}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <ClockIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Upcoming</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {upcomingEvents}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Calendars</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalCalendars}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Reminders</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {events.filter(e => e.reminder).length}
          </div>
        </div>
      </div>

      {/* Calendar Selection */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
          Select Calendar
        </label>
        <select
          value={selectedCalendar}
          onChange={(e) => setSelectedCalendar(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
        >
          {calendars.map(c => (
            <option key={c.id} value={c.id}>{c.name} ({c.eventCount} events)</option>
          ))}
        </select>
      </div>

      {/* View Mode */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode('day')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              viewMode === 'day'
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Day
          </button>
          <button
            type="button"
            onClick={() => setViewMode('week')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              viewMode === 'week'
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Week
          </button>
          <button
            type="button"
            onClick={() => setViewMode('month')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              viewMode === 'month'
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Type Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedType('all')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'all'
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('birthday')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'birthday'
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Birthday
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('vacation')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'vacation'
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Vacation
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('anniversary')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'anniversary'
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Anniversary
          </button>
        </div>
      </div>

      {/* Events */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
            Events
          </h4>
          <button
            type="button"
            onClick={onCreateEvent}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Plus className="h-3 w-3" />
            Add Event
          </button>
        </div>
        <div className="space-y-2">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`p-4 rounded-lg border-2 ${event.color} bg-opacity-10 dark:bg-opacity-20 border-opacity-30`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${event.color}`}>
                    {getTypeIcon(event.type)}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {event.title}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {event.type.replace('_', ' ')}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleReminder(event.id)}
                  className={`p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded`}
                  title={event.reminder ? 'Disable reminder' : 'Enable reminder'}
                >
                  <Bell className={`h-4 w-4 ${event.reminder ? 'text-green-500' : 'text-slate-500'}`} />
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {event.description}
              </p>

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
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Participants</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {event.participants.length}
                  </div>
                </div>
              </div>

              {event.reminder && (
                <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                  <Bell className="h-3 w-3" />
                  <span>Reminder: {event.reminderTime} minutes before</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Shared Calendars */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Shared Calendars
        </h4>
        <div className="space-y-2">
          {calendars.map((calendar) => (
            <div
              key={calendar.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${calendar.color}`} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {calendar.name}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {calendar.eventCount} events
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {calendar.members.map((member) => (
                  <span
                    key={member}
                    className="px-2 py-1 text-[10px] rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-[10px] text-green-700 dark:text-green-400">
          <strong>Lưu ý:</strong> Lịch chia sẻ cho phép gia đình tạo và chia sẻ lịch chung cho các sự kiện kỷ niệm với event management, shared calendars, reminders, participant tracking, và multiple view modes.
        </p>
      </div>
    </div>
  );
}