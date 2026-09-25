'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  as,
  BarChart3,
  Calendar,
  CheckCheck,
  CheckCircle,
  Clock,
  Copy,
  Edit2,
  Eye,
  Filter,
  Image,
  ImageIcon,
  Languages,
  Mic,
  Plus,
  RotateCcw,
  Save,
  Scan,
  Settings,
  Sparkles,
  Trash2,
  Zap,
  ZapIcon
} from 'lucide-react';

interface Caption {
  id: string;
  content: string;
  confidence: number;
  language: string;
  modelUsed: string;
  isEdited: boolean;
  isApproved: boolean;
  createdAt: Date;
}

interface CaptionResult {
  imageId: string;
  imageName: string;
  captions: Caption[];
  primaryCaption: string;
  processedAt: Date;
  processingTime: number;
}

interface AutoCaptioningProps {
  onCancel?: () => void;
  onGenerateCaption?: (imageId: string) => Promise<void>;
  onEditCaption?: (captionId: string, content: string) => Promise<void>;
  onApproveCaption?: (captionId: string) => Promise<void>;
}

const DEFAULT_RESULTS: CaptionResult[] = [
  {
    imageId: 'img-1',
    imageName: 'family-vacation.jpg',
    captions: [
      {
        id: 'caption-1',
        content: 'A family enjoying a beautiful day at the beach with clear blue sky and gentle waves.',
        confidence: 0.92,
        language: 'en',
        modelUsed: 'BLIP-2',
        isEdited: false,
        isApproved: true,
        createdAt: new Date('2024-01-12'),
      },
      {
        id: 'caption-2',
        content: 'Gia đình đang tận hưởng một ngày đẹp tại bãi biển với bầu trời trong xanh và sóng nhẹ.',
        confidence: 0.88,
        language: 'vi',
        modelUsed: 'BLIP-2',
        isEdited: false,
        isApproved: false,
        createdAt: new Date('2024-01-12'),
      },
    ],
    primaryCaption: 'A family enjoying a beautiful day at the beach with clear blue sky and gentle waves.',
    processedAt: new Date('2024-01-12'),
    processingTime: 1.5,
  },
];

export default function AutoCaptioning({ onCancel, onGenerateCaption, onEditCaption, onApproveCaption }: AutoCaptioningProps) {
  const [results, setResults] = useState<CaptionResult[]>(DEFAULT_RESULTS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(true);

  const totalCaptions = results.reduce((sum, r) => sum + r.captions.length, 0);
  const approvedCaptions = results.reduce((sum, r) => sum + r.captions.filter(c => c.isApproved).length, 0);
  const avgConfidence = totalCaptions > 0 
    ? results.reduce((sum, r) => sum + r.captions.reduce((s, c) => s + c.confidence, 0), 0) / totalCaptions 
    : 0;
  const avgProcessingTime = results.reduce((sum, r) => sum + r.processingTime, 0) / results.length;

  const handleGenerate = async (imageId: string) => {
    setIsProcessing(true);
    await onGenerateCaption?.(imageId);
    setIsProcessing(false);
  };

  const handleEdit = async (captionId: string) => {
    if (editContent.trim()) {
      await onEditCaption?.(captionId, editContent);
      setResults(results.map(r => ({
        ...r,
        captions: r.captions.map(c => 
          c.id === captionId ? { ...c, content: editContent, isEdited: true } : c
        )
      })));
      setEditingId(null);
      setEditContent('');
    }
  };

  const handleApprove = async (captionId: string) => {
    await onApproveCaption?.(captionId);
    setResults(results.map(r => ({
      ...r,
      captions: r.captions.map(c => 
        c.id === captionId ? { ...c, isApproved: !c.isApproved } : c
      )
    })));
  };

  const filteredCaptions = results.flatMap(r => 
    r.captions.filter(c => 
      selectedLanguage === 'all' || c.language === selectedLanguage
    )
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <Mic className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tự động chú thích ảnh
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalCaptions} captions generated
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
            <Settings className="h-4 w-4 text-slate-500" />
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
            Cài đặt auto-captioning
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-generate on upload
              </span>
              <button
                type="button"
                onClick={() => setAutoGenerate(!autoGenerate)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoGenerate ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoGenerate ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Multi-language support
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Caption approval required
              </span>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Optional</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Mic className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Captions</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalCaptions}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Approved</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {approvedCaptions}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Confidence</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(avgConfidence * 100).toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Time</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgProcessingTime.toFixed(1)}s
          </div>
        </div>
      </div>

      {/* Language Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedLanguage('all')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedLanguage === 'all'
                ? 'bg-pink-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedLanguage('en')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedLanguage === 'en'
                ? 'bg-pink-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setSelectedLanguage('vi')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedLanguage === 'vi'
                ? 'bg-pink-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Tiếng Việt
          </button>
        </div>
      </div>

      {/* Caption Results */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Generated Captions
        </h4>
        <div className="space-y-2">
          {results.map((result) => (
            <div
              key={result.imageId}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-slate-500" />
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {result.imageName}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {result.captions.length} captions
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleGenerate(result.imageId)}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-3 py-2 bg-pink-100 dark:bg-pink-900/30 hover:bg-pink-200 dark:hover:bg-pink-900/50 text-pink-600 dark:text-pink-400 text-xs font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-3 w-3" />
                  {isProcessing ? 'Generating...' : 'Regenerate'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Processed</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {result.processedAt.toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Time</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {result.processingTime}s
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Primary</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {result.primaryCaption.substring(0, 20)}...
                  </div>
                </div>
              </div>

              {/* Captions */}
              <div className="space-y-2">
                {result.captions.filter(c => selectedLanguage === 'all' || c.language === selectedLanguage).map((caption) => (
                  <div
                    key={caption.id}
                    className={`p-3 rounded-lg border ${
                      caption.isApproved
                        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30'
                        : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Languages className="h-4 w-4 text-slate-500" />
                        <div>
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">
                            {caption.language}
                          </span>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {caption.modelUsed}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {caption.isEdited && (
                          <Edit2 className="h-3 w-3 text-blue-500" />
                        )}
                        {caption.isApproved && (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        )}
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {(caption.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    {editingId === caption.id ? (
                      <div className="mb-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none resize-none"
                          rows={2}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(caption.id)}
                            className="flex-1 px-2 py-1 bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => { setEditingId(null); setEditContent(''); }}
                            className="flex-1 px-2 py-1 bg-slate-500 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                        {caption.content}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { setEditingId(caption.id); setEditContent(caption.content); }}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApprove(caption.id)}
                        className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg transition-colors ${
                          caption.isApproved
                            ? 'bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-amber-600 dark:text-amber-400'
                            : 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400'
                        }`}
                      >
                        {caption.isApproved ? (
                          <>
                            <RotateCcw className="h-3 w-3" />
                            Unapprove
                          </>
                        ) : (
                          <>
                            <CheckCheck className="h-3 w-3" />
                            Approve
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 rounded-lg">
        <p className="text-[10px] text-pink-700 dark:text-pink-400">
          <strong>Lưu ý:</strong> Tự động chú thích sử dụng AI để tạo mô tả ảnh tự động với BLIP-2 model, multi-language support (English/Vietnamese), confidence scoring, edit functionality, approval workflow, caption history, và regenerate capability.
        </p>
      </div>
    </div>
  );
}