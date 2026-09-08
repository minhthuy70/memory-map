'use client';

import { useState } from 'react';
import { MapPin, Navigation, Plus, Trash2, Edit, Check, X, Save, Settings, AlertTriangle, Info, Bell } from 'lucide-react';

interface LocationZone {
  id: string;
  name: string;
  type: 'memory' | 'general' | 'safe' | 'danger';
  latitude: number;
  longitude: number;
  radius: number; // in meters
  notification: string;
  enabled: boolean;
  triggerOn: 'enter' | 'exit' | 'both';
}

interface LocationBasedNotificationsProps {
  zones?: LocationZone[];
  onAddZone?: (zone: Omit<LocationZone, 'id'>) => Promise<void>;
  onUpdateZone?: (id: string, zone: Partial<LocationZone>) => Promise<void>;
  onDeleteZone?: (id: string) => Promise<void>;
  onToggleMonitoring?: (enabled: boolean) => Promise<void>;
  onCancel?: () => void;
  isSaving?: boolean;
  monitoringEnabled?: boolean;
  currentLocation?: { latitude: number; longitude: number };
}

const DEFAULT_ZONES: LocationZone[] = [
  {
    id: 'home-zone',
    name: 'Khu vực nhà',
    type: 'safe',
    latitude: 21.0285,
    longitude: 105.8542,
    radius: 500,
    notification: 'Bạn đã về nhà! Có kỷ niệm gần đây.',
    enabled: true,
    triggerOn: 'enter',
  },
];

