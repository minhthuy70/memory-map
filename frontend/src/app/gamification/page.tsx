'use client';

import ExplorerXPProgression from '../../components/ExplorerXPProgression';
import JournalingStreaks from '../../components/JournalingStreaks';
import VirtualPassportStamps from '../../components/VirtualPassportStamps';
import MemoryBingoCard from '../../components/MemoryBingoCard';

export default function GamificationPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gamification, Quests & Geo-exploration
          </h1>
          <p className="text-lg text-gray-600">
            Level up, earn badges, and track your exploration journey
          </p>
        </div>

        <div className="space-y-8">
          {/* XP & Badges */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Explorer Level & XP</h2>
            <ExplorerXPProgression />
          </section>

          {/* Streaks */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Journaling Streaks</h2>
            <JournalingStreaks />
          </section>

          {/* Passport */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Virtual Passport</h2>
            <VirtualPassportStamps />
          </section>

          {/* Bingo */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Memory Bingo Challenge</h2>
            <MemoryBingoCard />
          </section>
        </div>
      </div>
    </div>
  );
}
