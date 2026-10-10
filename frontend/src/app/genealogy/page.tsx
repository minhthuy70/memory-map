'use client';

import TimeLockedCapsule from '../../components/TimeLockedCapsule';
import FamilyHeirloomArchive from '../../components/FamilyHeirloomArchive';
import FamilyRecipeArchive from '../../components/FamilyRecipeArchive';
import FamilyTreeInteractive from '../../components/FamilyTreeInteractive';
import AncestralMigrationMap from '../../components/AncestralMigrationMap';
import OralHistoryVault from '../../components/OralHistoryVault';
import GenerationalLookalike from '../../components/GenerationalLookalike';
import GeofencedCapsule from '../../components/GeofencedCapsule';
import LegacyLetterWill from '../../components/LegacyLetterWill';
import DigitalMemorialTribute from '../../components/DigitalMemorialTribute';

export default function GenealogyPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Genealogy & Time Travel Capsules
          </h1>
          <p className="text-lg text-gray-600">
            Family heritage, heirlooms, and digital time capsules
          </p>
        </div>

        <div className="space-y-8">
          {/* Time Capsules */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Time-Locked Capsules</h2>
            <TimeLockedCapsule />
          </section>

          {/* Heirlooms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Family Heirloom Archive</h2>
            <FamilyHeirloomArchive />
          </section>

          {/* Recipes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Family Recipe Archive</h2>
            <FamilyRecipeArchive />
          </section>

          {/* Family Tree */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Interactive Multi-generational Family Tree</h2>
            <FamilyTreeInteractive />
          </section>

          {/* Ancestral Migration */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ancestral Migration Timeline Map</h2>
            <AncestralMigrationMap />
          </section>

          {/* Oral History */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Oral History & Dialect Preservation Vault</h2>
            <OralHistoryVault />
          </section>

          {/* Generational Comparison */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Generational Photo Comparison (Lookalike)</h2>
            <GenerationalLookalike />
          </section>

          {/* Geofenced Capsule */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Geofenced Location Capsule</h2>
            <GeofencedCapsule />
          </section>

          {/* Legacy Letter */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Legacy Letter & Digital Will</h2>
            <LegacyLetterWill />
          </section>

          {/* Digital Memorial */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Digital Memorial & Eternal Tribute Page</h2>
            <DigitalMemorialTribute />
          </section>
        </div>
      </div>
    </div>
  );
}
