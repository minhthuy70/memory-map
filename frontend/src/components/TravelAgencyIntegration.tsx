'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Info,
  MapPin,
  Plane,
  Plus,
  RefreshCw,
  Star,
  Trash2,
  Users
} from 'lucide-react';

interface TravelAgencyIntegrationProps {
  onCancel?: () => void;
}

interface TravelAgency {
  id: string;
  name: string;
  logo: string;
  locations: number;
  destinations: string[];
  rating: number;
  reviews: number;
  partnershipTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  isActive: boolean;
  apiConnected: boolean;
  recommendationsSent: number;
  bookingsGenerated: number;
  commissionRate: number;
  isCustom: boolean;
}

export default function TravelAgencyIntegration({ onCancel }: TravelAgencyIntegrationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const [travelAgencies, setTravelAgencies] = useState<TravelAgency[]>([
    { id: '1', name: 'Vietravel', logo: 'VT', locations: 45, destinations: ['Da Nang', 'Halong Bay', 'Hoi An', 'Phu Quoc'], rating: 4.8, reviews: 12500, partnershipTier: 'platinum', isActive: true, apiConnected: true, recommendationsSent: 34500, bookingsGenerated: 8900, commissionRate: 12, isCustom: false },
    { id: '2', name: 'Saigontourist', logo: 'ST', locations: 32, destinations: ['Ho Chi Minh City', 'Mekong Delta', 'Dalat'], rating: 4.6, reviews: 8900, partnershipTier: 'gold', isActive: true, apiConnected: true, recommendationsSent: 21800, bookingsGenerated: 5600, commissionRate: 10, isCustom: false },
    { id: '3', name: 'BenThanh Tourist', logo: 'BT', locations: 28, destinations: ['Hanoi', 'Sapa', 'Ninh Binh'], rating: 4.5, reviews: 6700, partnershipTier: 'silver', isActive: true, apiConnected: true, recommendationsSent: 15600, bookingsGenerated: 4200, commissionRate: 8, isCustom: false },
    { id: '4', name: 'Exotissimo', logo: 'EX', locations: 15, destinations: ['Hue', 'Hoi An', 'Phong Nha'], rating: 4.7, reviews: 4500, partnershipTier: 'gold', isActive: false, apiConnected: false, recommendationsSent: 8900, bookingsGenerated: 2300, commissionRate: 10, isCustom: false },
  ]);

  const filteredAgencies = selectedTier === 'all' 
    ? travelAgencies 
    : travelAgencies.filter(agency => agency.partnershipTier === selectedTier);

  const tiers = ['all', 'bronze', 'silver', 'gold', 'platinum'];

  const toggleActive = (id: string) => {
    setTravelAgencies(travelAgencies.map(agency => 
      agency.id === id ? { ...agency, isActive: !agency.isActive } : agency
    ));
  };

  const toggleApi = (id: string) => {
    setTravelAgencies(travelAgencies.map(agency => 
      agency.id === id ? { ...agency, apiConnected: !agency.apiConnected } : agency
    ));
  };

  const addTravelAgency = () => {
    const newAgency: TravelAgency = {
      id: Date.now().toString(),
      name: 'New Agency',
      logo: 'NA',
      locations: 0,
      destinations: [],
      rating: 0,
      reviews: 0,
      partnershipTier: 'bronze',
      isActive: true,
      apiConnected: false,
      recommendationsSent: 0,
      bookingsGenerated: 0,
      commissionRate: 5,
      isCustom: true,
    };
    setTravelAgencies([...travelAgencies, newAgency]);
  };

  const deleteAgency = (id: string) => {
    setTravelAgencies(travelAgencies.filter(agency => agency.id !== id));
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'silver': return 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'gold': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'platinum': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
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
          <div className="p-2 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl">
            <Plane className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Travel Agency Integration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Travel agency location recommendations
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Agencies</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{travelAgencies.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{travelAgencies.filter(a => a.isActive).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">API Connected</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{travelAgencies.filter(a => a.apiConnected).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Bookings</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{formatNumber(travelAgencies.reduce((sum, a) => sum + a.bookingsGenerated, 0))}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          >
            {tiers.map((tier) => (
              <option key={tier} value={tier}>{tier === 'all' ? 'All Tiers' : tier.charAt(0).toUpperCase() + tier.slice(1)}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={addTravelAgency}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Agency
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Travel Agencies ({filteredAgencies.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredAgencies.map((agency) => (
              <div key={agency.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Plane className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{agency.name}</span>
                      {agency.isActive && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Active
                        </span>
                      )}
                      {agency.apiConnected && (
                        <span className="px-2 py-0.5 rounded text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          API
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs ${getTierColor(agency.partnershipTier)}`}>
                        {agency.partnershipTier}
                      </span>
                      {agency.isCustom && (
                        <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          Custom
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{agency.locations} locations</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3" />{agency.rating}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{formatNumber(agency.reviews)} reviews</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Recommendations: {formatNumber(agency.recommendationsSent)}</span>
                      <span>Bookings: {formatNumber(agency.bookingsGenerated)}</span>
                      <span>Commission: {agency.commissionRate}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleActive(agency.id)}
                    className={`px-2 py-1 rounded text-xs ${agency.isActive ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {agency.isActive ? 'Pause' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleApi(agency.id)}
                    className={`px-2 py-1 rounded text-xs ${agency.apiConnected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
                  >
                    {agency.apiConnected ? 'API On' : 'API Off'}
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Info className="h-3 w-3" />
                  </button>
                  {agency.isCustom && (
                    <button
                      type="button"
                      onClick={() => deleteAgency(agency.id)}
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Partnership Tiers</h4>
          <div className="grid grid-cols-4 gap-2">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">Bronze</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">5% commission</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{travelAgencies.filter(a => a.partnershipTier === 'bronze').length} agencies</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Silver</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">8% commission</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{travelAgencies.filter(a => a.partnershipTier === 'silver').length} agencies</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 mb-1">Gold</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">10% commission</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{travelAgencies.filter(a => a.partnershipTier === 'gold').length} agencies</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Platinum</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">12% commission</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{travelAgencies.filter(a => a.partnershipTier === 'platinum').length} agencies</p>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Travel Agency Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Travel agencies provide curated location recommendations</li>
              <li>• API integration enables real-time availability</li>
              <li>• Commission rates scale with partnership tier</li>
              <li>• Track bookings generated from recommendations</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
