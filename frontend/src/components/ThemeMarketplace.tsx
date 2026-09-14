'use client';

import { useState } from 'react';
import { Palette, X, RefreshCw, Info, CheckCircle, Plus, ShoppingCart, Star, Download, Heart } from 'lucide-react';

interface ThemeMarketplaceProps {
  onCancel?: () => void;
}

interface Theme {
  id: string;
  name: string;
  creator: string;
  category: string;
  price: number;
  rating: number;
  downloads: number;
  reviews: number;
  isPremium: boolean;
  isInstalled: boolean;
  isFavorite: boolean;
  preview: string;
  isCustom: boolean;
}

export default function ThemeMarketplace({ onCancel }: ThemeMarketplaceProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [themes, setThemes] = useState<Theme[]>([
    { id: '1', name: 'Ocean Breeze', creator: 'ThemeMaster', category: 'Nature', price: 0, rating: 4.8, downloads: 45600, reviews: 2340, isPremium: false, isInstalled: true, isFavorite: true, preview: 'ocean', isCustom: false },
    { id: '2', name: 'Sunset Dreams', creator: 'ColorCraft', category: 'Artistic', price: 2.99, rating: 4.7, downloads: 32100, reviews: 1890, isPremium: true, isInstalled: false, isFavorite: false, preview: 'sunset', isCustom: false },
    { id: '3', name: 'Minimalist Dark', creator: 'SimpleDesign', category: 'Minimal', price: 0, rating: 4.9, downloads: 67800, reviews: 3450, isPremium: false, isInstalled: false, isFavorite: true, preview: 'dark', isCustom: false },
    { id: '4', name: 'Vintage Romance', creator: 'RetroVibes', category: 'Vintage', price: 4.99, rating: 4.6, downloads: 18900, reviews: 890, isPremium: true, isInstalled: false, isFavorite: false, preview: 'vintage', isCustom: false },
    { id: '5', name: 'Neon Cyber', creator: 'TechStyle', category: 'Modern', price: 3.99, rating: 4.5, downloads: 28900, reviews: 1230, isPremium: true, isInstalled: true, isFavorite: false, preview: 'neon', isCustom: false },
  ]);

  const filteredThemes = selectedCategory === 'all' 
    ? themes 
    : themes.filter(theme => theme.category === selectedCategory);

  const categories = ['all', 'Nature', 'Artistic', 'Minimal', 'Vintage', 'Modern'];

  const toggleInstall = (id: string) => {
    setThemes(themes.map(theme => 
      theme.id === id ? { ...theme, isInstalled: !theme.isInstalled } : theme
    ));
  };

  const toggleFavorite = (id: string) => {
    setThemes(themes.map(theme => 
      theme.id === id ? { ...theme, isFavorite: !theme.isFavorite } : theme
    ));
  };

  const addTheme = () => {
    const newTheme: Theme = {
      id: Date.now().toString(),
      name: 'New Theme',
      creator: 'You',
      category: 'Custom',
      price: 0,
      rating: 0,
      downloads: 0,
      reviews: 0,
      isPremium: false,
      isInstalled: false,
      isFavorite: false,
      preview: 'custom',
      isCustom: true,
    };
    setThemes([...themes, newTheme]);
  };

  const deleteTheme = (id: string) => {
    setThemes(themes.filter(theme => theme.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Nature': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'Artistic': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'Minimal': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'Vintage': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'Modern': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <Palette className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Theme Marketplace
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Buy and sell themes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show details"
          >
            {showDetails ? <Info className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Themes</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{themes.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Installed</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{themes.filter(t => t.isInstalled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Premium</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{themes.filter(t => t.isPremium).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Downloads</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatNumber(themes.reduce((sum, t) => sum + t.downloads, 0))}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={addTheme}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Theme
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Themes ({filteredThemes.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredThemes.map((theme) => (
              <div key={theme.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Palette className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{theme.name}</span>
                      {theme.isInstalled && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Installed
                        </span>
                      )}
                      {theme.isPremium && (
                        <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          Premium
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(theme.category)}`}>
                        {theme.category}
                      </span>
                      {theme.isFavorite && (
                        <span className="px-2 py-0.5 rounded text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                          <Heart className="h-3 w-3" />
                        </span>
                      )}
                      {theme.isCustom && (
                        <span className="px-2 py-0.5 rounded text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">by {theme.creator}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Star className="h-3 w-3" />{theme.rating}</span>
                      <span className="flex items-center gap-1"><Download className="h-3 w-3" />{formatNumber(theme.downloads)}</span>
                      <span>{theme.reviews} reviews</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {theme.price === 0 ? 'Free' : `$${theme.price}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleInstall(theme.id)}
                    className={`px-2 py-1 rounded text-xs ${theme.isInstalled ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {theme.isInstalled ? 'Uninstall' : 'Install'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(theme.id)}
                    className={`px-2 py-1 rounded text-xs ${theme.isFavorite ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
                  >
                    <Heart className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ShoppingCart className="h-3 w-3" />
                  </button>
                  {theme.isCustom && (
                    <button
                      type="button"
                      onClick={() => deleteTheme(theme.id)}
                      className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Category Overview</h4>
          <div className="grid grid-cols-5 gap-2">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">Nature</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{themes.filter(t => t.category === 'Nature').length} themes</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Artistic</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{themes.filter(t => t.category === 'Artistic').length} themes</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Minimal</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{themes.filter(t => t.category === 'Minimal').length} themes</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">Vintage</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{themes.filter(t => t.category === 'Vintage').length} themes</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Modern</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{themes.filter(t => t.category === 'Modern').length} themes</p>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Theme Marketplace Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Free themes are available for all users</li>
              <li>• Premium themes offer exclusive designs</li>
              <li>• Install multiple themes and switch between them</li>
              <li>• Favorite themes for quick access later</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
