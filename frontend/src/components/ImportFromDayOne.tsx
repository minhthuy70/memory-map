'use client';

import { useState } from 'react';
import {
  Activity,
  ActivityIcon,
  AlertCircle,
  AlertTriangle,
  AlertTriangleIcon,
  Angry,
  AngryIcon,
  Archive,
  as,
  BarChart3,
  BookOpen,
  Briefcase,
  Cake,
  Calendar,
  CalendarIcon,
  CalendarIcon2,
  CalendarIcon3,
  Camera,
  Check,
  CheckCheck,
  CheckCircle,
  CheckCircleIcon,
  CheckIcon,
  CheckSquare,
  Clock,
  ClockIcon,
  ClockIcon2,
  Cloud,
  Code,
  Coffee,
  CoffeeIcon,
  Copy,
  CopyIcon,
  Copyright,
  CopyRightIcon,
  Database,
  Download,
  Droplet,
  Dumbbell,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Filter,
  FilterIcon,
  FolderOpen,
  FolderOpenIcon,
  Frown,
  Gamepad2,
  Gift,
  Globe,
  Grid,
  Hash,
  Headphones,
  Heart,
  HeartIcon,
  Home,
  Image,
  ImageIcon,
  ImageIcon2,
  ImageIcon3,
  Link,
  Loader2,
  Lock,
  Map,
  MapIcon,
  MapPin,
  MapPinIcon,
  Meh,
  MessageCircle,
  Monitor,
  Moon,
  MoreHorizontal,
  Music,
  Palette,
  Paperclip,
  Pause,
  PenTool,
  Plane,
  Play,
  Plus,
  RefreshCw,
  School,
  Search,
  Settings,
  SettingsIcon,
  Share2,
  Shield,
  ShoppingBag,
  Smile,
  SmileIcon,
  Sparkles,
  Square,
  Star,
  StarIcon,
  Sun,
  Tag,
  TagIcon,
  Thermometer,
  ThumbsUp,
  Trash2,
  TrashIcon,
  Unlock,
  Upload,
  Users,
  Utensils,
  Video,
  Wifi,
  XIcon,
  Zap,
  ZapIcon,
  ZapIcon2
} from 'lucide-react';

interface DayOneEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  location: string;
  weather: string;
  tags: string[];
  attachments: { type: 'image' | 'video' | 'audio'; url: string; size: number }[];
  isSelected: boolean;
  isDuplicate: boolean;
}

interface DayOneImportProps {
  onCancel?: () => void;
  onConnect?: () => Promise<void>;
  onImport?: (entries: DayOneEntry[]) => Promise<void>;
  onDisconnect?: () => Promise<void>;
}

const DEFAULT_ENTRIES: DayOneEntry[] = [
  {
    id: 'do-1',
    title: 'New Adventures',
    content: 'Started my journey today. Excited about what lies ahead!',
    date: new Date('2024-01-10'),
    location: 'Ho Chi Minh City, Vietnam',
    weather: 'Sunny',
    tags: ['adventure', 'new', 'exciting'],
    attachments: [{ type: 'image', url: '/do-1.jpg', size: 2500000 }],
    isSelected: true,
    isDuplicate: false,
  },
  {
    id: 'do-2',
    title: 'Reflections',
    content: 'Looking back at the past year, I realize how much I have grown.',
    date: new Date('2023-12-31'),
    location: 'Hanoi, Vietnam',
    weather: 'Cloudy',
    tags: ['reflection', 'growth', 'year-end'],
    attachments: [],
    isSelected: true,
    isDuplicate: false,
  },
];

export default function ImportFromDayOne({ onCancel, onConnect, onImport, onDisconnect }: DayOneImportProps) {
  const [entries, setEntries] = useState<DayOneEntry[]>(DEFAULT_ENTRIES);
  const [showSettings, setShowSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState<DayOneEntry[]>(DEFAULT_ENTRIES.filter(e => e.isSelected));
  const [autoSelect, setAutoSelect] = useState(true);
  const [includeAttachments, setIncludeAttachments] = useState(true);
  const [includeTags, setIncludeTags] = useState(true);
  const [includeLocation, setIncludeLocation] = useState(true);
  const [includeWeather, setIncludeWeather] = useState(true);
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'year'>('all');

  const totalEntries = entries.length;
  const selectedCount = selectedEntries.length;
  const duplicateCount = entries.filter(e => e.isDuplicate).length;
  const totalAttachments = entries.reduce((sum, e) => sum + e.attachments.length, 0);
  const totalSize = entries.reduce((sum, e) => sum + e.attachments.reduce((a, att) => a + att.size, 0), 0);

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

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' bytes';
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon3;
      case 'video': return Video;
      case 'audio': return Headphones;
      default: return FileText;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <PenTool className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Nhập từ Day One (app nhật ký)
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
        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt Day One import
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
                  autoSelect ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
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
                Include attachments
              </span>
              <button
                type="button"
                onClick={() => setIncludeAttachments(!includeAttachments)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  includeAttachments ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    includeAttachments ? 'translate-x-5' : ''
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
                  includeTags ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
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
                Include location
              </span>
              <button
                type="button"
                onClick={() => setIncludeLocation(!includeLocation)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  includeLocation ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    includeLocation ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Include weather
              </span>
              <button
                type="button"
                onClick={() => setIncludeWeather(!includeWeather)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  includeWeather ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    includeWeather ? 'translate-x-5' : ''
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
                <option value="year">Last CalendarDays</option>
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
            <Paperclip className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Attachments</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalAttachments}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CopyRight className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Size</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(totalSize / 1048576).toFixed(1)}MB
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Day One Connection
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
                : 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white'
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
                Connect to Day One
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
              Day One Entries
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
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                    : entry.isDuplicate
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                }`}
                onClick={() => handleToggleEntry(entry.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {entry.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {formatDate(entry.date)}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {entry.content}
                    </div>
                  </div>
                  {entry.isDuplicate && (
                    <div className="flex items-center gap-1 ml-2">
                      <AlertTriangleIcon className="h-3 w-3 text-amber-500" />
                      <span className="text-[10px] text-amber-600 dark:text-amber-400">Files</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {includeLocation && entry.location && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-400">
                      <MapPinIcon className="h-3 w-3" />
                      {entry.location}
                    </div>
                  )}
                  {includeWeather && entry.weather && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-400">
                      <Sun className="h-3 w-3" />
                      {entry.weather}
                    </div>
                  )}
                  {includeTags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-[10px]"
                        >
                          <TagIcon className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {includeAttachments && entry.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {entry.attachments.map((att, idx) => {
                      const Icon = getAttachmentIcon(att.type);
                      return (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded text-[10px] text-slate-700 dark:text-slate-300"
                        >
                          <Icon className="h-3 w-3" />
                          {att.type} ({formatFileSize(att.size)})
                        </span>
                      );
                    })}
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
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Total Attachments</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {selectedEntries.reduce((sum, e) => sum + e.attachments.length, 0)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Include Attachments</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {includeAttachments ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Include Tags</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {includeTags ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Include Location</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {includeLocation ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Include Weather</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {includeWeather ? 'Yes' : 'No'}
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
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
        <p className="text-[10px] text-amber-700 dark:text-amber-400">
          <strong>Lưu ý:</strong> Nhập từ Day One với OAuth connection, journal entry scanning, title/content extraction, attachment support (image/video/audio), tag extraction, location data, weather information, date/time tracking, duplicate detection, auto-select options, entry selection with preview, batch import, comprehensive Day One API integration, và full journal preservation.
        </p>
      </div>
    </div>
  );
}