'use client';

import { useState } from 'react';

export default function ZenReflectionMode() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [theme, setTheme] = useState('monochrome');
  const [hideMetrics, setHideMetrics] = useState(true);
  const [breathingReminder, setBreathingReminder] = useState(false);
  const [breathingInterval, setBreathingInterval] = useState(5);
  const [isBreathing, setIsBreathing] = useState(false);

  const handleToggle = () => {
    setIsEnabled(!isEnabled);
  };

  const handleBreathingExercise = () => {
    setIsBreathing(true);
    let cycles = 0;
    const interval = setInterval(() => {
      cycles++;
      if (cycles >= 6) {
        setIsBreathing(false);
        clearInterval(interval);
      }
    }, 5000);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Digital Detox & Zen Reflection Mode</h2>
      <p className="text-gray-600 mb-6">
        Calming monochrome/warm UI, hides all metrics/likes/counts, gentle slow-panning single memory focus, mindful breathing reminder.
      </p>

      <div className="space-y-4">
        {/* Mode Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
          <div>
            <p className="font-medium">Zen Mode</p>
            <p className="text-sm text-gray-600">
              {isEnabled ? 'Active' : 'Inactive'}
            </p>
          </div>
          <button
            onClick={handleToggle}
            className={`px-6 py-2 rounded-full font-medium ${
              isEnabled
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {isEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {isEnabled && (
          <div className="space-y-4">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <div className="flex gap-2">
                {['monochrome', 'warm', 'nature'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-4 py-2 rounded capitalize ${
                      theme === t
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Hide Metrics & Counts</span>
                <input
                  type="checkbox"
                  checked={hideMetrics}
                  onChange={(e) => setHideMetrics(e.target.checked)}
                  className="w-5 h-5"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Breathing Reminder</span>
                <input
                  type="checkbox"
                  checked={breathingReminder}
                  onChange={(e) => setBreathingReminder(e.target.checked)}
                  className="w-5 h-5"
                />
              </div>
              {breathingReminder && (
                <div>
                  <label className="block text-sm mb-1">Reminder Interval (minutes)</label>
                  <input
                    type="number"
                    value={breathingInterval}
                    onChange={(e) => setBreathingInterval(parseInt(e.target.value))}
                    className="w-full p-2 border rounded"
                    min={1}
                    max={60}
                  />
                </div>
              )}
            </div>

            {/* Breathing Exercise */}
            <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-lg text-center">
              <h3 className="font-medium mb-4">Breathing Exercise</h3>
              {isBreathing ? (
                <div className="animate-pulse">
                  <div className="w-24 h-24 mx-auto bg-blue-400 rounded-full mb-4"></div>
                  <p className="text-lg">Breathe in... Breathe out...</p>
                </div>
              ) : (
                <button
                  onClick={handleBreathingExercise}
                  className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                  Start 5-Minute Breathing
                </button>
              )}
            </div>

            {/* Zen Preview */}
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-medium mb-2">Zen Mode Preview</h3>
              <div
                className={`p-4 rounded ${
                  theme === 'monochrome'
                    ? 'bg-gray-200'
                    : theme === 'warm'
                    ? 'bg-orange-100'
                    : 'bg-green-100'
                }`}
              >
                <div className="text-center">
                  <p className="text-lg font-medium">Single Memory Focus</p>
                  {hideMetrics && (
                    <p className="text-sm text-gray-600 mt-2">No metrics, no distractions</p>
                  )}
                  <div className="mt-4 h-32 bg-white rounded opacity-50"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-green-50 rounded">
          <h4 className="font-medium text-green-800 mb-2">Zen Mode Benefits:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Reduced digital noise and distraction</li>
            <li>• Mindful memory appreciation</li>
            <li>• Breathing exercises for calm</li>
            <li>• Customizable calming themes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
