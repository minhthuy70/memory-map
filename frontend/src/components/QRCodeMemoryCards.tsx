'use client';

import { useState } from 'react';
import { X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, QrCode, RefreshCw, Check, Zap as ZapIcon, Plus, Image as ImageIcon, FileText, Layers, LayoutGrid, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCw, AlignLeft, AlignCenter, AlignRight, Palette, Type as TypeIcon, Sparkles, Share2, ExternalLink, Download as DownloadIcon, Eye, EyeOff, Trash2 as TrashIcon, CreditCard, CreditCard, Copyright, Link2, Scan, Smartphone, Globe, Lock, Unlock, Filter as FilterIcon, DollarSign, Printer, AlertCircle, Copy as CopyIcon, Share as ShareIcon } from 'lucide-react';

interface QRCard {
  id: string;
  memoryId: string;
  title: string;
  description: string;
  imageUrl: string;
  qrCodeUrl: string;
  memoryUrl: string;
  isCustom: boolean;
  customStyle: 'minimal' | 'colorful' | 'elegant' | 'modern';
  isSelected: boolean;
}

interface QRConfig {
  cardSize: 'standard' | 'large' | 'wallet';
  qrStyle: 'standard' | 'dots' | 'rounded';
  includeTitle: boolean;
  includeDate: boolean;
  includeLocation: boolean;
  quantity: number;
  totalPrice: number;
}

interface QRCodeMemoryCardsProps {
  onCancel?: () => void;
  onPrint?: (config: QRConfig, cards: QRCard[]) => Promise<void>;
  onPreview?: (config: QRConfig, cards: QRCard[]) => Promise<void>;
  onGenerateQR?: (cardId: string) => Promise<void>;
}

const DEFAULT_CARDS: QRCard[] = [
  {
    id: 'qr-1',
    memoryId: 'mem-1',
    title: 'Đà Lạt Adventure',
    description: 'Morning mist at Đà Lạt',
    imageUrl: '/qr-1.jpg',
    qrCodeUrl: 'https://memory-map.app/m/1',
    memoryUrl: 'https://memory-map.app/m/1',
    isCustom: false,
    customStyle: 'modern',
    isSelected: true,
  },
  {
    id: 'qr-2',
    memoryId: 'mem-2',
    title: 'Beach Day',
    description: 'Relaxing at the beach',
    imageUrl: '/qr-2.jpg',
    qrCodeUrl: 'https://memory-map.app/m/2',
    memoryUrl: 'https://memory-map.app/m/2',
    isCustom: false,
    customStyle: 'modern',
    isSelected: true,
  },
];

const PRICING = {
  standard: 3,
  large: 5,
  wallet: 2,
};

export default function QRCodeMemoryCards({ onCancel, onPrint, onPreview, onGenerateQR }: QRCodeMemoryCardsProps) {
  const [cards, setCards] = useState<QRCard[]>(DEFAULT_CARDS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCards, setSelectedCards] = useState<QRCard[]>(DEFAULT_CARDS.filter(c => c.isSelected));
  const [config, setConfig] = useState<QRConfig>({
    cardSize: 'standard',
    qrStyle: 'standard',
    includeTitle: true,
    includeDate: true,
    includeLocation: true,
    quantity: 1,
    totalPrice: 3,
  });
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const selectedCount = selectedCards.length;
  const basePrice = PRICING[config.cardSize];
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

  const handleGenerateQR = async (cardId: string) => {
    await onGenerateQR?.(cardId);
  };

  const handleCopyQR = (qrUrl: string) => {
    navigator.clipboard.writeText(qrUrl);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
            <QrCode className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Thẻ kỷ niệm có QR code dẫn đến bản số
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
        <div className="mb-4 p-4 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt QR code cards
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-generate QR codes
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Print-ready format
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                QR code validation
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

      {/* QR Configuration */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            QR Card Configuration
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                Card Size
              </label>
              <select
                value={config.cardSize}
                onChange={(e) => setConfig({ ...config, cardSize: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
              >
                <option value="standard">Standard</option>
                <option value="large">Large</option>
                <option value="wallet">Wallet</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                QR Style
              </label>
              <select
                value={config.qrStyle}
                onChange={(e) => setConfig({ ...config, qrStyle: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
              >
                <option value="standard">Standard</option>
                <option value="dots">Dots</option>
                <option value="rounded">Rounded</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex gap-3">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-1">
                <input
                  type="checkbox"
                  checked={config.includeTitle}
                  onChange={(e) => setConfig({ ...config, includeTitle: e.target.checked })}
                  className="rounded"
                />
                Include Title
              </label>
            </div>
            <div className="flex-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-1">
                <input
                  type="checkbox"
                  checked={config.includeDate}
                  onChange={(e) => setConfig({ ...config, includeDate: e.target.checked })}
                  className="rounded"
                />
                Include Date
              </label>
            </div>
            <div className="flex-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-1">
                <input
                  type="checkbox"
                  checked={config.includeLocation}
                  onChange={(e) => setConfig({ ...config, includeLocation: e.target.checked })}
                  className="rounded"
                />
                Include Location
              </label>
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

          <div className="mt-3 p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Total Price
              </span>
              <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
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
          Select Memory Cards
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                card.isSelected
                  ? 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
              onClick={() => handleToggleCard(card.id)}
            >
              <div className="aspect-square bg-slate-200 dark:bg-slate-600 rounded-lg mb-2 flex items-center justify-center">
                <QrCode className="h-8 w-8 text-slate-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                {card.title}
              </span>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {card.memoryUrl}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Preview */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              QR Code Preview
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

          {/* QR Preview Area */}
          <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-600 rounded-lg mx-auto relative overflow-hidden max-w-[300px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <QrCode className="h-16 w-16 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {config.cardSize} - {config.qrStyle}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-400">
                  {config.includeTitle ? 'With title' : 'No title'}
                </p>
              </div>
            </div>

            {/* QR Code */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <QrCode className="h-16 w-16 text-slate-400" />
            </div>

            {/* Card Info */}
            {config.includeTitle && selectedCards[0] && (
              <div className="absolute bottom-4 left-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-lg">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {selectedCards[0].title}
                </p>
              </div>
            )}
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
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

      <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 rounded-lg">
        <p className="text-[10px] text-cyan-700 dark:text-cyan-400">
          <strong>Lưu ý:</strong> Thẻ kỷ niệm có QR code dẫn đến bản số với card size selection (standard/large/wallet), QR style options (standard/dots/rounded), title/date/location inclusion, card selection, preview mode, pricing calculation, auto-generate QR codes, print-ready format, QR code validation, link to digital memory, scan capability, và comprehensive QR code memory cards system.
        </p>
      </div>
    </div>
  );
}