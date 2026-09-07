'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Calendar, Image, AlertCircle, Lock, Clock, Share2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const MemoryMap = dynamic(() => import('@/components/Map'), { ssr: false });
import { memoriesApi, Memory } from '@/lib/memories-api';
import ThemeToggle from '@/components/ThemeToggle';

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

export default function PublicMemoryPage() {
  const params = useParams();
  const router = useRouter();
  const [memory, setMemory] = useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPublicMemory = async () => {
      if (!params.slug) return;

      try {
        setIsLoading(true);
        const data = await memoriesApi.getPublicMemory(params.slug as string);
        setMemory(data);
      } catch (err: unknown) {
        const message = (err as Error)?.message || 'Không thể tải kỷ niệm công khai';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPublicMemory();
  }, [params.slug]);

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      if (navigator.share) {
        try {
          await navigator.share({
            title: memory?.title || 'Kỷ niệm từ Memory Map',
            text: memory?.content || 'Xem kỷ niệm này trên Memory Map',
            url,
          });
        } catch (error) {
          console.error('Error sharing:', error);
        }
      } else {
        await navigator.clipboard.writeText(url);
        alert('Đã sao chép link!');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 dark:text-slate-400 text-sm">Đang tải kỷ niệm...</p>
        </div>
      </div>
    );
  }

  if (error || !memory) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center mx-auto mb-4 text-amber-500">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Không thể truy cập kỷ niệm
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            {error || 'Link công khai này không tồn tại, đã hết hạn hoặc đã bị hủy.'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover font-semibold text-sm transition-all shadow-xs cursor-pointer"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              Memory Map
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
              Công khai
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleShare}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400"
              title="Chia sẻ"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto">
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
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-700">
            <div className="space-y-2 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light border border-primary/20">
                <span className="text-base">{memory.category.icon}</span>
                <span>{memory.category.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {memory.title}
              </h1>
            </div>

            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
              <span className="text-3xl">{MOOD_EMOJIS[memory.mood] || '😐'}</span>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 block text-slate-500 dark:text-slate-400">
                  Tâm trạng
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {memory.mood}
                </span>
              </div>
            </div>
          </div>

          {/* Expiry Info */}
          {memory.publicExpiresAt && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm text-amber-700 dark:text-amber-400">
                Link công khai sẽ hết hạn vào {new Date(memory.publicExpiresAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          )}

          {/* Date and Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200/60 dark:border-slate-700">
            <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
              <Calendar className="h-4 w-4 text-primary shrink-0" />
              <span>
                <span className="text-slate-400 dark:text-slate-500 mr-1.5">Ngày:</span>
                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                  {new Date(memory.memoryDate).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
              <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
              <span className="truncate">
                <span className="text-slate-400 dark:text-slate-500 mr-1.5">Địa điểm:</span>
                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                  {memory.locationName || `${memory.latitude.toFixed(4)}, ${memory.longitude.toFixed(4)}`}
                </strong>
              </span>
            </div>
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
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span>Photos</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {memory.images.map((image, index) => (
                  <div key={image.id} className="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700">
                    <img
                      src={image.imageUrl}
                      alt={`Memory photo ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://placehold.co/600x400?text=L%E1%BB%97i+%E1%BA%A3nh';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Được chia sẻ công khai qua Memory Map
              </p>
              <button
                onClick={() => router.push('/')}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Tạo kỷ niệm của bạn &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
