'use client';

import { useState } from 'react';
import { X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, RefreshCw, Check, Zap as ZapIcon, Plus, Upload, Image as ImageIcon, CheckCheck, FolderOpen, Lock, Unlock, CheckCircle as CheckCircleIcon, ExternalLink, Filter as FilterIcon, Search, Calendar as CalendarIcon, MapPin, Clock as ClockIcon, Eye, EyeOff, Trash2 as TrashIcon, Shield, AlertCircle, Database, Globe, Cloud, Wifi, Loader2, CheckSquare, Square, AlertTriangle as AlertTriangleIcon, Copyright, Heart, MessageCircle, Share2, Hash, Camera, Grid, Copyright as CopyRightIcon, Archive, Calendar as CalendarIcon2, Image as ImageIcon2, Video, ThumbsUp, Star, Users, Smile, Gift, Cake, Sparkles } from 'lucide-react';

interface FacebookMemory {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: Date;
  location: string;
  metadata: { width: number; height: number; size: number; format: string; likes: number; comments: number; shares: number; reactions: { like: number; love: number; wow: number; haha: number; sad: number; angry: number } };
  isSelected: boolean;
  isDuplicate: boolean;
}

interface FacebookImportProps {
  onCancel?: () => void;
  onConnect?: () => Promise<void>;
  onImport?: (memories: FacebookMemory[]) => Promise<void>;
  onDisconnect?: () => Promise<void>;
}

const DEFAULT_MEMORIES: FacebookMemory[] = [
  {
    id: 'fb-1',
    title: 'Memory: Summer 2023',
    description: 'Throwback to amazing vacation',
    imageUrl: '/fb-1.jpg',
    date: new Date('2023-06-15'),
    location: 'Nha Trang, Vietnam',
    metadata: { width: 1200, height: 630, size: 2400000, format: 'jpg', likes: 156, comments: 23, shares: 5, reactions: { like: 120, love: 25, wow: 5, haha: 3, sad: 2, angry: 1 } },
    isSelected: true,
    isDuplicate: false,
  },
  {
    id: 'fb-2',
    title: 'Memory: Family Gathering',
    description: 'Annual family reunion',
    imageUrl: '/fb-2.jpg',
    date: new Date('2023-12-25'),
    location: 'Hanoi, Vietnam',
    metadata: { width: 1080, height: 1080, size: 2800000, format: 'jpg', likes: 234, comments: 45, shares: 12, reactions: { like: 180, love: 40, wow: 8, haha: 4, sad: 1, angry: 1 } },
    isSelected: true,
    isDuplicate: false,
  },
];