export default function LocationBasedNotifications({
  zones = DEFAULT_ZONES,
  onAddZone,
  onUpdateZone,
  onDeleteZone,
  onToggleMonitoring,
  onCancel,
  isSaving = false,
  monitoringEnabled = false,
  currentLocation,
}: LocationBasedNotificationsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'general' as LocationZone['type'],
    latitude: 21.0285,
    longitude: 105.8542,
    radius: 500,
    notification: '',
    enabled: true,
    triggerOn: 'enter' as LocationZone['triggerOn'],
  });

  const handleAdd = async () => {
    if (onAddZone && formData.name) {
      await onAddZone(formData);
      setShowAddForm(false);
      resetForm();
    }
  };

  const handleUpdate = async (id: string) => {
    if (onUpdateZone) {
      await onUpdateZone(id, formData);
      setEditingId(null);
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    if (onDeleteZone) {
      await onDeleteZone(id);
    }
  };

  const handleEdit = (zone: LocationZone) => {
    setEditingId(zone.id);
    setFormData({
      name: zone.name,
      type: zone.type,
      latitude: zone.latitude,
      longitude: zone.longitude,
      radius: zone.radius,
      notification: zone.notification,
      enabled: zone.enabled,
      triggerOn: zone.triggerOn,
    });
  };

  const handleToggleZone = async (id: string, enabled: boolean) => {
    if (onUpdateZone) {
      await onUpdateZone(id, { enabled });
    }
  };

  const handleToggleMonitoring = async (enabled: boolean) => {
    if (onToggleMonitoring) {
      await onToggleMonitoring(enabled);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'general',
      latitude: 21.0285,
      longitude: 105.8542,
      radius: 500,
      notification: '',
      enabled: true,
      triggerOn: 'enter',
    });
  };

  const getTypeColor = (type: LocationZone['type']) => {
    switch (type) {
      case 'memory':
        return 'from-purple-400 to-indigo-500';
      case 'safe':
        return 'from-green-400 to-emerald-500';
      case 'danger':
        return 'from-red-400 to-rose-500';
      default:
        return 'from-blue-400 to-cyan-500';
    }
  };

  const getTypeLabel = (type: LocationZone['type']) => {
    switch (type) {
      case 'memory':
        return 'Kỷ niệm';
      case 'safe':
        return 'An toàn';
      case 'danger':
        return 'Nguy hiểm';
      default:
        return 'Tổng quát';
    }
  };

  const formatRadius = (meters: number) => {
    if (meters < 1000) return `${meters}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const isUserInZone = (zone: LocationZone) => {
    if (!currentLocation) return false;
    
    const R = 6371e3; // Earth's radius in meters
    const lat1 = (currentLocation.latitude * Math.PI) / 180;
    const lat2 = (zone.latitude * Math.PI) / 180;
    const lon1 = (currentLocation.longitude * Math.PI) / 180;
    const lon2 = (zone.longitude * Math.PI) / 180;
    
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    const distance = R * c;
    
    return distance <= zone.radius;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${
            monitoringEnabled
              ? 'bg-gradient-to-br from-green-400 to-emerald-500'
              : 'bg-slate-200 dark:bg-slate-600'
          }`}>
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Thông báo dựa trên vị trí
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {monitoringEnabled ? 'Đang theo dõi vị trí' : 'Đã tắt theo dõi'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleToggleMonitoring(!monitoringEnabled)}
            className={`flex items-center gap-2 px-3 py-2 ${
              monitoringEnabled
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-700'
            } text-white text-sm font-semibold rounded-lg transition-colors`}
          >
            {monitoringEnabled ? (
              <>
                <Navigation className="h-4 w-4" />
                Đang bật
              </>
            ) : (
              <>
                <BellOff className="h-4 w-4" />
                Bật theo dõi
              </>
            )}
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

      {/* Current Location Status */}
      {currentLocation && (
        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Vị trí hiện tại
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {zones.filter(z => z.enabled && isUserInZone(z)).map(zone => (
              <span
                key={zone.id}
                className={`px-2 py-1 text-[10px] font-medium rounded-full bg-gradient-to-r ${getTypeColor(zone.type)} text-white`}
              >
                Trong {zone.name}
              </span>
            ))}
            {zones.filter(z => z.enabled && isUserInZone(z)).length === 0 && (
              <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400">
                Không trong khu vực nào
              </span>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Zone Form */}
      {(showAddForm || editingId) && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">
            {editingId ? 'Chỉnh sửa khu vực' : 'Thêm khu vực mới'}
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Tên khu vực
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Nhà, Công ty, Quán cafe yêu thích..."
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Loại khu vực
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as LocationZone['type'] })}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="general">Tổng quát</option>
                <option value="memory">Kỷ niệm</option>
                <option value="safe">An toàn</option>
                <option value="danger">Nguy hiểm</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Vĩ độ
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Kinh độ
                </label>
                <input
                  type="number"
                  step="0.000001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Bán kính: {formatRadius(formData.radius)}
              </label>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={formData.radius}
                onChange={(e) => setFormData({ ...formData, radius: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>50m</span>
                <span>5km</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Nội dung thông báo
              </label>
              <textarea
                value={formData.notification}
                onChange={(e) => setFormData({ ...formData, notification: e.target.value })}
                placeholder="Nhập nội dung thông báo khi vào khu vực..."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Kích hoạt
                </label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    formData.enabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      formData.enabled ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Kích hoạt khi
                </label>
                <select
                  value={formData.triggerOn}
                  onChange={(e) => setFormData({ ...formData, triggerOn: e.target.value as LocationZone['triggerOn'] })}
                  className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="enter">Vào khu vực</option>
                  <option value="exit">Ra khỏi khu vực</option>
                  <option value="both">Cả hai</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
            <button
              type="button"
              onClick={editingId ? () => handleUpdate(editingId) : handleAdd}
              disabled={!formData.name || isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors"
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

      {/* Zones List */}
      <div className="space-y-3">
        {zones.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Chưa có khu vực thông báo nào
            </p>
          </div>
        ) : (
          zones.map((zone) => (
            <div
              key={zone.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                zone.enabled
                  ? `bg-gradient-to-br ${getTypeColor(zone.type)} border-opacity-30`
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  zone.enabled
                    ? 'bg-white text-white'
                    : 'bg-slate-200 dark:bg-slate-600'
                }`}>
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className={`font-semibold ${
                        zone.enabled
                          ? 'text-white'
                          : 'text-slate-700 dark:text-slate-300'
                      } text-sm`}>
                        {zone.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          zone.enabled ? 'bg-white bg-opacity-30 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400'
                        }`}>
                          {getTypeLabel(zone.type)}
                        </span>
                        {currentLocation && isUserInZone(zone) && (
                          <span className="px-2 py-0.5 bg-white bg-opacity-30 text-white text-[10px] font-bold rounded-full">
                            Đang ở đây
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleZone(zone.id, !zone.enabled)}
                      className={`relative w-8 h-4 rounded-full transition-colors ${
                        zone.enabled ? 'bg-white' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${
                          zone.enabled ? 'translate-x-4' : ''
                        }`}
                      />
                    </button>
                  </div>
                  <p className={`text-xs mb-2 ${
                    zone.enabled ? 'text-white text-opacity-90' : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {zone.notification}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Bán kính:</span>
                      <span>{formatRadius(zone.radius)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Tọa độ:</span>
                      <span>{zone.latitude.toFixed(4)}, {zone.longitude.toFixed(4)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Kích hoạt:</span>
                      <span>{zone.triggerOn === 'enter' ? 'Vào' : zone.triggerOn === 'exit' ? 'Ra' : 'Cả hai'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(zone)}
                    className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit className="h-3 w-3 text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(zone.id)}
                    className="p-1.5 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="h-3 w-3 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Zone Button */}
      <button
        type="button"
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg"
      >
        <Plus className="h-4 w-4" />
        Thêm khu vực thông báo
      </button>

      {/* Info Text */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Thông báo dựa trên vị trí sử dụng GPS của thiết bị để phát hiện khi bạn 
          vào/ra các khu vực đã thiết lập. Tính năng này tiêu pin, hãy cân nhắc khi sử dụng.
        </p>
      </div>
    </div>
  );
}