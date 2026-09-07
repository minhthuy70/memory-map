'use client';

import { useState } from 'react';
import { Link2, Copy, Check, Clock, Shield, ExternalLink, Trash2 } from 'lucide-react';
import { memoriesApi } from '@/lib/memories-api';

interface PublicMemoryLinkProps {
  memoryId: string;
  memoryTitle: string;
  isPublic?: boolean;
  publicSlug?: string;
  publicExpiresAt?: string;
  onUpdate?: () => void;
}

export default function PublicMemoryLink({
  memoryId,
  memoryTitle,
  isPublic = false,
  publicSlug,
  publicExpiresAt,
  onUpdate,
}: PublicMemoryLinkProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMakingPrivate, setIsMakingPrivate] = useState(false);
  const [copied, setCopied] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    try {
      const result = await memoriesApi.generatePublicLink(memoryId);
      setPublicUrl(result.publicUrl);
      onUpdate?.();
    } catch (error) {
      console.error('Error generating public link:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMakePrivate = async () => {
    if (!confirm('Bạn có chắc muốn hủy link công khai này?')) return;
    
    setIsMakingPrivate(true);
    try {
      await memoriesApi.makeMemoryPrivate(memoryId);
      setPublicUrl(null);
      onUpdate?.();
    } catch (error) {
      console.error('Error making memory private:', error);
    } finally {
      setIsMakingPrivate(false);
    }
  };

  const handleCopyLink = async () => {
    if (publicUrl) {
      try {
        await navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Error copying link:', error);
      }
    }
  };

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Đã hết hạn';
    if (diffDays === 1) return 'Hết hạn sau 1 ngày';
    if (diffDays < 7) return `Hết hạn sau ${diffDays} ngày`;
    return `Hết hạn sau ${date.toLocaleDateString('vi-VN')}`;
  };

  if (isPublic && publicSlug) {
    const url = publicUrl || `${window.location.origin}/public/${publicSlug}`;
    
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Link2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Link công khai
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                <Shield className="w-3 h-3" />
                <span>Đang công khai</span>
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{publicExpiresAt ? formatExpiryDate(publicExpiresAt) : 'Không giới hạn'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-xs font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  title="Mở link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleMakePrivate}
            disabled={isMakingPrivate}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Hủy link công khai"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Chia sẻ kỷ niệm này với link công khai
          </span>
        </div>
        
        <button
          onClick={handleGenerateLink}
          disabled={isGenerating}
          className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Đang tạo...</span>
            </>
          ) : (
            <>
              <Link2 className="w-3 h-3" />
              <span>Tạo link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
