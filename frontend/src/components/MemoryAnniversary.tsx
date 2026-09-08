'use client';

import { useState } from 'react';
import { Heart, Gift, Calendar, Bell, Plus, Trash2, Edit, Check, X, Save, Settings, Sparkles } from 'lucide-react';

interface Anniversary {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  memoryId?: string;
  notificationEnabled: boolean;
  notificationDaysBefore: number[];
  recurring: boolean;
  type: 'wedding' | 'first_date' | 'birthday' | 'custom';
}

interface MemoryAnniversaryProps {
  anniversaries?: Anniversary[];
  onAdd?: (anniversary: Omit<Anniversary, 'id'>) => Promise<void>;
  onUpdate?: (id: string, anniversary: Partial<Anniversary>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onCancel?: () => void;
  isSaving?: boolean;
}

const DEFAULT_ANNIVERSARIES: Anniversary[] = [
  {
    id: 'wedding-1',
    title: 'Ngày cưới',
    date: '2020-06-15',
    notificationEnabled: true,
    notificationDaysBefore: [7, 1, 0],
    recurring: true,
    type: 'wedding',
  },
];

export default function MemoryAnniversary({
  anniversaries = DEFAULT_ANNIVERSARIES,
  onAdd,
  onUpdate,
  onDelete,
  onCancel,
  isSaving = false,
}: MemoryAnniversaryProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    memoryId: '',
    notificationEnabled: true,
    notificationDaysBefore: [7, 1, 0],
    recurring: true,
    type: 'custom' as Anniversary['type'],
  });

  const handleAdd = async () => {
    if (onAdd && formData.title && formData.date) {
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

  const handleEdit = (anniversary: Anniversary) => {
    setEditingId(anniversary.id);
    setFormData({
      title: anniversary.title,
      date: anniversary.date,
      memoryId: anniversary.memoryId || '',
      notificationEnabled: anniversary.notificationEnabled,
      notificationDaysBefore: anniversary.notificationDaysBefore,
      recurring: anniversary.recurring,
      type: anniversary.type,
    });
  };

  const handleToggleNotification = async (id: string, enabled: boolean) => {
    if (onUpdate) {
      await onUpdate(id, { notificationEnabled: enabled });
    }
  };

  const handleToggleDayBefore = (day: number) => {
    setFormData(prev => ({
      ...prev,
      notificationDaysBefore: prev.notificationDaysBefore.includes(day)
        ? prev.notificationDaysBefore.filter(d => d !== day)
        : [...prev.notificationDaysBefore, day].sort((a, b) => b - a),
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      memoryId: '',
      notificationEnabled: true,
      notificationDaysBefore: [7, 1, 0],
      recurring: true,
      type: 'custom',
    });
  };

  const getTypeIcon = (type: Anniversary['type']) => {
    switch (type) {
      case 'wedding':
        return <Heart className="h-4 w-4" />;
      case 'first_date':
        return <Sparkles className="h-4 w-4" />;
      case 'birthday':
        return <Gift className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: Anniversary['type']) => {
    switch (type) {
      case 'wedding':
        return 'Ngày cưới';
      case 'first_date':
        return 'Hẹn hò đầu tiên';
      case 'birthday':
        return 'Sinh nhật';
      default:
        return 'Tùy chỉnh';
    }
  };

  const getTypeColor = (type: Anniversary['type']) => {
    switch (type) {
      case 'wedding':
        return 'from-pink-400 to-rose-500';
      case 'first_date':
        return 'from-purple-400 to-indigo-500';
      case 'birthday':
        return 'from-amber-400 to-orange-500';
      default:
        return 'from-blue-400 to-cyan-500';
    }
  };

  const calculateYears = (date: string) => {
    const anniversaryDate = new Date(date);
    const today = new Date();
    const years = today.getFullYear() - anniversaryDate.getFullYear();
    const monthDiff = today.getMonth() - anniversaryDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < anniversaryDate.getDate())) {
      return years - 1;
    }
    
    return years;
  };

  const isUpcoming = (date: string) => {
    const anniversaryDate = new Date(date);
    const today = new Date();
    
    anniversaryDate.setFullYear(today.getFullYear());
    
    if (anniversaryDate < today) {
      anniversaryDate.setFullYear(today.getFullYear() + 1);
    }
    
    const diffDays = Math.ceil((anniversaryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 ? diffDays : null;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Kỷ niệm ngày đặc biệt
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {anniversaries.length} ngày kỷ niệm đã thiết lập
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-3 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-lg transition-colors"
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
        <div className="mb-6 p-4 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 rounded-xl">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">
            {editingId ? 'Chỉnh sửa ngày kỷ niệm' : 'Thêm ngày kỷ niệm mới'}
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
                placeholder="Ví dụ: Ngày cưới, Hẹn hò đầu tiên..."
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Ngày
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Loại kỷ niệm
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Anniversary['type'] })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                >
                  <option value="custom">Tùy chỉnh</option>
                  <option value="wedding">Ngày cưới</option>
                  <option value="first_date">Hẹn hò đầu tiên</option>
                  <option value="birthday">Sinh nhật</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Lặp lại hàng năm
              </label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, recurring: !formData.recurring })}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  formData.recurring ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    formData.recurring ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Thông báo trước (ngày)
              </label>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 3, 7, 14, 30].map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleDayBefore(day)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                      formData.notificationDaysBefore.includes(day)
                        ? 'bg-pink-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {day === 0 ? 'Ngày đó' : `${day} ngày trước`}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Bật thông báo
              </label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, notificationEnabled: !formData.notificationEnabled })}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  formData.notificationEnabled ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    formData.notificationEnabled ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="flex gap-2 mt-4 pt-4 border-t border-pink-200 dark:border-pink-800">
            <button
              type="button"
              onClick={editingId ? () => handleUpdate(editingId) : handleAdd}
              disabled={!formData.title || !formData.date || isSaving}
              className="flex-1 px-3 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              {isSaving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Thêm'}
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

      {/* Anniversaries List */}
      <div className="space-y-3">
        {anniversaries.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Chưa có ngày kỷ niệm nào
            </p>
          </div>
        ) : (
          anniversaries.map((anniversary) => {
            const years = calculateYears(anniversary.date);
            const upcomingDays = isUpcoming(anniversary.date);
            
            return (
              <div
                key={anniversary.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  anniversary.notificationEnabled
                    ? 'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border-pink-300 dark:border-pink-700'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${getTypeColor(anniversary.type)}`}>
                    <div className="text-white">
                      {getTypeIcon(anniversary.type)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className={`font-semibold ${
                          anniversary.notificationEnabled
                            ? 'text-pink-900 dark:text-pink-100'
                            : 'text-slate-700 dark:text-slate-300'
                        } text-sm`}>
                          {anniversary.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r ${getTypeColor(anniversary.type)} text-white`}>
                            {getTypeLabel(anniversary.type)}
                          </span>
                          {anniversary.recurring && (
                            <span className="px-2 py-0.5 bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200 text-[10px] font-bold rounded-full">
                              Lặp lại
                            </span>
                          )}
                          {upcomingDays !== null && (
                            <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-[10px] font-bold rounded-full">
                              {upcomingDays === 0 ? 'Hôm nay!' : `Còn ${upcomingDays} ngày`}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleNotification(anniversary.id, !anniversary.notificationEnabled)}
                        className={`relative w-8 h-4 rounded-full transition-colors ${
                          anniversary.notificationEnabled ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${
                            anniversary.notificationEnabled ? 'translate-x-4' : ''
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(anniversary.date).toLocaleDateString('vi-VN')}</span>
                      </div>
                      {years > 0 && (
                        <div className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          <span>{years} năm</span>
                        </div>
                      )}
                      {anniversary.notificationEnabled && anniversary.notificationDaysBefore.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Bell className="h-3 w-3" />
                          <span>
                            {anniversary.notificationDaysBefore.map(d => d === 0 ? 'ngày đó' : `${d}d`).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(anniversary)}
                      className="p-1.5 hover:bg-pink-100 dark:hover:bg-pink-900 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="h-3 w-3 text-slate-500" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(anniversary.id)}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Info Text */}
      <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 rounded-lg">
        <p className="text-[10px] text-pink-700 dark:text-pink-400">
          <strong>Lưu ý:</strong> Kỷ niệm ngày đặc biệt sẽ tự động nhắc nhở bạn trước các ngày quan trọng. 
          Bạn có thể thiết lập thông báo trước nhiều ngày để không bao giờ bỏ lỡ.
        </p>
      </div>
    </div>
  );
}