'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from './Toast';
import { Trophy, Star, Award, Target } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  condition: (count: number) => boolean;
  unlocked: boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-memory',
    name: 'Kỷ niệm đầu tiên',
    description: 'Tạo kỷ niệm đầu tiên của bạn',
    icon: <Star className="h-5 w-5 text-yellow-500" />,
    condition: (count) => count >= 1,
    unlocked: false,
  },
  {
    id: 'ten-memories',
    name: 'Nhà thám hiểm',
    description: 'Tạo 10 kỷ niệm',
    icon: <Trophy className="h-5 w-5 text-amber-500" />,
    condition: (count) => count >= 10,
    unlocked: false,
  },
  {
    id: 'fifty-memories',
    name: 'Người sưu tập',
    description: 'Tạo 50 kỷ niệm',
    icon: <Award className="h-5 w-5 text-purple-500" />,
    condition: (count) => count >= 50,
    unlocked: false,
  },
  {
    id: 'hundred-memories',
    name: 'Bậc thầy kỷ niệm',
    description: 'Tạo 100 kỷ niệm',
    icon: <Target className="h-5 w-5 text-red-500" />,
    condition: (count) => count >= 100,
    unlocked: false,
  },
];

export function AchievementSystem({ memoryCount }: { memoryCount: number }) {
  const { showToast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);

  useEffect(() => {
    // Load unlocked achievements from localStorage
    const saved = localStorage.getItem('unlockedAchievements');
    if (saved) {
      try {
        const unlockedIds = JSON.parse(saved) as string[];
        setAchievements((prev) =>
          prev.map((a) => ({
            ...a,
            unlocked: unlockedIds.includes(a.id),
          }))
        );
      } catch (e) {
        console.error('Failed to parse achievements:', e);
      }
    }
  }, []);

  useEffect(() => {
    // Check for new achievements
    const unlockedIds = achievements.filter((a) => a.unlocked).map((a) => a.id);
    const newUnlocked: Achievement[] = [];

    achievements.forEach((achievement) => {
      if (!achievement.unlocked && achievement.condition(memoryCount)) {
        newUnlocked.push(achievement);
      }
    });

    if (newUnlocked.length > 0) {
      // Update achievements state
      const updated = achievements.map((a) => {
        if (newUnlocked.find((n) => n.id === a.id)) {
          return { ...a, unlocked: true };
        }
        return a;
      });
      setAchievements(updated);

      // Save to localStorage
      const newUnlockedIds = [...unlockedIds, ...newUnlocked.map((a) => a.id)];
      localStorage.setItem('unlockedAchievements', JSON.stringify(newUnlockedIds));

      // Show toast notifications
      newUnlocked.forEach((achievement) => {
        showToast('success', `🎉 Thành tích mới: ${achievement.name}!`);
      });
    }
  }, [memoryCount, achievements, showToast]);

  return null; // This component runs in background, no UI needed
}

export function AchievementsList() {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);

  useEffect(() => {
    const saved = localStorage.getItem('unlockedAchievements');
    if (saved) {
      try {
        const unlockedIds = JSON.parse(saved) as string[];
        setAchievements((prev) =>
          prev.map((a) => ({
            ...a,
            unlocked: unlockedIds.includes(a.id),
          }))
        );
      } catch (e) {
        console.error('Failed to parse achievements:', e);
      }
    }
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
            Thành tích
          </h3>
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
          {unlockedCount}/{totalCount}
        </span>
      </div>

      <div className="space-y-2">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              achievement.unlocked
                ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
                : 'bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 opacity-60'
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                achievement.unlocked ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-slate-200 dark:bg-slate-600'
              }`}
            >
              {achievement.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                {achievement.name}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {achievement.description}
              </p>
            </div>
            {achievement.unlocked && (
              <div className="text-amber-500 dark:text-amber-400">
                <Star className="h-4 w-4 fill-current" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-200 dark:border-slate-700">
        <p>• Hoàn thành các thành tích để mở khóa huy hiệu</p>
        <p>• Thành tích được lưu trên trình duyệt của bạn</p>
      </div>
    </div>
  );
}
