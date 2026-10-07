'use client';

import VintageScrapbookMaker from '../../components/VintageScrapbookMaker';
import EnvironmentalSoundscapeMixer from '../../components/EnvironmentalSoundscapeMixer';

export default function AudiovisualPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Audiovisual Creative Studio
          </h1>
          <p className="text-lg text-gray-600">
            Creative tools for visual and audio memories
          </p>
        </div>

        <div className="space-y-8">
          {/* Scrapbook */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Vintage Scrapbook Maker</h2>
            <VintageScrapbookMaker />
          </section>

          {/* Soundscape */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Environmental Soundscape Mixer</h2>
            <EnvironmentalSoundscapeMixer />
          </section>
        </div>
      </div>
    </div>
  );
}
