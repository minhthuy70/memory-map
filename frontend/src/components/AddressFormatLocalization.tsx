'use client';

import { useState } from 'react';
import { Building, CheckCircle, Globe, Home, Info, MapPin, RefreshCw } from 'lucide-react';

interface AddressFormatLocalizationProps {
  onCancel?: () => void;
}

interface AddressFormat {
  locale: string;
  name: string;
  region: string;
  format: string;
  example: string;
  description: string;
}

export default function AddressFormatLocalization({ onCancel }: AddressFormatLocalizationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState<string>('vi-VN');

  const [addressFormats, setAddressFormats] = useState<AddressFormat[]>([
    { locale: 'vi-VN', name: 'Vietnamese', region: 'Vietnam', format: 'street, ward, district, city, country', example: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh, Việt Nam', description: 'Street → Ward → District → City → Country' },
    { locale: 'en-US', name: 'English', region: 'United States', format: 'street, city, state, zip, country', example: '123 Main St, New York, NY 10001, USA', description: 'Street → City → State → ZIP → Country' },
    { locale: 'ja-JP', name: 'Japanese', region: 'Japan', format: 'postal, city, ward, street, building', example: '100-0001, 東京都千代田区千代田1-1, 〇〇ビル', description: 'Postal → Prefecture → City → Ward → Street → Building' },
    { locale: 'ko-KR', name: 'Korean', region: 'South Korea', format: 'city, district, street, building, postal', example: '서울특별시 강남구 테헤란로 123, 〇〇빌딩, 06000', description: 'City → District → Street → Building → Postal' },
    { locale: 'zh-CN', name: 'Chinese Simplified', region: 'China', format: 'province, city, district, street, postal', example: '北京市朝阳区建国路123号, 100000', description: 'Province → City → District → Street → Postal' },
    { locale: 'fr-FR', name: 'French', region: 'France', format: 'street, postal, city, country', example: '123 Rue de la Paix, 75002 Paris, France', description: 'Street → Postal → City → Country' },
    { locale: 'de-DE', name: 'German', region: 'Germany', format: 'street, postal, city, country', example: 'Musterstraße 123, 10115 Berlin, Deutschland', description: 'Street → Postal → City → Country' },
    { locale: 'es-ES', name: 'Spanish', region: 'Spain', format: 'street, postal, city, province, country', example: 'Calle Mayor 123, 28001 Madrid, España', description: 'Street → Postal → City → Province → Country' },
    { locale: 'pt-BR', name: 'Portuguese', region: 'Brazil', format: 'street, district, city, state, postal', example: 'Rua Principal 123, Centro, São Paulo, SP, 01000-000', description: 'Street → District → City → State → Postal' },
    { locale: 'th-TH', name: 'Thai', region: 'Thailand', format: 'house, village, subdistrict, district, province, postal', example: '123/45 หมู่ 1 แขวงบางลำพู เขตพระนคร กรุงเทพฯ 10200', description: 'House → Village → Subdistrict → District → Province → Postal' },
    { locale: 'id-ID', name: 'Indonesian', region: 'Indonesia', format: 'street, district, city, province, postal', example: 'Jl. Jendral Sudirman No. 123, Jakarta Pusat, DKI Jakarta, 10110', description: 'Street → District → City → Province → Postal' },
    { locale: 'ar-SA', name: 'Arabic', region: 'Saudi Arabia', format: 'country, city, district, street, building', example: 'المملكة العربية السعودية، الرياض، حي العليا، شارع الملك فهد، مبنى ١٢٣', description: 'Country → City → District → Street → Building (RTL)' },
    { locale: 'hi-IN', name: 'Hindi', region: 'India', format: 'building, street, locality, city, state, postal', example: '123, Main Street, Connaught Place, New Delhi, Delhi 110001', description: 'Building → Street → Locality → City → State → Postal' },
  ]);

  const getCurrentFormat = () => {
    return addressFormats.find(f => f.locale === selectedLocale) || addressFormats[0];
  };

  const currentFormat = getCurrentFormat();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Address Format Localization
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Format addresses by country/region
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Formats</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{addressFormats.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Selected</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{currentFormat.name}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Region</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{currentFormat.region}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Layout</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {currentFormat.locale === 'ar-SA' ? 'RTL' : 'LTR'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedLocale}
            onChange={(e) => setSelectedLocale(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          >
            {addressFormats.map((format) => (
              <option key={format.locale} value={format.locale}>
                {format.name} ({format.region})
              </option>
            ))}
          </select>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Preview: {currentFormat.name}</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Format</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {currentFormat.format}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Example</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                {currentFormat.example}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Description</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {currentFormat.description}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Available Address Formats</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {addressFormats.map((format) => (
              <button
                key={format.locale}
                type="button"
                onClick={() => setSelectedLocale(format.locale)}
                className={`p-3 rounded-lg border text-left ${
                  selectedLocale === format.locale
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {selectedLocale === format.locale && <CheckCircle className="h-3 w-3 text-blue-500" />}
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">{format.name}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{format.region}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {format.format}
                </p>
              </button>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Address Format Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Vietnamese addresses go from specific to general</li>
              <li>• US addresses include state and ZIP code</li>
              <li>• Arabic addresses use RTL layout</li>
              <li>• Asian addresses often include postal code first</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
