'use client';

import { useState } from 'react';
import { Utensils, Building, X, RefreshCw, Info, CheckCircle, Plus, Trash2, MapPin, Star, Calendar } from 'lucide-react';

interface HotelRestaurantPartnershipsProps {
  onCancel?: () => void;
}

interface Partner {
  id: string;
  name: string;
  type: 'hotel' | 'restaurant' | 'cafe' | 'bar';
  location: string;
  rating: number;
  reviews: number;
  partnershipLevel: 'basic' | 'premium' | 'exclusive';
  isActive: boolean;
  featured: boolean;
  memoriesTagged: number;
  checkIns: number;
  specialOffers: number;
  isCustom: boolean;
}

export default function HotelRestaurantPartnerships({ onCancel }: HotelRestaurantPartnershipsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  const [partners, setPartners] = useState<Partner[]>([
    { id: '1', name: 'Sheraton Hanoi Hotel', type: 'hotel', location: 'Hanoi, Vietnam', rating: 4.7, reviews: 8900, partnershipLevel: 'exclusive', isActive: true, featured: true, memoriesTagged: 3450, checkIns: 12500, specialOffers: 12, isCustom: false },
    { id: '2', name: 'Cuc Gach Quan', type: 'restaurant', location: 'Ho Chi Minh City', rating: 4.6, reviews: 5600, partnershipLevel: 'premium', isActive: true, featured: true, memoriesTagged: 2180, checkIns: 8900, specialOffers: 8, isCustom: false },
    { id: '3', name: 'The Coffee House', type: 'cafe', location: 'Ho Chi Minh City', rating: 4.5, reviews: 12400, partnershipLevel: 'premium', isActive: true, featured: false, memoriesTagged: 4560, checkIns: 18900, specialOffers: 6, isCustom: false },
    { id: '4', name: 'InterContinental Danang', type: 'hotel', location: 'Da Nang, Vietnam', rating: 4.8, reviews: 6700, partnershipLevel: 'exclusive', isActive: true, featured: true, memoriesTagged: 2890, checkIns: 9800, specialOffers: 15, isCustom: false },
    { id: '5', name: 'Bia Hoi Corner', type: 'bar', location: 'Hanoi, Vietnam', rating: 4.4, reviews: 3400, partnershipLevel: 'basic', isActive: true, featured: false, memoriesTagged: 890, checkIns: 4500, specialOffers: 3, isCustom: false },
  ]);

  const filteredPartners = selectedType === 'all' 
    ? partners 
    : partners.filter(partner => partner.type === selectedType);

  const types = ['all', 'hotel', 'restaurant', 'cafe', 'bar'];

  const toggleActive = (id: string) => {
    setPartners(partners.map(partner => 
      partner.id === id ? { ...partner, isActive: !partner.isActive } : partner
    ));
  };

  const toggleFeatured = (id: string) => {
    setPartners(partners.map(partner => 
      partner.id === id ? { ...partner, featured: !partner.featured } : partner
    ));
  };

  const addPartner = () => {
    const newPartner: Partner = {
      id: Date.now().toString(),
      name: 'New Partner',
      type: 'restaurant',
      location: 'Location',
      rating: 0,
      reviews: 0,
      partnershipLevel: 'basic',
      isActive: true,
      featured: false,
      memoriesTagged: 0,
      checkIns: 0,
      specialOffers: 0,
      isCustom: true,
    };
    setPartners([...partners, newPartner]);
  };

  const deletePartner = (id: string) => {
    setPartners(partners.filter(partner => partner.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hotel': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'restaurant': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'cafe': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'bar': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'premium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'exclusive': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel': return <Building className="h-3 w-3" />;
      case 'restaurant': return <Utensils className="h-3 w-3" />;
      case 'cafe': return <Utensils className="h-3 w-3" />;
      case 'bar': return <Utensils className="h-3 w-3" />;
      default: return <Utensils className="h-3 w-3" />;
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
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <Utensils className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Hotel/Restaurant Partnerships
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Partner establishments for memories
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Partners</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{partners.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{partners.filter(p => p.isActive).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Featured</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{partners.filter(p => p.featured).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Check-ins</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{formatNumber(partners.reduce((sum, p) => sum + p.checkIns, 0))}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          >
            {types.map((type) => (
              <option key={type} value={type}>{type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={addPartner}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Partner
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Partners ({filteredPartners.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredPartners.map((partner) => (
              <div key={partner.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    {partner.type === 'hotel' ? <Building className="h-5 w-5 text-slate-400" /> : <Utensils className="h-5 w-5 text-slate-400" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{partner.name}</span>
                      {partner.isActive && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Active
                        </span>
                      )}
                      {partner.featured && (
                        <span className="px-2 py-0.5 rounded text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                          Featured
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(partner.type)}`}>
                        {partner.type}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getLevelColor(partner.partnershipLevel)}`}>
                        {partner.partnershipLevel}
                      </span>
                      {partner.isCustom && (
                        <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{partner.location}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{partner.location}</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3" />{partner.rating}</span>
                      <span className="flex items-center gap-1">{formatNumber(partner.reviews)} reviews</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{partner.memoriesTagged} tagged</span>
                      <span>{partner.checkIns} check-ins</span>
                      <span>{partner.specialOffers} offers</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleActive(partner.id)}
                    className={`px-2 py-1 rounded text-xs ${partner.isActive ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {partner.isActive ? 'Pause' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFeatured(partner.id)}
                    className={`px-2 py-1 rounded text-xs ${partner.featured ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
                  >
                    {partner.featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Info className="h-3 w-3" />
                  </button>
                  {partner.isCustom && (
                    <button
                      type="button"
                      onClick={() => deletePartner(partner.id)}
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Type Overview</h4>
          <div className="grid grid-cols-4 gap-2">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <Building className="h-4 w-4 text-blue-500 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Hotels</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{partners.filter(p => p.type === 'hotel').length} partners</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <Utensils className="h-4 w-4 text-orange-500 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Restaurants</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{partners.filter(p => p.type === 'restaurant').length} partners</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <Utensils className="h-4 w-4 text-green-500 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Cafes</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{partners.filter(p => p.type === 'cafe').length} partners</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <Utensils className="h-4 w-4 text-purple-500 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Bars</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{partners.filter(p => p.type === 'bar').length} partners</p>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Partnership Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Partners allow users to tag memories at specific locations</li>
              <li>• Featured partners get priority in recommendations</li>
              <li>• Partnership levels determine visibility and benefits</li>
              <li>• Track check-ins and tagged memories for analytics</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
