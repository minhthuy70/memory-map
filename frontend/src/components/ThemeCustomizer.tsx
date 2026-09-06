'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Palette, RotateCcw, Check } from 'lucide-react';
import ColorPicker from './ColorPicker';

export default function ThemeCustomizer() {
  const { customColors, setCustomColors, resetCustomColors } = useTheme();
  const [tempColors, setTempColors] = React.useState(customColors);
  const [showPreview, setShowPreview] = React.useState(false);

  const handleApply = () => {
    setCustomColors(tempColors);
    setShowPreview(true);
    setTimeout(() => setShowPreview(false), 2000);
  };

  const handleReset = () => {
    resetCustomColors();
    setTempColors({
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#ec4899',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
            Tùy chỉnh màu theme
          </h3>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-4">
        <ColorPicker
          label="Màu chính (Primary)"
          value={tempColors.primary}
          onChange={(color) => setTempColors({ ...tempColors, primary: color })}
        />
        
        <ColorPicker
          label="Màu phụ (Secondary)"
          value={tempColors.secondary}
          onChange={(color) => setTempColors({ ...tempColors, secondary: color })}
        />
        
        <ColorPicker
          label="Màu nhấn (Accent)"
          value={tempColors.accent}
          onChange={(color) => setTempColors({ ...tempColors, accent: color })}
        />
      </div>

      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={handleApply}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-colors"
        >
          {showPreview ? (
            <>
              <Check className="h-4 w-4" />
              <span>Đã áp dụng!</span>
            </>
          ) : (
            <>
              <Palette className="h-4 w-4" />
              <span>Áp dụng màu theme</span>
            </>
          )}
        </button>
      </div>

      <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
        <p>• Chọn màu từ bảng màu hoặc nhập mã hex</p>
        <p>• Màu theme sẽ được áp dụng cho toàn bộ ứng dụng</p>
        <p>• Nhấn Reset để quay về màu mặc định</p>
      </div>
    </div>
  );
}