'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  MapPin, 
  Calendar, 
  Save, 
  X, 
  Loader2, 
  ImagePlus, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import dynamic from 'next/dynamic';

const MemoryMap = dynamic(() => import('@/components/Map'), { ssr: false });
import { memoriesApi, Memory, UpdateMemoryData } from '@/lib/memories-api';
import { categoriesApi } from '@/lib/categories-api';
import { useAuthStore } from '@/store/auth-store';

interface Category {
  id: string;
  name: string;
  icon: string;
}

const MOODS = [
  { value: 'HAPPY', emoji: '😊' },
  { value: 'SAD', emoji: '😢' },
  { value: 'EXCITED', emoji: '🤩' },
  { value: 'PEACEFUL', emoji: '😌' },
  { value: 'NOSTALGIC', emoji: '🥹' },
  { value: 'LOVE', emoji: '❤️' },
  { value: 'ANGRY', emoji: '😡' },
  { value: 'TIRED', emoji: '😴' },
  { value: 'NEUTRAL', emoji: '😐' },
];

export default function EditMemoryPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [memory, setMemory] = useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Image handling
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isAddingImage, setIsAddingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    latitude: 0,
    longitude: 0,
    locationName: '',
    memoryDate: '',
    mood: 'HAPPY',
    categoryId: '',
  });
  
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch {
      setError('Không thể tải danh sách danh mục');
    }
  };

  const loadMemory = async (id: string) => {
    try {
      setIsLoading(true);
      const data = await memoriesApi.getById(id);
      setMemory(data);
      setFormData({
        title: data.title,
        content: data.content || '',
        latitude: data.latitude,
        longitude: data.longitude,
        locationName: data.locationName || '',
        memoryDate: data.memoryDate.split('T')[0],
        mood: data.mood,
        categoryId: data.categoryId,
      });
      setSelectedLocation({ lat: data.latitude, lng: data.longitude });
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Không thể tải kỷ niệm');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    loadCategories();
    
    if (params.id) {
      loadMemory(params.id as string);
    }
  }, [isAuthenticated, router, params.id]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    setSelectedLocation({ lat, lng });
    setIsSelectingLocation(false);
  };

  const handleLocationName = (locationName: string) => {
    setFormData(prev => ({
      ...prev,
      locationName,
    }));
  };

  // Add new image to memory
  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memory || !newImageUrl.trim()) return;

    const trimmed = newImageUrl.trim();
    if (memory.images && memory.images.length >= 10) {
      setError('Đã đạt giới hạn tối đa 10 hình ảnh cho mỗi kỷ niệm.');
      return;
    }

    try {
      const url = new URL(trimmed);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        setError('URL không hợp lệ. Vui lòng nhập link bắt đầu bằng http:// hoặc https://');
        return;
      }
    } catch {
      setError('URL không hợp lệ. Vui lòng nhập link bắt đầu bằng http:// hoặc https://');
      return;
    }

    try {
      setIsAddingImage(true);
      setError('');
      await memoriesApi.addImage(memory.id, trimmed);
      setNewImageUrl('');
      // Reload memory to get updated images list
      const updated = await memoriesApi.getById(memory.id);
      setMemory(updated);
      setSuccessMessage('Thêm ảnh thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Không thể thêm ảnh');
    } finally {
      setIsAddingImage(false);
    }
  };

  // Delete image from memory
  const handleDeleteImage = async (imageId: string) => {
    if (!memory) return;
    try {
      setError('');
      await memoriesApi.deleteImage(memory.id, imageId);
      const updated = await memoriesApi.getById(memory.id);
      setMemory(updated);
      setSuccessMessage('Xóa ảnh thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Không thể xóa ảnh');
    }
  };

  // Reorder images - Move Up
  const handleMoveImageUp = async (currentIndex: number) => {
    if (!memory || currentIndex <= 0) return;

    try {
      setError('');
      const images = [...memory.images];
      const current = images[currentIndex];
      const prev = images[currentIndex - 1];

      await Promise.all([
        memoriesApi.updateImageOrder(memory.id, current.id, currentIndex - 1),
        memoriesApi.updateImageOrder(memory.id, prev.id, currentIndex),
      ]);

      const updated = await memoriesApi.getById(memory.id);
      setMemory(updated);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Không thể sắp xếp lại ảnh');
    }
  };

  // Reorder images - Move Down
  const handleMoveImageDown = async (currentIndex: number) => {
    if (!memory || currentIndex >= memory.images.length - 1) return;

    try {
      setError('');
      const images = [...memory.images];
      const current = images[currentIndex];
      const next = images[currentIndex + 1];

      await Promise.all([
        memoriesApi.updateImageOrder(memory.id, current.id, currentIndex + 1),
        memoriesApi.updateImageOrder(memory.id, next.id, currentIndex),
      ]);

      const updated = await memoriesApi.getById(memory.id);
      setMemory(updated);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Không thể sắp xếp lại ảnh');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Tiêu đề kỷ niệm không được để trống.');
      return;
    }

    if (formData.latitude === 0 && formData.longitude === 0) {
      setError('Vui lòng chọn vị trí trên bản đồ hoặc nhập tọa độ hợp lệ.');
      return;
    }
    
    if (!memory) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const updateData: UpdateMemoryData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        latitude: formData.latitude,
        longitude: formData.longitude,
        locationName: formData.locationName.trim(),
        memoryDate: formData.memoryDate,
        mood: formData.mood,
        categoryId: formData.categoryId,
      };
      
      await memoriesApi.update(memory.id, updateData);
      router.push(`/memories/${memory.id}`);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Cập nhật kỷ niệm thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-slate-600 dark:text-slate-400 animate-spin" />
      </div>
    );
  }

  if (error && !memory) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 max-w-md">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover font-semibold transition-all cursor-pointer"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!memory) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Hủy & Quay lại"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Chỉnh sửa kỷ niệm
            </h1>
          </div>

          <button
            type="button"
            onClick={() => router.push(`/memories/${memory.id}`)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-400 cursor-pointer"
            title="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto pb-16">
        {/* Error Alert */}
        {error && (
          <div className="mb-4 flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-medium animate-in fade-in">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Map & Coordinates Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Vị trí trên bản đồ</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setIsSelectingLocation(!isSelectingLocation)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    isSelectingLocation
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-primary text-white hover:bg-primary-hover'
                  }`}
                >
                  {isSelectingLocation ? 'Hủy chọn' : 'Đổi vị trí trên bản đồ'}
                </button>
              </div>

              {selectedLocation && (
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  Tọa độ đã chọn: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </p>
              )}

              {/* Manual Coordinate Input */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Vĩ độ (Latitude)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude || ''}
                    onChange={(e) => {
                      const lat = parseFloat(e.target.value);
                      setFormData({
                        ...formData,
                        latitude: isNaN(lat) ? 0 : lat,
                      });
                      if (!isNaN(lat) && formData.longitude !== 0) {
                        setSelectedLocation({
                          lat: lat,
                          lng: formData.longitude,
                        });
                      }
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                    placeholder="21.0285"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Kinh độ (Longitude)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude || ''}
                    onChange={(e) => {
                      const lng = parseFloat(e.target.value);
                      setFormData({
                        ...formData,
                        longitude: isNaN(lng) ? 0 : lng,
                      });
                      if (!isNaN(lng) && formData.latitude !== 0) {
                        setSelectedLocation({
                          lat: formData.latitude,
                          lng: lng,
                        });
                      }
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                    placeholder="105.8542"
                  />
                </div>
              </div>
            </div>

            <div className="h-80">
              <MemoryMap
                memories={[]}
                onLocationSelect={handleLocationSelect}
                onSelectMode={isSelectingLocation}
                center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [memory.latitude, memory.longitude]}
                zoom={13}
                showSearch={true}
                enableReverseGeocoding={true}
                onLocationName={handleLocationName}
                showCurrentLocationButton={true}
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tiêu đề kỷ niệm *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none text-sm"
                placeholder="Nhập tiêu đề kỷ niệm..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Nội dung chi tiết
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none text-sm"
                rows={4}
                placeholder="Ghi lại những cảm xúc và ký ức đẹp..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tên địa điểm
              </label>
              <input
                type="text"
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none text-sm"
                placeholder="VD: Hồ Hoàn Kiếm, Hà Nội"
              />
            </div>
          </div>

          {/* Date, Mood, Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Ngày kỷ niệm</span>
              </label>
              <input
                type="date"
                required
                value={formData.memoryDate}
                onChange={(e) => setFormData({ ...formData, memoryDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            {/* Mood */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tâm trạng
              </label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              >
                {MOODS.map((mood) => (
                  <option key={mood.value} value={mood.value}>
                    {mood.emoji} {mood.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Danh mục
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Manage Images Section (Add, Remove, Reorder) */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <ImagePlus className="h-5 w-5 text-primary" />
              <span>Quản lý hình ảnh ({memory.images?.length || 0} ảnh)</span>
            </h2>

            {/* Existing Images List with Reordering & Deletion */}
            {memory.images && memory.images.length > 0 ? (
              <div className="space-y-2">
                {memory.images.map((img, index) => (
                  <div
                    key={img.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-750 rounded-xl border border-slate-200 dark:border-slate-700 gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={img.imageUrl}
                        alt="Memory preview"
                        className="w-14 h-14 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image';
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                          Ảnh #{index + 1}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                          {img.imageUrl}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Move Up */}
                      <button
                        type="button"
                        onClick={() => handleMoveImageUp(index)}
                        disabled={index === 0}
                        className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        title="Di chuyển lên"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        onClick={() => handleMoveImageDown(index)}
                        disabled={index === memory.images.length - 1}
                        className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        title="Di chuyển xuống"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer ml-1"
                        title="Xóa ảnh"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-2">
                Chưa có ảnh nào cho kỷ niệm này. Bạn có thể thêm ảnh bằng cách nhập URL bên dưới.
              </p>
            )}

            {/* Add New Image Form */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Thêm ảnh mới (URL):
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  disabled={isAddingImage || !newImageUrl.trim()}
                  className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-xl hover:bg-slate-700 font-semibold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isAddingImage ? 'Đang thêm...' : 'Thêm ảnh'}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons: Save Changes & Cancel */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover font-bold text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Đang lưu thay đổi...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/memories/${memory.id}`)}
              className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold text-sm transition-colors cursor-pointer text-center"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
