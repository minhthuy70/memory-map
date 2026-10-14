'use client';

import InteractiveGlobeMode from '../../components/InteractiveGlobeMode';
import TerrainElevation3D from '../../components/TerrainElevation3D';
import FlightPath3DAnimation from '../../components/FlightPath3DAnimation';
import Landmark3DModels from '../../components/Landmark3DModels';
import WeatherSimulation3D from '../../components/WeatherSimulation3D';
import SpatialMediaSupport from '../../components/SpatialMediaSupport';
import GaussianSplattingViewer from '../../components/GaussianSplattingViewer';
import PhotogrammetryReconstruction from '../../components/PhotogrammetryReconstruction';
import MemoryDioramaBox from '../../components/MemoryDioramaBox';
import VirtualStreetTour from '../../components/VirtualStreetTour';

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

          {/* 3D Terrain & Elevation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3D Terrain & Elevation Map</h2>
            <TerrainElevation3D />
          </section>

          {/* 3D Flight Path Animation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3D Travel Flight Path Animation</h2>
            <FlightPath3DAnimation />
          </section>

          {/* 3D Landmark Models */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3D Landmark & City Models</h2>
            <Landmark3DModels />
          </section>

          {/* Weather Simulation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Day/Night Cycle & Realistic Weather Simulation</h2>
            <WeatherSimulation3D />
          </section>

          {/* Spatial Media */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Apple Vision Pro Spatial Media Support</h2>
            <SpatialMediaSupport />
          </section>

          {/* Gaussian Splatting */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3D Gaussian Splatting Viewer</h2>
            <GaussianSplattingViewer />
          </section>

          {/* Photogrammetry */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Photogrammetry 3D Memory Reconstruction</h2>
            <PhotogrammetryReconstruction />
          </section>

          {/* Memory Diorama */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3D Memory Diorama Box</h2>
            <MemoryDioramaBox />
          </section>

          {/* Virtual Street Tour */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Virtual Street Walk & Connected 360 Tour</h2>
            <VirtualStreetTour />
          </section>
        </div>
      </div>
    </div>
  );
}
