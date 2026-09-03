'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MapPin, Calendar, Edit, Trash2, ArrowLeft, Loader2, ImagePlus, X, ChevronLeft, ChevronRight, Maximize2, ChevronUp, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';

const MemoryMap = dynamic(() => import('@/components/Map'), { ssr: false });
import { memoriesApi, Memory } from '@/lib/memories-api';
import { useAuthStore } from '@/store/auth-store';

const MOOD_EMOJIS: Record<string, string> = {
  HAPPY: '😊',
  SAD: '😢',
  EXCITED: '🤩',
  PEACEFUL: '😌',
  NOSTALGIC: '🥹',
  LOVE: '❤️',
  ANGRY: '😡',
  TIRED: '😴',
  NEUTRAL: '😐',
};

export default function MemoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  
  const [memory, setMemory] = useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const loadMemory = async (id: string) => {
    try {
      setIsLoading(true);
      const data = await memoriesApi.getById(id);
      setMemory(data);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to load memory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    if (params.id) {
      loadMemory(params.id as string);
    }
  }, [isAuthenticated, router, params.id]);

  const handleDelete = async () => {
    if (!memory) return;
    
    setIsDeleting(true);
    setError('');
    try {
      await memoriesApi.delete(memory.id);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Xóa kỷ niệm thất bại');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!memory || !imageUrl.trim()) return;

    setIsUploadingImage(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      await memoriesApi.addImage(memory.id, imageUrl);
      setUploadProgress(100);
      setImageUrl('');
      setShowImageUpload(false);
      await loadMemory(memory.id);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to add image');
    } finally {
      clearInterval(progressInterval);
      setIsUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!memory) return;

    try {
      await memoriesApi.deleteImage(memory.id, imageId);
      await loadMemory(memory.id);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to delete image');
    }
  };

  const handleMoveImageUp = async (imageId: string, currentIndex: number) => {
    if (!memory || currentIndex === 0) return;

    try {
      const images = [...memory.images];
      const temp = images[currentIndex];
      images[currentIndex] = images[currentIndex - 1];
      images[currentIndex - 1] = temp;

      // Update orders
      await Promise.all([
        memoriesApi.updateImageOrder(memory.id, images[currentIndex].id, currentIndex),
        memoriesApi.updateImageOrder(memory.id, images[currentIndex - 1].id, currentIndex - 1),
      ]);

      await loadMemory(memory.id);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to reorder images');
    }
  };

  const handleMoveImageDown = async (imageId: string, currentIndex: number) => {
    if (!memory || currentIndex === memory.images.length - 1) return;

    try {
      const images = [...memory.images];
      const temp = images[currentIndex];
      images[currentIndex] = images[currentIndex + 1];
      images[currentIndex + 1] = temp;

      // Update orders
      await Promise.all([
        memoriesApi.updateImageOrder(memory.id, images[currentIndex].id, currentIndex),
        memoriesApi.updateImageOrder(memory.id, images[currentIndex + 1].id, currentIndex + 1),
      ]);

      await loadMemory(memory.id);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to reorder images');
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
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
          >
            Back to Dashboard
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
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/memories/${memory.id}/edit`)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400"
              title="Edit"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400"
              title="Delete"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto">
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Map */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
          <div className="h-80">
            <MemoryMap
              memories={[memory]}
              center={[memory.latitude, memory.longitude]}
              zoom={15}
            />
          </div>
        </div>

        {/* Memory Details */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
          {/* Title and Category */}
          <div>
            <div className="flex items-start gap-3 mb-2">
              <span className="text-3xl">{memory.category.icon}</span>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {memory.title}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {memory.category.name}
                </p>
              </div>
            </div>
          </div>

          {/* Date and Mood */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              <span>{new Date(memory.memoryDate).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="text-lg">
                {MOOD_EMOJIS[memory.mood] || '😐'}
              </span>
              <span>{memory.mood}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
            <MapPin className="h-4 w-4 mt-0.5" />
            <span>{memory.locationName || 'Unknown location'}</span>
          </div>

          {/* Content */}
          {memory.content && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {memory.content}
              </p>
            </div>
          )}

          {/* Images */}
          {memory.images && memory.images.length > 0 && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Photos
                </h3>
                <button
                  onClick={() => setShowImageUpload(true)}
                  className="flex items-center gap-1 text-sm text-primary dark:text-accent hover:text-primary-hover dark:hover:text-accent-light"
                >
                  <ImagePlus className="h-4 w-4" />
                  Add Photo
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {memory.images.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.imageUrl}
                      alt="Memory photo"
                      className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setShowLightbox(true);
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setShowLightbox(true);
                        }}
                        className="p-1 bg-blue-600 text-white rounded"
                        title="View fullscreen"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="p-1 bg-red-600 text-white rounded"
                        title="Delete"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="absolute left-2 bottom-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleMoveImageUp(image.id, index)}
                        disabled={index === 0}
                        className="p-1 bg-slate-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMoveImageDown(image.id, index)}
                        disabled={index === memory.images.length - 1}
                        className="p-1 bg-slate-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {memory.images && memory.images.length === 0 && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowImageUpload(true)}
                className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:border-primary dark:hover:border-accent hover:text-primary dark:hover:text-accent transition-colors"
              >
                <ImagePlus className="h-5 w-5" />
                Add Your First Photo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Add Photo
            </h3>
            <form onSubmit={handleAddImage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="https://example.com/image.jpg"
                  required
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Enter a direct URL to an image (e.g., from Imgur, Cloudinary, etc.)
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowImageUpload(false);
                    setImageUrl('');
                    setUploadProgress(0);
                  }}
                  disabled={isUploadingImage}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingImage}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Photo'
                  )}
                </button>
              </div>

              {isUploadingImage && uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Uploading...</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3 text-rose-600 dark:text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/50">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Xác nhận xóa kỷ niệm?
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa kỷ niệm này không? Toàn bộ nội dung và <strong>toàn bộ hình ảnh đính kèm</strong> sẽ bị xóa vĩnh viễn khỏi hệ thống và không thể hoàn tác.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 text-sm font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Xác nhận xóa</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {showLightbox && memory && memory.images.length > 0 && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : memory.images.length - 1))}
            className="absolute left-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button
            onClick={() => setCurrentImageIndex((prev) => (prev < memory.images.length - 1 ? prev + 1 : 0))}
            className="absolute right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div className="max-w-4xl max-h-[80vh] px-4">
            <img
              src={memory.images[currentImageIndex].imageUrl}
              alt={`Photo ${currentImageIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="text-center mt-4 text-white">
              <p className="text-sm">
                {currentImageIndex + 1} / {memory.images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
