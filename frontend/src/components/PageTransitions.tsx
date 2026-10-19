'use client';

import React, { useState, useEffect } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  type?: 'fade' | 'slide' | 'scale' | 'blur';
  duration?: number;
}

export function PageTransition({ children, type = 'fade', duration = 300 }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const transitionClasses = {
    fade: 'opacity-0 transition-opacity',
    slide: 'opacity-0 translate-y-4 transition-all',
    scale: 'opacity-0 scale-95 transition-all',
    blur: 'opacity-0 blur-sm transition-all',
  };

  const activeClasses = {
    fade: 'opacity-100',
    slide: 'opacity-100 translate-y-0',
    scale: 'opacity-100 scale-100',
    blur: 'opacity-100 blur-0',
  };

  return (
    <div
      className={`${transitionClasses[type]} ${isVisible ? activeClasses[type] : ''}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

interface RippleContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function RippleContainer({ children, className = '' }: RippleContainerProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples([...ripples, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '0',
            height: '0',
            animation: 'ripple 0.6s ease-out',
          }}
        />
      ))}
    </div>
  );
}

interface MorphingCardProps {
  children: React.ReactNode;
  expanded?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function MorphingCard({ children, expanded = false, onToggle, className = '' }: MorphingCardProps) {
  return (
    <div
      onClick={onToggle}
      className={`
        transition-all duration-500 ease-in-out
        cursor-pointer
        ${expanded ? 'scale-105 shadow-2xl' : 'scale-100 shadow-lg'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface StaggeredListProps {
  children: React.ReactNode;
  stagger?: number;
  className?: string;
}

export function StaggeredList({ children, stagger = 100, className = '' }: StaggeredListProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={`transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: `${index * stagger}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  className?: string;
}

export function FloatingElement({ children, delay = 0, distance = 10, className = '' }: FloatingElementProps) {
  return (
    <div
      className={`animate-float ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        '--tw-translate-y': `-${distance}px`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

interface RotateOnScrollProps {
  children: React.ReactNode;
  rotation?: number;
  className?: string;
}

export function RotateOnScroll({ children, rotation = 360, className = '' }: RotateOnScrollProps) {
  const [currentRotation, setCurrentRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newRotation = (scrollY / window.innerHeight) * rotation;
      setCurrentRotation(newRotation);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [rotation]);

  return (
    <div
      className={`transition-transform duration-100 ${className}`}
      style={{ transform: `rotate(${currentRotation}deg)` }}
    >
      {children}
    </div>
  );
}

interface ParallaxScrollProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxScroll({ children, speed = 0.5, className = '' }: ParallaxScrollProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * speed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      className={`transition-transform duration-100 ${className}`}
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  );
}
