'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import WatchPartyVideoCall from './WatchPartyVideoCall';

interface Participant {
  id: string;
  userId: string;
  joinedAt: string;
}

interface WatchParty {
  id: string;
  title: string;
  isActive: boolean;
  roomCode: string;
  createdAt: string;
  endedAt?: string;
  memoryId?: string;
  participants: Participant[];
}

export default function VirtualWatchParty() {
  const { token } = useAuth();
  const [parties, setParties] = useState<WatchParty[]>([]);
  const [activeParty, setActiveParty] = useState<WatchParty | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);

  const fetchParties = async () => {
    try {
      const response = await fetch('http://localhost:3001/event-streaming/watch-party', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setParties(data);
    } catch (error) {
      console.error('Error fetching parties:', error);
    }
  };

  const createParty = async (title: string, memoryId?: string) => {
    try {
      const response = await fetch('http://localhost:3001/event-streaming/watch-party', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, memoryId }),
      });
      const data = await response.json();
      setParties([data, ...parties]);
      return data;
    } catch (error) {
      console.error('Error creating party:', error);
      throw error;
    }
  };

  const joinParty = async (roomCode: string) => {
    try {
      const response = await fetch('http://localhost:3001/event-streaming/watch-party/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomCode }),
      });
      const data = await response.json();
      setActiveParty(data);
      setIsJoined(true);
      await fetchParties();
    } catch (error) {
      console.error('Error joining party:', error);
      alert('Failed to join party. Check room code.');
    }
  };

  const leaveParty = async () => {
    setIsJoined(false);
    setActiveParty(null);
  };

  const endParty = async (id: string) => {
    await fetch(`http://localhost:3001/event-streaming/watch-party/${id}/end`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchParties();
    if (activeParty?.id === id) {
      setActiveParty(null);
      setIsJoined(false);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Virtual Watch Party
      </h2>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => {
            const title = prompt('Enter party title:');
            if (title) {
              const memoryId = prompt('Enter memory ID (optional):');
              createParty(title, memoryId || undefined);
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Party
        </button>
        <button
          onClick={() => {
            const roomCode = prompt('Enter room code:');
            if (roomCode) {
              joinParty(roomCode);
            }
          }}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Join Party
        </button>
      </div>

      {activeParty && (
        <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900 rounded-lg border border-purple-200 dark:border-purple-700">
          <h3 className="font-bold text-purple-800 dark:text-purple-200 mb-2">
            Active Party: {activeParty.title}
          </h3>
          <div className="mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Room Code: <span className="font-mono font-bold">{activeParty.roomCode}</span>
            </span>
          </div>
          <div className="mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Participants: {activeParty.participants.length}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowVideoCall(true)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              📹 Start Video Call
            </button>
            <button
              onClick={leaveParty}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Leave Party
            </button>
          </div>
        </div>
      )}

      {showVideoCall && activeParty && (
        <div className="mb-6">
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setShowVideoCall(false)}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
            >
              Close Video Call
            </button>
          </div>
          <WatchPartyVideoCall
            roomCode={activeParty.roomCode}
            onEndCall={() => setShowVideoCall(false)}
          />
        </div>
      )}

      <div className="space-y-4">
        {parties.map((party) => (
          <div
            key={party.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {party.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Room Code: <span className="font-mono">{party.roomCode}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Created: {new Date(party.createdAt).toLocaleString()}
                </p>
                {party.endedAt && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ended: {new Date(party.endedAt).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {party.isActive && (
                  <button
                    onClick={() => endParty(party.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    End Party
                  </button>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Participants: {party.participants.length}
            </div>
            {party.memoryId && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Memory ID: {party.memoryId}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
