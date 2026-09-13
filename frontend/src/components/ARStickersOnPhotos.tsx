'use client';

import { useState } from 'react';
import { X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Smile, RefreshCw, Check, Zap as ZapIcon, Plus, Layers, Sticker, Image as ImageIcon, Eye, EyeOff, Trash2 as TrashIcon, ExternalLink, MoveHorizontal, RotateCw, ZoomIn, ZoomOut, Maximize2, MoveVertical, Minus, Plus as PlusIcon, Sparkles, Palette, Download as DownloadIcon } from 'lucide-react';

interface ARSticker {
  id: string;
  photoId: string;
  title: string;
  emoji: string;
  position: { x: number; y: number };
  size: number;
  rotation: number;
  opacity: number;
  isLocked: boolean;
  isVisible: boolean;
  category: 'emoji' | 'custom' | 'animated';
}

interface ARStickersOnPhotosProps {
  onCancel?: () => void;
  onAddSticker?: (sticker: Partial<ARSticker>) => Promise<void>;
  onRemoveSticker?: (stickerId: string) => Promise<void>;
  onUpdateSticker?: (stickerId: string, updates: Partial<ARSticker>) => Promise<void>;
}

const DEFAULT_STICKERS: ARSticker[] = [
  {
    id: 'sticker-1',
    photoId: 'photo-1',
    title: 'Heart',
    emoji: '❤️',
    position: { x: 50, y: 50 },
    size: 48,
    rotation: 0,
    opacity: 100,
    isLocked: false,
    isVisible: true,
    category: 'emoji',
  },
  {
    id: 'sticker-2',
    photoId: 'photo-1',
    title: 'Star',
    emoji: '⭐',
    position: { x: 70, y: 30 },
    size: 36,
    rotation: 15,
    opacity: 90,
    isLocked: false,
    isVisible: true,
    category: 'emoji',
  },
];

const EMOJI_LIBRARY = [
  '❤️', '⭐', '🌟', '✨', '🎉', '🎊', '🎈', '🎁',
  '🌸', '🌺', '🌻', '🌹', '🍀', '🌈', '☀️', '🌙',
  '😊', '😂', '🥰', '😍', '🤩', '😎', '🥳', '🤗',
  '👍', '👏', '🙌', '👋', '✌️', '🤟', '👆', '👇',
];

