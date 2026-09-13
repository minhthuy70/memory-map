'use client';

import { useState } from 'react';
import { X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, BookOpen, RefreshCw, Check, Zap as ZapIcon, Plus, Image as ImageIcon, FileText, Layers, LayoutGrid, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCw, AlignLeft, AlignCenter, AlignRight, Palette, Type as TypeIcon, Sparkles, Share2, ExternalLink, Download as DownloadIcon, Eye, EyeOff, Trash2 as TrashIcon, Book, Package, Truck, Clock as ClockIcon, DollarSign, Printer, CopyRight, Filter as FilterIcon, Package as PackageIcon, ShoppingBag, CreditCard, AlertCircle, CheckCheck, Check as CheckIcon2 } from 'lucide-react';

interface PhotoBook {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  pageCount: number;
  photos: { id: string; url: string; caption: string }[];
  isSelected: boolean;
}

interface BookConfig {
  size: '6x6' | '8x8' | '10x10' | 'Custom';
  coverType: 'hardcover' | 'softcover' | 'premium';
  paperType: 'standard' | 'premium' | 'archival';
  binding: 'saddle' | 'perfect' | 'layflat';
  quantity: number;
  totalPrice: number;
}

interface OrderPhotoBookProps {
  onCancel?: () => void;
  onOrder?: (config: BookConfig, book: PhotoBook) => Promise<void>;
  onPreview?: (config: BookConfig, book: PhotoBook) => Promise<void>;
}

const DEFAULT_BOOKS: PhotoBook[] = [
  {
    id: 'book-1',
    title: '2024 Adventures',
    description: 'Our travel memories from 2024',
    coverImage: '/book-1.jpg',
    pageCount: 24,
    photos: [
      { id: 'p1', url: '/p1.jpg', caption: 'Đà Lạt' },
      { id: 'p2', url: '/p2.jpg', caption: 'Nha Trang' },
    ],
    isSelected: true,
  },
];

const PRICING = {
  '6x6': { hardcover: 25, softcover: 18, premium: 40 },
  '8x8': { hardcover: 35, softcover: 25, premium: 55 },
  '10x10': { hardcover: 45, softcover: 32, premium: 70 },
  Custom: { hardcover: 60, softcover: 45, premium: 90 },
};

const PAPER_PRICING = {
  standard: 0,
  premium: 10,
  archival: 20,
};

export default function OrderPhotoBook({ onCancel, onOrder, onPreview }: OrderPhotoBookProps) {
  const [books, setBooks] = useState<PhotoBook[]>(DEFAULT_BOOKS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedBook, setSelectedBook] = useState<PhotoBook | null>(DEFAULT_BOOKS[0]);
  const [config, setConfig] = useState<BookConfig>({
    size: '8x8',
    coverType: 'hardcover',
    paperType: 'standard',
    binding: 'perfect',
    quantity: 1,
    totalPrice: 35,
  });
  const [isOrdering, setIsOrdering] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const basePrice = PRICING[config.size][config.coverType];
  const paperPrice = PAPER_PRICING[config.paperType];
  const totalPrice = (basePrice + paperPrice) * config.quantity;

  const handleOrder = async () => {
    if (!selectedBook) return;
    setIsOrdering(true);
    await onOrder?.(config, selectedBook);
    setIsOrdering(false);
  };

  const handlePreview = async () => {
    if (!selectedBook) return;
    setIsPreviewing(true);
    await onPreview?.(config, selectedBook);
    setIsPreviewing(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Đặt in sách ảnh qua đối tác in ấn
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedBook?.pageCount || 0} pages
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
        <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt photo book
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-layout pages
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Print-quality optimization
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Partner integration
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
            <Book className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Books</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {books.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Photos</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {selectedBook?.photos.length || 0}
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

      {/* Book Configuration */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Book Configuration
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                Book Size
              </label>
              <select
                value={config.size}
                onChange={(e) => setConfig({ ...config, size: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
              >
                <option value="6x6">6x6 inches</option>
                <option value="8x8">8x8 inches</option>
                <option value="10x10">10x10 inches</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                Cover Type
              </label>
              <select
                value={config.coverType}
                onChange={(e) => setConfig({ ...config, coverType: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
              >
                <option value="hardcover">Hardcover</option>
                <option value="softcover">Softcover</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                Paper Type
              </label>
              <select
                value={config.paperType}
                onChange={(e) => setConfig({ ...config, paperType: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
              >
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="archival">Archival</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                Binding
              </label>
              <select
                value={config.binding}
                onChange={(e) => setConfig({ ...config, binding: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
              >
                <option value="saddle">Saddle Stitch</option>
                <option value="perfect">Perfect Bound</option>
                <option value="layflat">Layflat</option>
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
              max="20"
              value={config.quantity}
              onChange={(e) => setConfig({ ...config, quantity: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
            />
          </div>

          <div className="mt-3 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Total Price
              </span>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                ${totalPrice}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ${basePrice} (cover) + ${paperPrice} (paper) × {config.quantity} copies
            </p>
          </div>
        </div>
      </div>

      {/* Book Selection */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Select Photo Book
        </h4>
        <div className="space-y-2">
          {books.map((book) => (
            <div
              key={book.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedBook?.id === book.id
                  ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
              onClick={() => setSelectedBook(book)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-20 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                    <Book className="h-8 w-8 text-slate-400" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {book.title}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {book.pageCount} pages • {book.photos.length} photos
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedBook?.id === book.id && (
                    <CheckCheck className="h-4 w-4 text-orange-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Book Preview */}
      {selectedBook && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Book Preview
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

            {/* Book Preview Area */}
            <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-600 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Book className="h-16 w-16 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {config.size} - {config.coverType}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-400">
                    {config.paperType} paper • {config.binding} binding
                  </p>
                </div>
              </div>

              {/* Cover Preview */}
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-lg">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {selectedBook.title}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {selectedBook.pageCount} pages
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handlePreview}
          disabled={isPreviewing || !selectedBook}
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
          onClick={handleOrder}
          disabled={isOrdering || !selectedBook}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOrdering ? (
            <>
              <Activity className="h-4 w-4 animate-spin" />
              Ordering...
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              Order Book
            </>
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg">
        <p className="text-[10px] text-orange-700 dark:text-orange-400">
          <strong>Lưu ý:</strong> Đặt in sách ảnh qua đối tác in ấn với book size selection (6x6/8x8/10x10/Custom), cover types (hardcover/softcover/premium), paper types (standard/premium/archival), binding options (saddle/perfect/layflat), quantity control, book selection, preview mode, pricing calculation, auto-layout pages, print-quality optimization, partner integration, và comprehensive order photo book system.
        </p>
      </div>
    </div>
  );
}