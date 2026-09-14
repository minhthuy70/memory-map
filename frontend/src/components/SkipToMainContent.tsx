'use client';

import { useState } from 'react';
import { ArrowDown, X, RefreshCw, Info, CheckCircle, Settings, Eye, EyeOff, Link, Zap } from 'lucide-react';

interface SkipToMainContentProps {
  onCancel?: () => void;
}

interface SkipLinkConfig {
  id: string;
  targetId: string;
  label: string;
  position: 'top' | 'both';
  style: 'visible' | 'hidden-focus';
  isCustom: boolean;
  isActive: boolean;
}

export default function SkipToMainContent({ onCancel }: SkipToMainContentProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [skipLinks, setSkipLinks] = useState<SkipLinkConfig[]>([
    { id: '1', targetId: 'main-content', label: 'Skip to main content', position: 'top', style: 'hidden-focus', isCustom: false, isActive: true },
    { id: '2', targetId: 'main-navigation', label: 'Skip to navigation', position: 'top', style: 'hidden-focus', isCustom: false, isActive: true },
    { id: '3', targetId: 'search', label: 'Skip to search', position: 'top', style: 'hidden-focus', isCustom: false, isActive: false },
    { id: '4', targetId: 'footer', label: 'Skip to footer', position: 'both', style: 'hidden-focus', isCustom: false, isActive: false },
  ]);

  const toggleLink = (id: string) => {
    setSkipLinks(skipLinks.map(link => 
      link.id === id ? { ...link, isActive: !link.isActive } : link
    ));
  };

  const updateStyle = (id: string, style: 'visible' | 'hidden-focus') => {
    setSkipLinks(skipLinks.map(link => 
      link.id === id ? { ...link, style } : link
    ));
  };

  const testSkipLink = () => {
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 3000);
  };

  const addCustomLink = () => {
    const newLink: SkipLinkConfig = {
      id: Date.now().toString(),
      targetId: 'custom-target',
      label: 'Custom skip link',
      position: 'top',
      style: 'hidden-focus',
      isCustom: true,
      isActive: true,
    };
    setSkipLinks([...skipLinks, newLink]);
  };

  const deleteLink = (id: string) => {
    setSkipLinks(skipLinks.filter(link => link.id !== id));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <ArrowDown className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Skip to Main Content Link
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Keyboard navigation skip links
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
        {isVisible && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Link className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Skip Link Preview</span>
            </div>
            <a
              href="#main-content"
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
              onClick={(e) => {
                e.preventDefault();
                setIsVisible(false);
              }}
            >
              Skip to main content
            </a>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Links</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{skipLinks.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{skipLinks.filter(l => l.isActive).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Top Position</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{skipLinks.filter(l => l.position === 'top').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Custom</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{skipLinks.filter(l => l.isCustom).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={testSkipLink}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Zap className="h-3 w-3" />
            Test Skip Link
          </button>
          <button
            type="button"
            onClick={addCustomLink}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Link className="h-3 w-3" />
            Add Custom Link
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Skip Links Configuration</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {skipLinks.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Link className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{link.label}</span>
                      {link.isActive && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Active
                        </span>
                      )}
                      {link.isCustom && (
                        <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Target: #{link.targetId}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Position: {link.position}</span>
                      <span>Style: {link.style}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleLink(link.id)}
                    className={`px-2 py-1 rounded text-xs ${link.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
                  >
                    {link.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStyle(link.id, link.style === 'visible' ? 'hidden-focus' : 'visible')}
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Settings className="h-3 w-3" />
                  </button>
                  {link.isCustom && (
                    <button
                      type="button"
                      onClick={() => deleteLink(link.id)}
                      className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Zap className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Style Options</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Visible</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Always visible on page</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <EyeOff className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Hidden Focus</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Hidden until keyboard focus</span>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Skip Link Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Skip links help keyboard users navigate faster</li>
              <li>• Place skip links at the top of the page</li>
              <li>• Use hidden-focus style for cleaner visual design</li>
              <li>• Test with Tab key to verify functionality</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
