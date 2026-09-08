'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle, Shield, Bell, X, Settings, Clock } from 'lucide-react';

interface SystemNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'security';
  title: string;
  description: string;
  icon: React.ReactNode;
  createdAt: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  dismissible?: boolean;
}

interface SystemNotificationsProps {
  notifications?: SystemNotification[];
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onSettings?: () => void;
  enabled?: boolean;
}

const DEFAULT_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'security-1',
    type: 'security',
    title: 'Cảnh báo bảo mật',
    description: 'Phát hiện đăng nhập từ thiết bị mới',
    icon: <Shield className="h-4 w-4" />,
    createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    read: false,
    priority: 'high',
    dismissible: false,
  },
  {
    id: 'info-1',
    type: 'info',
    title: 'Cập nhật hệ thống',
    description: 'Memory Map đã được cập nhật với tính năng mới',
    icon: <Info className="h-4 w-4" />,
    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: false,
    priority: 'medium',
    dismissible: true,
  },
  {
    id: 'success-1',
    type: 'success',
    title: 'Sao lưu thành công',
    description: 'Dữ liệu của bạn đã được sao lưu thành công',
    icon: <CheckCircle className="h-4 w-4" />,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    priority: 'low',
    dismissible: true,
  },
];

const getIconForType = (type: SystemNotification['type']) => {
  switch (type) {
    case 'info':
      return <Info className="h-4 w-4" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4" />;
    case 'error':
      return <XCircle className="h-4 w-4" />;
    case 'success':
      return <CheckCircle className="h-4 w-4" />;
    case 'security':
      return <Shield className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getColorForType = (type: SystemNotification['type']) => {
  switch (type) {
    case 'info':
      return 'from-blue-400 to-cyan-500';
    case 'warning':
      return 'from-amber-400 to-orange-500';
    case 'error':
      return 'from-red-400 to-rose-500';
    case 'success':
      return 'from-green-400 to-emerald-500';
    case 'security':
      return 'from-purple-400 to-indigo-500';
    default:
      return 'from-slate-400 to-slate-500';
  }
};

export default function SystemNotifications({
  notifications = DEFAULT_NOTIFICATIONS,
  onMarkAsRead,
  onDismiss,
  onSettings,
  enabled = true,
}: SystemNotificationsProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<SystemNotification | null>(null);
  const [showNotificationList, setShowNotificationList] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);

    // Show notification for high priority unread notifications
    const highPriorityUnread = notifications.find(n => !n.read && n.priority === 'high');
    if (highPriorityUnread) {
      setCurrentNotification(highPriorityUnread);
      setShowNotification(true);
      
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 8000); // Longer for high priority
      
      return () => clearTimeout(timer);
    }
  }, [notifications, enabled]);

  const handleMarkAsRead = (id: string) => {
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const handleDismiss = (id: string) => {
    if (onDismiss) {
      onDismiss(id);
    }
    setShowNotification(false);
  };

  const handleViewAll = () => {
    setShowNotificationList(true);
    setShowNotification(false);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  };

  if (!enabled) return null;

  return (
    <>
      {/* System Notification Toast */}
      {showNotification && currentNotification && (
        <div className={`fixed top-4 right-4 z-[2000] w-96 bg-gradient-to-br ${
          currentNotification.type === 'security' 
            ? 'from-purple-50 to-indigo-50 dark:from-purple-950/90 dark:to-indigo-950/90 border-purple-200 dark:border-purple-800'
            : currentNotification.type === 'error'
            ? 'from-red-50 to-rose-50 dark:from-red-950/90 dark:to-rose-950/90 border-red-200 dark:border-red-800'
            : currentNotification.type === 'warning'
            ? 'from-amber-50 to-orange-50 dark:from-amber-950/90 dark:to-orange-950/90 border-amber-200 dark:border-amber-800'
            : 'from-blue-50 to-cyan-50 dark:from-blue-950/90 dark:to-cyan-950/90 border-blue-200 dark:border-blue-800'
        } border rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300`}>
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className={`p-3 bg-gradient-to-br ${getColorForType(currentNotification.type)} rounded-xl shadow-lg`}>
                {currentNotification.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {currentNotification.type === 'security' ? '⚠️ Bảo mật' : 'Thông báo hệ thống'}
                  </h4>
                  {currentNotification.priority === 'high' && (
                    <span className="px-2 py-0.5 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 text-[10px] font-bold rounded-full">
                      QUAN TRỌNG
                    </span>
                  )}
                </div>
                <h5 className="font-semibold text-slate-900 dark:text-white text-base mb-1">
                  {currentNotification.title}
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                  {currentNotification.description}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(currentNotification.createdAt)}</span>
                </div>
              </div>
              {currentNotification.dismissible && (
                <button
                  type="button"
                  onClick={() => handleDismiss(currentNotification.id)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 text-slate-500" />
                </button>
              )}
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={handleViewAll}
                className="flex-1 px-3 py-1.5 bg-slate-800 dark:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Xem tất cả
              </button>
              <button
                type="button"
                onClick={() => handleMarkAsRead(currentNotification.id)}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Đã đọc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Notifications List Modal */}
      {showNotificationList && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                      Thông báo hệ thống
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {unreadCount} chưa đọc • {notifications.length} tổng cộng
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {onSettings && (
                    <button
                      type="button"
                      onClick={onSettings}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="Cài đặt"
                    >
                      <Settings className="h-4 w-4 text-slate-500" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowNotificationList(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4 text-slate-500" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Chưa có thông báo hệ thống nào
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        notification.read
                          ? 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 opacity-70'
                          : notification.priority === 'high'
                          ? 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border-red-300 dark:border-red-700'
                          : 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-300 dark:border-blue-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          notification.read
                            ? 'bg-slate-200 dark:bg-slate-600'
                            : `bg-gradient-to-br ${getColorForType(notification.type)}`
                        }`}>
                          {notification.read ? (
                            <CheckCircle className="h-4 w-4 text-slate-400" />
                          ) : (
                            <div className="text-white">
                              {notification.icon}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-semibold ${
                              notification.read
                                ? 'text-slate-700 dark:text-slate-300'
                                : 'text-slate-900 dark:text-white'
                            } text-sm`}>
                              {notification.title}
                            </h4>
                            {!notification.read && notification.priority === 'high' && (
                              <span className="px-2 py-0.5 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 text-[10px] font-bold rounded-full">
                                QUAN TRỌNG
                              </span>
                            )}
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                            {notification.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-[10px] text-slate-500">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(notification.createdAt)}</span>
                            </div>
                            <div className="flex gap-2">
                              {!notification.read && (
                                <button
                                  type="button"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="text-[10px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  Đánh dấu đã đọc
                                </button>
                              )}
                              {notification.dismissible && (
                                <button
                                  type="button"
                                  onClick={() => handleDismiss(notification.id)}
                                  className="text-[10px] font-medium text-red-600 dark:text-red-400 hover:underline"
                                >
                                  Xóa
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* System Notifications Button */}
      <button
        type="button"
        onClick={() => setShowNotificationList(true)}
        className="fixed bottom-36 right-4 z-[1000] p-3 bg-gradient-to-br from-slate-400 to-slate-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 relative"
        title="Thông báo hệ thống"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </>
  );
}