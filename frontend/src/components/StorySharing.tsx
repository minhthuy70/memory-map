import { Activity, AlertTriangle, BarChart3, BookOpen, Calendar, CheckCircle, Clock, Eye, Filter, Heart, Image, Image as ImageIcon, MessageCircle, Music, Pause, Play, Settings, Share2, Video, X, Zap } from 'lucide-react';
'use client';

import { useState } from 'react';


interface StoryItem {
  id: string;
  title: string;
  type: 'image' | 'video' | 'text';
  platform: 'instagram' | 'facebook' | 'snapchat';
  mediaUrl: string;
  caption: string;
  duration: number;
  createdAt: Date;
  expiresAt: Date;
  views: number;
  likes: number;
  comments: number;
  status: 'draft' | 'published' | 'expired';
}

interface StoryTemplate {
  id: string;
  name: string;
  layout: 'single' | 'collage' | 'slideshow';
  theme: string;
  music: string;
}

interface StorySharingProps {
  onCancel?: () => void;
  onCreateStory?: () => Promise<void>;
}

const DEFAULT_STORIES: StoryItem[] = [
  {
    id: 'story-1',
    title: 'Beach Day',
    type: 'image',
    platform: 'instagram',
    mediaUrl: '/beach.jpg',
    caption: 'Beautiful day at the beach! 🏖️',
    duration: 5,
    createdAt: new Date('2024-01-12'),
    expiresAt: new Date('2024-01-15'),
    views: 245,
    likes: 38,
    comments: 12,
    status: 'published',
  },
  {
    id: 'story-2',
    title: 'Family Dinner',
    type: 'video',
    platform: 'facebook',
    mediaUrl: '/dinner.mp4',
    caption: 'Family dinner time 👨‍👩‍👧‍👦',
    duration: 15,
    createdAt: new Date('2024-01-10'),
    expiresAt: new Date('2024-01-13'),
    views: 180,
    likes: 52,
    comments: 18,
    status: 'expired',
  },
  {
    id: 'story-3',
    title: 'City Walk',
    type: 'image',
    platform: 'instagram',
    mediaUrl: '/city.jpg',
    caption: 'Exploring the city 🏙️',
    duration: 7,
    createdAt: new Date('2024-01-13'),
    expiresAt: new Date('2024-01-16'),
    views: 320,
    likes: 45,
    comments: 15,
    status: 'published',
  },
];

const DEFAULT_TEMPLATES: StoryTemplate[] = [
  {
    id: 'template-1',
    name: 'Memory Collage',
    layout: 'collage',
    theme: 'Nature',
    music: 'Upbeat',
  },
  {
    id: 'template-2',
    name: 'Single Highlight',
    layout: 'single',
    theme: 'Minimal',
    music: 'None',
  },
  {
    id: 'template-3',
    name: 'Travel Slideshow',
    layout: 'slideshow',
    theme: 'Adventure',
    music: 'Travel',
  },
];

export default function StorySharing({ onCancel, onCreateStory }: StorySharingProps) {
  const [stories, setStories] = useState<StoryItem[]>(DEFAULT_STORIES);
  const [templates, setTemplates] = useState<StoryTemplate[]>(DEFAULT_TEMPLATES);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [selectedTemplate, setSelectedTemplate] = useState('template-1');
  const [autoExpire, setAutoExpire] = useState(true);
  const [storyTitle, setStoryTitle] = useState('');
  const [storyCaption, setStoryCaption] = useState('');

  const activeStories = stories.filter(s => s.status === 'published').length;
  const totalViews = stories.reduce((sum, s) => sum + s.views, 0);
  const totalEngagement = stories.reduce((sum, s) => sum + s.likes + s.comments, 0);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'text':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <ImageIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-green-500';
      case 'expired':
        return 'text-slate-500';
      default:
        return 'text-yellow-500';
    }
  };

  const handleCreateStory = async () => {
    await onCreateStory?.();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <ScrollText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Chia sẻ story
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeStories} active stories
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
        <div className="mb-4 p-4 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt story sharing
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-expire (24h)
              </span>
              <button
                type="button"
                onClick={() => setAutoExpire(!autoExpire)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoExpire ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoExpire ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Add music
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-caption
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
            <ScrollText className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Active</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {activeStories}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Views</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalViews}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="h-3 w-3 text-slate-500" />
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

      {/* Story Composer */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Create Story
        </h4>
        <div className="space-y-2">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Platform
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
            >
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="snapchat">Snapchat</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Template
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
            >
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.layout})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Title
            </label>
            <input
              type="text"
              value={storyTitle}
              onChange={(e) => setStoryTitle(e.target.value)}
              placeholder="Story title..."
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Caption
            </label>
            <textarea
              value={storyCaption}
              onChange={(e) => setStoryCaption(e.target.value)}
              placeholder="Story caption..."
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none resize-none"
              rows={2}
            />
          </div>

          <button
            type="button"
            onClick={handleCreateStory}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <ScrollText className="h-4 w-4" />
            Create Story
          </button>
        </div>
      </div>

      {/* Story History */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Story History
        </h4>
        <div className="space-y-2">
          {stories.map((story) => (
            <div
              key={story.id}
              className={`p-4 rounded-lg border-2 ${
                story.status === 'published'
                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                  : story.status === 'expired'
                  ? 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                  : 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getTypeIcon(story.type)}`}>
                    {getTypeIcon(story.type)}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {story.title}
                    </span>
                    <div className={`text-xs ${getStatusColor(story.status)} capitalize`}>
                      {story.status}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {story.platform}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {story.caption}
              </p>

              <div className="grid grid-cols-4 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Views</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {story.views}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Likes</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {story.likes}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Comments</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {story.comments}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {story.duration}s
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <div>Created: {story.createdAt.toLocaleDateString('vi-VN')}</div>
                <div>Expires: {story.expiresAt.toLocaleDateString('vi-VN')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 rounded-lg">
        <p className="text-[10px] text-pink-700 dark:text-pink-400">
          <strong>Lưu ý:</strong> Chia sẻ story cho phép tạo và chia sẻ story từ kỷ niệm lên các nền tảng với template selection, auto-expiry, music, và engagement tracking.
        </p>
      </div>
    </div>
  );
}