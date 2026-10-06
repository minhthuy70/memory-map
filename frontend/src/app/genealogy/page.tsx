'use client';

import TimeLockedCapsule from '../../components/TimeLockedCapsule';
import FamilyHeirloomArchive from '../../components/FamilyHeirloomArchive';
import FamilyRecipeArchive from '../../components/FamilyRecipeArchive';

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
        </div>
      </div>
    </div>
  );
}
