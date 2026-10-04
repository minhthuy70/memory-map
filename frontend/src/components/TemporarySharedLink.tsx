'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface SharedLink {
  id: string;
  title: string;
  memoryId?: string;
  url: string;
  passcode?: string;
  maxViews?: number;
  viewCount: number;
  expiresAt: string;
  isRevoked: boolean;
  createdAt: string;
}

export default function TemporarySharedLink() {
  const { token } = useAuth();
  const [links, setLinks] = useState<SharedLink[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchLinks = async () => {
    try {
      const response = await fetch('http://localhost:3001/event-streaming/shared-link', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  const createLink = async (
    title: string,
    memoryId?: string,
    passcode?: string,
    maxViews?: number,
    expiresAt?: string
  ) => {
    try {
      const response = await fetch('http://localhost:3001/event-streaming/shared-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          memoryId,
          passcode,
          maxViews,
          expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }),
      });
      const data = await response.json();
      setLinks([data, ...links]);
      return data;
    } catch (error) {
      console.error('Error creating link:', error);
      throw error;
    }
  };

  const revokeLink = async (id: string) => {
    await fetch(`http://localhost:3001/event-streaming/shared-link/${id}/revoke`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchLinks();
  };

  const copyUrl = (url: string) => {
    const fullUrl = `${window.location.origin}/shared/${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Temporary Shared Links
      </h2>

      <div className="mb-6">
        <button
          onClick={() => {
            const title = prompt('Enter link title:');
            if (title) {
              const memoryId = prompt('Enter memory ID (optional):');
              const passcode = prompt('Enter passcode (optional):');
              const maxViews = prompt('Enter max views (optional):');
              const expiresAt = prompt('Enter expiration date (YYYY-MM-DD, optional):');
              createLink(
                title,
                memoryId || undefined,
                passcode || undefined,
                maxViews ? parseInt(maxViews) : undefined,
                expiresAt || undefined
              );
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Shared Link
        </button>
      </div>

      <div className="space-y-4">
        {links.map((link) => (
          <div
            key={link.id}
            className={`p-4 border rounded-lg ${
              link.isRevoked
                ? 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  URL: <span className="font-mono">{link.url}</span>
                </p>
                {link.memoryId && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Memory ID: {link.memoryId}
                  </p>
                )}
                {link.passcode && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Passcode: <span className="font-mono">{link.passcode}</span>
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {!link.isRevoked && (
                  <>
                    <button
                      onClick={() => copyUrl(link.url)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                    >
                      {copiedUrl === link.url ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={() => revokeLink(link.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Revoke
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Views: {link.viewCount}</span>
              {link.maxViews && <span>Max: {link.maxViews}</span>}
              <span>
                Expires: {new Date(link.expiresAt).toLocaleString()}
              </span>
              {link.isRevoked && (
                <span className="text-red-600 dark:text-red-400 font-semibold">
                  Revoked
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
