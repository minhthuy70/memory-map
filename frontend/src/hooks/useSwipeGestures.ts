import { useRef, useEffect, useCallback } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeConfig {
  threshold?: number; // Minimum distance to trigger swipe (default: 50)
  preventDefault?: boolean; // Prevent default behavior (default: true)
}

export function useSwipeGestures(handlers: SwipeHandlers, config: SwipeConfig = {}) {
  const { threshold = 50, preventDefault = true } = config;
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const handlersRef = useRef(handlers);

  // Update handlers ref when handlers change
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (preventDefault) {
      // Don't prevent default on touch start to allow scrolling
    }
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, [preventDefault]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (preventDefault && touchStartRef.current) {
      // Only prevent default if we're detecting a potential swipe
      const deltaX = e.touches[0].clientX - touchStartRef.current.x;
      const deltaY = e.touches[0].clientY - touchStartRef.current.y;
      
      // If horizontal swipe is more dominant, prevent vertical scrolling
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        e.preventDefault();
      }
    }
  }, [preventDefault]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const deltaX = touchEnd.x - touchStartRef.current.x;
    const deltaY = touchEnd.y - touchStartRef.current.y;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine if it's a horizontal or vertical swipe
    if (Math.max(absDeltaX, absDeltaY) < threshold) {
      touchStartRef.current = null;
      return;
    }

    // Trigger appropriate handler
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (deltaX > 0) {
        handlersRef.current.onSwipeRight?.();
      } else {
        handlersRef.current.onSwipeLeft?.();
      }
    } else {
      // Vertical swipe
      if (deltaY > 0) {
        handlersRef.current.onSwipeDown?.();
      } else {
        handlersRef.current.onSwipeUp?.();
      }
    }

    touchStartRef.current = null;
  }, [threshold]);

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    node.addEventListener('touchstart', handleTouchStart, { passive: !preventDefault });
    node.addEventListener('touchmove', handleTouchMove, { passive: !preventDefault });
    node.addEventListener('touchend', handleTouchEnd);

    return () => {
      node.removeEventListener('touchstart', handleTouchStart);
      node.removeEventListener('touchmove', handleTouchMove);
      node.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventDefault]);

  return ref;
}
