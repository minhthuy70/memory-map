'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface UserWidget {
  id: string;
  widgetType: string;
  widgetId: string;
  widgetName: string;
  config: string;
  isEnabled: boolean;
  position: number;
  createdAt: string;
}

export default function WidgetStudio() {
  const { token } = useAuth();
  const [widgets, setWidgets] = useState<UserWidget[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'ios' | 'android' | 'desktop'>('all');
  const [newWidget, setNewWidget] = useState({
    widgetType: 'ios',
    widgetId: '',
    widgetName: '',
    config: '{}',
    isEnabled: true,
    position: 0,
  });

  useEffect(() => {
    fetchWidgets();
  }, [token, filterType]);

  const fetchWidgets = async () => {
    try {
      const url = filterType === 'all'
        ? 'http://localhost:3001/hybrid-cloud/widgets'
        : `http://localhost:3001/hybrid-cloud/widgets?widgetType=${filterType}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setWidgets(data);
    } catch (error) {
      console.error('Failed to fetch widgets:', error);
    }
  };

  const createWidget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/hybrid-cloud/widgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newWidget),
      });

      setShowAddForm(false);
      setNewWidget({ widgetType: 'ios', widgetId: '', widgetName: '', config: '{}', isEnabled: true, position: 0 });
      await fetchWidgets();
    } catch (error) {
      console.error('Failed to create widget:', error);
    }
  };

  const deleteWidget = async (id: string) => {
    if (!confirm('Are you sure you want to delete this widget?')) return;

    try {
      await fetch(`http://localhost:3001/hybrid-cloud/widgets/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchWidgets();
    } catch (error) {
      console.error('Failed to delete widget:', error);
    }
  };

  const toggleEnabled = async (id: string, isEnabled: boolean) => {
    try {
      await fetch(`http://localhost:3001/hybrid-cloud/widgets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isEnabled: !isEnabled }),
      });

      await fetchWidgets();
    } catch (error) {
      console.error('Failed to toggle widget:', error);
    }
  };

  const widgetTypes = [
    { value: 'ios', label: 'iOS WidgetKit', icon: '📱' },
    { value: 'android', label: 'Android Glance', icon: '🤖' },
    { value: 'desktop', label: 'Desktop Widget', icon: '💻' },
  ];

  const availableWidgets = [
    { id: 'on-this-day', name: 'On This Day', description: 'Memories from this date in history' },
    { id: 'mini-pin-map', name: 'Mini Pin Map', description: 'Small map with recent memory pins' },
    { id: 'daily-streak', name: 'Daily Streak', description: 'Track your memory-adding streak' },
    { id: 'mood-ring', name: 'Mood Ring', description: 'Your recent mood trends' },
    { id: 'recent-memories', name: 'Recent Memories', description: 'Latest 3 memories' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Widget Studio</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Widget
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2">
        {widgetTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setFilterType(type.value as any)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === type.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {type.icon} {type.label}
          </button>
        ))}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Add New Widget</h3>
          <form onSubmit={createWidget} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Widget Type</label>
              <select
                value={newWidget.widgetType}
                onChange={(e) => setNewWidget({ ...newWidget, widgetType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {widgetTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Widget</label>
              <select
                value={newWidget.widgetId}
                onChange={(e) => setNewWidget({ ...newWidget, widgetId: e.target.value, widgetName: availableWidgets.find(w => w.id === e.target.value)?.name || '' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a widget...</option>
                {availableWidgets.map((widget) => (
                  <option key={widget.id} value={widget.id}>
                    {widget.name} - {widget.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom Name (Optional)</label>
              <input
                type="text"
                value={newWidget.widgetName}
                onChange={(e) => setNewWidget({ ...newWidget, widgetName: e.target.value })}
                placeholder="My Widget"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input
                type="number"
                value={newWidget.position}
                onChange={(e) => setNewWidget({ ...newWidget, position: parseInt(e.target.value) })}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isEnabled"
                checked={newWidget.isEnabled}
                onChange={(e) => setNewWidget({ ...newWidget, isEnabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isEnabled" className="text-sm text-gray-700">
                Enable widget
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Widget
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Widgets List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Your Widgets ({widgets.length})
        </h3>

        {widgets.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No widgets configured</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className={`p-4 border rounded-lg transition-colors ${
                  widget.isEnabled ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">
                        {widget.widgetType === 'ios' ? '📱' : widget.widgetType === 'android' ? '🤖' : '💻'}
                      </span>
                      <span className="font-medium text-gray-800">{widget.widgetName}</span>
                    </div>
                    <span className="text-xs text-gray-500 capitalize">{widget.widgetType}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    widget.isEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {widget.isEnabled ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => toggleEnabled(widget.id, widget.isEnabled)}
                    className="flex-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 text-sm transition-colors"
                  >
                    {widget.isEnabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => deleteWidget(widget.id)}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Widget Sizes</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Small:</strong> 2x2 icons</li>
          <li>• <strong>Medium:</strong> 4x2 horizontal</li>
          <li>• <strong>Large:</strong> 4x4 full square</li>
        </ul>
      </div>
    </div>
  );
}
