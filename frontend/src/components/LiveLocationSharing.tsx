'use client';

import { useState } from 'react';
import { MapPin, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Users, Globe, Lock, Eye, EyeOff, Navigation, Map } from 'lucide-react';

interface LocationShare {
  id: string;
  shareWith: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  expiresAt: Date | null;
  isLive: boolean;
  duration: number;
  lastUpdated: Date;
}

interface TrustedContact {
  id: string;
  name: string;
  platform: 'facebook' | 'whatsapp' | 'telegram' | 'phone';
  avatar: string;
  canSeeLocation: boolean;
  lastViewed: Date | null;
}

interface LiveLocationSharingProps {
  onCancel?: () => void;
  onStartSharing?: (contactId: string, duration: number) => Promise<void>;
}

const DEFAULT_SHARES: LocationShare[] = [
  {
    id: 'share-1',
    shareWith: 'Family Group',
    latitude: 21.0285,
    longitude: 105.8542,
    accuracy: 10,
    expiresAt: new Date('2024-01-14'),
    isLive: true,
    duration: 7200,
    lastUpdated: new Date(),
  },
  {
    id: 'share-2',
    shareWith: 'Best Friend',
    latitude: 21.0200,
    longitude: 105.8400,
    accuracy: 15,
    expiresAt: null,
    isLive: false,
    duration: 0,
    lastUpdated: new Date('2024-01-10'),
  },
];

const DEFAULT_CONTACTS: TrustedContact[] = [
  {
    id: 'contact-1',
    name: 'Family Group',
    platform: 'facebook',
    avatar: '/family.jpg',
    canSeeLocation: true,
    lastViewed: new Date('2024-01-12'),
  },
  {
    id: 'contact-2',
    name: 'Best Friend',
    platform: 'whatsapp',
    avatar: '/friend.jpg',
    canSeeLocation: true,
    lastViewed: new Date('2024-01-10'),
  },
  {
    id: 'contact-3',
    name: 'Work Team',
    platform: 'telegram',
    avatar: '/work.jpg',
    canSeeLocation: false,
    lastViewed: null,
  },
];

export default function LiveLocationSharing({ onCancel, onStartSharing }: LiveLocationSharingProps) {
  const [shares, setShares] = useState<LocationShare[]>(DEFAULT_SHARES);
  const [contacts, setContacts] = useState<TrustedContact[]>(DEFAULT_CONTACTS);
  const [showSettings, setShowSettings] = useState(false);
  const [isSharing, setIsSharing] = useState(true);
  const [sharingDuration, setSharingDuration] = useState(60);
  const [selectedContact, setSelectedContact] = useState('contact-1');
  const [accuracyLevel, setAccuracyLevel] = useState('high');

  const activeShares = shares.filter(s => s.isLive).length;
  const totalContacts = contacts.length;
  const canSeeCount = contacts.filter(c => c.canSeeLocation).length;

  const handleToggleSharing = async (contactId: string) => {
    await onStartSharing?.(contactId, sharingDuration);
  };

  const handleStopSharing = (shareId: string) => {
    setShares(shares.map(s => 
      s.id === shareId ? { ...s, isLive: false, expiresAt: new Date() } : s
    ));
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Globe className="h-4 w-4" />;
      case 'whatsapp':
        return <Users className="h-4 w-4" />;
      case 'telegram':
        return <Navigation className="h-4 w-4" />;
      case 'phone':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Chia sẻ vị trí trực tiếp
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isSharing ? 'Sharing active' : 'Sharing stopped'}
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
            Cài đặt location sharing
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Default duration: {sharingDuration} minutes
              </label>
              <input
                type="range"
                min="15"
                max="180"
                value={sharingDuration}
                onChange={(e) => setSharingDuration(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Accuracy level
              </label>
              <select
                value={accuracyLevel}
                onChange={(e) => setAccuracyLevel(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                <option value="high">High (10m)</option>
                <option value="medium">Medium (100m)</option>
                <option value="low">Low (1km)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Background sharing
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
            <MapPin className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Active Shares</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {activeShares}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Contacts</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalContacts}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Can See</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {canSeeCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Accuracy</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white capitalize">
            {accuracyLevel}
          </div>
        </div>
      </div>

      {/* Current Location */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Current Location
        </h4>
        <div className="p-4 rounded-lg border-2 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              {isSharing ? 'Sharing live location' : 'Location sharing stopped'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Latitude</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {shares[0]?.latitude.toFixed(6) || 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Longitude</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {shares[0]?.longitude.toFixed(6) || 'N/A'}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            Last updated: {shares[0]?.lastUpdated.toLocaleTimeString('vi-VN') || 'N/A'}
          </div>
        </div>
      </div>

      {/* Trusted Contacts */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Trusted Contacts
        </h4>
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-600">
                    {getPlatformIcon(contact.platform)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {contact.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {contact.canSeeLocation ? (
                    <Eye className="h-4 w-4 text-green-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-slate-500" />
                  )}
                  <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {contact.canSeeLocation ? 'Can see' : 'Hidden'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Platform</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 capitalize">
                    {contact.platform}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Last Viewed</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {contact.lastViewed ? contact.lastViewed.toLocaleDateString('vi-VN') : 'Never'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggleSharing(contact.id)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              >
                {contact.canSeeLocation ? 'Stop Sharing' : 'Start Sharing'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Shares */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Active Shares
        </h4>
        <div className="space-y-2">
          {shares.filter(s => s.isLive).map((share) => (
            <div
              key={share.id}
              className="p-4 rounded-lg border-2 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {share.shareWith}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleStopSharing(share.id)}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  title="Stop sharing"
                >
                  <EyeOff className="h-3 w-3 text-red-500" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Accuracy</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {share.accuracy}m
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {share.duration}s
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Expires</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {share.expiresAt ? share.expiresAt.toLocaleTimeString('vi-VN') : 'Never'}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Last updated: {share.lastUpdated.toLocaleTimeString('vi-VN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-[10px] text-green-700 dark:text-green-400">
          <strong>Lưu ý:</strong> Chia sẻ vị trí trực tiếp cho phép chia sẻ vị trí thời gian thực với bạn bè với trusted contacts, accuracy settings, duration controls, và privacy management.
        </p>
      </div>
    </div>
  );
}