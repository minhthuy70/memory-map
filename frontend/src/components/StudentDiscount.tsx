'use client';

import { useState } from 'react';
import { CheckCircle, FileText, GraduationCap, Info, RefreshCw, Star, Zap } from 'lucide-react';

interface StudentDiscountProps {
  onCancel?: () => void;
}

interface StudentVerification {
  id: string;
  name: string;
  email: string;
  institution: string;
  studentId: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
  verifiedAt?: string;
}

interface DiscountPlan {
  id: string;
  name: string;
  originalPrice: number;
  studentPrice: number;
  discountPercentage: number;
  isSelected: boolean;
}

export default function StudentDiscount({ onCancel }: StudentDiscountProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isStudentDiscountEnabled, setIsStudentDiscountEnabled] = useState(true);

  const [studentVerifications, setStudentVerifications] = useState<StudentVerification[]>([
    { id: '1', name: 'John Student', email: 'john@university.edu', institution: 'University of Technology', studentId: 'UT2024001', status: 'verified', submittedAt: '2024-01-15', verifiedAt: '2024-01-16' },
    { id: '2', name: 'Jane Student', email: 'jane@college.edu', institution: 'College of Arts', studentId: 'CA2024002', status: 'pending', submittedAt: '2024-02-20' },
    { id: '3', name: 'Mike Student', email: 'mike@school.edu', institution: 'School of Science', studentId: 'SS2024003', status: 'rejected', submittedAt: '2024-03-10' },
  ]);

  const [discountPlans, setDiscountPlans] = useState<DiscountPlan[]>([
    { id: '1', name: 'Basic Plan', originalPrice: 9.99, studentPrice: 4.99, discountPercentage: 50, isSelected: false },
    { id: '2', name: 'Pro Plan', originalPrice: 19.99, studentPrice: 9.99, discountPercentage: 50, isSelected: false },
    { id: '3', name: 'Family Plan', originalPrice: 24.99, studentPrice: 12.49, discountPercentage: 50, isSelected: false },
  ]);

  const selectPlan = (id: string) => {
    setDiscountPlans(discountPlans.map(plan => 
      plan.id === id ? { ...plan, isSelected: !plan.isSelected } : { ...plan, isSelected: false }
    ));
  };

  const verifyStudent = (id: string, status: 'verified' | 'rejected') => {
    setStudentVerifications(studentVerifications.map(verification => 
      verification.id === id 
        ? { ...verification, status, verifiedAt: new Date().toISOString().split('T')[0] }
        : verification
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Student Discount
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              50% discount for students
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isStudentDiscountEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isStudentDiscountEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Discount</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">50%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Verified</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{studentVerifications.filter(v => v.status === 'verified').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pending</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{studentVerifications.filter(v => v.status === 'pending').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Plans</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{discountPlans.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isStudentDiscountEnabled}
              onChange={(e) => setIsStudentDiscountEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Student Discount</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <FileText className="h-3 w-3" />
            New Verification
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Student Verifications</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {studentVerifications.map((verification) => (
              <div key={verification.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <GraduationCap className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{verification.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(verification.status)}`}>
                          {verification.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{verification.email}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{verification.institution}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">ID: {verification.studentId}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {verification.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => verifyStudent(verification.id, 'verified')}
                          className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => verifyStudent(verification.id, 'rejected')}
                          className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Submitted: {verification.submittedAt}</span>
                  {verification.verifiedAt && <span>• Verified: {verification.verifiedAt}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Student Pricing</h4>
          <div className="space-y-2">
            {discountPlans.map((plan) => (
              <div key={plan.id} className={`p-3 rounded-lg border ${plan.isSelected ? 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => selectPlan(plan.id)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${plan.isSelected ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      {plan.isSelected && <Check className="h-4 w-4 text-white" />}
                    </button>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{plan.name}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">
                    {plan.discountPercentage}% OFF
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Original</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">${plan.originalPrice}/mo</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Student</p>
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">${plan.studentPrice}/mo</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Student Discount Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• 50% discount for verified students</li>
              <li>• Requires valid student ID verification</li>
              <li>• Available for Basic, Pro, and Family plans</li>
              <li>• Verification required annually</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
