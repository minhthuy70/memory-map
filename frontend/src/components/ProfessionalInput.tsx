'use client';

import { useState } from 'react';
import { Eye, EyeOff, Search, Calendar, MapPin, Mail, User, Lock, Phone } from 'lucide-react';

interface ProfessionalInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'search';
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  helperText?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  floatingLabel?: boolean;
}

export function ProfessionalInput({
  type = 'text',
  placeholder,
  label,
  icon,
  error,
  helperText,
  value,
  onChange,
  disabled = false,
  className = '',
  floatingLabel = false,
}: ProfessionalInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const iconMap = {
    email: <Mail className="w-5 h-5" />,
    password: <Lock className="w-5 h-5" />,
    search: <Search className="w-5 h-5" />,
    date: <Calendar className="w-5 h-5" />,
    tel: <Phone className="w-5 h-5" />,
  };

  const defaultIcon = icon || iconMap[type as keyof typeof iconMap];

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label
          className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
            error
              ? 'text-red-500'
              : isFocused
              ? 'text-purple-600'
              : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {defaultIcon && (
          <div
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              error
                ? 'text-red-500'
                : isFocused
                ? 'text-purple-600'
                : 'text-slate-400'
            }`}
          >
            {defaultIcon}
          </div>
        )}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`
            w-full
            px-4
            py-3
            rounded-xl
            border-2
            bg-white
            dark:bg-slate-800
            text-slate-900
            dark:text-white
            placeholder-slate-400
            dark:placeholder-slate-500
            transition-all duration-300
            input-focus
            ${defaultIcon ? 'pl-12' : ''}
            ${type === 'password' ? 'pr-12' : ''}
            ${error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : isFocused
              ? 'border-purple-500 focus:border-purple-500 focus:ring-purple-500/20'
              : 'border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-600'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-900' : ''}
          `}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 animate-fade-in">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
}

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({ placeholder = 'Tìm kiếm...', onSearch, className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 input-focus transition-all duration-300"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all duration-300"
      >
        Tìm kiếm
      </button>
    </form>
  );
}

interface TextAreaProps {
  placeholder?: string;
  label?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
  disabled?: boolean;
  className?: string;
}

export function TextArea({
  placeholder,
  label,
  error,
  value,
  onChange,
  rows = 4,
  disabled = false,
  className = '',
}: TextAreaProps) {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        rows={rows}
        disabled={disabled}
        className={`
          w-full
          px-4
          py-3
          rounded-xl
          border-2
          bg-white
          dark:bg-slate-800
          text-slate-900
          dark:text-white
          placeholder-slate-400
          dark:placeholder-slate-500
          resize-none
          input-focus
          transition-all duration-300
          ${error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-600'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-900' : ''}
        `}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 animate-fade-in">{error}</p>
      )}
    </div>
  );
}

interface SelectProps {
  label?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function Select({
  label,
  options,
  value,
  onChange,
  disabled = false,
  className = '',
  placeholder = 'Chọn...',
}: SelectProps) {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`
          w-full
          px-4
          py-3
          rounded-xl
          border-2
          bg-white
          dark:bg-slate-800
          text-slate-900
          dark:text-white
          input-focus
          transition-all duration-300
          border-slate-200
          dark:border-slate-700
          focus:border-purple-500
          dark:focus:border-purple-500
          focus:ring-purple-500/20
          ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-900' : ''}
        `}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
