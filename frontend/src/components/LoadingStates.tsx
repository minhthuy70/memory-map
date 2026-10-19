'use client';

import { useState, useEffect } from 'react';
import { Loader2, RefreshCw, Zap } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'slate';
  text?: string;
}

export function LoadingSpinner({ size = 'md', color = 'primary', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'border-t-purple-500',
    white: 'border-t-white',
    slate: 'border-t-slate-500',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`} />
      {text && <p className="text-sm text-slate-600 dark:text-slate-400">{text}</p>}
    </div>
  );
}

interface DotsLoaderProps {
  color?: string;
  size?: number;
}

export function DotsLoader({ color = '#667eea', size = 8 }: DotsLoaderProps) {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="rounded-full animate-bounce"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            animationDelay: `${index * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

interface PulseLoaderProps {
  color?: string;
  size?: number;
}

export function PulseLoader({ color = '#667eea', size = 40 }: PulseLoaderProps) {
  return (
    <div className="relative">
      <div
        className="rounded-full animate-ping absolute"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          opacity: 0.5,
        }}
      />
      <div
        className="rounded-full relative"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
        }}
      />
    </div>
  );
}

interface SkeletonCardProps {
  count?: number;
}

export function SkeletonCard({ count = 1 }: SkeletonCardProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm"
        >
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-shimmer w-3/4 mb-3" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-shimmer w-1/2 mb-2" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-shimmer w-2/3" />
        </div>
      ))}
    </div>
  );
}

interface SkeletonListProps {
  count?: number;
}

export function SkeletonList({ count = 5 }: SkeletonListProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-3 bg-white dark:bg-slate-800 rounded-lg"
        >
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full animate-shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-shimmer w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-shimmer w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface SkeletonGridProps {
  columns?: number;
  rows?: number;
}

export function SkeletonGrid({ columns = 3, rows = 2 }: SkeletonGridProps) {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: columns * rows }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden"
        >
          <div className="h-48 bg-slate-200 dark:bg-slate-700 animate-shimmer" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-shimmer w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-shimmer w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface ShimmerEffectProps {
  children: React.ReactNode;
  isLoading: boolean;
}

export function ShimmerEffect({ children, isLoading }: ShimmerEffectProps) {
  if (isLoading) {
    return (
      <div className="animate-shimmer bg-slate-200 dark:bg-slate-700 rounded-lg min-h-[100px]" />
    );
  }

  return <>{children}</>;
}

interface ProgressBarLoaderProps {
  progress: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  showText?: boolean;
}

export function ProgressBarLoader({ progress, color = 'primary', showText = true }: ProgressBarLoaderProps) {
  const colorClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500',
  };

  return (
    <div className="w-full">
      {showText && (
        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
          <span>Đang tải...</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

interface PageLoaderProps {
  text?: string;
}

export function PageLoader({ text = 'Đang tải...' }: PageLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-900">
      <div className="text-center">
        <div className="relative mb-4">
          <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 rounded-full" />
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
        <p className="text-slate-600 dark:text-slate-400">{text}</p>
      </div>
    </div>
  );
}

interface InfiniteScrollLoaderProps {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function InfiniteScrollLoader({ isLoading, hasMore, onLoadMore }: InfiniteScrollLoaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('infinite-scroll-trigger');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  if (!hasMore) return null;

  return (
    <div id="infinite-scroll-trigger" className="flex justify-center py-8">
      {isLoading ? (
        <LoadingSpinner text="Đang tải thêm..." />
      ) : (
        <button
          onClick={onLoadMore}
          className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Tải thêm</span>
        </button>
      )}
    </div>
  );
}

interface SpinLoaderProps {
  size?: number;
  speed?: number;
}

export function SpinLoader({ size = 40, speed = 1 }: SpinLoaderProps) {
  return (
    <div
      className="rounded-full border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent"
      style={{
        width: size,
        height: size,
        animation: `spin ${speed}s linear infinite`,
      }}
    />
  );
}

interface GlitchLoaderProps {
  text?: string;
}

export function GlitchLoader({ text = 'LOADING' }: GlitchLoaderProps) {
  return (
    <div className="relative inline-block">
      <span className="font-bold text-2xl text-slate-900 dark:text-white">{text}</span>
      <span
        className="absolute top-0 left-0 font-bold text-2xl text-purple-500 opacity-50"
        style={{
          animation: 'glitch 0.3s infinite',
        }}
      >
        {text}
      </span>
    </div>
  );
}
