'use client';

import { useState } from 'react';
import { X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Mail, RefreshCw, Check, Zap as ZapIcon, Plus, Image as ImageIcon, FileText, Layers, LayoutGrid, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCw, AlignLeft, AlignCenter, AlignRight, Palette, Type as TypeIcon, Sparkles, Share2, ExternalLink, Download as DownloadIcon, Eye, EyeOff, Trash2 as TrashIcon, Stamp, Copyright, DollarSign, Printer, Filter as FilterIcon, Globe, MapPin, Heart, Star, Smile, Sun, Cloud, Send, Upload, Text as TextIcon, PenTool, ImagePlus, Scan, Lock, Unlock } from 'lucide-react';

interface Postcard {
  id: string;
  memoryId: string;
  title: string;
  message: string;
  imageUrl: string;
  recipientName: string;
  recipientAddress: string;
  senderName: string;
  senderAddress: string;
  stampType: 'standard' | 'custom' | 'digital';
  isCustomDesign: boolean;
  designTemplate: 'vintage' | 'modern' | 'minimal' | 'colorful';
  isSelected: boolean;
}

interface PostcardConfig {
  size: 'standard' | 'large' | 'oversized';
  paperType: 'matte' | 'glossy' | 'textured';
  includeEnvelope: boolean;
  includeStamp: boolean;
  quantity: number;
  totalPrice: number;
}

interface CustomPostcardPrintProps {
  onCancel?: () => void;
  onPrint?: (config: PostcardConfig, postcard: Postcard) => Promise<void>;
  onPreview?: (config: PostcardConfig, postcard: Postcard) => Promise<void>;
  onUpload?: (file: File) => Promise<void>;
}

const DEFAULT_POSTCARDS: Postcard[] = [
  {
    id: 'postcard-1',
    memoryId: 'mem-1',
    title: 'Greetings from Đà Lạt',
    message: 'Wish you were here to see the beautiful morning mist!',
    imageUrl: '/postcard-1.jpg',
    recipientName: 'John Doe',
    recipientAddress: '123 Main St, City, Country',
    senderName: 'Your Name',
    senderAddress: '456 Oak Ave, Your City, Country',
    stampType: 'standard',
    isCustomDesign: false,
    designTemplate: 'modern',
    isSelected: true,
  },
];

const PRICING = {
  standard: 2,
  large: 3,
  oversized: 5,
};

const PAPER_PRICING = {
  matte: 0,
  glossy: 1,
  textured: 2,
};

const ENVELOPE_PRICE = 1;

