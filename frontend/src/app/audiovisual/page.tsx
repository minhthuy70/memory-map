'use client';

import VintageScrapbookMaker from '../../components/VintageScrapbookMaker';
import EnvironmentalSoundscapeMixer from '../../components/EnvironmentalSoundscapeMixer';
import HandwritingCanvas from '../../components/HandwritingCanvas';
import VintageFilmEmulation from '../../components/VintageFilmEmulation';
import LivePhotoMotionViewer from '../../components/LivePhotoMotionViewer';
import BeforeAfterSlider from '../../components/BeforeAfterSlider';
import TypographyStampStudio from '../../components/TypographyStampStudio';
import BeatSyncVideoGenerator from '../../components/BeatSyncVideoGenerator';
import AIVoiceoverCommentary from '../../components/AIVoiceoverCommentary';
import MemorySoundtrackMashup from '../../components/MemorySoundtrackMashup';

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

          {/* Handwriting Canvas */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Handwriting & Digital Pen Canvas</h2>
            <HandwritingCanvas />
          </section>

          {/* Vintage Film Emulation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Vintage Film & Analog Camera Emulation</h2>
            <VintageFilmEmulation />
          </section>

          {/* Live Photo */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Live Photo & Burst Shot Motion Viewer</h2>
            <LivePhotoMotionViewer />
          </section>

          {/* Before/After Slider */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Before & After Interactive Comparison Slider</h2>
            <BeforeAfterSlider />
          </section>

          {/* Typography Stamp */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Custom Typography & Stamp Studio</h2>
            <TypographyStampStudio />
          </section>

          {/* Beat Sync Video */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Dynamic Beat-sync Video Generator</h2>
            <BeatSyncVideoGenerator />
          </section>

          {/* AI Voiceover */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Voiceover & Audio Commentary</h2>
            <AIVoiceoverCommentary />
          </section>

          {/* Memory Soundtrack */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Memory Soundtrack AI Mashup</h2>
            <MemorySoundtrackMashup />
          </section>
        </div>
      </div>
    </div>
  );
}
