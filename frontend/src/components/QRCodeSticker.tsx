'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface QRSticker {
  id: string;
  memoryId: string;
  stickerCode: string;
  qrCodeUrl: string;
  description?: string;
  createdAt: string;
  scansCount: number;
}

export default function QRCodeSticker() {
  const { token } = useAuth();
  const [stickers, setStickers] = useState<QRSticker[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<QRSticker | null>(null);

  const fetchStickers = async () => {
    try {
      const response = await fetch('http://localhost:3001/event-streaming/qr-sticker', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setStickers(data);
    } catch (error) {
      console.error('Error fetching stickers:', error);
    }
  };

  const createSticker = async (memoryId: string, description?: string) => {
    try {
      const response = await fetch('http://localhost:3001/event-streaming/qr-sticker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ memoryId, description }),
      });
      const data = await response.json();
      setStickers([data, ...stickers]);
      return data;
    } catch (error) {
      console.error('Error creating sticker:', error);
      throw error;
    }
  };

  const downloadQRCode = (qrCodeUrl: string, stickerCode: string) => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qr-sticker-${stickerCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scanSticker = async (stickerCode: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/event-streaming/qr-sticker/scan/${stickerCode}`,
        {
          method: 'POST',
        }
      );
      const data = await response.json();
      alert(`Scanned! Memory: ${data.memoryId}\nTotal scans: ${data.scansCount}`);
      await fetchStickers();
    } catch (error) {
      console.error('Error scanning sticker:', error);
      alert('Failed to scan sticker');
    }
  };

  useEffect(() => {
    fetchStickers();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        QR Code Stickers
      </h2>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => {
            const memoryId = prompt('Enter memory ID:');
            if (memoryId) {
              const description = prompt('Enter description (optional):');
              createSticker(memoryId, description || undefined);
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create QR Sticker
        </button>
        <button
          onClick={() => {
            const stickerCode = prompt('Enter sticker code to scan:');
            if (stickerCode) {
              scanSticker(stickerCode);
            }
          }}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Scan Sticker
        </button>
      </div>

      {selectedSticker && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg border border-yellow-200 dark:border-yellow-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-yellow-800 dark:text-yellow-200">
                QR Sticker Details
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Memory ID: {selectedSticker.memoryId}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sticker Code: <span className="font-mono">{selectedSticker.stickerCode}</span>
              </p>
              {selectedSticker.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedSticker.description}
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Scans: {selectedSticker.scansCount}
              </p>
            </div>
            <button
              onClick={() => setSelectedSticker(null)}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
            >
              Close
            </button>
          </div>

          <div className="flex justify-center mb-4">
            <img
              src={selectedSticker.qrCodeUrl}
              alt="QR Code"
              className="max-w-xs border-4 border-white dark:border-gray-600 rounded-lg shadow"
            />
          </div>

          <div className="flex justify-center gap-2">
            <button
              onClick={() => downloadQRCode(selectedSticker.qrCodeUrl, selectedSticker.stickerCode)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Download QR Code
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => setSelectedSticker(sticker)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Memory: {sticker.memoryId}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Code: <span className="font-mono">{sticker.stickerCode}</span>
                </p>
                {sticker.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {sticker.description}
                  </p>
                )}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sticker.scansCount}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">scans</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
