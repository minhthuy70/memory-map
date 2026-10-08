'use client';

import OfflineCRDTSync from '../../components/OfflineCRDTSync';
import PersonalNASBackup from '../../components/PersonalNASBackup';
import SingleFileHTMLVault from '../../components/SingleFileHTMLVault';
import WidgetStudio from '../../components/WidgetStudio';
import UniversalClipboardDrop from '../../components/UniversalClipboardDrop';
import DesktopAppWrapper from '../../components/DesktopAppWrapper';
import P2PLocalSync from '../../components/P2PLocalSync';
import WatchFaceComplications from '../../components/WatchFaceComplications';
import CarDashboardIntegration from '../../components/CarDashboardIntegration';
import WildernessDataSaver from '../../components/WildernessDataSaver';

export default function HybridCloudPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Hybrid Cloud & Cross-Platform Apps
          </h1>
          <p className="text-lg text-gray-600">
            Offline-first architecture, backup solutions, and cross-device synchronization
          </p>
        </div>

        <div className="space-y-8">
          {/* Offline Sync */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Offline-First with CRDTs</h2>
            <OfflineCRDTSync />
          </section>

          {/* NAS Backup */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Personal NAS & Private Cloud Backup</h2>
            <PersonalNASBackup />
          </section>

          {/* Vault Export */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Single-file HTML Vault Export</h2>
            <SingleFileHTMLVault />
          </section>

          {/* Widget Studio */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Widget Studio</h2>
            <WidgetStudio />
          </section>

          {/* Clipboard Sync */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Universal Cross-device Clipboard</h2>
            <UniversalClipboardDrop />
          </section>

          {/* Desktop App */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Native Desktop App</h2>
            <DesktopAppWrapper />
          </section>

          {/* P2P Sync */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Peer-to-Peer Local Network Sync</h2>
            <P2PLocalSync />
          </section>

          {/* Watch Complications */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Watch Face Complications</h2>
            <WatchFaceComplications />
          </section>

          {/* Car Integration */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Car Dashboard Integration</h2>
            <CarDashboardIntegration />
          </section>

          {/* Wilderness Data Saver */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Wilderness Data-saver Mode</h2>
            <WildernessDataSaver />
          </section>
        </div>
      </div>
    </div>
  );
}
