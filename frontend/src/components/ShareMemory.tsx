'use client';

import { useState } from 'react';
import { Share2, Copy, Check, Facebook, Twitter, Mail } from 'lucide-react';

interface ShareMemoryProps {
  memory: {
    id: string;
    title: string;
    content?: string;
    locationName?: string;
    latitude: number;
    longitude: number;
    memoryDate: string;
    category?: {
      name: string;
      icon: string;
    };
    mood?: string;
  };
  onClose?: () => void;
}

export default function ShareMemory({ memory, onClose }: ShareMemoryProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/memories/${memory.id}`
    : '';

  const shareText = `📍 ${memory.title}\n${memory.content || ''}\n📍 ${memory.locationName || 'Memory Map'}\n🗓️ ${new Date(memory.memoryDate).toLocaleDateString('vi-VN')}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShare = async (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(memory.title)}&body=${encodedText}%0A%0A${encodedUrl}`;
        break;
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share({
              title: memory.title,
              text: shareText,
              url: shareUrl,
            });
            setIsOpen(false);
            onClose?.();
            return;
          } catch (error) {
            console.error('Error sharing:', error);
          }
        }
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400"
        title="Chia sẻ kỷ niệm"
      >
        <Share2 className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Chia sẻ kỷ niệm
              </h2>
              <button
                onClick={toggleModal}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Memory Preview */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{memory.category?.icon || '📍'}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                      {memory.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {memory.content || memory.locationName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Share Options */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Chia sẻ qua
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {/* Native Share */}
                  {navigator.share && (
                    <button
                      onClick={() => handleShare('native')}
                      className="flex items-center justify-center gap-2 p-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium text-sm"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Chia sẻ</span>
                    </button>
                  )}

                  {/* Facebook */}
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center justify-center gap-2 p-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-colors font-medium text-sm"
                  >
                    <Facebook className="w-4 h-4" />
                    <span>Facebook</span>
                  </button>

                  {/* Twitter */}
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center justify-center gap-2 p-3 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1A91DA] transition-colors font-medium text-sm"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>Twitter</span>
                  </button>

                  {/* Email */}
                  <button
                    onClick={() => handleShare('email')}
                    className="flex items-center justify-center gap-2 p-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </button>
                </div>

                {/* Copy Link */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Sao chép link
                  </h3>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="w-full px-3 py-2 pr-20 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover transition-colors"
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
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <button
                onClick={toggleModal}
                className="w-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
