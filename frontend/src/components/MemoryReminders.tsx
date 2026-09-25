'use client';

import React, { useState, useEffect } from 'react';
import { memoriesApi } from '@/lib/memories-api';
import { Bell, Clock, Calendar, Check, X, Loader2 } from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  reminderDate: string;
  category: {
    name: string;
    icon: string;
  };
  memoryDate: string;
}

export default function MemoryReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await memoriesApi.getUpcomingReminders();
      setReminders(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải nhắc nhở');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSent = async (memoryId: string) => {
    try {
      await memoriesApi.markReminderSent(memoryId);
      setReminders(reminders.filter(r => r.id !== memoryId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể đánh dấu nhắc nhở');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Ngày mai';
    if (diffDays === -1) return 'Hôm qua';
    if (diffDays < 0) return `${Math.abs(diffDays)} ngày trước`;
    if (diffDays <= 7) return `${diffDays} ngày nữa`;

    return date.toLocaleDateString('vi-VN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
            Nhắc nhở kỷ niệm
          </h3>
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {reminders.length} nhắc nhở
        </span>
      </div>

      {error && (
        <div className="p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-lg flex items-center gap-2">
          <X className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {reminders.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Không có nhắc nhở trong 7 ngày tới
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-primary/30 dark:hover:border-primary/30 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{reminder.category.icon}</span>
                  <h4 className="font-medium text-slate-900 dark:text-white text-sm truncate">
                    {reminder.title}
                  </h4>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(reminder.reminderDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(reminder.reminderDate)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleMarkAsSent(reminder.id)}
                className="flex-shrink-0 p-2 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg transition-colors"
                title="Đánh dấu đã xem"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}