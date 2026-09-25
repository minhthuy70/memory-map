'use client';

import { useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Download,
  Heart,
  Info,
  RefreshCw,
  Share2,
  Star,
  TrendingUp,
  Zap
} from 'lucide-react';

interface AIYearlyReflectionProps {
  onCancel?: () => void;
}

interface YearlyReflection {
  id: string;
  year: number;
  title: string;
  summary: string;
  highlights: string[];
  generatedAt: string;
  status: 'draft' | 'published' | 'archived';
}

interface ReflectionSection {
  id: string;
  name: string;
  description: string;
  isIncluded: boolean;
}

interface YearlyStats {
  year: number;
  totalMemories: number;
  topLocations: string[];
  moodDistribution: { [key: string]: number };
  growthRate: number;
}

export default function AIYearlyReflection({ onCancel }: AIYearlyReflectionProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isReflectionEnabled, setIsReflectionEnabled] = useState(true);

  const [yearlyReflections, setYearlyReflections] = useState<YearlyReflection[]>([
    { 
      id: '1', 
      year: 2023, 
      title: '2023 CalendarDays in Review', 
      summary: '2023 was a year of growth and adventure. You created 245 memories across 15 locations, with a focus on travel and family time. Your most positive memories were beach trips and mountain adventures.',
      highlights: ['First international trip', 'New family traditions', 'Achieved fitness goals', 'Met new friends'],
      generatedAt: '2024-01-01',
      status: 'published'
    },
    { 
      id: '2', 
      year: 2022, 
      title: '2022 Reflection', 
      summary: '2022 was a year of resilience and adaptation. Despite challenges, you found joy in small moments and maintained strong connections with loved ones.',
      highlights: ['Adapted to changes', 'Strengthened relationships', 'Started new hobbies', 'Celebrated milestones'],
      generatedAt: '2023-01-01',
      status: 'archived'
    },
  ]);

  const [reflectionSections, setReflectionSections] = useState<ReflectionSection[]>([
    { id: '1', name: 'Yearly Summary', description: 'Overview of the year', isIncluded: true },
    { id: '2', name: 'Key Highlights', description: 'Most important moments', isIncluded: true },
    { id: '3', name: 'Mood Analysis', description: 'Emotional trends', isIncluded: true },
    { id: '4', name: 'Growth Metrics', description: 'Personal development', isIncluded: true },
    { id: '5', name: 'Recommendations', description: 'AI suggestions for next year', isIncluded: true },
  ]);

  const [yearlyStats, setYearlyStats] = useState<YearlyStats>({
    year: 2024,
    totalMemories: 320,
    topLocations: ['Paris', 'Beach', 'Mountain', 'City'],
    moodDistribution: { happy: 150, nostalgic: 80, excited: 60, peaceful: 30 },
    growthRate: 15.5,
  });

  const generateReflection = () => {
    const currentYear = new Date().getFullYear();
    const newReflection: YearlyReflection = {
      id: Date.now().toString(),
      year: currentYear,
      title: `${currentYear} CalendarDays in Review`,
      summary: `AI-generated reflection for ${currentYear}. This year was filled with memorable experiences, personal growth, and meaningful connections.`,
      highlights: ['Achieved new milestones', 'Created lasting memories', 'Strengthened relationships', 'Explored new places'],
      generatedAt: new Date().toISOString().split('T')[0],
      status: 'draft',
    };
    setYearlyReflections([...yearlyReflections, newReflection]);
  };

  const toggleSection = (id: string) => {
    setReflectionSections(reflectionSections.map(section => 
      section.id === id ? { ...section, isIncluded: !section.isIncluded } : section
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'draft': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'archived': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Yearly Reflection
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI writes year-end reflections
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isReflectionEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isReflectionEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Reflections</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{yearlyReflections.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Published</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{yearlyReflections.filter(r => r.status === 'published').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Memories</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{yearlyStats.totalMemories}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Growth Rate</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{yearlyStats.growthRate}%</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isReflectionEnabled}
              onChange={(e) => setIsReflectionEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Reflection</span>
          </div>
          <button
            type="button"
            onClick={generateReflection}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <BookOpen className="h-3 w-3" />
            Generate Reflection
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Current CalendarDays Stats</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-sky-400" />
                <span className="text-xs text-slate-900 dark:text-white">CalendarDays</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">{yearlyStats.year}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Total Memories</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">{yearlyStats.totalMemories}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Heart className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Growth Rate</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">{yearlyStats.growthRate}%</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Reflection Sections</h4>
          <div className="space-y-2">
            {reflectionSections.map((section) => (
              <div key={section.id} className={`p-3 rounded-lg border ${section.isIncluded ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-sky-400" />
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Yearly Reflections</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {yearlyReflections.map((reflection) => (
              <div key={reflection.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-sky-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{reflection.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(reflection.status)}`}>
                          {reflection.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{reflection.year} • Generated: {reflection.generatedAt}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-slate-900 dark:text-white">{reflection.summary}</p>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Highlights:</p>
                  <div className="flex flex-wrap gap-1">
                    {reflection.highlights.map((highlight, index) => (
                      <span key={index} className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <BookOpen className="h-3 w-3" />
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Yearly Reflection Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI generates comprehensive year-end reflections</li>
              <li>• Includes summary, highlights, mood analysis, growth metrics</li>
              <li>• Customizable reflection sections</li>
              <li>• Download and share reflection documents</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
