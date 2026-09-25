'use client';

import { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  Download,
  Eye,
  FileText,
  Info,
  RefreshCw,
  Share2,
  Star,
  TrendingUp,
  Zap
} from 'lucide-react';

interface AIPersonalizedInsightsReportProps {
  onCancel?: () => void;
}

interface InsightCategory {
  id: string;
  name: string;
  description: string;
  insightsCount: number;
  trend: 'up' | 'down' | 'stable';
}

interface InsightReport {
  id: string;
  month: string;
  year: number;
  generatedAt: string;
  status: 'generated' | 'processing' | 'failed';
  insights: {
    totalMemories: number;
    newMemories: number;
    topLocations: string[];
    moodDistribution: { [key: string]: number };
    activityLevel: 'high' | 'medium' | 'low';
    recommendations: string[];
  };
}

interface ReportSection {
  id: string;
  name: string;
  description: string;
  isIncluded: boolean;
}

export default function AIPersonalizedInsightsReport({ onCancel }: AIPersonalizedInsightsReportProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isReportEnabled, setIsReportEnabled] = useState(true);

  const [insightCategories, setInsightCategories] = useState<InsightCategory[]>([
    { id: '1', name: 'Memory Patterns', description: 'Patterns in memory creation', insightsCount: 15, trend: 'up' },
    { id: '2', name: 'Mood Analysis', description: 'Emotional trends over time', insightsCount: 12, trend: 'stable' },
    { id: '3', name: 'Location Trends', description: 'Frequent places and activities', insightsCount: 20, trend: 'up' },
    { id: '4', name: 'Activity Level', description: 'User engagement patterns', insightsCount: 8, trend: 'down' },
  ]);

  const [insightReports, setInsightReports] = useState<InsightReport[]>([
    { 
      id: '1', 
      month: 'January', 
      year: 2024, 
      generatedAt: '2024-01-31', 
      status: 'generated',
      insights: {
        totalMemories: 245,
        newMemories: 35,
        topLocations: ['Paris', 'Beach', 'Mountain'],
        moodDistribution: { happy: 45, nostalgic: 30, excited: 15, peaceful: 10 },
        activityLevel: 'high',
        recommendations: ['Try new outdoor activities', 'Capture more sunset moments', 'Revisit favorite locations']
      }
    },
    { 
      id: '2', 
      month: 'February', 
      year: 2024, 
      generatedAt: '2024-02-29', 
      status: 'generated',
      insights: {
        totalMemories: 280,
        newMemories: 35,
        topLocations: ['Beach', 'City', 'Home'],
        moodDistribution: { happy: 50, nostalgic: 25, excited: 15, peaceful: 10 },
        activityLevel: 'medium',
        recommendations: ['Explore new cities', 'Balance indoor and outdoor activities', 'Spend more quality time with family']
      }
    },
  ]);

  const [reportSections, setReportSections] = useState<ReportSection[]>([
    { id: '1', name: 'Memory Statistics', description: 'Overview of memory metrics', isIncluded: true },
    { id: '2', name: 'Mood Analysis', description: 'Emotional insights', isIncluded: true },
    { id: '3', name: 'Location Trends', description: 'Geographic patterns', isIncluded: true },
    { id: '4', name: 'Activity Patterns', description: 'Engagement trends', isIncluded: true },
    { id: '5', name: 'Recommendations', description: 'AI-powered suggestions', isIncluded: true },
  ]);

  const generateReport = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonth = months[new Date().getMonth()];
    const currentYear = new Date().getFullYear();

    const newReport: InsightReport = {
      id: Date.now().toString(),
      month: currentMonth,
      year: currentYear,
      generatedAt: new Date().toISOString().split('T')[0],
      status: 'generated',
      insights: {
        totalMemories: insightReports.reduce((acc, r) => acc + r.insights.totalMemories, 0) + Math.floor(Math.random() * 20) + 10,
        newMemories: Math.floor(Math.random() * 30) + 20,
        topLocations: ['Location A', 'Location B', 'Location C'],
        moodDistribution: { happy: Math.floor(Math.random() * 30) + 30, nostalgic: Math.floor(Math.random() * 20) + 20, excited: Math.floor(Math.random() * 15) + 10, peaceful: Math.floor(Math.random() * 10) + 5 },
        activityLevel: 'medium',
        recommendations: ['Try new experiences', 'Connect with old friends', 'Document special moments']
      },
    };
    setInsightReports([...insightReports, newReport]);
  };

  const toggleSection = (id: string) => {
    setReportSections(reportSections.map(section => 
      section.id === id ? { ...section, isIncluded: !section.isIncluded } : section
    ));
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'down': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'stable': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'processing': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Personalized Insights Report
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monthly AI-powered insights
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isReportEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isReportEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Categories</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{insightCategories.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Reports</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{insightReports.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Insights</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{insightCategories.reduce((acc, c) => acc + c.insightsCount, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Sections</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{reportSections.filter(s => s.isIncluded).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isReportEnabled}
              onChange={(e) => setIsReportEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Reports</span>
          </div>
          <button
            type="button"
            onClick={generateReport}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Calendar className="h-3 w-3" />
            Generate Report
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Insight Categories</h4>
          <div className="space-y-2">
            {insightCategories.map((category) => (
              <div key={category.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-teal-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{category.name}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{category.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{category.insightsCount}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">insights</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-xs ${getTrendColor(category.trend)}`}>
                    {category.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Report Sections</h4>
          <div className="space-y-2">
            {reportSections.map((section) => (
              <div key={section.id} className={`p-3 rounded-lg border ${section.isIncluded ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-teal-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{section.name}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{section.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className={`px-2 py-1 rounded text-xs ${section.isIncluded ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {section.isIncluded ? 'Exclude' : 'Include'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Generated Reports</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {insightReports.map((report) => (
              <div key={report.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-teal-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{report.month} {report.year}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Generated: {report.generatedAt}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{report.insights.totalMemories} memories</p>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400">New Memories</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{report.insights.newMemories}</p>
                    </div>
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Activity</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{report.insights.activityLevel}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1"
                  >
                    <Share2 className="h-3 w-3" />
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">AI Insights Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Monthly AI reports analyze memory patterns</li>
              <li>• Mood tracking and emotional insights</li>
              <li>• Location trends and activity patterns</li>
              <li>• Personalized recommendations based on data</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
