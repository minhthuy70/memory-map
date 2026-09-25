'use client';

import { useState } from 'react';
import { Map, X, RefreshCw, Info, CheckCircle, Plus, ShoppingCart, Star, Download, Heart } from 'lucide-react';

interface MapSkinMarketplaceProps {
  onCancel?: () => void;
}

interface MapSkin {
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

export default function MapSkinMarketplace({ onCancel }: MapSkinMarketplaceProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [mapSkins, setMapSkins] = useState<MapSkin[]>([
    { id: '1', name: 'Classic Map', creator: 'MapMaster', category: 'Classic', price: 0, rating: 4.7, downloads: 89000, reviews: 4560, isPremium: false, isInstalled: true, isFavorite: true, preview: 'classic', isCustom: false },
    { id: '2', name: 'Satellite View', creator: 'SatellitePro', category: 'Satellite', price: 2.99, rating: 4.6, downloads: 56700, reviews: 2890, isPremium: true, isInstalled: false, isFavorite: false, preview: 'satellite', isCustom: false },
    { id: '3', name: 'Terrain Map', creator: 'TerrainDesign', category: 'Terrain', price: 0, rating: 4.8, downloads: 78900, reviews: 3450, isPremium: false, isInstalled: true, isFavorite: true, preview: 'terrain', isCustom: false },
    { id: '4', name: 'Vintage Style', creator: 'RetroMaps', category: 'Vintage', price: 1.99, rating: 4.5, downloads: 34500, reviews: 1780, isPremium: true, isInstalled: false, isFavorite: false, preview: 'vintage', isCustom: false },
    { id: '5', name: 'Dark Mode', creator: 'DarkTheme', category: 'Dark', price: 1.49, rating: 4.7, downloads: 67800, reviews: 3450, isPremium: true, isInstalled: true, isFavorite: false, preview: 'dark', isCustom: false },
  ]);

  const filteredSkins = selectedCategory === 'all' 
    ? mapSkins 
    : mapSkins.filter(skin => skin.category === selectedCategory);

  const categories = ['all', 'Classic', 'Satellite', 'Terrain', 'Vintage', 'Dark'];

  const toggleInstall = (id: string) => {
    setMapSkins(mapSkins.map(skin => 
      skin.id === id ? { ...skin, isInstalled: !skin.isInstalled } : skin
    ));
  };

  const toggleFavorite = (id: string) => {
    setMapSkins(mapSkins.map(skin => 
      skin.id === id ? { ...skin, isFavorite: !skin.isFavorite } : skin
    ));
  };

  const addMapSkin = () => {
    const newSkin: MapSkin = {
      id: Date.now().toString(),
      name: 'New Skin',
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
    setMapSkins([...mapSkins, newSkin]);
  };

  const deleteSkin = (id: string) => {
    setMapSkins(mapSkins.filter(skin => skin.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Classic': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'Satellite': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'Terrain': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'Vintage': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'Dark': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
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
          <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl">
            <Map className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Map Skin Marketplace
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Custom map skins marketplace
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Skins</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{mapSkins.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Installed</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{mapSkins.filter(s => s.isInstalled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Premium</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{mapSkins.filter(s => s.isPremium).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Downloads</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatNumber(mapSkins.reduce((sum, s) => sum + s.downloads, 0))}</p>
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
            onClick={addMapSkin}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Skin
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Map Skins ({filteredSkins.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredSkins.map((skin) => (
              <div key={skin.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Map className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{skin.name}</span>
                      {skin.isInstalled && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Installed
                        </span>
                      )}
                      {skin.isPremium && (
                        <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          Premium
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(skin.category)}`}>
                        {skin.category}
                      </span>
                      {skin.isFavorite && (
                        <span className="px-2 py-0.5 rounded text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                          <Heart className="h-3 w-3" />
                        </span>
                      )}
                      {skin.isCustom && (
                        <span className="px-2 py-0.5 rounded text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">by {skin.creator}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Star className="h-3 w-3" />{skin.rating}</span>
                      <span className="flex items-center gap-1"><Download className="h-3 w-3" />{formatNumber(skin.downloads)}</span>
                      <span>{skin.reviews} reviews</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {skin.price === 0 ? 'Free' : `$${skin.price}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleInstall(skin.id)}
                    className={`px-2 py-1 rounded text-xs ${skin.isInstalled ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {skin.isInstalled ? 'Uninstall' : 'Install'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(skin.id)}
                    className={`px-2 py-1 rounded text-xs ${skin.isFavorite ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
                  >
                    <Heart className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ShoppingCart className="h-3 w-3" />
                  </button>
                  {skin.isCustom && (
                    <button
                      type="button"
                      onClick={() => deleteSkin(skin.id)}
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
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Classic</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{mapSkins.filter(s => s.category === 'Classic').length} skins</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Satellite</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{mapSkins.filter(s => s.category === 'Satellite').length} skins</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">Terrain</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{mapSkins.filter(s => s.category === 'Terrain').length} skins</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">Vintage</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{mapSkins.filter(s => s.category === 'Vintage').length} skins</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Dark</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{mapSkins.filter(s => s.category === 'Dark').length} skins</p>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Map Skin Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Map skins customize the memory map appearance</li>
              <li>• Switch between different map styles</li>
              <li>• Free skins are available for all users</li>
              <li>• Premium skins offer unique visual styles</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
