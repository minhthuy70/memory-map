'use client';

import { useState } from 'react';
import { Clock, Calendar, Plus, Trash2, Edit, Check, X, Save, Settings, Repeat } from 'lucide-react';

interface ScheduledNotification {
  id: string;
  title: string;
  description: string;
  type: 'reminder' | 'anniversary' | 'custom';
  scheduledDate: Date;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  enabled: boolean;
}

interface ScheduledNotificationsProps {
  notifications?: ScheduledNotification[];
  onAdd?: (notification: Omit<ScheduledNotification, 'id'>) => Promise<void>;
  onUpdate?: (id: string, notification: Partial<ScheduledNotification>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onCancel?: () => void;
  isSaving?: boolean;
}

const DEFAULT_NOTIFICATIONS: ScheduledNotification[] = [
  {
    id: 'daily-reminder',
    title: 'Nhắc nhở hàng ngày',
    description: 'Nhắc nhở thêm kỷ niệm mới mỗi ngày',
    type: 'reminder',
    scheduledDate: new Date(new Date().setHours(9, 0, 0, 0)),
    recurrence: 'daily',
    enabled: true,
  },
  {
    id: 'weekly-review',
    title: 'Xem lại kỷ niệm tuần',
    description: 'Xem lại các kỷ niệm của tuần mỗi Chủ nhật',
    type: 'custom',
    scheduledDate: new Date(new Date().setHours(10, 0, 0, 0)),
    recurrence: 'weekly',
    enabled: false,
  },
];

export default function ScheduledNotifications({
  notifications = DEFAULT_NOTIFICATIONS,
  onAdd,
  onUpdate,
  onDelete,
  onCancel,
  isSaving = false,
}: ScheduledNotificationsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'custom' as ScheduledNotification['type'],
    scheduledDate: new Date(),
    recurrence: 'none' as ScheduledNotification['recurrence'],
    enabled: true,
  });

  const handleAdd = async () => {
    if (onAdd && formData.title) {
      await onAdd(formData);
      setShowAddForm(false);
      resetForm();
    }
  };

  const handleUpdate = async (id: string) => {
    if (onUpdate) {
      await onUpdate(id, formData);
      setEditingId(null);
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    if (onDelete) {
      await onDelete(id);
    }
  };

  const handleEdit = (notification: ScheduledNotification) => {
    setEditingId(notification.id);
    setFormData({
      title: notification.title,
      description: notification.description,
      type: notification.type,
      scheduledDate: notification.scheduledDate,
      recurrence: notification.recurrence,
      enabled: notification.enabled,
    });
  };

  const handleToggleEnabled = async (id: string, enabled: boolean) => {
    if (onUpdate) {
      await onUpdate(id, { enabled });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'custom',
      scheduledDate: new Date(),
      recurrence: 'none',
      enabled: true,
    });
  };

  const formatRecurrence = (recurrence?: ScheduledNotification['recurrence']) => {
    switch (recurrence) {
      case 'daily':
        return 'Hàng ngày';
      case 'weekly':
        return 'Hàng tuần';
      case 'monthly':
        return 'Hàng tháng';
      case 'yearly':
        return 'Hàng năm';
      default:
        return 'Một lần';
    }
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Thông báo theo lịch
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {notifications.filter(n => n.enabled).length} đang hoạt động
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Thêm mới
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

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">
            {editingId ? 'Chỉnh sửa thông báo' : 'Thêm thông báo mới'}
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Tiêu đề
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nhập tiêu đề thông báo..."
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả thông báo..."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Thời gian
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledDate.toISOString().slice(0, 16)}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: new Date(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Lặp lại
                </label>
                <select
                  value={formData.recurrence}
                  onChange={(e) => setFormData({ ...formData, recurrence: e.target.value as ScheduledNotification['recurrence'] })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="none">Một lần</option>
                  <option value="daily">Hàng ngày</option>
                  <option value="weekly">Hàng tuần</option>
                  <option value="monthly">Hàng tháng</option>
                  <option value="yearly">Hàng năm</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Bật thông báo
              </label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  formData.enabled ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    formData.enabled ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="flex gap-2 mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
            <button
              type="button"
              onClick={editingId ? () => handleUpdate(editingId) : handleAdd}
              disabled={!formData.title || isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              {isSaving ? (
                <>
                  <Settings className="h-3 w-3 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="h-3 w-3" />
                  {editingId ? 'Cập nhật' : 'Thêm'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
                resetForm();
              }}
              className="px-3 py-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Chưa có thông báo theo lịch nào
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                notification.enabled
                  ? 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-purple-300 dark:border-purple-700'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  notification.enabled
                    ? 'bg-gradient-to-br from-purple-400 to-indigo-500'
                    : 'bg-slate-200 dark:bg-slate-600'
                }`}>
                  {notification.enabled ? (
                    <Clock className="h-4 w-4 text-white" />
                  ) : (
                    <Clock className="h-4 w-4 text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-semibold ${
                      notification.enabled
                        ? 'text-purple-900 dark:text-purple-100'
                        : 'text-slate-700 dark:text-slate-300'
                    } text-sm`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleEnabled(notification.id, !notification.enabled)}
                        className={`relative w-8 h-4 rounded-full transition-colors ${
                          notification.enabled ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${
                            notification.enabled ? 'translate-x-4' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    {notification.description}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDateTime(notification.scheduledDate)}</span>
                    </div>
                    {notification.recurrence && notification.recurrence !== 'none' && (
                      <div className="flex items-center gap-1">
                        <Repeat className="h-3 w-3" />
                        <span>{formatRecurrence(notification.recurrence)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(notification)}
                    className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit className="h-3 w-3 text-slate-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(notification.id)}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Text */}
      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> Thông báo theo lịch sẽ tự động gửi theo thời gian đã đặt. 
          Bạn có thể tắt bất cứ thông báo nào mà không xóa nó.
        </p>
      </div>
    </div>
  );
}