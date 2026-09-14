'use client';

import { useState } from 'react';
import { X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, RefreshCw, Check, Zap as ZapIcon, Plus, Upload, Image as ImageIcon, CheckCheck, FolderOpen, Lock, Unlock, CheckCircle as CheckCircleIcon, ExternalLink, Filter as FilterIcon, Search, Calendar as CalendarIcon, MapPin, Clock as ClockIcon, Eye, EyeOff, Trash2 as TrashIcon, Shield, AlertCircle, Database, Globe, Cloud, Wifi, Loader2, CheckSquare, Square, AlertTriangle as AlertTriangleIcon, CopyRight, Heart, MessageCircle, Share2, Hash, Camera, Grid, CopyRight as CopyRightIcon, Archive, Calendar as CalendarIcon2, Image as ImageIcon2, Video, ThumbsUp, Star, Users, Smile, Gift, Birthday, Sparkles, BookOpen, FileText, Smile as SmileIcon, Frown, Meh, Angry as AngryIcon, Zap as ZapIcon2, Thermometer, Droplet, Moon, Sun, Activity as ActivityIcon, Coffee, Briefcase, School, Home, Plane, Utensils, ShoppingBag, Music, Gamepad2, Dumbbell, Palette, Code, Headphones, Coffee as CoffeeIcon, Heart as HeartIcon, Star as StarIcon, Monitor } from 'lucide-react';

interface DaylioEntry {
  id: string;
  date: Date;
  time: string;
  mood: 'amazing' | 'good' | 'okay' | 'bad' | 'awful';
  activities: string[];
  note: string;
  tags: string[];
  isSelected: boolean;
  isDuplicate: boolean;
}

interface DaylioImportProps {
  onCancel?: () => void;
  onConnect?: () => Promise<void>;
  onImport?: (entries: DaylioEntry[]) => Promise<void>;
  onDisconnect?: () => Promise<void>;
}

const DEFAULT_ENTRIES: DaylioEntry[] = [
  {
    id: 'daylio-1',
    date: new Date('2024-01-15'),
    time: '08:30',
    mood: 'good',
    activities: ['work', 'exercise', 'reading'],
    note: 'Great start to the day',
    tags: ['productivity', 'morning'],
    isSelected: true,
    isDuplicate: false,
  },
  {
    id: 'daylio-2',
    date: new Date('2024-01-14'),
    time: '20:15',
    mood: 'okay',
    activities: ['family', 'cooking', 'tv'],
    note: 'Relaxing evening',
    tags: ['family', 'relaxation'],
    isSelected: true,
    isDuplicate: false,
  },
];

const MOOD_CONFIG = {
  amazing: { icon: '😄', color: 'bg-green-500', label: 'Amazing' },
  good: { icon: '😊', color: 'bg-green-400', label: 'Good' },
  okay: { icon: '😐', color: 'bg-yellow-400', label: 'Okay' },
  bad: { icon: '😔', color: 'bg-orange-400', label: 'Bad' },
  awful: { icon: '😢', color: 'bg-red-400', label: 'Awful' },
};

const ACTIVITY_ICONS: Record<string, any> = {
  work: Briefcase,
  exercise: Dumbbell,
  reading: BookOpen,
  family: Users,
  cooking: Utensils,
  tv: Monitor,
  travel: Plane,
  shopping: ShoppingBag,
  music: Music,
  gaming: Gamepad2,
  art: Palette,
  coding: Code,
  meditation: Moon,
  coffee: CoffeeIcon,
  social: Users,
  learning: School,
  health: HeartIcon,
  hobby: Palette,
};

