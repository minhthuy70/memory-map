'use client';

import TripExpenseTracker from '../../components/TripExpenseTracker';
import PackingAndDocWallet from '../../components/PackingAndDocWallet';
import MemoryToItinerary from '../../components/MemoryToItinerary';
import RouteOptimizerTSP from '../../components/RouteOptimizerTSP';
import MultiModalNavigation from '../../components/MultiModalNavigation';
import OfflineTravelGuide from '../../components/OfflineTravelGuide';
import LiveFlightTrainSync from '../../components/LiveFlightTrainSync';
import PassportVisaTracker from '../../components/PassportVisaTracker';
import CarbonFootprintCalculator from '../../components/CarbonFootprintCalculator';
import TravelSafetySOS from '../../components/TravelSafetySOS';

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

          {/* Memory to Itinerary */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Memory-to-Itinerary Converter</h2>
            <MemoryToItinerary />
          </section>

          {/* Route Optimizer */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Smart Traveling Salesman Route Optimization</h2>
            <RouteOptimizerTSP />
          </section>

          {/* Multi-modal Navigation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Multi-modal Route Navigation</h2>
            <MultiModalNavigation />
          </section>

          {/* Offline Guide */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Offline Travel Guide Generator</h2>
            <OfflineTravelGuide />
          </section>

          {/* Flight/Train Status */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Live Flight & Train Status Sync</h2>
            <LiveFlightTrainSync />
          </section>

          {/* Passport/Visa Tracker */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Country Passport & Visa Tracker</h2>
            <PassportVisaTracker />
          </section>

          {/* Carbon Footprint */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Carbon Footprint & Eco-Travel Calculator</h2>
            <CarbonFootprintCalculator />
          </section>

          {/* Safety SOS */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Travel Emergency & SOS Hub</h2>
            <TravelSafetySOS />
          </section>
        </div>
      </div>
    </div>
  );
}
