'use client';

import SelfDestructingMemories from '../../components/SelfDestructingMemories';
import DuressDistressPassword from '../../components/DuressDistressPassword';
import ImmutableAuditLedger from '../../components/ImmutableAuditLedger';
import RemoteEmergencyKillSwitch from '../../components/RemoteEmergencyKillSwitch';
import CalculatorCamouflage from '../../components/CalculatorCamouflage';
import ZeroKnowledgeE2EE from '../../components/ZeroKnowledgeE2EE';
import ExifSanitizer from '../../components/ExifSanitizer';
import ScreenshotPrevention from '../../components/ScreenshotPrevention';

export default function PrivacyVaultPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Advanced Privacy, Vault & Zero-knowledge
          </h1>
          <p className="text-lg text-gray-600">
            Military-grade security, self-destructing memories, and emergency protection
          </p>
        </div>

        <div className="space-y-8">
          {/* Emergency Kill Switch - Always on top */}
          <section>
            <h2 className="text-2xl font-bold text-red-800 mb-4">Emergency Protection</h2>
            <RemoteEmergencyKillSwitch />
          </section>

          {/* Self-destructing Memories */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ephemeral Self-destructing Memories</h2>
            <SelfDestructingMemories />
          </section>

          {/* Duress Password */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Duress Distress Password</h2>
            <DuressDistressPassword />
          </section>

          {/* Audit Ledger */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Immutable Audit Log Ledger</h2>
            <ImmutableAuditLedger />
          </section>
        </div>
      </div>
    </div>
  );
}
