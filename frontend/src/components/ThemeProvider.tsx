'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
}

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  customColors: CustomColors;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setCustomColors: (colors: CustomColors) => void;
  resetCustomColors: () => void;
}

const DEFAULT_COLORS: CustomColors = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#ec4899',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');
  const [customColors, setCustomColorsState] = useState<CustomColors>(DEFAULT_COLORS);

  const applyTheme = (targetTheme: Theme) => {
    let effectiveTheme: 'light' | 'dark' = 'light';

    if (targetTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    } else {
      effectiveTheme = targetTheme;
    }

    setActualTheme(effectiveTheme);

    const root = document.documentElement;
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const applyCustomColors = (colors: CustomColors) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
  };

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    const initialTheme: Theme = saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
    setThemeState(initialTheme);
    applyTheme(initialTheme);

    // Load custom colors
    const savedColors = localStorage.getItem('customColors');
    if (savedColors) {
      try {
        const parsedColors = JSON.parse(savedColors);
        setCustomColorsState(parsedColors);
        applyCustomColors(parsedColors);
      } catch (e) {
        console.error('Failed to parse custom colors:', e);
      }
    }

    // Listen to system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const currentSaved = localStorage.getItem('theme') as Theme | null;
      if (!currentSaved || currentSaved === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const next = actualTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  const setCustomColors = (colors: CustomColors) => {
    setCustomColorsState(colors);
    localStorage.setItem('customColors', JSON.stringify(colors));
    applyCustomColors(colors);
  };

  const resetCustomColors = () => {
    setCustomColors(DEFAULT_COLORS);
    localStorage.removeItem('customColors');
    applyCustomColors(DEFAULT_COLORS);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      actualTheme, 
      customColors,
      setTheme, 
      toggleTheme,
      setCustomColors,
      resetCustomColors,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
