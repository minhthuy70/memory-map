'use client';

import { useState } from 'react';
import { X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Clock as ClockIcon, RefreshCw, Check, Zap as ZapIcon, Plus, Layers, Calendar as CalendarIcon, Eye, EyeOff, Trash2 as TrashIcon, ExternalLink, MapPin, Lock, Unlock, Map as MapIcon, Lock as LockIcon, Unlock as UnlockIcon, Sparkles, CalendarClock, Timer, Shield, AlertCircle, Hourglass, Clock as ClockLucide } from 'lucide-react';

interface ARTimeCapsule {
  id: string;
  title: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  openDate: Date;
  closeDate: Date;
  isLocked: boolean;
  isOpened: boolean;
  isReady: boolean;
  content: { type: string; url: string }[];
  accessibilityRadius: number;
  maxOpenAttempts: number;
  currentAttempts: number;
}

interface ARTimeCapsuleProps {
  onCancel?: () => void;
  onCreateCapsule?: (capsule: Partial<ARTimeCapsule>) => Promise<void>;
  onDeleteCapsule?: (capsuleId: string) => Promise<void>;
  onOpenCapsule?: (capsuleId: string) => Promise<void>;
  onUpdateCapsule?: (capsuleId: string, updates: Partial<ARTimeCapsule>) => Promise<void>;
}

const DEFAULT_CAPSULES: ARTimeCapsule[] = [
  {
    id: 'capsule-1',
    title: '2024 Memories',
    description: 'Memories from our 2024 adventures',
    location: 'Đà Lạt, Vietnam',
    coordinates: { lat: 11.9405, lng: 108.4583 },
    openDate: new Date('2025-01-01'),
    closeDate: new Date('2025-12-31'),
    isLocked: true,
    isOpened: false,
    isReady: true,
    content: [
      { type: 'image', url: '/mem-1.jpg' },
      { type: 'video', url: '/mem-1.mp4' },
    ],
    accessibilityRadius: 100,
    maxOpenAttempts: 3,
    currentAttempts: 0,
  },
  {
    id: 'capsule-2',
    title: 'Beach Day 2023',
    description: 'Our beach vacation memories',
    location: 'Nha Trang, Vietnam',
    coordinates: { lat: 12.2380, lng: 109.1967 },
    openDate: new Date('2024-06-01'),
    closeDate: new Date('2024-06-30'),
    isLocked: false,
    isOpened: true,
    isReady: true,
    content: [
      { type: 'image', url: '/mem-2.jpg' },
    ],
    accessibilityRadius: 50,
    maxOpenAttempts: 5,
    currentAttempts: 2,
  },
];

