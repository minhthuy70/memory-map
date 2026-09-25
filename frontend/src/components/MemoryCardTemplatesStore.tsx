'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Download,
  Heart,
  Info,
  Layout,
  Plus,
  RefreshCw,
  ShoppingCart,
  Star
} from 'lucide-react';

interface MemoryCardTemplatesStoreProps {
  onCancel?: () => void;
}

interface Template {
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

export default function MemoryCardTemplatesStore({ onCancel }: MemoryCardTemplatesStoreProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [templates, setTemplates] = useState<Template[]>([
    { id: '1', name: 'Classic Photo', creator: 'TemplateKing', category: 'Photo', price: 0, rating: 4.8, downloads: 56700, reviews: 3450, isPremium: false, isInstalled: true, isFavorite: true, preview: 'classic', isCustom: false },
    { id: '2', name: 'Modern Collage', creator: 'DesignPro', category: 'Collage', price: 1.99, rating: 4.7, downloads: 42300, reviews: 2180, isPremium: true, isInstalled: false, isFavorite: false, preview: 'modern', isCustom: false },
    { id: '3', name: 'Vintage Frame', creator: 'RetroStyle', category: 'Vintage', price: 0, rating: 4.6, downloads: 38900, reviews: 1890, isPremium: false, isInstalled: false, isFavorite: true, preview: 'vintage', isCustom: false },
    { id: '4', name: 'Neon Glow', creator: 'NeonVibes', category: 'Modern', price: 2.99, rating: 4.5, downloads: 28900, reviews: 1230, isPremium: true, isInstalled: true, isFavorite: false, preview: 'neon', isCustom: false },
    { id: '5', name: 'Travel ScrollText', creator: 'JourneyMaker', category: 'Travel', price: 1.49, rating: 4.7, downloads: 35600, reviews: 1780, isPremium: true, isInstalled: false, isFavorite: false, preview: 'travel', isCustom: false },
  ]);

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const categories = ['all', 'Photo', 'Collage', 'Vintage', 'Modern', 'Travel'];

  const toggleInstall = (id: string) => {
    setTemplates(templates.map(template => 
      template.id === id ? { ...template, isInstalled: !template.isInstalled } : template
    ));
  };

  const toggleFavorite = (id: string) => {
    setTemplates(templates.map(template => 
      template.id === id ? { ...template, isFavorite: !template.isFavorite } : template
    ));
  };

  const addTemplate = () => {
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: 'New Template',
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
    setTemplates([...templates, newTemplate]);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Photo': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'Collage': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'Vintage': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'Modern': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'Travel': return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300';
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
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl">
            <Layout className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Memory Card Templates Store
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Memory card template marketplace
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Templates</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{templates.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Installed</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{templates.filter(t => t.isInstalled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Premium</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{templates.filter(t => t.isPremium).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Downloads</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatNumber(templates.reduce((sum, t) => sum + t.downloads, 0))}</p>
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
            onClick={addTemplate}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Template
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Templates ({filteredTemplates.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Layout className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{template.name}</span>
                      {template.isInstalled && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Installed
                        </span>
                      )}
                      {template.isPremium && (
                        <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          Premium
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(template.category)}`}>
                        {template.category}
                      </span>
                      {template.isFavorite && (
                        <span className="px-2 py-0.5 rounded text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                          <Heart className="h-3 w-3" />
                        </span>
                      )}
                      {template.isCustom && (
                        <span className="px-2 py-0.5 rounded text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">by {template.creator}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Star className="h-3 w-3" />{template.rating}</span>
                      <span className="flex items-center gap-1"><Download className="h-3 w-3" />{formatNumber(template.downloads)}</span>
                      <span>{template.reviews} reviews</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {template.price === 0 ? 'Free' : `$${template.price}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleInstall(template.id)}
                    className={`px-2 py-1 rounded text-xs ${template.isInstalled ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {template.isInstalled ? 'Uninstall' : 'Install'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(template.id)}
                    className={`px-2 py-1 rounded text-xs ${template.isFavorite ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
                  >
                    <Heart className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ShoppingCart className="h-3 w-3" />
                  </button>
                  {template.isCustom && (
                    <button
                      type="button"
                      onClick={() => deleteTemplate(template.id)}
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
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Photo</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{templates.filter(t => t.category === 'Photo').length} templates</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Collage</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{templates.filter(t => t.category === 'Collage').length} templates</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">Vintage</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{templates.filter(t => t.category === 'Vintage').length} templates</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">Modern</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{templates.filter(t => t.category === 'Modern').length} templates</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-1">Travel</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{templates.filter(t => t.category === 'Travel').length} templates</p>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Template Store Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Templates provide pre-designed memory card layouts</li>
              <li>• Premium templates offer advanced customization</li>
              <li>• Install multiple templates for variety</li>
              <li>• Use templates to quickly create beautiful memories</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
