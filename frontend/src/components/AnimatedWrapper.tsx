'use client';

import { useEffect, useState } from 'react';

interface AnimatedWrapperProps {
  children: React.ReactNode;
  animation?: 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'slide-in-left' | 'slide-in-right' | 'scale-in';
  delay?: number;
  className?: string;
}

export function AnimatedWrapper({
  children,
  animation = 'fade-in',
  delay = 0,
  className = '',
}: AnimatedWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const animationClasses = {
    'fade-in': 'animate-fade-in',
    'fade-in-up': 'animate-fade-in-up',
    'fade-in-down': 'animate-fade-in-down',
    'slide-in-left': 'animate-slide-in-left',
    'slide-in-right': 'animate-slide-in-right',
    'scale-in': 'animate-scale-in',
  };

  return (
    <div
      className={`${animationClasses[animation]} ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}
    >
      {children}
    </div>
  );
}

interface HoverScaleProps {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}

export function HoverScale({ children, scale = 1.05, className = '' }: HoverScaleProps) {
  return (
    <div
      className={`transition-transform duration-300 hover:scale-${scale} ${className}`}
      style={{ '--tw-scale-x': scale, '--tw-scale-y': scale } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

interface GlowEffectProps {
  children: React.ReactNode;
  color?: 'blue' | 'purple' | 'pink' | 'green' | 'yellow';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export function GlowEffect({ children, color = 'purple', intensity = 'medium', className = '' }: GlowEffectProps) {
  const glowColors = {
    blue: 'shadow-blue-500/50',
    purple: 'shadow-purple-500/50',
    pink: 'shadow-pink-500/50',
    green: 'shadow-green-500/50',
    yellow: 'shadow-yellow-500/50',
  };

  const intensityClasses = {
    low: 'shadow-lg',
    medium: 'shadow-2xl',
    high: 'shadow-[0_0_50px_rgba(168,85,247,0.5)]',
  };

  return (
    <div
      className={`transition-all duration-300 hover:${glowColors[color]} ${intensityClasses[intensity]} ${className}`}
    >
      {children}
    </div>
  );
}

interface ParallaxCardProps {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
}

export function ParallaxCard({ children, intensity = 20, className = '' }: ParallaxCardProps) {
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / intensity;
    const y = (e.clientY - rect.top - rect.height / 2) / intensity;
    setTransform({ x, y });
  };

  const handleMouseLeave = () => {
    setTransform({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ${className}`}
      style={{
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }}
    >
      {children}
    </div>
  );
}

interface TiltCardProps {
  children: React.ReactNode;
  maxTilt?: number;
  className?: string;
}

export function TiltCard({ children, maxTilt = 15, className = '' }: TiltCardProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * maxTilt;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * maxTilt;
    setRotation({ x: -y, y: x });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
      }}
    >
      {children}
    </div>
  );
}
