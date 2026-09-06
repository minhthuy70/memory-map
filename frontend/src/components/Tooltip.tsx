'use client';

import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export default function Tooltip({ children, content, position = 'top', delay = 200 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 -translate-x-1/2 border-t-slate-900 dark:border-t-slate-100';
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 dark:border-b-slate-100';
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 border-l-slate-900 dark:border-l-slate-100';
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 border-r-slate-900 dark:border-r-slate-100';
      default:
        return 'top-full left-1/2 -translate-x-1/2 border-t-slate-900 dark:border-t-slate-100';
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded-lg shadow-lg whitespace-nowrap animate-in fade-in zoom-in duration-200 ${getPositionClasses()}`}
          role="tooltip"
        >
          {content}
          <div
            className={`absolute w-2 h-2 border-4 border-transparent ${getArrowClasses()}`}
          />
        </div>
      )}
    </div>
  );
}
