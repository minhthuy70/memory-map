'use client';

import { useState, useEffect } from 'react';
import { Users, Heart, MessageSquare, Share2, Bell, X, Check, Settings, Clock } from 'lucide-react';

interface SocialNotification {
  id: string;
  type: 'like' | 'comment' | 'share' | 'follow' | 'mention';
  title: string;
  description: string;
  icon: React.ReactNode;
  user?: {
    name: string;
    avatar?: string;
  };
  memory?: {
    title: string;
    id: string;
  };
  createdAt: Date;
  read: boolean;
  actionUrl?: string;
}

interface SocialNotificationsProps {
  notifications?: SocialNotification[];
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onSettings?: () => void;
  enabled?: boolean;
}

const DEFAULT_NOTIFICATIONS: SocialNotification[] = [
  {
    id: 'like-1',
    type: 'like',
    title: 'Người khác thích kỷ niệm của bạn',
    description: 'Nguyễn Văn A đã thích kỷ niệm "Chuyến đi Đà Lạt"',
    icon: <Heart className="h-4 w-4" />,
    user: { name: 'Nguyễn Văn A' },
    memory: { title: 'Chuyến đi Đà Lạt', id: '1' },
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
  },
  {
    id: 'comment-1',
    type: 'comment',
    title: 'Bình luận mới',
    description: 'Trần Thị B đã bình luận về kỷ niệm của bạn',
    icon: <MessageSquare className="h-4 w-4" />,
    user: { name: 'Trần Thị B' },
    memory: { title: 'Bữa tối gia đình', id: '2' },
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
  },
  {
    id: 'share-1',
    type: 'share',
    title: 'Kỷ niệm của bạn được chia sẻ',
    description: 'Lê Văn C đã chia sẻ kỷ niệm "Hẹn hò đầu tiên"',
    icon: <Share2 className="h-4 w-4" />,
    user: { name: 'Lê Văn C' },
    memory: { title: 'Hẹn hò đầu tiên', id: '3' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
  },
];

export default function SocialNotifications({
  notifications = DEFAULT_NOTIFICATIONS,
  onMarkAsRead,
  onDismiss,
  onSettings,
  enabled = true,
}: SocialNotificationsProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<SocialNotification | null>(null);
  const [showNotificationList, setShowNotificationList] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);

    // Show notification for new unread notifications
    const newNotification = notifications.find(n => !n.read);
    if (newNotification && unread > 0) {
      setCurrentNotification(newNotification);
      setShowNotification(true);
      
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      
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
      {/* Social Notification Toast */}
      {showNotification && currentNotification && (
        <div className="fixed top-4 right-4 z-[2000] w-96 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/90 dark:to-indigo-950/90 border border-blue-200 dark:border-blue-800 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-lg">
                {currentNotification.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm">
                    Hoạt động xã hội
                  </h4>
                  {unreadCount > 1 && (
                    <span className="px-2 py-0.5 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-[10px] font-bold rounded-full">
                      +{unreadCount - 1}
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
              <button
                type="button"
                onClick={() => handleDismiss(currentNotification.id)}
                className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
              <button
                type="button"
                onClick={handleViewAll}
                className="flex-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors"
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

      {/* Social Notifications List Modal */}
      {showNotificationList && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                      Thông báo xã hội
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
                  <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Chưa có thông báo xã hội nào
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
                          : 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-300 dark:border-blue-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          notification.read
                            ? 'bg-slate-200 dark:bg-slate-600'
                            : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                        }`}>
                          {notification.read ? (
                            <Check className="h-4 w-4 text-slate-400" />
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
                                : 'text-blue-900 dark:text-blue-100'
                            } text-sm`}>
                              {notification.title}
                            </h4>
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
                              <button
                                type="button"
                                onClick={() => handleDismiss(notification.id)}
                                className="text-[10px] font-medium text-red-600 dark:text-red-400 hover:underline"
                              >
                                Xóa
                              </button>
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

      {/* Social Notifications Button */}
      <button
        type="button"
        onClick={() => setShowNotificationList(true)}
        className="fixed bottom-20 right-4 z-[1000] p-3 bg-gradient-to-br from-blue-400 to-indigo-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 relative"
        title="Thông báo xã hội"
      >
        <Users className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </>
  );
}