'use client';

import GratitudeGrowthTree from '../../components/GratitudeGrowthTree';
import DailySerendipity from '../../components/DailySerendipity';
import ResilienceArchive from '../../components/ResilienceArchive';

export default function PsychologyPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Psychology, Mindfulness & Wellbeing
          </h1>
          <p className="text-lg text-gray-600">
            Emotional wellbeing, gratitude, and personal growth tools
          </p>
        </div>

        <div className="space-y-8">
          {/* Daily Serendipity */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Daily Serendipity</h2>
            <DailySerendipity />
          </section>

          {/* Gratitude Tree */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Gratitude Growth Tree</h2>
            <GratitudeGrowthTree />
          </section>

          {/* Resilience Archive */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Resilience & Strength Archive</h2>
            <ResilienceArchive />
          </section>
        </div>
      </div>
    </div>
  );
}