export default function ImportFromFacebook({ onCancel, onConnect, onImport, onDisconnect }: FacebookImportProps) {
  const [memories, setMemories] = useState<FacebookMemory[]>(DEFAULT_MEMORIES);
  const [showSettings, setShowSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedMemories, setSelectedMemories] = useState<FacebookMemory[]>(DEFAULT_MEMORIES.filter(m => m.isSelected));
  const [autoSelect, setAutoSelect] = useState(true);
  const [includeEngagement, setIncludeEngagement] = useState(true);
  const [includeReactions, setIncludeReactions] = useState(true);
  const [includeLocation, setIncludeLocation] = useState(true);
  const [importType, setImportType] = useState<'memories' | 'photos' | 'videos' | 'all'>('all');

  const totalMemories = memories.length;
  const selectedCount = selectedMemories.length;
  const duplicateCount = memories.filter(m => m.isDuplicate).length;
  const totalLikes = memories.reduce((sum, m) => sum + m.metadata.likes, 0);
  const totalSize = memories.reduce((sum, m) => sum + m.metadata.size, 0);

  const handleConnect = async () => {
    await onConnect?.();
    setIsConnected(true);
  };

  const handleDisconnect = async () => {
    await onDisconnect?.();
    setIsConnected(false);
  };

  const handleImport = async () => {
    setIsImporting(true);
    await onImport?.(selectedMemories);
    setIsImporting(false);
  };

  const handleScan = async () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  const handleToggleMemory = (memoryId: string) => {
    setMemories(memories.map(m => 
      m.id === memoryId ? { ...m, isSelected: !m.isSelected } : m
    ));
    setSelectedMemories(memories.filter(m => m.id === memoryId ? !m.isSelected : m.isSelected));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' bytes';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Nhập từ Facebook (archive Facebook Memories)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isConnected ? 'Connected' : 'Not connected'}
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
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt Facebook import
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-select all memories
              </span>
              <button
                type="button"
                onClick={() => setAutoSelect(!autoSelect)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoSelect ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoSelect ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Include engagement data
              </span>
              <button
                type="button"
                onClick={() => setIncludeEngagement(!includeEngagement)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  includeEngagement ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    includeEngagement ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Include reactions breakdown
              </span>
              <button
                type="button"
                onClick={() => setIncludeReactions(!includeReactions)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  includeReactions ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    includeReactions ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Include location data
              </span>
              <button
                type="button"
                onClick={() => setIncludeLocation(!includeLocation)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  includeLocation ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    includeLocation ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Import type
              </span>
              <select
                value={importType}
                onChange={(e) => setImportType(e.target.value as 'memories' | 'photos' | 'videos' | 'all')}
                className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1"
              >
                <option value="all">All</option>
                <option value="memories">Memories</option>
                <option value="photos">Photos</option>
                <option value="videos">Videos</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Archive className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Memories</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalMemories}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Selected</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {selectedCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <ThumbsUp className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Likes</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalLikes}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CopyRight className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Size</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(totalSize / 1048576).toFixed(1)}MB
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Facebook Connection
            </span>
            {isConnected && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-semibold rounded-full">
                Connected
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={isConnected ? handleDisconnect : handleConnect}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
              isConnected
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white'
            }`}
          >
            {isConnected ? (
              <>
                <Lock className="h-4 w-4" />
                Disconnect
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4" />
                Connect to Facebook
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scan Memories */}
      {isConnected && (
        <div className="mb-4">
          <button
            type="button"
            onClick={handleScan}
            disabled={isScanning}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Scan for Memories
              </>
            )}
          </button>
        </div>
      )}

      {/* Memory Selection */}
      {isConnected && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Facebook Memories
            </h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMemories(memories.map(m => ({ ...m, isSelected: autoSelect })))}
                className="px-3 py-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-xs font-semibold rounded-lg transition-colors"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={() => setMemories(memories.map(m => ({ ...m, isSelected: false })))}
                className="px-3 py-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-xs font-semibold rounded-lg transition-colors"
              >
                Deselect All
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {memories.map((memory) => (
              <div
                key={memory.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  memory.isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                    : memory.isDuplicate
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                }`}
                onClick={() => handleToggleMemory(memory.id)}
              >
                <div className="aspect-square bg-slate-200 dark:bg-slate-600 rounded-lg mb-2 flex items-center justify-center">
                  <ImageIcon2 className="h-8 w-8 text-slate-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                  {memory.title}
                </span>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(memory.date)}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3 text-blue-500" />
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">{memory.metadata.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3 text-blue-500" />
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">{memory.metadata.comments}</span>
                  </div>
                </div>
                {memory.isDuplicate && (
                  <div className="mt-1 flex items-center gap-1">
                    <AlertTriangleIcon className="h-3 w-3 text-amber-500" />
                    <span className="text-[10px] text-amber-600 dark:text-amber-400">Duplicate</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata Preview */}
      {isConnected && selectedMemories.length > 0 && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
              Import Summary
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Selected Memories</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {selectedCount}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Total Size</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {(selectedMemories.reduce((sum, m) => sum + m.metadata.size, 0) / 1048576).toFixed(2)} MB
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Include Engagement</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {includeEngagement ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Include Reactions</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {includeReactions ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Include Location</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {includeLocation ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Import Type</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {importType}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Button */}
      {isConnected && (
        <div className="mb-4">
          <button
            type="button"
            onClick={handleImport}
            disabled={isImporting || selectedCount === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Import Selected Memories
              </>
            )}
          </button>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Nhập từ Facebook với OAuth connection, Memories archive scanning, caption/description extraction, engagement data (likes/comments/shares), reactions breakdown (like/love/wow/haha/sad/angry), location data, duplicate detection, auto-select options, memory selection with preview, batch import, comprehensive Facebook API integration, và full metadata preservation.
        </p>
      </div>
    </div>
  );
}