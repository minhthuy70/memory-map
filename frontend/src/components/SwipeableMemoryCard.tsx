'use client';

import React from 'react';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Memory {
  id: string;
  title: string;
  content?: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  memoryDate: string;
  mood: string;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  images: {
    id: string;
    imageUrl: string;
    order: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface SwipeableMemoryCardProps {
  memories: Memory[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  children: (memory: Memory) => React.ReactNode;
}

export default function SwipeableMemoryCard({
  memories,
  currentIndex,
  onPrevious,
  onNext,
  children,
}: SwipeableMemoryCardProps) {
  const swipeRef = useSwipeGestures(
    {
      onSwipeLeft: () => {
        if (currentIndex < memories.length - 1) {
          onNext();
        }
      },
      onSwipeRight: () => {
        if (currentIndex > 0) {
          onPrevious();
        }
      },
    },
    { threshold: 50 }
  );

  if (memories.length === 0) {
    return null;
  }

  return (
    <div ref={swipeRef} className="relative w-full">
      {/* Memory Content */}
      <div className="transition-all duration-300 ease-in-out">
        {children(memories[currentIndex])}
      </div>

      {/* Navigation Indicators */}
      {memories.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10"
            aria-label="Kỷ niệm trước"
          >
            <ChevronLeft className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          </button>

          {/* Next Button */}
          <button
            onClick={onNext}
            disabled={currentIndex === memories.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10"
            aria-label="Kỷ niệm tiếp theo"
          >
            <ChevronRight className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {memories.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (index < currentIndex) {
                    onPrevious();
                  } else if (index > currentIndex) {
                    onNext();
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-primary w-6'
                    : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                }`}
                aria-label={`Kỷ niệm ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Swipe Hint */}
      {memories.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-xs text-slate-500 dark:text-slate-400 opacity-50">
          ← Vuốt để điều hướng →
        </div>
      )}
    </div>
  );
}
