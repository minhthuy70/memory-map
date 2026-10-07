'use client';

import TripExpenseTracker from '../../components/TripExpenseTracker';
import PackingAndDocWallet from '../../components/PackingAndDocWallet';

export default function TripPlanningPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Advanced Trip Planning & Travel Logistics
          </h1>
          <p className="text-lg text-gray-600">
            Plan, budget, and organize your travel adventures
          </p>
        </div>

        <div className="space-y-8">
          {/* Expense Tracker */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Trip Budget & Expense Tracker</h2>
            <TripExpenseTracker />
          </section>

          {/* Packing & Documents */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Packing Checklist & Document Wallet</h2>
            <PackingAndDocWallet />
          </section>
        </div>
      </div>
    </div>
  );
}
