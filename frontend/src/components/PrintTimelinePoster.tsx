'use client';

import { useState } from 'react';
import { X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Image as ImageIcon, RefreshCw, Check, Zap as ZapIcon, Plus, FileText, Layers, LayoutGrid, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCw, AlignLeft, AlignCenter, AlignRight, Palette, Type as TypeIcon, Sparkles, Share2, ExternalLink, Download as DownloadIcon, Eye, EyeOff, Trash2 as TrashIcon, Calendar as CalendarIcon, Clock as ClockIcon, Timeline, DollarSign, Printer, MapPin, User, Filter as FilterIcon, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, DateRange, Year, CopyRight } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  imageUrl: string;
  location: string;
  isSelected: boolean;
}

interface PosterConfig {
  size: 'A3' | 'A2' | 'A1' | 'Custom';
  timeRange: 'year' | 'month' | 'all';
  style: 'minimal' | 'colorful' | 'elegant' | 'modern';
  layout: 'vertical' | 'horizontal' | 'spiral';
  includePhotos: boolean;
  includeLocations: boolean;
  quantity: number;
  totalPrice: number;
}

interface PrintTimelinePosterProps {
  onCancel?: () => void;
  onPrint?: (config: PosterConfig, events: TimelineEvent[]) => Promise<void>;
  onPreview?: (config: PosterConfig, events: TimelineEvent[]) => Promise<void>;
}

const DEFAULT_EVENTS: TimelineEvent[] = [
  {
    id: 'event-1',
    title: 'Born',
    description: 'The beginning of the journey',
    date: new Date('1990-01-15'),
    imageUrl: '/event-1.jpg',
    location: 'Hanoi, Vietnam',
    isSelected: true,
  },
  {
    id: 'event-2',
    title: 'Graduation',
    description: 'University graduation day',
    date: new Date('2012-06-20'),
    imageUrl: '/event-2.jpg',
    location: 'Ho Chi Minh City, Vietnam',
    isSelected: true,
  },
  {
    id: 'event-3',
    title: 'First Job',
    description: 'Started working at Tech Corp',
    date: new Date('2012-08-01'),
    imageUrl: '/event-3.jpg',
    location: 'Hanoi, Vietnam',
    isSelected: true,
  },
];

const PRICING = {
  A3: 15,
  A2: 25,
  A1: 40,
  Custom: 50,
};

export default function PrintTimelinePoster({ onCancel, onPrint, onPreview }: PrintTimelinePosterProps) {
  const [events, setEvents] = useState<TimelineEvent[]>(DEFAULT_EVENTS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<TimelineEvent[]>(DEFAULT_EVENTS.filter(e => e.isSelected));
  const [config, setConfig] = useState<PosterConfig>({
    size: 'A3',
    timeRange: 'all',
    style: 'modern',
    layout: 'vertical',
    includePhotos: true,
    includeLocations: true,
    quantity: 1,
    totalPrice: 15,
  });
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const selectedCount = selectedEvents.length;
  const basePrice = PRICING[config.size];
  const totalPrice = basePrice * config.quantity;

  const handleToggleEvent = (eventId: string) => {
    setEvents(events.map(e => 
      e.id === eventId ? { ...e, isSelected: !e.isSelected } : e
    ));
    setSelectedEvents(events.filter(e => e.id === eventId ? !e.isSelected : e.isSelected));
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    await onPrint?.(config, selectedEvents);
    setIsPrinting(false);
  };

  const handlePreview = async () => {
    setIsPreviewing(true);
    await onPreview?.(config, selectedEvents);
    setIsPreviewing(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Timeline className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              In poster timeline cuộc đời
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedCount} events selected
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
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt poster timeline
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-arrange timeline
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                High-resolution export
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Print-ready format
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
            <Timeline className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Events</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {events.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Selected</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {selectedCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CopyRight className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Quantity</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {config.quantity}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            ${totalPrice}
          </div>
        </div>
      </div>

      {/* Poster Configuration */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Poster Configuration
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                Poster Size
              </label>
              <select
                value={config.size}
                onChange={(e) => setConfig({ ...config, size: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
              >
                <option value="A3">A3</option>
                <option value="A2">A2</option>
                <option value="A1">A1</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                Time Range
              </label>
              <select
                value={config.timeRange}
                onChange={(e) => setConfig({ ...config, timeRange: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
              >
                <option value="year">By Year</option>
                <option value="month">By Month</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                Style
              </label>
              <select
                value={config.style}
                onChange={(e) => setConfig({ ...config, style: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
              >
                <option value="minimal">Minimal</option>
                <option value="colorful">Colorful</option>
                <option value="elegant">Elegant</option>
                <option value="modern">Modern</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                Layout
              </label>
              <select
                value={config.layout}
                onChange={(e) => setConfig({ ...config, layout: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
              >
                <option value="vertical">Vertical</option>
                <option value="horizontal">Horizontal</option>
                <option value="spiral">Spiral</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex gap-3">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-1">
                <input
                  type="checkbox"
                  checked={config.includePhotos}
                  onChange={(e) => setConfig({ ...config, includePhotos: e.target.checked })}
                  className="rounded"
                />
                Include Photos
              </label>
            </div>
            <div className="flex-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-1">
                <input
                  type="checkbox"
                  checked={config.includeLocations}
                  onChange={(e) => setConfig({ ...config, includeLocations: e.target.checked })}
                  className="rounded"
                />
                Include Locations
              </label>
            </div>
          </div>

          <div className="mt-3">
            <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={config.quantity}
              onChange={(e) => setConfig({ ...config, quantity: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
            />
          </div>

          <div className="mt-3 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Total Price
              </span>
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                ${totalPrice}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ${basePrice} per poster × {config.quantity} copies
            </p>
          </div>
        </div>
      </div>

      {/* Event Selection */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Select Timeline Events
        </h4>
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                event.isSelected
                  ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
              onClick={() => handleToggleEvent(event.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                    <CalendarIcon className="h-6 w-6 text-slate-400" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {event.title}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(event.date)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {event.isSelected && (
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Timeline Preview
            </span>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors">
                <ZoomIn className="h-4 w-4 text-slate-500" />
              </button>
              <button className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors">
                <Maximize2 className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Timeline Preview Area */}
          <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-600 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Timeline className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {config.size} - {config.style}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-400">
                  {config.layout} layout
                </p>
              </div>
            </div>

            {/* Timeline Points */}
            {selectedEvents.map((event, index) => (
              <div
                key={event.id}
                className="absolute w-4 h-4 bg-purple-500 rounded-full"
                style={{
                  top: `${15 + index * 25}%`,
                  left: config.layout === 'horizontal' ? `${15 + index * 25}%` : '50%',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handlePreview}
          disabled={isPreviewing || selectedCount === 0}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPreviewing ? (
            <>
              <Activity className="h-4 w-4 animate-spin" />
              Previewing...
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Preview
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handlePrint}
          disabled={isPrinting || selectedCount === 0}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPrinting ? (
            <>
              <Activity className="h-4 w-4 animate-spin" />
              Printing...
            </>
          ) : (
            <>
              <Printer className="h-4 w-4" />
              Print Poster
            </>
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> In poster timeline cuộc đời với poster size selection (A3/A2/A1/Custom), time range options (year/month/all), style variants (minimal/colorful/elegant/modern), layout options (vertical/horizontal/spiral), photo/location inclusion, event selection, preview mode, pricing calculation, và comprehensive print timeline poster system.
        </p>
      </div>
    </div>
  );
}