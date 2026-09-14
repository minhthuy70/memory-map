'use client';

import { useState } from 'react';
import { Calendar, X, Snowflake, Sun, Flower, Leaf, Ghost, Heart, Star, Gift, Clock, Check, Lock, Unlock, Zap, TrendingUp, Award, Trophy, Flame, Sparkles, Eye, EyeOff, Filter, ChevronDown, ChevronUp, RefreshCw, MapPin, Calendar as CalendarIcon, Target, Users, Share2, Download } from 'lucide-react';

interface SeasonalEventsProps {
  onCancel?: () => void;
}

interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  icon: string;
  season: 'tet' | 'christmas' | 'summer' | 'spring' | 'halloween' | 'valentine';
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  rewards: string[];
  tasks: EventTask[];
  progress: number;
  maxProgress: number;
}

interface EventTask {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  reward: string;
}

export default function SeasonalEvents({ onCancel }: SeasonalEventsProps) {
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rewards' | 'progress'>('date');

  const [events, setEvents] = useState<SeasonalEvent[]>([
    {
      id: '1',
      name: 'Tet Nguyen Dan 2026',
      description: 'Celebrate Vietnamese New Year with special memories',
      icon: 'flower',
      season: 'tet',
      startDate: '2026-01-28',
      endDate: '2026-02-05',
      status: 'completed',
      rewards: ['500 coins', 'Tet badge', 'Red envelope sticker pack'],
      tasks: [
        { id: '1', name: 'Create 10 Tet memories', description: 'Share your Tet celebrations', completed: true, reward: '100 coins' },
        { id: '2', name: 'Upload family photos', description: 'Upload 5 family reunion photos', completed: true, reward: 'Tet badge' },
        { id: '3', name: 'Share with family', description: 'Share memories with 3 family members', completed: true, reward: 'Red envelope sticker pack' },
      ],
      progress: 3,
      maxProgress: 3,
    },
    {
      id: '2',
      name: 'Christmas 2025',
      description: 'Capture holiday memories and festivities',
      icon: 'snowflake',
      season: 'christmas',
      startDate: '2025-12-20',
      endDate: '2025-12-31',
      status: 'completed',
      rewards: ['300 coins', 'Christmas badge', 'Winter theme'],
      tasks: [
        { id: '1', name: 'Create 5 Christmas memories', description: 'Share your holiday moments', completed: true, reward: '100 coins' },
        { id: '2', name: 'Upload decoration photos', description: 'Upload 3 decoration photos', completed: true, reward: 'Christmas badge' },
        { id: '3', name: 'Winter location', description: 'Add memories from cold locations', completed: true, reward: 'Winter theme' },
      ],
      progress: 3,
      maxProgress: 3,
    },
    {
      id: '3',
      name: 'Summer Adventures 2026',
      description: 'Document your summer adventures',
      icon: 'sun',
      season: 'summer',
      startDate: '2026-06-01',
      endDate: '2026-08-31',
      status: 'active',
      rewards: ['1000 coins', 'Summer badge', 'Beach sticker pack', 'Adventure theme'],
      tasks: [
        { id: '1', name: 'Create 20 summer memories', description: 'Document your summer activities', completed: true, reward: '200 coins' },
        { id: '2', name: 'Visit 5 new locations', description: 'Explore new places', completed: true, reward: 'Summer badge' },
        { id: '3', 'name': 'Upload 50 photos', description: 'Capture summer moments', completed: false, reward: 'Beach sticker pack' },
        { id: '4', name: 'Travel to 3 countries', description: 'International summer travel', completed: false, reward: 'Adventure theme' },
      ],
      progress: 2,
      maxProgress: 4,
    },
    {
      id: '4',
      name: 'Spring Blossoms 2026',
      description: 'Celebrate the beauty of spring',
      icon: 'flower',
      season: 'spring',
      startDate: '2026-03-20',
      endDate: '2026-04-30',
      status: 'upcoming',
      rewards: ['400 coins', 'Spring badge', 'Flower sticker pack'],
      tasks: [
        { id: '1', name: 'Create 10 spring memories', description: 'Capture spring moments', completed: false, reward: '100 coins' },
        { id: '2', name: 'Upload flower photos', description: 'Upload 10 flower photos', completed: false, reward: 'Spring badge' },
        { id: '3', name: 'Nature locations', description: 'Add memories from 5 nature spots', completed: false, reward: 'Flower sticker pack' },
      ],
      progress: 0,
      maxProgress: 3,
    },
    {
      id: '5',
      name: 'Halloween Spooktacular',
      description: 'Spooky memories and festivities',
      icon: 'ghost',
      season: 'halloween',
      startDate: '2026-10-25',
      endDate: '2026-10-31',
      status: 'upcoming',
      rewards: ['500 coins', 'Halloween badge', 'Spooky sticker pack'],
      tasks: [
        { id: '1', name: 'Create 5 Halloween memories', description: 'Share your Halloween celebrations', completed: false, reward: '100 coins' },
        { id: '2', name: 'Costume photos', description: 'Upload 3 costume photos', completed: false, reward: 'Halloween badge' },
        { id: '3', name: 'Spooky locations', description: 'Add memories from 3 spooky places', completed: false, reward: 'Spooky sticker pack' },
      ],
      progress: 0,
      maxProgress: 3,
    },
    {
      id: '6',
      name: 'Valentine\'s Day Romance',
      description: 'Celebrate love and relationships',
      icon: 'heart',
      season: 'valentine',
      startDate: '2026-02-10',
      endDate: '2026-02-15',
      status: 'upcoming',
      rewards: ['300 coins', 'Love badge', 'Romantic sticker pack'],
      tasks: [
        { id: '1', name: 'Create 5 romantic memories', description: 'Share special moments', completed: false, reward: '100 coins' },
        { id: '2', name: 'Couple photos', description: 'Upload 5 couple photos', completed: false, reward: 'Love badge' },
        { id: '3', name 'Share with partner', description: 'Share memories with your partner', completed: false, reward: 'Romantic sticker pack' },
      ],
      progress: 0,
      maxProgress: 3,
    },
  ]);

  const handleTaskComplete = (eventId: string, taskId: string) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        const updatedTasks = event.tasks.map(task =>
          task.id === taskId ? { ...task, completed: true } : task
        );
        const completedCount = updatedTasks.filter(t => t.completed).length;
        return {
          ...event,
          tasks: updatedTasks,
          progress: completedCount,
        };
      }
      return event;
    }));
  };

  const filteredEvents = events.filter(event => {
    if (!showCompleted && event.status === 'completed') return false;
    if (selectedSeason === 'all') return true;
    return event.season === selectedSeason;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'date') return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    if (sortBy === 'rewards') return b.rewards.length - a.rewards.length;
    if (sortBy === 'progress') return (b.progress / b.maxProgress) - (a.progress / a.maxProgress);
    return 0;
  });

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'snowflake': return <Snowflake className="h-6 w-6" />;
      case 'sun': return <Sun className="h-6 w-6" />;
      case 'flower': return <Flower className="h-6 w-6" />;
      case 'leaf': return <Leaf className="h-6 w-6" />;
      case 'ghost': return <Ghost className="h-6 w-6" />;
      case 'heart': return <Heart className="h-6 w-6" />;
      default: return <Star className="h-6 w-6" />;
    }
  };

  const getSeasonColor = (season: string) => {
    switch (season) {
      case 'tet': return 'from-red-500 to-red-600';
      case 'christmas': return 'from-red-500 to-green-500';
      case 'summer': return 'from-yellow-500 to-orange-500';
      case 'spring': return 'from-pink-500 to-green-500';
      case 'halloween': return 'from-orange-500 to-purple-500';
      case 'valentine': return 'from-pink-500 to-red-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'upcoming': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Seasonal Events
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Special events throughout the year
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title="Đóng"
        >
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowCompleted(!showCompleted)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showCompleted
                ? 'bg-slate-500 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {showCompleted ? <Eye className="h-3 w-3 inline mr-1" /> : <EyeOff className="h-3 w-3 inline mr-1" />}
            {showCompleted ? 'Show Completed' : 'Hide Completed'}
          </button>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Seasons</option>
            <option value="tet">Tet</option>
            <option value="christmas">Christmas</option>
            <option value="summer">Summer</option>
            <option value="spring">Spring</option>
            <option value="halloween">Halloween</option>
            <option value="valentine">Valentine</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="date">By Date</option>
            <option value="rewards">By Rewards</option>
            <option value="progress">By Progress</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                event.status === 'active'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600'
                  : event.status === 'completed'
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
                  : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-3 rounded-full bg-gradient-to-br ${getSeasonColor(event.season)} text-white`}>
                  {getIcon(event.icon)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                      {event.name}
                    </h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <CalendarIcon className="h-3 w-3" />
                    <span>{event.startDate} - {event.endDate}</span>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Progress</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {event.progress}/{event.maxProgress}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${event.status === 'completed' ? 'bg-blue-500' : event.status === 'active' ? 'bg-green-500' : 'bg-slate-500'}`}
                    style={{ width: `${(event.progress / event.maxProgress) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mb-3">
                <h5 className="text-xs font-semibold text-slate-900 dark:text-white mb-2">Rewards</h5>
                <div className="flex flex-wrap gap-1">
                  {event.rewards.map((reward, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full"
                    >
                      {reward}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-slate-900 dark:text-white mb-2">Tasks</h5>
                <div className="space-y-2">
                  {event.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleTaskComplete(event.id, task.id)}
                          disabled={task.completed || event.status !== 'active'}
                          className={`p-1 rounded ${
                            task.completed
                              ? 'bg-green-500 text-white'
                              : event.status === 'active'
                              ? 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                          }`}
                        >
                          {task.completed ? <Check className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                        </button>
                        <div>
                          <p className="text-xs font-medium text-slate-900 dark:text-white">
                            {task.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {task.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-purple-600 dark:text-purple-400">
                        {task.reward}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-4 w-4 text-red-600 dark:text-red-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Event Calendar
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Tet Nguyen Dan: Late January - Early February</li>
            <li>• Valentine's Day: February 10-15</li>
            <li>• Spring Blossoms: March 20 - April 30</li>
            <li>• Summer Adventures: June 1 - August 31</li>
            <li>• Halloween: October 25-31</li>
            <li>• Christmas: December 20-31</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
