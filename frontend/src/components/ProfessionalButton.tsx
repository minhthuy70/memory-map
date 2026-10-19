'use client';

import { useState } from 'react';
import { Loader2, Sparkles, ArrowRight, Download, Share2, Heart } from 'lucide-react';

interface ProfessionalButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  className?: string;
  ripple?: boolean;
}

export function ProfessionalButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'right',
  onClick,
  className = '',
  ripple = true,
}: ProfessionalButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const variantClasses = {
    primary: 'btn-primary bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white',
    secondary: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20',
    ghost: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const sizeIconClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        relative overflow-hidden
        font-medium rounded-xl
        transition-all duration-300
        flex items-center justify-center gap-2
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${isPressed ? 'scale-95' : 'hover:scale-105'}
        ${ripple ? 'ripple' : ''}
        ${className}
      `}
    >
      {loading && <Loader2 className={`animate-spin ${sizeIconClasses[size]}`} />}
      {icon && iconPosition === 'left' && <span className={sizeIconClasses[size]}>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className={sizeIconClasses[size]}>{icon}</span>}
    </button>
  );
}

export function ActionButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <ProfessionalButton icon={<Sparkles />}>
        Tạo mới
      </ProfessionalButton>
      <ProfessionalButton variant="outline" icon={<Download />}>
        Tải xuống
      </ProfessionalButton>
      <ProfessionalButton variant="ghost" icon={<Share2 />}>
        Chia sẻ
      </ProfessionalButton>
      <ProfessionalButton variant="secondary" icon={<Heart />}>
        Yêu thích
      </ProfessionalButton>
    </div>
  );
}

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function MagneticButton({ children, onClick, className = '' }: MagneticButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative
        px-6 py-3
        bg-gradient-to-r from-purple-500 to-pink-500
        text-white
        rounded-full
        font-medium
        shadow-lg
        transition-transform duration-200
        hover:shadow-2xl
        ${className}
      `}
      style={{
        transform: `translate(${position.x * 0.2}px, ${position.y * 0.2}px)`,
      }}
    >
      {children}
    </button>
  );
}

interface NeumorphicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function NeumorphicButton({ children, onClick, className = '' }: NeumorphicButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-3
        bg-slate-100 dark:bg-slate-800
        text-slate-700 dark:text-slate-300
        rounded-2xl
        font-medium
        shadow-[4px_4px_8px_rgba(0,0,0,0.1),_-4px_-4px_8px_rgba(0,0,0,0.1)]
        hover:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),_inset_-4px_-4px_8px_rgba(0,0,0,0.1)]
        transition-all duration-300
        hover:text-purple-600
        dark:hover:text-purple-400
        ${className}
      `}
    >
      {children}
    </button>
  );
}

interface ThreeDButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ThreeDButton({ children, onClick, className = '' }: ThreeDButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-8 py-4
        bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500
        text-white
        rounded-2xl
        font-bold
        shadow-2xl
        transform-style: preserve-3d
        transition-all duration-500
        hover:rotate-x-12
        hover:rotate-y-12
        hover:shadow-purple-500/50
        ${className}
      `}
    >
      {children}
    </button>
  );
}
