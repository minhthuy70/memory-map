'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  as,
  Calendar,
  CalendarClock,
  CalendarIcon,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  ClockIcon,
  Copy,
  Download,
  Eye,
  EyeOff,
  File,
  Filter,
  Image,
  ImageIcon,
  Layers,
  Layout,
  Loader2,
  MapPin,
  Pause,
  Play,
  RefreshCw,
  Settings,
  Share2
} from 'lucide-react';

interface ExportToICalendarProps {
  onCancel?: () => void;
  onExport?: (options: ICalendarOptions) => void;
}

interface ICalendarOptions {
  includeLocation: boolean;
  includeDescription: boolean;
  includeAttachments: boolean;
  includeReminders: boolean;
  reminderMinutes: number;
  eventDuration: number;
  allDay: boolean;
  recurrence: 'none' | 'yearly' | 'monthly';
  timezone: 'local' | 'utc';
  category: 'memory' | 'anniversary' | 'milestone';
  color: 'default' | 'custom';
  privacy: 'public' | 'private';
  method: 'request' | 'publish';
}

export default function ExportToICalendar({ onCancel, onExport }: ExportToICalendarProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState<'idle' | 'generating' | 'processing' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [selectedMemories, setSelectedMemories] = useState<number>(0);
  const [totalMemories, setTotalMemories] = useState(50);

  const [options, setOptions] = useState<ICalendarOptions>({
    includeLocation: true,
    includeDescription: true,
    includeAttachments: false,
    includeReminders: true,
    reminderMinutes: 15,
    eventDuration: 60,
    allDay: false,
    recurrence: 'none',
    timezone: 'local',
    category: 'memory',
    color: 'default',
    privacy: 'private',
    method: 'publish',
  });

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    setExportStatus('generating');
    setExportProgress(30);
    await new Promise(resolve => setTimeout(resolve, 500));

    setExportStatus('processing');
    setExportProgress(70);
    await new Promise(resolve => setTimeout(resolve, 500));

    setExportStatus('done');
    setExportProgress(100);
    await onExport?.(options);

    setTimeout(() => {
      setIsExporting(false);
      setExportStatus('idle');
      setExportProgress(0);
    }, 1000);
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl">
            <CalendarClock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Export to iCalendar
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Export memories as calendar events (.ics)
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
        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            iCalendar Export Settings
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Category
                </label>
                <select
                  value={options.category}
                  onChange={(e) => setOptions({ ...options, category: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="memory">Memory</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="milestone">Milestone</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Recurrence
                </label>
                <select
                  value={options.recurrence}
                  onChange={(e) => setOptions({ ...options, recurrence: e.target.value as any })}
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                >
                  <option value="none">None</option>
                  <option value="yearly">Yearly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Event duration: {options.eventDuration} min
                </label>
                <input
                  type="range"
                  min="15"
                  max="180"
                  step="15"
                  value={options.eventDuration}
                  onChange={(e) => setOptions({ ...options, eventDuration: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Reminder: {options.reminderMinutes} min before
                </label>
                <input
                  type="range"
                  min="0"
                  max="1440"
                  step="15"
                  value={options.reminderMinutes}
                  onChange={(e) => setOptions({ ...options, reminderMinutes: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  All day event
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, allDay: !options.allDay })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.allDay ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.allDay ? 'translate-x-5' : ''
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
                  onClick={() => setOptions({ ...options, includeLocation: !options.includeLocation })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.includeLocation ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.includeLocation ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Include description
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, includeDescription: !options.includeDescription })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.includeDescription ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.includeDescription ? 'translate-x-5' : ''
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
                  onClick={() => setOptions({ ...options, includeAttachments: !options.includeAttachments })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.includeAttachments ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.includeAttachments ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Include reminders
                </span>
                <button
                  type="button"
                  onClick={() => setOptions({ ...options, includeReminders: !options.includeReminders })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    options.includeReminders ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      options.includeReminders ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Export Summary
            </h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePreview}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                title="Preview"
              >
                {showPreview ? <EyeOff className="h-4 w-4 text-slate-500" /> : <Eye className="h-4 w-4 text-slate-500" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Memories:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                {selectedMemories}/{totalMemories}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Category:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white capitalize">
                {options.category}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Duration:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                {options.eventDuration} min
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Reminder:</span>
              <span className="ml-2 font-medium text-slate-900 dark:text-white">
                {options.reminderMinutes} min
              </span>
            </div>
          </div>
        </div>

        {showPreview && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                iCalendar Preview
              </h4>
              <button
                type="button"
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4 text-slate-500" />
              </button>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-600 aspect-[3/4] flex items-center justify-center">
              <div className="text-center">
                <ClockIcon className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Calendar Event Preview
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  .ics format
                </p>
              </div>
            </div>
          </div>
        )}

        {exportStatus !== 'idle' && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Exporting...
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {exportProgress}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              {exportStatus === 'generating' && <Layers className="h-3 w-3" />}
              {exportStatus === 'processing' && <CalendarIcon className="h-3 w-3" />}
              {exportStatus === 'done' && <Check className="h-3 w-3 text-green-500" />}
              {exportStatus === 'error' && <AlertTriangle className="h-3 w-3 text-red-500" />}
              <span className="capitalize">{exportStatus}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export ICS
              </>
            )}
          </button>
          <button
            type="button"
            className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
