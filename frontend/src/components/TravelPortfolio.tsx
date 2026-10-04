'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface PortfolioMemory {
  id: string;
  memoryId: string;
  order: number;
  isFeatured: boolean;
}

interface TravelPortfolio {
  id: string;
  title: string;
  customDomain?: string;
  bio?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  featuredMemories: PortfolioMemory[];
}

export default function TravelPortfolio() {
  const { token } = useAuth();
  const [portfolios, setPortfolios] = useState<TravelPortfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<TravelPortfolio | null>(null);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch('http://localhost:3001/event-streaming/portfolio', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPortfolios(data);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    }
  };

  const createPortfolio = async (title: string, customDomain?: string, bio?: string) => {
    try {
      const response = await fetch('http://localhost:3001/event-streaming/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, customDomain, bio, isPublic: true }),
      });
      const data = await response.json();
      setPortfolios([data, ...portfolios]);
      return data;
    } catch (error) {
      console.error('Error creating portfolio:', error);
      throw error;
    }
  };

  const updatePortfolio = async (id: string, updates: Partial<TravelPortfolio>) => {
    try {
      const response = await fetch(`http://localhost:3001/event-streaming/portfolio/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      setPortfolios(portfolios.map((p) => (p.id === id ? data : p)));
      if (selectedPortfolio?.id === id) {
        setSelectedPortfolio(data);
      }
    } catch (error) {
      console.error('Error updating portfolio:', error);
    }
  };

  const addMemory = async (portfolioId: string, memoryId: string, isFeatured?: boolean) => {
    try {
      const response = await fetch(
        `http://localhost:3001/event-streaming/portfolio/${portfolioId}/memory`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ memoryId, isFeatured }),
        }
      );
      const data = await response.json();
      await fetchPortfolios();
      if (selectedPortfolio?.id === portfolioId) {
        selectPortfolio(portfolioId);
      }
    } catch (error) {
      console.error('Error adding memory:', error);
    }
  };

  const selectPortfolio = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/event-streaming/portfolio`);
      const data = await response.json();
      const portfolio = data.find((p: TravelPortfolio) => p.id === id);
      if (portfolio) {
        setSelectedPortfolio(portfolio);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Travel Portfolio
      </h2>

      <div className="mb-6">
        <button
          onClick={() => {
            const title = prompt('Enter portfolio title:');
            if (title) {
              const customDomain = prompt('Enter custom domain (optional):');
              const bio = prompt('Enter bio (optional):');
              createPortfolio(title, customDomain || undefined, bio || undefined);
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Portfolio
        </button>
      </div>

      {selectedPortfolio && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-blue-800 dark:text-blue-200">
                {selectedPortfolio.title}
              </h3>
              {selectedPortfolio.customDomain && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Domain: {selectedPortfolio.customDomain}
                </p>
              )}
              {selectedPortfolio.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedPortfolio.bio}
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Public: {selectedPortfolio.isPublic ? 'Yes' : 'No'}
              </p>
            </div>
            <button
              onClick={() => setSelectedPortfolio(null)}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
            >
              Close
            </button>
          </div>

          <div className="mb-4 p-4 bg-white dark:bg-gray-700 rounded">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Edit Portfolio
            </h4>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Title"
                defaultValue={selectedPortfolio.title}
                onBlur={(e) => updatePortfolio(selectedPortfolio.id, { title: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-600 dark:border-gray-500"
              />
              <input
                type="text"
                placeholder="Custom Domain"
                defaultValue={selectedPortfolio.customDomain || ''}
                onBlur={(e) => updatePortfolio(selectedPortfolio.id, { customDomain: e.target.value || undefined })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-600 dark:border-gray-500"
              />
              <textarea
                placeholder="Bio"
                defaultValue={selectedPortfolio.bio || ''}
                onBlur={(e) => updatePortfolio(selectedPortfolio.id, { bio: e.target.value || undefined })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-600 dark:border-gray-500"
                rows={3}
              />
            </div>
          </div>

          <div className="mb-4 p-4 bg-white dark:bg-gray-700 rounded">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Add Memory
            </h4>
            <div className="space-y-2">
              <input
                type="text"
                id={`memory-${selectedPortfolio.id}`}
                placeholder="Memory ID"
                className="w-full px-3 py-2 border rounded dark:bg-gray-600 dark:border-gray-500"
              />
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" id={`featured-${selectedPortfolio.id}`} />
                Featured
              </label>
              <button
                onClick={() => {
                  const memoryId = (document.getElementById(`memory-${selectedPortfolio.id}`) as HTMLInputElement)?.value;
                  const isFeatured = (document.getElementById(`featured-${selectedPortfolio.id}`) as HTMLInputElement)?.checked;
                  if (memoryId) {
                    addMemory(selectedPortfolio.id, memoryId, isFeatured);
                  }
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Memory
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Memories ({selectedPortfolio.featuredMemories.length})
            </h4>
            {selectedPortfolio.featuredMemories.map((mem) => (
              <div
                key={mem.id}
                className="p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex justify-between items-center"
              >
                <span className="text-sm text-gray-900 dark:text-white">
                  {mem.memoryId}
                </span>
                {mem.isFeatured && (
                  <span className="text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {portfolios.map((portfolio) => (
          <div
            key={portfolio.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => selectPortfolio(portfolio.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {portfolio.title}
                </h3>
                {portfolio.customDomain && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {portfolio.customDomain}
                  </p>
                )}
                {portfolio.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {portfolio.bio}
                  </p>
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {portfolio.featuredMemories.length} memories
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
