'use client';

import { useState } from 'react';
import { ChevronRight, MoreVertical, Heart, Share2, Bookmark } from 'lucide-react';

interface ModernCardProps {
  title: string;
  description?: string;
  image?: string;
  badge?: string;
  onAction?: () => void;
  children?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

export function ModernCard({
  title,
  description,
  image,
  badge,
  onAction,
  children,
  variant = 'default',
  size = 'md',
}: ModernCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const variantClasses = {
    default: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0',
    glass: 'bg-white/10 dark:bg-slate-900/10 backdrop-blur-lg border border-white/20 dark:border-slate-700/20',
  };

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`rounded-2xl shadow-lg card-hover transition-all duration-300 ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {image && (
        <div className="relative mb-4 overflow-hidden rounded-xl">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          />
          {badge && (
            <span className="absolute top-2 right-2 px-3 py-1 text-xs font-semibold bg-white/90 dark:bg-slate-900/90 rounded-full">
              {badge}
            </span>
          )}
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={`font-bold ${variant === 'gradient' ? 'text-white' : 'text-slate-900 dark:text-white'} text-lg`}>
            {title}
          </h3>
          {description && (
            <p className={`text-sm mt-1 ${variant === 'gradient' ? 'text-white/80' : 'text-slate-600 dark:text-slate-400'}`}>
              {description}
            </p>
          )}
        </div>
        <button
          className="p-1 hover:bg-white/10 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
          onClick={() => {}}
        >
          <MoreVertical className={`w-5 h-5 ${variant === 'gradient' ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
        </button>
      </div>

      {children && <div className="mt-4">{children}</div>}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-lg transition-colors ${
              isLiked
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                : variant === 'gradient'
                ? 'text-white/80 hover:bg-white/10'
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                : variant === 'gradient'
                ? 'text-white/80 hover:bg-white/10'
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <button
            className={`p-2 rounded-lg transition-colors ${
              variant === 'gradient'
                ? 'text-white/80 hover:bg-white/10'
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              variant === 'gradient'
                ? 'bg-white text-purple-600 hover:bg-white/90'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
            }`}
          >
            Chi tiết
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

interface MasonryGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
}

export function MasonryGrid({ children, columns = 3, gap = 4 }: MasonryGridProps) {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}

interface FloatingActionProps {
  icon: React.ReactNode;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  color?: 'primary' | 'secondary' | 'success' | 'danger';
}

export function FloatingAction({ icon, onClick, position = 'bottom-right', color = 'primary' }: FloatingActionProps) {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  const colorClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
    secondary: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600',
  };

  return (
    <button
      onClick={onClick}
      className={`fixed ${positionClasses[position]} w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white ${colorClasses[color]} transition-all duration-300 hover:scale-110 animate-float`}
    >
      {icon}
    </button>
  );
}
