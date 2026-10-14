'use client';

import MemoryReactions from '../../components/MemoryReactions';
import MemoryCircles from '../../components/MemoryCircles';
import MemoryStories from '../../components/MemoryStories';
import CommunityMapFeed from '../../components/CommunityMapFeed';
import NearbyFriendsPing from '../../components/NearbyFriendsPing';
import CoPresenceSuggestion from '../../components/CoPresenceSuggestion';
import ExplorationChallenges from '../../components/ExplorationChallenges';
import MemoryContests from '../../components/MemoryContests';
import DigitalPostcardGifting from '../../components/DigitalPostcardGifting';
import MemoryPenpals from '../../components/MemoryPenpals';

export default function SocialPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Social & Community Discovery
          </h1>
          <p className="text-lg text-gray-600">
            Connect with friends and share memories together
          </p>
        </div>

        <div className="space-y-8">
          {/* Reactions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Memory Reactions & Comments</h2>
            <MemoryReactions />
          </section>

          {/* Circles */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Memory Circles & Shared Albums</h2>
            <MemoryCircles />
          </section>

          {/* Stories */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Memory Stories (24h Ephemeral)</h2>
            <MemoryStories />
          </section>

          {/* Community Feed */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Community Public Map Feed</h2>
            <CommunityMapFeed />
          </section>

          {/* Nearby Friends */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Nearby Friends Memory Ping</h2>
            <NearbyFriendsPing />
          </section>

          {/* Co-presence */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Co-presence Memory Suggestion</h2>
            <CoPresenceSuggestion />
          </section>

          {/* Challenges */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Travel & Exploration Challenges</h2>
            <ExplorationChallenges />
          </section>

          {/* Contests */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Community Memory Contests</h2>
            <MemoryContests />
          </section>

          {/* Postcards */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Digital Memory Postcard Gifting</h2>
            <DigitalPostcardGifting />
          </section>

          {/* Penpals */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Memory Pen-pals</h2>
            <MemoryPenpals />
          </section>
        </div>
      </div>
    </div>
  );
}
