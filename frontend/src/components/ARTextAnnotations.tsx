'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  as,
  BarChart3,
  Bold,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Filter,
  Italic,
  Layers,
  Link2,
  Maximize2,
  Minus,
  MoveHorizontal,
  MoveVertical,
  Palette,
  Pause,
  Play,
  Plus,
  PlusIcon,
  RefreshCw,
  RotateCw,
  Settings,
  SettingsIcon,
  Sparkles,
  Text,
  TextIcon,
  TextLucide,
  Trash2,
  TrashIcon,
  Type,
  Underline,
  Zap,
  ZapIcon,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface ARAnnotation {
  id: string;
  photoId: string;
  text: string;
  position: { x: number; y: number; z: number };
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  textAlign: 'left' | 'center' | 'right';
  color: string;
  backgroundColor: string;
  opacity: number;
  isLocked: boolean;
  isVisible: boolean;
  isFloating: boolean;
}

interface ARTextAnnotationsProps {
  onCancel?: () => void;
  onAddAnnotation?: (annotation: Partial<ARAnnotation>) => Promise<void>;
  onRemoveAnnotation?: (annotationId: string) => Promise<void>;
  onUpdateAnnotation?: (annotationId: string, updates: Partial<ARAnnotation>) => Promise<void>;
}

const DEFAULT_ANNOTATIONS: ARAnnotation[] = [
  {
    id: 'annotation-1',
    photoId: 'photo-1',
    text: 'Beautiful morning mist',
    position: { x: 20, y: 30, z: 1 },
    fontSize: 24,
    fontFamily: 'Arial',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
    color: '#FFFFFF',
    backgroundColor: '#00000080',
    opacity: 100,
    isLocked: false,
    isVisible: true,
    isFloating: true,
  },
  {
    id: 'annotation-2',
    photoId: 'photo-1',
    text: 'This is where it happened',
    position: { x: 60, y: 70, z: 1 },
    fontSize: 18,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fontStyle: 'italic',
    textDecoration: 'underline',
    textAlign: 'center',
    color: '#FFD700',
    backgroundColor: '#00000080',
    opacity: 90,
    isLocked: false,
    isVisible: true,
    isFloating: true,
  },
];

const FONT_FAMILIES = ['Arial', 'Times New Roman', 'Georgia', 'Verdana', 'Courier New', 'Comic Sans MS'];

