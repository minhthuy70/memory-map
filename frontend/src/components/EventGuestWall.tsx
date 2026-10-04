'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface Contribution {
  id: string;
  guestName: string;
  message?: string;
  imageUrl?: string;
  createdAt: string;
}

interface GuestWall {
  id: string;
  title: string;
  eventType: string;
  eventDate: string;
  qrCode: string;
  isActive: boolean;
  createdAt: string;
  contributions: Contribution[];
}

export default function EventGuestWall() {
  const { token } = useAuth();
  const [walls, setWalls] = useState<GuestWall[]>([]);
  const [selectedWall, setSelectedWall] = useState<GuestWall | null>(null);
  const [newContribution, setNewContribution] = useState({
    guestName: '',
    message: '',
    imageUrl: '',
  });

  const fetchWalls = async () => {
    try {
      const response = await fetch('http://localhost:3001/event-streaming/guest-wall', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setWalls(data);
    } catch (error) {
      console.error('Error fetching walls:', error);
    }
  };

  const createWall = async (title: string, eventType: string, eventDate: string) => {
    try {
      const response = await fetch('http://localhost:3001/event-streaming/guest-wall', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, eventType, eventDate: new Date(eventDate) }),
      });
      const data = await response.json();
      setWalls([data, ...walls]);
      return data;
    } catch (error) {
      console.error('Error creating wall:', error);
      throw error;
    }
  };

  const selectWall = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/event-streaming/guest-wall/${id}`);
      const data = await response.json();
      setSelectedWall(data);
    } catch (error) {
      console.error('Error fetching wall:', error);
    }
  };

  const addContribution = async () => {
    if (!selectedWall) return;

    try {
      const response = await fetch(
        `http://localhost:3001/event-streaming/guest-wall/${selectedWall.id}/contribution`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newContribution),
        }
      );
      const data = await response.json();
      setSelectedWall({
        ...selectedWall,
        contributions: [data, ...selectedWall.contributions],
      });
      setNewContribution({ guestName: '', message: '', imageUrl: '' });
    } catch (error) {
      console.error('Error adding contribution:', error);
    }
  };

  useEffect(() => {
    fetchWalls();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Event Guest Wall
      </h2>

      <div className="mb-6">
        <button
          onClick={() => {
            const title = prompt('Enter wall title:');
            if (title) {
              const eventType = prompt('Enter event type (wedding/birthday/graduation/etc):');
              const eventDate = prompt('Enter event date (YYYY-MM-DD):');
              if (eventType && eventDate) {
                createWall(title, eventType, eventDate);
              }
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Guest Wall
        </button>
      </div>

      {selectedWall && (
        <div className="mb-6 p-4 bg-pink-50 dark:bg-pink-900 rounded-lg border border-pink-200 dark:border-pink-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-pink-800 dark:text-pink-200">
                {selectedWall.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Event: {selectedWall.eventType}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Date: {new Date(selectedWall.eventDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                QR Code: <span className="font-mono">{selectedWall.qrCode}</span>
              </p>
            </div>
            <button
              onClick={() => setSelectedWall(null)}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
            >
              Close
            </button>
          </div>

          <div className="mb-4 p-4 bg-white dark:bg-gray-700 rounded">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Add Contribution
            </h4>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Guest Name"
                value={newContribution.guestName}
                onChange={(e) =>
                  setNewContribution({ ...newContribution, guestName: e.target.value })
                }
                className="w-full px-3 py-2 border rounded dark:bg-gray-600 dark:border-gray-500"
              />
              <textarea
                placeholder="Message"
                value={newContribution.message}
                onChange={(e) =>
                  setNewContribution({ ...newContribution, message: e.target.value })
                }
                className="w-full px-3 py-2 border rounded dark:bg-gray-600 dark:border-gray-500"
                rows={3}
              />
              <input
                type="text"
                placeholder="Image URL (optional)"
                value={newContribution.imageUrl}
                onChange={(e) =>
                  setNewContribution({ ...newContribution, imageUrl: e.target.value })
                }
                className="w-full px-3 py-2 border rounded dark:bg-gray-600 dark:border-gray-500"
              />
              <button
                onClick={addContribution}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Contribution
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Contributions ({selectedWall.contributions.length})
            </h4>
            {selectedWall.contributions.map((contribution) => (
              <div
                key={contribution.id}
                className="p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
              >
                <div className="font-semibold text-gray-900 dark:text-white">
                  {contribution.guestName}
                </div>
                {contribution.message && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {contribution.message}
                  </p>
                )}
                {contribution.imageUrl && (
                  <img
                    src={contribution.imageUrl}
                    alt="Contribution"
                    className="mt-2 max-w-full h-32 object-cover rounded"
                  />
                )}
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {new Date(contribution.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {walls.map((wall) => (
          <div
            key={wall.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => selectWall(wall.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {wall.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Event: {wall.eventType}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Date: {new Date(wall.eventDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  QR Code: <span className="font-mono">{wall.qrCode}</span>
                </p>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {wall.contributions.length} contributions
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
