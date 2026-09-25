'use client';

import { useState } from 'react';
import { Check, CheckCircle, Info, RefreshCw, Shield, Star, Zap } from 'lucide-react';

interface BasicPlanProps {
  onCancel?: () => void;
}

interface PlanFeature {
  id: string;
  name: string;
  description: string;
  isIncluded: boolean;
  value: string;
}

export default function BasicPlan({ onCancel }: BasicPlanProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const [planFeatures, setPlanFeatures] = useState<PlanFeature[]>([
    { id: '1', name: 'Unlimited Memories', description: 'Create unlimited memories', isIncluded: true, value: 'Unlimited' },
    { id: '2', name: 'Storage Space', description: 'Cloud storage for media', isIncluded: true, value: '10GB' },
    { id: '3', name: 'Photos per Memory', description: 'Number of photos per memory', isIncluded: true, value: 'Unlimited' },
    { id: '4', name: 'Basic AI Features', description: 'AI-powered features', isIncluded: true, value: '5 uses/day' },
    { id: '5', name: 'Video Support', description: 'Upload videos', isIncluded: false, value: 'Pro only' },
    { id: '6', name: 'Advanced AI', description: 'Advanced AI features', isIncluded: false, value: 'Pro only' },
    { id: '7', name: 'Priority Support', description: 'Priority customer support', isIncluded: false, value: 'Pro only' },
    { id: '8', name: 'Custom Domain', description: 'Custom domain branding', isIncluded: false, value: 'Enterprise only' },
  ]);

  const toggleFeature = (id: string) => {
    setPlanFeatures(planFeatures.map(feature => 
      feature.id === id ? { ...feature, isIncluded: !feature.isIncluded } : feature
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Basic Plan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Unlimited memories, 10GB storage
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">$9.99/mo</span>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show details"
          >
            {showDetails ? <Info className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Đóng"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Price</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">$9.99/mo</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Included</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{planFeatures.filter(f => f.isIncluded).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Storage</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">10GB</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Memories</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">Unlimited</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsSelected(!isSelected)}
            className={`px-3 py-1.5 rounded-lg text-xs border-0 flex items-center gap-1 ${isSelected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
          >
            {isSelected ? <Check className="h-3 w-3" /> : <Star className="h-3 w-3" />}
            {isSelected ? 'Selected' : 'Select Plan'}
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Zap className="h-3 w-3" />
            Upgrade
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Plan Features</h4>
          <div className="space-y-2">
            {planFeatures.map((feature) => (
              <div key={feature.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${feature.isIncluded ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    {feature.isIncluded && <Check className="h-4 w-4 text-white" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{feature.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{feature.description}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold ${feature.isIncluded ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`}>
                  {feature.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Pricing</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Monthly</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">$9.99</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Yearly</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">$99.99</p>
              <p className="text-xs text-green-600 dark:text-green-400">Save 17%</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Trial</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">7 days</p>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Basic Plan Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Basic plan removes freemium limitations</li>
              <li>• 10GB storage sufficient for most users</li>
              <li>• Upgrade to Pro for advanced features</li>
              <li>• Yearly subscription saves 17%</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
