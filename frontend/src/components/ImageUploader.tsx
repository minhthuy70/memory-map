'use client';

import React, { useState, useRef } from 'react';
import { ImagePlus, Trash2, X, AlertCircle, CheckCircle2, Loader2, Link as LinkIcon } from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const [inputUrl, setInputUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const uploadTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isValidUrl = (urlString: string) => {
    try {
      const url = new URL(urlString.trim());
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleCancelUpload = () => {
    if (uploadTimerRef.current) {
      clearInterval(uploadTimerRef.current);
      uploadTimerRef.current = null;
    }
    setIsUploading(false);
    setUploadProgress(0);
    setError('');
  };

  const handleAddImage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setError('');
    const trimmed = inputUrl.trim();

    if (!trimmed) {
      setError('Vui lòng nhập đường dẫn URL hình ảnh.');
      return;
    }

    if (images.length >= maxImages) {
      setError(`Đã đạt giới hạn tối đa ${maxImages} hình ảnh.`);
      return;
    }

    if (!isValidUrl(trimmed)) {
      setError('URL không hợp lệ. Vui lòng nhập link bắt đầu bằng http:// hoặc https://');
      return;
    }

    if (images.includes(trimmed)) {
      setError('Hình ảnh này đã có trong danh sách.');
      return;
    }

    // Start upload simulation with progress
    setIsUploading(true);
    setUploadProgress(15);

    let currentProgress = 15;
    uploadTimerRef.current = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 25) + 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setUploadProgress(100);
        if (uploadTimerRef.current) {
          clearInterval(uploadTimerRef.current);
          uploadTimerRef.current = null;
        }

        // Add to images after reaching 100%
        setTimeout(() => {
          onChange([...images, trimmed]);
          setInputUrl('');
          setIsUploading(false);
          setUploadProgress(0);
        }, 150);
      } else {
        setUploadProgress(currentProgress);
      }
    }, 80);
  };

  const handleDeleteImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
    if (error && images.length - 1 < maxImages) {
      setError('');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ImagePlus className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
            Hình ảnh kỷ niệm
          </h3>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            images.length >= maxImages
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
          }`}
        >
          {images.length} / {maxImages} ảnh (Tối đa {maxImages})
        </span>
      </div>

      {/* URL Input Form */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <LinkIcon className="h-4 w-4" />
            </div>
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddImage();
                }
              }}
              disabled={isUploading || images.length >= maxImages}
              placeholder="Dán đường dẫn ảnh (VD: https://images.unsplash.com/...)"
              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {inputUrl && !isUploading && (
              <button
                type="button"
                onClick={() => setInputUrl('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAddImage()}
              disabled={isUploading || !inputUrl.trim() || images.length >= maxImages}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang tải...</span>
                </>
              ) : (
                <>
                  <ImagePlus className="h-4 w-4" />
                  <span>Thêm ảnh</span>
                </>
              )}
            </button>

            {isUploading && (
              <button
                type="button"
                onClick={handleCancelUpload}
                className="px-3 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl transition-colors border border-rose-200 dark:border-rose-800 cursor-pointer"
                title="Hủy tải lên"
              >
                Hủy
              </button>
            )}
          </div>
        </div>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                <span>Đang xử lý tải ảnh lên...</span>
              </span>
              <span className="font-bold text-primary">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-150 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-xl">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Image Gallery Display (Grid layout 2-3 columns, responsive) */}
      {images.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Thư viện ảnh đã thêm ({images.length})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((url, index) => (
              <div
                key={index}
                className="group relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all"
              >
                {/* Image element with onError fallback */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Ảnh ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://placehold.co/600x400?text=L%E1%BB%97i+%E1%BA%A3nh';
                  }}
                />

                {/* Index badge */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/75 backdrop-blur-xs text-[11px] font-semibold text-white pointer-events-none">
                  #{index + 1}
                </div>

                {/* Delete button on hover / touch */}
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded-lg shadow-md opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:scale-110"
                  title="Xóa ảnh này"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