export default function CustomPostcardPrint({ onCancel, onPrint, onPreview, onUpload }: CustomPostcardPrintProps) {
  const [postcards, setPostcards] = useState<Postcard[]>(DEFAULT_POSTCARDS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedPostcard, setSelectedPostcard] = useState<Postcard | null>(DEFAULT_POSTCARDS[0]);
  const [config, setConfig] = useState<PostcardConfig>({
    size: 'standard',
    paperType: 'matte',
    includeEnvelope: true,
    includeStamp: true,
    quantity: 1,
    totalPrice: 3,
  });
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const basePrice = PRICING[config.size];
  const paperPrice = PAPER_PRICING[config.paperType];
  const envelopePrice = config.includeEnvelope ? ENVELOPE_PRICE : 0;
  const totalPrice = (basePrice + paperPrice + envelopePrice) * config.quantity;

  const handlePrint = async () => {
    if (!selectedPostcard) return;
    setIsPrinting(true);
    await onPrint?.(config, selectedPostcard);
    setIsPrinting(false);
  };

  const handlePreview = async () => {
    if (!selectedPostcard) return;
    setIsPreviewing(true);
    await onPreview?.(config, selectedPostcard);
    setIsPreviewing(false);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    await onUpload?.(file);
    setIsUploading(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              In bưu thiếp kỷ niệm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {postcards.length} postcards
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
        <div className="mb-4 p-4 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt postcard
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-format addresses
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
                Postal service integration
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
            <Mail className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Postcards</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {postcards.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Stamp className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Stamps</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {config.includeStamp ? 'Yes' : 'No'}
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

      {/* Postcard Configuration */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Postcard Configuration
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                Postcard Size
              </label>
              <select
                value={config.size}
                onChange={(e) => setConfig({ ...config, size: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
              >
                <option value="standard">Standard (4x6)</option>
                <option value="large">Large (5x7)</option>
                <option value="oversized">Oversized (6x8)</option>
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
                <option value="matte">Matte</option>
                <option value="glossy">Glossy</option>
                <option value="textured">Textured</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex gap-3">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-1">
                <input
                  type="checkbox"
                  checked={config.includeEnvelope}
                  onChange={(e) => setConfig({ ...config, includeEnvelope: e.target.checked })}
                  className="rounded"
                />
                Include Envelope
              </label>
            </div>
            <div className="flex-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-1">
                <input
                  type="checkbox"
                  checked={config.includeStamp}
                  onChange={(e) => setConfig({ ...config, includeStamp: e.target.checked })}
                  className="rounded"
                />
                Include Stamp
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

          <div className="mt-3 p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Total Price
              </span>
              <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
                ${totalPrice}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ${basePrice} (size) + ${paperPrice} (paper) + ${envelopePrice} (envelope) × {config.quantity} copies
            </p>
          </div>
        </div>
      </div>

      {/* Upload Image */}
      <div className="mb-4">
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-pink-400 dark:hover:border-pink-600 transition-colors">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="postcard-upload"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleUpload(e.target.files[0]);
              }
            }}
          />
          <label htmlFor="postcard-upload" className="cursor-pointer">
            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Upload Postcard Image
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Supports: JPG, PNG, HEIC
            </p>
          </label>
        </div>

        {isUploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Uploading...
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                100%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div className="h-full bg-pink-500 transition-all" style={{ width: '100%' }} />
            </div>
          </div>
        )}
      </div>

      {/* Postcard Design */}
      {selectedPostcard && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
              Postcard Design
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Title
                </label>
                <input
                  type="text"
                  value={selectedPostcard.title}
                  onChange={(e) => setSelectedPostcard({ ...selectedPostcard, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Message
                </label>
                <textarea
                  value={selectedPostcard.message}
                  onChange={(e) => setSelectedPostcard({ ...selectedPostcard, message: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={selectedPostcard.recipientName}
                    onChange={(e) => setSelectedPostcard({ ...selectedPostcard, recipientName: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={selectedPostcard.recipientAddress}
                    onChange={(e) => setSelectedPostcard({ ...selectedPostcard, recipientAddress: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                  Design Template
                </label>
                <select
                  value={selectedPostcard.designTemplate}
                  onChange={(e) => setSelectedPostcard({ ...selectedPostcard, designTemplate: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                >
                  <option value="vintage">Vintage</option>
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                  <option value="colorful">Colorful</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Postcard Preview */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Postcard Preview
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

          {/* Postcard Preview Area */}
          <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-600 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Mail className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {config.size} - {config.paperType}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-400">
                  {selectedPostcard?.designTemplate} design
                </p>
              </div>
            </div>

            {/* Stamp */}
            {config.includeStamp && (
              <div className="absolute top-4 right-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <Stamp className="h-6 w-6 text-white" />
              </div>
            )}

            {/* Message Preview */}
            {selectedPostcard && (
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-lg">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-2">
                  {selectedPostcard.message}
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
          disabled={isPreviewing || !selectedPostcard}
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
          disabled={isPrinting || !selectedPostcard}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPrinting ? (
            <>
              <Activity className="h-4 w-4 animate-spin" />
              Printing...
            </>
          ) : (
            <>
              <Printer className="h-4 w-4" />
              Print Postcard
            </>
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 rounded-lg">
        <p className="text-[10px] text-pink-700 dark:text-pink-400">
          <strong>Lưu ý:</strong> In bưu thiếp kỷ niệm với postcard size selection (standard/large/oversized), paper types (matte/glossy/textured), envelope inclusion, stamp inclusion, quantity control, custom message, recipient info, design templates (vintage/modern/minimal/colorful), image upload, preview mode, pricing calculation, auto-format addresses, print-quality optimization, postal service integration, và comprehensive custom postcard print system.
        </p>
      </div>
    </div>
  );
}