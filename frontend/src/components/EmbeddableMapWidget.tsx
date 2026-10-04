'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface MapWidget {
  id: string;
  title: string;
  widgetId: string;
  theme: string;
  showControls: boolean;
  showLabels: boolean;
  customCSS?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EmbeddableMapWidget() {
  const { token } = useAuth();
  const [widgets, setWidgets] = useState<MapWidget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<MapWidget | null>(null);
  const [embedCode, setEmbedCode] = useState<string>('');

  const fetchWidgets = async () => {
    try {
      const response = await fetch('http://localhost:3001/event-streaming/map-widget', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setWidgets(data);
    } catch (error) {
      console.error('Error fetching widgets:', error);
    }
  };

  const createWidget = async (
    title: string,
    theme?: string,
    showControls?: boolean,
    showLabels?: boolean,
    customCSS?: string
  ) => {
    try {
      const response = await fetch('http://localhost:3001/event-streaming/map-widget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, theme, showControls, showLabels, customCSS }),
      });
      const data = await response.json();
      setWidgets([data, ...widgets]);
      return data;
    } catch (error) {
      console.error('Error creating widget:', error);
      throw error;
    }
  };

  const updateWidget = async (id: string, updates: Partial<MapWidget>) => {
    try {
      const response = await fetch(`http://localhost:3001/event-streaming/map-widget/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      setWidgets(widgets.map((w) => (w.id === id ? data : w)));
      if (selectedWidget?.id === id) {
        setSelectedWidget(data);
      }
    } catch (error) {
      console.error('Error updating widget:', error);
    }
  };

  const selectWidget = async (id: string) => {
    const widget = widgets.find((w) => w.id === id);
    if (widget) {
      setSelectedWidget(widget);
      const code = `<iframe src="${window.location.origin}/widget/${widget.widgetId}" width="100%" height="400" frameborder="0"></iframe>`;
      setEmbedCode(code);
    }
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    alert('Embed code copied!');
  };

  useEffect(() => {
    fetchWidgets();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Embeddable Map Widget
      </h2>

      <div className="mb-6">
        <button
          onClick={() => {
            const title = prompt('Enter widget title:');
            if (title) {
              const theme = prompt('Enter theme (light/dark, optional):');
              const showControls = confirm('Show controls?');
              const showLabels = confirm('Show labels?');
              const customCSS = prompt('Enter custom CSS (optional):');
              createWidget(
                title,
                theme || undefined,
                showControls,
                showLabels,
                customCSS || undefined
              );
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Widget
        </button>
      </div>

      {selectedWidget && (
        <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg border border-indigo-200 dark:border-indigo-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-indigo-800 dark:text-indigo-200">
                {selectedWidget.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Widget ID: <span className="font-mono">{selectedWidget.widgetId}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Theme: {selectedWidget.theme}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Controls: {selectedWidget.showControls ? 'Enabled' : 'Disabled'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Labels: {selectedWidget.showLabels ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <button
              onClick={() => setSelectedWidget(null)}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
            >
              Close
            </button>
          </div>

          <div className="mb-4 p-4 bg-white dark:bg-gray-700 rounded">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Edit Widget
            </h4>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Title"
                defaultValue={selectedWidget.title}
                onBlur={(e) => updateWidget(selectedWidget.id, { title: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-600 dark:border-gray-500"
              />
              <select
                defaultValue={selectedWidget.theme}
                onBlur={(e) => updateWidget(selectedWidget.id, { theme: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-600 dark:border-gray-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  defaultChecked={selectedWidget.showControls}
                  onChange={(e) => updateWidget(selectedWidget.id, { showControls: e.target.checked })}
                />
                Show Controls
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  defaultChecked={selectedWidget.showLabels}
                  onChange={(e) => updateWidget(selectedWidget.id, { showLabels: e.target.checked })}
                />
                Show Labels
              </label>
              <textarea
                placeholder="Custom CSS"
                defaultValue={selectedWidget.customCSS || ''}
                onBlur={(e) => updateWidget(selectedWidget.id, { customCSS: e.target.value || undefined })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-600 dark:border-gray-500 font-mono text-sm"
                rows={5}
              />
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-gray-700 rounded">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Embed Code
            </h4>
            <textarea
              readOnly
              value={embedCode}
              className="w-full px-3 py-2 border rounded dark:bg-gray-600 dark:border-gray-500 font-mono text-sm"
              rows={3}
            />
            <button
              onClick={copyEmbedCode}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Copy Embed Code
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {widgets.map((widget) => (
          <div
            key={widget.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => selectWidget(widget.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {widget.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Widget ID: <span className="font-mono">{widget.widgetId}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Theme: {widget.theme}
                </p>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Updated: {new Date(widget.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