export default function ARStickersOnPhotos({ onCancel, onAddSticker, onRemoveSticker, onUpdateSticker }: ARStickersOnPhotosProps) {
  const [stickers, setStickers] = useState<ARSticker[]>(DEFAULT_STICKERS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<ARSticker | null>(DEFAULT_STICKERS[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [showEmojiLibrary, setShowEmojiLibrary] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('❤️');
  const [autoSave, setAutoSave] = useState(true);

  const totalStickers = stickers.length;
  const visibleStickers = stickers.filter(s => s.isVisible).length;
  const lockedStickers = stickers.filter(s => s.isLocked).length;

  const handleAddSticker = async (sticker: Partial<ARSticker>) => {
    await onAddSticker?.(sticker);
    const newSticker: ARSticker = {
      id: `sticker-${Date.now()}`,
      photoId: sticker.photoId || 'photo-1',
      title: sticker.title || 'New Sticker',
      emoji: sticker.emoji || selectedEmoji,
      position: sticker.position || { x: 50, y: 50 },
      size: sticker.size || 48,
      rotation: sticker.rotation || 0,
      opacity: sticker.opacity || 100,
      isLocked: false,
      isVisible: true,
      category: sticker.category || 'emoji',
    };
    setStickers([newSticker, ...stickers]);
    setIsAdding(false);
  };

  const handleRemoveSticker = async (stickerId: string) => {
    await onRemoveSticker?.(stickerId);
    setStickers(stickers.filter(s => s.id !== stickerId));
  };

  const handleUpdateSticker = async (stickerId: string, updates: Partial<ARSticker>) => {
    await onUpdateSticker?.(stickerId, updates);
    setStickers(stickers.map(s => 
      s.id === stickerId ? { ...s, ...updates } : s
    ));
  };

  const handleToggleVisibility = (stickerId: string) => {
    setStickers(stickers.map(s => 
      s.id === stickerId ? { ...s, isVisible: !s.isVisible } : s
    ));
  };

  const handleToggleLock = (stickerId: string) => {
    setStickers(stickers.map(s => 
      s.id === stickerId ? { ...s, isLocked: !s.isLocked } : s
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl">
            <Smile className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Dán sticker AR lên ảnh kỷ niệm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalStickers} stickers
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
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt AR stickers
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
                  autoSave ? 'bg-yellow-500' : 'bg-slate-300 dark:bg-slate-600'
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
                AR sticker rendering
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Animated stickers
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
            <Sticker className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Stickers</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalStickers}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Visible</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {visibleStickers}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Locked</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {lockedStickers}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Palette className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Categories</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            3
          </div>
        </div>
      </div>

      {/* Add Sticker */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          {isAdding ? 'Cancel' : 'Add New Sticker'}
        </button>

        {isAdding && (
          <div className="mt-4 p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Sticker Name
                </label>
                <input
                  type="text"
                  placeholder="Sticker name"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Category
                </label>
                <select className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                  <option value="emoji">Emoji</option>
                  <option value="custom">Custom</option>
                  <option value="animated">Animated</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-2 block">
                  Select Emoji
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {EMOJI_LIBRARY.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`p-2 text-2xl rounded-lg transition-colors ${
                        selectedEmoji === emoji
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-500'
                          : 'bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleAddSticker({ emoji: selectedEmoji })}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Check className="h-4 w-4" />
                Add Sticker
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticker Editor */}
      {selectedSticker && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Sticker Editor
              </span>
              <div className="flex items-center gap-2">
                {selectedSticker.isLocked && (
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-[10px] font-semibold rounded-full">
                    Locked
                  </span>
                )}
              </div>
            </div>

            {/* Photo Canvas */}
            <div className="aspect-video bg-slate-200 dark:bg-slate-600 rounded-lg mb-3 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Photo Canvas
                  </p>
                </div>
              </div>

              {/* Stickers */}
              {stickers.filter(s => s.isVisible).map((sticker) => (
                <div
                  key={sticker.id}
                  className={`absolute cursor-move ${selectedSticker.id === sticker.id ? 'ring-2 ring-yellow-500' : ''}`}
                  style={{
                    left: `${sticker.position.x}%`,
                    top: `${sticker.position.y}%`,
                    fontSize: `${sticker.size}px`,
                    transform: `rotate(${sticker.rotation}deg)`,
                    opacity: sticker.opacity / 100,
                  }}
                  onClick={() => setSelectedSticker(sticker)}
                >
                  {sticker.emoji}
                </div>
              ))}
            </div>

            {/* Sticker Controls */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Size</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {selectedSticker.size}px
                  </span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="128"
                  value={selectedSticker.size}
                  onChange={(e) => handleUpdateSticker(selectedSticker.id, { size: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-yellow-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Rotation</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {selectedSticker.rotation}°
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={selectedSticker.rotation}
                  onChange={(e) => handleUpdateSticker(selectedSticker.id, { rotation: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-yellow-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Opacity</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {selectedSticker.opacity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedSticker.opacity}
                  onChange={(e) => handleUpdateSticker(selectedSticker.id, { opacity: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-yellow-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleLock(selectedSticker.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  {selectedSticker.isLocked ? (
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
                  onClick={() => handleToggleVisibility(selectedSticker.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  {selectedSticker.isVisible ? (
                    <>
                      <EyeOff className="h-3 w-3" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3" />
                      Show
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticker List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          AR Stickers
        </h4>
        <div className="space-y-2">
          {stickers.map((sticker) => (
            <div
              key={sticker.id}
              className={`p-4 rounded-lg border-2 ${
                selectedSticker?.id === sticker.id
                  ? 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800'
                  : sticker.isVisible
                  ? 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                  : 'bg-slate-100 dark:bg-slate-600/50 border-slate-300 dark:border-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center text-3xl">
                    {sticker.emoji}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {sticker.title}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {sticker.category}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {sticker.isLocked && (
                    <Minus className="h-4 w-4 text-yellow-500" />
                  )}
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(sticker.id)}
                    className="p-1"
                  >
                    {sticker.isVisible ? (
                      <Eye className="h-3 w-3 text-slate-400" />
                    ) : (
                      <EyeOff className="h-3 w-3 text-slate-400" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveSticker(sticker.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <TrashIcon className="h-3 w-3 text-red-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Size</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {sticker.size}px
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Rotation</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {sticker.rotation}°
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Opacity</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {sticker.opacity}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Position</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {sticker.position.x}%, {sticker.position.y}%
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSticker(sticker)}
                className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 text-xs font-semibold rounded-lg transition-colors"
              >
                <Sparkles className="h-3 w-3" />
                Edit Sticker
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-lg">
        <p className="text-[10px] text-yellow-700 dark:text-yellow-400">
          <strong>Lưu ý:</strong> Dán sticker AR lên ảnh kỷ niệm với emoji library, custom stickers, animated stickers, sticker positioning (x/y), size adjustment, rotation control, opacity adjustment, lock/unlock stickers, visibility toggle, sticker editing, và comprehensive AR sticker system.
        </p>
      </div>
    </div>
  );
}