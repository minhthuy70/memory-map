'use client';

import { useEffect, useState } from 'react';
import { Monitor, Smartphone, Globe, Trash2, Shield, Clock, Calendar } from 'lucide-react';
import { sessionsApi, Session } from '@/lib/sessions-api';
import { useAuthStore } from '@/store/auth-store';

export default function SessionsManager() {
  const { token } = useAuthStore();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await sessionsApi.getSessions();
      setSessions(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load sessions';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await sessionsApi.deleteSession(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete session';
      setError(message);
    }
  };

  const handleDeleteAllSessions = async () => {
    if (!confirm('Bạn có chắc chắn muốn đăng xuất khỏi tất cả các thiết bị không?')) {
      return;
    }

    try {
      await sessionsApi.deleteAllSessions();
      // Keep only current session if token is available
      if (token) {
        setSessions(sessions.filter(s => s.token === token));
      } else {
        setSessions([]);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete all sessions';
      setError(message);
    }
  };

  const getDeviceIcon = (deviceInfo?: string) => {
    if (!deviceInfo) return <Monitor className="h-5 w-5" />;
    
    const lowerInfo = deviceInfo.toLowerCase();
    if (lowerInfo.includes('mobile') || lowerInfo.includes('android') || lowerInfo.includes('iphone')) {
      return <Smartphone className="h-5 w-5" />;
    }
    return <Monitor className="h-5 w-5" />;
  };

  const getDeviceName = (deviceInfo?: string) => {
    if (!deviceInfo) return 'Thiết bị không xác định';
    
    // Try to extract browser and OS info
    if (deviceInfo.includes('Chrome')) return 'Chrome';
    if (deviceInfo.includes('Firefox')) return 'Firefox';
    if (deviceInfo.includes('Safari')) return 'Safari';
    if (deviceInfo.includes('Edge')) return 'Edge';
    
    return deviceInfo.substring(0, 50) + (deviceInfo.length > 50 ? '...' : '');
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const isCurrentSession = (session: Session) => {
    return token === session.token;
  };

  const isExpired = (session: Session) => {
    return new Date(session.expiresAt) < new Date();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-600 dark:text-slate-400">Đang tải phiên đăng nhập...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Quản lý phiên đăng nhập
        </h3>
        {sessions.length > 1 && (
          <button
            onClick={handleDeleteAllSessions}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Đăng xuất tất cả
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-8 text-slate-600 dark:text-slate-400">
          Không có phiên đăng nhập nào
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`p-4 rounded-lg border ${
                isCurrentSession(session)
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : isExpired(session)
                  ? 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 opacity-60'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    isCurrentSession(session)
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {getDeviceIcon(session.deviceInfo)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {getDeviceName(session.deviceInfo)}
                      </span>
                      {isCurrentSession(session) && (
                        <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                          Phiên hiện tại
                        </span>
                      )}
                      {isExpired(session) && (
                        <span className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full">
                          Đã hết hạn
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>IP: {session.ipAddress || 'Không xác định'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Đăng nhập: {formatDateTime(session.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Hoạt động cuối: {formatDateTime(session.lastActivity)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Hết hạn: {formatDateTime(session.expiresAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {!isCurrentSession(session) && !isExpired(session) && (
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Thu hồi phiên này"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Lưu ý:</strong> Phiên đăng nhập sẽ tự động hết hạn sau 7 ngày không hoạt động. 
          Bạn có thể thu hồi các phiên đăng nhập từ các thiết bị khác để bảo mật tài khoản.
        </p>
      </div>
    </div>
  );
}
