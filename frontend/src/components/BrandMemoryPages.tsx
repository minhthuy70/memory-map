'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Eye,
  Flag,
  Globe,
  Info,
  Plus,
  RefreshCw,
  Star,
  Trash2
} from 'lucide-react';

interface BrandMemoryPagesProps {
  onCancel?: () => void;
}

interface BrandPage {
  id: string;
  brandName: string;
  slug: string;
  description: string;
  category: string;
  isPublic: boolean;
  isVerified: boolean;
  followers: number;
  memoriesCount: number;
  engagementRate: number;
  createdAt: string;
  isCustom: boolean;
}

export default function BrandMemoryPages({ onCancel }: BrandMemoryPagesProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [brandPages, setBrandPages] = useState<BrandPage[]>([
    { id: '1', brandName: 'Vietnam Airlines', slug: 'vietnam-airlines', description: 'Official memories from Vietnam Airlines flights', category: 'Travel', isPublic: true, isVerified: true, followers: 15420, memoriesCount: 3280, engagementRate: 8.5, createdAt: '2024-01-10', isCustom: false },
    { id: '2', brandName: 'InterContinental Hotels', slug: 'intercontinental-hotels', description: 'Guest memories from InterContinental properties worldwide', category: 'Hospitality', isPublic: true, isVerified: true, followers: 8930, memoriesCount: 2150, engagementRate: 7.2, createdAt: '2024-02-15', isCustom: false },
    { id: '3', brandName: 'Lotte Mart', slug: 'lotte-mart', description: 'Shopping memories and events from Lotte Mart', category: 'Retail', isPublic: true, isVerified: true, followers: 12500, memoriesCount: 4560, engagementRate: 9.1, createdAt: '2024-03-20', isCustom: false },
    { id: '4', brandName: 'VinGroup', slug: 'vingroup', description: 'Corporate memories from VinGroup subsidiaries', category: 'Corporate', isPublic: true, isVerified: true, followers: 25600, memoriesCount: 6890, engagementRate: 6.8, createdAt: '2024-04-05', isCustom: false },
  ]);

  const filteredPages = selectedCategory === 'all' 
    ? brandPages 
    : brandPages.filter(page => page.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(brandPages.map(p => p.category)))];

  const togglePublic = (id: string) => {
    setBrandPages(brandPages.map(page => 
      page.id === id ? { ...page, isPublic: !page.isPublic } : page
    ));
  };

  const toggleVerified = (id: string) => {
    setBrandPages(brandPages.map(page => 
      page.id === id ? { ...page, isVerified: !page.isVerified } : page
    ));
  };

  const addBrandPage = () => {
    const newPage: BrandPage = {
      id: Date.now().toString(),
      brandName: 'New Brand',
      slug: 'new-brand',
      description: 'Brand description',
      category: 'Other',
      isPublic: true,
      isVerified: false,
      followers: 0,
      memoriesCount: 0,
      engagementRate: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isCustom: true,
    };
    setBrandPages([...brandPages, newPage]);
  };

  const deletePage = (id: string) => {
    setBrandPages(brandPages.filter(page => page.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Travel': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'Hospitality': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'Retail': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'Corporate': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
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
          <div className="p-2 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl">
            <Flag className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Brand Memory Pages
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Public brand memory collections
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Pages</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{brandPages.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Public</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{brandPages.filter(p => p.isPublic).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Verified</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{brandPages.filter(p => p.isVerified).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Followers</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{formatNumber(brandPages.reduce((sum, p) => sum + p.followers, 0))}</p>
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
            onClick={addBrandPage}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Page
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Brand Pages ({filteredPages.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredPages.map((page) => (
              <div key={page.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Flag className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{page.brandName}</span>
                      {page.isVerified && (
                        <span className="px-2 py-0.5 rounded text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center gap-1">
                          <Star className="h-3 w-3" /> Verified
                        </span>
                      )}
                      {page.isPublic && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center gap-1">
                          <Globe className="h-3 w-3" /> Public
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(page.category)}`}>
                        {page.category}
                      </span>
                      {page.isCustom && (
                        <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{page.description}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{formatNumber(page.followers)}</span>
                      <span>{page.memoriesCount} memories</span>
                      <span>{page.engagementRate}% engagement</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => togglePublic(page.id)}
                    className={`px-2 py-1 rounded text-xs ${page.isPublic ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
                  >
                    {page.isPublic ? 'Public' : 'Private'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleVerified(page.id)}
                    className={`px-2 py-1 rounded text-xs ${page.isVerified ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
                  >
                    {page.isVerified ? 'Verified' : 'Unverified'}
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Info className="h-3 w-3" />
                  </button>
                  {page.isCustom && (
                    <button
                      type="button"
                      onClick={() => deletePage(page.id)}
                      className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Category Overview</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Travel</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{brandPages.filter(p => p.category === 'Travel').length} pages</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">Hospitality</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{brandPages.filter(p => p.category === 'Hospitality').length} pages</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Retail</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{brandPages.filter(p => p.category === 'Retail').length} pages</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">Corporate</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{brandPages.filter(p => p.category === 'Corporate').length} pages</p>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Brand Page Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Brand pages collect public memories from customers</li>
              <li>• Verification adds credibility to brand pages</li>
              <li>• Engagement rate measures page performance</li>
              <li>• Public pages can be discovered by all users</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
