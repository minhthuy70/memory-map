'use client';

import MemoryReactions from '../../components/MemoryReactions';
import MemoryCircles from '../../components/MemoryCircles';

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
        </div>
      </div>
    </div>
  );
}