export default function ARTextAnnotations({ onCancel, onAddAnnotation, onRemoveAnnotation, onUpdateAnnotation }: ARTextAnnotationsProps) {
  const [annotations, setAnnotations] = useState<ARAnnotation[]>(DEFAULT_ANNOTATIONS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<ARAnnotation | null>(DEFAULT_ANNOTATIONS[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const totalAnnotations = annotations.length;
  const visibleAnnotations = annotations.filter(a => a.isVisible).length;
  const lockedAnnotations = annotations.filter(a => a.isLocked).length;
  const floatingAnnotations = annotations.filter(a => a.isFloating).length;

  const handleAddAnnotation = async (annotation: Partial<ARAnnotation>) => {
    await onAddAnnotation?.(annotation);
    const newAnnotation: ARAnnotation = {
      id: `annotation-${Date.now()}`,
      photoId: annotation.photoId || 'photo-1',
      text: annotation.text || 'New annotation',
      position: annotation.position || { x: 50, y: 50, z: 1 },
      fontSize: annotation.fontSize || 24,
      fontFamily: annotation.fontFamily || 'Arial',
      fontWeight: annotation.fontWeight || 'normal',
      fontStyle: annotation.fontStyle || 'normal',
      textDecoration: annotation.textDecoration || 'none',
      textAlign: annotation.textAlign || 'left',
      color: annotation.color || '#FFFFFF',
      backgroundColor: annotation.backgroundColor || '#00000080',
      opacity: annotation.opacity || 100,
      isLocked: false,
      isVisible: true,
      isFloating: true,
    };
    setAnnotations([newAnnotation, ...annotations]);
    setIsAdding(false);
  };

  const handleRemoveAnnotation = async (annotationId: string) => {
    await onRemoveAnnotation?.(annotationId);
    setAnnotations(annotations.filter(a => a.id !== annotationId));
  };

  const handleUpdateAnnotation = async (annotationId: string, updates: Partial<ARAnnotation>) => {
    await onUpdateAnnotation?.(annotationId, updates);
    setAnnotations(annotations.map(a => 
      a.id === annotationId ? { ...a, ...updates } : a
    ));
  };

  const handleToggleVisibility = (annotationId: string) => {
    setAnnotations(annotations.map(a => 
      a.id === annotationId ? { ...a, isVisible: !a.isVisible } : a
    ));
  };

  const handleToggleLock = (annotationId: string) => {
    setAnnotations(annotations.map(a => 
      a.id === annotationId ? { ...a, isLocked: !a.isLocked } : a
    ));
  };

  const handleToggleFloating = (annotationId: string) => {
    setAnnotations(annotations.map(a => 
      a.id === annotationId ? { ...a, isFloating: !a.isFloating } : a
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Type className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Ghi chú AR 3D floating trên ảnh
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalAnnotations} annotations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Cài đặt"
          >
            <SettingsIcon className="h-4 w-4 text-slate-500" />
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Đóng"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt AR text annotations
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-save changes
              </span>
              <button
                type="button"
                onClick={() => setAutoSave(!autoSave)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoSave ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoSave ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                3D floating mode
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Text rendering
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Type className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Annotations</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalAnnotations}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Visible</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {visibleAnnotations}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Floating</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {floatingAnnotations}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Minus className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Locked</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {lockedAnnotations}
          </div>
        </div>
      </div>

      {/* Add Annotation */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          {isAdding ? 'Cancel' : 'Add New Annotation'}
        </button>

        {isAdding && (
          <div className="mt-4 p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Text
                </label>
                <textarea
                  placeholder="Enter annotation text"
                  rows={3}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Font Family
                </label>
                <select className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                  {FONT_FAMILIES.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                    Text Color
                  </label>
                  <input
                    type="color"
                    defaultValue="#FFFFFF"
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                    Background Color
                  </label>
                  <input
                    type="color"
                    defaultValue="#00000080"
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleAddAnnotation({})}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Check className="h-4 w-4" />
                Add Annotation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Annotation Editor */}
      {selectedAnnotation && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Annotation Editor
              </span>
              <div className="flex items-center gap-2">
                {selectedAnnotation.isLocked && (
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-semibold rounded-full">
                    Locked
                  </span>
                )}
                {selectedAnnotation.isFloating && (
                  <span className="px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-[10px] font-semibold rounded-full">
                    3D Floating
                  </span>
                )}
              </div>
            </div>

            {/* Photo Canvas */}
            <div className="aspect-video bg-slate-200 dark:bg-slate-600 rounded-lg mb-3 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <TextIcon className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Photo Canvas
                  </p>
                </div>
              </div>

              {/* Annotations */}
              {annotations.filter(a => a.isVisible).map((annotation) => (
                <div
                  key={annotation.id}
                  className={`absolute cursor-move ${selectedAnnotation.id === annotation.id ? 'ring-2 ring-purple-500' : ''}`}
                  style={{
                    left: `${annotation.position.x}%`,
                    top: `${annotation.position.y}%`,
                    fontSize: `${annotation.fontSize}px`,
                    fontFamily: annotation.fontFamily,
                    fontWeight: annotation.fontWeight,
                    fontStyle: annotation.fontStyle,
                    textDecoration: annotation.textDecoration,
                    textAlign: annotation.textAlign,
                    color: annotation.color,
                    backgroundColor: annotation.backgroundColor,
                    opacity: annotation.opacity / 100,
                    transform: `translateZ(${annotation.position.z}px)`,
                  }}
                  onClick={() => setSelectedAnnotation(annotation)}
                >
                  {annotation.text}
                </div>
              ))}
            </div>

            {/* Text Controls */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Text
                </label>
                <textarea
                  value={selectedAnnotation.text}
                  onChange={(e) => handleUpdateAnnotation(selectedAnnotation.id, { text: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateAnnotation(selectedAnnotation.id, { fontWeight: selectedAnnotation.fontWeight === 'bold' ? 'normal' : 'bold' })}
                  className={`p-2 rounded-lg transition-colors ${selectedAnnotation.fontWeight === 'bold' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'}`}
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateAnnotation(selectedAnnotation.id, { fontStyle: selectedAnnotation.fontStyle === 'italic' ? 'normal' : 'italic' })}
                  className={`p-2 rounded-lg transition-colors ${selectedAnnotation.fontStyle === 'italic' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'}`}
                >
                  <Italic className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateAnnotation(selectedAnnotation.id, { textDecoration: selectedAnnotation.textDecoration === 'underline' ? 'none' : 'underline' })}
                  className={`p-2 rounded-lg transition-colors ${selectedAnnotation.textDecoration === 'underline' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'}`}
                >
                  <Underline className="h-4 w-4" />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateAnnotation(selectedAnnotation.id, { textAlign: 'left' })}
                  className={`flex-1 p-2 rounded-lg transition-colors ${selectedAnnotation.textAlign === 'left' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'}`}
                >
                  <AlignLeft className="h-4 w-4 mx-auto" />
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateAnnotation(selectedAnnotation.id, { textAlign: 'center' })}
                  className={`flex-1 p-2 rounded-lg transition-colors ${selectedAnnotation.textAlign === 'center' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'}`}
                >
                  <AlignCenter className="h-4 w-4 mx-auto" />
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateAnnotation(selectedAnnotation.id, { textAlign: 'right' })}
                  className={`flex-1 p-2 rounded-lg transition-colors ${selectedAnnotation.textAlign === 'right' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'}`}
                >
                  <AlignRight className="h-4 w-4 mx-auto" />
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Font Size</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {selectedAnnotation.fontSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={selectedAnnotation.fontSize}
                  onChange={(e) => handleUpdateAnnotation(selectedAnnotation.id, { fontSize: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Opacity</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {selectedAnnotation.opacity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedAnnotation.opacity}
                  onChange={(e) => handleUpdateAnnotation(selectedAnnotation.id, { opacity: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleLock(selectedAnnotation.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  {selectedAnnotation.isLocked ? (
                    <>
                      <Minus className="h-3 w-3" />
                      Unlock
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-3 w-3" />
                      Lock
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleFloating(selectedAnnotation.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  {selectedAnnotation.isFloating ? (
                    <>
                      <ArrowDown className="h-3 w-3" />
                      2D
                    </>
                  ) : (
                    <>
                      <ArrowUp className="h-3 w-3" />
                      3D
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Annotation List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          AR Text Annotations
        </h4>
        <div className="space-y-2">
          {annotations.map((annotation) => (
            <div
              key={annotation.id}
              className={`p-4 rounded-lg border-2 ${
                selectedAnnotation?.id === annotation.id
                  ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800'
                  : annotation.isVisible
                  ? 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                  : 'bg-slate-100 dark:bg-slate-600/50 border-slate-300 dark:border-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                    <TextLucide className="h-6 w-6 text-slate-400" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                      {annotation.text}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {annotation.fontFamily}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {annotation.isLocked && (
                    <Minus className="h-4 w-4 text-purple-500" />
                  )}
                  {annotation.isFloating && (
                    <ArrowUp className="h-4 w-4 text-pink-500" />
                  )}
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(annotation.id)}
                    className="p-1"
                  >
                    {annotation.isVisible ? (
                      <Eye className="h-3 w-3 text-slate-400" />
                    ) : (
                      <EyeOff className="h-3 w-3 text-slate-400" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveAnnotation(annotation.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <TrashIcon className="h-3 w-3 text-red-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Font Size</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {annotation.fontSize}px
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Align</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 capitalize">
                    {annotation.textAlign}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Opacity</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {annotation.opacity}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Position</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {annotation.position.x}%, {annotation.position.y}%
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAnnotation(annotation)}
                className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-xs font-semibold rounded-lg transition-colors"
              >
                <Sparkles className="h-3 w-3" />
                Edit Annotation
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> Ghi chú AR 3D floating trên ảnh với 3D floating mode, text positioning (x/y/z), font family selection, font styling (bold/italic/underline), text alignment (left/center/right), color customization, background color, opacity adjustment, lock/unlock annotations, visibility toggle, và comprehensive AR text annotation system.
        </p>
      </div>
    </div>
  );
}