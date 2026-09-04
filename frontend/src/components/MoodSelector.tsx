'use client';

import React from 'react';

export interface MoodOption {
  value: string;
  emoji: string;
  label: string;
  description?: string;
  activeColor: string;
  badgeBg: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  {
    value: 'HAPPY',
    emoji: '😊',
    label: 'Vui vẻ',
    activeColor: 'border-amber-400 bg-amber-50/80 text-amber-900 dark:border-amber-500 dark:bg-amber-950/40 dark:text-amber-200 ring-amber-400/30',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  {
    value: 'SAD',
    emoji: '😢',
    label: 'Buồn',
    activeColor: 'border-blue-400 bg-blue-50/80 text-blue-900 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-200 ring-blue-400/30',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  },
  {
    value: 'EXCITED',
    emoji: '🤩',
    label: 'Hào hứng',
    activeColor: 'border-orange-400 bg-orange-50/80 text-orange-900 dark:border-orange-500 dark:bg-orange-950/40 dark:text-orange-200 ring-orange-400/30',
    badgeBg: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  },
  {
    value: 'PEACEFUL',
    emoji: '😌',
    label: 'Bình yên',
    activeColor: 'border-emerald-400 bg-emerald-50/80 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200 ring-emerald-400/30',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
  {
    value: 'NOSTALGIC',
    emoji: '🥹',
    label: 'Hoài niệm',
    activeColor: 'border-purple-400 bg-purple-50/80 text-purple-900 dark:border-purple-500 dark:bg-purple-950/40 dark:text-purple-200 ring-purple-400/30',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  },
  {
    value: 'LOVE',
    emoji: '❤️',
    label: 'Yêu thương',
    activeColor: 'border-rose-400 bg-rose-50/80 text-rose-900 dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-200 ring-rose-400/30',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  },
  {
    value: 'ANGRY',
    emoji: '😡',
    label: 'Giận dữ',
    activeColor: 'border-red-400 bg-red-50/80 text-red-900 dark:border-red-500 dark:bg-red-950/40 dark:text-red-200 ring-red-400/30',
    badgeBg: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
  },
  {
    value: 'TIRED',
    emoji: '😴',
    label: 'Mệt mỏi',
    activeColor: 'border-indigo-400 bg-indigo-50/80 text-indigo-900 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-200 ring-indigo-400/30',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  },
  {
    value: 'NEUTRAL',
    emoji: '😐',
    label: 'Trung lập',
    activeColor: 'border-slate-400 bg-slate-100/80 text-slate-900 dark:border-slate-500 dark:bg-slate-700/60 dark:text-slate-200 ring-slate-400/30',
    badgeBg: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600',
  },
];

interface MoodSelectorProps {
  value: string;
  onChange: (mood: string) => void;
  label?: string;
}

export default function MoodSelector({
  value,
  onChange,
  label = 'Tâm trạng',
}: MoodSelectorProps) {
  const currentMood = MOOD_OPTIONS.find((m) => m.value === value) || MOOD_OPTIONS[0];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span>Đang chọn:</span>
          <span className="font-semibold text-slate-800 dark:text-white">
            {currentMood.emoji} {currentMood.label}
          </span>
        </span>
      </div>

      {/* Grid Layout with Emoji + Label + Selection Highlight */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
        {MOOD_OPTIONS.map((item) => {
          const isSelected = value === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer select-none ${
                isSelected
                  ? `${item.activeColor} ring-2 shadow-xs scale-102 font-bold`
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300'
              }`}
              title={`${item.emoji} ${item.label} (${item.value})`}
            >
              <span className="text-2xl transition-transform group-hover:scale-115">
                {item.emoji}
              </span>
              <span className="text-[11px] mt-1 line-clamp-1 leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
