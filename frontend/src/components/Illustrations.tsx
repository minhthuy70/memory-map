'use client';

import React from 'react';

interface IllustrationProps {
  type: 'empty' | 'error' | 'success' | 'loading' | 'no-results' | 'no-memories' | 'no-locations';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Illustrations({ type, className = '', size = 'md' }: IllustrationProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
  };

  const sizeClass = sizeClasses[size];

  const illustrations: Record<string, React.ReactNode> = {
    empty: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClass}>
        <circle cx="100" cy="100" r="80" fill="#E0E7FF" fillOpacity="0.3"/>
        <path d="M100 40V160M40 100H160" stroke="#6366F1" strokeWidth="8" strokeLinecap="round"/>
        <circle cx="100" cy="100" r="20" fill="#6366F1"/>
      </svg>
    ),
    error: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClass}>
        <circle cx="100" cy="100" r="80" fill="#FEE2E2" fillOpacity="0.3"/>
        <path d="M70 70L130 130M130 70L70 130" stroke="#EF4444" strokeWidth="8" strokeLinecap="round"/>
        <circle cx="100" cy="100" r="20" fill="#EF4444"/>
      </svg>
    ),
    success: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClass}>
        <circle cx="100" cy="100" r="80" fill="#D1FAE5" fillOpacity="0.3"/>
        <path d="M60 100L90 130L140 70" stroke="#10B981" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="100" cy="100" r="20" fill="#10B981"/>
      </svg>
    ),
    loading: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${sizeClass} animate-spin`}>
        <circle cx="100" cy="100" r="80" stroke="#E5E7EB" strokeWidth="8"/>
        <path d="M100 20A80 80 0 0 1 180 100" stroke="#6366F1" strokeWidth="8" strokeLinecap="round"/>
      </svg>
    ),
    'no-results': (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClass}>
        <circle cx="100" cy="100" r="80" fill="#FEF3C7" fillOpacity="0.3"/>
        <circle cx="70" cy="80" r="15" fill="#F59E0B"/>
        <circle cx="130" cy="80" r="15" fill="#F59E0B"/>
        <path d="M70 120Q100 140 130 120" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round"/>
        <circle cx="100" cy="100" r="20" fill="#F59E0B"/>
      </svg>
    ),
    'no-memories': (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClass}>
        <circle cx="100" cy="100" r="80" fill="#DBEAFE" fillOpacity="0.3"/>
        <path d="M60 60H140V140H60V60Z" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M60 80H140M60 100H140M60 120H140" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="100" cy="100" r="20" fill="#3B82F6"/>
      </svg>
    ),
    'no-locations': (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClass}>
        <circle cx="100" cy="100" r="80" fill="#E0E7FF" fillOpacity="0.3"/>
        <path d="M100 40C70 40 50 70 50 100C50 140 100 170 100 170C100 170 150 140 150 100C150 70 130 40 100 40Z" stroke="#6366F1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="100" cy="100" r="25" fill="#6366F1"/>
        <circle cx="100" cy="90" r="8" fill="white"/>
      </svg>
    ),
  };

  return (
    <div className={`flex items-center justify-center ${className}`} role="img" aria-label={`Illustration: ${type}`}>
      {illustrations[type] || illustrations.empty}
    </div>
  );
}