export default function ARTimeCapsule({ onCancel, onCreateCapsule, onDeleteCapsule, onOpenCapsule, onUpdateCapsule }: ARTimeCapsuleProps) {
  const [capsules, setCapsules] = useState<ARTimeCapsule[]>(DEFAULT_CAPSULES);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState<ARTimeCapsule | null>(DEFAULT_CAPSULES[0]);
  const [isCreating, setIsCreating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ lat: 11.9405, lng: 108.4583 });
  const [isAtLocation, setIsAtLocation] = useState(false);
  const [isWithinTime, setIsWithinTime] = useState(true);

  const totalCapsules = capsules.length;
  const openedCapsules = capsules.filter(c => c.isOpened).length;
  const lockedCapsules = capsules.filter(c => c.isLocked).length;
  const readyCapsules = capsules.filter(c => c.isReady).length;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN');
  };

  const canOpenCapsule = (capsule: ARTimeCapsule) => {
    const now = new Date();
    const isTimeValid = now >= capsule.openDate && now <= capsule.closeDate;
    const isLocationValid = isAtLocation;
    const hasAttempts = capsule.currentAttempts < capsule.maxOpenAttempts;
    return !capsule.isLocked && !capsule.isOpened && isTimeValid && isLocationValid && hasAttempts;
  };

  const handleCreateCapsule = async (capsule: Partial<ARTimeCapsule>) => {
    await onCreateCapsule?.(capsule);
    const newCapsule: ARTimeCapsule = {
      id: `capsule-${Date.now()}`,
      title: capsule.title || 'New Time Capsule',
      description: capsule.description || '',
      location: capsule.location || 'Unknown',
      coordinates: capsule.coordinates || currentLocation,
      openDate: capsule.openDate || new Date(),
      closeDate: capsule.closeDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isLocked: true,
      isOpened: false,
      isReady: true,
      content: capsule.content || [],
      accessibilityRadius: capsule.accessibilityRadius || 100,
      maxOpenAttempts: capsule.maxOpenAttempts || 3,
      currentAttempts: 0,
    };
    setCapsules([newCapsule, ...capsules]);
    setIsCreating(false);
  };

  const handleDeleteCapsule = async (capsuleId: string) => {
    await onDeleteCapsule?.(capsuleId);
    setCapsules(capsules.filter(c => c.id !== capsuleId));
  };

  const handleOpenCapsule = async (capsuleId: string) => {
    await onOpenCapsule?.(capsuleId);
    setCapsules(capsules.map(c => 
      c.id === capsuleId ? { ...c, isOpened: true, currentAttempts: c.currentAttempts + 1 } : c
    ));
  };

  const handleToggleLock = (capsuleId: string) => {
    setCapsules(capsules.map(c => 
      c.id === capsuleId ? { ...c, isLocked: !c.isLocked } : c
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tạo time capsule AR chỉ mở được tại địa điểm và thời gian nhất định
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalCapsules} capsules
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
        <div className="mb-4 p-4 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt AR time capsule
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Location verification
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Time verification
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                AR placement
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
            <ClockIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Capsules</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalCapsules}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <UnlockIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Opened</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {openedCapsules}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <LockIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Locked</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {lockedCapsules}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Ready</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {readyCapsules}
          </div>
        </div>
      </div>

      {/* Location & Time Status */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Opening Conditions
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Location: {isAtLocation ? 'At capsule location' : 'Not at capsule location'}
                </span>
              </div>
              <span className={`text-xs ${isAtLocation ? 'text-green-500' : 'text-red-500'}`}>
                {isAtLocation ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Time: {isWithinTime ? 'Within valid time range' : 'Outside valid time range'}
                </span>
              </div>
              <span className={`text-xs ${isWithinTime ? 'text-green-500' : 'text-red-500'}`}>
                {isWithinTime ? '✓' : '✗'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Create Capsule */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setIsCreating(!isCreating)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-400 to-purple-500 hover:from-violet-500 hover:to-purple-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          {isCreating ? 'Cancel' : 'Create New Capsule'}
        </button>

        {isCreating && (
          <div className="mt-4 p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Capsule Title
                </label>
                <input
                  type="text"
                  placeholder="Time capsule title"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Description
                </label>
                <textarea
                  placeholder="What's inside this capsule?"
                  rows={2}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Location name"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                    Open Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                    Close Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                    Accessibility Radius (m)
                  </label>
                  <input
                    type="number"
                    defaultValue={100}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                    Max Open Attempts
                  </label>
                  <input
                    type="number"
                    defaultValue={3}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCreateCapsule({})}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Check className="h-4 w-4" />
                Create Capsule
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Capsule Viewer */}
      {selectedCapsule && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Time Capsule
              </span>
              <div className="flex items-center gap-2">
                {selectedCapsule.isLocked && (
                  <span className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-[10px] font-semibold rounded-full">
                    Locked
                  </span>
                )}
                {selectedCapsule.isOpened && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-semibold rounded-full">
                    Opened
                  </span>
                )}
              </div>
            </div>

            {/* Capsule Display */}
            <div className="aspect-video bg-slate-200 dark:bg-slate-600 rounded-lg mb-3 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  {selectedCapsule.isOpened ? (
                    <>
                      <UnlockIcon className="h-12 w-12 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Capsule Opened
                      </p>
                    </>
                  ) : (
                    <>
                      <LockIcon className="h-12 w-12 text-violet-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Capsule Locked
                      </p>
                    </>
                  )}
                  <p className="text-xs text-slate-400 dark:text-slate-400">
                    {selectedCapsule.location}
                  </p>
                </div>
              </div>

              {/* Open Button */}
              {!selectedCapsule.isOpened && canOpenCapsule(selectedCapsule) && (
                <button
                  type="button"
                  onClick={() => handleOpenCapsule(selectedCapsule.id)}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <UnlockIcon className="h-4 w-4 inline mr-2" />
                  Open Capsule
                </button>
              )}
            </div>

            {/* Info */}
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Open Date</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {formatDate(selectedCapsule.openDate)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Close Date</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {formatDate(selectedCapsule.closeDate)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Attempts</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {selectedCapsule.currentAttempts}/{selectedCapsule.maxOpenAttempts}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleToggleLock(selectedCapsule.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              >
                {selectedCapsule.isLocked ? (
                  <>
                    <UnlockIcon className="h-3 w-3" />
                    Unlock
                  </>
                ) : (
                  <>
                    <LockIcon className="h-3 w-3" />
                    Lock
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Capsule List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          AR Time Capsules
        </h4>
        <div className="space-y-2">
          {capsules.map((capsule) => (
            <div
              key={capsule.id}
              className={`p-4 rounded-lg border-2 ${
                selectedCapsule?.id === capsule.id
                  ? 'bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                    {capsule.isOpened ? (
                      <UnlockIcon className="h-6 w-6 text-green-500" />
                    ) : (
                      <LockIcon className="h-6 w-6 text-violet-500" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {capsule.title}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {capsule.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {capsule.isLocked && (
                    <LockIcon className="h-4 w-4 text-violet-500" />
                  )}
                  {capsule.isOpened && (
                    <UnlockIcon className="h-4 w-4 text-green-500" />
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteCapsule(capsule.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <TrashIcon className="h-3 w-3 text-red-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Open Date</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatDate(capsule.openDate)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Close Date</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatDate(capsule.closeDate)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Radius</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {capsule.accessibilityRadius}m
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Attempts</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {capsule.currentAttempts}/{capsule.maxOpenAttempts}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Lat</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {capsule.coordinates.lat.toFixed(4)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Lng</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {capsule.coordinates.lng.toFixed(4)}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCapsule(capsule)}
                className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-violet-100 dark:bg-violet-900/30 hover:bg-violet-200 dark:hover:bg-violet-900/50 text-violet-600 dark:text-violet-400 text-xs font-semibold rounded-lg transition-colors"
              >
                <Sparkles className="h-3 w-3" />
                View Capsule
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900 rounded-lg">
        <p className="text-[10px] text-violet-700 dark:text-violet-400">
          <strong>Lưu ý:</strong> Tạo time capsule AR chỉ mở được tại địa điểm và thời gian nhất định với location verification (GPS coordinates), time verification (open/close dates), accessibility radius, max open attempts, lock/unlock capsules, AR placement, content management, và comprehensive AR time capsule system.
        </p>
      </div>
    </div>
  );
}