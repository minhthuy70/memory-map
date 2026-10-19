'use client';

import React, { useState, useEffect } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-1.5 text-xs text-white bg-slate-900 dark:bg-slate-100 rounded-lg shadow-lg animate-fade-in ${positionClasses[position]}`}
        >
          {content}
        </div>
      )}
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

export function Skeleton({ className = '', height = 'h-4', width = 'w-full' }: SkeletonProps) {
  return (
    <div
      className={`${height} ${width} rounded bg-slate-200 dark:bg-slate-700 animate-shimmer ${className}`}
    />
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
}

export function ProgressBar({ value, max = 100, color = 'primary', showLabel = false }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const colorClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500',
    success: 'bg-gradient-to-r from-green-400 to-emerald-500',
    warning: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    danger: 'bg-gradient-to-r from-red-400 to-pink-500',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} animate-progress transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

export function Badge({ children, variant = 'primary', size = 'md', pulse = false }: BadgeProps) {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    info: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${pulse ? 'animate-pulse' : ''}`}
    >
      {children}
    </span>
  );
}

interface CardHoverProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHover({ children, className = '' }: CardHoverProps) {
  return (
    <div className={`card-hover bg-white dark:bg-slate-800 rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

interface GradientTextProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

export function GradientText({ children, variant = 'primary' }: GradientTextProps) {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
    secondary: 'bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent',
  };

  return (
    <span className={`font-bold ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'slate';
}

export function LoadingSpinner({ size = 'md', color = 'primary' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const colorClasses = {
    primary: 'border-t-blue-500',
    white: 'border-t-white',
    slate: 'border-t-slate-500',
  };

  return (
    <div className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`} />
  );
}

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
}

export function FadeIn({ children, delay = 0 }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {children}
    </div>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  stagger?: number;
}

export function Stagger({ children, stagger = 100 }: StaggerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="animate-fade-in">
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * stagger}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
