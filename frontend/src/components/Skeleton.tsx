'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-700';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      role="status"
      aria-label="Loading..."
    />
  );
}

// Pre-built skeleton components for common use cases

export function MemoryCardSkeleton() {
  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-700/60 rounded-xl border border-slate-200/60 dark:border-slate-600/60">
      <div className="flex items-start gap-2.5">
        <Skeleton variant="circular" width={32} height={32} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="70%" height={16} />
          <Skeleton variant="text" width="90%" height={12} />
          <div className="flex items-center gap-2">
            <Skeleton variant="text" width={60} height={10} />
            <Skeleton variant="text" width={40} height={10} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatisticsCardSkeleton() {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600">
      <Skeleton variant="text" width="40%" height={14} className="mb-2" />
      <Skeleton variant="text" width="30%" height={24} />
    </div>
  );
}

export function MemoryListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <MemoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatisticsCardSkeleton />
        <StatisticsCardSkeleton />
        <StatisticsCardSkeleton />
        <StatisticsCardSkeleton />
      </div>

      {/* Memory List */}
      <div>
        <Skeleton variant="text" width="30%" height={16} className="mb-2" />
        <MemoryListSkeleton count={5} />
      </div>
    </div>
  );
}
