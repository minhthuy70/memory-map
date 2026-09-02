'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { AlertCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SessionWarning() {
  const router = useRouter();
  const { inactivityWarning, resetInactivityTimer, logout } = useAuthStore();
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    if (inactivityWarning) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            logout().then(() => router.push('/login'));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setTimeRemaining(300);
    }
  }, [inactivityWarning, logout, router]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleContinue = () => {
    resetInactivityTimer();
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!inactivityWarning) return null;

  return (
    <div className="fixed top-4 right-4 left-4 md:left-auto md:w-96 z-50 animate-in slide-in-from-top-4">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
              Cảnh báo hết phiên đăng nhập
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
              Phiên đăng nhập của bạn sẽ hết hạn sau <span className="font-bold">{formatTime(timeRemaining)}</span> do không hoạt động.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleContinue}
                className="flex-1 px-3 py-1.5 text-sm bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
              >
                Tiếp tục phiên
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
          <button
            onClick={() => resetInactivityTimer()}
            className="flex-shrink-0 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