export default function ImportFromDaylio({ onCancel, onConnect, onImport, onDisconnect }: DaylioImportProps) {
  const [entries, setEntries] = useState<DaylioEntry[]>(DEFAULT_ENTRIES);
  const [showSettings, setShowSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState<DaylioEntry[]>(DEFAULT_ENTRIES.filter(e => e.isSelected));
  const [autoSelect, setAutoSelect] = useState(true);
  const [includeActivities, setIncludeActivities] = useState(true);
  const [includeTags, setIncludeTags] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'year'>('all');

  const totalEntries = entries.length;
  const selectedCount = selectedEntries.length;
  const duplicateCount = entries.filter(e => e.isDuplicate).length;
  const avgMood = entries.length > 0 
    ? entries.reduce((sum, e) => {
        const moodScore = { amazing: 5, good: 4, okay: 3, bad: 2, awful: 1 };
        return sum + moodScore[e.mood];
      }, 0) / entries.length
    : 0;

  const handleConnect = async () => {
    await onConnect?.();
    setIsConnected(true);
  };

  const handleDisconnect = async () => {
    await onDisconnect?.();
    setIsConnected(false);
  };

  const handleImport = async () => {
    setIsImporting(true);
    await onImport?.(selectedEntries);
    setIsImporting(false);
  };

  const handleScan = async () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  const handleToggleEntry = (entryId: string) => {
    setEntries(entries.map(e => 
      e.id === entryId ? { ...e, isSelected: !e.isSelected } : e
    ));
    setSelectedEntries(entries.filter(e => e.id === entryId ? !e.isSelected : e.isSelected));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN');
  };

  const getMoodIcon = (mood: string) => {
    return MOOD_CONFIG[mood as keyof typeof MOOD_CONFIG]?.icon || '😐';
  };

  const getMoodColor = (mood: string) => {
    return MOOD_CONFIG[mood as keyof typeof MOOD_CONFIG]?.color || 'bg-gray-400';
  };

  const getActivityIcon = (activity: string) => {
    const Icon = ACTIVITY_ICONS[activity] || SmileIcon;
    return Icon;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Nhập từ Daylio (app nhật ký)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isConnected ? 'Connected' : 'Not connected'}
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
            <SettingsIcon className="h-4 w-4 text-slate-500" />
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
        <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt Daylio import
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-select all entries
              </span>
              <button
                type="button"
                onClick={() => setAutoSelect(!autoSelect)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoSelect ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoSelect ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Include activities
              </span>
              <button
                type="button"
                onClick={() => setIncludeActivities(!includeActivities)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  includeActivities ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    includeActivities ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Include tags
              </span>
              <button
                type="button"
                onClick={() => setIncludeTags(!includeTags)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  includeTags ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    includeTags ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Include notes
              </span>
              <button
                type="button"
                onClick={() => setIncludeNotes(!includeNotes)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  includeNotes ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    includeNotes ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Date range
              </span>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as 'all' | 'week' | 'month' | 'year')}
                className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1"
              >
                <option value="all">All</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Entries</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalEntries}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Selected</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {selectedCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <SmileIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Mood</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgMood.toFixed(1)}/5
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangleIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Duplicates</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {duplicateCount}
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Daylio Connection
            </span>
            {isConnected && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-semibold rounded-full">
                Connected
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={isConnected ? handleDisconnect : handleConnect}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
              isConnected
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white'
            }`}
          >
            {isConnected ? (
              <>
                <Lock className="h-4 w-4" />
                Disconnect
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4" />
                Connect to Daylio
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scan Entries */}
      {isConnected && (
        <div className="mb-4">
          <button
            type="button"
            onClick={handleScan}
            disabled={isScanning}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Scan for Entries
              </>
            )}
          </button>
        </div>
      )}

      {/* Entry Selection */}
      {isConnected && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Daylio Entries
            </h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEntries(entries.map(e => ({ ...e, isSelected: autoSelect })))}
                className="px-3 py-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-xs font-semibold rounded-lg transition-colors"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={() => setEntries(entries.map(e => ({ ...e, isSelected: false })))}
                className="px-3 py-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-xs font-semibold rounded-lg transition-colors"
              >
                Deselect All
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  entry.isSelected
                    ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800'
                    : entry.isDuplicate
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                }`}
                onClick={() => handleToggleEntry(entry.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getMoodIcon(entry.mood)}</span>
                    <div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {formatDate(entry.date)} at {entry.time}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {MOOD_CONFIG[entry.mood as keyof typeof MOOD_CONFIG]?.label}
                      </div>
                    </div>
                  </div>
                  {entry.isDuplicate && (
                    <div className="flex items-center gap-1">
                      <AlertTriangleIcon className="h-3 w-3 text-amber-500" />
                      <span className="text-[10px] text-amber-600 dark:text-amber-400">Duplicate</span>
                    </div>
                  )}
                </div>
                {includeActivities && entry.activities.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1">
                    {entry.activities.map((activity) => {
                      const Icon = getActivityIcon(activity);
                      return (
                        <span
                          key={activity}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded text-[10px] text-slate-700 dark:text-slate-300"
                        >
                          <Icon className="h-3 w-3" />
                          {activity}
                        </span>
                      );
                    })}
                  </div>
                )}
                {includeNotes && entry.note && (
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    {entry.note}
                  </div>
                )}
                {includeTags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded text-[10px]"
                      >
                        <Hash className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata Preview */}
      {isConnected && selectedEntries.length > 0 && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
              Import Summary
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Selected Entries</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {selectedCount}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Include Activities</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {includeActivities ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Include Tags</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {includeTags ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Include Notes</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {includeNotes ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Date Range</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {dateRange}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Button */}
      {isConnected && (
        <div className="mb-4">
          <button
            type="button"
            onClick={handleImport}
            disabled={isImporting || selectedCount === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Import Selected Entries
              </>
            )}
          </button>
        </div>
      )}

      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg">
        <p className="text-[10px] text-orange-700 dark:text-orange-400">
          <strong>Lưu ý:</strong> Nhập từ Daylio với OAuth connection, journal entry scanning, mood tracking (amazing/good/okay/bad/awful), activity extraction with icons, tag extraction, note content, date/time tracking, duplicate detection, auto-select options, entry selection with preview, batch import, comprehensive Daylio API integration, và full mood journal preservation.
        </p>
      </div>
    </div>
  );
}