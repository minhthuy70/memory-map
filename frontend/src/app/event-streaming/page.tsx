'use client';

import { useState } from 'react';
import LiveJourneyBroadcast from '@/components/LiveJourneyBroadcast';
import VirtualWatchParty from '@/components/VirtualWatchParty';
import EventGuestWall from '@/components/EventGuestWall';
import TemporarySharedLink from '@/components/TemporarySharedLink';
import TravelPortfolio from '@/components/TravelPortfolio';
import EmbeddableMapWidget from '@/components/EmbeddableMapWidget';
import QRCodeSticker from '@/components/QRCodeSticker';
import VerticalStoryExport from '@/components/VerticalStoryExport';
import FriendVoiceCommentary from '@/components/FriendVoiceCommentary';

type TabType = 'broadcast' | 'watch-party' | 'guest-wall' | 'shared-link' | 'portfolio' | 'widget' | 'qr-sticker' | 'vertical-story' | 'voice-commentary';

export default function EventStreamingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('broadcast');

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'broadcast', label: 'Live Journey', icon: '📍' },
    { id: 'watch-party', label: 'Watch Party', icon: '🎬' },
    { id: 'guest-wall', label: 'Guest Wall', icon: '📝' },
    { id: 'shared-link', label: 'Shared Links', icon: '🔗' },
    { id: 'portfolio', label: 'Portfolio', icon: '🌍' },
    { id: 'widget', label: 'Map Widget', icon: '🗺️' },
    { id: 'qr-sticker', label: 'QR Stickers', icon: '🏷️' },
    { id: 'vertical-story', label: 'Vertical Story', icon: '📱' },
    { id: 'voice-commentary', label: 'Voice Commentary', icon: '🎙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Event Streaming & Collaborative Experiences
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share memories in real-time, create collaborative experiences, and connect with friends
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {activeTab === 'broadcast' && <LiveJourneyBroadcast />}
          {activeTab === 'watch-party' && <VirtualWatchParty />}
          {activeTab === 'guest-wall' && <EventGuestWall />}
          {activeTab === 'shared-link' && <TemporarySharedLink />}
          {activeTab === 'portfolio' && <TravelPortfolio />}
          {activeTab === 'widget' && <EmbeddableMapWidget />}
          {activeTab === 'qr-sticker' && <QRCodeSticker />}
          {activeTab === 'vertical-story' && <VerticalStoryExport />}
          {activeTab === 'voice-commentary' && <FriendVoiceCommentary />}
        </div>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
          <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-3">
            🎉 Event Streaming Features
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>
              <strong>Live Journey Broadcast:</strong> Share your live location with GPS tracking,
              battery status, and emergency beacon mode
            </li>
            <li>
              <strong>Virtual Watch Party:</strong> Create virtual rooms to watch memories together
              with real-time synchronization
            </li>
            <li>
              <strong>Event Guest Wall:</strong> Let guests contribute photos and messages to your
              events via QR code
            </li>
            <li>
              <strong>Temporary Shared Links:</strong> Create time-limited, password-protected links
              with view limits
            </li>
            <li>
              <strong>Travel Portfolio:</strong> Build a public portfolio of your travel memories
              with custom domain
            </li>
            <li>
              <strong>Embeddable Map Widget:</strong> Generate embed code to showcase your memory map
              on any website
            </li>
            <li>
              <strong>QR Code Stickers:</strong> Create printable QR codes that link directly to
              your memories
            </li>
            <li>
              <strong>Vertical Story Export:</strong> Export memories as vertical video format for
              social media stories
            </li>
            <li>
              <strong>Friend Voice Commentary:</strong> Add voice notes from friends to your memories
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
