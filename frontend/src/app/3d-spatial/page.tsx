'use client';

import InteractiveGlobeMode from '../../components/InteractiveGlobeMode';

export default function ThreeDSpatialPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            3D, Digital Twin & Spatial Computing
          </h1>
          <p className="text-lg text-gray-600">
            Interactive 3D globe and spatial computing features
          </p>
        </div>

        <div className="space-y-8">
          {/* 3D Globe */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3D Interactive Globe Mode</h2>
            <InteractiveGlobeMode />
          </section>
        </div>
      </div>
    </div>
  );
}
