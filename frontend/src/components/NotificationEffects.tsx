'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, XCircle } from 'lucide-react';

interface NotificationProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
}

export function Notification({
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          setTimeout(onClose, 300);
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-500',
      textColor: 'text-green-700 dark:text-green-300',
    },
    error: {
      icon: <XCircle className="w-5 h-5" />,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-500',
      textColor: 'text-red-700 dark:text-red-300',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5" />,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-700 dark:text-yellow-300',
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={`
        fixed top-4 right-4 z-50
        max-w-sm w-full
        ${config.bgColor}
        border-l-4 ${config.borderColor}
        rounded-lg shadow-2xl
        transition-all duration-300
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${config.textColor}`}>
            {config.icon}
          </div>
          <div className="ml-3 flex-1">
            <h3 className={`font-semibold ${config.textColor}`}>{title}</h3>
            {message && (
              <p className={`mt-1 text-sm ${config.textColor} opacity-80`}>
                {message}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              if (onClose) {
                setTimeout(onClose, 300);
              }
            }}
            className={`ml-3 flex-shrink-0 ${config.textColor} hover:opacity-70 transition-opacity`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        setTimeout(onClose, 300);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div
      className={`
        fixed bottom-4 left-1/2 -translate-x-1/2 z-50
        px-6 py-3 rounded-full shadow-2xl
        text-white font-medium
        transition-all duration-300
        ${typeClasses[type]}
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}
    >
      {message}
    </div>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  if (!isOpen) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50 backdrop-blur-sm
        transition-opacity duration-300
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={onClose}
    >
      <div
        className={`
          relative w-full ${sizeClasses[size]}
          bg-white dark:bg-slate-800
          rounded-2xl shadow-2xl
          transition-all duration-300
          ${isVisible ? 'scale-100' : 'scale-95'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

interface ProgressNotificationProps {
  progress: number;
  title: string;
  onComplete?: () => void;
}

export function ProgressNotification({ progress, title, onComplete }: ProgressNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 1000);
    }
  }, [progress, onComplete]);

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50
        w-80
        bg-white dark:bg-slate-800
        rounded-xl shadow-2xl
        p-4
        transition-all duration-300
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-slate-900 dark:text-white">{title}</span>
        <span className="text-sm text-slate-600 dark:text-slate-400">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
