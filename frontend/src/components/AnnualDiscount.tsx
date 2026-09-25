import { Calendar, CheckCircle, Gift, Info, RefreshCw, Star, X, Zap } from 'lucide-react';
'use client';

import { useState } from 'react';


interface AnnualDiscountProps {
  onCancel?: () => void;
}

interface DiscountPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  savings: number;
  freeMonths: number;
  isSelected: boolean;
}

export default function AnnualDiscount({ onCancel }: AnnualDiscountProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isAnnualEnabled, setIsAnnualEnabled] = useState(true);

  const [discountPlans, setDiscountPlans] = useState<DiscountPlan[]>([
    { id: '1', name: 'Basic Plan', monthlyPrice: 9.99, yearlyPrice: 99.99, savings: 17, freeMonths: 2, isSelected: false },
    { id: '2', name: 'Pro Plan', monthlyPrice: 19.99, yearlyPrice: 199.99, savings: 17, freeMonths: 2, isSelected: false },
    { id: '3', name: 'Family Plan', monthlyPrice: 24.99, yearlyPrice: 249.99, savings: 17, freeMonths: 2, isSelected: false },
    { id: '4', name: 'Enterprise Plan', monthlyPrice: 99.99, yearlyPrice: 999.99, savings: 17, freeMonths: 2, isSelected: false },
  ]);

  const selectPlan = (id: string) => {
    setDiscountPlans(discountPlans.map(plan => 
      plan.id === id ? { ...plan, isSelected: !plan.isSelected } : { ...plan, isSelected: false }
    ));
  };

  const getMonthlyWithDiscount = (plan: DiscountPlan) => {
    return (plan.yearlyPrice / 12).toFixed(2);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <Gift className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Annual Discount
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              2 months free on yearly plans
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isAnnualEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isAnnualEnabled ? 'Enabled' : 'Disabled'}
          </span>
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Free Months</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">2</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Average Savings</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">17%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Plans Available</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{discountPlans.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Selected</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{discountPlans.filter(p => p.isSelected).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isAnnualEnabled}
              onChange={(e) => setIsAnnualEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Annual Discount</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Zap className="h-3 w-3" />
            Apply to All
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Yearly Plans</h4>
          <div className="space-y-2">
            {discountPlans.map((plan) => (
              <div key={plan.id} className={`p-3 rounded-lg border ${plan.isSelected ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => selectPlan(plan.id)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${plan.isSelected ? 'bg-pink-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      {plan.isSelected && <Check className="h-4 w-4 text-white" />}
                    </button>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{plan.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      {plan.savings}% OFF
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300">
                      {plan.freeMonths} Months Free
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Monthly</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">${plan.monthlyPrice}/mo</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Yearly</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">${plan.yearlyPrice}/yr</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Effective</p>
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">${getMonthlyWithDiscount(plan)}/mo</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Savings Breakdown</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Basic Plan</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Save $19.89</p>
              <p className="text-xs text-green-600 dark:text-green-400">($119.88 → $99.99)</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pro Plan</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Save $39.89</p>
              <p className="text-xs text-green-600 dark:text-green-400">($239.88 → $199.99)</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Family Plan</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Save $49.89</p>
              <p className="text-xs text-green-600 dark:text-green-400">($299.88 → $249.99)</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Enterprise Plan</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Save $199.89</p>
              <p className="text-xs text-green-600 dark:text-green-400">($1,199.88 → $999.99)</p>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Annual Discount Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Yearly plans save 17% compared to monthly</li>
              <li>• Get 2 months free on all plans</li>
              <li>• Automatic renewal for convenience</li>
              <li>• Cancel anytime, prorated refund available</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
