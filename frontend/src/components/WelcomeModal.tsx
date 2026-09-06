'use client';

import React, { useEffect, useState } from 'react';
import { X, Sparkles, MapPin, Heart } from 'lucide-react';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  useEffect(() => {
    // Check if user has seen welcome modal
    const seen = localStorage.getItem('hasSeenWelcome');
    if (!seen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenWelcome', 'true');
    setHasSeenWelcome(true);
  };

  if (!isOpen || hasSeenWelcome) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-hover p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6" />
              <h2 className="text-xl font-bold">Chào mừng đến với Memory Map!</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            Memory Map giúp bạn lưu giữ và trực quan hóa những kỷ niệm đáng nhớ trên bản đồ.
            Hãy bắt đầu hành trình của bạn ngay hôm nay!
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                  Thêm kỷ niệm
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Đánh dấu những địa điểm đặc biệt trên bản đồ
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
              <Heart className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                  Sắp xếp & Lọc
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Tổ chức kỷ niệm theo danh mục, tâm trạng và thời gian
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleClose}
              className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-colors"
            >
              Bắt đầu ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
