'use client';

import GratitudeGrowthTree from '../../components/GratitudeGrowthTree';
import DailySerendipity from '../../components/DailySerendipity';
import ResilienceArchive from '../../components/ResilienceArchive';
import EmotionalGeographyHeatmap from '../../components/EmotionalGeographyHeatmap';
import ReminiscenceTherapy from '../../components/ReminiscenceTherapy';
import InnerChildDialogue from '../../components/InnerChildDialogue';
import BinauralSoundTherapy from '../../components/BinauralSoundTherapy';
import ZenReflectionMode from '../../components/ZenReflectionMode';
import EmotionalWaveformTimeline from '../../components/EmotionalWaveformTimeline';
import DreamJournalMapAnchors from '../../components/DreamJournalMapAnchors';

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

          {/* Emotional Geography Heatmap */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Emotional Geography & Wellbeing Heatmap</h2>
            <EmotionalGeographyHeatmap />
          </section>

          {/* Reminiscence Therapy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Reminiscence Therapy Workflow</h2>
            <ReminiscenceTherapy />
          </section>

          {/* Inner Child Dialogue */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Inner Child Dialogue Space</h2>
            <InnerChildDialogue />
          </section>

          {/* Binaural Sound Therapy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Binaural Beats Memory Sound Therapy</h2>
            <BinauralSoundTherapy />
          </section>

          {/* Zen Reflection Mode */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Digital Detox & Zen Reflection Mode</h2>
            <ZenReflectionMode />
          </section>

          {/* Emotional Waveform Timeline */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Emotional Waveform Timeline</h2>
            <EmotionalWaveformTimeline />
          </section>

          {/* Dream Journal */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Dream Journal with Map Anchors</h2>
            <DreamJournalMapAnchors />
          </section>
        </div>
      </div>
    </div>
  );
}
