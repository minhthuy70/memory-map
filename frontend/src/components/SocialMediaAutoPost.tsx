import { Activity, AlertTriangle, AtSign, BarChart3, Briefcase, Calendar, Camera, CheckCircle, Clock, Filter, Globe, Lock, RefreshCw, Send, Settings, Share2, Users, X, Zap } from 'lucide-react';
'use client';

import { useState } from 'react';


interface Platform {
  id: string;
  name: string;
  icon: any;
  connected: boolean;
  accountName: string;
  lastPosted: Date | null;
}

interface PostTemplate {
  id: string;
  name: string;
  content: string;
  hashtags: string[];
  platforms: string[];
}

interface PostHistory {
  id: string;
  platform: string;
  content: string;
  postedAt: Date;
  status: 'success' | 'failed' | 'pending';
  likes: number;
  shares: number;
  comments: number;
}

interface SocialMediaAutoPostProps {
  onCancel?: () => void;
  onPostToSocial?: (platform: string, content: string) => Promise<void>;
}

const DEFAULT_PLATFORMS: Platform[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Globe2,
    connected: true,
    accountName: '@memorymap.user',
    lastPosted: new Date('2024-01-10'),
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: MessageCircle,
    connected: true,
    accountName: '@memorymap',
    lastPosted: new Date('2024-01-12'),
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: ImagePlus,
    connected: false,
    accountName: '',
    lastPosted: null,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Link2,
    connected: true,
    accountName: 'Memory Map',
    lastPosted: new Date('2024-01-08'),
  },
];

const DEFAULT_TEMPLATES: PostTemplate[] = [
  {
    id: 'template-1',
    name: 'New Memory',
    content: 'Just created a new memory! 📸 #MemoryMap #LifeMoments',
    hashtags: ['MemoryMap', 'LifeMoments'],
    platforms: ['facebook', 'twitter', 'instagram'],
  },
  {
    id: 'template-2',
    name: 'Travel Memory',
    content: 'Exploring new places and creating memories! ✈️ #Travel #Adventure',
    hashtags: ['Travel', 'Adventure'],
    platforms: ['facebook', 'instagram'],
  },
];

const DEFAULT_POST_HISTORY: PostHistory[] = [
  {
    id: 'post-1',
    platform: 'facebook',
    content: 'Just created a new memory! 📸',
    postedAt: new Date('2024-01-10'),
    status: 'success',
    likes: 45,
    shares: 12,
    comments: 8,
  },
  {
    id: 'post-2',
    platform: 'twitter',
    content: 'Another great memory added! #MemoryMap',
    postedAt: new Date('2024-01-12'),
    status: 'success',
    likes: 28,
    shares: 5,
    comments: 3,
  },
  {
    id: 'post-3',
    platform: 'linkedin',
    content: 'Documenting life moments with Memory Map',
    postedAt: new Date('2024-01-08'),
    status: 'success',
    likes: 15,
    shares: 2,
    comments: 1,
  },
];

export default function SocialMediaAutoPost({ onCancel, onPostToSocial }: SocialMediaAutoPostProps) {
  const [platforms, setPlatforms] = useState<Platform[]>(DEFAULT_PLATFORMS);
  const [templates, setTemplates] = useState<PostTemplate[]>(DEFAULT_TEMPLATES);
  const [postHistory, setPostHistory] = useState<PostHistory[]>(DEFAULT_POST_HISTORY);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('template-1');
  const [autoPost, setAutoPost] = useState(true);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'twitter']);
  const [customContent, setCustomContent] = useState('');

  const connectedCount = platforms.filter(p => p.connected).length;
  const totalPosts = postHistory.filter(p => p.status === 'success').length;
  const totalEngagement = postHistory.reduce((sum, p) => sum + p.likes + p.shares + p.comments, 0);

  const handlePost = async () => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return;

    const content = customContent || template.content;
    
    for (const platformId of selectedPlatforms) {
      await onPostToSocial?.(platformId, content);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <Share2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tự động đăng mạng xã hội
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {connectedCount} platforms connected
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
            <Settings className="h-4 w-4 text-slate-500" />
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
            Cài đặt auto-post
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-post enabled
              </span>
              <button
                type="button"
                onClick={() => setAutoPost(!autoPost)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoPost ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoPost ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Include hashtags
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Privacy mode
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Friends only</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Connected</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {connectedCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Posts</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalPosts}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Engagement</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalEngagement}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Templates</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {templates.length}
          </div>
        </div>
      </div>

      {/* Connected Platforms */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Connected Platforms
        </h4>
        <div className="space-y-2">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div
                key={platform.id}
                className={`p-4 rounded-lg border-2 ${
                  platform.connected
                    ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {platform.name}
                    </span>
                  </div>
                  {platform.connected && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Account</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {platform.accountName || 'Not connected'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Last Posted</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {platform.lastPosted ? platform.lastPosted.toLocaleDateString('vi-VN') : 'Never'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Post Composer */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Post Composer
        </h4>
        <div className="space-y-2">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Template
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Custom content (optional)
            </label>
            <textarea
              value={customContent}
              onChange={(e) => setCustomContent(e.target.value)}
              placeholder="Override template content..."
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Platforms
            </label>
            <div className="flex flex-wrap gap-2">
              {platforms.filter(p => p.connected).map((platform) => {
                const Icon = platform.icon;
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlatforms(prev =>
                        prev.includes(platform.id)
                          ? prev.filter(id => id !== platform.id)
                          : [...prev, platform.id]
                      );
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors ${
                      selectedPlatforms.includes(platform.id)
                        ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                        : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs text-slate-700 dark:text-slate-300">
                      {platform.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handlePost}
            disabled={selectedPlatforms.length === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 disabled:from-slate-400 disabled:to-slate-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            Post Now
          </button>
        </div>
      </div>

      {/* Post History */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Post History
        </h4>
        <div className="space-y-2">
          {postHistory.map((post) => (
            <div
              key={post.id}
              className={`p-4 rounded-lg border-2 ${
                post.status === 'success'
                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                  : post.status === 'failed'
                  ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                    {post.platform}
                  </span>
                </div>
                <span className={`text-xs font-semibold ${
                  post.status === 'success' ? 'text-green-500' : post.status === 'failed' ? 'text-red-500' : 'text-slate-500'
                }`}>
                  {post.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {post.content}
              </p>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Likes</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {post.likes}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Shares</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {post.shares}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Comments</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {post.comments}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Posted: {post.postedAt.toLocaleDateString('vi-VN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Tự động đăng mạng xã hội cho phép tự động đăng kỷ niệm lên các nền tảng xã hội với platform management, post templates, scheduling, và engagement tracking.
        </p>
      </div>
    </div>
  );
}