'use client';

import { useState } from 'react';
import { X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, RefreshCw, Check, Zap as ZapIcon, Plus, Upload, Image as ImageIcon, CheckCheck, FolderOpen, Lock, Unlock, CheckCircle as CheckCircleIcon, ExternalLink, Filter as FilterIcon, Search, Calendar as CalendarIcon, MapPin, Clock as ClockIcon, Eye, EyeOff, Trash2 as TrashIcon, Shield, AlertCircle, Database, Globe, Cloud, Wifi, Loader2, CheckSquare, Square, AlertTriangle as AlertTriangleIcon, CopyRight, Heart, MessageCircle, Share2, Hash, Camera, Grid, CopyRight as CopyRightIcon, Archive, Calendar as CalendarIcon2, Image as ImageIcon2, Video, ThumbsUp, Star } from 'lucide-react';

interface InstagramPost {
  id: string;
  caption: string;
  imageUrl: string;
  date: Date;
  location: string;
  metadata: { width: number; height: number; size: number; format: string; likes: number; comments: number; shares: number };
  isSelected: boolean;
  isDuplicate: boolean;
}

interface InstagramImportProps {
  onCancel?: () => void;
  onConnect?: () => Promise<void>;
  onImport?: (posts: InstagramPost[]) => Promise<void>;
  onDisconnect?: () => Promise<void>;
}

const DEFAULT_POSTS: InstagramPost[] = [
  {
    id: 'ig-1',
    caption: 'Amazing sunset! #travel #vietnam',
    imageUrl: '/ig-1.jpg',
    date: new Date('2024-05-20'),
    location: 'Phu Quoc, Vietnam',
    metadata: { width: 1080, height: 1080, size: 2800000, format: 'jpg', likes: 234, comments: 45, shares: 12 },
    isSelected: true,
    isDuplicate: false,
  },
  {
    id: 'ig-2',
    caption: 'Coffee time ☕',
    imageUrl: '/ig-2.jpg',
    date: new Date('2024-04-15'),
    location: 'Da Nang, Vietnam',
    metadata: { width: 1080, height: 1350, size: 3200000, format: 'jpg', likes: 189, comments: 32, shares: 8 },
    isSelected: true,
    isDuplicate: false,
  },
];

export default function ImportFromInstagram({ onCancel, onConnect, onImport, onDisconnect }: InstagramImportProps) {
  const [posts, setPosts] = useState<InstagramPost[]>(DEFAULT_POSTS);
  const [showSettings, setShowSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<InstagramPost[]>(DEFAULT_POSTS.filter(p => p.isSelected));
  const [autoSelect, setAutoSelect] = useState(true);
  const [includeEngagement, setIncludeEngagement] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeLocation, setIncludeLocation] = useState(true);
  const [importType, setImportType] = useState<'photos' | 'stories' | 'reels' | 'all'>('all');

  const totalPosts = posts.length;
  const selectedCount = selectedPosts.length;
  const duplicateCount = posts.filter(p => p.isDuplicate).length;
  const totalLikes = posts.reduce((sum, p) => sum + p.metadata.likes, 0);
  const totalSize = posts.reduce((sum, p) => sum + p.metadata.size, 0);

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
    await onImport?.(selectedPosts);
    setIsImporting(false);
  };

  const handleScan = async () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  const handleTogglePost = (postId: string) => {
    setPosts(posts.map(p => 
      p.id === postId ? { ...p, isSelected: !p.isSelected } : p
    ));
    setSelectedPosts(posts.filter(p => p.id === postId ? !p.isSelected : p.isSelected));
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
          <div className="p-2 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl">
            <Camera className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Nhập từ Instagram (archive Instagram)
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
        <div className="mb-4 p-4 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt Instagram import
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-select all posts
              </span>
              <button
                type="button"
                onClick={() => setAutoSelect(!autoSelect)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoSelect ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
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
                  includeEngagement ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
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
                Include hashtags
              </span>
              <button
                type="button"
                onClick={() => setIncludeHashtags(!includeHashtags)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  includeHashtags ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    includeHashtags ? 'translate-x-5' : ''
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
                  includeLocation ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
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
                onChange={(e) => setImportType(e.target.value as 'photos' | 'stories' | 'reels' | 'all')}
                className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1"
              >
                <option value="all">All</option>
                <option value="photos">Photos</option>
                <option value="stories">Stories</option>
                <option value="reels">Reels</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Posts</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalPosts}
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
            <Heart className="h-3 w-3 text-slate-500" />
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
              Instagram Connection
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
                : 'bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white'
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
                Connect to Instagram
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scan Posts */}
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
                Scan for Posts
              </>
            )}
          </button>
        </div>
      )}

      {/* Post Selection */}
      {isConnected && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Instagram Posts
            </h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPosts(posts.map(p => ({ ...p, isSelected: autoSelect })))}
                className="px-3 py-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-xs font-semibold rounded-lg transition-colors"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={() => setPosts(posts.map(p => ({ ...p, isSelected: false })))}
                className="px-3 py-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-xs font-semibold rounded-lg transition-colors"
              >
                Deselect All
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  post.isSelected
                    ? 'bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800'
                    : post.isDuplicate
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                }`}
                onClick={() => handleTogglePost(post.id)}
              >
                <div className="aspect-square bg-slate-200 dark:bg-slate-600 rounded-lg mb-2 flex items-center justify-center">
                  <ImageIcon2 className="h-8 w-8 text-slate-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                  {post.caption}
                </span>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(post.date)}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-pink-500" />
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">{post.metadata.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3 text-blue-500" />
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">{post.metadata.comments}</span>
                  </div>
                </div>
                {post.isDuplicate && (
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
      {isConnected && selectedPosts.length > 0 && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
              Import Summary
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Selected Posts</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {selectedCount}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Total Size</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {(selectedPosts.reduce((sum, p) => sum + p.metadata.size, 0) / 1048576).toFixed(2)} MB
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Include Engagement</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {includeEngagement ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Include Hashtags</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {includeHashtags ? 'Yes' : 'No'}
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
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Import Selected Posts
              </>
            )}
          </button>
        </div>
      )}

      <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 rounded-lg">
        <p className="text-[10px] text-pink-700 dark:text-pink-400">
          <strong>Lưu ý:</strong> Nhập từ Instagram với OAuth connection, post/archive scanning, caption extraction, engagement data (likes/comments/shares), hashtag extraction, location data, duplicate detection, auto-select options, post selection with preview, batch import, comprehensive Instagram API integration, và full metadata preservation.
        </p>
      </div>
    </div>
  );
}