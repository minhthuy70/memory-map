'use client';

import { useState } from 'react';
import { CheckCircle, Clock, Globe, Info, MapPin, RefreshCw } from 'lucide-react';

interface TimezoneSupportProps {
  onCancel?: () => void;
}

interface Timezone {
  id: string;
  name: string;
  region: string;
  offset: string;
  abbreviation: string;
  currentTime: string;
}

export default function TimezoneSupport({ onCancel }: TimezoneSupportProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState<string>('Asia/Ho_Chi_Minh');
  const [currentTime, setCurrentTime] = useState(new Date());

  const [timezones, setTimezones] = useState<Timezone[]>([
    { id: 'Asia/Ho_Chi_Minh', name: 'Ho Chi Minh', region: 'Vietnam', offset: '+07:00', abbreviation: 'ICT', currentTime: '' },
    { id: 'Asia/Hanoi', name: 'Hanoi', region: 'Vietnam', offset: '+07:00', abbreviation: 'ICT', currentTime: '' },
    { id: 'Asia/Danang', name: 'Da Nang', region: 'Vietnam', offset: '+07:00', abbreviation: 'ICT', currentTime: '' },
    { id: 'America/New_York', name: 'New York', region: 'USA', offset: '-05:00', abbreviation: 'EST', currentTime: '' },
    { id: 'America/Los_Angeles', name: 'Los Angeles', region: 'USA', offset: '-08:00', abbreviation: 'PST', currentTime: '' },
    { id: 'Europe/London', name: 'London', region: 'UK', offset: '+00:00', abbreviation: 'GMT', currentTime: '' },
    { id: 'Europe/Paris', name: 'Paris', region: 'France', offset: '+01:00', abbreviation: 'CET', currentTime: '' },
    { id: 'Asia/Tokyo', name: 'Tokyo', region: 'Japan', offset: '+09:00', abbreviation: 'JST', currentTime: '' },
    { id: 'Asia/Seoul', name: 'Seoul', region: 'South Korea', offset: '+09:00', abbreviation: 'KST', currentTime: '' },
    { id: 'Asia/Shanghai', name: 'Shanghai', region: 'China', offset: '+08:00', abbreviation: 'CST', currentTime: '' },
    { id: 'Australia/Sydney', name: 'Sydney', region: 'Australia', offset: '+11:00', abbreviation: 'AEDT', currentTime: '' },
    { id: 'Asia/Dubai', name: 'Dubai', region: 'UAE', offset: '+04:00', abbreviation: 'GST', currentTime: '' },
  ]);

  const getCurrentTimezone = () => {
    return timezones.find(t => t.id === selectedTimezone) || timezones[0];
  };

  const currentTimezone = getCurrentTimezone();

  const formatTimeInTimezone = (timezone: string) => {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDateInTimezone = (timezone: string) => {
    return new Date().toLocaleDateString('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Timezone Support
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Display local time for memories
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show details"
          >
            {showDetails ? <Info className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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

      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Timezones</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{timezones.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Selected</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{currentTimezone.name}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Offset</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{currentTimezone.offset}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Current Time</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {formatTimeInTimezone(selectedTimezone)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedTimezone}
            onChange={(e) => setSelectedTimezone(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          >
            {timezones.map((tz) => (
              <option key={tz.id} value={tz.id}>
                {tz.name} ({tz.region})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setCurrentTime(new Date())}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Current Time: {currentTimezone.name}</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Time</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {formatTimeInTimezone(selectedTimezone)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Date</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {formatDateInTimezone(selectedTimezone)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Region</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {currentTimezone.region}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">UTC Offset</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {currentTimezone.offset} ({currentTimezone.abbreviation})
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">World Clock</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {timezones.map((tz) => (
              <button
                key={tz.id}
                type="button"
                onClick={() => setSelectedTimezone(tz.id)}
                className={`p-3 rounded-lg border text-left ${
                  selectedTimezone === tz.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {selectedTimezone === tz.id && <CheckCircle className="h-3 w-3 text-blue-500" />}
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">{tz.name}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{tz.region}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {formatTimeInTimezone(tz.id)} ({tz.offset})
                </p>
              </button>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Timezone Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Vietnam uses ICT (Indochina Time) UTC+7</li>
              <li>• Memories display local time when created</li>
              <li>• DST (Daylight Saving Time) affects some regions</li>
              <li>• Always check timezone for international collaboration</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
