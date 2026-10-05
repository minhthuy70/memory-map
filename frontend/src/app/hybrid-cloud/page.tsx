'use client';

import OfflineCRDTSync from '../../components/OfflineCRDTSync';
import PersonalNASBackup from '../../components/PersonalNASBackup';
import SingleFileHTMLVault from '../../components/SingleFileHTMLVault';
import WidgetStudio from '../../components/WidgetStudio';
import UniversalClipboardDrop from '../../components/UniversalClipboardDrop';

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
        </div>
      </div>
    </div>
  );
}
