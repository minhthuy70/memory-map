'use client';

import { useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  AlignCenter,
  AlignLeft,
  AlignRight,
  as,
  BarChart3,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  ClockIcon,
  Copyright,
  CreditCard,
  DollarSign,
  Download,
  DownloadIcon,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Filter,
  FlipHorizontal,
  Image,
  ImageIcon,
  Layers,
  LayoutGrid,
  Maximize2,
  Minimize2,
  Package,
  Palette,
  Pause,
  Play,
  Plus,
  Printer,
  RefreshCw,
  RotateCw,
  Settings,
  SettingsIcon,
  Share2,
  Sparkles,
  Trash2,
  TrashIcon,
  Truck,
  Type,
  TypeIcon,
  Zap,
  ZapIcon,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface MemoryCard {
  id: string;
  memoryId: string;
  title: string;
  description: string;
  imageUrl: string;
  date: Date;
  location: string;
  isSelected: boolean;
}

interface PrintConfig {
  paperSize: 'A5' | 'A4' | 'Square' | 'Custom';
  layout: 'single' | 'grid' | 'collage';
  orientation: 'portrait' | 'landscape';
  quality: 'standard' | 'high' | 'premium';
  quantity: number;
  totalPrice: number;
}

interface PrintMemoryCardsProps {
  onCancel?: () => void;
  onPrint?: (config: PrintConfig, cards: MemoryCard[]) => Promise<void>;
  onPreview?: (config: PrintConfig, cards: MemoryCard[]) => Promise<void>;
}

const DEFAULT_CARDS: MemoryCard[] = [
  {
    id: 'card-1',
    memoryId: 'mem-1',
    title: 'Đà Lạt Adventure',
    description: 'Morning mist at Đà Lạt',
    imageUrl: '/card-1.jpg',
    date: new Date('2024-01-12'),
    location: 'Đà Lạt, Vietnam',
    isSelected: true,
  },
  {
    id: 'card-2',
    memoryId: 'mem-2',
    title: 'Beach Day',
    description: 'Relaxing at the beach',
    imageUrl: '/card-2.jpg',
    date: new Date('2024-02-15'),
    location: 'Nha Trang, Vietnam',
    isSelected: true,
  },
];

const PRICING = {
  A5: { standard: 5, high: 8, premium: 12 },
  A4: { standard: 8, high: 12, premium: 18 },
  Square: { standard: 4, high: 6, premium: 10 },
  Custom: { standard: 10, high: 15, premium: 25 },
};

export default function PrintMemoryCards({ onCancel, onPrint, onPreview }: PrintMemoryCardsProps) {
  const [cards, setCards] = useState<MemoryCard[]>(DEFAULT_CARDS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCards, setSelectedCards] = useState<MemoryCard[]>(DEFAULT_CARDS.filter(c => c.isSelected));
  const [config, setConfig] = useState<PrintConfig>({
    paperSize: 'A5',
    layout: 'single',
    orientation: 'portrait',
    quality: 'standard',
    quantity: 1,
    totalPrice: 5,
  });
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const selectedCount = selectedCards.length;
  const basePrice = PRICING[config.paperSize][config.quality];
  const totalPrice = basePrice * config.quantity * selectedCount;

  const handleToggleCard = (cardId: string) => {
    setCards(cards.map(c => 
      c.id === cardId ? { ...c, isSelected: !c.isSelected } : c
    ));
    setSelectedCards(cards.filter(c => c.id === cardId ? !c.isSelected : c.isSelected));
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    await onPrint?.(config, selectedCards);
    setIsPrinting(false);
  };

  const handlePreview = async () => {
    setIsPreviewing(true);
    await onPreview?.(config, selectedCards);
    setIsPreviewing(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <Printer className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              In thẻ kỷ niệm A5/A4 đẹp
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedCount} cards selected
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
            <SettingsIcon className="h-4 w-4 text-slate-500" />
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
            Cài đặt in ấn
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-save print settings
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Print quality optimization
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Color calibration
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
            <Card className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Cards</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {cards.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Selected</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {selectedCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CopyRight className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Quantity</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {config.quantity}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            ${totalPrice}
          </div>
        </div>
      </div>

      {/* Print Configuration */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Print Configuration
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                Paper Size
              </label>
              <select
                value={config.paperSize}
                onChange={(e) => setConfig({ ...config, paperSize: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
              >
                <option value="A5">A5</option>
                <option value="A4">A4</option>
                <option value="Square">Square</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                Layout
              </label>
              <select
                value={config.layout}
                onChange={(e) => setConfig({ ...config, layout: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
              >
                <option value="single">Single</option>
                <option value="grid">Grid</option>
                <option value="collage">Collage</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                Orientation
              </label>
              <select
                value={config.orientation}
                onChange={(e) => setConfig({ ...config, orientation: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                Gauge
              </label>
              <select
                value={config.quality}
                onChange={(e) => setConfig({ ...config, quality: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
              >
                <option value="standard">Standard</option>
                <option value="high">High</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>

          <div className="mt-3">
            <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={config.quantity}
              onChange={(e) => setConfig({ ...config, quantity: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
            />
          </div>

          <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Total Price
              </span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                ${totalPrice}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ${basePrice} per card × {config.quantity} copies × {selectedCount} cards
            </p>
          </div>
        </div>
      </div>

      {/* Card Selection */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Select Memories
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                card.isSelected
                  ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
              onClick={() => handleToggleCard(card.id)}
            >
              <div className="aspect-square bg-slate-200 dark:bg-slate-600 rounded-lg mb-2 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-slate-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                {card.title}
              </span>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {card.location}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Preview
            </span>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors">
                <ZoomIn className="h-4 w-4 text-slate-500" />
              </button>
              <button className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors">
                <Maximize2 className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Preview Area */}
          <div
            className={`aspect-[3/4] bg-slate-200 dark:bg-slate-600 rounded-lg mx-auto relative overflow-hidden ${
              config.orientation === 'landscape' ? 'aspect-video' : 'aspect-[3/4]'
            }`}
            style={{ maxWidth: '300px' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Card className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {config.paperSize} - {config.layout}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-400">
                  {config.quality} quality
                </p>
              </div>
            </div>

            {/* Selected Cards Preview */}
            {selectedCards.slice(0, 4).map((card, index) => (
              <div
                key={card.id}
                className="absolute w-12 h-12 bg-slate-300 dark:bg-slate-500 rounded-lg flex items-center justify-center"
                style={{
                  top: `${10 + index * 25}%`,
                  left: `${10 + index * 20}%`,
                }}
              >
                <ImageIcon className="h-6 w-6 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handlePreview}
          disabled={isPreviewing || selectedCount === 0}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPreviewing ? (
            <>
              <Activity className="h-4 w-4 animate-spin" />
              Previewing...
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Preview
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handlePrint}
          disabled={isPrinting || selectedCount === 0}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPrinting ? (
            <>
              <Activity className="h-4 w-4 animate-spin" />
              Printing...
            </>
          ) : (
            <>
              <Printer className="h-4 w-4" />
              Print Cards
            </>
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> In thẻ kỷ niệm A5/A4 đẹp với paper size selection (A5/A4/Square/Custom), layout options (single/grid/collage), orientation (portrait/landscape), quality levels (standard/high/premium), quantity control, card selection, preview mode, pricing calculation, và comprehensive print memory cards system.
        </p>
      </div>
    </div>
  );
}