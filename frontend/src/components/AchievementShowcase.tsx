'use client';

import { useState } from 'react';
import { Award, X, Share2, Download, Eye, EyeOff, Grid, List, Filter, Star, Trophy, Target, Sparkles, Flame, Zap, Crown, Heart, MapPin, Calendar, Lock, Unlock, ChevronDown, ChevronUp, Settings, Edit, Link, Copy, CheckCircle } from 'lucide-react';

interface AchievementShowcaseProps {
  onCancel?: () => void;
}

interface ShowcaseItem {
  id: string;
  type: 'badge' | 'milestone' | 'streak' | 'level';
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedDate?: string;
  visible: boolean;
  position: number;
}

export default function AchievementShowcase({ onCancel }: AchievementShowcaseProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showHidden, setShowHidden] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([
    {
      id: '1',
      type: 'badge',
      title: 'First Memory',
      description: 'Created your first memory',
      icon: 'star',
      rarity: 'common',
      unlocked: true,
      unlockedDate: '2026-01-15',
      visible: true,
      position: 1,
    },
    {
      id: '2',
      type: 'badge',
      title: 'Explorer',
      description: 'Visited 5 different locations',
      icon: 'mapPin',
      rarity: 'rare',
      unlocked: true,
      unlockedDate: '2026-03-10',
      visible: true,
      position: 2,
    },
    {
      id: '3',
      type: 'milestone',
      title: '100 Memories',
      description: 'Created 100 memories',
      icon: 'trophy',
      rarity: 'epic',
      unlocked: true,
      unlockedDate: '2026-06-20',
      visible: true,
      position: 3,
    },
    {
      id: '4',
      type: 'streak',
      title: '30-Day Streak',
      description: 'Maintained 30-day memory streak',
      icon: 'flame',
      rarity: 'epic',
      unlocked: true,
      unlockedDate: '2026-08-15',
      visible: true,
      position: 4,
    },
    {
      id: '5',
      type: 'level',
      title: 'Level 7 Legend',
      description: 'Reached Legend level',
      icon: 'crown',
      rarity: 'legendary',
      unlocked: true,
      unlockedDate: '2026-09-01',
      visible: true,
      position: 5,
    },
    {
      id: '6',
      type: 'badge',
      title: 'Photo Pro',
      description: 'Added 50 photos to memories',
      icon: 'sparkles',
      rarity: 'rare',
      unlocked: true,
      unlockedDate: '2026-04-05',
      visible: false,
      position: 6,
    },
    {
      id: '7',
      type: 'milestone',
      title: '50 Locations',
      description: 'Visited 50 different locations',
      icon: 'mapPin',
      rarity: 'legendary',
      unlocked: false,
      visible: false,
      position: 7,
    },
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-slate-400 to-slate-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-slate-300 dark:border-slate-600';
      case 'rare': return 'border-blue-300 dark:border-blue-600';
      case 'epic': return 'border-purple-300 dark:border-purple-600';
      case 'legendary': return 'border-yellow-300 dark:border-yellow-600';
      default: return 'border-slate-300 dark:border-slate-600';
    }
  };

  const getTypeIcon = (icon: string) => {
    switch (icon) {
      case 'star': return <Star className="h-5 w-5" />;
      case 'trophy': return <Trophy className="h-5 w-5" />;
      case 'mapPin': return <MapPin className="h-5 w-5" />;
      case 'flame': return <Flame className="h-5 w-5" />;
      case 'crown': return <Crown className="h-5 w-5" />;
      case 'sparkles': return <Sparkles className="h-5 w-5" />;
      case 'zap': return <Zap className="h-5 w-5" />;
      case 'heart': return <Heart className="h-5 w-5" />;
      case 'target': return <Target className="h-5 w-5" />;
      default: return <Award className="h-5 w-5" />;
    }
  };

  const filteredItems = showcaseItems.filter(item => {
    if (selectedFilter !== 'all' && item.type !== selectedFilter) return false;
    if (!showHidden && !item.visible) return false;
    return true;
  });

  const visibleCount = showcaseItems.filter(i => i.visible).length;
  const unlockedCount = showcaseItems.filter(i => i.unlocked).length;

  const toggleVisibility = (id: string) => {
    if (editMode) {
      setShowcaseItems(showcaseItems.map(item => {
        if (item.id === id) {
          return { ...item, visible: !item.visible };
        }
        return item;
      }));
    }
  };

  const reorderItem = (id: string, direction: 'up' | 'down') => {
    if (editMode) {
      const currentIndex = showcaseItems.findIndex(i => i.id === id);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex >= 0 && newIndex < showcaseItems.length) {
        const newItems = [...showcaseItems];
        [newItems[currentIndex], newItems[newIndex]] = [newItems[newIndex], newItems[currentIndex]];
        newItems.forEach((item, index) => item.position = index + 1);
        setShowcaseItems(newItems);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl">
            <Award className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Achievement Showcase
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Display your achievements on profile
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditMode(!editMode)}
            className={`p-2 rounded-lg transition-colors ${editMode ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            title={editMode ? 'Exit edit mode' : 'Edit showcase'}
          >
            {editMode ? <CheckCircle className="h-4 w-4" /> : <Edit className="h-4 w-4 text-slate-500" />}
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

      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Visible</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{visibleCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Unlocked</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{unlockedCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Hidden</p>
            <p className="text-lg font-bold text-slate-600 dark:text-slate-400">{showcaseItems.filter(i => !i.visible).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Edit Mode</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{editMode ? 'On' : 'Off'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Types</option>
            <option value="badge">Badges</option>
            <option value="milestone">Milestones</option>
            <option value="streak">Streaks</option>
            <option value="level">Levels</option>
          </select>
          <button
            type="button"
            onClick={() => setShowHidden(!showHidden)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            {showHidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            {showHidden ? 'Show Hidden' : 'Hide Hidden'}
          </button>
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white' : 'text-slate-500'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white' : 'text-slate-500'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${getRarityBorder(item.rarity)} ${item.visible ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-700/30 opacity-60'}`}
                onClick={() => toggleVisibility(item.id)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`p-3 bg-gradient-to-br ${getRarityColor(item.rarity)} rounded-xl mb-2 ${item.unlocked ? '' : 'grayscale'}`}>
                    {getTypeIcon(item.icon)}
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{item.rarity}</p>
                  {editMode && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); reorderItem(item.id, 'up'); }}
                        disabled={item.position === 1}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded"
                      >
                        <ChevronUp className="h-3 w-3 text-slate-500" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); reorderItem(item.id, 'down'); }}
                        disabled={item.position === showcaseItems.length}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded"
                      >
                        <ChevronDown className="h-3 w-3 text-slate-500" />
                      </button>
                      {item.visible ? (
                        <Eye className="h-3 w-3 text-green-500" />
                      ) : (
                        <EyeOff className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                  )}
                  {!item.visible && !editMode && (
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <EyeOff className="h-3 w-3" />
                      <span>Hidden</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${getRarityBorder(item.rarity)} ${item.visible ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-700/30 opacity-60'}`}
                onClick={() => toggleVisibility(item.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-gradient-to-br ${getRarityColor(item.rarity)} rounded-lg ${item.unlocked ? '' : 'grayscale'}`}>
                    {getTypeIcon(item.icon)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{item.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {editMode && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); reorderItem(item.id, 'up'); }}
                        disabled={item.position === 1}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded"
                      >
                        <ChevronUp className="h-3 w-3 text-slate-500" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); reorderItem(item.id, 'down'); }}
                        disabled={item.position === showcaseItems.length}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded"
                      >
                        <ChevronDown className="h-3 w-3 text-slate-500" />
                      </button>
                    </div>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.rarity === 'common' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400' : item.rarity === 'rare' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : item.rarity === 'epic' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                    {item.rarity}
                  </span>
                  {item.visible ? (
                    <Eye className="h-4 w-4 text-green-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Showcase Settings
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Enable edit mode to reorder and hide achievements</li>
            <li>• Visible achievements appear on your public profile</li>
            <li>• Drag to reorder or use up/down arrows</li>
            <li>• Hide achievements you don't want to display</li>
            <li>• Share your showcase link with friends</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
          >
            <Share2 className="h-4 w-4" />
            Share Profile
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
          >
            <Link className="h-4 w-4" />
            Copy Link
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
