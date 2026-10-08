'use client';

import AutonomousChroniclerAgent from '../../components/AutonomousChroniclerAgent';
import AIBiographerInterviewer from '../../components/AIBiographerInterviewer';
import AutoPhotoCuration from '../../components/AutoPhotoCuration';
import SemanticDeepSearch from '../../components/SemanticDeepSearch';
import PersonalVoiceCloning from '../../components/PersonalVoiceCloning';
import TravelRouteAutoNarrator from '../../components/TravelRouteAutoNarrator';
import HistoricalTimeTravelSim from '../../components/HistoricalTimeTravelSim';
import AgeRegressionProgression from '../../components/AgeRegressionProgression';
import MultiPerspectiveSynthesizer from '../../components/MultiPerspectiveSynthesizer';
import PredictiveResurfacing from '../../components/PredictiveResurfacing';

export default function AICompanionPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Multi-agent Companion & Autonomous Chronicler
          </h1>
          <p className="text-lg text-gray-600">
            AI-powered journaling, photo curation, semantic search, and voice cloning
          </p>
        </div>

        <div className="space-y-8">
          {/* Autonomous Chronicler */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Autonomous Evening Chronicler</h2>
            <AutonomousChroniclerAgent />
          </section>

          {/* AI Biographer */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Biographer Voice Interviewer</h2>
            <AIBiographerInterviewer />
          </section>

          {/* Photo Curation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Automated Photo Quality Curation</h2>
            <AutoPhotoCuration />
          </section>

          {/* Semantic Search */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Natural Semantic Deep Search</h2>
            <SemanticDeepSearch />
          </section>

          {/* Voice Cloning */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Personal AI Voice Cloning</h2>
            <PersonalVoiceCloning />
          </section>

          {/* Travel Narration */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Travel Route Auto-narrator</h2>
            <TravelRouteAutoNarrator />
          </section>

          {/* Historical Simulation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Historical Time-travel Simulator</h2>
            <HistoricalTimeTravelSim />
          </section>

          {/* Age Progression */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Visual Age Regression & Progression</h2>
            <AgeRegressionProgression />
          </section>

          {/* Memory Synthesis */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Multi-perspective Memory Synthesizer</h2>
            <MultiPerspectiveSynthesizer />
          </section>

          {/* Predictive Resurfacing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Predictive Resurfacing for Stress Relief</h2>
            <PredictiveResurfacing />
          </section>
        </div>
      </div>
    </div>
  );
}
